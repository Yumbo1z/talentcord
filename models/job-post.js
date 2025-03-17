const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  username: String,
  onTop: Boolean,
  content: String,
  salary: Number,
  tags: Array,
  date: Date,
});

module.exports = mongoose.model("post", postSchema);
