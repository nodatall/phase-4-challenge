const pg = require('pg')

let dbName
if ( process.env.NODE_ENV === 'test' ) {
  dbName = 'vinyl-test'
} else {
  dbName = 'vinyl'
}

const connectionString = process.env.DATABASE_URL || `postgres://localhost:5432/${dbName}`
const client = new pg.Client(connectionString)

client.connect()

// Query helper function
const query = function(sql, variables, callback){
  if ( process.env.NODE_ENV !== 'test' ) {
    console.log('QUERY ->', sql.replace(/[\n\s]+/g, ' '), variables)
  }
  
  client.query(sql, variables, function(error, result){
    if (error){
      console.log('QUERY <- !!ERROR!!')
      console.error(error)
      callback(error)
    }else{
      if ( process.env.NODE_ENV !== 'test' ) {
        console.log('QUERY <-', JSON.stringify(result.rows))
      }
      callback(error, result.rows)
    }
  })
}

const getAlbums = function(callback) {
  query("SELECT * FROM albums", [], callback)
}

const getAlbumsByID = function(albumID, callback) {
  query("SELECT * FROM albums WHERE id = $1", [albumID], callback)
}

const truncateTables = function(callback) {
  query("TRUNCATE TABLE users", [], callback)
}

module.exports = {
  getAlbums,
  getAlbumsByID,
  truncateTables
}
