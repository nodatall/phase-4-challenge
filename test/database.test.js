const expect = require('../config/testSetup')
const { getAlbums, getAlbumsByID } = require('../database.js')

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
