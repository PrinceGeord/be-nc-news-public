const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const util = require("util");
const express = require("express");

app.use(express.json());

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe("api setup", () => {
  test("returns 200 status", () => {
    return request(app).get("/api/healthcheck").expect(200);
  });
  test("returns 404 status when unrecognise endpoint is entered", () => {
    return request(app).get("/api/idonotexist").expect(404);
  });
});

describe("GET api/topics", () => {
  test("should return an array of objects with the correct properties", () => {
    return request(app)
      .get("/api/topics")
      .then(({ body }) => {
        expect(body.topics).toHaveLength(3);
        body.topics.forEach((topic) => {
          expect(topic).hasOwnProperty("slug");
          expect(topic).hasOwnProperty("description");
        });
      });
  });
});
describe("GET /api/articles/:article_id", () => {
  test("should return the correct object specified in the endpoint", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        expect(body.article.author).toBe("butter_bridge");
        expect(body.article.title).toBe(
          "Living in the shadow of a great man"
        );
        expect(body.article.body).toBe(
          "I find this existence challenging"
        );
        expect(body.article.created_at).toBe(
          "2020-07-09T20:11:00.000Z"
        );
        expect(body.article.votes).toBe(100);
        expect(body.article.article_img_url).toBe(
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
        );
        expect(body.article.article_id).toBe(1);
        expect(body.article.topic).toBe("mitch");
        expect(body.article.comment_count).toBe(11);
      });
  });
  test("should return error when invalid article_id is received", () => {
    return request(app)
      .get("/api/articles/invalidID")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("should return error when valid article_id is passed that does not exist in database", () => {
    return request(app)
      .get("/api/articles/9999999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("id not found");
      });
  });
});

describe("GET /api", () => {
  test("should return an object describing all available endpoints", () => {
    return request(app)
      .get("/api")
      .then(({ body }) => {
        const sampleEndpoint = require("../endpoints.json");
        const endpointKeys = Object.keys(sampleEndpoint);
        endpointKeys.forEach((key) => {
          const value = body.endpoints[key];
          util.isDeepStrictEqual(value, sampleEndpoint[key]);
        });
      });
  });
});
describe("GET /api/articles", () => {
  test("should return a 200 status code", () => {
    return request(app).get("/api/articles").expect(200);
  });

  test("should return an array of article objects with the correct properties", () => {
    return request(app)
      .get("/api/articles")
      .then(({ body }) => {
        expect(body).toHaveLength(13);

        body.forEach((article) => {
          expect(article).hasOwnProperty("comment_count");
          expect(typeof article.comment_count).toBe("number");
          expect(article).hasOwnProperty("author");
          expect(typeof article.author).toBe("string");
          expect(article).hasOwnProperty("title");
          expect(typeof article.title).toBe("string");
          expect(article).hasOwnProperty("article_id");
          expect(typeof article.article_id).toBe("number");
          expect(article).hasOwnProperty("topic");
          expect(typeof article.topic).toBe("string");
          expect(article).hasOwnProperty("created_at");
          expect(typeof article.created_at).toBe("string");
          expect(article).hasOwnProperty("votes");
          expect(typeof article.votes).toBe("number");
          expect(article).hasOwnProperty("article_img_url");
          expect(typeof article.article_img_url).toBe("string");
          expect(article).not.hasOwnProperty("body");
        });
      });
  });
  test("should be sorted by date in descending order", () => {
    return request(app)
      .get("/api/articles")
      .then(({ body }) => {
        expect(body).toBeSortedBy("created_at", { descending: true });
      });
  });
});
describe("GET /api/articles/:article_id/comments", () => {
  test("should return a 200 status code", () => {
    return request(app).get("/api/articles/1/comments").expect(200);
  });
  test("should return an array of comments for the specified article id", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .then(({ body }) => {
        expect(body.comments).toHaveLength(11);
        body.comments.forEach((comment) => {
          expect(typeof comment.comment_id).toBe("number");
          expect(typeof comment.votes).toBe("number");
          expect(typeof comment.created_at).toBe("string");
          expect(typeof comment.author).toBe("string");
          expect(typeof comment.body).toBe("string");
          expect(comment.article_id).toBe(1);
        });
      });
  });
  test("should return an array of comments with the most recent comment displayed first", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .then(({ body }) => {
        expect(body.comments).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
  test("should return 'id not found' if valid article_id has been entered but no article can be found", () => {
    return request(app)
      .get("/api/articles/200000/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("id not found");
      });
  });
  test("should return 'bad request' if a non-valid article_id has been entered into the query", () => {
    return request(app)
      .get("/api/articles/malicious_code/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("should return 200 status code with message stating there are no comments for this article when article has no comments", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.msg).toBe("this article has no comments yet");
      });
  });
});
describe("POST /api/articles/:article_id/comments", () => {
  test("should return a 201 status upon successful post", () => {
    const newComment = {
      username: "butter_bridge",
      body: "this could have been avoided if we had known before what we know now",
    };

    return request(app)
      .post("/api/articles/6/comments")
      .send(newComment)
      .expect(201);
  });
  test("should return the posted object upon successful post", () => {
    const newComment = {
      username: "butter_bridge",
      body: "this could have been avoided if we had known before what we know now",
    };
    return request(app)
      .post("/api/articles/6/comments")
      .send(newComment)
      .then(({ body }) => {
        expect(body.comment.article_id).toBe(6);
        expect(body.comment.author).toBe("butter_bridge");
        expect(body.comment.body).toBe(
          "this could have been avoided if we had known before what we know now"
        );
        expect(body.comment.comment_id).toBe(19);
        expect(typeof body.comment.created_at).toBe("string");
        expect(body.comment.votes).toBe(0);
      });
  });

  test("should return 404 error when non-existent username has been entered", () => {
    const newComment = {
      username: "Captain Hindsight",
      body: "this could have been avoided if we had known before what we know now",
    };

    return request(app)
      .post("/api/articles/6/comments")
      .send(newComment)
      .then(({ body }) => {
        expect(body.msg).toBe("user does not exist");
      });
  });
  test("should return 404 error when valid but non-existent article_id is entered", () => {
    const newComment = {
      username: "butter_bridge",
      body: "this could have been avoided if we had known before what we know now",
    };
    return request(app)
      .post("/api/articles/2000000000/comments")
      .send(newComment)
      .then(({ body }) => {
        expect(body.msg).toBe("article does not exist");
      });
  });
  test("should return 400 error when invalid article_id is entered", () => {
    const newComment = {
      username: "butter_bridge",
      body: "this could have been avoided if we had known before what we know now",
    };
    return request(app)
      .post("/api/articles/maliciousCode/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("should return 201 status code and successful comment posting if extra properties are added to comment object", () => {
    const newComment = {
      username: "butter_bridge",
      body: "I like to overshare",
      interests: "driving, watching TV, cactus sommelier",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        expect(body.comment.article_id).toBe(1);
        expect(body.comment.author).toBe("butter_bridge");
        expect(body.comment.body).toBe("I like to overshare");
        expect(body.comment.comment_id).toBe(19);
        expect(typeof body.comment.created_at).toBe("string");
        expect(body.comment.votes).toBe(0);
      });
  });
  test("should return a 400 error if provided object does not have the required properties", () => {
    const newComment = {
      username: "butter_bridge",
      comment: "I hate rules",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("comment missing required properties");
      });
  });
});
describe("PATCH /api/articles/:article_id", () => {
  test("should return a 200 status code when patched successfully", () => {
    const voteChange = { inc_votes: 5 };
    return request(app)
      .patch("/api/articles/1")
      .send(voteChange)
      .expect(200);
  });
  test("should return updated version of article with votes incremented by specified amount", () => {
    const voteChange = { inc_votes: 5 };
    const desiredObj = {
      article_id: 3,
      title: "Eight pug gifs that remind me of mitch",
      topic: "mitch",
      author: "icellusedkars",
      created_at: "2020-11-03T09:12:00.000Z",
      votes: 5,
      article_img_url:
        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
    };
    return request(app)
      .patch("/api/articles/3")
      .send(voteChange)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toMatchObject(desiredObj);
      });
  });
  test("should return updated version of article with votes decremented by specified amount", () => {
    const voteChange = { inc_votes: -100 };
    return request(app)
      .patch("/api/articles/3")
      .send(voteChange)
      .then(({ body }) => {
        const { article } = body;
        expect(article.article_id).toBe(3);
        expect(article.title).toBe(
          "Eight pug gifs that remind me of mitch"
        );
        expect(article.topic).toBe("mitch");
        expect(article.author).toBe("icellusedkars");
        expect(article.body).toBe("some gifs");
        expect(article.created_at).toBe("2020-11-03T09:12:00.000Z");
        expect(article.votes).toBe(-100);
        expect(article.article_img_url).toBe(
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
        );
      });
  });
  test("should return 404 error when valid article_id entered but does not exist", () => {
    const voteChange = { inc_votes: 54 };
    return request(app)
      .patch("/api/articles/2000000")
      .send(voteChange)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("article does not exist");
      });
  });
  test("should return 400 error when invalid article_id entered", () => {
    const voteChange = { inc_votes: 4 };
    return request(app)
      .patch("/api/articles/notanumber")
      .send(voteChange)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("should return 400 error when provided vote change as an invalid datatype", () => {
    const voteChange = { inc_votes: "STOP THE COUNT!!" };
    return request(app)
      .patch("/api/articles/1")
      .send(voteChange)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("should return 400 error when inc_votes property is missing", () => {
    const voteChange = { votes: 4 };
    return request(app)
      .patch("/api/articles/1")
      .send(voteChange)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("missing inc_vote property");
      });
  });
});
