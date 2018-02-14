var express = require ("express"),
    router  = express.Router ({mergeParams: true});

var Tvtitle = require ("../models/tvtitle"),
    Comment = require ("../models/comment");
    
var middleware = require ("../middleware");

//======================
// Comments routes
//======================

// comments NEW
router.get ("/new", middleware.isLoggedIn, function (req, res) {
    Tvtitle.findById(req.params.id, function (error, title) {
        if (error) {
            console.log ("Couldn't find corresponding title " + error);
        } else {
            res.render("comments/new", {title : title});    
        }
    });
});

// comments CREATE
router.post ("/", middleware.isLoggedIn, function (req, res) {
    //find movie
    Tvtitle.findById(req.params.id, function(error, title) {
        if (error) {
            console.log ("Couldn't find corresponding title " + error);
        } else {
            Comment.create (req.body.comment, function (error, comment) {
                if (error) {
                    console.log ("Couldn't create comment " + error);
                } else {
                    comment.author = req.user._id;
                    comment.save (function (error, comment) {
                        if (error) {
                            console.log ("Couldn't save comment " + error);
                        }
                    });
                    
                    title.comments.push(comment._id);
                    title.save (function (error, title) {
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

module.exports = router;