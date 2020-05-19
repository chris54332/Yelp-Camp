# Yelp-Camp


YelpCamp is a Node.js web application with RESTful routing project from the Udemy course - The Web Developer Bootcamp by Colt Steele

To see the app in action, <a href= "https://cris-yelp-camp-demo.herokuapp.com">click here<a>

    Login username: visitor
    Login password: pass

Features

    Authentication:

        User signup with username, password and invitation code

        User login with username and password


    Authorization:

        One cannot create new campgrounds or view user profile without being authenticated

        One cannot edit or delete existing posts and comments created by other users

        Admin can manage all campgrounds
        
    Functionalities of campground posts and comments:

        Create, view, edit and delete posts and comments

    Flash messages responding to users’ interaction with the app

    Responsive web design

Custom Enhancements

    Embedded comment show page in single campground show page to look more user friendly

    Changed comment post and put routes to redirect back to single campground show page

    Used Font Awesome instead default fonts

Built with
Front-end

    Font Awesome
    Bootstrap 4

Back-end

    express
    mongoDB
    mongoose
    ejs
    passport
    passport-local
    passport-local-mongoose
    body-parser
    express-session
    method-override
    connect-flash

Deployment

    Heroku

