const express = require("express");
const {
  getHealthcheck,
  getArticle,
  getEndpoints,
  getArticles,
} = require("./controllers/articles.controllers");
const {
  getArticleComments,
  postComment,
} = require("./controllers/comments.controllers");
const { getTopics } = require("./controllers/topics.controllers");
const {
  handlePSQLErrors,
  handle500Errors,
  handleCustomErrors,
} = require("./controllers/errors.controllers");

const app = express();

app.use(express.json());

app.get("/api", getEndpoints);
app.get("/api/healthcheck", getHealthcheck);
app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticle);
app.get("/api/articles/:article_id/comments", getArticleComments);
app.post("/api/articles/:article_id/comments", postComment);
app.all("/*", (req, res, next) => {
  res.status(404).send({ msg: "path not found" });
});

app.use(handlePSQLErrors);
app.use(handleCustomErrors);
app.use(handle500Errors);

module.exports = app;
