// //security so cant use undeclared vars
// 'use strict'
// const http = require('http')
// const routes = require('./routes')
// const port = process.env.PORT || 8000
// //create a server assign it to the const server
// const server = http.createServer (function(req, res){
//     //this detects all the slashes in our string
//     var slashRegExp= /[/]/  
//     //we take url split it based off the regexpression outputs array
//     var index = slashRegExp[Symbol.split](req.url)
//     //checks first non-home route for existance
//     console.log(index)
//     if (routes[index[1]] !== undefined){ 
//         //passing index[2]as parameter for routes 
//         //pets(req, res, index[2])
//         routes[index[1]](req, res, index[2])
//     }else{
//         res.statusCode = 404
//         res.setHeader('Content-Type', 'text/plain')
//         //if you type undefied directory error
//         res.end('404, no such route')
//     }
// })

// server.listen(port)

const express = require('express');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.urlencoded({extended : false})); //this allows us to read parameters included in requests

app.use(function(req, res, next){
    if(!fs.existsSync("./pets.json")){
        fs.appendFile('pets.json', "", function(){
            console.log("New pets.json file created.")
            //does this file exist in a backup
            //restore
        });
    }
    next();
})

app.get("/pets", function(req, res, next){
    let data = fs.readFileSync("./pets.json");
    res.end(data)
})

app.get("/pets/:num", function(req, res, next){
    const num = req.params.num;
    let data = fs.readFileSync("./pets.json");
    let parsedData = JSON.parse(data)
    if(!Number(num) && parseInt(num) !== 0){
        next({status : 400, message: "Invalid ID, Please Enter a Number"});
    }else if(num < 0 ||  num > parsedData.length - 1){
        next({status : 400, message : "ID is out of bounds"});
    }else{
        console.log(parsedData[num])
        res.end(JSON.stringify(parsedData[num]));
    }
})

app.get("/create/pet", function(req, res, next){
    res.end(`
    <h1>Create Pet Entry</h1>
    <form action="/create/pet" method="POST">
        <input type="number" name="age" placeholder="Enter Age...">
        <input type="text" name="type" placeholder="Enter Type...">
        <input type="text" name="name" placeholder="Enter Name...">
        <button>Submit</button>
    </form>
    `)
})

app.post("/create/pet", function(req, res, next){
    let data = fs.readFileSync("./pets.json");
    let parsedData = JSON.parse(data);
    let age = req.body.age;
    let type = req.body.type;
    let name = req.body.name;
    let newPet = {
        age : parseInt(age),
        type,
        name
    }
    parsedData.push(newPet);
    //create an object with the above variables and appendFile it to pets.json
    fs.writeFileSync("pets.json", JSON.stringify(parsedData))
    res.end(`<h1>Congrats! ${name} has been added to the database</h1>`)
})

app.use(function(err, req, res, next){
    res.status(err.status).json({ error: err})
})

app.use(function(req, res, next){
    res.status(404);
    res.end(`
    <h1></h1>
    <img src="https://doyouconvert.com/wp-content/uploads/2018/04/404_Error.jpg">
    `);
})

app.listen(PORT, function(){
    console.log("Now listening on port: " + PORT)
});