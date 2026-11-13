(() => {
  const $ = id => document.getElementById(id);
  const first = $('suffix-one'), second = $('suffix-two'), search = $('search');
  const message = $('map-message');
  const colors = ['#387b74', '#b45b3e'];
  let map, points, layer, boundaryBounds, tiles;

  function showMessage(text, retry) {
    message.replaceChildren(document.createTextNode(text));
    if (retry) {
      const button = document.createElement('button');
      button.textContent = '重新加载';
      button.addEventListener('click', () => location.reload());
      message.append(button);
    }
    message.hidden = false;
  }

  function render(fit = false) {
    if (first.value === 'all') second.value = '';
    if (second.value === first.value) second.value = '';
    second.disabled = first.value === 'all';
    for (const option of second.options) option.disabled = option.value !== '' && option.value === first.value;
    const selected = VillageFilters.select(points, first.value, second.value, search.value);
    layer.clearLayers();
    for (const [name, suffix, lng, lat] of selected) {
      const color = first.value !== 'all' && suffix === second.value ? colors[1] : colors[0];
      const content = document.createElement('div');
      const title = document.createElement('strong');
      title.textContent = name;
      const detail = document.createElement('div');
      detail.textContent = `后缀：${suffix}`;
      content.append(title, detail);
      L.circleMarker([lat, lng], {radius: 3.5, stroke: true, weight: .5, color, fillColor: color, fillOpacity: .75})
        .bindPopup(content).addTo(layer);
    }
    $('summary').replaceChildren();
    const total = document.createElement('strong');
    total.textContent = selected.length.toLocaleString('zh-CN');
    $('summary').append(total, document.createTextNode('条地名记录'));
    $('legend').replaceChildren();
    const entries = first.value === 'all' ? [['全部', selected.length]]
      : [first.value, second.value].filter(Boolean).map(s => [s, selected.filter(p => p[1] === s).length]);
    entries.forEach(([name, count], i) => {
      const item = document.createElement('span'), dot = document.createElement('i');
      dot.style.background = colors[i];
      item.append(dot, document.createTextNode(`${name} · ${count.toLocaleString('zh-CN')}`));
      $('legend').append(item);
    });
    $('empty').hidden = selected.length > 0;
    $('fit').disabled = selected.length === 0;
    for (const button of $('quick-suffixes').children) {
      button.setAttribute('aria-pressed', String(button.dataset.suffix === first.value || button.dataset.suffix === second.value));
    }
    if (fit && selected.length) {
      map.fitBounds(L.latLngBounds(selected.map(p => [p[3], p[2]])), {padding: [24, 24], maxZoom: 14});
    }
  }

  async function loadJSON(path) {
    const response = await fetch(path);
    if (!response.ok) throw new Error(`HTTP ${response.status}: ${path}`);
    return response.json();
  }

  async function init() {
    try {
      if (!window.L || !window.VillageFilters) throw new Error('地图组件未加载');
      const [data, districts] = await Promise.all([loadJSON('./data.json'), loadJSON('./districts.json')]);
      if (data.coordinateSystem !== 'WGS84' || !Array.isArray(data.points) || !data.points.length) throw new Error('地名数据格式错误');
      points = data.points;
      map = L.map('map', {preferCanvas: true, minZoom: 7, maxZoom: 18, zoomSnap: .25, zoomDelta: .5, scrollWheelZoom: true});
      map.attributionControl.addAttribution('DataV GeoAtlas');
      const boundary = L.geoJSON(districts, {style: {color: '#87947c', weight: 1, fillColor: '#f6f4e8', fillOpacity: .48}, interactive: false}).addTo(map);
      boundaryBounds = boundary.getBounds();
      map.fitBounds(boundaryBounds, {padding: [20, 20]});
      map.createPane('districtLabels');
      map.getPane('districtLabels').style.zIndex = 450;
      map.getPane('districtLabels').style.pointerEvents = 'none';
      for (const feature of districts.features) {
        const name = document.createElement('span');
        name.textContent = feature.properties.name;
        const [lng, lat] = feature.properties.centroid;
        L.marker([lat, lng], {pane: 'districtLabels', interactive: false, keyboard: false,
          icon: L.divIcon({className: 'district-label', html: name, iconSize: [60, 18], iconAnchor: [30, 9]})}).addTo(map);
      }
      layer = L.layerGroup().addTo(map);
      const counts = VillageFilters.suffixCounts(points);
      for (const [suffix, count] of counts) {
        first.add(new Option(`${suffix}（${count}）`, suffix));
        second.add(new Option(`${suffix}（${count}）`, suffix));
      }
      for (const [suffix] of counts.slice(0, 8)) {
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = suffix;
        button.dataset.suffix = suffix;
        button.addEventListener('click', () => { first.value = suffix; render(); });
        $('quick-suffixes').append(button);
      }
      first.disabled = search.disabled = $('reset').disabled = $('streets').disabled = false;
      first.addEventListener('change', () => render());
      second.addEventListener('change', () => render());
      search.addEventListener('input', () => render());
      $('fit').addEventListener('click', () => render(true));
      $('reset').addEventListener('click', () => {
        first.value = 'all'; second.value = ''; search.value = ''; render();
        map.fitBounds(boundaryBounds, {padding: [20, 20]});
      });
      $('streets').addEventListener('change', () => {
        message.hidden = true;
        if (!$('streets').checked) { if (tiles) map.removeLayer(tiles); return; }
        if (!tiles) {
          tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          });
          tiles.on('tileerror', () => {
            if (!$('streets').checked) return;
            map.removeLayer(tiles); $('streets').checked = false;
            showMessage('街道底图暂时无法加载，已切回行政区底图。地名筛选仍可使用。');
          });
        }
        tiles.addTo(map);
      });
      let previousWidth;
      new ResizeObserver(([entry]) => {
        map.invalidateSize();
        if (entry.contentRect.width !== previousWidth) {
          previousWidth = entry.contentRect.width;
          map.fitBounds(boundaryBounds, {padding: [20, 20], animate: false});
        }
      }).observe($('map'));
      render();
    } catch (error) {
      console.error(error);
      $('summary').textContent = '地名数据加载失败';
      showMessage('地图暂时无法加载，请检查网络后重试。', true);
    }
  }
  init();
})();
