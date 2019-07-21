'use strict';

module.exports = function (sequelize, DataTypes) {
  var Genre = sequelize.define('Genre', {
    name: {
      type: DataTypes.STRING,
      allowNull: {
        args: false,
        msg: 'Generos deben tener nombre'
      },
      allowEmpty: {
        args: false,
        msg: 'Generos deben tener nombre'
      },
      unique: {
        args: true,
        msg: 'Genero ya existe'
      }
    },
    isFor: {
      type: DataTypes.STRING
    }
  }, {});
  Genre.associate = function (models) {
    // associations can be defined here
    Genre.belongsToMany(models.GenericMedia, {
      through: 'GenreMedia',
      foreignKey: 'GenreId'
    });
    Genre.belongsToMany(models.Series, {
      through: 'SeriesGenre',
      foreignKey: 'genreId'
    });
  };
  return Genre;
};