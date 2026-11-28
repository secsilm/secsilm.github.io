/* Plot definitions shared with the offline checks. Plotly is served locally. */
(function (root, factory) {
  const api = factory(typeof module === 'object' && module.exports ? require('./core.js') : root.StarManager);
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.StarCharts = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, core => {
  'use strict';
  const text = value => String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const colors = ['#1764a0', '#b54724', '#7851a0'];
  const sequential = [[0, '#4e8dbb'], [.25, '#3577a6'], [.5, '#23618f'], [.75, '#174b73'], [1, '#0c3458']];
  const base = {
    paper_bgcolor: 'rgba(0,0,0,0)', plot_bgcolor: 'rgba(0,0,0,0)',
    font: {family: '-apple-system, PingFang SC, sans-serif', size: 11, color: '#243446'},
    hoverlabel: {bgcolor: '#fffdf7', bordercolor: '#8b95a1', font: {color: '#243446'}},
    modebar: {color: '#627285', activecolor: '#1764a0', bgcolor: '#f8f6ed'},
    margin: {l: 54, r: 24, t: 26, b: 72}, autosize: true, showlegend: false,
    xaxis: {automargin: true, gridcolor: '#d2d2c8', zerolinecolor: '#8b918e'},
    yaxis: {automargin: true, rangemode: 'tozero', gridcolor: '#d2d2c8', zerolinecolor: '#8b918e', title: {text: '收藏仓库数'}},
  };

  function timeline(repos, period) {
    const {buckets} = core.timeline(repos, period);
    const counts = buckets.map(([, count]) => count);
    return {
      data: [{type: 'scatter', mode: 'markers', x: buckets.map(([label]) => label), y: counts,
        marker: {size: 6, color: counts, colorscale: sequential, showscale: true, colorbar: {title: {text: '数量'}, thickness: 10, len: .8}},
        hovertemplate: '%{x}<br>收藏：%{y:,} 个<extra></extra>'}],
      layout: {...base, height: 380, margin: {...base.margin, r: 60, b: 60},
        xaxis: {...base.xaxis, type: 'date', title: {text: '收藏时间（UTC）'}, rangeslider: {visible: true, thickness: .12, bgcolor: '#e5e6de', bordercolor: '#a9b0b4'}},
        yaxis: {...base.yaxis, fixedrange: false}},
    };
  }

  function bars(repos, field, limit) {
    // pandas value_counts() in the original language plot excludes nulls.
    const entries = core.frequency(repos.filter(repo => field !== 'language' || repo.language !== '未标注'), field).slice(0, limit);
    const values = entries.map(([, count]) => count);
    const topics = field === 'topics';
    const labels = entries.map(([label]) => text(label));
    const max = Math.max(1, ...values);
    return {
      config: {displayModeBar: false},
      data: [{type: 'bar', orientation: 'h', x: values.map(() => max), y: labels, width: .22,
        marker: {color: '#e1e2d9'}, hoverinfo: 'skip'},
      {type: 'bar', orientation: 'h', x: values, y: labels, width: .22,
        marker: topics ? {color: values, colorscale: sequential, showscale: false} : {color: colors[0]},
        hovertemplate: '%{y}<br>仓库数：%{x:,}<extra></extra>'}],
      layout: {...base, height: Math.max(1, entries.length) * 24 + 12, margin: {l: 0, r: 0, t: 6, b: 6},
        barmode: 'overlay', barcornerradius: 3,
        xaxis: {visible: false, domain: [.34, .89], range: [0, max], fixedrange: true},
        yaxis: {visible: false, type: 'category', range: [entries.length - .5, -.5], fixedrange: true},
        annotations: entries.flatMap(([label, count], i) => [
          {xref: 'paper', x: 0, xanchor: 'left', yref: 'y', y: labels[i], showarrow: false,
            text: text(label.length > 17 ? `${label.slice(0, 16)}…` : label), hovertext: text(label), captureevents: true},
          {xref: 'paper', x: 1, xanchor: 'right', yref: 'y', y: labels[i], showarrow: false,
            text: count.toLocaleString('zh-CN'), font: {color: '#627285'}},
        ])},
    };
  }

  function sankey(repos) {
    const graph = core.sankey(repos);
    if (!graph.ready || !graph.links.length) return {graph, data: [], layout: {...base}};
    const color = owner => colors[graph.owners.indexOf(owner)];
    return {graph,
      data: [{type: 'sankey', orientation: 'h', arrangement: 'snap',
        node: {pad: 16, thickness: 17, line: {color: '#f8f6ed', width: .5},
          label: graph.nodes.map(node => text(node.label)),
          color: graph.nodes.map(node => node.owner ? color(node.owner) : node.type === 'issue' ? '#34495e' : '#697586'),
          hovertemplate: '%{label}<br>未关闭事项：%{value:,}<extra></extra>'},
        link: {source: graph.links.map(link => link.source), target: graph.links.map(link => link.target), value: graph.links.map(link => link.value),
          color: graph.links.map(link => ['rgba(23,100,160,.8)', 'rgba(181,71,36,.8)', 'rgba(120,81,160,.8)'][graph.owners.indexOf(link.owner)]), hovertemplate: '%{source.label} → %{target.label}<br>%{value:,} 个<extra></extra>'}}],
      layout: {...base, height: Math.max(800, graph.activeCount * 25 + 100), margin: {l: 25, r: 45, t: 30, b: 30}, font: {...base.font, size: 11}},
    };
  }

  return {timeline, bars, sankey};
});
