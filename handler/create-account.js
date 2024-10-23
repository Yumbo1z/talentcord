module.exports = {
  name: "create-account",
  get: true,
  run: async (req, res) => {
    let reqData = req.body.data;
    console.log(reqData)
  },
};
