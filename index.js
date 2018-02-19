var express          = require ("express"),
    app              = express (),
    bodyParser       = require ("body-parser"),
    mongoose         = require ("mongoose"),
    methodOverride   = require ("method-override"),
    expressSanitizer = require ("express-sanitizer"),
    flash            = require ("connect-flash"),
    moment           = require('moment'),

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
// var seedDB = require ("./seeds");

app.locals.moment = moment;
app.locals.dateFormat = "MMMM Do YYYY";

var databaseURL = process.env.DATABASEURL || "mongodb://localhost/tvtitle";
mongoose.connect(databaseURL);

app.set ("view engine", "ejs");

app.use (express.static(__dirname + "/public"));
app.use (bodyParser.urlencoded( { extended : true } ));
app.use (methodOverride("_method"));
app.use (expressSanitizer());
app.use(flash());

// authentication
app.use (require("express-session")({
    secret: process.env.TVMESECRETKEY,
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
    res.locals.error = req.flash ("error");
    res.locals.success = req.flash ("success");
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
