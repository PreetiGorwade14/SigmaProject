const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../Models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer  = require('multer')
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });//initialization of multer all images will be stored in folder called upload

//Combining both get and post route with router.route method as they have same path i.e "/"
router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    upload.single('listing[image]'),validateListing,
    wrapAsync(listingController.createListing)
  );

//to create new listing
router.get("/new", isLoggedIn, listingController.renderNewForm);

//combining get (id) and put (id) and delete (id)
router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingController.updateListing)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));

//separate index Route
// router.get("/",wrapAsync(listingController.index));

//(separate router before combining the routes)Show Route to display details of specific listings based on the title of the listing
// router.get("/:id",wrapAsync(listingController.showListing));

//separate post route create route
// router.post("/",isLoggedIn,
//      validateListing,wrapAsync(listingController.createListing));

//edit route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.editListing)
);

//update route(separate router before combining the routes)
// router.put("/:id",isLoggedIn,isOwner,validateListing,wrapAsync(listingController.updateListing));

// separate router before combining the routes
// router.delete("/:id", isLoggedIn,isOwner,wrapAsync(listingController.deleteListing));

module.exports = router;
