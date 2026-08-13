const Listing=require("./models/listing.js");
const Review=require("./models/review.js");
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("./schema.js");
const {cloudinary}=require("./cloudConfig.js");


module.exports.validateListing=(req,res,next)=>{
    if (!req.body || Object.keys(req.body).length === 0 || !req.body.listing) {
        throw new ExpressError(400, "Listing data is completely missing!");
    }
    let {error}=listingSchema.validate(req.body);
    if(error){
        // console.log(error.details);
        let errmsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errmsg);
    }
    else{
        next();
    }
};


module.exports.validateReview=(req,res,next)=>{
    if (!req.body || Object.keys(req.body).length === 0 || !req.body.review) {
        throw new ExpressError(400, "Review data is completely missing!");
    }
    let {error}=reviewSchema.validate(req.body);
    if(error){
        // console.log(error.details);
        let errmsg=error.details.map((el)=>el.message).join(",");
        // console.log("review schema ",errmsg)
        throw new ExpressError(400,errmsg);
    }
    else{
        next();
    }
};


module.exports.isLoggedIn=(req,res,next)=>{
    // console.log(req);
    // console.log(req.path,req.route.path,req.originalUrl);
    if (!req.isAuthenticated()){
        //
        req.session.redirectUrl=req.originalUrl;//req.session is accesssible to all middleware
        req.flash("error","You must be logged in to perform that operation");
        return res.redirect("/login");
    }
    next();
};


module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
};


module.exports.isOwnerOfListing=async (req,res,next)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing || !(res.locals.currUser) || !(res.locals.currUser._id.equals(listing.owner._id))){
        req.flash("error","Only the Author of this listing can modify!");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.isAuthorOfReview=async (req,res,next)=>{
    let {id,reviewId}=req.params;
    let review=await Review.findById(reviewId);
    if(!review || !(res.locals.currUser) || !(review.author) || !(res.locals.currUser._id.equals(review.author._id))){
        req.flash("error","Only the Author of this review can modify!");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.destroyListingsCloudinary=async(req,res,next)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);

    if(listing.image && listing.image.filename){
        await cloudinary.uploader.destroy(listing.image.filename);
    }
    next();
}