let mongoose = require("mongoose"),
    Campground = require("./models/campground"),
    Comment  = require("./models/comment");

let campgroundData = [
    {
      name: 'Forest',
      image: 'https://3c1703fe8d.site.internapcdn.net/newman/gfx/news/2018/europeslostf.jpg',
      description: 'This is a forest campground',
      author: {
        username: 'Some Good Guy'
      },
      created: Date.now()
    },
    {
      name: 'Plain',
      image: 'https://media.nationalgeographic.org/assets/photos/000/255/25557.jpg',
      description: 'This is a plain campground',
      author: {
        username: 'Some Good Guy'
      },
      created: Date.now()
    }
  ];
function seedDB(){
    Campground.remove({}, (err)=>{
        if(err){
            console.log(err);
        }
        console.log("removed the data");
    });
    campgroundData.forEach((seed)=>{
        Campground.create(seed,(err, campground)=>{
                if(err){
                    console.log("error creating model: " + error);
                }else{
                    // create a comment
                    console.log("added a campground");
                    campground.save();
                }
            });
    });
}

module.exports = seedDB;