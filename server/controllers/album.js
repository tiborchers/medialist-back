import model from '../models'
import Sequelize from 'sequelize'
import axios from 'axios'

let { Album, GenericMedia, Genre, Song, UserGM, User } = model

const Op = Sequelize.Op

class Albums {
  static create(req, res) {
    const {
      image,
      title,
      year,
      commentary,
      duration,
      numberOfSongs,
      artist,
      rating,
      genres,
      songs
    } = req.body
    return GenericMedia.findOrCreate({
      where: {
        title: title,
        year: year
      },
      defaults: {
        image: image,
        commentary: commentary
      }
    })
      .then(async ([newGM, createdShort]) => {
        if (createdShort) {
          genres.map(genre => {
            Genre.findOrCreate({
              where: { name: genre, isFor: 'Album' }
            }).then(([newGenre, created]) => {
              newGM.addGenre(newGenre)
            })
          })
          let GMId = newGM.id
          await Album.create({
            duration,
            artist,
            numberOfSongs,
            rating,
            GMId
          }).then(newAlbum => {
            songs.map(song => {
              Song.create({
                song
              }).then(([created, found]) => {
                newAlbum.addSong(created)
              })
            })
          })
        }
        let user = await req.user
        await user.addGenericMedium(newGM)
        res.status(201).send({
          success: true,
          message: 'Album successfully created',
          newGM
        })
      })
      .catch(error => {
        res.status(400).send({
          success: false,
          message: 'Album creation failed',
          error
        })
      })
  }

  static createAdmin(req, res) {
    const {
      image,
      title,
      year,
      commentary,
      duration,
      numberOfSongs,
      artist,
      rating,
      genres,
      songs
    } = req.body
    return Album.create(
      {
        duration,
        artist,
        numberOfSongs,
        rating,
        GenericMedium: {
          image,
          title,
          year,
          commentary
        }
      },
      {
        include: [
          {
            association: Album.associations.GenericMedium
          }
        ]
      }
    )
      .then(async newAlbum => {
        let GM = await newAlbum.getGenericMedium()
        genres.map(genre => {
          Genre.findOrCreate({
            where: {
              name: genre,
              isFor: 'VideoGame'
            }
          }).then(([created, found]) => {
            GM.addGenre(created)
          })
        })
        songs.map(song => {
          Album.Create({
            song
          }).then(([created, found]) => {
            newAlbum.addSong(created)
          })
        })
        res.status(201).send({
          success: true,
          message: 'Video Game successfully created',
          newAlbum
        })
      })
      .catch(error => {
        res.status(400).send({
          success: false,
          message: 'Video Game creation failed',
          error
        })
      })
  }

  static toListen(req, res) {
    return req.user
      .then(user => {
        user
          .getGenericMedia({
            include: [
              {
                model: Album,
                attributes: [
                  'id',
                  'rating',
                  'duration',
                  'artist',
                  'numberOfSongs'
                ],
                include: [
                  {
                    model: Song,
                    attributes: ['disc', 'trackNumber', 'title', 'duration']
                  }
                ]
              },
              {
                model: Genre,
                attributes: ['id', 'name'],
                through: { attributes: [] }
              }
            ],
            order: [
              ['year', 'ASC'],
              ['title', 'ASC'],
              [Album, Song, 'disc', 'ASC'],
              [Album, Song, 'trackNumber', 'ASC']
            ],
            where: {
              [Op.not]: [{ $Album$: null }]
            },
            through: {
              attributes: ['consumed', 'consumedDate'],
              where: { consumed: false }
            }
          })
          .then(albums => {
            res.status(200).send(albums)
          })
      })
      .catch(error => res.status(400).send(error))
  }

  static randomAlbum2(req, res) {
    return req.user.then(user => {
      Album.findOne({
        order: [
          [Song, 'disc', 'ASC'],
          [Song, 'trackNumber', 'ASC'],
          [Sequelize.fn('RANDOM')]
        ],
        include: [
          {
            model: GenericMedia,
            include: [
              {
                model: User,
                where: { id: user.id },
                attributes: [],
                through: { where: { consumed: false } }
              },
              {
                model: Genre,
                attributes: ['id', 'name'],
                through: { attributes: [] }
              }
            ]
          },
          {
            model: Song,
            attributes: ['title', 'duration', 'trackNumber', 'disc']
          }
        ]
      }).then(album => {
        let response = {}
        response['id'] = album['GenericMedium']['id']
        response['image'] = album['GenericMedium']['image']
        response['title'] = album['GenericMedium']['title']
        response['year'] = album['GenericMedium']['year']
        response['Genres'] = album['GenericMedium']['Genres']
        response['commentary'] = album['GenericMedium']['commentary']
        response['Album'] = {}
        response['Album']['id'] = album['id']
        response['Album']['rating'] = album['rating']
        response['Album']['duration'] = album['duration']
        response['Album']['artist'] = album['artist']
        response['Album']['numberOfSongs'] = album['numberOfSongs']
        response['Album']['Songs'] = album['Songs']
        response['Album']['Genres'] = album['Genres']
        return res.status(200).send(response)
      })
    })
  }

  static toListenCount(req, res) {
    return req.user.then(user => {
      user
        .getGenericMedia({
          include: [
            {
              model: Album
            }
          ],
          where: {
            [Op.not]: [{ $Album$: null }]
          },
          through: {
            attributes: ['consumed', 'consumedDate'],
            where: { consumed: false }
          }
        })
        .then(albums => res.status(200).send({ count: albums.length }))
    })
  }

  static listenedCount(req, res) {
    return req.user.then(user => {
      user
        .getGenericMedia({
          include: [
            {
              model: Album
            }
          ],
          where: {
            [Op.not]: [{ $Album$: null }]
          },
          through: {
            attributes: ['consumed', 'consumedDate'],
            where: { consumed: true }
          }
        })
        .then(albums => res.status(200).send({ count: albums.length }))
    })
  }

  static listenedList(req, res) {
    return req.user.then(user => {
      user
        .getGenericMedia({
          include: [
            {
              model: Album,
              attributes: [
                'id',
                'rating',
                'duration',
                'artist',
                'numberOfSongs'
              ],
              include: [
                {
                  model: Song,
                  attributes: ['disc', 'trackNumber', 'title', 'duration']
                }
              ]
            },
            {
              model: Genre,
              attributes: ['id', 'name'],
              through: { attributes: [] }
            },
            {
              model: User,
              attributes: []
            }
          ],
          order: [
            [User, UserGM, 'consumedDate', 'ASC'],
            ['year', 'ASC'],
            ['title', 'ASC'],
            [Album, Song, 'disc', 'ASC'],
            [Album, Song, 'trackNumber', 'ASC']
          ],
          where: {
            [Op.not]: [{ $Album$: null }]
          },
          through: {
            attributes: ['consumed', 'consumedDate'],
            where: { consumed: true }
          }
        })
        .then(albums => res.status(200).send(albums))
    })
  }

  static list(req, res) {
    return Album.findAll({
      include: [
        {
          model: GenericMedia,
          attributes: ['image', 'title', 'year', 'commentary'],
          include: [
            {
              model: Genre,
              attributes: ['id', 'name'],
              through: { attributes: [] }
            }
          ]
        },
        {
          model: Song,
          attributes: ['disc', 'trackNumber', 'title', 'duration']
        }
      ]
    }).then(albums =>
      res.status(200).send({
        success: true,
        message: 'Album list retrieved',
        albums
      })
    )
  }

  static get(req, res) {
    return Album.findByPk(req.params.albumId, {
      include: [
        {
          model: GenericMedia,
          include: [{ model: Genre }]
        },
        {
          model: Song
        }
      ]
    })
      .then(album => {
        if (!album) {
          return res.status(404).send({
            success: false,
            message: 'Album Not Found'
          })
        }
        return res.status(200).send({
          success: true,
          message: 'Album retrieved',
          album
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
      return Album.findByPk(req.params.albumId)
        .then(album => {
          if (!album) {
            return res.status(400).send({
              success: false,
              message: 'Album Not Found'
            })
          }
          GenericMedia.findByPk(album.GMId).then(gm => {
            return user.removeGenericMedium(gm).then(() => {
              res.status(200).send({
                success: true,
                message: 'Album successfully deleted'
              })
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
    })
  }

  static deleteAdmin(req, res) {
    return Album.findByPk(req.params.albumId).then(album => {
      if (!album) {
        return res.status(404).send({
          success: false,
          message: 'VideoGame Not Found'
        })
      }
      GenericMedia.findByPk(album.GMId).then(gm => {
        gm.destroy()
      })
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
      (!url.includes('allmusic.com/') && !url.includes('rateyourmusic.com/'))
    ) {
      return res.status(400).send({
        success: false,
        message: 'No url'
      })
    }
    const execFile = require('child_process').exec
    let pythonProcess = null
    if (url.includes('allmusic.com/')) {
      pythonProcess = await execFile(
        'server\\controllers\\scripts\\allmusic.py ' + url
      )
    } else {
      pythonProcess = await execFile(
        'server\\controllers\\scripts\\rym.py ' + url
      )
    }
    pythonProcess.stdout.on('data', data => {
      const {
        image,
        title,
        year,
        commentary,
        duration,
        numberOfSongs,
        artist,
        rating,
        genres,
        songs
      } = JSON.parse(data.toString())
      return GenericMedia.findOrCreate({
        where: {
          title: title,
          year: year
        },
        defaults: {
          image: image,
          commentary: commentary
        }
      })
        .then(async ([newGM, createdShort]) => {
          if (createdShort) {
            genres.map(async genre => {
              await Genre.findOrCreate({
                where: { name: genre, isFor: 'Album' }
              }).then(([newGenre, created]) => {
                return newGM.addGenre(newGenre)
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
          await user.addGenericMedium(newGM)
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

  static async createByUrlFlask(req, res) {
    const { url } = req.body
    if (
      typeof url === 'undefined' ||
      (!url.includes('allmusic.com/') && !url.includes('rateyourmusic.com/'))
    ) {
      return res.status(400).send({
        success: false,
        message: 'No url'
      })
    }
    let result = null
    let success = false
    if (url.includes('allmusic.com/')) {
      await axios
        .post('http://192.168.1.90:5000/allmusic', {
          url: url
        })
        .then(res => {
          result = res.data
          success = true
        })
        .catch(err => {
          result = err
        })
    } else {
      await axios
        .post('http://192.168.1.90:5000/rym', {
          url: url
        })
        .then(res => {
          result = res.data
          success = true
        })
        .catch(err => {
          result = err
        })
    }
    if (!success) {
      return res.status(400).send({
        success: false,
        message: result.toString()
      })
    }
    const {
      image,
      title,
      year,
      commentary,
      duration,
      numberOfSongs,
      artist,
      rating,
      genres,
      songs
    } = result
    return GenericMedia.findOrCreate({
      where: {
        title: title,
        year: year
      },
      defaults: {
        image: image,
        commentary: commentary
      }
    })
      .then(async ([newGM, createdShort]) => {
        if (createdShort) {
          genres.map(async genre => {
            await Genre.findOrCreate({
              where: { name: genre, isFor: 'Album' }
            }).then(([newGenre, created]) => {
              return newGM.addGenre(newGenre)
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
        await user.addGenericMedium(newGM)
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
        album
          .setSongs(newSongs)
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

export default Albums
