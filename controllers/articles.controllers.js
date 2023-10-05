const app = require("../app");
const {
  fetchArticles,
  fetchArticle,
  amendArticle,
} = require("../models/articles.models");
const { fetchComments } = require("../models/comments.models");
const endpoints = require("../endpoints.json");

exports.getHealthcheck = (req, res, next) => {
  res.status(200).send({ message: "healthy" });
};
exports.getEndpoints = (req, res, next) => {
  res.setHeader("Content-Type", "endpoints/json");
  res.write(JSON.stringify({ endpoints: endpoints }));
  res.statusCode = 200;
  res.end();
};

exports.getArticles = (req, res, next) => {
  fetchArticles().then((articles) => {
    const formattedArticles = articles.map((article) => {
      article.comment_count = Number(article.comment_count);
      return article;
    });
    res.status(200).send(formattedArticles);
  });
};

exports.getArticle = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticle(article_id)
    .then((article) => {
      article.comment_count = Number(article.comment_count);
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};
exports.patchArticle = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  if (inc_votes === undefined) {
    res.status(400).send({ msg: "missing inc_vote property" });
  }
  amendArticle(article_id, inc_votes)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};
