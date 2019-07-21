'use strict';

module.exports = function (sequelize, DataTypes) {
  var Season = sequelize.define('Season', {
    seasonNumber: DataTypes.INTEGER,
    initialDate: DataTypes.DATE,
    finalDate: DataTypes.DATE,
    seriesId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Series',
        key: 'id',
        as: 'seriesId'
      }
    }
  }, {});
  Season.associate = function (models) {
    // associations can be defined here
    Season.belongsTo(models.Series, {
      foreignKey: 'seriesId',
      onDelete: 'CASCADE'
    });
    Season.hasMany(models.Episode, {
      foreignKey: 'seasonId',
      onDelete: 'CASCADE'
    });
  };
  return Season;
};