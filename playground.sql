\c nc_news_test




SELECT articles.article_id, title, articles.topic, articles.author, articles.body, COUNT(comments.article_id) AS comment_count, articles.votes, articles.created_at, article_img_url FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id;
