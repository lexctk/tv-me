var mongoose = require ("mongoose");

//schema Setup
var tvtitleSchema = new mongoose.Schema({
    name: String,
    image: String,
    slug: String,
    description: String, 
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

//compiling schema into a model
module.exports = mongoose.model("Tvtitle", tvtitleSchema);