const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

const errorController = require("./controllers/error");

const sequelize = require("./util/database");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

// Goes through all models and relations and sync them with db
// if there is no table for particular model, then it will be created
sequelize
  .sync()
  .then(result => {
    console.log("**** **** **** ****");
    console.log("**** MySQL Connected");
    app.listen(3000, () => {
      console.log("**** Server runs on port 3000");
    });
  })
  .catch(err => console.log(err));
