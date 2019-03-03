const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

const config = require("./util/keys");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

const User = require("./models/user");

const errorController = require("./controllers/error");

const MONGODB_URI = `mongodb+srv://${config.keys.MONGO_USER}:${
  config.keys.MONGO_PASSWORD
}@cluster0-idsge.mongodb.net/shop?retryWrites=true`;

const app = express();

// initializing session store
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions"
});

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: config.keys.SECRET,
    resave: false,
    saveUninitialized: false,
    store: store
  })
);

app.use((req, res, next) => {
  User.findById("5c78baf417cac409d556b964")
    .then(user => {
      // Adding new field to every req
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true })
  .then(client => {
    console.log("**** MongoDB connected");

    User.findOne().then(user => {
      if (!user) {
        const user = new User({
          name: "Mike",
          email: "mike@test.com",
          cart: { items: [] }
        });
        user.save();
      }
    });

    app.listen(3000, () => {
      console.log("**** Server runs on port 3000");
    });
  })
  .catch(err => {
    console.log(err);
    throw err;
  });
