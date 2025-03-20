const userSchema = require("../models/user");
const jwt = require("jsonwebtoken");
const fs = require("fs");

module.exports = {
  name: "profile/:username",
  get: true,
  run: async (req, res) => {
    try {
      let username = req.params.username;
      let user = await userSchema.findOne({
        username: username,
      });

      if (!user)
        return res.status(404).send({
          error: `The user you requested could not be found. If you feel like this is
    an error please contact the support server.`,
        });

      let file = fs.readFileSync("./html/profile.html", {
        encoding: "utf8",
      });

      file = file.replaceAll("$$permissions$$", user.permissions);
      file = file.replaceAll("$$username$$", user.username);
      file = file.replaceAll("$$id$$", user._id);
      file = file.replace(
        "$$banner$$",
        !user.banner
          ? "https://i.imgur.com/fBh0Mdm.png"
          : `https://gildnovel.com/image/${user.banner}`
      );
      file = file.replaceAll(
        "$$avatar$$",
        !user?.avatarURL
          ? `https://i.imgur.com/fBh0Mdm.png`
          : `https://gildnovel.com/image/${user.avatarURL}`
      );
      res.send(file);
    } catch (err) {
      console.log(err);
    }
  },
};
