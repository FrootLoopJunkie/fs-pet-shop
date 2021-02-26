//THIS IS OUR ROUTES
//index will be the argument we get from server.js
let grabpets = require('./getPets')
//list possible routes
routes = {
    'pets': function(req, res, index){
        //store return from invoked function so we can pass conditionals
        var output = grabpets(index)
        //check to make sure not 
        if(output === false){
            res.statusCode = 404
            res.setHeader('Content-Type', 'text/plain')
            //if you type undefied directory error
            res.end('404, no such route')
        }else{
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.end(output)
        }
    },
    //nonsense route used to show that you could have as many routes as you want
    'test':  function(req, res, index){
        res.statusCode = 200
        res.setHeader('Content-Type', 'text/plain')
        res.end('Hey there cowboy~ Welcome to the realm of mystery! That being said, I don"t know if you belong here...')
    }

};

module.exports = routes


// localhost:8000/pets
// localhost:8000/pets arg arg arg <---- THIS IS DUMB
// localhost:8000/pets/create arg arg arg <---- THIS IS BIG BRAIN
// localhost:8000/pets/delete arg arg arg
// localhost:8000/owners/create arg arg arg

