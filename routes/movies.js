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
    var perPage = 8;
    var pageQuery = parseInt(req.query.page);
    var pageNumber = pageQuery ? pageQuery : 1;
    
    //get all movies from the database
    Tvtitle.find ({}).skip((perPage * pageNumber) - perPage).limit(perPage).exec (function (error, movies) {
        Tvtitle.count().exec (function (error, count) {
            if (error) {
                console.log (error);
                req.flash ("error", "Something went wrong!");
                res.redirect ("back");
            } else {
                res.render("movies/index", {
                        movies : movies,
                        current: pageNumber,
                        pages: Math.ceil(count / perPage)
                        
                });
            }
        });
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
        if (error || !title) {
            console.log(error);
            req.flash ("error", "Something went wrong!");
            res.redirect ("back");            
        } else {
            req.flash ("success", "Added new title!");
            res.redirect ("/movies");
        }
    }); 
});

// SHOW route - Show info for one title
router.get ("/:id", function (req, res) {
    //find movie in db, populate both comments and author
    Tvtitle.findById (req.params.id).populate("comments author").exec(function (error, title){
        if (error || !title) {
            console.log (error);
            req.flash ("error", "Something went wrong!");
            res.redirect ("back");            
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
router.get ("/:id/edit", middleware.isLoggedIn, middleware.isTitleOwner, function (req, res) {
    Tvtitle.findById (req.params.id).populate("author").exec (function (error, title) {
        if (error || !title) {
            console.log (error);
            req.flash ("error", "Something went wrong!");
            res.redirect ("back");            
        } else {
            res.render ("movies/edit", {title : title});
        }
    });
});

// UPDATE route - update title
router.put ("/:id", middleware.isLoggedIn, middleware.isTitleOwner, function (req, res) {
    //re-slugify for updated title!
    req.body.title.slug = slugify(req.body.title.name);
    req.body.title.updatedAt = new Date();
    
    Tvtitle.findByIdAndUpdate (req.params.id, req.body.title, function (error, title) {
        if (error || !title) {
            console.log (error);
            req.flash ("error", "Something went wrong!");
            res.redirect ("back");            
        } else {
            req.flash ("success", "Info updated");
            res.redirect ("/movies/" + req.params.id);
        }
    });
});

// DESTROY route
router.delete ("/:id", middleware.isLoggedIn, middleware.isTitleOwner, function (req, res) {
    
    // delete all associated comments
    Tvtitle.findById (req.params.id).populate("comments").exec (function (error, title) {
        if (error || !title) {
            console.log (error);
            req.flash ("error", "Something went wrong!");
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
        if (error || !title) {
            console.log (error);
            req.flash ("error", "Something went wrong!");
            res.redirect ("back");            
        } else {
            req.flash ("success", "Title deleted!");
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