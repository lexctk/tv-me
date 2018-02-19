var Tvtitle = require ("../models/tvtitle"), 
    Comment = require ("../models/comment");

var middlewareObject = {};

middlewareObject.isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.session.returnTo = req.originalUrl;
    req.flash ("error", "You need to be logged in to do that!");
    res.redirect ("/login");
};

middlewareObject.isTitleOwner = function (req, res, next) {
    Tvtitle.findById (req.params.id, function (error, title) {
        if (error || !title) {
            req.flash ("error", "Title not found!");
            console.log (error);
            res.redirect("back");
        } else {
            if (title.author.equals(req.user._id)) {
                next();
            } else {
                req.flash ("error", "You don't have permission to do that!");
                res.redirect ("back");
            }
        }
    });
};

middlewareObject.isCommentOwner = function (req, res, next) {
    Comment.findById (req.params.idComment, function (error, comment) {
        if (error || !comment) {
            req.flash ("error", "Comment not found!");
            console.log (error);
            res.redirect("back");
        } else {
            if (comment.author.equals(req.user._id)) {
                next();
            } else {
                req.flash ("error", "You don't have permission to do that!");
                res.redirect ("back");
            }
        }
    });
};

module.exports = middlewareObject;