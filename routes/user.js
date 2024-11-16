const express = require("express");
const router = express.Router();
const User = require("../Models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { isLoggedIn } = require("../middleware.js");
const { saveRedirectUrl } = require("../middleware.js");

const userController = require("../controllers/users.js");

//combing both get and post routes
router
  .route("/signup")
  .get(userController.renderSignupForm)
  .post(wrapAsync(userController.signup));

//separate get and post routes
// router.get("/signup",userController.renderSignupForm);

// router.post("/signup", wrapAsync(userController.signup));

//combining get and post login routes
router
  .route("/login")
  .get(userController.renderLoginForm)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.login
  );

//separate login router before combining the routes
//Login form
// router.get("/login",userController.renderLoginForm);

// passport.authenticate is a middleware for authenticating users who have already signed up
// router.post("/login",saveRedirectUrl,passport.authenticate("local",{failureRedirect:'/login', failureFlash:true }),userController.login);

router.get("/logout", userController.logout);
//req.logout((err)) is a default function in postman package that will log out the user if logged in.it will take a call back as parameter
module.exports = router;
