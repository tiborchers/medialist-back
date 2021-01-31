'use strict';

module.exports = {
  up: function up(queryInterface, Sequelize) {
    return Promise.all([queryInterface.sequelize.query('ALTER TYPE "enum_UserSeries_state" ADD VALUE \'On hold\';')]);
  },

  down: function down(queryInterface, Sequelize) {
    // logic for reverting the changes
  }
};