if(process.env.NODE_ENV !="production"){
    //use dotenv only when we are not in production
    require('dotenv').config();
}

const express =require('express');
const app= express();
const mongoose=require('mongoose');
const path=require("path");
const methodOverride=require('method-override');
const ejsMate=require('ejs-mate');
const ExpressError=require("./utils/ExpressError.js");
const session=require("express-session");
const {MongoStore} = require('connect-mongo');

const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");

//routes
const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");
const wrapAsync = require('./utils/wrapAsync.js');

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate); // use ejs-locals for all ejs templates:
app.use(express.static(path.join(__dirname,"/public")));

//the above id remains in app.js ,it doesn't get passed to reviews.js
//so we use mergeParams:true in reviews.js to get the id from app.js(from parent router) to child router(reviews.js))


const mongoAtlas=process.env.MONGOATLAS;
//~~~~~~~~~the below one is for mongo connect session
const store=MongoStore.create({
    mongoUrl:mongoAtlas,//we can give our local mongoDb storage if we want to store session there
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*60*60//Interval (in seconds) between session updates
});

store.on("error",()=>{
    console.log("Error in mongo session store");
});



const sessionOptions={
    store,//without this store,this sessionOptions is for express-session
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+ (7*24*60*60*1000),//7 days in millisec
        maxAge: 7*24*60*60*1000,
        httpOnly:true,
    }
};
app.use(session(sessionOptions));
//~~~~~~~~~the above are for express-session storage

app.use(flash());

//passport uses session as we don't login again and again for diff pages
app.use(passport.initialize());//initializes passport
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));//means we need to authenticate users for every request we get

passport.serializeUser(User.serializeUser());//to serialize(store) users into the session
passport.deserializeUser(User.deserializeUser());//to deserialize(unstore) users into the session


app.use((req,res,next)=>{
    res.locals.success=req.flash("success");//any success message is store in here temporarily
    // console.log(req.flash("success"));
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    console.log(res.locals.currUser);
    //beacuse reqor req.user are only accessible in backedn 
    //so,we stored it in res.locals to make it globally available to all ejs templates
    // Express provides res.locals as a special object meant specifically for exposing variables to the frontend.
    next();
});


//these routes must be used after flash because we use flash with these route
app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);


async function Main(){
    await mongoose.connect(mongoAtlas);
}

Main().then((res)=>{
    console.log("Database connected successfuly");
}).catch((err)=>{
    console.log("Error connecting to Database");
});


app.get("/",(req,res)=>{
    // res.send("Welcome to WANDERLUST <br> go to listings to see the listings of places");
    res.redirect("/listings");
});


app.use((req,res,next)=>{
    // app.all("*",(req,res,next)=>{ this syntax works for express version 4
    //this middleware is for all types of paths
    //if the path by client is match to any routes before and response is sent,
    //then this middleware is not used
    next(new ExpressError(404,"Page Not Found"));
});


app.use("",(err,req,res,next)=>{
    let {statusCode=500,message="Something went WRONG!!"}=err;
    // req.flash("error",message);
    // // res.locals.error=req.flash("error"); we shouldn't read here as this message is read here and when we do redirect that message dies
    // res.redirect("/listings");
    res.render("error",{err});
    // res.status(statusCode).send(message);
});

app.listen(8080,()=>{
    console.log("Server is running on port 8080");
});