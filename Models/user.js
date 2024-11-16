const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    email : {
        type : String,
        required : true,
    }
});  // by default passport-local-mongoose will add the username and password and salt fields to the password..

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);