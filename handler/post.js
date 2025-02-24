const bookShema = require("../models/book");
const profileShema = require("../models/profiles");
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
    return console.log(reqData)

    const token = reqData.token;
    if (!token) return res.status(400).json({ error: `Provide a token.` });

    try {
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
        if (err) return res.status(403).json({ error: `Token is invalid` });
        req.user = user;

        let bookData = await bookShema
          .findOne({ _id: reqData.book })
          .catch((err) => {});
        if (!bookData)
          return res.status(400).json({ error: `Something went wrong.` });

        let userProfile = await profileShema
          .findOne({ _id: req.user._id })
          .catch((err) => {});
        if (!userProfile)
          return res.status(400).json({ error: `Could not fetch user data.` });

        let chapterIndex = bookData.chapters.findIndex(
          (v) => v.name === reqData.chapter
        );

        if (chapterIndex === -1)
          return res.status(400).json({ error: `Something went wrong.` });

        let date = new Date();
        let sanitizedComment = reqData.comment.replace(/</g, "&lt;");

        // Check for URLs in the comment
        if (sanitizedComment.match(urlRegex)) {
          return res
            .status(400)
            .json({ error: `Comments cannot contain URLs.` });
        }

        // Check for bad words/slurs
        for (let word of badWords) {
          if (sanitizedComment.toLowerCase().includes(word)) {
            return res.status(400).json({
              error: `Comments cannot contain inappropriate language or words in our blocklist.`,
            });
          }
        }

        bookData.chapters[chapterIndex].comments.push({
          userID: userProfile._id,
          comment: sanitizedComment,
          date: date,
        });

        bookData.markModified("chapters");
        await bookData.save();

        return res.status(200).json({ success: `Comment Posted!` });
      });
    } catch (err) {
      console.log(err);
      return res.status(400).json({
        error: `Something went wrong, please report to the support server.`,
      });
    }
  },
};
