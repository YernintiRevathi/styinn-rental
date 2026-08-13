const express=require("express");
const router=express.Router({mergeParams:true});
const mongoose=require('mongoose');
const passport=require("passport");
const LocalStrategy=require("passport-local");

const wrapAsync=require("../utils/wrapAsync.js");
const Listing=require("../models/listing.js");
const ExpressError=require("../utils/ExpressError.js");
const User=require("../models/user.js");
const {saveRedirectUrl}=require("../middleware.js");

const userController=require("../controllers/users.js");

router
    .route("/signup")
    .get(userController.renderSignup)//to signup
    .post(wrapAsync(userController.signup));//after signup (register)

router
    .route("/login")
    .get(userController.renderLoginForm)//to login
    .post(saveRedirectUrl,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),wrapAsync(userController.login));//after login

router.get("/logout",userController.logout);

module.exports=router;