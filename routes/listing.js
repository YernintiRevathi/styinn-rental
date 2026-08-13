const express=require("express");
const router=express.Router();
const mongoose=require('mongoose');

const wrapAsync=require("../utils/wrapAsync.js");
const Listing=require("../models/listing.js");
const multer  = require('multer');//used to parse form data where files are uploaded
const {storage}=require("../cloudConfig.js");
const upload = multer({storage});//gets the files from form and saves them in storage(cloudinary storage we created)
// const upload = multer({ dest: 'uploads/' });//gets the files from form and saves them in a foloder "uploads"(creates the folder if doesn't exist)

const {validateListing,isLoggedIn,isOwnerOfListing,destroyListingsCloudinary,}=require("../middleware.js");

const listingController=require("../controllers/listings.js");

router
    .route("/")
    .get(wrapAsync(listingController.index))//index route (shows all listings)
    .post(isLoggedIn,upload.single('listing[image]'),wrapAsync(listingController.createListing));//(after new)Route for Creating a listing 
    //checks if user is loggedin,if listing is valid,multer processes our image data that's inside listing and then we create the listing

//new listing
router.get("/new",isLoggedIn,wrapAsync(listingController.newListing));
//if we place this route after the show route,then express get confused and thinks new as some id too and error occurs

router  
    .route("/:id")
    .get(wrapAsync(listingController.showListing))//show route
    .put(isLoggedIn,isOwnerOfListing,upload.single('listing[image]'),validateListing,wrapAsync(listingController.updateListing))//(after edit)update route
    .delete(isLoggedIn,isOwnerOfListing,destroyListingsCloudinary,wrapAsync(listingController.destroyListing));//delete route



//edit listing route
router.get("/:id/edit",isLoggedIn,isOwnerOfListing,wrapAsync(listingController.editListing));

//searching
// router.get("/:search",wrapAsync(listingController.searchListing));

module.exports=router;