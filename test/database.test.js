const expect = require('../config/testSetup')
const {
  getAlbums,
  getAlbumsByID,
  addUser,
  getUser,
  addReview,
  getReviewsByAlbumId
} = require('../database.js')

describe('albums', () => {

  context('getAlbums()', () => {

    it('should get all albums', done => {
      getAlbums( (error, albums) => {
        expect( albums.length ).to.equal( 4 )
        expect( albums[0].title ).to.equal( 'Malibu' )
        done()
      })
    })

  })

  context('getAlbumsByID()', () => {

    it('should get album with given id', done => {
      getAlbumsByID( 1, ( error, album ) => {
        expect( album.length ).to.equal( 1 )
        expect( album[0].title ).to.equal('Malibu')
        done()
      })
    })

  })

})

const userInfo = { name: 'sylvan', email: 'forgottenChicken@lg.com', password: 1234 }

describe('users', () => {

  context('addUser()', () => {

    it('should create a new user and return the new user data', done => {
      addUser( userInfo, ( error, user ) => {
        expect( user[0].name ).to.equal( 'sylvan' )
        expect( user[0].email ).to.equal( 'forgottenChicken@lg.com' )
        done()
      })
    })

    it('should throw an error if user with email already exists', done => {
      addUser( userInfo, _ => {} )
      addUser( userInfo, ( error, response ) => {
        expect( error.detail ).to.equal( 'Key (email)=(forgottenChicken@lg.com) already exists.' )
        done()
      })
    })

  })

  context('getUser()', () => {

    it('should get user matching given email', done => {
      addUser( userInfo, _ => {} )
      getUser({ email:'forgottenChicken@lg.com', password: 1234 }, ( error, user ) => {
        expect( user[0].name ).to.equal( 'sylvan' )
        expect( user[0].password ).to.equal( '1234' )
        done()
      })
    })

    it('should return no user if no user matches given email', done => {
      getUser({ email: '@.com', password: 1234 }, ( error, user ) => {
        expect( user.length ).to.equal( 0 )
        done()
      })
    })

  })

})

describe('reviews', () => {
  const reviews = [
    {
      content: 'terrible',
      user_id: undefined,
      album_id: 1
    },
    {
      content: 'awesome',
      user_id: undefined,
      album_id: 1
    }
  ]

  context('addReview', () => {

    it('should add a review to the reviews table and return it', done => {
      addUser( userInfo, ( error, user ) => {
        reviews[0].user_id = user[0].id
        addReview( reviews[0], ( error, review ) => {
          expect( review[0].content ).to.equal( 'terrible' )
          expect( review[0].album_id)
          done()
        })
      })
    })

    it('should not allow a review to be added if no user_id matches', done => {
      reviews[0].user_id = 1
      addReview( reviews[0], ( error, review ) => {
        expect( error.detail ).to.equal( 'Key (user_id)=(1) is not present in table "users".' )
        done()
      })
    })

    it('should not allow a review to be added if no album_id matches', done => {
      addUser( userInfo, ( error, user ) => {
        reviews[0].user_id = user[0].id
        reviews[0].album_id = 100000000
        addReview( reviews[0], ( error, review ) => {
          expect( error.detail ).to.equal( 'Key (album_id)=(100000000) is not present in table "albums".' )
          done()
        })
      })
    })

  })

  context('getReviewsByAlbumId()', () => {

    it('should return all reviews matching given album id', done => {
      let userId
      reviews[0].album_id = 1
      addUser( userInfo, ( error, user ) => {
        reviews[0].user_id = user[0].id
        reviews[1].user_id = user[0].id
        userId = user[0].id
        addReview( reviews[0], _ => {
          addReview( reviews[1], _ => {
            getReviewsByAlbumId( 1, ( error, reviews ) => {
              expect( reviews.length ).to.equal( 2 )
              expect( reviews[0].content ).to.equal( 'terrible' )
              expect( reviews[1].content ).to.equal( 'awesome' )
              done()
            })
          })
        })
      })
    })

    it('should return no reviews if none match album id', done => {
      getReviewsByAlbumId( 1, ( error, reviews ) => {
        expect( reviews ).to.deep.equal( [] )
        done()
      })
    })

  })

})
