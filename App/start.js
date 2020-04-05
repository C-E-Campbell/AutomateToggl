const fs = require('fs');
const axios = require("axios");
const csv = require('csv-parser');
const filePath = "../CSV_Goes_Here/test.csv";
const results = [];


function parseCSV() {
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

parseCSV()



//get all projects
// function getAllProjectData(){
//   const projects = axios.get("https://www.toggl.com/api/v8/workspaces/4051800/projects", {
//     headers: {
//       'Authorization': 'Basic 92b7f642cb009d898a8d13b0156b794e:api_token'
//     }
   
//   }).then(data => {
//     console.log(data)
//   }).catch(error => {
//     console.log(error)
//   })
//   console.log("Success");
// }


