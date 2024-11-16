const Review = require("../Models/review.js");
const Listing = require("../Models/listing.js");

module.exports.createRoute = async(req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    console.log(newReview);
    listing.review.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success","New Review Created successfully");

    res.redirect(`/listings/${listing._id}`);
}

module.exports.deleteReview = async(req,res)=>{
    let {id, reviewId} = req.params;

    await Listing.findByIdAndUpdate(id, {$pull: {review : reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted Successfully");

    res.redirect(`/listings/${id}`);
}