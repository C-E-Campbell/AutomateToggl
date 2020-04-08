const { resolve } = require("path");
require("dotenv").config({ path: resolve(__dirname, "../.env") });
const fs = require("fs");
const csv = require("csv-parser");
const filePath = `${process.env.filepath}`;
const axios = require("axios");

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
  updateToggl() {
    this.reset();
  },
  reset() {
    csvData = [];
    newList = [];
    projectData = [];
    clientData = [];
    projectExists = [];
    this.getAllProjects();
  },
  parseOpenAirCsv() {
    csvData = [];
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
      .get(
        `https://www.toggl.com/api/v8/workspaces/${process.env.wid}/projects`,
        {
          auth: {
            username: `${process.env.apiKeyFromToggl}`,
            password: `${process.env.apiPassFromToggl}`,
          },
        }
      )
      .then((res) => {
        projectData = res.data;
        createThese = res.data;

        this.archiveAllProjects();
      })
      .catch((err) => {
        console.log(err);
      });
  },
  checkForExistingProjects() {
    if (projectData !== null) {
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
    }
    if (clientData !== null) {
      csvData.forEach((csv) => {
        clientData.forEach((client) => {
          if (csv.Project === client.name) {
            const project = Object.create(newTogglProject);
            project.name = csv.Task;
            project.cid = client.id;
            project.wid = `${process.env.wid}`;
            project.active = true;
            project.is_private = false;
            newList.push(project);
          }
        });
      });
    }

    if (projectExists !== null) {
      projectExists.forEach((project) => {
        axios
          .put(
            `https://www.toggl.com/api/v8/projects/${project.id}`,
            {
              project: {
                name: `${project.name}`,
                wid: `${process.env.wid}`,
                cid: `${project.clientID}`,
                active: true,
                color: 1,
              },
            },
            {
              auth: {
                username: `${process.env.apiKeyFromToggl}`,
                password: `${process.env.apiPassFromToggl}`,
              },
            }
          )
          .then(() => {})
          .catch((err) => {});
        this.createNewTogglProjects();
      });
    } else {
      this.createNewTogglProjects();
    }
  },
  createNewTogglProjects() {
    if (newList.length === 0) {
      console.log("Update Toggl Complete");
    }
    newList.forEach((project) => {
      axios
        .post(
          `https://www.toggl.com/api/v8/projects`,
          {
            project: {
              name: `${project.name}`,
              wid: `${process.env.wid}`,
              cid: `${project.cid}`,
              active: true,
            },
          },
          {
            auth: {
              username: `${process.env.apiKeyFromToggl}`,
              password: `${process.env.apiPassFromToggl}`,
            },
          }
        )
        .then((res) => {
          console.log("Update Toggl Complete");
        })
        .catch((err) => {});
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
                username: `${process.env.apiKeyFromToggl}`,
                password: `${process.env.apiPassFromToggl}`,
              },
            }
          )
          .then((res) => {})
          .catch((err) => {
            console.log(err);
          });

        this.getAllClients();
      });
    } else {
      this.getAllClients();
    }
  },
  getAllClients() {
    axios
      .get(
        `https://www.toggl.com/api/v8/workspaces/${process.env.wid}/clients`,
        {
          auth: {
            username: `${process.env.apiKeyFromToggl}`,
            password: `${process.env.apiPassFromToggl}`,
          },
        }
      )
      .then((res) => {
        clientData = res.data;
        if (projectData !== null) {
          res.data.forEach((client) => {
            projectData.forEach((project) => {
              if (project.cid === client.id) {
                project.client = client.name;
                project.clientID = client.id;
              }
            });
          });
        }
      })
      .then(() => {
        this.checkForExistingProjects();
      })
      .catch((err) => {
        console.log(err);
      });
  },
};
