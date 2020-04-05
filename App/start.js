const fs = require('fs');

const writeStream = fs.createWriteStream('post.csv');
const csv = require('csv-parser');
const filePath = './csv.csv';
const results = [];
writeStream.write(`Title \n`);


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

toJSON()
