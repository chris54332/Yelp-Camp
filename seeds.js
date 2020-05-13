let mongoose = require("mongoose"),
    Sandwich = require("./models/sandwich");
    Comment  = require("./models/comment");

let data = [
    {
        name: "Classic Burger",
        image: "https://cdn.cheapism.com/images/Potato_Chip_Burger.max-420x243.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut dapibus, justo vel luctus posuere, nulla ante elementum nisi, nec aliquet nunc ligula quis mauris. Quisque semper efficitur aliquet. Aliquam sagittis risus sed urna tempus, quis pretium nisl lobortis."
    },
    {
        name: "Italian Chicken",
        image: "https://img.sndimg.com/food/image/upload/c_thumb,q_80,w_412,h_232/v1/img/recipes/39/82/46/picWl8fuX.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut dapibus, justo vel luctus posuere, nulla ante elementum nisi, nec aliquet nunc ligula quis mauris. Quisque semper efficitur aliquet. Aliquam sagittis risus sed urna tempus, quis pretium nisl lobortis."
    }
];

function seedDB(){
    Sandwich.remove({}, (err)=>{
        if(err){
            console.log(err);
        }
        console.log("removed the data");
    });
    data.forEach((seed)=>{
        Sandwich.create(seed,(err, sandwich)=>{
                if(err){
                    console.log("error creating model: " + error);
                }else{
                    // create a comment
                    console.log("added a sandwich");
                    Comment.create({
                        text: "it's pretty tasty",
                        author: "Homer"
                    },(err, comment)=>{
                        if(err){
                            console.log(err);
                        }else{
                            sandwich.comments.push(comment);
                            sandwich.save();
                            console.log("added a comment");
                        }
                    })
                }
            });
    });
}

module.exports = seedDB;