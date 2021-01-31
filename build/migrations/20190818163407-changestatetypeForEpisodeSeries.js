'use strict';

module.exports = {
  up: function up(queryInterface, Sequelize) {
    return Promise.all([queryInterface.changeColumn('UserSeries', 'state', {
      type: Sequelize.ENUM,
      values: ['To watch', 'Dropped', 'Done', 'Waiting for new season', 'Watching'],
      default: 'To watch',
      allowNull: {
        args: false,
        msg: 'Los libros deben tener duración'
      }
    })]);
  },

  down: function down(queryInterface, Sequelize) {
    // logic for reverting the changes
  }
};