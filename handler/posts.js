const postShema = require("../models/post");
const userSchema = require("../models/user");

module.exports = {
  name: "posts",
  get: true,
  run: async (req, res) => {
    let data = await postShema.find().sort({ date: -1 });
    let newObj = data.map(async (v) => {
      let user = await userSchema.findOne({
        username: v.username,
      });

      return {
        username: v.username,
        icon: user.avatarURL
          ? user.avatarURL
          : "https://i.imgur.com/fBh0Mdm.png",
        portfolio: user.portfolio,
        permissions: user.permissions,
        badges: user.badges,
        onTop: v.onTop,
        content: v.content,
        date: v.date,
      };
    });

    console.log(newObj);
    res.send(newObj);
  },
};
