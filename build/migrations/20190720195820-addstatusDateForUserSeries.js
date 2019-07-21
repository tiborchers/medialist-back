'use strict';

module.exports = {
  up: function up(queryInterface, Sequelize) {
    return Promise.all([queryInterface.addColumn('UserSeries', 'stateDate', Sequelize.DATE)]);
  },

  down: function down(queryInterface, Sequelize) {
    // logic for reverting the changes
  }
};