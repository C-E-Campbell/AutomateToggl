const fs = require('fs');
const request = require('request');
const cheerio = require('cheerio');
const writeStream = fs.createWriteStream('post.csv');
const csv = require('csv-parser');
const filePath = './post.csv';
const results = [];
writeStream.write(`Title \n`);

function scrape() {
  request('https://www.guitarworld.com/blogs', (error, response, html) => {
    if (!error && response.statusCode === 200) {
      const $ = cheerio.load(html);

      $('h3').each((i, el) => {
        const article = $(el).text();
        writeStream.write(`${article}`);
      });
    }
    toJSON();
  });
}

function toJSON() {
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

scrape();
