//THIS HOLDS OUR FUNCTIONS
const fs = require('fs');
const grabpets = function getpets (index){
    
    data = fs.readFileSync('./pets.json')
    let parsedata = JSON.parse(data)
    if(index === undefined || index === ""){    
        return JSON.stringify(parsedata);
    }else if(index !== undefined && index <= parsedata.length-1 && index >= 0){
        return JSON.stringify(parsedata[index]);
    }else{
        return false 
    }
}

module.exports = grabpets



