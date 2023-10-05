const db = require("../db/connection");
const { fetchTopics } = require("./topics.models");
exports.fetchArticles = (topic) => {
  const values = [];
  let query = `SELECT articles.article_id,title, articles.author, topic, articles.created_at, articles.votes, COUNT (comments.article_id) AS comment_count, article_img_url  FROM articles
  LEFT JOIN comments
  ON articles.article_id = comments.article_id`;
  if (typeof topic === "string") {
    query += ` WHERE topic = $${values.length + 1}`;
    values.push(topic);
  }
  query += ` GROUP BY articles.article_id`;
  query += ` ORDER BY created_at DESC;`;

  return db.query(query, values).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404 });
    } else return rows;
  });
};

exports.fetchArticle = (id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1", [id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "id not found" });
      }
      return rows[0];
    });
};

exports.amendArticle = (article_id, inc_votes) => {
  return db
    .query(
      `UPDATE articles
  SET votes = (votes + $2)
  WHERE article_id = $1 RETURNING *;`,
      [article_id, inc_votes]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "article does not exist",
        });
      }
      return rows[0];
    });
};
