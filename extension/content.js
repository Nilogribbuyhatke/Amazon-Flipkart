
async function runExtraction() {
  console.log("--- Starting extraction cycle... ---");

  const config = await new Promise(resolve => {
    chrome.runtime.sendMessage({ type: "GET_CONFIG", url: location.href }, resolve);
  });

  if (!config?.filters?.length) {
    console.log("No filter configuration found for this URL. Exiting cycle.");
    return;
  }

  const result = {};

  for (const section of config.filters) {
    const containers = Array.from(document.querySelectorAll(section.id));

    if (containers.length === 0) {
      continue;
    }

    for (const container of containers) {
      let title = null;

      if (!section.isTitleless) {
        const titleEl = container.querySelector(section.titleSelector);
        title = titleEl?.[section.attribute]?.trim();

        if (!title) {
          continue;
        }
      }

      const itemEls = container.querySelectorAll(section.itemSelector);

      const items = Array.from(itemEls)
        .map(el => {
          let itemText = null;
          if (section.itemAttribute) {
            if (section.itemAttribute === 'title') {
                itemText = el.getAttribute('title');
            } else {
                itemText = el[section.itemAttribute];
            }
          }
          if (!itemText && section.itemAttributeFallback) {
            itemText = el[section.itemAttributeFallback];
          }
 
          if (!itemText) {
             itemText = el.innerText || el.textContent;
          }
          return itemText?.trim();
        })
        .filter(Boolean);

      if (items.length > 0) {

        const finalKey = section.renameTo || title;

        if (finalKey) {
            result[finalKey] = section.join ? [items.join(section.join)] : items;
        }
      }
    }
  }

  if (Object.keys(result).length > 0) {
    console.log("--- EXTRACTION COMPLETE ---");
    console.log(`🎯 Final extracted data:`);
    console.log(result);
  } else {
    console.log("Extraction ran, but no data was found in this cycle.");
  }
}

runExtraction();

setInterval(runExtraction, 5000);