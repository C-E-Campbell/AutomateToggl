const { resolve } = require("path");
require("dotenv").config({ path: resolve(__dirname, "../.env") });
const express = require("express");
const lib = require("./functions");
const chokidar = require("chokidar");

const app = express();

app.use(express.static("public"));

// lib.parseOpenAirCsv();
// lib.updateToggl();

const watcher = chokidar.watch(`${process.env.filepath}`);

watcher.on("all", function () {
  console.log("Data Changed... Running UpdateToggl App");
});

app.listen(8786, () => {
  console.log(`App is running on port ${process.env.PORT}`);
});
