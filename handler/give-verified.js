const userSchema = require("../models/user");
const jwt = require("jsonwebtoken");
const badges = require("../data/badges");

module.exports = {
  name: "giveverified",
  run: async (req, res) => {
    let reqData = req.body;

    const token = reqData.token;
    const targetUsername = reqData.targetUsername;

    if (!token) return res.status(400).json({ error: `Provide a token.` });

    try {
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
        if (err) return res.status(403).json({ error: `Token is invalid` });
        req.user = user;

        // Verify the requester has permission
        let requester = await userSchema.findOne({
          username: req.user.username,
        });

        if (!requester || requester.permissions !== 1)
          return res.status(400).json({ message: "Not enough permissions." });

        // Find the target user
        let targetUser = await userSchema.findOne({
          username: targetUsername,
        });

        if (!targetUser)
          return res.status(404).json({ error: "User not found." });

        const dataBadge = badges.find(
          (b) => b.name === "Verified Community Owner"
        );

        // Check if the badge already exists
        const badgeIndex = targetUser.badges.findIndex(
          (badge) => badge.name === "Verified Community Owner"
        );

        if (badgeIndex === -1) {
          // Add the badge if it doesn't exist
          targetUser.badges.push(dataBadge);
        } else {
          // Update the badge if it exists
          targetUser.badges[badgeIndex] = dataBadge;
        }

        // Save the updated user data
        await targetUser.save();

        res
          .status(200)
          .json({ success: "Successfully awarded the Developer badge!" });
      });
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: "Something went wrong." });
    }
  },
};
