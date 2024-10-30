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

        let findUser = await userSchema.findOne({
          username: req.user.username,
        });
        if (!findUser || findUser.password !== req.user.password)
          return res
            .status(400)
            .json({ message: "Incorrect password or username." });

        if (reqData.tags) findUser.tags = reqData.tags;
        if (reqData.bio) findUser.bio = reqData.bio;
        if (reqData.portfolio) findUser.portfolio = reqData.portfolio;

        await findUser.save();
        res.status(200).json({ success: "Successfully updated!" });
      });
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: "Something went wrong." });
    }
  },
};
