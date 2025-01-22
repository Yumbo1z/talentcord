const userSchema = require("../models/user");

module.exports = {
  name: "users",
  get: true,
  run: async (req, res) => {
    let data = await userSchema.find().sort({ username: 1 });
    let newObj = data.map((v) => {
      return {
        username: v.username,
        icon: v.avatarURL
          ? v.avatarURL
          : "https://i.imgur.com/fBh0Mdm.png"
        ,
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
