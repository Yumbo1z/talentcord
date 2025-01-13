const userSchema = require("../models/user");

module.exports = {
  name: "users",
  get: true,
  run: async (req, res) => {
    let data = await userSchema.find().sort({ username: 1 });
    let newObj = data.map((v) => {
      return {
        username: v.username,
        icon: v.avatarURL || "https://avatarfiles.alphacoders.com/306/thumb-350-306819.webp",
        bio: v.bio,
        tags: v.tags,
        portfolio: v.portfolio,
        permissions: v.permissions,
        badges: v.badges,
      };
    });
    res.send(newObj);
  },
};
