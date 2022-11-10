'use strict'

const fs = require('fs')

module.exports = {
  async up(queryInterface, Sequelize) {
    const data = fs.readFileSync('src/database/seeders/pair_token.json', {
      encoding: 'utf8',
      flag: 'r',
    })

    const list = JSON.parse(data).flatMap(pool => [
      {
        pairAddress: pool.address,
        tokenAddress: pool.token0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        pairAddress: pool.address,
        tokenAddress: pool.token1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ])

    await queryInterface.bulkInsert('pair_token', list)
  },

  async down(queryInterface, Sequelize) {
    queryInterface.bulkDelete('pair_token', null, {})
  },
}
