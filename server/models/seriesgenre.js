'use strict'
module.exports = (sequelize, DataTypes) => {
  const SeriesGenre = sequelize.define(
    'SeriesGenre',
    {
      seriesId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Series',
          key: 'id',
          as: 'seriesId'
        }
      },
      genreId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Genre',
          key: 'id',
          as: 'genreId'
        }
      }
    },
    {}
  )
  SeriesGenre.associate = function(models) {
    // associations can be defined here
  }
  return SeriesGenre
}
