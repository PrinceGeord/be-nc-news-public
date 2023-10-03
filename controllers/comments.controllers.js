const app = require("../app.js");
const { fetchComments } = require("../models/comments.models.js");

exports.getArticleComments = (req, res, next) => {
  const { article_id } = req.params;
  fetchComments(article_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};
