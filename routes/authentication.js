var express  = require ("express"),
    router   = express.Router (),
    passport = require ("passport");
    
var User = require ("../models/user");

//======================
// Authentication routes
//======================

router.get("/register", function (req, res) {
    res.render("register");
})

router.post("/register", function (req, res) {
    User.register(new User({username: req.body.username, email: req.body.email}), req.body.password, function (error, user) {
        if (error) {
            console.log ("Couldn't register " + error);
            return res.render ("register");
        }
        passport.authenticate ("local")(req, res, function (){
            res.redirect("/movies");
        });
    });
});

// show login form
router.get("/login", function (req, res) {
    res.render ("login");
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/movies",
    failureRedirect: "/login"
}), function (req, res) {
        
});

router.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/");
});

module.exports = router;