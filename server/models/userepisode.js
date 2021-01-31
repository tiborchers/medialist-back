'use strict'
module.exports = (sequelize, DataTypes) => {
  const UserEpisode = sequelize.define(
    'UserEpisode',
    {
      consumed: { type: DataTypes.BOOLEAN, default: false },
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
