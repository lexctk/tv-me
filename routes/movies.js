var express = require ("express"),
    router  = express.Router ();

var Tvtitle = require ("../models/tvtitle"),
    Comment = require ("../models/comment");

var middleware = require ("../middleware");

//======================
// Movie routes
//======================

// INDEX route - Show all movies
router.get ("/", function (req, res) {
    //get all movies from the database
    Tvtitle.find ({}, function (error, movies) {
        if (error) {
            console.log ("Couldn't find all " + error);
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
    var title = req.body.title;
    title.slug = slugify (req.body.title.name);
    title.author = req.user._id;
    
    Tvtitle.create (title, function (error, title) {
        if (error) {
            console.log("Couldn't create title " + title + error);
        } else {
            res.redirect ("/movies");
        }
    }); 
});

// SHOW route - Show info for one title
router.get ("/:id", function (req, res) {
    //find movie in db, populate both comments and author
    Tvtitle.findById (req.params.id).populate("comments author").exec(function (error, title){
        if (error) {
            console.log (error);
        } else {
            // populate any comments with comment author name
            Comment.populate (title, {
                path: "comments.author",
                select: "username",
                model: "User"
            }, function (error, title) {
                // render show page:
                res.render ("movies/show", {title : title});                
            });
        }
    });
});

// EDIT route - show form to edit
router.get ("/:id/edit", middleware.isOwner, function (req, res) {
    Tvtitle.findById (req.params.id).populate("author").exec (function (error, title) {
        if (error) {
            console.log ("Couldn't find title to edit " + error);
        } else {
            res.render ("movies/edit", {title : title});
        }
    });
});

// UPDATE route - update title
router.put ("/:id", middleware.isOwner, function (req, res) {
    //re-slugify for updated title!
    req.body.title.slug = slugify(req.body.title.name);
    
    Tvtitle.findByIdAndUpdate (req.params.id, req.body.title, function (error, title) {
        if (error) {
            console.log ("Couldn't find and update " + error);
        } else {
            res.redirect ("/movies/" + req.params.id);
        }
    });
});

// DESTROY route
router.delete ("/:id", middleware.isOwner, function (req, res) {
    
    // delete all associated comments
    Tvtitle.findById (req.params.id).populate("comments").exec (function (error, title) {
        if (error) {
            console.log ("Couldn't show title page " + error);
        } else {
            title.comments.forEach (function (comment) {
                Comment.findByIdAndRemove(comment._id, function (error) {
                    if (error) {
                        console.log ("Couldn't delete comment " + comment._id + error);
                    } else {
                        console.log ("Deleted " + comment._id);
                    }
                });
            });
        }
    });
    
    Tvtitle.findByIdAndRemove(req.params.id, function (error, title) {
        if (error) {
            console.log ("Couldn't delete title " + error);
        } else {
            res.redirect ("/movies");
        }
    });
});

// used to turn title into slug
function slugify (text) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}

module.exports = router;