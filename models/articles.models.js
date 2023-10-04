const db = require("../db/connection");

exports.fetchArticles = (topic) => {
  const values = [];
  let query = `SELECT * FROM articles`;
  if (topic) {
    query += ` WHERE topic = $${values.length + 1}`;
    values.push(topic);
  }
  query += ` ORDER BY created_at DESC;`;
  return db.query(query, values).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({
        status: 404,
        msg: "topic does not exist",
      });
    }
    return rows;
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
