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

const getUserByNameEmail = function ( { email, password }, callback ) {
  query( "SELECT * FROM users WHERE email = $1 and password = $2", [email, password], callback )
}

const getUserById = function ( userId, callback ) {
  query( "SELECT * FROM users WHERE id = $1", [userId], callback )
}

const addReview = function ( { content, user_id, album_id }, callback ) {
  query(
    "INSERT INTO reviews (content, user_id, album_id) VALUES ($1, $2, $3) RETURNING *",
    [content, user_id, album_id],
    callback
  )
}

const getReviewsBy = function ( column, value, callback ) {
  query(
    `SELECT reviews.id, reviews.content, reviews.date, users.name, users.id AS user_id, albums.title, albums.id AS album_id ` + 
    `FROM reviews JOIN users ON (reviews.user_id = users.id) JOIN albums ON (reviews.album_id = albums.id) ` +
    `WHERE ${column} = $1 ORDER BY date DESC`,
    [value],
    callback
  )
}

const getReviewsByAlbumId = function ( albumId, callback ) {
  getReviewsBy( 'album_id', albumId, callback )
}

const getReviewsByUserId = function ( userId, callback ) {
  getReviewsBy( 'user_id', userId, callback )
}

const getReviewById = function ( reviewId, callback ) {
  query( "SELECT * FROM reviews WHERE id = $1", [reviewId], callback )
}

const deleteReview = function ( reviewId, callback ) {
  query( "DELETE FROM reviews WHERE id = $1 RETURNING *", [reviewId], callback )
}

const getRecentReviews = function ( count, callback ) {
  query(
    "SELECT reviews.id, reviews.content, reviews.date, users.name, users.id AS user_id, albums.title, albums.id AS album_id " +
    "FROM reviews JOIN users ON (reviews.user_id = users.id) JOIN albums ON (reviews.album_id = albums.id) " +
    "ORDER BY date DESC LIMIT $1", [count], callback )
}

module.exports = {
  getAlbums,
  getAlbumsByID,
  truncateTables,
  addUser,
  getUserByNameEmail,
  getUserById,
  addReview,
  getReviewsByAlbumId,
  getReviewsByUserId,
  deleteReview,
  getRecentReviews,
  getReviewById
}
