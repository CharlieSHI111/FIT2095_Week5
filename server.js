let express = require('express');
let app = express();

let mongodb = require('mongodb');
let mongoClient = mongodb.MongoClient;
let url = 'mongodb://localhost:27017';
let col = null;
mongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, function(err, client){
    if(err){
        console.log('err: ', err);
    }else{
        db = client.db('week6lab');
        col = db.collection('tasks');
    }
});

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

let bodyparser = require('body-parser');
app.use(bodyparser.urlencoded({extended:false}));

app.use(express.static('img'));
app.use(express.static('css'));

var filePath = __dirname + "/views/";

// var db = [];


app.get("/", function(req,res){
    let fileName = filePath + "index.html";
    res.sendFile(fileName);
});

app.get("/newtask", function(req,res){
    let fileName = filePath + "newtask.html";
    res.sendFile(fileName);
});

app.get("/deleteone", function(req,res){
    let fileName = filePath + "deleteone.html";
    res.sendFile(fileName);
});

app.get("/deleteall", function(req,res){
    let fileName = filePath + "deleteall.html";
    res.sendFile(fileName);
});

app.get("/updatestate", function(req,res){
    let fileName = filePath + "updatestate.html";
    res.sendFile(fileName);
});

app.get("/insertmany", function(req,res){
    let fileName = filePath + "insertmany.html";
    res.sendFile(fileName);
});

app.get("/listtasks", function(req,res){
    // res.render("listtasks",{mydata: db});
    col.find({}).toArray(function(err, result){
        if(err){
            console.log('err: ', err);
        }else{
            res.render("listtasks", {mydata: result});
        }
    });
});

app.post("/createtask", function(req,res){
    let data = req.body;
    // db.push(data);
    // res.render("listtasks",{mydata: db});
    col.insertOne(data, function(err, result){
        if(err){
            console.log('err: ', err);
        }else{
            res.redirect('listtasks');
        }
    });
});

app.post("/createmany", function(req,res){
    let data = req.body;
    let mydata = [];
    for(let i=0;i<data.count;i++){
        mydata.push({
            taskname: data.taskname,
            ownername: data.ownername,
            taskdue: data.taskdue,
            taskstate: data.taskstate,
            taskdesc: data.taskdesc
        });

    };

    col.insertMany(mydata, function(err, result){
        if(err){
            console.log('err: ', err);
        }else{
            res.redirect('listtasks');
        }
    });
});

app.post("/deleteOne", function(req, res){
    let __id = req.body.id;
    let id = new mongodb.ObjectID(__id);
    col.deleteOne({_id: id}, function(err, result){
        if(err){
            console.log('err: ', err);
        }else{
            res.redirect('listtasks')
        }
    });
});

app.post("/deleteAll", function(req, res){
    col.deleteMany({}, function(err, result){
        if(err){
            console.log('err: ', err);
        }else{
            res.redirect('listtasks');
        }
    });
});

app.post('/update', function(req, res){
    let id = req.body.id;
    let _taskstate = req.body.taskstate;
    col.updateOne({_id:id}, {$set:{taskstate:_taskstate}}, (err, result)=>{
        if(err){
            console.log('err: ', err);
        }else{
            res.redirect('listtasks');
        }
    });
});

app.listen(8080, ()=>{
    console.log('Server is running');
});