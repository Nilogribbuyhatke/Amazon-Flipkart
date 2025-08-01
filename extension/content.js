async function run() {
  console.log("Scraper starting...");

  /**
   * Waits for an element to exist in the DOM.
   * @param {string} selector - The CSS selector of the element to wait for.
   * @param {number} [timeout=7000] - Max time to wait in milliseconds.
   * @returns {Promise<Element|null>} - A promise that resolves with the element or null if timed out.
   */
  function waitForElement(selector, timeout = 7000) {
    return new Promise(resolve => {
      const interval = setInterval(() => {
        const element = document.querySelector(selector);
        if (element) {
          clearInterval(interval);
          resolve(element);
        }
      }, 100); // Check every 100ms

      setTimeout(() => {
        clearInterval(interval);
        resolve(null); // Stop waiting and resolve with null after timeout
      }, timeout);
    });
  }

  // Wait specifically for the color filters to appear, since they seem to load last.
  const filtersAreReady = await waitForElement('.colour-listItem');

  if (!filtersAreReady) {
    console.log("Scraper timed out waiting for filter elements to load.");
    return;
  }

  // Now that we know the filters are ready, we can proceed.
  const cfg = await new Promise(resolve => {
    chrome.runtime.sendMessage({ type: "GET_CONFIG", url: location.href }, cfg => resolve(cfg));
  });

  if (!cfg) {
    console.log("Scraper: No config found for", location.hostname);
    return;
  }

  function extractField(rules, parent = document) {
    if (!Array.isArray(rules)) return null;
    for (const rule of rules) {
      const selectors = Array.isArray(rule.selector) ? rule.selector : [rule.selector];
      const attribute = rule.attribute || 'innerText';
      for (const sel of selectors) {
        if (rule.global) {
          const elements = parent.querySelectorAll(sel);
          if (elements.length > 0) {
            // First, get the array of results as before.
            const resultsArray = Array.from(elements).map(el => (el[attribute] || el.getAttribute(attribute) || '').trim());
            
            // **NEW**: Check if a 'join' property exists in the rule.
            if (rule.join) {
              return resultsArray.join(rule.join); // If it exists, join the array into a string.
            }
            
            // Otherwise, return the array as usual.
            return resultsArray;
          }
        } else {
          // ... (rest of the function is the same)
          const element = parent.querySelector(sel);
          if (element) {
            let rawValue = element[attribute] || el.getAttribute(attribute);
            if (rawValue) {
              rawValue = rawValue.toString().trim();
              if (rule.regex) {
                const match = new RegExp(rule.regex).exec(rawValue);
                if (match) return match[1] || match[0];
              }
              return rawValue;
            }
          }
        }
      }
    }
    return null;
  }
  
  // --- Main Execution ---
  const scrapedData = {};
  for (const key in cfg) {
    const propertyName = key.replace('Selector', '');
    scrapedData[propertyName] = extractField(cfg[key]);
  }

  console.log("✅ Scraped Data:", scrapedData);
}

// Run the scraper automatically
run();