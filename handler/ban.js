const userSchema = require("../models/user");
const jwt = require("jsonwebtoken");

module.exports = {
  name: "ban",
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

        if (!findUser || findUser.permissions !== 1)
          return res.status(400).json({ message: "Not enough permissions." });

        if (
          findUser.username === reqData.targetUsername ||
          reqData.targetPerms > 0
        )
          return res
            .status(400)
            .json({ message: "This user cannot be banned." });

        await userSchema.findOneAndDelete({
          username: reqData.targetUsername,
        });

        res.status(200).json({ success: "Successfully banned!" });
      });
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: "Something went wrong." });
    }
  },
};
