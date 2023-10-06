const express = require("express");
const apiRouter = express.Router();
const usersRouter = require("./users-router");
const topicsRouter = require("./topics-router");
const commentsRouter = require("./comments-router");
const articlesRouter = require("./articles-router");
const {
  getHealthcheck,
  getEndpoints,
} = require("../controllers/articles.controllers");
// app.use(express.json());
apiRouter.get("/", getEndpoints);

apiRouter.get("/healthCheck", getHealthcheck);

apiRouter.use("/users", usersRouter);
apiRouter.use("/topics", topicsRouter);
apiRouter.use("/comments", commentsRouter);
apiRouter.use("/articles", articlesRouter);

module.exports = apiRouter;
