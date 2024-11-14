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
  banned: Boolean,
  badges: Array,
});

module.exports = mongoose.model("user", userSchema);
