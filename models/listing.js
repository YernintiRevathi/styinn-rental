const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const Review=require("./review.js");

const ListingSchema=new Schema({
    title:{
        type:String,
        required:true,
    },
    description:String,
    image:{
            url:{
                type:String,
                default:"https://images.unsplash.com/photo-1783962211635-ef0af72c7759?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                set:(v)=>
                    v===""?"https://images.unsplash.com/photo-1783962211635-ef0af72c7759?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D":v,
                    //set runs only when a value is assigned to the field
            },
            filename:String
    },
    price:Number,
    location:String,
    country:String,
    reviews:[
        {   
            type:Schema.Types.ObjectId,
            ref:"Review",
        }
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },
    geometry:{
        type: {//type details
        type: String, // Don't do `{ geometry: { type: String } }`
        enum: ['Point'], // 'geometry.type' must be 'Point'
        required: true
        },
        coordinates: {//coordinates field inside geometry
        type: [Number],
        required: true
        }
        //the geometry field inside database will be sth like this
        //geometry: {
        //     type: 'Point',
        //     coordinates: [ 83.29212952405214, 17.693552722599854 ]
        // }
    },
    // geometry:{ //coordinates
    //     type: [Number],
    //     required:true
    // }
    category:{
        type:String,
        enum:["trending","pools","beaches","camping","farms","mountains","arctic","castles","deserts","rooms","cities","islands"]
    },
});

ListingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in:listing.reviews}});
        // console.log("Message from listing model--All the reviews of this listing are deleted from reviews collection!!");
    }
});

const Listing=mongoose.model("Listing",ListingSchema);

module.exports=Listing;