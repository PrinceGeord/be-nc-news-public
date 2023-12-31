const db = require("../db/connection");
exports.fetchComments = (article_id) => {
  let query = `SELECT * FROM comments `;
  let values = [];
  if (article_id !== undefined) {
    query += `WHERE article_id = $1 `;
    values.push(article_id);
  }
  return db
    .query(query + `ORDER BY created_at DESC;`, values)
    .then(({ rows }) => {
      return rows;
    });
};

exports.createComment = (body, username, article_id) => {
  return db
    .query(
      `INSERT INTO comments (body, author, article_id)
  VALUES
  ($1,$2,$3) RETURNING *;`,
      [body, username, article_id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.removeComment = (comment_id) => {
  return db
    .query(`DELETE FROM comments WHERE comment_id = $1`, [comment_id])
    .then(() => {
      return Promise.resolve();
    });
};
