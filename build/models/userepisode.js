'use strict';

module.exports = function (sequelize, DataTypes) {
  var UserEpisode = sequelize.define('UserEpisode', {
    consumed: { type: DataTypes.BOOLEAN, default: false },
    consumedDate: DataTypes.DATE,
    userId: DataTypes.INTEGER,
    episodeId: DataTypes.INTEGER
  }, {});
  UserEpisode.associate = function (models) {
    // associations can be defined here
  };
  return UserEpisode;
};