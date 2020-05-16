let express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

//INDEX
router.get('/',(req,res)=>{res.redirect('/sandwiches');}); 
router.get("/home",(req,res)=>{res.render("index");});

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
            res.redirect("/sandwiches");
        });
    })
})
//handling log in
router.get("/login", (req,res)=>{
    res.render("login");
})
router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/sandwiches",
        failureRedirect: "/login"
    }),(req,res)=>{
})

router.get("/logout", (req, res)=>{
    req.logout();
    res.redirect("/sandwiches");
})

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }else{
        res.redirect("/login");    
    }
}

module.exports = router;
