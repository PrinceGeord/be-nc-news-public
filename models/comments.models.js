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
      if (rows.length === 0) {
        return Promise.reject({
          status: 200,
          msg: "this article has no comments yet",
        });
      } else return rows;
    });
};
