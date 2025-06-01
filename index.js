const express = require("express");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

// GET /tiles?minLon=...&minLat=...&maxLon=...&maxLat=...&minZoom=...&maxZoom=...
app.get("/tiles", async (req, res) => {
  const {
    minLon,
    minLat,
    maxLon,
    maxLat,
    minZoom = 0,
    maxZoom = 5,
  } = req.query;

  if (!minLon || !minLat || !maxLon || !maxLat) {
    return res.status(400).send("Missing bounding box parameters.");
  }

  const globalMBTiles = "data/global.mbtiles";
  const extractedMBTiles = "tmp/extracted.mbtiles";
  const outputDir = "tmp/tiles";
  const zipPath = "tmp/tiles.zip";

  // クリーンアップ
  fs.rmSync(outputDir, { recursive: true, force: true });
  fs.rmSync(extractedMBTiles, { force: true });
  fs.rmSync(zipPath, { force: true });

  const bounds = `${minLon},${minLat},${maxLon},${maxLat}`;
  const tileliveCmd = `npx tilelive-copy --bounds=${bounds} --minzoom=${minZoom} --maxzoom=${maxZoom} ${globalMBTiles} ${extractedMBTiles}`;
  const extractCmd = `${process.env.HOME}/.local/bin/mb-util ${extractedMBTiles} ${outputDir}`;
  const zipCmd = `zip -r ${zipPath} ${outputDir}`;

  try {
    console.log("Running tilelive-copy...");
    await execPromise(tileliveCmd);

    console.log("Running mb-util...");
    await execPromise(extractCmd);

    console.log("Zipping...");
    await execPromise(zipCmd);

    res.download(zipPath, "tiles.zip");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error during processing");
  }
});

function execPromise(cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, (err, stdout, stderr) => {
      if (err) return reject(stderr || err);
      resolve(stdout);
    });
  });
}

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
