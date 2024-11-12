const userSchema = require("../models/user");
const jwt = require("jsonwebtoken");

module.exports = {
  name: "timeout",
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

        if (findUser.username === reqData.targetUsername || req.targetPerms > 0)
          return res
            .status(400)
            .json({ message: "This user cannot be timeouted." });

        /*let target = await userSchema.findOne({
          username: reqData.targetUsername,
        });
        
        target.banned = true;
        await target.save()
        */

        res.status(200).json({ success: "Successfully timeouted!" });
      });
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: "Something went wrong." });
    }
  },
};
