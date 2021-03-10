const express = require('express');
const morgan = require('morgan');
const pool = require('./pg')
const app = express();
const PORT = process.env.PORT||8000;

//middleware
//MORGAN
app.use(morgan('combined'));
//express acess to body
app.use(express.json());

//CREATE
app.post('/pets', (req, res)=>{
    try{
        newPet= req.body;
        if (isNaN(parseInt(newPet.age)) === true){
            res.status(400).send(`${newPet.age} is not an int`);
        }else if(newPet.name && newPet.kind && newPet.age){
            const result = pool.query(`INSERT INTO pets (name, kind, age) VALUES ('${newPet.name}', '${newPet.kind}', '${newPet.age}')`);
            res.status(200).send(`${newPet.name} was created`);
        }else{ 
            res.status(400).send('Please Enter a Name Age and Kind~ You Dumb Farmer.')
        }
    }catch(err){
        console.error(err);
        res.status(400).send(`Error Encountered: ${err}`);
    }
})

//READ ALL
app.get('/pets', async (req, res)=>{
    try{
        const result = await pool.query('SELECT * FROM pets ORDER BY id ASC');
        res.status(200).send(result.rows);
    }catch(err){
        console.error(err);
        res.status(400).send(`Error Encountered: ${err}`);
    }
})

//READ SPECIFIC
app.get('/pets/:id', async(req,res)=>{
    const {id} = req.params;
    try{
        const result = await pool.query(`SELECT * FROM pets WHERE id = ${id}`);
        let resMax = await pool.query(`SELECT MAX(id) FROM pets`);
        let maxID = resMax.rows[0].max;
        if(id < 1 || id > maxID){
            res.status(400).send('ID is Out of Bounds');
            return;
        }
        if(result.rows.length === 0){
            res.status(400).send('Pet at This ID was Deleted');
            return;
        }
        res.status(200).send(result.rows);
    }catch(err){
        console.error(err);
        res.status(400).send(`Error Encountered: ${err}`);
    }
})
    
//UPDATE
app.put('/pets/:id', async(req,res)=>{
    try{
        const {id} = req.params;
        const petUpdate = req.body;

        let querySpecific = await pool.query(`SELECT * FROM pets WHERE id = ${id}`);
        let resMax = await pool.query(`SELECT MAX(id) FROM pets`);
        let maxID = resMax.rows[0].max;
        let templatePet = {
        name : petUpdate.name ||  querySpecific.rows[0].name,
        age : petUpdate.age || querySpecific.rows[0].age,
        kind : petUpdate.kind || querySpecific.rows[0].kind
        }
        if(id < 1 || id > maxID){
            res.status(400).send('ID is Out of Bounds');
            return;
        }
        if(querySpecific.rows.length === 0){
            const result = await pool.query(`INSERT INTO pets (id, name, age, kind) VALUES ('${id}', '${templatePet.name}', '${templatePet.age}', '${templatePet.kind}')`);
            res.status(200).send(`Deleted ${templatePet.name} was updated to ${JSON.stringify(templatePet)} at ID: ${id}`);
            return;
        }
        //check it exisit and a num for age
        if(templatePet.age && isNaN(parseInt(templatePet.age)) === true){
            res.status(400).send(`${templatePet.age} is not a number`);
            return
        }
        const result = await pool.query(`UPDATE pets SET name = '${templatePet.name}', age = '${templatePet.age}', kind = '${templatePet.kind}' WHERE id = ${id}`);
        res.status(200).send(`${templatePet.name} was updated to ${JSON.stringify(templatePet)}`);
    }catch(err){
        console.error(err);
        res.status(400).send(`Error Encountered: ${err}`);
    }
})

//DELETE            
app.delete('/pets/:id', async(req,res)=>{
    try{
        const {id} = req.params;
        let querySpecific = await pool.query(`SELECT * FROM pets WHERE id = ${id}`);
        let resMax = await pool.query(`SELECT MAX(id) FROM pets`);
        let maxID = resMax.rows[0].max;
        if(id < 1 || id > maxID){
            res.status(400).send('ID is Out of Bounds');
            return;
        }
        if(querySpecific.rows.length === 0){
            res.status(400).send(`Pet at ID ${id} was already deleted or`);
            return;
        }
        res.status(200).send(`${querySpecific.rows[0].name} at ID ${id} was Deleted`);
        const result = pool.query(`DELETE FROM pets WHERE id =${id}`);
    }catch(err){
        console.error(err);
        res.status(400).send(`Error Encountered: ${err}`);
    }
})

app.use((req, res)=>{
    res.status(404).send(`Requested page not found`);
})

app.listen(PORT, ()=>{
    console.log(`Listening on port: ${PORT}`);
})