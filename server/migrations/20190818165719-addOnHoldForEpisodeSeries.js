'use strict'

module.exports = {
  up: function(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.sequelize.query(
        'ALTER TYPE "enum_UserSeries_state" ADD VALUE \'On hold\';'
      )
    ])
  },

  down: function(queryInterface, Sequelize) {
    // logic for reverting the changes
  }
}
