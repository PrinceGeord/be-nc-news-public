const app = require("../app.js");
const { fetchComments } = require("../models/comments.models.js");
const { fetchArticle } = require("../models/articles.models.js");

exports.getArticleComments = (req, res, next) => {
  const { article_id } = req.params;
  Promise.all([fetchArticle(article_id), fetchComments(article_id)])
    .then((values) => {
      res.status(200).send({ comments: values[1] });
    })
    .catch((err) => {
      next(err);
    });
};
