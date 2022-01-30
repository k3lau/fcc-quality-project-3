/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";
const { doc } = require("mocha/lib/reporters");
const mongoose = require("mongoose");
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
          return res.send("missing required field title");
        } else {
          return res.json(doc);
        }
      });
    })

    .delete(function (req, res) {
      setTimeout(async function () {
        await Books.deleteMany({});
        return res.send("complete delete successful");
      }, 1000);
    });

  app
    .route("/api/books/:id")
    .get(async function (req, res) {
      let bookid = req.params.id;

      try {
        if (mongoose.isValidObjectId(bookid) == false) {
          return res.send("no book exists");
        }

        const book = await Books.findOne({ _id: bookid });

        if (book === null) {
          return res.send("no book exists");
        }
        let comments = [];
        if (typeof book.comments != "undefined") {
          book.comments.forEach((item) => {
            comments.push(item.text);
          });
        }
        const bookReturn = {
          _id: book._id,
          title: book.title,
          comments: comments,
        };

        return res.json(bookReturn);
      } catch (error) {
        return res.json({ error: error });
      }
    })

    .post(async function (req, res) {
      let bookid = req.params.id;
      let comment = req.body.comment;
      if (mongoose.isValidObjectId(bookid) == false) {
        return res.send("no book exists");
      }

      if (comment == undefined || comment == null) {
        return res.send("missing required field comment");
      }

      const booksList = await Books.find({});
      const book = await Books.findOne({ _id: bookid });
      if (book === null) {
        return res.send("no book exists");
      }

      book.comments.push(comment);

      await book.save();

      const bookReturn = {
        _id: book._id,
        title: book.title,
        comments: book.comments,
      };
      const bookDoubleCheck = await Books.findOne({ _id: book._id });
      return res.json(bookReturn);
    })

    .delete(function (req, res) {
      setTimeout(async function () {
        let bookid = req.params.id;

        if (mongoose.isValidObjectId(bookid) == false) {
          return res.send("no book exists");
        }

        const book = await Books.findOne({ _id: bookid });

        if (book === null) {
          return res.send("no book exists");
        }

        await Books.deleteOne({ _id: bookid });
        return res.send("delete successful");
      }, 1000);
    });
};
