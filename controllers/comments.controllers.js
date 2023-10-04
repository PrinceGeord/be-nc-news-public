const app = require("../app.js");
const {
  fetchComments,
  createComment,
} = require("../models/comments.models.js");
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
          err.status = 404;
          err.msg = "user does not exist";
        } else if (err.detail.split('"')[1] === "articles") {
          err.status = 404;
          err.msg = "article does not exist";
        }
      }
      next(err);
    });
};
