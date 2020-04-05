const express = require("express");
const cron = require("node-cron");
const lib = require("./functions");

const app = express();

app.use(express.static('public'));

// cron.schedule("0 10,16 * * 1-5", function() {
//   lib.parseOpenAirCsv();
// });



app.listen(8899, () => {
  console.log("App is running on port 8899")
});
