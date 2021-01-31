'use strict';

module.exports = function (sequelize, DataTypes) {
  var UserSerie = sequelize.define('UserSerie', {
    state: {
      type: DataTypes.ENUM,
      values: ['To watch', 'Dropped', 'Done', 'Waiting for new season', 'Watching', 'On hold'],
      default: 'To watch',
      allowNull: {
        args: false,
        msg: 'Los libros deben tener duración'
      }
    },
    userId: DataTypes.INTEGER,
    seriesId: DataTypes.INTEGER,
    stateDate: DataTypes.DATE
  }, {});
  UserSerie.associate = function (models) {
    // associations can be defined here
  };
  return UserSerie;
};