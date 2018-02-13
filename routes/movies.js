var express = require ("express"),
    router  = express.Router ();

var Tvtitle = require ("../models/tvtitle");

var middleware = require ("../middleware");

//======================
// Movie routes
//======================

// INDEX route - Show all movies
router.get ("/", function (req, res) {
    //get all movies from the database
    Tvtitle.find ({}, function (error, movies) {
        if (error) {
            console.log (error);
        } else {
            res.render("movies/index", {movies : movies});
        }
    });
});

// NEW route - Show form to add new movie
router.get ("/new", middleware.isLoggedIn, function (req, res) {
    res.render("movies/new");
});

// CREATE route - Add new movie to db
router.post ("/", middleware.isLoggedIn, function (req, res) {
    // get data from form POST action
    var title = new Tvtitle ({
        name: req.body.name,
        image: req.body.image,
        slug: slugify(req.body.name),
        description: req.body.description
    });
    
    // save to database
    title.save ( function (error, title) {
        if (error) {
            console.log("Something went wrong");
            console.log(error);
        } else {
            console.log("Added a new title!");
            console.log(title);
        }
    }); 
    
    // redirect back to /movies page
    res.redirect ("/movies");
    
});

// SHOW route - Show info for one title
router.get ("/:id", function (req, res) {
    //find movie in db
    Tvtitle.findById (req.params.id).populate("comments").exec(function (error, title){
        if (error) {
            console.log(error);
        } else {
            // render show page:
            res.render("movies/show", {title : title});
        }
    });
});

module.exports = router;