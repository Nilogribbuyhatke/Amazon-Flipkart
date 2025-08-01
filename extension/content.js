(async function run() {
  console.log("Scraper starting…");

  // 1) Get your config for this URL:
  const cfg = await new Promise(resolve =>
    chrome.runtime.sendMessage({ type: "GET_CONFIG", url: location.href }, resolve)
  );
  if (!cfg) {
    return console.warn("No scraping config for", location.hostname);
  }

  // 2) Flatten all of your rule-selectors into a single array:
  const allSelectors = [];
  for (const rules of Object.values(cfg)) {
    for (const rule of rules) {
      if (Array.isArray(rule.selector)) {
        allSelectors.push(...rule.selector);
      } else {
        allSelectors.push(rule.selector);
      }
    }
  }

  // 3) Wait until *any* of those selectors appears in the DOM, or timeout:
  function waitForAnySelector(selectors, timeout = 7000) {
    return new Promise((resolve, reject) => {
      const observer = new MutationObserver((mutations, obs) => {
        for (const sel of selectors) {
          if (document.querySelector(sel)) {
            obs.disconnect();
            return resolve(sel);
          }
        }
      });

      observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
      });

      // Also check immediately in case it’s already there:
      for (const sel of selectors) {
        if (document.querySelector(sel)) {
          observer.disconnect();
          return resolve(sel);
        }
      }

      setTimeout(() => {
        observer.disconnect();
        reject(new Error(`Timed out after ${timeout}ms waiting for any of: ${selectors.join(", ")}`));
      }, timeout);
    });
  }

  let readySelector;
  try {
    readySelector = await waitForAnySelector(allSelectors, 10000);
    console.log("Detected filter container via selector:", readySelector);
  } catch (err) {
    console.error(err);
    return;
  }

  // 4) The same generic extractField you already have, just fixed typo:
  function extractField(rules, parent = document) {
    if (!Array.isArray(rules)) return null;
    for (const rule of rules) {
      const sels = Array.isArray(rule.selector) ? rule.selector : [rule.selector];
      const attr = rule.attribute || "innerText";

      for (const sel of sels) {
        if (rule.global) {
          const els = parent.querySelectorAll(sel);
          if (els.length) {
            const texts = Array.from(els).map(el => (el[attr] || el.getAttribute(attr) || "").trim());
            return rule.join ? texts.join(rule.join) : texts;
          }
        } else {
          const el = parent.querySelector(sel);
          if (el) {
            let raw = el[attr] || el.getAttribute(attr) || "";
            raw = raw.toString().trim();
            if (rule.regex) {
              const m = new RegExp(rule.regex).exec(raw);
              if (m) return m[1] || m[0];
            }
            return raw;
          }
        }
      }
    }
    return null;
  }

  // 5) Scrape every configured field:
  const scraped = {};
  for (const [key, rules] of Object.entries(cfg)) {
    scraped[key.replace("Selector", "")] = extractField(rules);
  }

  console.log("✅ Scraped Data:", scraped);
})();
