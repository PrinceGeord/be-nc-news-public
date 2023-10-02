const db = require("../db/connection");

exports.fetchTopics = () => {
  return db.query("SELECT * FROM topics;").then(({ rows }) => {
    return rows;
  });
};

exports.fetchArticles = () => {
  return db.query("SELECT * FROM articles;").then(({ rows }) => {
    return rows;
  });
};
