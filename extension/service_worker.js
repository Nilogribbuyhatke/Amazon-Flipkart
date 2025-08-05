// A simple in-memory cache to avoid fetching the same config repeatedly.
const CONFIG_CACHE = {};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // Check if the message is a request for a config file.
  if (message.type === "GET_CONFIG") {
    const hostname = new URL(message.url).hostname;

    // If the config is in our cache, send it back immediately.
    if (CONFIG_CACHE[hostname]) {
      sendResponse(CONFIG_CACHE[hostname]);
      return true;
    }

    // If not cached, fetch it from your server.
    fetch(`http://localhost:3000/api/config?hostname=${hostname}`)
      .then(res => res.json())
      .then(cfg => {
        CONFIG_CACHE[hostname] = cfg; // Save the config to the cache.
        sendResponse(cfg); // Send the config to the content script.
      })
      .catch(err => {
        console.error("Failed to fetch config:", err);
        sendResponse(null); // Respond with null if there was an error.
      });

    return true;
  }
});