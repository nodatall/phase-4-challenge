const express = require('express')
const database = require('./database')

const router = express()

router.get( '/', ( request, response ) => {
  database.getAlbums(( error, albums ) => {
    if ( error ) {
      response.status(500).render( 'error', { error: error } )
    } else {
      response.render('index', { albums })
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
      response.render( 'album', { album: album } )
    }
  })
})

router.get( '/signup', ( request, response ) => response.render( 'sign_up' ) )
router.get( '/signin', ( request, response ) => {
  if ( request.session.user ) {
    response.redirect( `/users/${request.session.user.id}` )
  } else {
    response.render( 'sign_in' )
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
          response.redirect( `/users/${users[0].id}` )
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
  const { name, email, joined } = request.session.user
  response.render( 'profile', { name, email, joined } )
})

module.exports = router
