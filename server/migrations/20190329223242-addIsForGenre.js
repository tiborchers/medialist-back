'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
        'Genres',
        'isFor',
         Sequelize.STRING
       )
    ]);
  },

  down: function (queryInterface, Sequelize) {
    // logic for reverting the changes
  }
};
