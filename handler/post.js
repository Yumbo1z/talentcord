const postSchema = require("../models/post");
const userSchema = require("../models/user");
const jwt = require("jsonwebtoken");

//const urlRegex = /(https?:\/\/[^\s]+)/gi;
//const badWords = ["fuck", "shit", "bitch", "dox", "nigger", "cunt", "retard", "nigga"];

const fs = require("fs");

module.exports = {
  name: "post",
  run: async (req, res) => {
    let reqData = req.body.data;
    const token = reqData.token;

    if (!token) return res.status(400).json({ error: "Provide a token." });

    try {
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
        if (err) return res.status(403).json({ error: "Token is invalid" });
        req.user = user;

        let requester = await userSchema.findOne({
          username: req.user.username,
        });
        if (!requester)
          return res.status(400).json({ error: "Could not fetch user data." });

        let date = new Date();

        // Check if user has posted within the last 12 hours
        if (requester.lastPosted) {
          let lastPostedTime = new Date(requester.lastPosted);
          let twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000);

          if (lastPostedTime > twelveHoursAgo) {
            return res
              .status(400)
              .json({ error: "You can only post once every 12 hours." });
          }
        }

        let sanitizedContent = reqData.content.replace(/</g, "&lt;");

        fs.readFile("bad-words.txt", "utf8", (err, badWords) => {
          if (err) return console.error("Error reading file:", err);

          // Convert bad words into a regex pattern (case-insensitive, word boundaries)
          const badWordsArray = badWords
            .split("\n")
            .map((word) => word.trim())
            .filter((word) => word);
          const badWordsPattern = new RegExp(
            `\\b(${badWordsArray.join("|")})\\b`,
            "gi"
          );

          // Check for bad words using regex
          if (badWordsPattern.test(sanitizedContent)) {
            return console.log({
              error:
                "Post cannot contain inappropriate language or words in our blocklist.",
            });
          }

          console.log("No bad words detected.");
        });

        // Create the post
        await postSchema.create({
          username: requester.username,
          onTop: false,
          content: sanitizedContent,
          date,
        });

        // Update lastPosted time
        requester.lastPosted = date;
        await requester.save();

        return res.status(200).json({ success: "Posted!" });
      });
    } catch (err) {
      console.log(err);
      return res.status(400).json({
        error: "Something went wrong, please report to the support server.",
      });
    }
  },
};
