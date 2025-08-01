const express = require("express");
const cors = require("cors");
const configs = require("./config");   
const siteMap = require("./sitemap");  

const app = express();

// Allow all origins for now
app.use(cors());

app.get("/api/config", (req, res) => {
  const host = req.query.hostname;

  if (!host) return res.status(400).json({ error: "Hostname is required" });

  const siteId = siteMap[host];
  const config = configs[siteId];

  if (!siteId || !config) {
    return res.status(404).json({ error: "Config not found for hostname: " + host });
  }

  res.json(config);
});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
