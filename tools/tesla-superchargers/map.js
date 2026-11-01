'use strict';
(async () => {
  const $ = id => document.getElementById(id);
  const text = (tag, value) => {const el=document.createElement(tag);el.textContent=value;return el;};
  const versionNames={v2:'V2',v3:'V3',v4:'V4',urban:'城市超充',other:'其他'};
  const parkingNames={above:'地上',below:'地下',unknown:'未知'};
  let stations=[],filtered=[],map,cluster;const markers=new Map();
  function popup(s){
    const box=document.createElement('section');box.className='station-popup';box.append(text('h2',s.name),text('p',`${s.province} · ${s.city}`),text('p',s.address||'地址未知'));
    const dl=document.createElement('dl');
    const hardware=Object.entries(s.stalls||{}).filter(([,n])=>n>0).map(([key,n])=>`${versionNames[key]||key.toUpperCase()}：${n} 个`).join(' / ');
    const stallCount=(s.stallCount==null?'未知':`${s.stallCount} 个`)+(hardware?`（${hardware}）`:'');
    for(const [key,value] of [['充电桩',stallCount],['最高功率',s.powerKilowatt==null?'未知':`${s.powerKilowatt} 千瓦`],['开放日期',s.dateOpened||'未知'],['营业时间',s.hours||'未知']])dl.append(text('dt',key),text('dd',value));
    box.append(dl);
    if(s.teslaUrl){const a=text('a','特斯拉官方详情 ↗');a.href=s.teslaUrl;a.target='_blank';a.rel='noopener noreferrer';box.append(a);}
    for(const [key,value] of [['通行说明',s.accessNotes],['地址说明',s.addressNotes]])if(value)box.append(text('p',`${key}：${value}`));
    return box;
  }
  function focus(s){const marker=markers.get(s.id);if(map&&marker)cluster.zoomToShowLayer(marker,()=>{map.setView(marker.getLatLng(),Math.max(map.getZoom(),13),{animate:false});marker.openPopup();if(window.innerWidth<=760)$('map').scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});});}
  function fit(){if(map&&filtered.length)map.fitBounds(L.latLngBounds(filtered.map(s=>[s.latitude,s.longitude])),{padding:[28,28],maxZoom:13});}
  function renderFilterOptions(result){
    for(const key of SuperchargerFilters.keys){
      const select=$(key);select.replaceChildren(new Option('全部',''));
      const values=result.options[key];
      if(key==='parking'){
        for(const position of ['above','below']){
          if(!values.includes(position))continue;
          const group=document.createElement('optgroup');group.label=parkingNames[position];group.append(new Option('全部',position));
          const floors=values.filter(v=>v.startsWith(position+':')&&v!==position+':unknown').map(v=>Number(v.split(':')[1])).sort((a,b)=>a-b);
          for(const floor of floors)group.append(new Option(position==='below'?`B${floor}`:`${floor} 层`,`${position}:${floor}`));
          if(values.includes(position+':unknown'))group.append(new Option('未知',position+':unknown'));
          select.append(group);
        }
        if(values.includes('unknown'))select.add(new Option('未知','unknown'));
      }else{
        const ordered=key==='version'?values.sort((a,b)=>['v2','v3','v4','urban','other','unknown'].indexOf(a)-['v2','v3','v4','urban','other','unknown'].indexOf(b)):values;
        for(const value of ordered)select.add(new Option(key==='version'?(versionNames[value]||(value==='unknown'?'未知':value.toUpperCase())):value,value));
      }
      select.value=result.filters[key];
    }
  }
  function applyFilters(changedKey){
    const desired=Object.fromEntries(['search',...SuperchargerFilters.keys].map(key=>[key,$(key).value]));
    const result=SuperchargerFilters.resolve(stations,desired,changedKey);
    renderFilterOptions(result);filtered=result.stations;
    $('summary').replaceChildren(text('strong',filtered.length.toLocaleString('zh-CN')),document.createTextNode(`座开放站点 · ${filtered.reduce((n,s)=>n+(Number(s.stallCount)||0),0).toLocaleString('zh-CN')} 个桩`));
    $('station').replaceChildren(new Option(filtered.length?'在地图上点选或从这里选择':'没有匹配的站点',''));
    const fragment=document.createDocumentFragment();filtered.forEach(s=>fragment.append(new Option(s.name,s.id)));$('station').append(fragment);
    if(cluster){map.closePopup();cluster.clearLayers();cluster.addLayers(filtered.map(s=>markers.get(s.id)));}
    $('result-hint').textContent=filtered.length?'':'没有匹配的站点，试试其他条件或重置筛选。';$('result-hint').hidden=filtered.length>0;fit();
  }
  try{
    const response=await fetch('./data.json',{cache:'no-cache'});if(!response.ok)throw new Error(`数据请求失败（${response.status}）`);
    const data=await response.json();if(!Array.isArray(data.stations))throw new Error('数据格式无效');
    stations=data.stations.filter(s=>['OPEN','OPEN_LIMITED_HOURS'].includes(s.status)).map(s=>({...s,parkingLocation:parkingNames[s.parkingLocation]?s.parkingLocation:'unknown'}));if(!stations.length)throw new Error('没有开放站点数据');
    stations.sort((a,b)=>a.name.localeCompare(b.name,'zh-CN'));
    $('updated').textContent='更新时间：'+new Intl.DateTimeFormat('zh-CN',{timeZone:'Asia/Shanghai',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date(data.updatedAt))+'（北京时间）';
    if(Date.now()-Date.parse(data.updatedAt)>48*3600000){const p=text('p','数据距今已超过两天，请注意更新时间。');p.className='notice';$('updated').after(p);}
    if(typeof L!=='undefined'&&typeof L.markerClusterGroup==='function'){
      map=L.map('map',{minZoom:3,maxZoom:18}).setView([35.5,104],4);
      map.createPane('fallback');map.getPane('fallback').style.zIndex=199;
      fetch('./china.json').then(r=>{if(!r.ok)throw new Error('行政区底图加载失败');return r.json();}).then(geometry=>L.geoJSON(geometry,{pane:'fallback',interactive:false,style:{color:'#b6bac0',weight:1,fillColor:'#f4f4f4',fillOpacity:1}}).addTo(map)).catch(error=>console.warn(error));
      const tiles=L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(map);
      let tileErrors=0,tileLoaded=false;tiles.on('tileerror',()=>{if(++tileErrors>=3&&!tileLoaded)$('tile-warning').hidden=false;});tiles.on('tileload',()=>{tileLoaded=true;$('tile-warning').hidden=true;});setTimeout(()=>{if(!tileLoaded)$('tile-warning').hidden=false;},7000);
      L.control.scale({imperial:false}).addTo(map);
      cluster=L.markerClusterGroup({maxClusterRadius:45,showCoverageOnHover:false,iconCreateFunction:c=>L.divIcon({className:'cluster',html:`<span>${c.getChildCount()}</span>`,iconSize:[44,44]})});map.addLayer(cluster);
      stations.forEach(s=>{const marker=L.marker([s.latitude,s.longitude],{title:s.name,alt:s.name,icon:L.divIcon({className:'',html:'<span class="site-dot"></span>',iconSize:[16,16],iconAnchor:[8,8]})});marker.bindPopup(()=>popup(s),{maxWidth:380,minWidth:220,maxHeight:Math.min(440,Math.max(160,map.getSize().y-140)),autoPanPaddingTopLeft:[12,80],autoPanPaddingBottomRight:[12,16]});marker.on('click',()=>{$('station').value=String(s.id);});markers.set(s.id,marker);});
    }else{$('tile-warning').textContent='地图组件暂时无法加载，请稍后刷新重试。';$('tile-warning').hidden=false;}
    for(const key of SuperchargerFilters.keys)$(key).addEventListener('change',()=>applyFilters(key));
    let debounce;$('search').addEventListener('input',()=>{clearTimeout(debounce);debounce=setTimeout(()=>applyFilters('search'),180);});
    $('station').addEventListener('change',()=>{const s=filtered.find(s=>s.id===Number($('station').value));if(s)focus(s);});
    $('fit').addEventListener('click',fit);$('reset').addEventListener('click',()=>{for(const id of ['search','province','city','version','parking'])$(id).value='';applyFilters();});applyFilters();
  }catch(error){$('updated').textContent='更新时间：暂时无法读取';$('summary').textContent='站点数据加载失败';$('result-hint').textContent='请稍后刷新重试。';$('result-hint').hidden=false;console.error(error);}
})();
