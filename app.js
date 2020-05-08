let formidable = require('formidable'),
    path       = require('path'),
    fs         = require('fs'),
    url        = require('url');

// expressSanitizer = require("express-sanitizer"),
const methodOverride   = require("method-override"),
      bodyParser       = require('body-parser'), 
      express          = require('express'),
      copyPath         = "-RENAMED/",
      mongoose         = require('mongoose'),
      Sandwich         = require("./models/sandwich"),
      Comment          = require("./models/comment"),
      seedDB           = require("./seeds");

    
mongoose.connect('mongodb://localhost:27017/danneys_db_v2', {useNewUrlParser: true, useUnifiedTopology: true});

app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.set('port', process.env.PORT || 3000);
app.set('view engine','ejs');
app.set(express.static("public"));
app.use(express.static(__dirname + '/public'));
// app.use(expressSanitizer());
app.use(methodOverride("_method"));

seedDB();

///ROUTES
//INDEX
app.get('/',(req,res)=>{res.redirect('/sandwiches');}); 
app.get("/home",(req,res)=>{res.render("index");});

// GET SANDWICHES
app.get('/sandwiches',(req,res)=>{
    Sandwich.find({}, (err,allSandwiches)=>{
        if(err){
            console.log(err);
        }else {
            res.render("sandwiches/index1", {sandwiches:allSandwiches});
        }
    })
})

// POST SANDWICHES
app.get('/sandwiches/new',(req,res)=>{res.render("sandwiches/new");})
app.post('/sandwiches',(req,res)=>{
    // req.body.newSandwich.body = req.sanitize(req.body.newSandwich.body);
    Sandwich.create(req.body.newSandwich,(err, newlyCreated)=>{
        if(err)
            console.log(err);
        else
            res.redirect("/sandwiches");
    });
})
// SHOW SANDWICHES
app.get('/sandwiches/:id', (req,res)=>{
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
app.get('/sandwiches/:id/edit',(req, res)=>{
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
app.put("/sandwiches/:id",(req,res)=>{
    // req.body.newSandwich.body = req.sanitize(req.body.newSandwich.body);
    Sandwich.findByIdAndUpdate(req.params.id, req.body.editSand, (err,editedSandwich)=>{
        if(err){
            res.redirect("/sandwiches");
        }else{
            res.redirect('/sandwiches/' + req.params.id);
        }
    })
})
app.delete("/sandwiches/:id",(req,res)=>{
    // res.send("REACHED THE DELETE PAGE");
    Sandwich.findByIdAndRemove(req.params.id, (err,editedSandwich)=>{
        if(err){
            res.redirect('/sandwiches/' + req.params.id);
        }else{
            res.redirect("/sandwiches");
        }
    })
})
// =================
// Comments

app.get('/sandwiches/:id/comments/new',(req,res)=>{
    Sandwich.findById(req.params.id,(err, sandwich)=>{
        if(err){
            console.log(err);
        }else{
            res.render("comments/new", {sandwich: sandwich});
        }
    })
})

app.post('/sandwiches/:id/comments', (req,res)=>{
    Sandwich.findById(req.params.id, (err,sandwich)=>{
        if(err){
            console.log(err);
            res.redirect('/sandwiches');
        }else{
            Comment.create(req.body.comment, (err, comment)=>{
                if(err){
                    console.log(err);
                }else{
                    sandwich.comments.push(comment);
                    sandwich.save();
                    res.redirect('/sandwiches/' + sandwich._id);
                }
            })
        }
    });
})
//Uploads the files to the server
app.post('/upload',(req,res)=>{
    const urlParams = url.parse(req.url, true);
    const docType = urlParams.path.split("flag=");
    let filesPath = "C:/RB Program Files/PDFRenamerWebApp/s/testing-files/" + docType[1];
    let form = new formidable.IncomingForm();   
    // const originalName_Path = ;
    form.uploadDir = filesPath;
    form.keepExtensions = true;//keep file extension
    form.parse(req, (err, fields, files) =>{
        if (err) throw (err);
        fs.access(filesPath + "/" + files.file.name, fs.constants.F_OK, (err) => {
            if(err){
                fs.rename(files.file.path, filesPath + "/" + files.file.name,(err)=>{
                    if (err) throw (err);
                    fs.copyFile(filesPath + "/" + files.file.name, filesPath + copyPath + files.file.name,(err)=>{if (err) throw (err);});
                });
            }
            else 
            console.log(`File uploading ERROR: ${files.file.name} already exists`);
        });
    });
    res.end();
});
//Starts the parsing process
app.get('/parsing-in-progress',(req,res,next) => {
    const urlParams = url.parse(req.url, true);
    const docType = urlParams.path.split("flag=");
    let childProcess = require('child_process');
    const scriptLink = './run-' + docType[1] + '.js';
    function runScript(scriptPath, callback) {
        // keep track of whether callback has been invoked to prevent multiple invocations
        var invoked = false;
        var process = childProcess.fork(scriptPath);
        // listen for errors as they may prevent the exit event from firing
        process.on('error', function (err) {
            if (invoked) return;
            invoked = true;
            callback(err);
        });
        // execute the callback once the process has finished running
        process.on('exit', function (code) {
            if (invoked) return;
            invoked = true;
            var err = code === 0 ? null : new Error('exit code ' + code);
            runFileZipping();
            callback(err);
            next();
        });
    }
    function dumpFiles(directory){
        fs.readdir(directory, (err, files) => {
            if (err) throw err;
          
            for (const file of files) {
              fs.unlink(path.join(directory, file), err => {
                if (err) throw err;
              });
            }
          });
    }
    //Zips the subdirectory of the parsed pdfs
    function runFileZipping(){
        var archiver = require('archiver');
        var output= fs.createWriteStream('C:/RB Program Files/PDFRenamerWebApp/s/testing-files/example.zip');
        var archive = archiver('zip',{ 
        gzip: true,
        zlib: {level: 9}
        });
        output.on('close', function() {
            dumpFiles("testing-files/commentaries");
            dumpFiles("testing-files/commentaries-RENAMED");
            dumpFiles("testing-files/securities");
            dumpFiles("testing-files/securities-RENAMED");    
        });
        archive.pipe(output);
        archive.directory('testing-files/'+ docType[1] + '-RENAMED/', false);
        archive.finalize();
        archive.on('error',(err)=>{ throw err;});
        console.log('Finished running the parser.');
    }
    runScript(scriptLink, function (err) {
        if (err) throw err;
    });
})
//Downloads the zip file to the client
app.use('/parsing-in-progress',(req,res,next)=>{
    var pathUrl = req.path;
    if(pathUrl !== '/') {
        res.download('C:/RB Program Files/PDFRenamerWebApp/s/testing-files/example.zip','example.zip'
        ,(err)=>{ console.log(err);});
    } else {
        res.end();
    }
})

//Binding to localhost://3000
app.listen(3000,()=>{
 console.log('App is running');
});