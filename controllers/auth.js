const User = require("../models/user");

exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    pageTitle: "Login",
    path: "/login",
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

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    if (err) console.log(err);
    res.redirect("/");
  });
};
