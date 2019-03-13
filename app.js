const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const flash = require("connect-flash");

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

const csrfProtection = csrf();

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
app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use((req, res, next) => {
  if (!req.session.user) return next();

  User.findById(req.session.user._id)
    .then(user => {
      if (!user) return next();
      req.user = user;
      next();
    })
    .catch(err => {
      // inside async operations you need to use next with an error
      next(new Error(err));
    });
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.get("/500", errorController.get500);

app.use(errorController.get404);

// express will handle this special middleware with 4 args before the others
// so the error will be handled before app.use(get404)
app.use((error, req, res, next) => {
  // res.redirect("/500")
  res.render("500", {
    pageTitle: "Error",
    path: "500",
    isAuthenticated: req.session.isLoggedIn
  });
});

mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true })
  .then(client => {
    console.log("**** MongoDB connected");
    app.listen(3000, () => {
      console.log("**** Server runs on port 3000");
    });
  })
  .catch(err => {
    console.log(err);
    throw err;
  });
