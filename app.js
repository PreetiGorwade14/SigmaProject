if(process.env.NODE_ENV != "production"){
    require('dotenv').config()
}//we should not use .env during production or deployment phase
console.log(process.env)

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const Listing = require("./Models/listing.js");
const path = require("path");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("./schema.js");
const Review = require("./Models/review.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./Models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");


// Connect to MongoDB
// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

dbUrl = process.env.ATLASDB_URL;

main().then(()=>{
    console.log("Connected to Database");
})
.catch((err) => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);
}

//middlewares
app.set("view engine", "ejs");
app.set("views",path.join(__dirname, "views"));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto :{
        secret: process.env.SECRET,
    },
    touchAfter: 24*3600,
});

store.on('error',()=>{
    console.log("Error in MONGO SESSION STORE",err);
});

const sessionOptions = {
    store,
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized : true,
    cookie : {
        expires : Date.now()+1000*60*60*24*3,
        maxAge : 1000*60*60*24*3,
        httpOnly : true,
    }
};


// app.get("/", (req,res) =>{
//     res.send("hi i am root");
// });

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());  //store user info
passport.deserializeUser(User.deserializeUser()); //remove user info

app.use((req,res,next) =>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user//used in displaying login logout and sign up options in frontend.
    next();
});

// app.get("/demoUser",async(req,res) =>{
//     let fakeUser = new User({
//         email :"student@gmail.com",
//         username:"sigma-student",
//     });
//     let registeredUser = await User.register(fakeUser,"hello"); //register is built in method where first parameter is user details and second is password
//     res.send(registeredUser);
// });

app.use("/listings",listingRouter);
app.use("/listings/:id/review",reviewRouter);
app.use("/",userRouter);

app.all("*",(req,res,next) =>{
    next(new ExpressError(404, "Page not found!"));
});

//error handling middleware
app.use((err,req,res,next) =>{
    let {statusCode=500, message="Something went wrong"} = err;
    res.status(statusCode).render("error.ejs",{message});
  
});

app.listen(3000,() =>{
    console.log("Server is listening on port 3000");
});