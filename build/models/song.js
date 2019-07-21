'use strict';

module.exports = function (sequelize, DataTypes) {
  var Song = sequelize.define('Song', {
    title: {
      type: DataTypes.STRING
    },
    duration: {
      type: DataTypes.INTEGER
    },
    trackNumber: {
      type: DataTypes.INTEGER
    },
    disc: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    },
    AlbumId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Albums',
        key: 'id',
        as: 'AlbumId'
      }
    }
  }, {});
  Song.associate = function (models) {
    // associations can be defined here
    Song.belongsTo(models.Album, {
      foreignKey: 'AlbumId',
      onDelete: 'CASCADE'
    });
  };
  return Song;
};