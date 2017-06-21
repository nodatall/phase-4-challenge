const express = require('express')
const database = require('./database')

const router = express()

router.get( '/', ( request, response ) => {
  database.getAlbums( ( error, albums ) => {
    if ( error ) {
      response.status( 500 ).render( 'error', { error: error } )
    } else {
      database.getRecentReviews( 3, ( error, reviews ) => {
        if ( error ) {
          response.status( 500 ).render('error', { error } )
        } else {
          reviews = _formatReviewsTimes( reviews )
          if ( request.session.user ) {
            const { id } = request.session.user
            response.render('index', { albums, reviews, id, loggedIn: true, page: 'home' })
          } else {
            response.render('index', { albums, reviews, loggedIn: false, page: 'home' })
          }
        }
      })
    }
  })
})

router.get( '/albums/:albumID', ( request, response ) => {
  const albumId = request.params.albumID

  database.getAlbumsByID( albumId, ( error, albums ) => {
    if ( error ) {
      response.status( 500 ).render( 'error', { error: error } )
    } else {
      const album = albums[0]
      database.getReviewsByAlbumId( albumId, ( error, reviews ) => {
        if ( error ) {
          response.status( 500 ).render('error', { error } )
        } else {
          reviews = _formatReviewsTimes( reviews )
          if ( request.session.user ) {
            const { id } = request.session.user
            response.render( 'album', { album, reviews, id, loggedIn: true, page: 'album' } )
          } else {
            response.render('album', { album, reviews, id: null, loggedIn: false, page: 'album' })
          }
        }
      })
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
        database.getUserByNameEmail( { email, password }, ( error, user ) => {
          request.session.user = user[0]
          response.redirect( `/users/${user[0].id}` )
        })
      }
  })
})

router.post( '/login', ( request, response ) => {
  database.getUserByNameEmail( request.body, ( error, user ) => {
    if ( error ) {
      response.status( 500 ).render('error', { error: error } )
    } else {
      request.session.user = user[0]
      response.redirect( `/users/${user[0].id}` )
    }
  })
})

router.get( '/users/:id', ( request, response ) => {
  database.getReviewsByUserId( request.params.id, ( error, reviews ) => {
    reviews = reviews.map( review => {
      review.date = _formatTime( review.date )
      return review
    })
    if ( !request.session.user ) {
      database.getUserById( request.params.id, ( error, user ) => {
        if ( error ) {
          response.status( 500 ).render('error', { error } )
        } else {
          let { name, email, joined, id } = user[0]
          joined = _formatTime( joined )
          response.render( 'profile', { loggedIn: false, page: 'profile', reviews, name, email, joined, id } )
        }
      })
    } else {
      let { name, email, joined, id } = request.session.user
      joined = _formatTime( joined )
      response.render( 'profile', { loggedIn: true, page: 'profile', reviews, name, email, joined, id } )
    }
  })
})

router.get( '/logout', ( request, response ) => {
  request.session.destroy()
  response.redirect('/')
})

router.post( '/reviews/new', ( request, response ) => {
  if ( request.session.user ) {
    database.addReview( request.body, ( error, review ) => {
      if ( error ) {
        response.status( 500 ).render('error', { error } )
      } else {
        response.redirect( `/albums/${request.body.album_id}` )
      }
    })
  } else {
    response.redirect( `/albums/${request.body.album_id}` )
  }
})

router.post( '/reviews/delete/:id', ( request, response ) => {
  database.getReviewById( request.params.id, ( error, review ) => {
    if ( error ) {
      response.status( 500 ).render('error', { error } )
    } else {
      if ( request.session.user && request.session.user.id === review[0].user_id ) {
        database.deleteReview( request.params.id, ( error, review ) => {
          if ( error ) {
            response.status( 500 ).render('error', { error } )
          } else {
            response.redirect( `/users/${review[0].user_id}` )
          }
        })
      } else {
        response.redirect( `/users/${review[0].user_id}`)
      }
    }
  })
})

function _formatReviewsTimes( reviews ) {
  return reviews.map( review => {
    review.date = _formatTime( review.date )
    return review
  })
}

function _formatTime( date ) {
  return new Date(date).toLocaleDateString("en-us", { hour: 'numeric', minute: 'numeric' })
}

module.exports = router
