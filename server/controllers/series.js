import model from '../models'
import Sequelize from 'sequelize'

const {
  Series,
  UserSeries,
  Genre,
  Seasons,
  Episodes,
  UserEpisodes,
  User,
  Series
} = model

const Op = Sequelize.Op

class Series {
  static toWatch(req, res) {
    return req.user.then(user => {
      user
        .getSeries({
          include: [
            {
              model: Seasons,
              include: [
                {
                  model: Episodes,
                }
              ]
            },
            {
              model: Genre,
              through: { attributes: [] }
            }
          ],
          order: [['initialYear', 'ASC'], ['title', 'ASC']],
          through: {
            attributes: ['state', 'stateDate'],
            where: { state: "To watch" }
          }
        })
        .then(series => res.status(200).send(series))
  }
  static toWatchCount(req, res) {
    return req.user.then(user => {
      user
        .getSeries({
          through: {
            attributes: ['state', 'stateDate'],
            where: { state: "To watch" }
          }
        })
        .then(series => res.status(200).send({ count: series.length }))
    })
  }

  static get(req, res) {
    return Series.findByPk(req.params.albumId, {
      include: [
        {
          model: Seasons,
          include: [{ model: Episodes }]
        },
        {
          model: Genre,
          through: { attributes: [] }
        }
      ]
    })
      .then(serie => {
        if (!serie) {
          return res.status(404).send({
            success: false,
            message: 'Album Not Found'
          })
        }
        return res.status(200).send({
          success: true,
          message: 'Album retrieved',
          serie
        })
      })
      .catch(error => {
        res.status(400).send({
          success: false,
          message: 'Wrong PK',
          error
        })
      })
  }

  static delete(req, res) {
    return req.user.then(user => {
      return Series.findByPk(req.params.albumId)
        .then(album => {
          if (!album) {
            return res.status(400).send({
              success: false,
              message: 'Album Not Found'
            })
          }
        })
        .catch(error => {
          res.status(400).send({
            success: false,
            message: 'Wrong PK',
            error
          })
        })
    })
  }

  static deleteAdmin(req, res) {
    return Series.findByPk(req.params.albumId).then(album => {
      if (!album) {
        return res.status(404).send({
          success: false,
          message: 'VideoGame Not Found'
        })
      }
      return album
        .destroy()
        .then(() => {
          res.status(200).send({
            success: false,
            message: 'Album successfully deleted'
          })
        })
        .catch(error => {
          res.status(400).send({
            success: false,
            message: 'Wrong PK',
            error
          })
        })
    })
  }

  static async createByUrl(req, res) {
    const { url } = req.body
    if (
      typeof url === 'undefined' ||
      (!url.includes('imdb.com/'))
    ) {
      return res.status(400).send({
        success: false,
        message: 'No url'
      })
    }
    const execFile = require('child_process').execFile
    let pythonProcess = await execFile('python', [
      'server/controllers/scripts/imdbtvseries.py',
      url
    ])
    pythonProcess.stdout.on('data', data => {
      const {
        image,
        title,
        initialYear,
        finalYear,
        durationOfEpisode,
        rating,
        genres,
        seasons
      } = JSON.parse(data.toString())
      return Series.findOrCreate({
        where: {
          title: title,
          initialYear: initialYear
        },
        defaults: {
          image: image,
          finalYear: finalYear,
          durationOfEpisode: durationOfEpisode,
          rating: rating
        }
      })
        .then(async ([newGM, createdShort]) => {
          if (createdShort) {
            genres.map(async genre => {
              await Genre.findOrCreate({
                where: { name: genre, isFor: 'Series' }
              }).then(([newGenre, created]) => {
                return newGM.addSeries(newGenre)
              })
            })
            let GMId = newGM.id
            await Album.create({
              duration,
              artist,
              numberOfSongs,
              rating,
              GMId
            }).then(async newAlbum => {
              let newSongs = songs.map(newSong => {
                return Song.create(newSong)
              })
              newSongs = await Promise.all(newSongs)
              await newAlbum.setSongs(newSongs)
            })
          }
          let user = await req.user
          await user.addSeries(newGM)
          return res.status(201).send({
            success: true,
            message: 'Album successfully created',
            newGM
          })
        })
        .catch(error => {
          if (!res._headerSent) {
            return res.status(400).send({
              success: false,
              message: 'Album creation failed',
              error
            })
          }
        })
    })
    pythonProcess.stderr.on('data', data => {
      if (!res._headerSent) {
        return res.status(400).send({
          success: false,
          message: data.toString()
        })
      }
    })
  }

  static modify(req, res) {
    const {
      image,
      title,
      year,
      commentary,
      duration,
      numberOfSongs,
      artist,
      rating
    } = req.body
    return Album.findByPk(req.params.albumId)
      .then(async album => {
        if (!album) {
          return res.status(404).send({
            success: false,
            message: 'Album Not Found'
          })
        }
        let gm = await album.getGenericMedium()
        gm.update({
          image: image || gm.image,
          title: title || gm.title,
          year: year || gm.year,
          commentary: commentary || gm.commentary
        })
        album
          .update({
            duration: duration || album.duration,
            rating: rating || album.rating,
            artist: artist || album.artist,
            numberOfSongs: numberOfSongs || album.numberOfSongs
          })
          .then(updated => {
            res.status(200).send({
              success: false,
              message: 'Album updated successfully',
              data: {
                duration: duration || album.duration,
                rating: rating || album.rating,
                artist: artist || album.artist,
                image: image || gm.image,
                title: title || gm.title,
                year: year || gm.year,
                commentary: commentary || gm.commentary
              }
            })
          })
          .catch(error =>
            res.status(400).send({
              success: false,
              message: 'Album modification failed',
              error
            })
          )
      })
      .catch(error => {
        res.status(400).send({
          success: false,
          message: 'Wrong PK',
          error
        })
      })
  }

  static listened(req, res) {
    return req.user.then(user => {
      Album.findByPk(req.params.albumId)
        .then(async album => {
          let gm = await album.getGenericMedium()
          user
            .addGenericMedium(gm, {
              through: {
                consumed: true,
                consumedDate: Date.now()
              }
            })
            .then(updated => {
              res.status(200).send({
                success: true,
                message: 'Album updated successfully!',
                updated
              })
            })
            .catch(error => {
              res.status(400).send({
                success: true,
                message: 'Album updated successfully!',
                error
              })
            })
        })
        .catch(error => {
          res.status(400).send({
            success: false,
            error
          })
        })
    })
  }

  static listenedDate(req, res) {
    const { date } = req.body
    return req.user.then(user => {
      Album.findByPk(req.params.albumId)
        .then(async album => {
          let gm = await album.getGenericMedium()
          user
            .addGenericMedium(gm, {
              through: {
                consumed: true,
                consumedDate: new Date(date)
              }
            })
            .then(updated => {
              res.status(200).send({
                success: true,
                message: 'Album updated successfully',
                updated
              })
            })
        })
        .catch(error => {
          res.status(400).send({
            success: false,
            error
          })
        })
    })
  }

  static unListened(req, res) {
    return req.user.then(user => {
      Album.findByPk(req.params.albumId)
        .then(async album => {
          let gm = await album.getGenericMedium()
          user
            .addGenericMedium(gm, {
              through: {
                consumed: false,
                consumedDate: null
              }
            })
            .then(updated => {
              res.status(200).send({
                success: true,
                message: 'Album updated successfully',
                updated
              })
            })
        })
        .catch(error => {
          res.status(400).send({
            success: false,
            error
          })
        })
    })
  }

  static changeGenres(req, res) {
    const { genres } = req.body
    Album.findByPk(req.params.albumId)
      .then(async album => {
        if (!album) {
          return res.status(404).send({
            success: false,
            message: 'Album Not Found'
          })
        }
        let GM = await album.getGenericMedium()
        let newGenres = genres.map(genre => {
          return Genre.findOrCreate({
            where: {
              name: genre,
              isFor: 'Album'
            }
          })
        })
        newGenres = await Promise.all(newGenres)
        newGenres = newGenres.map(elem => elem[0])
        GM.setGenres(newGenres)
          .then(data => {
            res.status(200).send({
              success: true,
              message: 'Album genre change',
              data
            })
          })
          .catch(error => {
            res.status(400).send({
              success: false,
              message: 'Album modification failed',
              error
            })
          })
      })
      .catch(error => {
        res.status(400).send({
          success: false,
          message: 'Wrong PK',
          error
        })
      })
  }

  static changeSongs(req, res) {
    const { songs } = req.body
    Album.findByPk(req.params.albumId)
      .then(async album => {
        if (!album) {
          return res.status(404).send({
            success: false,
            message: 'Album Not Found'
          })
        }
        let newSongs = songs.map(song => {
          return Song.findOrCreate({
            where: {
              title: song.title,
              duration: song.duration,
              trackNumber: song.trackNumber,
              disc: song.disc,
              AlbumId: album.id
            }
          })
        })
        newSongs = await Promise.all(newSongs)
        newSongs = newSongs.map(elem => elem[0])
        album.setSongs(newSongs)
          .then(data => {
            res.status(200).send({
              success: true,
              message: 'Album songs change',
              data
            })
          })
          .catch(error => {
            res.status(400).send({
              success: false,
              message: 'Album modification failed',
              error
            })
          })
      })
      .catch(error => {
        res.status(400).send({
          success: false,
          message: 'Wrong PK',
          error
        })
      })
  }

  static sumOfHours(req, res) {
    return req.user.then(user => {
      user
        .getGenericMedia({
          includeIgnoreAttributes: false,
          include: [
            {
              model: Album,
              attributes: []
            }
          ],
          where: {
            [Op.not]: [{ $Album$: null }]
          },
          through: {
            where: { consumed: false }
          },
          attributes: [
            [Sequelize.fn('SUM', Sequelize.col('Album.duration')), 'total']
          ],
          raw: true
        })
        .then(albums => res.status(200).send({ albums }))
    })
  }
}

export default Series
