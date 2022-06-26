const Pool = require('pg').Pool
const pool = new Pool ({
    user:"postgres",
    password:"dondizzy12",
    host: "localhost",
    port:5432,
    database: "graphql",
})

module.exports = pool