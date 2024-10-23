const userSchema = require("../models/user");

module.exports = {
  name: "create-account",
  run: async (req, res) => {
    let reqData = req.body.data;
    console.log(reqData)
  },
};
