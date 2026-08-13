const mongoose=require('mongoose');
const initData=require('./data.js');
const Listing=require("../models/listing.js");


async function Main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

Main().then((res)=>{
    console.log("Database connected successfuly");
}).catch((err)=>{
    console.log("Error connecting to Database");
});

const initDB=async()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj,owner:"6a71b4e52998afb2ade1898c"}));
    //for initData we take individual obj,destructure it,add owner and again add it back to initdata
    //to clear all the dta for initialization
    await Listing.insertMany(initData.data);
    console.log("Data was initialized");
}

initDB();