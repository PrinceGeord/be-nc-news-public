const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");

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

describe("api/topics", () => {
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
  //   test("should return the correct object specified in the endpoint", () => {
  //     return request(app)
  //       .get("/api/articles/1")
  //       .expect(200)
  //       .then(({ body }) => {
  //         expect(body.article).hasOwnProperty("author");
  //         expect(body.article).hasOwnProperty("title");
  //         expect(body.article).hasOwnProperty("article_id");
  //         expect(body.article).hasOwnProperty("body");
  //         expect(body.article).hasOwnProperty("topic");
  //         expect(body.article).hasOwnProperty("created_at");
  //         expect(body.article).hasOwnProperty("votes");
  //         expect(body.article).hasOwnProperty("article_img_url");
  //       });
  //   });
});
