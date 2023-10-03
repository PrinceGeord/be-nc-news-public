const app = require("../app.js");
const {
  fetchComments,
  createComment,
} = require("../models/comments.models.js");

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
exports.postComment = (req, res, next) => {
  const { username, body } = req.body;
  const { article_id } = req.params;
  createComment(body, username, article_id).then(
    (insertedComment) => {
      res.status(201).send({ comment: insertedComment });
    }
  );
};
