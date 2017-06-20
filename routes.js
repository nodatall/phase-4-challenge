const express = require('express')
const database = require('./database')

const router = express()

router.get( '/', ( request, response ) => {
  database.getAlbums( ( error, albums ) => {
    if ( error ) {
      response.status( 500 ).render( 'error', { error: error } )
    } else {
      database.getRecentReviews( 3, ( error, reviews ) => {
        reviews = reviews.map( review => {
          review.date = _formatTime( review.date )
          return review
        })
        if ( request.session.user ) {
          const { name, email, joined, id } = request.session.user
          response.render('index', { albums, reviews, loggedIn: true, name, email, joined, id })
        } else {
          response.render('index', { albums, reviews, loggedIn: false })
        }
      })
    }
  })
})

router.get( '/albums/:albumID', ( request, response ) => {
  const albumID = request.params.albumID

  database.getAlbumsByID( albumID, ( error, albums ) => {
    if ( error ) {
      response.status( 500 ).render( 'error', { error: error } )
    } else {
      const album = albums[0]
      if ( request.session.user ) {
        const { name, email, joined, id } = request.session.user
        response.render( 'album', { album, loggedIn: true, name, email, joined, id } )
      } else {
        response.render('album', { album, loggedIn: false })
      }
    }
  })
})

router.get( '/signup', ( request, response ) => {
  response.render( 'sign_up', { loggedIn: false } )
})

router.get( '/signin', ( request, response ) => {
  if ( request.session.user ) {
    response.redirect( `/users/${request.session.user.id}` )
  } else {
    response.render( 'sign_in', { loggedIn: false } )
  }
})

router.post( '/users/new', ( request, response ) => {
  database.addUser( request.body, ( error, user ) => {
      if ( error ) {
        response.status( 500 ).render('error', { error: error } )
      } else {
        const { email, password } = request.body
        database.getUser( { email, password }, ( error, user ) => {
          request.session.user = user[0]
          response.redirect( `/users/${user[0].id}` )
        })
      }
  })
})

router.post( '/login', ( request, response ) => {
  database.getUser( request.body, ( error, user ) => {
    if ( error ) {
      response.status( 500 ).render('error', { error: error } )
    } else {
      request.session.user = user[0]
      response.redirect( `/users/${user[0].id}` )
    }
  })
})

router.get( '/users/:id', ( request, response ) => {
  if ( !request.session.user ) {
    response.redirect( '/' )
  }
  if ( request.session.user.id !== +request.params.id ) {
    response.redirect( `/users/${request.session.user.id}` )
  }
  let { name, email, joined, id } = request.session.user
  joined = _formatTime( joined )
  response.render( 'profile', { loggedIn: true, name, email, joined, id } )
})

router.get( '/logout', ( request, response ) => {
  request.session.destroy()
  response.redirect('/')
})

function _formatTime( date ) {
  return new Date(date).toLocaleDateString("en-us", { hour: 'numeric', minute: 'numeric' })
}

module.exports = router
