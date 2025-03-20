const userSchema = require("../models/user");
const jwt = require("jsonwebtoken");

module.exports = {
  name: "profile/:username",
  get: true,
  run: async (req, res) => {
    try {
        console.log(req.cookies)
      let requestToken = req.cookies.token;
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

      if (requestToken) {
        jwt.verify(
          requestToken,
          process.env.ACCESS_TOKEN_SECRET,
          (err, user) => {
            if (err) return res.status(403).json({ error: `Token is invalid` });
            req.user = user;
          }
        );

        let data = await profileShema.findOne({
          _id: req.user._id,
        });

        if (!data) return res.status(400).json({ error: `No data found.` });

        const userObject = {
          username: findUser.username,
          password: findUser.password,
        };

        const token = jwt.sign(userObject, process.env.ACCESS_TOKEN_SECRET);

        // Set cookie with a far-future expiration date
        const expirationDate = new Date();
        expirationDate.setFullYear(expirationDate.getFullYear() + 1); // Expires in 1 year

        res.cookie(`userToken`, token, {
          secure: true,
          httpOnly: true,
          sameSite: "lax",
          expires: expirationDate,
        });

        file = file.replaceAll("$$token$$", token);
      }

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
        !user.avatar
          ? `https://i.imgur.com/fBh0Mdm.png`
          : `https://gildnovel.com/image/${user.icon}`
      );
      res.send(file);
    } catch (err) {
      console.log(err);
    }
  },
};
