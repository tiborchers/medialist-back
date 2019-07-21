'use strict'
module.exports = (sequelize, DataTypes) => {
  const UserEpisode = sequelize.define(
    'UserEpisode',
    {
      consumed: DataTypes.BOOLEAN,
      consumedDate: DataTypes.DATE,
      userId: DataTypes.INTEGER,
      episodeId: DataTypes.INTEGER
    },
    {}
  )
  UserEpisode.associate = function(models) {
    // associations can be defined here
  }
  return UserEpisode
}
