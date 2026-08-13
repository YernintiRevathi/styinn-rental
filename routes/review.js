const express=require("express");
const router=express.Router({mergeParams:true});
const mongoose=require('mongoose');

const wrapAsync=require("../utils/wrapAsync.js");
const Listing=require("../models/listing.js");
const ExpressError=require("../utils/ExpressError.js");
const Review=require("../models/review.js");
const {validateReview,isLoggedIn,isAuthorOfReview}=require("../middleware.js");

const reviewController=require("../controllers/reviews.js");


//adding reviews
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createReview));

//deleting reviews
router.delete("/:reviewId",isLoggedIn,isAuthorOfReview,wrapAsync(reviewController.destroyReview));

module.exports=router;