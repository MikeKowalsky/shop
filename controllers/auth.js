exports.getLogin = (req, res, next) => {
  // const isLoggedIn =
  //   req
  //     .get("Cookie")
  //     .split(";")[1]
  //     .trim()
  //     .split("=")[1] === "true";
  console.log(req.session.isLoggedIn);
  res.render("auth/login", {
    pageTitle: "Login",
    path: "/login",
    isAuthenticated: false
  });
};

exports.postLogin = (req, res, next) => {
  //Max-Age in miliseconds
  // res.setHeader("Set-Cookie", "loggedIn=true; Max-Age=10000");
  req.session.isLoggedIn = true;
  res.redirect("/");
};
