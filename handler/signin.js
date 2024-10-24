const userSchema = require("../models/user");
const jwt = require("jsonwebtoken");

module.exports = {
  name: "signin",
  run: async (req, res) => {
    let reqData = req.body;
    console.log(reqData);

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
      "https://preview.redd.it/orin-kaenbyou-touhou-11-kasha-v0-rce3ewucbzta1.jpg?width=550&format=pjpg&auto=webp&s=52332d0e2882f5f8543510847b60ba74ea3acf48"
    );
    console.log(url);
    res.status(200).redirect(url);
    //res.status(200).json({ message: "Signing In..." });
  },
};
