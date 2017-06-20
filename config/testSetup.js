const { expect } = require('chai')
const { truncateTables } = require('../database')

beforeEach( () => {
  truncateTables((error) => {
    if (error) {
      console.log( '-:: Error truncating tables ::-' )
    }
  })
})

module.exports = expect
