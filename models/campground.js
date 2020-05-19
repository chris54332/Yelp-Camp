let mongoose = require("mongoose");

let campgroundSchema = new mongoose.Schema({
    name:   String,
    image:  String,
    description: String,
    comments: [
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
        }
    ],
    price: Number,
    created: Number
});

module.exports = mongoose.model('Campground', campgroundSchema);
