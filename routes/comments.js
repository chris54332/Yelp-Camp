let express = require("express"),
middleware = require("../middleware"),
router = express.Router({ mergeParams: true }),
Campground = require("../models/campground"),
Comment = require("../models/comment");

router.get('/new', middleware.isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", { campground : campground });
        }
    })
})
//Comments Create
router.post('/', middleware.isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log(err);
            res.redirect('/campgrounds');
        } else {
            Comment.create(req.body.comment, (err, comment) => {
                if (err) {
                    console.log(err);
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.created = Date.now();
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    req.flash('green', 'Comment added successfully!');
                    res.redirect('/campgrounds/' + campground._id);
                }
            })
        }
    });
})
//EDIT ROUTE
router.get("/:comment_id/edit", (req, res) => {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
        if (err) {
            res.redirect("back");
        } else {
            res.render("comments/edit", { campgrounds_id: req.params.id, comment: foundComment });
        }
    })
});
//UPDATE ROUTE

router.put('/:comment_id', middleware.checkCommentOwnership, (req, res)=> {
    let newcomment = req.body.comment;
    // newcomment.updated = Date.now();
    Comment.findByIdAndUpdate(req.params.comment_id, newcomment, (err, newComment)=> {
      if (err) {
        console.log(err);
        res.render('error', {error: err});
      } else {
        //flash success comment message
        req.flash('green', 'Comment updated successfully!');
        res.redirect('/campground/' + req.params.id);
      }
    });
  });
  


router.delete("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndRemove(req.params.comment_id, (err) => {
        if (err) {
            res.redirect("back");
        } else {
            req.flash('green', 'Comment deleted successfully!');
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
})


module.exports = router;
