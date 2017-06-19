const express = require('express')
const database = require('./database')

const router = express()

router.get('/', (request, response) => {
  database.getAlbums((error, albums) => {
    if (error) {
      response.status(500).render('error', { error: error })
    } else {
      response.render('index', { albums: albums })
    }
  })
})

router.get('/albums/:albumID', (request, response) => {
  const albumID = request.params.albumID

  database.getAlbumsByID(albumID, (error, albums) => {
    if (error) {
      response.status(500).render('error', { error: error })
    } else {
      const album = albums[0]
      response.render('album', { album: album })
    }
  })
})

router.get('/signup', (request, response) => response.render('sign_up'))
router.get('/signin', (request, response) => response.render('sign_in'))

router.post('/users/new', (request, response) => {
  //Add new user
})

router.post('/login', (request, response) => {
  //Log in user
})

module.exports = router
