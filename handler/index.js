const fs = require("fs");
const multer = require("multer");

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
});

module.exports = function (app) {
  fs.readdirSync(__dirname).forEach(function (file) {
    if (file == "index.js") return;
    const name = file.substr(0, file.indexOf("."));
    const route = require("./" + name);
    if (route.run) {
      if (route.upload) {
        app.post(
          `/${route.name}`,
          upload.single(route.upload),
          async (req, res) => {
            route.run(req, res);
          }
        );
      } else if (route.fields) {
        app.post(
          `/${route.name}`,
          upload.fields(route.fields),
          async (req, res) => {
            route.run(req, res);
          }
        );
      } else if (route.get) {
        app.get(`/${route.name}`, async (req, res) => {
          route.run(req, res);
        });
      } else {
        app.post(`/${route.name}`, async (req, res) => {
          route.run(req, res);
        });
      }
    }
  });
};
