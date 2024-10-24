const userSchema = require("../models/user");
const jwt = require("jsonwebtoken");

module.exports = {
  name: "update-profile",
  run: async (req, res) => {
    let reqData = req.body;

    const token = reqData.token;
    if (!token) return res.status(400).json({ error: `Provide a token.` });

    try {
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
        if (err) return res.status(403).json({ error: `Token is invalid` });
        req.user = user;

    let findUser = await userSchema.findOne({ username: reqData.username });
    if (!findUser || findUser.password !== reqData.password)
      return res
        .status(400)
        .json({ message: "Incorrect password or username." });
  },
};
