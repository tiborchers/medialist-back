'use strict';

module.exports = function (sequelize, DataTypes) {
  var Episode = sequelize.define('Episode', {
    title: DataTypes.STRING,
    aired: DataTypes.DATE,
    episodeNumber: DataTypes.INTEGER,
    seasonId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Seasons',
        key: 'id',
        as: 'seasonId'
      }
    }
  }, {});
  Episode.associate = function (models) {
    // associations can be defined here
    Episode.belongsTo(models.Season, {
      foreignKey: 'seasonId',
      onDelete: 'CASCADE'
    });
    Episode.belongsToMany(models.User, {
      through: 'UserEpisode',
      foreignKey: 'episodeId'
    });
  };
  return Episode;
};