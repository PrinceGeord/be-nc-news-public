const commentsRouter = require("express").Router();
const {
  deleteComment,
  getArticleComments,
  postComment,
} = require("../controllers/comments.controllers");

commentsRouter.delete("/", deleteComment);
commentsRouter.get("/", getArticleComments);
commentsRouter.post("/", postComment);

module.exports = commentsRouter;
