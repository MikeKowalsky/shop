exports.get404 = (req, res) => {
  res.render("404", {
    pageTitle: "Page not found",
    path: "404",
    isAuthenticated: req.isLoggedIn
  });
};
