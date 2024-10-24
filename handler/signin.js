const userSchema = require("../models/user");
const jwt = require("jsonwebtoken");

module.exports = {
  name: "signin",
  run: async (req, res) => {
    let reqData = req.body;

    let findUser = await userSchema.findOne({ username: reqData.username });
    if (!findUser || findUser.password !== reqData.password)
      return res
        .status(400)
        .json({ message: "Incorrect password or username." });

    const userObject = {
      username: findUser.username,
      password: findUser.password,
    };

    const token = jwt.sign(userObject, process.env.ACCESS_TOKEN_SECRET);
    let url = new URL("https://talentcord-production.up.railway.app/home");
    url.searchParams.append("token", token);
    url.searchParams.append("username", findUser.username);
    url.searchParams.append(
      "avatar",
      "https://t3.ftcdn.net/jpg/05/16/27/58/360_F_516275801_f3Fsp17x6HQK0xQgDQEELoTuERO4SsWV.jpg"
    );

    res.status(200).json({ redirectUrl: url, message: "Signing In..." });
  },
};
