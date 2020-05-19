// expressSanitizer = require("express-sanitizer"),
let methodOverride = require("method-override"),
    bodyParser = require('body-parser'),
    express = require('express'),
    copyPath = "-RENAMED/",
    mongoose = require('mongoose'),
    Campground = require("./models/campground"),
    Comment = require("./models/comment"),
    User = require("./models/user"),
    // seedDB = require("./seeds"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose"),
    flash = require("connect-flash"),
    //ROUTES
    commentRoutes = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes = require("./routes/index");

const URI = "mongodb+srv://admin:pass@cluster0-v7x25.mongodb.net/test?retryWrites=true&w=majority";

mongoose.connect(URI, { useNewUrlParser: true });

app = express();

app.set(express.static("public"));
app.use(express.static(__dirname + '/public'));
// app.use(expressSanitizer());
app.use(methodOverride("_method"));
app.set('port', process.env.PORT || 3000);
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(flash());

// seedDB(); //seed the database

//PASSPORT CONFIG
app.use(require("express-session")({
    secret: "Secret testing",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.message = req.flash("error");
    res.locals.red = req.flash('red');
    res.locals.green = req.flash('green');
    res.locals.error = req.flash('error');
    next();
});
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use("/", indexRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds/", campgroundRoutes);


//Binding to localhost://3000
app.listen(3000, () => {
    console.log('App is running');
});