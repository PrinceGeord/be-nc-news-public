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

describe("/api", () => {
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
