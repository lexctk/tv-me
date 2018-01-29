var express = require ("express");
var app = express();
var bodyParser = require ("body-parser");
var mongoose = require ("mongoose");

mongoose.connect("mongodb://localhost/tvtitle");
app.use (express.static("public"));
app.use (bodyParser.urlencoded( { extended : true } ));

app.set ("view engine", "ejs");

//schema Setup
var tvtitleSchema = new mongoose.Schema({
    name: String,
    description: String,
    image: String
});

//compiling schema into a model
var Tvtitle = mongoose.model("Tvtitle", tvtitleSchema);

//routes
app.get("/", function (req, res) {
    res.render("index");  
});

app.get ("/movies/new", function (req, res) {
    res.render("new-movie");
});

app.get("/movies", function (req, res) {
    //get all movies from the database
    Tvtitle.find ({}, function (error, movies) {
        if (error) {
            console.log (error);
        } else {
            res.render("movies", {movies : movies});
        }
    })
});

app.post("/movies", function (req, res) {
    //get data from form POST action
    var title = new Tvtitle ({
        name: req.body.name,
        image: req.body.image
    });
    
    //save to database
    title.save ( function (error, title) {
        if (error) {
            console.log("Something went wrong");
            console.log(error);
        } else {
            console.log("Added a new title!");
            console.log(title);
        }
    }); 
    
    //redirect back to /movies page
    res.redirect ("/movies");
    
})

//listen
app.listen (process.env.PORT, process.env.IP, function () {
    console.log ("Server listening"); 
});