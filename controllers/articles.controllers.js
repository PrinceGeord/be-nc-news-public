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
  const { sortBy, orderBy } = req.query;
  Promise.all([fetchArticles(sortBy, orderBy), fetchComments()]).then(
    (promises) => {
      const articles = promises[0];
      const comments = promises[1];
      const newArticles = articles.map((article) => {
        let commentCount = 0;
        comments.forEach((comment) => {
          if (comment.article_id === article.article_id) {
            commentCount += 1;
          }
        });
        const newArticle = {
          author: article.author,
          title: article.title,
          article_id: article.article_id,
          topic: article.topic,
          created_at: article.created_at,
          votes: article.votes,
          article_img_url: article.article_img_url,
          comment_count: commentCount,
        };
        return newArticle;
      });
      res.status(200).send(newArticles);
    }
  );
};

exports.getArticle = (req, res, next) => {
  const { article_id } = req.params;

  fetchArticle(article_id)
    .then((article) => {
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
