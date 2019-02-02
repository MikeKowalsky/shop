const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const expressHbs = require("express-handlebars");

const adminData = require("./routes/admin");
const shopRoutes = require("./routes/shop");

const app = express();

// // PUG
// // we can set global configuration value
// // we can set whatever, some are predefined, like view engine
// // also pug while installing predefining itself in express
// app.set("view engine", "pug");
// app.set("views", "views");

// HANDLEBARS
// hbs it's a name of an engine
// so then template files need to have the same extension
// * basically this: {layoutsDir: 'views/layouts'} is redundant because
// it's default, but if it's different then needs to be set up here
app.engine(
  "hbs",
  expressHbs({ layoutsDir: "views/layouts", defaultLayout: "main-layout.hbs" })
);
app.set("view engine", "hbs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/admin", adminData.routes);
app.use(shopRoutes);

app.use((req, res) => {
  // res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
  res.render("404", { pageTitle: "Page not found" });
});

app.listen(3000, () => {
  console.log("Server runs on port 3000");
});
