const apiRouter = require("./routes/api");
const express = require("express");
const app = express();
app.use("/api", apiRouter);

const {
  handlePSQLErrors,
  handle500Errors,
  handleCustomErrors,
} = require("./controllers/errors.controllers");

app.all("/*", (req, res, next) => {
  res.status(404).send({ msg: "path not found" });
});

app.use(handlePSQLErrors);
app.use(handleCustomErrors);
app.use(handle500Errors);

module.exports = app;
