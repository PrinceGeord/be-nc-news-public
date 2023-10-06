const app = require("../app");
const {
  fetchArticles,
  fetchArticle,
  amendArticle,
} = require("../models/articles.models");
const { fetchTopics } = require("../models/topics.models");
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
  const { topic, sort_by, order } = req.query;
  fetchArticles(topic, sort_by, order)
    .then((articles) => {
      articles.forEach((article) => {
        article.comment_count = Number(article.comment_count);
      });
      res.status(200).send({ articles });
    })
    .catch((err) => {
      if (err.status === 404) {
        fetchTopics().then((validTopics) => {
          const validTopicCheck = validTopics.find((element) => {
            if (element.slug === topic) {
              return true;
            }
          });
          if (validTopicCheck) {
            res
              .status(404)
              .send({ msg: "No articles exist for this topic" });
          } else
            res.status(404).send({ msg: "Topic does not exist" });
        });
      } else next(err);
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
