const pg = require('pg')

let dbName
if ( process.env.NODE_ENV === 'test' ) {
  dbName = 'vinyl-test'
} else {
  dbName = 'vinyl'
}

const connectionString = process.env.DATABASE_URL || `postgres://localhost:5432/${dbName}`
const client = new pg.Client( connectionString )

client.connect()

// Query helper function
const query = function( sql, variables, callback ){
  if ( process.env.NODE_ENV !== 'test' ) {
    console.log( 'QUERY ->', sql.replace( /[\n\s]+/g, ' ' ), variables )
  }

  client.query( sql, variables, function( error, result ){
    if ( error ){
      if ( process.env.NODE_ENV !== 'test' ) {
        console.log( 'QUERY <- !!ERROR!!' )
        console.error( error )
      }
      callback( error )
    } else {
      if ( process.env.NODE_ENV !== 'test' ) {
        console.log('QUERY <-', JSON.stringify( result.rows ))
      }
      callback( error, result.rows )
    }
  })
}

const getAlbums = function( callback ) {
  query( "SELECT * FROM albums", [], callback )
}

const getAlbumsByID = function( albumID, callback ) {
  query( "SELECT * FROM albums WHERE id = $1", [albumID], callback )
}

const truncateTables = function( callback ) {
  query( "TRUNCATE TABLE users, reviews", [], callback )
}

const addUser = function( { name, email, password }, callback ) {
  query(
    "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
    [name, email, password],
    callback
  )
}

const getUser = function ( { email, password }, callback ) {
  query( "SELECT * FROM users WHERE email = $1 and password = $2", [email, password], callback )
}

const addReview = function ( { content, user_id, album_id }, callback ) {
  query(
    "INSERT INTO reviews (content, user_id, album_id) VALUES ($1, $2, $3) RETURNING *",
    [content, user_id, album_id],
    callback
  )
}

const getReviewsByAlbumId = function ( albumId, callback ) {
  query( "SELECT * FROM reviews WHERE album_id = $1", [albumId], callback )
}

module.exports = {
  getAlbums,
  getAlbumsByID,
  truncateTables,
  addUser,
  getUser,
  addReview,
  getReviewsByAlbumId
}
