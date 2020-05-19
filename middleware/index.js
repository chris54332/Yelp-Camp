//all the middleware goes here
let Comment = require("../models/comment"),
middlewareObj = {};

middlewareObj.checkCommentOwnership = (req, res, next) => {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, (err, foundComment) => {
            if (err) {
                res.redirect("back");
            } else {
                // does user own comment?
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    // req.flash("error", "You don't have permission to do that")
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    } else {
        req.flash('red', 'You need to login first!');
        res.redirect("/login");
    }
}

middlewareObj.checkUserAdmin = (req, res, next) => {
    if (req.isAuthenticated() && req.user.role == "admin") {
        return next();
    } else {
        res.redirect("back");
    }
}

module.exports = middlewareObj;