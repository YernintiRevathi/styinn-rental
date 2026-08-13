const Listing=require("../models/listing");
const User=require("../models/user");
const {cloudinary}=require("../cloudConfig.js");
const maptilerClient =require("@maptiler/client");
const mapToken=process.env.MAP_TOKEN;
maptilerClient.config.apiKey=mapToken;

//all listings page
module.exports.index=async (req,res)=>{
    // console.log("GET /listings");
    // console.log("seachbar",req.query);
    let {search}=req.query;
    
    query={};
    if (search){
        let searchNumber=Number(search);
        if(!isNaN(searchNumber)){
            query={ 
                $expr:{
                    $regexMatch:{//
                        input:{$toString: "$price"},//converts the price field of db to string
                        //input is the source text to look into
                        regex:search,//regex
                        options:"i"//case insensitive
                        // '$' is not needed for input,regex,options as we already mentioned and $regexMatch
                    }
                }
            };
        }
        else{
            const matchingUsers=await User.find({
                username:{$regex:search,$options:"i"}
            });//finding users with regex name
            const userIds=matchingUsers.map(user=>user._id);//getting the ids of those users found
            query={
                $or:[
                    {title:{ $regex:search, $options:"i"}},
                    {description:{ $regex:search, $options:"i"}},
                    {location:{$regex:search, $options:"i"}},
                    {country: {$regex:search, $options:"i"}},
                    {owner: {$in:userIds}},//search in listing whose owner has any of those ids
                ]
            };
        }
    }
    const listings=await Listing.find(query);
    res.render("listings/index.ejs",{listings});
    //Express will automatically look inside the views folder.
    // So we shouldn't write like "/listings/index.ejs"
};

//new listing form page
module.exports.newListing=async(req,res)=>{
    // console.log(req.user);
    res.render("listings/new.ejs");
};

//show page
module.exports.showListing=async  (req,res)=>{
    let {id} =req.params;
    const listing=await Listing.findById(id).populate({
        path:"reviews",
        populate:{
            path:"author"
        }
    }).populate("owner");
    if (!listing){
        req.flash("error","Listing you requested for does not exist!!")
        return res.redirect("/listings"); //Adding return before res.redirect() stops the function execution immediately. 
        //This prevents the server from running res.render() after a redirect has already been initiated.
    }
    // console.log(listing);
    res.render("listings/show.ejs",{listing});
};


//after new listing
module.exports.createListing=async (req,res)=>{
    // if(!req.body.listing){
    //     throw new ExpressError(400,"Send valid data for listing");
    // }
    // console.log("req.body",req.body);

    let response = await maptilerClient.geocoding.forward(
        req.body.listing.location,
        { limit: 1}
    );
    
    // console.log("\n"+url,+" "+filename);
    const newListing= new Listing(req.body.listing);
    // console.log("after new",newListing);
    // console.log("req.user",req.user);
    newListing.owner=req.user._id;
    if(req.file){
        let url=req.file.path;
        let filename=req.file.filename;
        newListing.image={url,filename};
    }
    // console.log("coordinates from geocoding",response,"features\n",response.features);
    // console.log("\ngeometry",response.features[0].geometry.coordinates);
    newListing.geometry=response.features[0].geometry;
    let savedListing=await newListing.save();
    console.log("savedListing\n",savedListing)
    req.flash("success","New Listing Created successfully!!");
    res.redirect("/listings");

    // comment out redirect and  use below one when using hoppscotch
    //because the hoppscotch is sending the same old request type to redirected page
    //i.e., it is sending post request to listings instead of get(new method)
    // res.json({
    //     success: true
    // });
};

//edit listing page
module.exports.editListing=async  (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    if (!listing){
        req.flash("error","Listing you requested for does not exist!!")
        return res.redirect("/listings"); 
    }
    let originalImageUrl=listing.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/h_200,w_250");//changes the image size 
    // listing.image.url=originalImageUrl;
    res.render("listings/edit",{listing,originalImageUrl});
};

//after editing
module.exports.updateListing=async (req,res)=>{
    // if(!req.body.listing){
    //     //but this check if listing object exists
    //     //but if few fields are missing while sending through postman
    //     //this doesn't throw error
    //     throw new ExpressError(400,"Send valid data for listing");
    // }
    let {id}=req.params;
    let updatedListing=await Listing.findByIdAndUpdate(id,{...req.body.listing},{runValidators:true,new:true});
    
    if(req.file){// or if(typeof req.file !=="undefined")
        if(updatedListing.image && updatedListing.image.filename){
            await cloudinary.uploader.destroy(updatedListing.image.filename);
        }

        let url=req.file.path;
        let filename=req.file.filename;

        updatedListing.image={url,filename};

        await updatedListing.save();

    }

    req.flash("success","Listings Updated successfully!!");
    res.redirect(`/listings/${id}`);
    //we are deconstructin the listing object,means here we send the key value pairs for updation
};

//deleting listing
module.exports.destroyListing=async (req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted successfully!!");
    res.redirect("/listings");
};
