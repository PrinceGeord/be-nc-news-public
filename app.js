const express = require("express");
const {
  getHealthcheck,
  getTopics,
  getArticle,
} = require("./controllers/controllers");

const app = express();

app.get("/api/healthcheck", getHealthcheck);
app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticle);
app.all("/*", (req, res, next) => {
  res.status(404).send({ msg: "path not found" });
});

module.exports = app;
