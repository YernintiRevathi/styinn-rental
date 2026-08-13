const Review=require("../models/review.js");
const Listing=require("../models/listing.js");

module.exports.createReview=async (req,res)=>{
    // console.log(req.params.id);
    let {id}=req.params;
    let {review}=req.body;
    let listing =await Listing.findById(id);
    review.author=req.user._id;
    // const newReview=new Review(review);
    // let result=await newReview.save();
    //we can do as above or below for insertion

    // console.log("create reviews",req.path);//this will be "/" as we send post request to / in reviews
    //though th ecomplete path is sth like /listings/:id/reviews/
    //this is because we have only / route in reviews and th ebefore one is in app.js
    let result= await Review.insertOne(review); //works only in newer versions
    // console.log("Review added",result);
    // listing.reviews.push(newReview); this or the below ,both work
    listing.reviews.push(result);
    await listing.save();
    req.flash("success","New Review Created successfully!!");
    res.redirect(`/listings/${id}`);
    // res.render("listings/show.ejs",{listing});
};

module.exports.destroyReview=async (req,res)=>{
    let {id,reviewId}=req.params;
    // console.log("DEleting review");
    await Review.findByIdAndDelete(reviewId);
    await Listing.updateOne(
        {_id:id},
        {$pull:{reviews:(reviewId)}}
    );
    //if the reviews are not deleted from listing but just from revies collection
    //then the reviews exist in listing document but are not shown on webpage
    //because of how Mongoose handles missing database references during population. 
    // if(listing.reviews.length==0)
    //this condition in show.ejs is also satified even if there are broken references in reviews
    //as we are checking after populating 
    req.flash("success","Review Deleted successfully!!");
    res.redirect(`/listings/${id}`);
};