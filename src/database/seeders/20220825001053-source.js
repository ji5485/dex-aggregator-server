'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    queryInterface.bulkInsert('source', [
      {
        address: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
        name: 'Uniswap V2',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        address: '0xC0AEe478e3658e2610c5F7A4A2E1777cE9e4f2Ac',
        name: 'Sushiswap',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ])
  },

  async down(queryInterface, Sequelize) {
    queryInterface.bulkDelete('source', null, {})
  },
}
