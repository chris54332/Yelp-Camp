let formidable = require('formidable'),
    path       = require('path'),
    fs         = require('fs'),
    url        = require('url');

// expressSanitizer = require("express-sanitizer"),
const methodOverride        = require("method-override"),
      bodyParser            = require('body-parser'), 
      express               = require('express'),
      copyPath              = "-RENAMED/",
      mongoose              = require('mongoose'),
      Sandwich              = require("./models/sandwich"),
      Comment               = require("./models/comment"),
      User                  = require("./models/user"),
      seedDB                = require("./seeds"),
      passport              =  require("passport"), 
      LocalStrategy         = require("passport-local"),
      passportLocalMongoose = require("passport-local-mongoose"),
      //ROUTES
      commentRoutes         = require("./routes/comments"),
      sandwichRoutes        = require("./routes/sandwiches"),
      indexRoutes           = require("./routes/index");
      
mongoose.connect('mongodb://localhost:27017/danneys_db_v2', {useNewUrlParser: true, useUnifiedTopology: true});
      
app = express();
      
app.set(express.static("public"));
app.use(express.static(__dirname + '/public'));
// app.use(expressSanitizer());
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({extended: true}));
app.set('port', process.env.PORT || 3000);
app.set('view engine','ejs');

seedDB(); //seed the database

//PASSPORT CONFIG

app.use(bodyParser.urlencoded({extended: true}));
app.use(require("express-session")({
    secret: "Test 2",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.currentUser = req.user;
    next();
});
app.use("/", indexRoutes);
app.use("/sandwiches/:id/comments", commentRoutes);
app.use("/sandwiches/", sandwichRoutes);


//Binding to localhost://3000
app.listen(3000,()=>{
 console.log('App is running');
});