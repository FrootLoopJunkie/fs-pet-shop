//security so cant use undeclared vars
'use strict'
const http = require('http')
const routes = require('./routes')
const port = process.env.PORT || 8000
//create a server assign it to the const server
const server = http.createServer (function(req, res){
    //this detects all the slashes in our string
    var slashRegExp= /[/]/  
    //we take url split it based off the regexpression outputs array
    var index = slashRegExp[Symbol.split](req.url)
    //checks first non-home route for existance
    console.log(index)
    if (routes[index[1]] !== undefined){ 
        //passing index[2]as parameter for routes 
        //pets(req, res, index[2])
        routes[index[1]](req, res, index[2])
    }else{
        res.statusCode = 404
        res.setHeader('Content-Type', 'text/plain')
        //if you type undefied directory error
        res.end('404, no such route')
    }
})

server.listen(port)