'use strict'
module.exports = (sequelize, DataTypes) => {
  const Book = sequelize.define(
    'Book',
    {
      author: {
        type: DataTypes.STRING,
        defaultValue: 'Anónimo'
      },
      pages: {
        type: DataTypes.INTEGER,
        allowNull: {
          args: false,
          msg: 'Los libros deben tener duración'
        }
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
      }
    },
    {}
  )
  Book.associate = function(models) {
    // associations can be defined here
    Book.belongsTo(models.GenericMedia, {
      foreignKey: 'GMId',
      onDelete: 'CASCADE'
    })
  }
  return Book
}
