const Listing=require("../models/listing.js");
const User=require("../models/user.js");

module.exports.renderSignup=(req,res)=>{
    res.render("users/signup.ejs");
};

module.exports.renderLoginForm=(req,res)=>{
    res.render("users/login.ejs");
};

module.exports.login=async(req,res)=>{
    //"local"-strategy,
    // {failureRedirect:"/login"-redirect to here if authentication failed
    // failureFlash:true  -flash message if authentication failed 
    req.flash("success","Welcome back to WanderLust");
    let redirectUrl=res.locals.redirectUrl || "/listings"
    //but passport refreshes session data after autheticationn here
    //so the variable req.session.redirectUrl will be undefined
    //so we are using saveRedirectUrl middleware
    if(redirectUrl.includes("reviews")){
        const listingId=redirectUrl.split("/")[2];//localhost:8080/listings/6a71cafa1b85d14d4e43d6ff/reviews
        //when split id will be in index 2
        redirectUrl=`listings/${listingId}`;
    }
    res.redirect(redirectUrl);
};

module.exports.signup=async (req,res)=>{
    try{
        let {username,email,password}=req.body;
        const newUser=new User({username,email});
        const registeredUser=await User.register(newUser,password);
        // console.log(registeredUser);
        req.login(registeredUser,(err)=>{//parameter,callback function
            if(err){
                return next(err);
            }
            req.flash("success","Welcome back to WanderLust");
            return res.redirect("/listings");
        });
        // req.flash("success","Signed Up Successfully!! Please Login to WanderLust");
        // res.redirect("/login");
    }catch(err){
        req.flash("error",err.message);
        res.redirect("/signup");
    }
};

module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","You are logged out now!");
        res.redirect("/listings");
    });
};