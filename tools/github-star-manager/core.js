/* Shared data and API logic; also loaded by the offline Node checks. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.StarManager = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, () => {
  'use strict';
  const CACHE_KEY = 'github-star-manager:v1';
  const CACHE_AGE = 60 * 60 * 1000;
  const validUsername = value => /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i.test(value);
  const date = value => typeof value === 'string' && Number.isFinite(Date.parse(value)) ? value : null;
  const count = value => Number.isSafeInteger(value) && value >= 0 ? value : 0;

  function normalize(item) {
    const repo = item.repo;
    if (!repo || repo.private || !Number.isSafeInteger(repo.id) || typeof repo.full_name !== 'string' || !/^[\w.-]+\/[\w.-]+$/.test(repo.full_name)) return null;
    return {
      id: repo.id, nodeId: typeof repo.node_id === 'string' ? repo.node_id : '',
      name: repo.full_name, owner: repo.full_name.split('/')[0],
      description: typeof repo.description === 'string' ? repo.description : '',
      language: typeof repo.language === 'string' ? repo.language : '未标注',
      topics: Array.isArray(repo.topics) ? [...new Set(repo.topics.filter(t => typeof t === 'string'))].slice(0, 20) : [],
      stars: count(repo.stargazers_count), archived: !!repo.archived,
      starredAt: date(item.starred_at), updatedAt: date(repo.updated_at),
      openCount: count(repo.open_issues_count), issues: null, prs: null,
    };
  }

  function select(repos, {query = '', language = '', state = '', sort = 'starred'} = {}) {
    const words = query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
    const result = repos.filter(repo => (!language || repo.language === language)
      && (!state || (state === 'archived' ? repo.archived : !repo.archived))
      && words.every(word => [repo.name, repo.description, ...repo.topics].join(' ').toLocaleLowerCase().includes(word)));
    const time = value => Date.parse(value) || 0;
    const comparators = {
      starred: (a, b) => time(b.starredAt) - time(a.starredAt),
      oldest: (a, b) => time(a.starredAt) - time(b.starredAt),
      stars: (a, b) => b.stars - a.stars,
      updated: (a, b) => time(b.updatedAt) - time(a.updatedAt),
      name: (a, b) => a.name.localeCompare(b.name),
    };
    return result.sort((a, b) => (comparators[sort] || comparators.starred)(a, b) || a.name.localeCompare(b.name));
  }

  function frequency(repos, field) {
    const counts = new Map();
    for (const repo of repos) {
      for (const value of Array.isArray(repo[field]) ? repo[field] : [repo[field]]) {
        counts.set(value, (counts.get(value) || 0) + 1);
      }
    }
    return [...counts].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  }

  // Match the original chart: include the complete history and zero buckets.
  function timeline(repos, period = 'day', limit = Infinity) {
    const length = {day: 10, month: 7, year: 4}[period] || 7;
    const counts = new Map();
    for (const repo of repos) {
      if (!date(repo.starredAt)) continue;
      const key = new Date(repo.starredAt).toISOString().slice(0, length);
      counts.set(key, (counts.get(key) || 0) + 1);
    }
    const keys = [...counts.keys()].sort();
    if (!keys.length) return {buckets: [], truncated: false};
    const cursor = new Date(`${keys.at(-1)}${length === 4 ? '-01-01' : length === 7 ? '-01' : ''}T00:00:00Z`);
    const buckets = [];
    while (buckets.length < limit) {
      const key = cursor.toISOString().slice(0, length);
      if (key < keys[0]) break;
      buckets.unshift([key, counts.get(key) || 0]);
      if (length === 10) cursor.setUTCDate(cursor.getUTCDate() - 1);
      else if (length === 7) cursor.setUTCMonth(cursor.getUTCMonth() - 1);
      else cursor.setUTCFullYear(cursor.getUTCFullYear() - 1);
    }
    return {buckets, truncated: buckets[0][0] > keys[0]};
  }

  function sankey(repos) {
    const owners = new Map();
    for (const repo of repos) {
      const stat = owners.get(repo.owner) || {name: repo.owner, count: 0, open: 0};
      stat.count += 1;
      stat.open += Number.isSafeInteger(repo.issues) && Number.isSafeInteger(repo.prs) ? repo.issues + repo.prs : repo.openCount;
      owners.set(repo.owner, stat);
    }
    // Same ranking as get_top_owners in the Python app: repository count,
    // then unclosed Issue + PR count. Full names keep same-name repos distinct.
    const top = [...owners.values()].sort((a, b) => b.count - a.count || b.open - a.open || a.name.localeCompare(b.name)).slice(0, 3).map(owner => owner.name);
    const selected = repos.filter(repo => top.includes(repo.owner));
    const ready = selected.every(repo => Number.isSafeInteger(repo.issues) && Number.isSafeInteger(repo.prs));
    if (!ready) return {ready, owners: top, nodes: [], links: [], repoCount: selected.length};
    const active = selected.filter(repo => repo.issues + repo.prs > 0);
    const nodes = top.filter(owner => active.some(repo => repo.owner === owner)).map(owner => ({id: `owner:${owner}`, label: owner, type: 'owner', owner}));
    nodes.push(...active.map(repo => ({id: `repo:${repo.name}`, label: repo.name, type: 'repo', owner: repo.owner})));
    nodes.push({id: 'issue', label: 'Issue', type: 'issue'}, {id: 'pr', label: 'PR', type: 'pr'});
    const index = new Map(nodes.map((node, i) => [node.id, i]));
    const links = [];
    for (const repo of active) {
      const source = index.get(`repo:${repo.name}`);
      links.push({source: index.get(`owner:${repo.owner}`), target: source, value: repo.issues + repo.prs, owner: repo.owner});
      if (repo.issues) links.push({source, target: index.get('issue'), value: repo.issues, owner: repo.owner});
      if (repo.prs) links.push({source, target: index.get('pr'), value: repo.prs, owner: repo.owner});
    }
    return {ready, owners: top, nodes, links, repoCount: selected.length, activeCount: active.length};
  }

  function errorMessage(response) {
    if (response.status === 404) return '找不到该用户，或该用户的收藏不可访问。';
    if (response.status === 401) return 'Token 无效或已过期，请更换 Token 或清空后匿名查询。';
    if ([403, 429].includes(response.status)) {
      const reset = Number(response.headers.get('x-ratelimit-reset'));
      const retry = response.headers.get('retry-after');
      const hint = reset > 0 ? `可在 ${new Date(reset * 1000).toLocaleTimeString('zh-CN')} 后重试。` : retry ? `请在 ${retry} 秒后重试。` : '请稍后重试，或使用具有读取权限的 Token。';
      return `GitHub 请求受限（额度不足、访问限制或权限不足）。${hint}`;
    }
    return `GitHub 请求失败（HTTP ${response.status}），请稍后重试。`;
  }

  async function request(fetcher, url, options, signal) {
    const timeout = new AbortController();
    const abort = () => timeout.abort();
    if (signal?.aborted) timeout.abort();
    signal?.addEventListener('abort', abort, {once: true});
    const timer = setTimeout(abort, 30000);
    try {
      const response = await fetcher(url, {...options, signal: timeout.signal, credentials: 'omit', referrerPolicy: 'no-referrer'});
      if (!response.ok) throw new Error(errorMessage(response));
      return {response, body: await response.json()};
    } catch (error) {
      if (signal?.aborted) throw new DOMException('查询已取消', 'AbortError');
      if (timeout.signal.aborted) throw new Error('连接 GitHub 超时，请重试。');
      if (error instanceof TypeError) throw new Error('无法连接 GitHub，请检查网络后重试。');
      throw error;
    } finally {
      clearTimeout(timer);
      signal?.removeEventListener('abort', abort);
    }
  }

  async function load(username, {token = '', detailed = false, signal, onProgress = () => {}, fetcher = globalThis.fetch} = {}) {
    if (!validUsername(username)) throw new Error('请输入有效的 GitHub 用户名（字母、数字及单个连字符，最多 39 位）。');
    if (detailed && !token) throw new Error('分别统计 Issue / PR 需要 Token，请填写 Token 或取消勾选。');
    const headers = {Accept: 'application/vnd.github.star+json'};
    if (token) headers.Authorization = `Bearer ${token}`;
    const repos = new Map();
    for (let page = 1; ; page += 1) {
      const {body} = await request(fetcher, `https://api.github.com/users/${encodeURIComponent(username)}/starred?per_page=100&page=${page}&sort=created&direction=desc`, {headers}, signal);
      if (!Array.isArray(body)) throw new Error('GitHub 返回的数据格式不正确，请重试。');
      for (const item of body) {
        const repo = normalize(item);
        if (repo) repos.set(repo.id, repo);
      }
      onProgress(`正在读取第 ${page} 页，已获取 ${repos.size.toLocaleString()} 个公开收藏…`);
      if (body.length < 100) break;
      if (page >= 1000) throw new Error('收藏数量超过单次查询上限，请缩小查询范围。');
    }
    const result = detailed ? await enrich([...repos.values()], {token, signal, onProgress, fetcher}) : [...repos.values()];
    if (signal?.aborted) throw new DOMException('查询已取消', 'AbortError');
    return result;
  }

  async function enrich(repos, {token = '', signal, onProgress = () => {}, fetcher = globalThis.fetch} = {}) {
    if (!token) throw new Error('分别统计 Issue / PR 需要 Token，请先填写 Token。');
    const result = repos.map(repo => ({...repo}));
    const query = 'query($ids: [ID!]!) { nodes(ids: $ids) { ... on Repository { id isPrivate issues(states: OPEN) { totalCount } pullRequests(states: OPEN) { totalCount } } } }';
    for (let offset = 0; offset < result.length; offset += 50) {
      const batch = result.slice(offset, offset + 50);
      const {body} = await request(fetcher, 'https://api.github.com/graphql', {
        method: 'POST', headers: {Authorization: `Bearer ${token}`, 'Content-Type': 'application/json'},
        body: JSON.stringify({query, variables: {ids: batch.map(repo => repo.nodeId)}}),
      }, signal);
      if (body.errors?.length || !Array.isArray(body.data?.nodes)) throw new Error('无法读取 Issue / PR 详情，请检查 Token 权限及额度，或取消勾选后重试。');
      const nodes = new Map(body.data.nodes.filter(node => node && !node.isPrivate).map(node => [node.id, node]));
      for (const repo of batch) {
        const node = nodes.get(repo.nodeId);
        if (!node || !Number.isSafeInteger(node.issues?.totalCount) || !Number.isSafeInteger(node.pullRequests?.totalCount)) throw new Error('部分仓库的 Issue / PR 详情不可访问，请取消勾选后重试。');
        repo.issues = count(node.issues.totalCount);
        repo.prs = count(node.pullRequests.totalCount);
      }
      onProgress(`正在读取 Issue / PR 详情：${Math.min(offset + 50, result.length)} / ${result.length}…`);
    }
    if (signal?.aborted) throw new DOMException('查询已取消', 'AbortError');
    return result;
  }

  function readCache(storage) {
    try {
      const value = JSON.parse(storage.getItem(CACHE_KEY));
      if (value?.version !== 1 || !validUsername(value.username) || !Number.isFinite(value.savedAt) || value.savedAt > Date.now() || !Array.isArray(value.repos)) return null;
      const valid = value.repos.every(repo => repo && Number.isSafeInteger(repo.id) && typeof repo.nodeId === 'string' && /^[\w.-]+\/[\w.-]+$/.test(repo.name) && typeof repo.owner === 'string' && typeof repo.description === 'string' && typeof repo.language === 'string' && Array.isArray(repo.topics) && repo.topics.every(t => typeof t === 'string') && Number.isSafeInteger(repo.stars) && repo.stars >= 0 && Number.isSafeInteger(repo.openCount) && repo.openCount >= 0 && [repo.issues, repo.prs].every(n => n === null || (Number.isSafeInteger(n) && n >= 0)) && typeof repo.archived === 'boolean' && (repo.starredAt === null || !!date(repo.starredAt)) && (repo.updatedAt === null || !!date(repo.updatedAt)));
      return valid ? {...snapshot(value.username, value.repos, value.detailed === true), savedAt: value.savedAt} : null;
    } catch { return null; }
  }

  // Whitelist stored fields; authentication is never part of a snapshot.
  function snapshot(username, repos, detailed = false) {
    const fields = ['id', 'nodeId', 'name', 'owner', 'description', 'language', 'topics', 'stars', 'archived', 'starredAt', 'updatedAt', 'openCount', 'issues', 'prs'];
    return {version: 1, username, savedAt: Date.now(), detailed, repos: repos.map(repo => Object.fromEntries(fields.map(field => [field, repo[field]])))};
  }

  return {CACHE_KEY, CACHE_AGE, validUsername, normalize, select, frequency, timeline, sankey, load, enrich, readCache, snapshot};
});
