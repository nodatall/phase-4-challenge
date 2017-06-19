const expect = require('../config/testSetup')
const {
  getAlbums,
  getAlbumsByID,
  addUser,
  getUserByEmail
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

describe('users', () => {

  context('getUserByEmail()', () => {

    it('should get user matching given email', done => {
      const userInfo = { name: 'sylvan', email: 'forgottenChicken@lg.com', password: 1234}
      addUser( userInfo, ( error, response ) => {
        getUserByEmail('forgottenChicken@lg.com', ( error, user ) => {
          expect( user[0].name ).to.equal( 'sylvan' )
          expect( user[0].password ).to.equal( '1234' )
          done()
        })
      })
    })

    it('should return no user if no user matches given email', done => {
      getUserByEmail('@.com', ( error, user ) => {
        expect( user.length ).to.equal( 0 )
        done()
      })
    })
  })

})
