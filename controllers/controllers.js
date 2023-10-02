const app = require("../app");
const { fetchTopics } = require("../models/models");
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

exports.getTopics = (req, res, next) => {
  fetchTopics().then((topics) => {
    res.status(200).send({ topics });
  });
};
