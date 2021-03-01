//THIS HOLDS OUR FUNCTIONS
const fs = require('fs');
const { nextTick } = require('process');
const grabpets = function getpets (index){
    
    data = fs.readFileSync('./pets.json')
    //turn data into more readible version
    let parsedata = JSON.parse(data)
    //if no '/' or they didnt specify index they get the whole obj
    if(index === undefined || index === ""){    
        return JSON.stringify(parsedata);
        //check that index exisit and is in bounds 
    }else if(index !== undefined && index <= parsedata.length-1 && index >= 0){
        //
        return JSON.stringify(parsedata[index]);
    }else{
        return false 
    }
}

module.exports = grabpets


//get for /pets handle pulling all pets
    //check that pets.json exists


//get for /pets/:num handle pulling a specific pet
    //check that num is number
    //check that num is in bounds
        //next({status:400, message:"Please enter a valid ID"}) //if not valid id



//use (err req res next) +> {
// res.status(err.status.json({error:err}))
//}





