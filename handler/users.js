const userSchema = require("../models/user");

module.exports = {
    name: "users",
    get: true,
    run: async (req, res) => {
        let data = await profileShema.find().sort({ username: 1 });
        let newObj = data.map((v) => {
            return {
                username: v.username,
                bio: v.bio,
                tags: v.tags,
            };
        });
        res.send(newObj);
    },
};
