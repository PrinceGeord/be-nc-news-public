const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const util = require("util");

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

  // test("should return an array of article objects with the correct properties", () => {
  //   return request(app)
  //     .get("/api/articles")
  //     .then(({ body }) => {
  //       expect(body.articles).toHaveLength(13);
  //       body.articles.forEach((article) => {
  //         expect(article).hasOwnProperty("comment_count");
  //         expect(typeof article.comment_count).toBe("number");
  //         expect(article).hasOwnProperty("author");
  //         expect(typeof article.author).toBe("string");
  //         expect(article).hasOwnProperty("title");
  //         expect(typeof article.title).toBe("string");
  //         expect(article).hasOwnProperty("article_id");
  //         expect(typeof article.article_id).toBe("number");
  //         expect(article).hasOwnProperty("topic");
  //         expect(typeof article.topic).toBe("string");
  //         expect(article).hasOwnProperty("created_at");
  //         expect(typeof article.created_at).toBe("number");
  //         expect(article).hasOwnProperty("votes");
  //         expect(typeof article.votes).toBe("number");
  //         expect(article).hasOwnProperty("article_img_url");
  //         expect(typeof article.article_img_url).toBe("string");
  //         expect(article).not.hasOwnProperty("body");
  //       });
  // });
  // });
});
