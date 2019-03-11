const express = require("express");
const { check, body } = require("express-validator/check");

const authController = require("../controllers/auth");

const router = express.Router();

router.get("/login", authController.getLogin);

router.get("/signup", authController.getSignup);

router.post("/login", authController.postLogin);

router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .custom((value, { req }) => {
        if (value === "test@test.com")
          throw new Error("This email is forbidden!");
        return true;
      }),
    // another approach - should be the same, but to remeber
    // check is checking everything - req.body, cookies, header ...
    body(
      "password",
      "Please enter a password with minimum 5 alphanumeric characters!"
    )
      // second parameter in body, check is a default msg which will be send to the frontend
      .isLength({ min: 5 })
      .isAlphanumeric(),
    body("confirmPassword").custom((value, { req }) => {
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
