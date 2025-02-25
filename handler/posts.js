const postShema = require("../models/post");
const userSchema = require("../models/user");

module.exports = {
  name: "posts",
  get: true,
  run: async (req, res) => {
    try {
      let data = await postShema.find().sort({ date: -1 });

      let newObj = await Promise.all(
        data.map(async (v) => {
          let user = await userSchema.findOne({ username: v.username });

          return {
            username: v.username,
            icon: user?.avatarURL || "https://i.imgur.com/fBh0Mdm.png",
            portfolio: user?.portfolio || "",
            permissions: user?.permissions || [],
            badges: user?.badges || [],
            onTop: v.onTop,
            content: v.content,
            date: v.date,
          };
        })
      );

      res.send(newObj);
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: "Internal Server Error" });
    }
  },
};
