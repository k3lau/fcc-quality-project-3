/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";
const Books = require("../models/books");

module.exports = function (app) {
  app
    .route("/api/books")
    .get(async function (req, res) {
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      const books = await Books.find({});
      let bookReturn = [];
      books.forEach((book) => {
        const item = {
          _id: book._id,
          title: book.title,
          commentcount:
            typeof book.comments == "undefined" ? 0 : book.comments.length,
        };
        bookReturn.push(item);
      });
      try {
        res.send(bookReturn);
      } catch (error) {
        return res.json({ error: error });
      }
    })

    .post(function (req, res) {
      let title = req.body.title;
      //response will contain new book object including atleast _id and title
      Books.create({ title: title }, (err, doc) => {
        if (err) {
          return res.text("missing required field title");
        } else {
          return res.json(doc);
        }
      });
    })

    .delete(function (req, res) {
      //if successful response will be 'complete delete successful'
    });

  app
    .route("/api/books/:id")
    .get(async function (req, res) {
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      try {
        const book = await Books.findOne({ _id: bookid }, (err, doc) => {});

        console.log(
          `${book} and ${typeof book} and ${book === null ? null : 1}`
        );
        if (book === null) {
          return res.send("no book exists");
        }
        let comments = [];
        if (typeof book.comments != "undefined") {
          book.comments.forEach((item) => {
            comments.push({
              comment: item.text,
            });
          });
        }
        const bookReturn = {
          _id: book._id,
          title: book.title,
          comments: comments,
        };
        console.log(`GET book id ${JSON.stringify(bookReturn)}`);
        return res.json(bookReturn);
      } catch (error) {
        console.log(error);
        return res.send("no book exists");
      }
    })

    .post(function (req, res) {
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
    })

    .delete(function (req, res) {
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
    });
};
