const {Pool} = require('pg');
const pool = new Pool({
    user:'Kolby',
    password:'',
    host: 'localhost',
    port: 5432,
    database: "petshop"
})

module.exports = pool;