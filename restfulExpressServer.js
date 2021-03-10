const express = require('express');
const morgan = require('morgan');
const {Client} = require('pg');
const fs = require('fs');
const data = require('./pets.json');
const app = express();
const PORT = process.env.PORT||8000;

const client= new Client({
    user:'Kolby',
    password:'',
    host: 'localhost',
    port: 5432,
    database: "petshop"
})

client.connect(async(err, res)=>{
    let myDreams;
    for (elem in data){
    let name=data[elem].name;
    let age = data[elem].age;
    let kind = data[elem].kind;
        let response =  await client.query(`INSERT INTO pets (Name, Age, Kind) VALUES ('${name}', '${age}', '${kind}')`)
            .then((result)=>{
                console.log(result)
                myDreams = result;
            })
    }
    client.end();
       
});

//middleware
app.use(morgan('combined'));
app.use(express.json());

//CREATE
app.post('/pets', (req, res)=>{
    const newPet= req.body;
    //create temp obj taht only takes values we want
    let templatePet = {
        name : newPet.name,
        age : newPet.age,
        kind : newPet.kind
    }
    //if three catagories exisit allow it to create 
    if(newPet.name && newPet.age && newPet.kind){ //checks that user input a name, age, and a kind
        res.status(200).send(`${newPet.name} was added`);
        console.log(`Added ${newPet.name} to database.`);
        data.push(templatePet);
        fs.writeFileSync('./pets.json', JSON.stringify(data));
    }else{
        res.status(400).send(`Please enter a name, age, and kind.`)
    }
})

//READ ALL
app.get('/pets', (req, res)=>{
    res.status(200).send(data);
})

//READ SPECIFIC
app.get('/pets/:id', (req,res)=>{
    const id = req.params.id
    for(elem in data){
        if(elem === id){
            res.status(200).send(data[elem])
            return;
        }
    }
    res.status(404).send(`${id} not found try id 0-${data.length}`)
})

//UPDATE
app.put('/pets/:id', (req,res)=>{
    const id = req.params.id;
    const petUpdate = req.body
    //loop through the array looking for matching id
    for(elem in data){
        if(elem === id){
            //temp to limit user inputs
            let templatePet = {
                name : petUpdate.name ||  data[elem].name,
                age : petUpdate.age || data[elem].age,
                kind : petUpdate.kind || data[elem].kind
                }
                //check it exisit and a num for age
                if(templatePet.age && isNaN(parseInt(templatePet.age)) === true){
                    res.send(`${templatePet.age} is not a number`)
                    return
                }
                //edit the tar obj and mere with user data
                data[elem] = {...data[elem], ...templatePet};
                data[elem].age = parseInt(data[elem].age)
                fs.writeFileSync('./pets.json', JSON.stringify(data));
                res.status(200).send(`${templatePet.name} has been updated`)
                return;
        }   
    }
    res.status(400).send(`Pet with id ${id} not found`)
})

//DELETE            
app.delete('/pets/:id', (req,res)=>{
    const id = req.params.id
    for(elem in data){
        if(id === elem){
            let name = data[elem].name;
            delete data[elem];
            //checking if obj exisit 
            let filteredData = data.filter(Boolean)
            fs.writeFileSync('./pets.json', JSON.stringify(filteredData));
            res.status(200).send(`pet ${name} was deleted`)
            return
        }
    }
    res.status(400).send(`Pet with id ${id} not found`)
})

app.use((req, res)=>{
    res.status(404).send(`Requested page not found`);
})


app.listen(PORT, ()=>{
    console.log(`Listening on port: ${PORT}`)
})
