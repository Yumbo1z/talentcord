const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  username: String,
  portfolio: String,
  onTop: Boolean,
  content: String,
  date: Date,
});

module.exports = mongoose.model("post", postSchema);
