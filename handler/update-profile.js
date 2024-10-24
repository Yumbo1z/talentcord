const userSchema = require("../models/user");
const jwt = require("jsonwebtoken");

module.exports = {
  name: "update-profile",
  run: async (req, res) => {
    let reqData = req.body;

    let findUser = await userSchema.findOne({ username: reqData.username });
    if (!findUser || findUser.password !== reqData.password)
      return res
        .status(400)
        .json({ message: "Incorrect password or username." });
  },
};
