const mongoose = require("mongoose");
const commentSchema = new mongoose.Schema({
  text: String,
  date: { type: Date, default: Date.now() },
});
const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  comments: [commentSchema],
});

module.exports = mongoose.model("Book", bookSchema);
