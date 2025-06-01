require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const dir = (text) => `${__dirname}/html/${text}.html`;
const link = (input) => `https://talentcord.org/${input}`;
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
app.use(
  express.urlencoded({
    extended: true,
    limit: "50mb",
  })
);
app.use(express.json({ limit: "50mb" }));

require("./handler")(app);

app.get("/", (_, res) => res.redirect(link("home")));
app.get("/home", async (_, res) => res.sendFile(dir("home")));
app.get("/terms", async (_, res) => res.sendFile(dir("tos")));
app.get("/plans", async (_, res) => res.sendFile(dir("plans")));
app.get("/sign-up", async (_, res) => res.sendFile(dir("sign-up")));

app.get("/profileCSS", (_, res) =>
  res.sendFile(`${__dirname}/css/profile.css`)
);

app.get("/css", (_, res) => res.sendFile(`${__dirname}/public/css/mobile.css`));
app.get("/client", (_, res) =>
  res.sendFile(`${__dirname}/public/js/client.js`)
);
app.get("/mod", (_, res) => res.sendFile(`${__dirname}/public/js/modtools.js`));

app.listen(process.env.PORT || 8080, () => {
  console.log("Server Started");
});

console.log(__dirname);

mongoose.set("strictQuery", true);
(async () => {
  await mongoose
    .connect(process.env.mongoDB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("Connected to mongoDB"));
})();

process.on("unhandledRejection", (reason, p) => {
  console.log(" [antiCrash] :: Unhandled Rejection/Catch");
  console.log(reason, p);
});
process.on("uncaughtException", (err, origin) => {
  console.log(" [antiCrash] :: Uncaught Exception/Catch");
  console.log(err, origin);
});
process.on("uncaughtExceptionMonitor", (err, origin) => {
  console.log(" [antiCrash] :: Uncaught Exception/Catch (MONITOR)");
  console.log(err, origin);
});
process.on("multipleResolves", (type, promise, reason) => {
  console.log(" [antiCrash] :: Multiple Resolves");
  console.log(type, promise, reason);
});
