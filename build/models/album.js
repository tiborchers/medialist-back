'use strict';

module.exports = function (sequelize, DataTypes) {
  var Album = sequelize.define('Album', {
    rating: {
      type: DataTypes.FLOAT
    },
    duration: {
      type: DataTypes.INTEGER
    },
    numberOfSongs: {
      type: DataTypes.INTEGER
    },
    artist: {
      type: DataTypes.STRING
    },
    GMId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'GenericMedia',
        key: 'id',
        as: 'GMId'
      }
    }
  }, {});
  Album.associate = function (models) {
    // associations can be defined here
    Album.belongsTo(models.GenericMedia, {
      foreignKey: 'GMId',
      onDelete: 'CASCADE'
    });
    Album.hasMany(models.Song, {
      foreignKey: 'AlbumId',
      onDelete: 'CASCADE'
    });
  };
  return Album;
};