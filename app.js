const express = require("express");
const {
  getHealthcheck,
  getTopics,
} = require("./controllers/controllers");
const { readFile } = require("fs/promises");

const app = express();

app.use(express.json());

app.get("/api", (req, res) => {
  readFile("./endpoints.json", "utf8").then((file) => {
    const endpoints = JSON.parse(file);
    res.setHeader("Content-Type", "endpoints/json");
    res.write(JSON.stringify({ endpoints: endpoints }));
    res.statusCode = 200;
    res.end();
  });
});
app.get("/api/healthcheck", getHealthcheck);
app.get("/api/topics", getTopics);

app.all("/*", (req, res, next) => {
  res.status(404).send({ msg: "path not found" });
});

module.exports = app;
