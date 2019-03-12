const express = require("express");
const { check, body } = require("express-validator/check");

const authController = require("../controllers/auth");
const User = require("../models/user");

const router = express.Router();

router.get("/login", authController.getLogin);

router.get("/signup", authController.getSignup);

router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .normalizeEmail(),
    body(
      "password",
      "Remember a password needs minimum 5 alphanumeric characters!"
    )
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim()
  ],
  authController.postLogin
);

router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .custom((value, { req }) => {
        // if (value === "test@test.com")
        //   throw new Error("This email is forbidden!");
        // return true;
        //
        // up - just a reference; if in custom block/validation  there is no error
        // it means that it's ok, it can be async, ex-valid will wait
        // so we will find the user with the email or return a reject == error == validation fails
        return User.findOne({ email: value }).then(userDoc => {
          if (userDoc) return Promise.reject("Email exist already.");
        });
      })
      .normalizeEmail(),
    // another approach - should be the same, but to remeber
    // check is checking everything - req.body, cookies, header ...
    body(
      "password",
      "Please enter a password with minimum 5 alphanumeric characters!"
    )
      // second parameter in body, check is a default msg which will be send to the frontend
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim(),
    body("confirmPassword")
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password)
          throw new Error("Passwords need to match!");
        return true;
      })
  ],
  //just an exapmle, how we can add the custom validation pattern
  authController.postSignup
);

router.post("/logout", authController.postLogout);

router.get("/reset", authController.getReset);

router.post("/reset", authController.postReset);

router.get("/reset/:token", authController.getNewPassword);

router.post("/new-password", authController.postNewPassword);

module.exports = router;
