(async function run() {
  console.log("Scraper starting…");

  const cfg = await new Promise(resolve =>
    chrome.runtime.sendMessage({ type: "GET_CONFIG", url: location.href }, resolve)
  );
  if (!cfg?.filters?.length) {
    return console.warn("No scraping config or empty filters for", location.hostname);
  }

  const selectors = cfg.filters.flatMap(s => [s.titleSelector, s.itemSelector]).filter(Boolean);

  await new Promise((resolve, reject) => {
    const obs = new MutationObserver(() => {
      if (selectors.some(sel => document.querySelector(sel))) {
        obs.disconnect();
        resolve();
      }
    });

    obs.observe(document.documentElement, { childList: true, subtree: true });

    setTimeout(() => {
      obs.disconnect();
      reject(new Error("Timed out waiting for filters"));
    }, 10000);
  });

  const scraped = {};

  for (const section of cfg.filters) {
    const container = document.querySelector(section.id);
    if (!container) continue;

    const titleEl = container.querySelector(section.titleSelector);
    const itemEls = container.querySelectorAll(section.itemSelector);

    const title = section.attribute === "innerText" || section.attribute === "textContent"
      ? titleEl?.[section.attribute]?.trim()
      : titleEl?.getAttribute(section.attribute)?.trim();

    const items = Array.from(itemEls)
      .map(el => {
        if (section.itemAttribute === "innerText" || !section.itemAttribute)
          return el.innerText.trim();
        return el.getAttribute(section.itemAttribute)?.trim();
      })
      .filter(Boolean);

    if (title && items.length) scraped[title] = items;
  }

  try {
    const links = document.querySelectorAll(
      "#departments a.a-link-normal.s-navigation-item span.a-size-base.a-color-base"
    );
    const b = Array.from(links).map(el => el.innerText.trim()).filter(Boolean).join("~");
    if (b) scraped["breadcrumbs"] = [b];
  } catch (err) {
    console.error("Breadcrumbs error:", err);
  }

  console.log("✅ Scraped Data:", scraped);
})();
