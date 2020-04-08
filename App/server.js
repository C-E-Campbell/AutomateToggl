const { resolve } = require("path");
require("dotenv").config({ path: resolve(__dirname, "../.env") });
const express = require("express");
const lib = require("./functions");
const chokidar = require("chokidar");

const app = express();

app.use(express.static("public"));

const watcher = chokidar.watch(`${process.env.filepath}`);

watcher.on("change", function () {
  console.log("Data Changed... Running UpdateToggl App");
  setTimeout(() => {
    lib.parseOpenAirCsv();
    lib.updateToggl();
  }, 10000);
});

app.listen(8786, () => {
  console.log(`App is running on port ${process.env.PORT}`);
});
