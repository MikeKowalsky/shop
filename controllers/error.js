exports.get404 = (req, res) => {
  res.render("404", {
    pageTitle: "Page not found",
    path: "404",
    isAuthenticated: req.session.isLoggedIn
  });
};

exports.get500 = (req, res) => {
  res.render("500", {
    pageTitle: "Error",
    path: "500",
    isAuthenticated: req.session.isLoggedIn
  });
};
