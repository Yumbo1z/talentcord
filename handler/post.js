const postShema = require("../models/post");
const userSchema = require("../models/user");
const jwt = require("jsonwebtoken");

// Regular expression to match URLs
const urlRegex = /(https?:\/\/[^\s]+)/gi;
// List of bad words/slurs
const badWords = ["fuck", "shit", "bitch", "dox", "nigger"];

module.exports = {
  name: "post",
  run: async (req, res) => {
    //return res.status(400).json({ error: `System currently down!` });

    let reqData = req.body.data;

    const token = reqData.token;
    if (!token) return res.status(400).json({ error: `Provide a token.` });

    try {
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
        if (err) return res.status(403).json({ error: `Token is invalid` });
        req.user = user;

        let requester = await userSchema.findOne({
          username: req.user.username,
        });
        if (!requester)
          return res.status(400).json({ error: `Could not fetch user data.` });

        let date = new Date();
        let sanitizedContent = reqData.content.replace(/</g, "&lt;");

        // Check for URLs in the comment
        if (sanitizedContent.match(urlRegex)) {
          return res.status(400).json({ error: `Posts cannot contain URLs.` });
        }

        // Check for bad words/slurs
        for (let word of badWords) {
          if (sanitizedContent.toLowerCase().includes(word)) {
            return res.status(400).json({
              error: `Post cannot contain inappropriate language or words in our blocklist.`,
            });
          }
        }

        await postShema.create({
          username: requester.username,
          onTop: false,
          content: sanitizedContent,
          date,
        });

        return res.status(200).json({ success: `Posted!` });
      });
    } catch (err) {
      console.log(err);
      return res.status(400).json({
        error: `Something went wrong, please report to the support server.`,
      });
    }
  },
};
