const express = require("express");
const cors = require("cors");
const configs = require("./config");
const siteMap = require("./sitemap");

const app = express();

app.use(cors());
console.log("HEllo")
app.get("/api/config", (req, res) => {
  const host = req.query.hostname;

  // --- ADD THIS LOGGING LINE ---
  console.log(`[Server] Received request for hostname: "${host}"`);

  if (!host) return res.status(400).json({ error: "Hostname is required" });

  const siteId = siteMap[host];
  const config = configs[siteId];

  if (!siteId || !config) {
    console.error(`[Server] ❌ Config not found for hostname: "${host}"`);
    return res.status(404).json({ error: "Config not found for hostname: " + host });
  }

  console.log(`[Server] ✅ Sending config for: "${host}"`);
  res.json(config);
});

app.listen(3003, () => {
  console.log("Server running at http://localhost:3003");
});