const userSchema = require("../models/user");

module.exports = {
  name: "signin",
  run: async (req, res) => {
    let reqData = req.body;
    console.log(reqData)

    let findUser = await userSchema.findOne({ username: reqData.username });
    if (!findUser || findUser.password !== reqData.password) return res.status(400).json({ message: "Incorrect password or username." });

    res.status(200).json({ message: "Signing In..." });
  },
};
