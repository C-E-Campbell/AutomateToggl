const fs = require("fs");
const csv = require("csv-parser");
const filePath = "../CSV_Goes_Here/test.csv";
const axios = require("axios");

// encapsulate these in an obj, use getters/setters
let csvData = [];
let createThese = [];
let projectData = [];
let clientData = [];
let projectExists = [];

module.exports = {
  async parseOpenAirCsv() {
    fs.createReadStream(filePath)
      .on("error", () => {
        console.log("csv parse failed");
      })
      .pipe(csv())
      .on("data", (row) => {
        csvData.push(row);
      })
      .on("end", () => {});
  },
  async getAllProjects() {
    await axios
      .get("https://www.toggl.com/api/v8/workspaces/4131377/projects", {
        auth: {
          username: "92b7f642cb009d898a8d13b0156b794e",
          password: "api_token",
        },
      })
      .then((res) => {
        projectData = res.data;
        createThese = res.data;
        this.getAllClients();
      });
  },
  checkForExistingProjects() {
    csvData.forEach((csvProject, j) => {
      projectData.forEach((togglProject, i) => {
        if (
          togglProject.name === csvProject.Task &&
          togglProject.client === csvProject.Project
        ) {
          console.log(csvProject);
          projectExists.push(togglProject);
        } else {
          createThese.push(csvProject);
        }
      });
    });

    console.log(createThese);

    projectExists.forEach((project) => {
      axios
        .put(
          `https://www.toggl.com/api/v8/projects/${project.id}`,
          {
            project: {
              name: `${project.name}`,
              wid: 4131377,
              cid: `${project.clientID}`,
              color: 2,
            },
          },
          {
            auth: {
              username: "92b7f642cb009d898a8d13b0156b794e",
              password: "api_token",
            },
          }
        )
        .catch((err) => {
          console.log(err);
        });
    });
  },
  // createNewTogglProjects() {
  //   const clientID = clientData.filter((project) => {
  //     if (project.name === project.name) {
  //       return project.id;
  //     }
  //   projectData.forEach((project) => {
  //     axios
  //       .post(
  //         `https://www.toggl.com/api/v8/projects`,
  //         {
  //           project: {
  //             name: `${project.name}`,
  //             wid: 4131377,
  //           },
  //         },
  //         {
  //           auth: {
  //             username: "92b7f642cb009d898a8d13b0156b794e",
  //             password: "api_token",
  //           },
  //         }
  //       )
  //       .then((res) => {
  //         console.log(res.data);
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //       });
  //   });

  // },
  // archiveAllProjects() {
  //   if (projectData !== null) {
  //     projectData.forEach((element) => {
  //       axios
  //         .put(
  //           `https://www.toggl.com/api/v8/projects/${element.id}`,
  //           { project: { active: false } },
  //           {
  //             auth: {
  //               username: "92b7f642cb009d898a8d13b0156b794e",
  //               password: "api_token",
  //             },
  //           }
  //         )
  //         .then((res) => {
  //           //console.log(res.data);
  //         });
  //     });
  //   } else {
  //     console.log("No active projects");
  //   }
  // },
  async getAllClients() {
    const result = await axios
      .get("https://www.toggl.com/api/v8/workspaces/4131377/clients", {
        auth: {
          username: "92b7f642cb009d898a8d13b0156b794e",
          password: "api_token",
        },
      })
      .then((res) => {
        clientData = res.data;
        res.data.forEach((client) => {
          projectData.forEach((project) => {
            if (project.cid === client.id) {
              project.client = client.name;
              project.clientID = client.id;
            }
          });
        });
        this.checkForExistingProjects();
      });
  },
};
