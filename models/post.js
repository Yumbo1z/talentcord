const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  username: String,
  id: String,  
  portfolio: String,
  onTop: Boolean,
  content: String,
});

module.exports = mongoose.model("post", postSchema);
