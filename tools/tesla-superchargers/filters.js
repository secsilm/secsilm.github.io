'use strict';

const SuperchargerFilters = (() => {
  const keys = ['province', 'city', 'version', 'parking'];
  const versions = s => Object.entries(s.stalls || {}).filter(([, n]) => n > 0).map(([key]) => key);
  function parkingValues(s) {
    const position = ['above', 'below'].includes(s.parkingLocation) ? s.parkingLocation : 'unknown';
    return position === 'unknown' ? ['unknown'] : [position, `${position}:${s.parkingFloor == null ? 'unknown' : s.parkingFloor}`];
  }
  function values(s, key) {
    if (key === 'version') return versions(s).length ? versions(s) : ['unknown'];
    if (key === 'parking') return parkingValues(s);
    return s[key] ? [s[key]] : [];
  }
  function matches(s, filters, omit) {
    const query = (filters.search || '').trim().toLocaleLowerCase();
    if (query && ![s.name, s.originalName, s.city, s.originalCity, s.address, s.province].some(v => String(v || '').toLocaleLowerCase().includes(query))) return false;
    return keys.every(key => key === omit || !filters[key] || values(s, key).includes(filters[key]));
  }
  function options(stations, filters, key) {
    return [...new Set(stations.filter(s => matches(s, filters, key)).flatMap(s => values(s, key)))].sort((a, b) => a.localeCompare(b, 'zh-CN', {numeric: true}));
  }
  function resolve(stations, desired, changedKey) {
    const filters = {search: desired.search || ''};
    // Preserve the user's latest choice first; clear older incompatible choices.
    const order = keys.includes(changedKey) ? [changedKey, ...keys.filter(key => key !== changedKey)] : keys;
    for (const key of order) {
      const candidate = {...filters, [key]: desired[key] || ''};
      filters[key] = !candidate[key] || stations.some(s => matches(s, candidate)) ? candidate[key] : '';
    }
    return {
      filters,
      options: Object.fromEntries(keys.map(key => [key, options(stations, filters, key)])),
      stations: stations.filter(s => matches(s, filters))
    };
  }
  return {keys, resolve};
})();

if (typeof module !== 'undefined' && module.exports) module.exports = SuperchargerFilters;
