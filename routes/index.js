let express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");


// LANDING PAGE
router.get("/", function(req, res){
    res.render("landing");
});

// =================
//Auth routes

router.get("/register", (req,res)=>{
    res.render("register");
})
//handling user sign up
router.post("/register",(req,res)=>{
    User.register(new User({username: req.body.username}), req.body.password, (err, user)=>{
        if(err){
            console.log(err);
            return res.render('register');
        }
        passport.authenticate("local")(req,res,()=>{
            req.flash('green', 'Signed up successfully. Welcome ' + req.body.username + '!');
            res.redirect("/campgrounds");
        });
    })
})
//handling log in
router.get("/login", (req,res)=>{
    res.render("login");
});
router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      req.flash('red', err);
      res.redirect('/login');
    }
    if (!user) {
      req.flash('red', 'Invalid username or password.');
      res.redirect('/login');
    }
    req.logIn(user, function(err) {
      if (err) {
        req.flash('red', 'Oops login failed, please come back later.');
        res.redirect('/login');
      }
      req.flash('green', 'Logged in successfully. Welcome ' + req.body.username + '!');
      res.redirect('/campgrounds');
    });
  })(req, res, next);
})

router.get("/logout", (req, res)=>{
    req.logout();
    req.flash('green', 'Logged out successfully. See you next time ' + req.body.username + '!');
    res.redirect("/campgrounds");
})


module.exports = router;
