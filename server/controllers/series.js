import model from '../models'
import Sequelize from 'sequelize'
import axios from 'axios'

const { Series, UserSerie, Genre, Season, Episode, UserEpisode, User } = model

const Op = Sequelize.Op

class Seriess {
  static toWatch(req, res) {
    return req.user.then(user => {
      user
        .getSeries({
          include: [
            {
              model: Season,
              attributes: ['seasonNumber', 'initialDate', 'finalDate', 'id'],
              include: [
                {
                  model: Episode,
                  attributes: ['title', 'aired', 'id', 'episodeNumber'],
                  include: [
                    {
                      model: User,
                      attributes: ['id'],
                      where: { id: user.id },
                      through: {
                        attributes: ['id', 'consumed', 'consumedDate']
                      },
                      required: false
                    }
                  ]
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
            ['initialYear', 'ASC'],
            ['title', 'ASC'],
            [Season, 'seasonNumber', 'ASC'],
            [Season, Episode, 'episodeNumber', 'ASC']
          ],
          through: {
            attributes: ['state', 'stateDate'],
            where: { state: 'To watch' }
          }
        })
        .then(series => res.status(200).send(series))
    })
  }

  static async getTotalWatched(req, res) {
    let user = await req.user
    return Series.findByPk(req.params.seriesId, {
      include: [
        {
          model: Season,
          attributes: ['id'],
          include: [
            {
              model: Episode,
              attributes: ['id'],
              include: [
                {
                  model: User,
                  attributes: ['id'],
                  where: { id: user.id },
                  through: {
                    attributes: ['id', 'consumed', 'consumedDate']
                  },
                  required: false
                }
              ]
            }
          ]
        }
      ]
    })
      .then(series => {
        if (!series) {
          return res.status(404).send({
            success: false,
            message: 'Album Not Found'
          })
        }
        let total = 0
        let watched = 0
        for (let i = 0; i < series.Seasons.length; i++) {
          for (let j = 0; j < series.Seasons[i].Episodes.length; j++) {
            if (series.Seasons[i].Episodes[j].Users.length > 0) {
              if (series.Seasons[i].Episodes[j].Users[0].UserEpisode.consumed) {
                watched += 1
              }
            }
            total += 1
          }
        }
        return res.status(200).send({
          success: true,
          message: 'Album retrieved',
          total,
          watched
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

  static dropped(req, res) {
    return req.user.then(user => {
      user
        .getSeries({
          include: [
            {
              model: Season,
              attributes: ['seasonNumber', 'initialDate', 'finalDate', 'id'],
              include: [
                {
                  model: Episode,
                  attributes: ['title', 'aired', 'id', 'episodeNumber'],
                  include: [
                    {
                      model: User,
                      attributes: ['id'],
                      where: { id: user.id },
                      through: {
                        attributes: ['id', 'consumed', 'consumedDate']
                      },
                      required: false
                    }
                  ]
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
            ['initialYear', 'ASC'],
            ['title', 'ASC'],
            [Season, 'seasonNumber', 'ASC'],
            [Season, Episode, 'episodeNumber', 'ASC']
          ],
          through: {
            attributes: ['state', 'stateDate'],
            where: { state: 'Dropped' }
          }
        })
        .then(series => res.status(200).send(series))
    })
  }

  static done(req, res) {
    return req.user.then(user => {
      user
        .getSeries({
          include: [
            {
              model: Season,
              attributes: ['seasonNumber', 'initialDate', 'finalDate', 'id'],
              include: [
                {
                  model: Episode,
                  attributes: ['title', 'aired', 'id', 'episodeNumber'],
                  include: [
                    {
                      model: User,
                      attributes: ['id'],
                      where: { id: user.id },
                      through: {
                        attributes: ['id', 'consumed', 'consumedDate']
                      },
                      required: false
                    }
                  ]
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
            ['initialYear', 'ASC'],
            ['title', 'ASC'],
            [Season, 'seasonNumber', 'ASC'],
            [Season, Episode, 'episodeNumber', 'ASC']
          ],
          through: {
            attributes: ['state', 'stateDate'],
            where: { state: 'Done' }
          }
        })
        .then(series => res.status(200).send(series))
    })
  }

  static waitingForNewSeason(req, res) {
    return req.user.then(user => {
      user
        .getSeries({
          include: [
            {
              model: Season,
              attributes: ['seasonNumber', 'initialDate', 'finalDate', 'id'],
              include: [
                {
                  model: Episode,
                  attributes: ['title', 'aired', 'id', 'episodeNumber'],
                  include: [
                    {
                      model: User,
                      attributes: ['id'],
                      where: { id: user.id },
                      through: {
                        attributes: ['id', 'consumed', 'consumedDate']
                      },
                      required: false
                    }
                  ]
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
            ['initialYear', 'ASC'],
            ['title', 'ASC'],
            [Season, 'seasonNumber', 'ASC'],
            [Season, Episode, 'episodeNumber', 'ASC']
          ],
          through: {
            attributes: ['state', 'stateDate'],
            where: { state: 'Waiting for new season' }
          }
        })
        .then(series => res.status(200).send(series))
    })
  }

  static watching(req, res) {
    return req.user.then(user => {
      user
        .getSeries({
          include: [
            {
              model: Season,
              attributes: ['seasonNumber', 'initialDate', 'finalDate', 'id'],
              include: [
                {
                  model: Episode,
                  attributes: ['title', 'aired', 'id', 'episodeNumber'],
                  include: [
                    {
                      model: User,
                      attributes: ['id'],
                      where: { id: user.id },
                      through: {
                        attributes: ['id', 'consumed', 'consumedDate']
                      },
                      required: false
                    }
                  ]
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
            ['initialYear', 'ASC'],
            ['title', 'ASC'],
            [Season, 'seasonNumber', 'ASC'],
            [Season, Episode, 'episodeNumber', 'ASC']
          ],
          through: {
            attributes: ['state', 'stateDate'],
            where: { state: 'Watching' }
          }
        })
        .then(series => res.status(200).send(series))
    })
  }

  static onHold(req, res) {
    return req.user.then(user => {
      user
        .getSeries({
          include: [
            {
              model: Season,
              attributes: ['seasonNumber', 'initialDate', 'finalDate', 'id'],
              include: [
                {
                  model: Episode,
                  attributes: ['title', 'aired', 'id', 'episodeNumber'],
                  include: [
                    {
                      model: User,
                      attributes: ['id'],
                      where: { id: user.id },
                      through: {
                        attributes: ['id', 'consumed', 'consumedDate']
                      },
                      required: false
                    }
                  ]
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
            ['initialYear', 'ASC'],
            ['title', 'ASC'],
            [Season, 'seasonNumber', 'ASC'],
            [Season, Episode, 'episodeNumber', 'ASC']
          ],
          through: {
            attributes: ['state', 'stateDate'],
            where: { state: 'On hold' }
          }
        })
        .then(series => res.status(200).send(series))
    })
  }

  static toWatchCount(req, res) {
    return req.user.then(user => {
      user
        .getSeries({
          through: {
            attributes: ['state', 'stateDate'],
            where: { state: 'To watch' }
          }
        })
        .then(series => res.status(200).send({ count: series.length }))
    })
  }

  static async get(req, res) {
    let user = await req.user
    return Series.findByPk(req.params.seriesId, {
      include: [
        {
          model: Season,
          attributes: ['seasonNumber', 'initialDate', 'finalDate', 'id'],
          include: [
            {
              model: Episode,
              attributes: ['title', 'aired', 'id', 'episodeNumber'],
              include: [
                {
                  model: User,
                  attributes: ['id'],
                  where: { id: user.id },
                  through: {
                    attributes: ['id', 'consumed', 'consumedDate']
                  },
                  required: false
                }
              ]
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
        ['initialYear', 'ASC'],
        ['title', 'ASC'],
        [Season, 'seasonNumber', 'ASC'],
        [Season, Episode, 'episodeNumber', 'ASC']
      ]
    })
      .then(series => {
        if (!series) {
          return res.status(404).send({
            success: false,
            message: 'Album Not Found'
          })
        }
        return res.status(200).send({
          success: true,
          message: 'Album retrieved',
          series
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
      return Series.findByPk(req.params.seriesId)
        .then(async series => {
          if (!series) {
            return res.status(400).send({
              success: false,
              message: 'Series Not Found'
            })
          }
          let episodes = await user.getEpisodes({
            include: [
              {
                model: Season,
                attributes: ['id'],
                include: [
                  {
                    model: Series,
                    attributes: ['id'],
                    where: { id: series.id }
                  }
                ]
              }
            ]
          })
          await user.removeEpisodes(episodes)
          return user.removeSeries(series).then(() => {
            res.status(200).send({
              success: true,
              message: 'Series successfully deleted'
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
    return Series.findByPk(req.params.seriesId).then(album => {
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
      (!url.includes('imdb.com/') && !url.includes('myanimelist.net/'))
    ) {
      return res.status(400).send({
        success: false,
        message: 'No url'
      })
    }
    const execFile = require('child_process').execFile
    let pythonProcess = null
    if (url.includes('myanimelist.net/')) {
      pythonProcess = await execFile('python3', [
        'server/controllers/scripts/mal.py',
        url
      ])
    } else {
      pythonProcess = await execFile('python3', [
        'server/controllers/scripts/imdbtvseries.py',
        url
      ])
    }
    pythonProcess.stdout.on('data', data => {
      const {
        image,
        title,
        initialYear,
        finalYear,
        durationOfEpisode,
        rating,
        genres,
        link,
        seasons
      } = JSON.parse(data.toString())
      let nfy = finalYear
      if (finalYear === '') {
        nfy = null
      }
      return Series.findOrCreate({
        where: {
          title: title,
          initialYear: initialYear
        },
        defaults: {
          image: image,
          finalYear: nfy,
          durationOfEpisode: durationOfEpisode,
          rating: rating,
          link: link
        }
      })
        .then(async ([newSerie, createdSeries]) => {
          if (createdSeries) {
            genres.map(async genre => {
              await Genre.findOrCreate({
                where: { name: genre, isFor: 'Series' }
              }).then(([newGenre, created]) => {
                return newSerie.addGenres(newGenre)
              })
            })
            let newSongs = Object.keys(seasons).map(async newSeason => {
              return Season.create(seasons[newSeason])
            })
            newSongs = await Promise.all(newSongs)
            /* let user = await req.user */
            for (let i = 0; i < Object.keys(seasons).length; i++) {
              let newEpisodes = seasons[i + 1]['episodes'].map(async newEp => {
                return Episode.create(newEp)
              })
              newEpisodes = await Promise.all(newEpisodes)
              await newSongs[i].addEpisodes(newEpisodes)
              /* user.addEpisodes(newEpisodes, {
                through: { consumed: false }
              }) */
            }
            await newSerie.setSeasons(newSongs)
          }
          let user = await req.user
          await user.addSeries(newSerie, {
            through: { state: 'To watch' }
          })
          return res.status(201).send({
            success: true,
            message: 'Album successfully created',
            newSerie
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
      (!url.includes('imdb.com/') && !url.includes('myanimelist.net/'))
    ) {
      return res.status(400).send({
        success: false,
        message: 'No url'
      })
    }
    let result = null
    let success = false
    if (url.includes('myanimelist.net/')) {
      await axios
        .post('http://192.168.1.90:5000/mal', {
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
        .post('http://192.168.1.90:5000/imdbtvseries', {
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
      initialYear,
      finalYear,
      durationOfEpisode,
      rating,
      genres,
      link,
      seasons
    } = result
    let nfy = finalYear
    if (finalYear === '') {
      nfy = null
    }
    return Series.findOrCreate({
      where: {
        title: title,
        initialYear: initialYear
      },
      defaults: {
        image: image,
        finalYear: nfy,
        durationOfEpisode: durationOfEpisode,
        rating: rating,
        link: link
      }
    })
      .then(async ([newSerie, createdSeries]) => {
        if (createdSeries) {
          genres.map(async genre => {
            await Genre.findOrCreate({
              where: { name: genre, isFor: 'Series' }
            }).then(([newGenre, created]) => {
              return newSerie.addGenres(newGenre)
            })
          })
          let newSongs = Object.keys(seasons).map(async newSeason => {
            return Season.create(seasons[newSeason])
          })
          newSongs = await Promise.all(newSongs)
          /* let user = await req.user */
          for (let i = 0; i < Object.keys(seasons).length; i++) {
            let newEpisodes = seasons[i + 1]['episodes'].map(async newEp => {
              return Episode.create(newEp)
            })
            newEpisodes = await Promise.all(newEpisodes)
            await newSongs[i].addEpisodes(newEpisodes)
            /* user.addEpisodes(newEpisodes, {
                through: { consumed: false }
              }) */
          }
          await newSerie.setSeasons(newSongs)
        }
        let user = await req.user
        await user.addSeries(newSerie, {
          through: { state: 'To watch' }
        })
        return res.status(201).send({
          success: true,
          message: 'Album successfully created',
          newSerie
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

  static async updateByUrl(req, res) {
    return Series.findByPk(req.params.seriesId).then(async series => {
      let url = series.link
      if (
        typeof url === 'undefined' ||
        (!url.includes('imdb.com/') && !url.includes('myanimelist.net/'))
      ) {
        return res.status(400).send({
          success: false,
          message: 'No url'
        })
      }
      const execFile = require('child_process').execFile
      let pythonProcess = null
      if (url.includes('myanimelist.net/')) {
        pythonProcess = await execFile('python3', [
          'server/controllers/scripts/mal.py',
          url
        ])
      } else {
        pythonProcess = await execFile('python3', [
          'server/controllers/scripts/imdbtvseries.py',
          url
        ])
      }
      pythonProcess.stdout.on('data', data => {
        const {
          image,
          initialYear,
          finalYear,
          durationOfEpisode,
          rating,
          seasons
        } = JSON.parse(data.toString())
        let nfy = finalYear
        if (finalYear === '') {
          nfy = null
        }

        return series
          .update({
            image: image || series.image,
            rating: rating || series.rating,
            finalYear: nfy || series.finalYear,
            durationOfEpisode: durationOfEpisode || series.durationOfEpisode,
            initialYear: initialYear || series.initialYear
          })
          .then(async newSeries => {
            let changes = false
            changes = newSeries.finalYear !== series.finalYear
            let newSongs = Object.keys(seasons).map(async newSeason => {
              return Season.findOrCreate({
                where: {
                  seasonNumber: seasons[newSeason].seasonNumber,
                  seriesId: series.id
                },
                defaults: {
                  initialDate: seasons[newSeason].initialDate,
                  finalDate: seasons[newSeason].finalDate
                }
              })
            })
            newSongs = await Promise.all(newSongs)
            newSongs = newSongs.map(element => {
              changes = changes || element[1]
              return element[0]
            })
            newSongs = newSongs.map(async (element, index) => {
              return element.update({
                initialDate: seasons[Object.keys(seasons)[index]].initialDate,
                finalDate: seasons[Object.keys(seasons)[index]].finalDate
              })
            })
            newSongs = await Promise.all(newSongs)
            let user = await req.user
            for (let i = 0; i < Object.keys(seasons).length; i++) {
              let newEpisodes = seasons[i + 1]['episodes'].map(async newEp => {
                return Episode.findOrCreate({
                  where: {
                    episodeNumber: newEp.episodeNumber,
                    seasonId: newSongs[i].id || null
                  },
                  defaults: {
                    aired: newEp.aired || null,
                    title: newEp.title
                  }
                })
              })
              newEpisodes = await Promise.all(newEpisodes)
              newEpisodes = newEpisodes.map(element => {
                changes = changes || element[1]
                return element[0]
              })
              newEpisodes = newEpisodes.map((element, index) => {
                element.update({
                  aired:
                    seasons[i + 1]['episodes'][index].aired || element.aired,
                  title:
                    seasons[i + 1]['episodes'][index].title || element.title
                })
              })
              newEpisodes = await Promise.all(newEpisodes)
              await newSongs[i].addEpisodes(newEpisodes)
              /* user.addEpisodes(newEpisodes, {
                through: { consumed: false }
              }) */
            }
            await newSeries.setSeasons(newSongs)
            if (changes) {
              await user.addSeries(newSeries, {
                through: { state: 'To watch' }
              })
            }
            return res.status(201).send({
              success: true,
              message: 'Album successfully created',
              newSeries
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
    })
  }

  static async updateByUrlFlask(req, res) {
    return Series.findByPk(req.params.seriesId).then(async series => {
      let url = series.link
      if (
        typeof url === 'undefined' ||
        (!url.includes('imdb.com/') && !url.includes('myanimelist.net/'))
      ) {
        return res.status(400).send({
          success: false,
          message: 'No url'
        })
      }
      let result = null
      let success = false
      if (url.includes('myanimelist.net/')) {
        await axios
          .post('http://192.168.1.90:5000/mal', {
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
          .post('http://192.168.1.90:5000/imdbtvseries', { url: url })
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
        initialYear,
        finalYear,
        durationOfEpisode,
        rating,
        seasons
      } = result
      let nfy = finalYear
      if (finalYear === '') {
        nfy = null
      }

      return series
        .update({
          image: image || series.image,
          rating: rating || series.rating,
          finalYear: nfy || series.finalYear,
          durationOfEpisode: durationOfEpisode || series.durationOfEpisode,
          initialYear: initialYear || series.initialYear
        })
        .then(async newSeries => {
          let changes = false
          changes = newSeries.finalYear !== series.finalYear
          let newSongs = Object.keys(seasons).map(async newSeason => {
            return Season.findOrCreate({
              where: {
                seasonNumber: seasons[newSeason].seasonNumber,
                seriesId: series.id
              },
              defaults: {
                initialDate: seasons[newSeason].initialDate,
                finalDate: seasons[newSeason].finalDate
              }
            })
          })
          newSongs = await Promise.all(newSongs)
          newSongs = newSongs.map(element => {
            changes = changes || element[1]
            return element[0]
          })
          newSongs = newSongs.map(async (element, index) => {
            return element.update({
              initialDate: seasons[Object.keys(seasons)[index]].initialDate,
              finalDate: seasons[Object.keys(seasons)[index]].finalDate
            })
          })
          newSongs = await Promise.all(newSongs)
          let user = await req.user
          for (let i = 0; i < Object.keys(seasons).length; i++) {
            let newEpisodes = seasons[i + 1]['episodes'].map(async newEp => {
              return Episode.findOrCreate({
                where: {
                  episodeNumber: newEp.episodeNumber,
                  seasonId: newSongs[i].id || null
                },
                defaults: {
                  aired: newEp.aired || null,
                  title: newEp.title
                }
              })
            })
            newEpisodes = await Promise.all(newEpisodes)
            newEpisodes = newEpisodes.map(element => {
              changes = changes || element[1]
              return element[0]
            })
            newEpisodes = newEpisodes.map((element, index) => {
              element.update({
                aired: seasons[i + 1]['episodes'][index].aired || element.aired,
                title: seasons[i + 1]['episodes'][index].title || element.title
              })
            })
            newEpisodes = await Promise.all(newEpisodes)
            await newSongs[i].addEpisodes(newEpisodes)
            /* user.addEpisodes(newEpisodes, {
                through: { consumed: false }
              }) */
          }
          await newSeries.setSeasons(newSongs)
          if (changes) {
            await user.addSeries(newSeries, {
              through: { state: 'To watch' }
            })
          }
          return res.status(201).send({
            success: true,
            message: 'Album successfully created',
            newSeries
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
  }

  static watched(req, res) {
    return req.user.then(user => {
      Episode.findByPk(req.params.episodeId)
        .then(async ep => {
          user
            .addEpisode(ep, {
              through: {
                consumed: true,
                consumedDate: Date.now()
              }
            })
            .then(updated => {
              res.status(200).send({
                success: true,
                message: 'Episode updated successfully!',
                updated
              })
            })
            .catch(error => {
              res.status(400).send({
                success: true,
                message: 'Episode updated successfully!',
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

  static watchedNoStats(req, res) {
    return req.user.then(user => {
      Episode.findByPk(req.params.episodeId)
        .then(async ep => {
          user
            .addEpisode(ep, {
              through: {
                consumed: true
              }
            })
            .then(updated => {
              res.status(200).send({
                success: true,
                message: 'Episode updated successfully!',
                updated
              })
            })
            .catch(error => {
              res.status(400).send({
                success: true,
                message: 'Episode updated successfully!',
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

  static unWatched(req, res) {
    return req.user.then(user => {
      Episode.findByPk(req.params.episodeId)
        .then(async ep => {
          user
            .addEpisode(ep, {
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

  static seriesChangeState(req, res) {
    const { state } = req.body
    return req.user.then(user => {
      Series.findByPk(req.params.seriesId)
        .then(async ep => {
          user
            .addSeries(ep, {
              through: {
                state: state,
                stateDate: Date.now()
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

  static async nuke(req, res) {
    await Series.destroy({
      where: {},
      cascade: false
    }).catch(error => res.status(400).send(error))
    await Episode.destroy({
      where: {},
      truncate: true,
      cascade: false
    }).catch(error => res.status(400).send(error))
    await Season.destroy({
      where: {},
      cascade: false
    }).catch(error => res.status(400).send(error))
    await UserSerie.destroy({
      where: {},
      truncate: true,
      cascade: false
    }).catch(error => res.status(400).send(error))
    await UserEpisode.destroy({
      where: {},
      truncate: true,
      cascade: false
    }).catch(error => res.status(400).send(error))
    return res.status(200).send({
      success: true,
      message: 'Kaboom!'
    })
  }

  static getEpisode(req, res) {
    return req.user.then(user => {
      user
        .getEpisodes({
          include: [
            {
              model: Season,
              attributes: ['id', 'seasonNumber'],
              include: [
                {
                  model: Series,
                  attributes: ['image', 'title', 'durationOfEpisode']
                }
              ]
            }
          ],
          through: {
            where: { consumed: true, consumedDate: { [Op.ne]: null } },
            attributes: ['consumed', 'consumedDate']
          },
          raw: true
        })
        .then(episodes => res.status(200).send({ episodes }))
    })
  }

  static getEpisodeCount(req, res) {
    return req.user.then(user => {
      user
        .getEpisodes({
          include: [
            {
              model: Season,
              attributes: ['id'],
              include: [
                {
                  model: Series,
                  attributes: ['image', 'title', 'durationOfEpisode']
                }
              ]
            }
          ],
          through: {
            where: { consumed: true, consumedDate: { [Op.not]: null } },
            attributes: ['consumed', 'consumedDate']
          },
          raw: true
        })
        .then(episodes => res.status(200).send({ count: episodes.length }))
    })
  }

  static getEpisodeSum(req, res) {
    return req.user.then(user => {
      user
        .getEpisodes({
          include: [
            {
              model: Season,
              attributes: ['id'],
              include: [
                {
                  model: Series,
                  attributes: ['image', 'title', 'durationOfEpisode']
                }
              ]
            }
          ],
          through: {
            where: { consumed: true },
            attributes: ['consumed', 'consumedDate']
          },
          raw: true
        })
        .then(episodes => {
          let minutes = 0
          for (let i = 0; i < episodes.length; i++) {
            console.log(episodes[i])
            minutes += episodes[i]['Season.Series.durationOfEpisode']
          }
          res.status(200).send({ minutes })
        })
    })
  }

  static async getSuma(req, res) {
    return req.user.then(user => {
      user
        .getSeries({
          attributes: ['id', 'durationOfEpisode'],
          include: [
            {
              model: Season,
              attributes: ['id'],
              include: [
                {
                  model: Episode,
                  attributes: ['id'],
                  include: [
                    {
                      model: User,
                      attributes: ['id'],
                      where: { id: user.id },
                      through: {
                        attributes: ['id', 'consumed', 'consumedDate'],
                        where: { consumed: true }
                      },
                      required: false
                    }
                  ]
                }
              ]
            }
          ],
          through: {
            where: {
              state: {
                [Op.or]: ['To watch', 'Watching', 'Waiting for new season']
              }
            }
          }
        })
        .then(series => {
          let minutes = 0
          for (let i = 0; i < series.length; i++) {
            for (let j = 0; j < series[i].Seasons.length; j++) {
              for (let k = 0; k < series[i].Seasons[j].Episodes.length; k++) {
                if (!series[i].Seasons[j].Episodes[k].Users.length) {
                  minutes += series[i].durationOfEpisode
                }
              }
            }
          }
          res.status(200).send({
            minutes
          })
        })
    })
  }

  static async getCount(req, res) {
    return req.user.then(user => {
      user
        .getSeries({
          attributes: ['id', 'durationOfEpisode'],
          include: [
            {
              model: Season,
              attributes: ['id'],
              include: [
                {
                  model: Episode,
                  attributes: ['id'],
                  include: [
                    {
                      model: User,
                      attributes: ['id'],
                      where: { id: user.id },
                      through: {
                        attributes: ['id', 'consumed', 'consumedDate'],
                        where: { consumed: true }
                      },
                      required: false
                    }
                  ]
                }
              ]
            }
          ],
          through: {
            where: {
              state: {
                [Op.or]: ['To watch', 'Watching', 'Waiting for new season']
              }
            }
          }
        })
        .then(series => {
          let count = 0
          for (let i = 0; i < series.length; i++) {
            for (let j = 0; j < series[i].Seasons.length; j++) {
              for (let k = 0; k < series[i].Seasons[j].Episodes.length; k++) {
                if (!series[i].Seasons[j].Episodes[k].Users.length) {
                  count += 1
                }
              }
            }
          }
          res.status(200).send({
            count
          })
        })
    })
  }
}

export default Seriess
