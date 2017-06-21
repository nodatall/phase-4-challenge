const expect = require('../config/testSetup')
const {
  getAlbums,
  getAlbumsByID,
  addUser,
  getUserByNameEmail,
  getUserById,
  addReview,
  getReviewsByAlbumId,
  getReviewsByUserId,
  deleteReview,
  getRecentReviews,
  getReviewById
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
      addUser( userInfo, _ => {
        addUser( userInfo, ( error, response ) => {
          expect( error.detail ).to.equal( 'Key (email)=(forgottenChicken@lg.com) already exists.' )
          done()
        })
      })
    })

  })

  context('getUserByNameEmail()', () => {

    it('should get user matching given email', done => {
      addUser( userInfo, _ => {
        getUserByNameEmail({ email:'forgottenChicken@lg.com', password: 1234 }, ( error, user ) => {
          expect( user[0].name ).to.equal( 'sylvan' )
          expect( user[0].password ).to.equal( '1234' )
          done()
        })
      })
    })

    it('should return no user if no user matches given email', done => {
      getUserByNameEmail({ email: '@.com', password: 1234 }, ( error, user ) => {
        expect( user.length ).to.equal( 0 )
        done()
      })
    })

  })

  context('getUserById()', () => {

    it('should get user matching given id', done => {
      addUser( userInfo, ( response, user ) => {
        getUserById( user[0].id, ( error, newUser ) => {
          expect( newUser[0].name ).to.equal( 'sylvan' )
          expect( newUser[0].password ).to.equal( '1234' )
          done()
        })
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
    },
    {
      content: 'confusing',
      user_id: undefined,
      album_id: 2
    }
  ]

  context('addReview()', () => {

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
      reviews[0].album_id = 1
      addUser( userInfo, ( error, user ) => {
        reviews[0].user_id = user[0].id
        reviews[1].user_id = user[0].id
        reviews[2].user_id = user[0].id
        addReview( reviews[0], _ => {
          addReview( reviews[1], _ => {
            addReview( reviews[2], _ => {
              getReviewsByAlbumId( 1, ( error, reviews ) => {
                expect( reviews.length ).to.equal( 2 )
                expect( reviews[1].content ).to.equal( 'terrible' )
                expect( reviews[1].name ).to.equal( 'sylvan' )
                expect( reviews[1].title ).to.equal( 'Malibu' )
                expect( reviews[0].content ).to.equal( 'awesome' )
                done()
              })
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

  context('getReviewsByUserId()', () => {

    it('should return all reviews for given user id', done => {
      addUser( userInfo, ( error, user ) => {
        reviews[0].user_id = user[0].id
        reviews[1].user_id = user[0].id
        addReview( reviews[0], _ => {
          addReview( reviews[1], _ => {
            addReview( reviews[2], _ => {
              getReviewsByUserId( user[0].id, ( error, reviews ) => {
                expect( reviews.length ).to.equal( 2 )
                expect( reviews[0].content ).to.equal( 'awesome' )
                done()
              })
            })
          })
        })
      })
    })

  })

  context('getReviewById()', () => {

    it('should return review matching given id', done => {
      addUser( userInfo, ( error, user ) => {
        reviews[0].user_id = user[0].id
        reviews[1].user_id = user[0].id
        addReview( reviews[0], ( error, newReview ) => {
          getReviewById( newReview[0].id, ( error, review ) => {
            expect( review[0].id ).to.equal( newReview[0].id )
            done()
          })
        })
      })
    })

  })

  context('deleteReview()', () => {

    it('should delete review with given id', done => {
      addUser( userInfo, ( error, user ) => {
        reviews[0].user_id = user[0].id
        addReview( reviews[0], ( error, [{ id: reviewId }] ) => {
          deleteReview( reviewId, ( error, review ) => {
            expect( review[0].id ).to.equal( reviewId )
            getReviewsByAlbumId( review.album_id, ( error, reviews ) => {
              expect( reviews ).to.deep.equal( [] )
              done()
            })
          })
        })
      })
    })

  })

  context('getRecentReviews()', () => {

    it('should return the given number of most recent reviews', done => {
      addUser( userInfo, ( error, user ) => {
        reviews[0].user_id = user[0].id
        reviews[1].user_id = user[0].id
        reviews[2].user_id = user[0].id
        addReview( reviews[0], _ => {
          addReview( reviews[1], _ => {
            addReview( reviews[2], _ => {
              getRecentReviews( 3, ( error, reviews ) => {
                expect( reviews[0].date > reviews[1].date ).to.be.true
                done()
              })
            })
          })
        })
      })
    })

  })

})
