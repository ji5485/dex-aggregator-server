'use strict'

const fs = require('fs')

module.exports = {
  async up(queryInterface, Sequelize) {
    const data = fs.readFileSync('src/database/seeders/token.json', {
      encoding: 'utf8',
      flag: 'r',
    })

    await queryInterface.bulkInsert(
      'token',
      JSON.parse(data).map(token => ({
        ...token,
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
    )
  },

  async down(queryInterface, Sequelize) {
    queryInterface.bulkDelete('pair', null, {})
  },
}
