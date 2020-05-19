let express = require("express"),
    router = express.Router(),
    middleware = require("../middleware"),
    Campground = require("../models/campground");

// GET CAMPGROUNDS
router.get('/', (req, res) => {
    Campground.find({}, (err, allCampgrounds) => {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/index1", { campgrounds: allCampgrounds });
        }
    })
})

// POST CAMPGROUNDS
router.get('/new', middleware.isLoggedIn, (req, res) => { res.render("campgrounds/new"); })
router.post('/', middleware.isLoggedIn, (req, res) => {
    Campground.create(req.body.newCampground, (err, newlyCreated) => {
        if (err)
            console.log(err);
        else
            res.redirect("/campgrounds");
    });
})
// SHOW CAMPGROUNDS
router.get('/:id', (req, res) => {
    Campground.findById(req.params.id)
        .populate("comments")
        .exec(
            (err, foundCampground) => { 
                if (err) {
                    congole.log("did not work");
                    res.redirect("/campgrounds");
                } else {
                    console.log(foundCampground);
                    res.render("campgrounds/show", { campground: foundCampground });
                }
            });
})
//SHOW EDIT CAMPGROUNDS
router.get('/:id/edit', middleware.checkUserAdmin, (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        if (err) {
            console.log(err);
            res.send("Error page for id not found");
        } else {
            res.render("campgrounds/edit", { campground: foundCampground });
        }
    });
})
//PUT EDIT CAMPGROUNDS
router.put("/:id", middleware.checkUserAdmin, (req, res) => {
    Campground.findByIdAndUpdate(req.params.id, req.body.editSand, (err, editedCampground) => {
        if (err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect('/campgrounds/' + req.params.id);
        }
    })
})
router.delete("/:id", (req, res) => {
    Campground.findByIdAndRemove(req.params.id, (err, editedCampground) => {
        if (err) {
            res.redirect('/campgrounds/' + req.params.id);
        } else {
            res.redirect("/campgrounds");
        }
    })
})

module.exports = router;