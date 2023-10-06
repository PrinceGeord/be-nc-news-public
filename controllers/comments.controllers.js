const app = require("../app.js");
const {
  fetchComments,
  createComment,
  removeComment,
} = require("../models/comments.models.js");
const { fetchArticle } = require("../models/articles.models.js");

exports.getArticleComments = (req, res, next) => {
  const { article_id } = req.params;
  Promise.all([fetchArticle(article_id), fetchComments(article_id)])
    .then((values) => {
      if (values[1].length === 0) {
        return Promise.reject({
          status: 200,
          msg: "this article has no comments yet",
        });
      }
      res.status(200).send({ comments: values[1] });
    })
    .catch((err) => {
      next(err);
    });
};
exports.postComment = (req, res, next) => {
  const { username, body } = req.body;
  const { article_id } = req.params;
  if (username === undefined || body === undefined) {
    res
      .status(400)
      .send({ msg: "comment missing required properties" });
  }
  createComment(body, username, article_id)
    .then((insertedComment) => {
      res.status(201).send({ comment: insertedComment });
    })
    .catch((err) => {
      if (err.code !== "22P02") {
        if (err.detail.split('"')[1] === "users") {
          err.msg = "user does not exist";
        } else if (err.detail.split('"')[1] === "articles") {
          err.msg = "article does not exist";
        }
      }
      next(err);
    });
};
exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;
  removeComment(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      err.msg = "comment does not exist";
      next(err);
    });
};
