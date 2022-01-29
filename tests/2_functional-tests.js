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

chai.use(chaiHttp);

suite("Functional Tests", function () {
  /*
   * ----[EXAMPLE TEST]----
   * Each test should completely test the response of the API end-point including response status code!
   */
  test.skip("#example Test GET /api/books", function (done) {
    chai
      .request(server)
      .get("/api/books")
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body, "response should be an array");
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
  });
  /*
   * ----[END of EXAMPLE TEST]----
   */

  suite("Routing tests", function () {
    suite(
      "POST /api/books with title => create book object/expect book object",
      function () {
        test.skip("Test POST /api/books with title", function (done) {
          const title = "Testing Post API";
          chai
            .request(server)
            .post("/api/books")
            .send({ title: title })
            .end((err, res) => {
              //console.log(JSON.stringify(res));
              assert.property(res.body, "_id");
              assert.property(res.body, "title");
              assert.property(res.body, "comments");
            });
          done();
        });

        test.skip("Test POST /api/books with no title given", function (done) {
          chai
            .request(server)
            .post("/api/books")
            .end((err, res) => {
              console.log(JSON.stringify(res));
            });
          done();
        });
      }
    );

    suite("GET /api/books => array of books", function () {
      test("Test GET /api/books", function (done) {
        chai
          .request(server)
          .get("/api/books")
          .end((err, res) => {
            //console.log(JSON.stringify(res.body));
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
          });
        done();
      });
    });

    suite("GET /api/books/[id] => book object with [id]", function () {
      test("Test GET /api/books/[id] with id not in db", function (done) {
        const testId = "wrong";
        chai
          .request(server)
          .get("/api/books/" + testId)
          .end((err, res) => {
            console.log(JSON.stringify(res.text));
            assert.equal(res.text, "no book exists");
          });
        done();
      });

      test.skip("Test GET /api/books/[id] with valid id in db", function (done) {
        const testId = "61f3ee797b6c415c5181c0ac";
        const testTitle = "Test 2";
        chai
          .request(server)
          .get("/api/books/" + testId)
          .end((err, res) => {
            console.log(JSON.stringify(res.body));
            assert.equal(res.body.title, testTitle);
          });
        done();
      });
    });

    suite.skip(
      "POST /api/books/[id] => add comment/expect book object with id",
      function () {
        test("Test POST /api/books/[id] with comment", function (done) {
          //done();
        });

        test("Test POST /api/books/[id] without comment field", function (done) {
          //done();
        });

        test("Test POST /api/books/[id] with comment, id not in db", function (done) {
          //done();
        });
      }
    );

    suite.skip("DELETE /api/books/[id] => delete book object id", function () {
      test("Test DELETE /api/books/[id] with valid id in db", function (done) {
        //done();
      });

      test("Test DELETE /api/books/[id] with  id not in db", function (done) {
        //done();
      });
    });
  });
});
