const express = require("express");
const {
  getHealthcheck,
  getTopics,
} = require("./controllers/controllers");

const app = express();

app.use(express.json());

app.get("/api/healthcheck", getHealthcheck);
app.get("/api/topics", getTopics);

app.all("/*", (req, res, next) => {
  res.status(404).send({ msg: "path not found" });
});

module.exports = app;
