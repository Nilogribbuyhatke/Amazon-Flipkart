/**
 * Generic content script to extract filter data from a webpage.
 * The script runs on page load and then repeats every 10 seconds.
 */

// 1. Wrap the core logic in a reusable async function.
//    This allows us to call it multiple times.
async function runExtraction() {
  console.log("--- Starting extraction cycle... ---");

  // Fetch the configuration specific to the current website URL.
  const config = await new Promise(resolve => {
    chrome.runtime.sendMessage({ type: "GET_CONFIG", url: location.href }, resolve);
  });

  // If no configuration or no filters are defined for this site, do nothing for this cycle.
  if (!config?.filters?.length) {
    console.log("No filter configuration found for this URL. Exiting cycle.");
    return;
  }

  const result = {};

  // Iterate over each type of filter section defined in the config.
  for (const section of config.filters) {
    // Find all container elements for this section type.
    const containers = Array.from(document.querySelectorAll(section.id));

    if (containers.length === 0) {
      // This is not an error, the element might just not be on the page yet.
      // console.warn(`No containers found for selector: ${section.id}`);
      continue;
    }

    // Process each container found on the page.
    for (const container of containers) {
      const titleEl = container.querySelector(section.titleSelector);
      const itemEls = container.querySelectorAll(section.itemSelector);

      // Extract title text using the method defined in the config.
      const title = titleEl?.[section.attribute]?.trim();

      if (!title) {
        // console.warn('Could not find title in a container for selector:', section.id);
        continue;
      }

      // Extract item texts.
      const items = Array.from(itemEls)
        .map(el => {
          let itemText = null;

          // PRIORITY 1: Try the 'itemAttribute'.
          if (section.itemAttribute) {
            if (section.itemAttribute === 'title') {
                itemText = el.getAttribute('title');
            } else {
                itemText = el[section.itemAttribute];
            }
          }

          // PRIORITY 2: If the primary attribute failed, try the fallback.
          if (!itemText && section.itemAttributeFallback) {
            itemText = el[section.itemAttributeFallback];
          }

          // PRIORITY 3: As a final measure, fall back to the section's main 'attribute'.
          if (!itemText) {
             itemText = el[section.attribute];
          }

          return itemText?.trim();
        })
        .filter(Boolean);

      if (items.length > 0) {
        result[title] = items;
      }
    }
  }

  // Perform any site-specific data transformations (optional).
  if (result.Category) {
    result.Breadcrumbs = [result.Category.join("~")];
    delete result.Category;
  }

  // Log the final, collated results for this cycle.
  // We check if the result object is not empty before logging.
  if (Object.keys(result).length > 0) {
    console.log("--- EXTRACTION COMPLETE ---");
    const timestamp = new Date().toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata" });
    console.log(`🎯 Final extracted data at ${timestamp}:`);
    console.log(result);
  } else {
    console.log("Extraction ran, but no data was found in this cycle.");
  }
}


// 2. Call the function immediately on script load.
//    This ensures the script runs once as soon as the page is ready.
runExtraction();

// 3. Set an interval to call the function again every 10 seconds.
//    10 seconds = 10,000 milliseconds.
setInterval(runExtraction, 5000);