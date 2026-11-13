(() => {
  const entries = [...document.querySelectorAll('.catalog > li')];
  const toolbar = document.querySelector('.toolbar');
  const filters = document.querySelector('.filters');
  const search = document.querySelector('.search input');
  const empty = document.querySelector('.empty');
  const categories = ['全部', ...new Set(entries.map(entry => entry.dataset.category).filter(Boolean))];
  let selectedCategory = '全部';

  function filterTools() {
    const query = search.value.trim().toLocaleLowerCase();
    let visibleCount = 0;

    for (const entry of entries) {
      const matchesCategory = selectedCategory === '全部' || entry.dataset.category === selectedCategory;
      const matchesQuery = entry.textContent.toLocaleLowerCase().includes(query);
      entry.hidden = !(matchesCategory && matchesQuery);
      if (!entry.hidden) visibleCount += 1;
    }

    empty.hidden = visibleCount > 0;
  }

  for (const category of categories) {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = category;
    button.setAttribute('aria-pressed', String(category === selectedCategory));
    button.addEventListener('click', () => {
      selectedCategory = category;
      for (const filter of filters.children) {
        filter.setAttribute('aria-pressed', String(filter === button));
      }
      filterTools();
    });
    filters.append(button);
  }

  search.addEventListener('input', filterTools);
  toolbar.hidden = false;
})();
