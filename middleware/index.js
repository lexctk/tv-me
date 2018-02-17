var Tvtitle = require ("../models/tvtitle"), 
    Comment = require ("../models/comment");

var middlewareObject = {};

middlewareObject.isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.session.returnTo = req.originalUrl;
    res.redirect("/login");    
};

middlewareObject.isOwner = function (req, res, next) {
    if (req.isAuthenticated()) {
        Tvtitle.findById (req.params.id, function (error, title) {
            if (error) {
                console.log ("Couldn't find title to authenticate " + error);
                res.redirect("back");
            } else {
                if (title.author.equals(req.user._id)) {
                    next();
                } else {
                    console.log ("You're not allowed to do that!");
                    res.redirect ("back");
                }
            }
        });
    } else {
        console.log ("You need to be logged in to do that!");
        req.session.returnTo = req.originalUrl;
        res.redirect("/login");
    }
};

middlewareObject.isCommentOwner = function (req, res, next) {
    if (req.isAuthenticated()) {
        Comment.findById (req.params.idComment, function (error, comment) {
            if (error) {
                console.log ("Couldn't find comment to authenticate " + error);
                res.redirect("back");
            } else {
                if (comment.author.equals(req.user._id)) {
                    next();
                } else {
                    console.log ("You're not allowed to do that!");
                    res.redirect ("back");
                }
            }
        });
    } else {
        console.log ("You need to be logged in to do that!");
        req.session.returnTo = req.originalUrl;
        res.redirect("/login");
    }
};

module.exports = middlewareObject;