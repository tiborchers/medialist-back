'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
        'Series',
        'durationOfEpisode',
         Sequelize.INTEGER
       )
    ]);
  },

  down: function (queryInterface, Sequelize) {
    // logic for reverting the changes
  }
};
