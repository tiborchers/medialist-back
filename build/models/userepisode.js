'use strict';

module.exports = function (sequelize, DataTypes) {
  var UserEpisode = sequelize.define('UserEpisode', {
    consumed: DataTypes.BOOLEAN,
    consumedDate: DataTypes.DATE,
    userId: DataTypes.INTEGER,
    episodeId: DataTypes.INTEGER
  }, {});
  UserEpisode.associate = function (models) {
    // associations can be defined here
  };
  return UserEpisode;
};