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
      },
      getAllProjects(){
        const projects = axios.get("https://www.toggl.com/api/v8/workspaces/4051800/projects", {
          auth: {
            username: '92b7f642cb009d898a8d13b0156b794e',
            password: 'api_token'
          }
        }).then(res => {
          console.log(res.data)
        }).catch(err => {
          console.log(err)
        });
      },
      updateAllActiveProjects(){

      },
      archiveAllUnActiveProjects(){
        
      }
}