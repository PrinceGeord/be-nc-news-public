const db = require("../db/connection");
exports.fetchArticles = (
  topic,
  sortBy = "created_at",
  orderBy = "DESC"
) => {
  const values = [];
  const validSortBys = {
    created_at: "created_at",
    topic: "topic",
    comment_count: "comment_count",
    author: "author",
    title: "title",
    article_id: "article_id",
    votes: "votes",
  };
  if (validSortBys[sortBy] === undefined) {
    return Promise.reject({ status: 400, msg: "Invalid sort query" });
  }
  const validOrderBys = {
    ASC: "ASC",
    DESC: "DESC",
  };
  if (validOrderBys[orderBy] === undefined) {
    return Promise.reject({
      status: 400,
      msg: "Invalid order query",
    });
  }
  let query = `SELECT articles.article_id, title, articles.author, topic, articles.created_at, articles.votes, COUNT(comments.article_id) AS comment_count, article_img_url  FROM articles
  LEFT JOIN comments
  ON articles.article_id = comments.article_id`;
  if (typeof topic === "string") {
    query += ` WHERE topic = $${values.length + 1}`;

    values.push(topic);
  }
  query += ` GROUP BY articles.article_id ORDER BY ${validSortBys[sortBy]} ${validOrderBys[orderBy]};`;
  return db.query(query, values).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404 });
    } else return rows;
  });
};

exports.fetchArticle = (id) => {
  return db
    .query(
      "SELECT articles.article_id, title, articles.topic, articles.author, articles.body, COUNT(comments.article_id) AS comment_count, articles.votes, articles.created_at, article_img_url FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id;",
      [id]
    )
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
