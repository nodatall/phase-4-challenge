const express = require('express')
const bodyParser = require('body-parser')
const router = require('./routes')
const session = require('express-session')
const app = express()

require( 'ejs' )
app.set( 'view engine', 'ejs' );

app.use( express.static( 'public' ) )
app.use( bodyParser.urlencoded( { extended: false } ) )

app.use( session({
  secret:'slay your dragon',
  cookie: {
    maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
  },
  resave: false,
  saveUninitialized: true
}))

app.use( router )

app.use( ( request, response ) => {
  response.status( 404 ).render( 'not_found' )
})

const port = process.env.PORT || 3000
app.listen( port, () => {
  console.log( `Listening on http://localhost:${port}...` )
})
