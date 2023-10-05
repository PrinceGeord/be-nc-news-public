\c nc_news_test


--SELECT articles.article_id, articles.title, articles.author, articles.topic, articles.created_at, articles.votes, COUNT (comments.article_id) as comment_count, article_img_url  FROM articles
SELECT articles.article_id,title, articles.author, topic, articles.created_at, articles.votes, COUNT (comments.article_id) AS comment_count, article_img_url  FROM articles
LEFT JOIN comments
ON articles.article_id = comments.article_id
GROUP BY articles.article_id
ORDER BY title DESC