\c nc_news_test

SELECT * FROM articles WHERE article_id=1;
SELECT * FROM comments WHERE article_id=1;
SELECT MIN(article_id) FROM articles;
SELECT MAX(article_id) FROM articles;