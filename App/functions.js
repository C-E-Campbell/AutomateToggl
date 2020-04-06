const fs = require("fs");
const csv = require("csv-parser");
const filePath = "../CSV_Goes_Here/test.csv";
const axios = require("axios");

// encapsulate these in an obj, use getters/setters
let csvData = [];
let newList = [];
let projectData = [];
let clientData = [];
let projectExists = [];
const newTogglProject = {
  name: null,
  wid: null,
  cid: null,
  active: true,
};

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
      .on("end", () => {});
  },
  getAllProjects() {
    axios
      .get("https://www.toggl.com/api/v8/workspaces/4131377/projects", {
        auth: {
          username: "92b7f642cb009d898a8d13b0156b794e",
          password: "api_token",
        },
      })
      .then((res) => {
        projectData = res.data;
        createThese = res.data;
        this.archiveAllProjects();
      });
  },
  checkForExistingProjects() {
    projectData.forEach((togglProject, j) => {
      csvData.forEach((csvProject, i) => {
        if (
          togglProject.name === csvProject.Task &&
          togglProject.client === csvProject.Project
        ) {
          projectExists.push(togglProject);
          csvData.splice(i, 1);
        }
      });
    });

    csvData.forEach((csv) => {
      clientData.forEach((client) => {
        if (csv.Project === client.name) {
          const project = Object.create(newTogglProject);
          project.name = csv.Task;
          project.cid = client.id;
          project.wid = 4131377;
          project.active = true;
          newList.push(project);
        }
      });
    });

    projectExists.forEach((project) => {
      axios
        .put(
          `https://www.toggl.com/api/v8/projects/${project.id}`,
          {
            project: {
              name: `${project.name}`,
              wid: 4131377,
              cid: `${project.clientID}`,
              active: true,
              color: 1,
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

    this.createNewTogglProjects();
  },
  createNewTogglProjects() {
    newList.forEach((project) => {
      axios
        .post(
          `https://www.toggl.com/api/v8/projects`,
          {
            project: {
              name: `${project.name}`,
              wid: `${project.wid}`,
              cid: `${project.cid}`,
              active: true,
            },
          },
          {
            auth: {
              username: "92b7f642cb009d898a8d13b0156b794e",
              password: "api_token",
            },
          }
        )
        .then((res) => {})
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
            this.getAllClients();
          });
      });
    } else {
      console.log("No active projects");
    }
  },
  getAllClients() {
    axios
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
