(() => {
  'use strict';
  const core = window.StarManager;
  const $ = id => document.getElementById(id);
  const number = value => value.toLocaleString('zh-CN');
  const displayDate = value => value ? new Date(value).toISOString().slice(0, 10) : '未知';
  const PAGE_SIZE = 20;
  let current = null;
  let controller = null;
  let page = 1;
  const chartWidths = new WeakMap();
  const chartResize = new ResizeObserver(entries => {
    for (const {target} of entries) {
      const width = target.clientWidth;
      if (!width || chartWidths.get(target) === width || !target.classList.contains('js-plotly-plot')) continue;
      chartWidths.set(target, width);
      Plotly.relayout(target, {width}).catch(() => {});
    }
  });

  function element(tag, text, className) {
    const node = document.createElement(tag);
    if (text !== undefined) node.textContent = text;
    if (className) node.className = className;
    return node;
  }

  function status(message, error = false) {
    $('status').textContent = message;
    $('status').dataset.error = String(error);
  }

  function readCache() {
    try { return core.readCache(window.localStorage); } catch { return null; }
  }

  function saveCache(value) {
    try { localStorage.setItem(core.CACHE_KEY, JSON.stringify(value)); return true; } catch { return false; }
  }

  function busy(value) {
    $('submit').disabled = value;
    $('refresh').disabled = value;
    $('username').disabled = value;
    $('token').disabled = value;
    $('details').disabled = value;
    $('load-details').disabled = value;
    $('cancel').hidden = !value;
    $('progress').hidden = !value;
    $('results').setAttribute('aria-busy', String(value));
  }

  function plot(id, figure) {
    const node = $(id);
    if (!window.Plotly) {
      node.textContent = '图表组件加载失败，请刷新页面重试。';
      return;
    }
    if (!figure.data.some(trace => trace.x?.length || trace.type === 'sankey')) {
      Plotly.purge(node);
      node.replaceChildren(element('p', '暂无数据', 'hint'));
      return;
    }
    const width = node.clientWidth;
    Plotly.react(node, figure.data, {...figure.layout, width}, {
      responsive: true, displaylogo: false, scrollZoom: false,
      modeBarButtonsToRemove: ['lasso2d', 'select2d', 'sendChartToCloud'],
      toImageButtonOptions: {format: 'png', filename: `github-stars-${id}`, scale: 2},
      ...figure.config,
    }).then(() => {
      chartWidths.set(node, width);
      chartResize.observe(node);
    }).catch(() => { node.textContent = '图表绘制失败，请刷新页面重试。'; });
  }

  function renderTimeline() {
    const period = $('period').value;
    const {buckets} = core.timeline(current.repos, period);
    plot('timeline', window.StarCharts.timeline(current.repos, period));
    $('timeline-note').textContent = buckets.length ? `${buckets[0][0]} — ${buckets.at(-1)[0]} · 完整历史 · 拖动选择区域或下方滑块缩放，双击还原` : '暂无收藏时间数据';
  }

  function renderSankey() {
    const figure = window.StarCharts.sankey(current.repos);
    const {graph} = figure;
    $('load-details').hidden = graph.ready;
    $('sankey-scroll').hidden = !graph.ready || !graph.links.length;
    if (!graph.ready) {
      if (window.Plotly) Plotly.purge($('sankey-chart'));
      $('sankey-note').textContent = '此图需要独立的 Issue / PR 数量。请展开上方 Token 选项填写自己的 Token，再点击“加载图表详情”；匿名 API 仅提供两者合计，无法据此绘制完整桑基图。';
      return;
    }
    $('sankey-note').textContent = graph.links.length
      ? `作者 → 仓库 → Issue / PR · Top ${graph.owners.length} 作者按收藏仓库数排名，同数按未关闭事项数排名 · ${graph.repoCount} 个仓库，${graph.activeCount} 个有未关闭事项 · 手机可横向滚动`
      : '所选作者的仓库均无未关闭的 Issue / PR，暂无可绘制的流线。';
    if (graph.links.length) plot('sankey-chart', figure);
  }

  function renderStats() {
    const repos = current.repos;
    const languages = core.frequency(repos, 'language');
    $('total').textContent = number(repos.length);
    $('languages-total').textContent = number(languages.filter(([language]) => language !== '未标注').length);
    $('owners-total').textContent = number(core.frequency(repos, 'owner').length);
    $('archived-total').textContent = number(repos.filter(repo => repo.archived).length);
    plot('owner-chart', window.StarCharts.bars(repos, 'owner', 5));
    plot('language-chart', window.StarCharts.bars(repos, 'language', 5));
    plot('topic-chart', window.StarCharts.bars(repos, 'topics', 10));
    renderTimeline();
    renderSankey();
  }

  async function loadDetails() {
    if (controller || !current) return;
    const token = $('token').value.trim();
    if (!token) {
      document.querySelector('.token-options').open = true;
      $('token').focus();
      status('请填写自己的 GitHub Token，再点击“加载图表详情”。', true);
      return;
    }
    const previous = current;
    controller = new AbortController();
    busy(true);
    status('正在补充 Issue / PR 详情，保留已有收藏列表…');
    try {
      const repos = await core.enrich(previous.repos, {token, signal: controller.signal, onProgress: status});
      const value = core.snapshot(previous.username, repos, true);
      // The list timestamp records when the list was fetched, not enrichment.
      value.savedAt = previous.savedAt;
      const cached = saveCache(value);
      current = value;
      renderSankey();
      renderList();
      status(`Issue / PR 详情已加载，桑基图已更新。${cached ? '' : '浏览器缓存不可用，当前结果仍可浏览和导出。'}`);
    } catch (error) {
      status(`${error.name === 'AbortError' ? '详情加载已取消。' : error.message} 已保留上次完整结果。`, error.name !== 'AbortError');
    } finally {
      controller = null;
      busy(false);
    }
  }

  function repoCard(repo) {
    const card = element('article', undefined, 'repo');
    const content = element('div');
    const heading = element('h3');
    const link = element('a', repo.name);
    link.href = `https://github.com/${repo.name}`;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    heading.append(link);
    if (repo.archived) heading.append(element('span', '已归档', 'archive-badge'));
    content.append(heading, element('p', repo.description || '这个仓库还没有描述。', 'description'));
    const meta = element('div', undefined, 'repo-meta');
    const items = [repo.language, `收藏于 ${displayDate(repo.starredAt)}`, `更新于 ${displayDate(repo.updatedAt)}`];
    if (Number.isSafeInteger(repo.issues) && Number.isSafeInteger(repo.prs)) items.push(`Issue ${number(repo.issues)}`, `PR ${number(repo.prs)}`);
    else items.push(`未关闭事项 ${number(repo.openCount)}（含 PR）`);
    items.forEach(item => meta.append(element('span', item)));
    content.append(meta);
    if (repo.topics.length) {
      const topics = element('div', undefined, 'repo-topics');
      repo.topics.slice(0, 5).forEach(topic => topics.append(element('span', topic)));
      content.append(topics);
    }
    const stars = element('span', `☆ ${number(repo.stars)}`, 'repo-stars');
    stars.setAttribute('aria-label', `${number(repo.stars)} 个 Star`);
    card.append(content, stars);
    return card;
  }

  function renderList() {
    if (!current) return;
    const filtered = core.select(current.repos, {query: $('search').value, language: $('language').value, state: $('state').value, sort: $('sort').value});
    const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    page = Math.min(page, pages);
    $('repos').replaceChildren(...filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE).map(repoCard));
    $('match-count').textContent = `${number(filtered.length)} / ${number(current.repos.length)} 个收藏`;
    $('empty').hidden = filtered.length > 0;
    $('empty').textContent = current.repos.length ? '没有匹配的收藏，试试其他筛选条件。' : '这位用户暂时没有公开收藏。';
    $('page').textContent = `第 ${page} / ${pages} 页`;
    $('previous').disabled = page === 1;
    $('next').disabled = page === pages;
  }

  function resetFilters() {
    $('search').value = '';
    $('language').value = '';
    $('state').value = '';
    $('sort').value = 'starred';
    page = 1;
    renderList();
  }

  function show(value) {
    current = value;
    $('results').hidden = false;
    $('welcome').hidden = true;
    $('refresh').hidden = false;
    $('account').textContent = `@${value.username} 的开源书架`;
    $('language').replaceChildren(new Option('全部语言', ''));
    for (const [language] of core.frequency(value.repos, 'language')) $('language').add(new Option(language, language));
    resetFilters();
    renderStats();
  }

  async function query(force = false) {
    if (controller) return;
    const username = $('username').value.trim();
    const token = $('token').value.trim();
    const detailed = $('details').checked;
    if (!core.validUsername(username)) { status('请输入有效的 GitHub 用户名（字母、数字及单个连字符，最多 39 位）。', true); return; }
    if (detailed && !token) { status('分别统计 Issue / PR 需要 Token，请填写 Token 或取消勾选。', true); return; }
    const cache = !force && readCache();
    if (cache && cache.username.toLowerCase() === username.toLowerCase() && Date.now() - cache.savedAt < core.CACHE_AGE && (!detailed || cache.detailed)) {
      show(cache);
      status(`已使用本地缓存 · ${new Date(cache.savedAt).toLocaleString('zh-CN')}。可点击“刷新数据”重新查询。`);
      return;
    }
    controller = new AbortController();
    busy(true);
    status(`正在读取 @${username} 的公开收藏…`);
    try {
      const repos = await core.load(username, {token, detailed, signal: controller.signal, onProgress: status});
      const value = core.snapshot(username, repos, detailed);
      const cached = saveCache(value);
      show(value);
      status(`已完整加载 ${number(repos.length)} 个公开收藏 · ${new Date(value.savedAt).toLocaleString('zh-CN')}${cached ? '' : ' · 浏览器缓存不可用，本次结果仍可浏览和导出'}`);
    } catch (error) {
      const suffix = current ? ` 当前仍显示 @${current.username} 上次完整加载的结果。` : '';
      status(`${error.name === 'AbortError' ? '查询已取消。' : error.message}${suffix}`, error.name !== 'AbortError');
    } finally {
      controller = null;
      busy(false);
    }
  }

  $('query-form').addEventListener('submit', event => { event.preventDefault(); query(); });
  $('refresh').addEventListener('click', () => query(true));
  $('load-details').addEventListener('click', loadDetails);
  $('cancel').addEventListener('click', () => controller?.abort());
  $('period').addEventListener('change', () => current && renderTimeline());
  for (const id of ['search', 'language', 'state', 'sort']) $(id).addEventListener(id === 'search' ? 'input' : 'change', () => { page = 1; renderList(); });
  $('reset').addEventListener('click', resetFilters);
  for (const [id, step] of [['previous', -1], ['next', 1]]) $(id).addEventListener('click', () => {
    page += step;
    renderList();
    document.querySelector('.list-heading').scrollIntoView({block: 'start'});
  });
  $('export').addEventListener('click', () => {
    if (!current) return;
    const blob = new Blob([JSON.stringify(current, null, 2)], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const link = element('a');
    link.href = url;
    link.download = `${current.username}-github-stars.json`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
  $('clear-cache').addEventListener('click', () => {
    try { localStorage.removeItem(core.CACHE_KEY); status('本地缓存已清除，当前页面结果仍可浏览。'); }
    catch { status('浏览器未允许访问本地缓存。', true); }
  });
  window.addEventListener('pagehide', () => { $('token').value = ''; controller?.abort(); });
  const cache = readCache();
  if (cache) {
    $('username').value = cache.username;
    show(cache);
    status(`显示上次完整查询的本地缓存 · ${new Date(cache.savedAt).toLocaleString('zh-CN')}。${Date.now() - cache.savedAt >= core.CACHE_AGE ? '缓存已超过 1 小时，请刷新获取最新数据。' : '点击“刷新数据”可更新。'}`);
  }
})();
