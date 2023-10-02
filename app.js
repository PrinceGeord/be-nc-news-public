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

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "bad request" });
  }
  next(err);
});
app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  }
  next(err);
});
app.use((err, req, res, next) => {
  res.status(500).send({ msg: "internal server error!" });
});

module.exports = app;
