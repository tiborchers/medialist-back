'use strict';

module.exports = function (sequelize, DataTypes) {
  var GenreMedia = sequelize.define('GenreMedia', {
    GMId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'GenericMedia',
        key: 'id',
        as: 'GMId'
      }
    },
    GenreId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Genre',
        key: 'id',
        as: 'GenreId'
      }
    }
  }, {});
  GenreMedia.associate = function (models) {
    // associations can be defined here
  };
  return GenreMedia;
};