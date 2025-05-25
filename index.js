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
app.get("/tos", async (_, res) => res.sendFile(dir("tos")));
app.get("/plans", async (_, res) => res.sendFile(dir("plans")));

app.get("/homeCSS", (_, res) => res.sendFile(`${__dirname}/css/home.css`));
app.get("/profileCSS", (_, res) =>
  res.sendFile(`${__dirname}/css/profile.css`)
);

app.get("/homeJS", (_, res) => res.sendFile(`${__dirname}/js/home.js`));
app.get("/profileJS", (_, res) => res.sendFile(`${__dirname}/js/profile.js`));

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
