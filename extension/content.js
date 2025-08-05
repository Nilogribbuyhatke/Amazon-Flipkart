(async function run() {
  const config = await new Promise(resolve => {
    chrome.runtime.sendMessage({ type: "GET_CONFIG", url: location.href }, resolve);
  });

  if (!config?.filters?.length) return;
  const result = {};

  for (const section of config.filters) {
    const containers = Array.from(document.querySelectorAll(section.id));

    for (const container of containers) {
      const titleEl = container.querySelector(section.titleSelector);
      const itemEls = container.querySelectorAll(section.itemSelector);

      const title = titleEl?.[section.attribute]?.trim();

      const items = Array.from(itemEls)
        .map(el => el?.[section.itemAttribute || section.attribute]?.trim())
        .filter(Boolean);
        
      if (title && items.length) result[title] = items;
    }
  }

  if (result.Category) {
    result.Breadcrumbs = [result.Category.join("~")];
    delete result.Category;
  }

  console.log(result);
})();