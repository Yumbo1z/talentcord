const userSchema = require("../models/user");
const postSchema = require("../models/post");
const jwt = require("jsonwebtoken");

module.exports = {
  name: "delete-post",
  run: async (req, res) => {
    let reqData = req.body;

    const token = reqData.token;
    if (!token) return res.status(400).json({ error: "Provide a token." });

    try {
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
        if (err) return res.status(403).json({ error: "Token is invalid" });
        req.user = user;

        let findUser = await userSchema.findOne({
          username: req.user.username,
        });

        if (!findUser || findUser.permissions !== 1)
          return res.status(400).json({ message: "Not enough permissions." });

        let post = await postSchema.findOne({ _id: reqData.id });
        if (!post) return res.status(404).json({ message: "Post not found." });

        if (post.username === reqData.targetUsername || reqData.targetPerms > 0)
          return res.status(400).json({ message: "This post cannot be deleted." });

        await postSchema.findOneAndDelete({ _id: reqData.id });

        res.status(200).json({ success: "Successfully deleted post!" });
      });
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: "Something went wrong." });
    }
  },
};
