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
    image: String,
    slug: String,
    description: String
});

//compiling schema into a model
var Tvtitle = mongoose.model("Tvtitle", tvtitleSchema);

//routes
app.get("/", function (req, res) {
    res.render("index");  
});

//INDEX route - Show all movies
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

//NEW route - Show form to add new movie
app.get ("/movies/new", function (req, res) {
    res.render("new");
});

//CREATE route - Add new movie to db
app.post("/movies", function (req, res) {
    //get data from form POST action
    var title = new Tvtitle ({
        name: req.body.name,
        image: req.body.image,
        slug: slugify(req.body.name),
        description: req.body.description
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

//SHOW route - Show info for one title
app.get("/movies/:id", function (req, res) {
    //find movie in db
    Tvtitle.findById (req.params.id, function (error, title){
        if (error) {
            console.log(error);
        } else {
            //render show page:
            res.render("show", {title : title});
        }
    });
});

//listen
app.listen (process.env.PORT, process.env.IP, function () {
    console.log ("Server listening"); 
});


//used to turn title into slug
function slugify(text) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}