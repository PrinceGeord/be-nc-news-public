const articlesRouter = require("express").Router();
const commentsRouter = require("./comments-router");
const {
  getArticles,
  getArticle,
  patchArticle,
} = require("../controllers/articles.controllers");

articlesRouter.get("/", getArticles);
articlesRouter.get("/:article_id", getArticle);
articlesRouter.patch("/:article_id", patchArticle);

articlesRouter.use("/:article_id/comments", commentsRouter);

module.exports = articlesRouter;
