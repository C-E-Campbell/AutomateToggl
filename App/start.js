const lib = require("./functions");
const express = require("express");
const app = express();
const axios = require("axios");

lib.parseCSV();

app.get("/", (rea, res) => {
  res.send("Node app is running!")
})

app.listen(8899, () => {
  console.log("App is running")
})
