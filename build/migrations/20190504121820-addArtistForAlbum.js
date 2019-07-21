'use strict';

module.exports = {
  up: function up(queryInterface, Sequelize) {
    return Promise.all([queryInterface.addColumn('Albums', 'artist', Sequelize.STRING)]);
  },

  down: function down(queryInterface, Sequelize) {
    // logic for reverting the changes
  }
};