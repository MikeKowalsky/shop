const bcrypt = require("bcryptjs");

const User = require("../models/user");

exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    pageTitle: "Login",
    path: "/login",
    isAuthenticated: false
  });
};

exports.getSignup = (req, res, next) => {
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    isAuthenticated: false
  });
};

exports.postLogin = (req, res, next) => {
  User.findById("5c78baf417cac409d556b964")
    .then(user => {
      // Adding new field to session
      req.session.isLoggedIn = true;
      req.session.user = user;
      // session data needs to be store in mongo
      req.session.save(err => {
        if (err) console.log(err);
        res.redirect("/");
      });
    })
    .catch(err => console.log(err));

  //Max-Age in miliseconds
  // res.setHeader("Set-Cookie", "loggedIn=true; Max-Age=10000");
  // req.session.isLoggedIn = true;
  // res.redirect("/");
};

exports.postSignup = (req, res, next) => {
  const { email, password, confirmPassword } = req.body;
  User.findOne({ email })
    .then(userDoc => {
      if (userDoc) return res.redirect("/signup");
      return bcrypt
        .hash(password, 12)
        .then(hashedPassword => {
          const newUser = new User({
            email,
            password: hashedPassword,
            cart: { items: [] }
          });
          return newUser.save();
        })
        .then(result => res.redirect("/login"));
    })
    .catch(err => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    if (err) console.log(err);
    res.redirect("/");
  });
};
