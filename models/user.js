const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const passportLocalMongoose=require("passport-local-mongoose");

const userSchema= new Schema({
    email: {
        type:String,
        required:true
    },//username,hashing,salting and hashed password are automatically implemeted by passport-local-mongoose
    //and also adds some methods like authenticate,setpassword,getpassword,register etc.,. by default
});

userSchema.plugin(passportLocalMongoose.default);
// Node.js imports the library as a wrapper object due to ES Module compatibility.
// We must pass the actual function (.default) to the plugin, not the object wrapper.

const User=mongoose.model("User",userSchema);

module.exports=User;