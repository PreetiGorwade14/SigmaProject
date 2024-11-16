const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
    title :{
        type : String,
        required :true,
    },
    description : {
        type : String,
        
    },
    image :{
        url :String,
        filename:String,
    },
    price : {
        type : Number,
    },
    location : {
        type : String,
    },
    country : {
        type : String,
    },
    review : [
        {
            type : Schema.Types.ObjectId,
            ref : "Review",
        }
    ],
    owner : {
        type : Schema.Types.ObjectId,
        ref : "User",
    },
    geometry :{
        type: {   //used from mongoose geojson
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
      }
});


// to delete all the reviews which are linked with a listing when a particular listing is deleted.
// post mongoose middleware to delete reviews after deleting a listing
listingSchema.post("findOneAndDelete",async(listing) =>{
    if(listing){
        await Review.deleteMany({_id : {$in :listing.review}});
    }
});

const Listing = mongoose.model("listing",listingSchema);

module.exports = Listing;