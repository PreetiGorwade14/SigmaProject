const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../Models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
main().then(()=>{
    console.log("Connected to Database");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () =>{
    await Listing.deleteMany({});//delete all the trash in the listing collection before adding new document 
    initData.data = initData.data.map((obj) => ({...obj, owner:"670d0b4328766ac4ce6a2bb5",}));
    // This line will add the owner to all listings
    await Listing.insertMany(initData.data);
    console.log("Data was initialized successfully");
}

initDB();