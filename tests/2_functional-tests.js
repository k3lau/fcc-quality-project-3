/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *
 */

const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");
const Books = require("../models/books");

chai.use(chaiHttp);

suite("Functional Tests", function () {
  suite("Routing tests", function () {
    suite(
      "POST /api/books with title => create book object/expect book object",
      function () {
        test("Test POST /api/books with title", function (done) {
          const title = "Testing Post API";
          chai
            .request(server)
            .post("/api/books")
            .send({ title: title })
            .end((err, res) => {
              assert.property(res.body, "_id");
              assert.property(res.body, "title");
              assert.property(res.body, "comments");
              Books.deleteOne({ _id: res.body._id }).then();
              done();
            });
        });

        test("Test POST /api/books with no title given", function (done) {
          chai
            .request(server)
            .post("/api/books")
            .send({})
            .end((err, res) => {
              assert.equal(res.text, "missing required field title");
              done();
            });
        });
      }
    );

    suite("GET /api/books => array of books", function () {
      test("Test GET /api/books", function (done) {
        Books.create({ title: "Create to test GET book array" }).then(
          (book) => {
            chai
              .request(server)
              .get("/api/books")
              .end((err, res) => {
                assert.property(
                  res.body[0],
                  "commentcount",
                  "Books in array should contain commentcount"
                );
                assert.property(
                  res.body[0],
                  "title",
                  "Books in array should contain title"
                );
                assert.property(
                  res.body[0],
                  "_id",
                  "Books in array should contain _id"
                );
                done();
              });
          }
        );
      });
    });

    suite("GET /api/books/[id] => book object with [id]", function () {
      test("Test GET /api/books/[id] with id not in db", function (done) {
        const testId = "wrong";
        chai
          .request(server)
          .get("/api/books/" + testId)
          .end((err, res) => {
            assert.equal(res.text, "no book exists");
            done();
          });
      });

      test("Test GET /api/books/[id] with valid id in db", function (done) {
        const testTitle = "Test 2";
        Books.create({ title: testTitle }).then((book) => {
          const testId = book._id;
          chai
            .request(server)
            .get("/api/books/" + testId)
            .end((err, res) => {
              assert.equal(res.body.title, testTitle);
              done();
            });
        });
      });
    });

    suite(
      "POST /api/books/[id] => add comment/expect book object with id",
      function () {
        test("Test POST /api/books/[id] with comment", function (done) {
          const testTitle = "Testing Post API";
          const comment = "Test comment";
          Books.create({ title: testTitle }).then((book) => {
            const testId = book._id;
            chai
              .request(server)
              .post("/api/books/" + testId)
              .send({ comment: comment })
              .end((err, res) => {
                assert.property(res.body, "title");
                assert.property(res.body, "comments");
                done();
              });
          });
        });

        test("Test POST /api/books/[id] without comment field", function (done) {
          done();
        });

        test("Test POST /api/books/[id] with comment, id not in db", function (done) {
          done();
        });
      }
    );

    suite("DELETE /api/books/[id] => delete book object id", function () {
      test("Test DELETE /api/books/[id] with valid id in db", function (done) {
        Books.create({ title: "Test API DELETE" }).then((book) => {
          const testId = book._id;

          chai
            .request(server)
            .delete("/api/books/" + testId)
            .end((err, res) => {
              assert.equal(res.text, "delete successful");
              done();
            });
        });
      });

      test("Test DELETE /api/books/[id] with  id not in db", function (done) {
        const testId = "aaaafc433b8d78a93a351e5";
        chai
          .request(server)
          .delete("/api/books/" + testId)
          .end((err, res) => {
            assert.equal(res.text, "no book exists");
            done();
          });
      });
    });
  });
});
