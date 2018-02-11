var express = require ("express");
var app = express();
var bodyParser = require ("body-parser");
var mongoose = require ("mongoose");
var Tvtitle = require ("./models/tvtitle");
var Comment = require ("./models/comment");
var seedDB = require ("./seeds");

mongoose.connect("mongodb://localhost/tvtitle");
app.use (express.static(__dirname + "public"));
app.use (bodyParser.urlencoded( { extended : true } ));

app.set ("view engine", "ejs");

//temporary seed db function
//seedDB();

//routes
app.get ("/", function (req, res) {
    res.render("index");  
});

//INDEX route - Show all movies
app.get ("/movies", function (req, res) {
    //get all movies from the database
    Tvtitle.find ({}, function (error, movies) {
        if (error) {
            console.log (error);
        } else {
            res.render("movies/index", {movies : movies});
        }
    })
});

//NEW route - Show form to add new movie
app.get ("/movies/new", function (req, res) {
    res.render("movies/new");
});

//CREATE route - Add new movie to db
app.post ("/movies", function (req, res) {
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
app.get ("/movies/:id", function (req, res) {
    //find movie in db
    Tvtitle.findById (req.params.id).populate("comments").exec(function (error, title){
        if (error) {
            console.log(error);
        } else {
            //render show page:
            res.render("movies/show", {title : title});
        }
    });
});

//comments NEW
app.get ("/movies/:id/comments/new", function (req, res) {
    Tvtitle.findById(req.params.id, function (error, title) {
        if (error) {
            console.log ("Couldn't find corresponding title " + error);
        } else {
            res.render("comments/new", {title : title});    
        }
    });
});

//comments CREATE
app.post ("/movies/:id/comments", function (req, res) {
    //find movie
    Tvtitle.findById(req.params.id, function(error, title) {
        if (error) {
            console.log ("Couldn't find corresponding title " + error);
        } else {
            Comment.create(req.body.comment, function (error, comment) {
                if (error) {
                    console.log ("Couldn't create comment " + error);
                } else {
                    
                    title.comments.push(comment._id);
                    title.save( function (error, title) {
                        if (error) {
                            console.log("Couldn't save comment " + error);
                        } else {
                            res.redirect ("/movies/" + title._id);
                        }
                    });
                }
            });
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