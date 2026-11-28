/* Shared by the browser and Node checks. Rows are [name, suffix, lng, lat]. */
((root) => {
  const api = {
    suffixCounts(points) {
      const counts = new Map();
      for (const point of points) counts.set(point[1], (counts.get(point[1]) || 0) + 1);
      return [...counts].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'zh-CN'));
    },
    select(points, first, second, query = '') {
      const text = query.trim().toLocaleLowerCase();
      return points.filter(point => (first === 'all' || point[1] === first || point[1] === second)
        && point[0].toLocaleLowerCase().includes(text));
    }
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.VillageFilters = api;
})(typeof window !== 'undefined' ? window : globalThis);
