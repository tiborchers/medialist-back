'use strict';

module.exports = function (sequelize, DataTypes) {
  var UserSerie = sequelize.define('UserSerie', {
    state: { type: DataTypes.STRING, default: 'To watch' },
    userId: DataTypes.INTEGER,
    seriesId: DataTypes.INTEGER,
    stateDate: DataTypes.DATE
  }, {});
  UserSerie.associate = function (models) {
    // associations can be defined here
  };
  return UserSerie;
};