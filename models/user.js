const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  username: String,
  email: String,
  icon: String,
  password: String,
  bio: String,
  portfolio: String,
  tags: Array,
  permissions: Number,
});

module.exports = mongoose.model("user", userSchema);
