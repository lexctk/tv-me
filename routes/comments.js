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
        if (error || !title) {
            console.log ("Couldn't find corresponding title " + error);
            req.flash ("error", "Couldn't find corresponding title!");
            res.redirect ("back");
        } else {
            res.render("comments/new", {title : title});    
        }
    });
});

// comments CREATE
router.post ("/", middleware.isLoggedIn, function (req, res) {
    //find movie
    Tvtitle.findById(req.params.id, function(error, title) {
        if (error || !title) {
            console.log (error);
            req.flash ("error", "Couldn't find corresponding title!");
            res.redirect ("back");            
        } else {
            req.body.comment.text = req.sanitize(req.body.comment.text);
            
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

// comments EDIT
router.get ("/:idComment/edit", middleware.isLoggedIn, middleware.isCommentOwner, function (req, res) {
    Tvtitle.findById(req.params.id, function (error, title) {
        if (error || !title) {
            console.log(error);
            req.flash ("error", "Couldn't find corresponding title!");
            res.redirect ("back");            
        } else {
            Comment.findById (req.params.idComment).populate("author").exec (function (error, comment) {
                if (error || !comment) {
                    console.log (error);
                    req.flash ("error", "Couldn't find comment!");
                    res.redirect ("back");                      
                } else {
                    res.render ("comments/edit", {comment : comment, title : req.params.id});
                }
            });            
        }
    });

});

// comments UPDATE
router.put ("/:idComment", middleware.isLoggedIn, middleware.isCommentOwner, function (req, res) {
    
    req.body.comment.text = req.sanitize(req.body.comment.text);
    req.body.comment.updateAt = new Date();
    
    Comment.findByIdAndUpdate (req.params.idComment, req.body.comment, function (error, comment) {
        if (error || !comment) {
            console.log (error);
            req.flash ("error", "Couldn't find comment!");
            res.redirect ("back");              
        } else {
            res.redirect ("/movies/" + req.params.id);
        }
    });
});


// comments DESTROY
router.delete ("/:idComment", middleware.isLoggedIn, middleware.isCommentOwner, function (req, res) {
    Comment.findByIdAndRemove (req.params.idComment, function (error, comment) {
        if (error || !comment) {
            console.log (error);
            req.flash ("error", "Couldn't find comment!");
            res.redirect ("back");              
        } else {
            // also deleting reference from title
            Tvtitle.update (
                { "comments" : req.params.idComment },
                { "$pull" : { "comments" : req.params.idComment } },
                function (error, title) {
                    if (error) {
                        console.log ("Couldn't update title to remove deleted comment");
                    } else {
                        res.redirect("/movies/" + req.params.id);
                    }
                }
            );
        }
    });
});

module.exports = router;