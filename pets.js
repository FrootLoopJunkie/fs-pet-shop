//Declare Global var
//bring in core modules
const fs = require('fs')
// bring in argv method & delete the first two index(hold paths)
const input= process.argv.slice(2)
//we take the input change to lowercase to contol input
switch(input[0].toLowerCase()){
    //if read just give them the whole obj
    case "read":
        read();
        break;
    case "create":
        create();
        break;
    case 'update':
        update()
        break;
    default: 
        console.error('usage: node pets.js [read | create | update | destroy]')
    
}

function update (){
    //checking to make sure inputs 1-4 are what we want 
    if (!Number.isNaN(parseInt(input[1])) && !Number.isNaN(parseInt(input[2])) && Number.isNaN(parseInt(input[3])) && Number.isNaN(parseInt(input[4]))){
        //accesing readfile method so we can copy modify and push it back
        fs.readFile('./pets.json', 'utf8', function (err, data){
            //parse the data so it reads in Obj format
            let parseData= JSON.parse(data)
            //if we get an error display error
            if(err){
                console.error(err)
                //if after read theres more info(next index) it reads the info 
            }else{
                let newEntry = {age: parseInt(input[2]), kind: input[3], name: input[4]}
                //if no errors we take input and add into an obj
                //replace that obj into the array at json
                parseData[input[1]]= newEntry
                //mutate parsedata so we can write it to json
                parseData = JSON.stringify(parseData)
                //writting it to json
                fs.writeFileSync('pets.JSON', parseData)
            }
            });
    }else{
        //if not proper format display error 
        console.error('Usage: age(number), kind(species), name(no numbers)')
    }
}


function create (){
    //checking to make sure inputs 1-3 are what we want 
    if (!Number.isNaN(parseInt(input[1])) && Number.isNaN(parseInt(input[2])) && Number.isNaN(parseInt(input[3]))){
        //accesing readfile method so we can copy modify and push it back
        fs.readFile('./pets.json', 'utf8', function (err, data){
            //parse the data so it reads in Obj format
            let parseData= JSON.parse(data)
            //if we get an error display error
            if(err){
                console.error(err)
                //if after read theres more info(next index) it reads the info 
            }else{
                let newEntry = {age: parseInt(input[1]), kind: input[2], name: input[3]}
                //if no errors we take input and add into an obj
                //push that obj into the array at json
                parseData.push(newEntry)
                //mutate parsedata so we can write it to json
                parseData = JSON.stringify(parseData)
                //writting it to json
                fs.writeFileSync('pets.JSON', parseData)
            }
            });
    }else{
        //if not proper format display error 
        console.error('Usage: age(number), kind(species), name(no numbers)')
    }
}

function read (){
    fs.readFile('./pets.json', 'utf8', function (err, data){
        //parse the data so it reads in Obj format
        let parseData= JSON.parse(data)
        //if we get an error display error
        if(err){
            console.error(err)
            //if after read theres more info(next index) it reads the info 
        }else if(input[1]!== undefined ){
                //take our info and convert to number 
                var index = parseInt(input[1])
                //console.log(parseData.length)
                //check if bounds
                if(index < 0 || index > parseData.length-1){
                    console.error(`usage: read index - index must be between 0-${parseData.length-1}`)
                }else if(!Number.isNaN(index)){
                    console.log(parseData[index])
                }else{
                    console.error('usage: read index')
                }

        }else{
            console.log(parseData)
        }
    })
}

