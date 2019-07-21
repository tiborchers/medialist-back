'use strict';

module.exports = function (sequelize, DataTypes) {
  var VideoGame = sequelize.define('VideoGame', {
    HLTB: {
      type: DataTypes.FLOAT
    },
    rating: {
      type: DataTypes.FLOAT
    },
    GMId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'GenericMedia',
        key: 'id',
        as: 'GMId'
      }
    },
    developer: {
      type: DataTypes.STRING
    }
  }, {});
  VideoGame.associate = function (models) {
    // associations can be defined here
    VideoGame.belongsTo(models.GenericMedia, {
      foreignKey: 'GMId',
      onDelete: 'CASCADE'
    });
    VideoGame.belongsToMany(models.Console, {
      through: 'VGConsole',
      foreignKey: 'VGId'
    });
  };
  return VideoGame;
};