const express = require("express");
const cron = require("node-cron");
const lib = require("./functions");

const app = express();

cron.schedule("* * * * *", function() {
  lib.parseOpenAirCsv();
});

app.get("/", (rea, res) => {
  res.send("Node app is running!")
});

app.listen(8899, () => {
  console.log("App is running on port 8899")
});
