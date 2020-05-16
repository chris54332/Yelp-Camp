let express = require("express");
var router = express.Router();
var Sandwich = require("../models/sandwich");
// GET SANDWICHES
router.get('/',(req,res)=>{
    Sandwich.find({}, (err,allSandwiches)=>{
        if(err){
            console.log(err);
        }else {
            res.render("sandwiches/index1", {sandwiches:allSandwiches});
        }
    })
})

// POST SANDWICHES
router.get('/new', isLoggedIn, (req,res)=>{res.render("sandwiches/new");})
router.post('/', isLoggedIn, (req,res)=>{
    // req.body.newSandwich.body = req.sanitize(req.body.newSandwich.body);
    Sandwich.create(req.body.newSandwich,(err, newlyCreated)=>{
        if(err)
            console.log(err);
        else
            res.redirect("/sandwiches");
    });
})
// SHOW SANDWICHES
router.get('/:id', (req,res)=>{
    // res.send("This will be the show page");
    Sandwich.findById(req.params.id)
    .populate("comments")
    .exec(
        (err, foundSandwich)=>{ //this is not working
        if(err){
            congole.log("did not work");
            res.redirect("/sandwiches");
        }else{
            console.log(foundSandwich);
            res.render("sandwiches/show", {sandwich: foundSandwich});
        }
    });
})
//SHOW EDIT SANDWICHES
router.get('/:id/edit',(req, res)=>{
    Sandwich.findById(req.params.id, (err, foundSandwich)=>{
        if(err){
            console.log(err);
            res.send("Error page for id not found");
        }else{
            res.render("sandwiches/edit", {sandwich: foundSandwich});
        }
    });
})
//PUT EDIT SANDWICHES
router.put("/:id",(req,res)=>{
    // req.body.newSandwich.body = req.sanitize(req.body.newSandwich.body);
    Sandwich.findByIdAndUpdate(req.params.id, req.body.editSand, (err,editedSandwich)=>{
        if(err){
            res.redirect("/sandwiches");
        }else{
            res.redirect('/sandwiches/' + req.params.id);
        }
    })
})
router.delete("/:id",(req,res)=>{
    // res.send("REACHED THE DELETE PAGE");
    Sandwich.findByIdAndRemove(req.params.id, (err,editedSandwich)=>{
        if(err){
            res.redirect('/sandwiches/' + req.params.id);
        }else{
            res.redirect("/sandwiches");
        }
    })
})

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }else{
        res.redirect("/login");    
    }
}
module.exports = router;