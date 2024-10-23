const userSchema = require("../models/user");

module.exports = {
  name: "create-account",
  run: async (req, res) => {
    let reqData = req.body;
    console.log(reqData)

    let findUser = await userSchema.findOne({ username: reqData.username || reqData.email });
    if (findUser) return res.status(400).json({ message: "This username or email is already taken." });


    await userSchema.create(reqData);
    res.status(200).json({ message: "Account successfully created!" });
  },
};
