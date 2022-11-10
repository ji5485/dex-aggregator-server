'use strict'

const fs = require('fs')

module.exports = {
  async up(queryInterface, Sequelize) {
    const data = fs.readFileSync('src/database/seeders/pair.json', {
      encoding: 'utf8',
      flag: 'r',
    })

    await queryInterface.bulkInsert(
      'pair',
      JSON.parse(data).map(pair => ({
        ...pair,
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
    )
  },

  async down(queryInterface, Sequelize) {
    queryInterface.bulkDelete('pair', null, {})
  },
}
