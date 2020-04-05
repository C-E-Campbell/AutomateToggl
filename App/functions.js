const fs = require('fs');
const csv = require('csv-parser');
const filePath = "../CSV_Goes_Here/test.csv";
const axios = require("axios");
const results = [];

module.exports = {
    parseOpenAirCsv() {
        fs.createReadStream(filePath)
          .on('error', () => {
            console.log('there is an error');
          })
          .pipe(csv())
          .on('data', row => {
            results.push(row);
          })
          .on('end', () => {
            console.log(results);
          });
      }
}