'use strict';

module.exports = {
  up: function up(queryInterface, Sequelize) {
    return Promise.all([queryInterface.addColumn('Movies', 'GMId', Sequelize.INTEGER)]);
  },

  down: function down(queryInterface, Sequelize) {
    // logic for reverting the changes
  }
};