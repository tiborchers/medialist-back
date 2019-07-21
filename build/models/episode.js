'use strict';

module.exports = function (sequelize, DataTypes) {
  var Episode = sequelize.define('Episode', {
    title: DataTypes.STRING,
    aired: DataTypes.DATE,
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
  };
  return Episode;
};