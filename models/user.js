var mongoose = require ("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

// schema Setup
var userSchema = new mongoose.Schema ({
    username: { type: String, required: [true, "can't be blank"], unique: true, index: true},
    email: { type: String, required: [true, "can't be blank"], unique: true, index: true},
    password: String
}, {timestamps: true});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model ("User", userSchema);