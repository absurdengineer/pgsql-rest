const { Pool } = require('pg')
const config = require('config')

const pool = new Pool({
    host : config.get('PGHOST'),
    user : config.get('PGUSER'),
    database : config.get('PGDATABASE'),
    port : config.get('PGPORT'),
    password : config.get('PGPASSWORD')
})
pool.connect()
    .then(({database,user}) => console.log(`Connected to ${database} as ${user}`))
    .catch(err => console.error(`Error : ${err.message}`))

module.exports = pool