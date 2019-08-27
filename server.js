let express = require('express');
let app = express();

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

let bodyparser = require('body-parser');
app.use(bodyparser.urlencoded({extended:false}));

app.use(express.static('img'));
app.use(express.static('css'));

var filePath = __dirname + "/views/";

var db = [];


app.get("/", function(req,res){
    let fileName = filePath + "index.html";
    res.sendFile(fileName);
});

app.get("/newtask", function(req,res){
    let fileName = filePath + "newtask.html";
    res.sendFile(fileName);
});

app.get("/listtasks", function(req,res){
    res.render("listtasks",{mydata: db});
});

app.post("/createtask", function(req,res){
    let data = req.body;
    db.push(data);
    res.render("listtasks",{mydata: db});
});

app.listen(8080, ()=>{
    console.log('Server is running');
});