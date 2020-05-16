let express = require("express");
var router = express.Router({mergeParams: true});
Sandwich = require("../models/sandwich");
Comment = require("../models/comment");

router.get('/new', isLoggedIn, (req,res)=>{
    Sandwich.findById(req.params.id,(err, sandwich)=>{
        if(err){
            console.log(err);
        }else{
            res.render("comments/new", {sandwich: sandwich});
        }
    })
})
//Comments Create
router.post('/', isLoggedIn, (req,res)=>{
    Sandwich.findById(req.params.id, (err,sandwich)=>{
        if(err){
            console.log(err);
            res.redirect('/sandwiches');
        }else{
            Comment.create(req.body.comment, (err, comment)=>{
                if(err){
                    console.log(err);
                }else{  
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    sandwich.comments.push(comment);
                    sandwich.save();
                    res.redirect('/sandwiches/' + sandwich._id);
                }
            })
        }
    });
}) 

//middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }else{
        res.redirect("/login");    
    }
}

module.exports = router;
