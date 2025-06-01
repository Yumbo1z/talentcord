const userSchema = require("../models/user");
const jwt = require("jsonwebtoken");

module.exports = {
  name: "create-account",
  run: async (req, res) => {
    let reqData = req.body;
    console.log(reqData);

    let findUser = await userSchema.findOne({
      username: reqData.username || reqData.email,
    });
    if (findUser)
      return res
        .status(400)
        .json({ message: "This username or email is already taken." });

    await userSchema.create(reqData);

    const userObject = {
      username: reqData.username,
      password: reqData.password,
    };

    const token = jwt.sign(userObject, process.env.ACCESS_TOKEN_SECRET);
    let url = new URL("https://talentcord.org/sign-up");
    url.searchParams.append("token", token);
    url.searchParams.append("username", findUser.username);
    url.searchParams.append("avatar", "https://i.imgur.com/fBh0Mdm.png");

    res
      .status(200)
      .json({ message: "Account successfully created and signed in!" });
  },
};
