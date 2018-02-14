var express     = require ("express"),
    app         = express (),
    bodyParser  = require ("body-parser"),
    mongoose    = require ("mongoose"),

    // authentication
    passport        = require ("passport"),
    LocalStrategy   = require ("passport-local"),

    // models
    User    = require ("./models/user"),

    // routes
    moviesRoutes         = require ("./routes/movies"),
    commentsRoutes       = require ("./routes/comments"),
    authenticationRoutes = require ("./routes/authentication");

// seeding database
var seedDB = require ("./seeds");

mongoose.connect("mongodb://localhost/tvtitle");

app.set ("view engine", "ejs");

app.use (express.static(__dirname + "/public"));
app.use (bodyParser.urlencoded( { extended : true } ));

// authentication
app.use (require("express-session")({
    secret: "Some phrase", //TODO: figure out how to exclude from github
    resave: false,
    saveUninitialized: false
}));
app.use (passport.initialize());
app.use (passport.session());
passport.use (new LocalStrategy(User.authenticate()));
passport.serializeUser (User.serializeUser());
passport.deserializeUser (User.deserializeUser());

// middleware that runs on every route
app.use (function (req, res, next) {
    res.locals.currentUser = req.user;
    next();
});

// use routes
app.use (authenticationRoutes);
app.use ("/movies", moviesRoutes);
app.use ("/movies/:id/comments", commentsRoutes);


// seeding database
// seedDB();

// root
app.get ("/", function (req, res) {
    res.render("index");  
});

// listen
app.listen (process.env.PORT, process.env.IP, function () {
    console.log ("Server listening"); 
});
