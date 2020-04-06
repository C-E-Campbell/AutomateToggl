const fs = require("fs");
const csv = require("csv-parser");
const filePath = "../CSV_Goes_Here/test.csv";
const axios = require("axios");
let csvData = [];
let projectData = [];
let clientData = [];

module.exports = {
  parseOpenAirCsv() {
    fs.createReadStream(filePath)
      .on("error", () => {
        console.log("csv parse failed");
      })
      .pipe(csv())
      .on("data", (row) => {
        csvData.push(row);
      })
      .on("end", () => {
        console.log(csvData);
      });
  },
  async getAllProjects() {
    const result = await axios
      .get("https://www.toggl.com/api/v8/workspaces/4131377/projects", {
        auth: {
          username: "92b7f642cb009d898a8d13b0156b794e",
          password: "api_token",
        },
      })
      .then((res) => {
        projectData = res.data;
      });

    this.archiveAllProjects();
  },
  updateAllActiveProjects() {
    csvData.forEach((el) => {
      const projectId = projectData.filter((project) => {
        return project.Project === el.Project;
      });

      axios
        .put(
          "https://www.toggl.com/api/v8/projects/159597436",
          { project: { name: "charlieee", active: true } },
          {
            auth: {
              username: "92b7f642cb009d898a8d13b0156b794e",
              password: "api_token",
            },
          }
        )
        .then((res) => {
          console.log(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    });
  },
  archiveAllProjects() {
    if (projectData !== null) {
      projectData.forEach((element) => {
        axios
          .put(
            `https://www.toggl.com/api/v8/projects/${element.id}`,
            { project: { active: false } },
            {
              auth: {
                username: "92b7f642cb009d898a8d13b0156b794e",
                password: "api_token",
              },
            }
          )
          .then((res) => {
            console.log(res.data);
          });
      });
    } else {
      console.log("No active projects");
    }
  },
  async getAllClientsAndUpdateProjects() {
    const result = await axios
      .get("https://www.toggl.com/api/v8/workspaces/4131377/clients", {
        auth: {
          username: "92b7f642cb009d898a8d13b0156b794e",
          password: "api_token",
        },
      })
      .then((res) => {
        res.data.forEach((client) => {
          projectData.forEach((project) => {
            if (project.cid === client.id) {
              project.client = client.name;
            }
          });
        });
      });
  },
};
