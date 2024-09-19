require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const dir = (text) => `${__dirname}/html/${text}.html`;
const link = (input) => `https://gildnovel.com/${input}`;
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

app.get("/error", (req, res) => res.send("error logging in"));

app.use((_, res) => res.status(404).redirect("/alert"));

app.listen(process.env.PORT || 80, () => {
  console.log("Server Started");
});

console.log(__dirname);

mongoose.set("strictQuery", true);
(async () => {
  await mongoose
    .connect(process.env.mongo, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("Connected to mongodb"));
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
