import model from '../models'
import Sequelize from 'sequelize'

const { VideoGame, GenericMedia, Genre, Console, User, UserGM } = model

const Op = Sequelize.Op

class VideoGames {
  static create(req, res) {
    const {
      image,
      title,
      year,
      commentary,
      HLTB,
      developer,
      rating,
      genres,
      consoles
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
              where: { name: genre, isFor: 'VideoGame' }
            }).then(([newGenre, created]) => {
              newGM.addGenre(newGenre)
            })
          })
          let GMId = newGM.id
          await VideoGame.create({ HLTB, developer, rating, GMId }).then(
            newVideoGame => {
              consoles.map(aConsole => {
                Console.findOrCreate({
                  where: {
                    name: aConsole
                  }
                }).then(([created, found]) => {
                  newVideoGame.addConsole(created)
                })
              })
            }
          )
        }
        let user = await req.user
        await user.addGenericMedium(newGM)
        res.status(201).send({
          success: true,
          message: 'VideoGame successfully created',
          newGM
        })
      })
      .catch(error => {
        res.status(400).send({
          success: false,
          message: 'VideoGame creation failed',
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
      HLTB,
      developer,
      rating,
      genres,
      consoles
    } = req.body
    return VideoGame.create(
      {
        HLTB,
        developer,
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
            association: VideoGame.associations.GenericMedium
          }
        ]
      }
    )
      .then(async newVideoGame => {
        let GM = await newVideoGame.getGenericMedium()
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
        consoles.map(aConsole => {
          Console.findOrCreate({
            where: {
              name: aConsole
            }
          }).then(([created, found]) => {
            newVideoGame.addConsole(created)
          })
        })
        res.status(201).send({
          success: true,
          message: 'Video Game successfully created',
          newVideoGame
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

  static toPlay(req, res) {
    return req.user.then(user => {
      user
        .getGenericMedia({
          include: [
            {
              model: VideoGame,
              attributes: ['id', 'rating', 'HLTB', 'developer'],
              include: [
                {
                  model: Console,
                  attributes: ['id', 'name'],
                  through: { attributes: [] }
                }
              ]
            },
            {
              model: Genre,
              attributes: ['id', 'name'],
              through: { attributes: [] }
            }
          ],
          order: [['year', 'ASC'], ['title', 'ASC']],
          where: {
            [Op.not]: [{ $VideoGame$: null }]
          },
          through: {
            attributes: ['consumed', 'consumedDate'],
            where: { consumed: false }
          }
        })
        .then(videogames => res.status(200).send(videogames))
    })
  }

  static toPlayCount(req, res) {
    return req.user.then(user => {
      user
        .getGenericMedia({
          include: [
            {
              model: VideoGame
            },
            {
              model: Genre,
              attributes: ['id', 'name'],
              through: { attributes: [] }
            }
          ],
          order: [['year', 'ASC'], ['title', 'ASC']],
          where: {
            [Op.not]: [{ $VideoGame$: null }]
          },
          through: {
            attributes: ['consumed', 'consumedDate'],
            where: { consumed: false }
          }
        })
        .then(videogames => res.status(200).send({ count: videogames.length }))
    })
  }

  static playedCount(req, res) {
    return req.user.then(user => {
      user
        .getGenericMedia({
          include: [
            {
              model: VideoGame
            },
            {
              model: Genre,
              attributes: ['id', 'name'],
              through: { attributes: [] }
            }
          ],
          order: [['year', 'ASC'], ['title', 'ASC']],
          where: {
            [Op.not]: [{ $VideoGame$: null }]
          },
          through: {
            attributes: ['consumed', 'consumedDate'],
            where: { consumed: true }
          }
        })
        .then(videogames => res.status(200).send({ count: videogames.length }))
    })
  }

  static playedList(req, res) {
    return req.user.then(user => {
      user
        .getGenericMedia({
          include: [
            {
              model: VideoGame,
              attributes: ['id', 'rating', 'HLTB', 'developer'],
              include: [
                {
                  model: Console,
                  attributes: ['id', 'name'],
                  through: { attributes: [] }
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
            ['title', 'ASC']
          ],
          where: {
            [Op.not]: [{ $VideoGame$: null }]
          },
          through: {
            attributes: ['consumed', 'consumedDate'],
            where: { consumed: true }
          }
        })
        .then(videogames => res.status(200).send(videogames))
    })
  }

  static list(req, res) {
    return VideoGame.findAll({
      include: [
        {
          model: GenericMedia,
          attributes: [
            'image',
            'title',
            'year',
            'consumed',
            'commentary',
            'consumedDate'
          ],
          include: [
            {
              model: Genre,
              attributes: ['id', 'name'],
              through: { attributes: [] }
            }
          ]
        },
        {
          model: Console,
          attributes: ['id', 'name'],
          through: { attributes: [] }
        }
      ],
      attributes: ['id', 'HLTB', 'rating', 'developer']
    }).then(videoGames =>
      res.status(200).send({
        success: true,
        message: 'VideoGame list retrieved',
        videoGames
      })
    )
  }

  static get(req, res) {
    return VideoGame.findByPk(req.params.videoGameId, {
      include: [
        {
          model: GenericMedia,
          include: [{ model: Genre }]
        },
        {
          model: Console
        }
      ]
    })
      .then(videoGame => {
        if (!videoGame) {
          return res.status(404).send({
            success: false,
            message: 'VideoGame Not Found'
          })
        }
        return res.status(200).send({
          success: true,
          message: 'VideoGame retrieved',
          videoGame
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
      return VideoGame.findByPk(req.params.videoGameId)
        .then(videoGame => {
          if (!videoGame) {
            return res.status(400).send({
              success: false,
              message: 'Shorts Not Found'
            })
          }
          GenericMedia.findByPk(videoGame.GMId).then(gm => {
            return user.removeGenericMedium(gm).then(() => {
              res.status(200).send({
                success: true,
                message: 'Short successfully deleted'
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
    return VideoGame.findByPk(req.params.videoGameId).then(videoGame => {
      if (!videoGame) {
        return res.status(404).send({
          success: false,
          message: 'VideoGame Not Found'
        })
      }
      GenericMedia.findByPk(videoGame.GMId).then(gm => {
        gm.destroy()
      })
      return videoGame
        .destroy()
        .then(() => {
          res.status(200).send({
            success: false,
            message: 'VideoGame successfully deleted'
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
      !url.includes('https://howlongtobeat.com/game.php?id=')
    ) {
      return res.status(400).send({
        success: false,
        message: 'No url'
      })
    }
    const spawn = require('child_process').spawn
    const pythonProcess = await spawn('python', [
      'server/controllers/scripts/hltb.py',
      url
    ])
    pythonProcess.stdout.on('data', data => {
      const {
        image,
        title,
        year,
        commentary,
        HLTB,
        developer,
        rating,
        genres,
        consoles
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
            genres.map(genre => {
              Genre.findOrCreate({
                where: { name: genre, isFor: 'VideoGame' }
              }).then(([newGenre, created]) => {
                newGM.addGenre(newGenre)
              })
            })
            let GMId = newGM.id
            await VideoGame.create({ HLTB, developer, rating, GMId }).then(
              newVideoGame => {
                consoles.map(aConsole => {
                  Console.findOrCreate({
                    where: {
                      name: aConsole
                    }
                  }).then(([created, found]) => {
                    newVideoGame.addConsole(created)
                  })
                })
              }
            )
          }
          let user = await req.user
          await user.addGenericMedium(newGM)
          res.status(201).send({
            success: true,
            message: 'VideoGame successfully created',
            newGM
          })
        })
        .catch(error => {
          res.status(400).send({
            success: false,
            message: 'VideoGame creation failed',
            error
          })
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
    const { image, title, year, commentary, HLTB, developer, rating } = req.body
    return VideoGame.findByPk(req.params.videoGameId)
      .then(async videoGame => {
        if (!videoGame) {
          return res.status(404).send({
            success: false,
            message: 'VideoGame Not Found'
          })
        }
        let gm = await videoGame.getGenericMedium()
        gm.update({
          image: image || gm.image,
          title: title || gm.title,
          year: year || gm.year,
          commentary: commentary || gm.commentary
        })
        videoGame
          .update({
            HLTB: HLTB || videoGame.HLTB,
            rating: rating || videoGame.rating,
            developer: developer || videoGame.developer
          })
          .then(updated => {
            res.status(200).send({
              success: false,
              message: 'VideoGame updated successfully',
              data: {
                HLTB: HLTB || videoGame.HLTB,
                rating: rating || videoGame.rating,
                developer: developer || videoGame.developer,
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
              message: 'VideoGame modification failed',
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

  static played(req, res) {
    return req.user.then(user => {
      VideoGame.findByPk(req.params.videoGameId)
        .then(async short => {
          let gm = await short.getGenericMedium()
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
                message: 'VideoGame updated successfully!',
                updated
              })
            })
            .catch(error => {
              res.status(400).send({
                success: true,
                message: 'VideoGame updated successfully!',
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

  static playedDate(req, res) {
    const { date } = req.body
    return req.user.then(user => {
      VideoGame.findByPk(req.params.shortId)
        .then(async videoGame => {
          let gm = await videoGame.getGenericMedium()
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
                message: 'VideoGame updated successfully',
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

  static unPlayed(req, res) {
    return req.user.then(user => {
      VideoGame.findByPk(req.params.shortId)
        .then(async videoGame => {
          let gm = await videoGame.getGenericMedium()
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
                message: 'VideoGame updated successfully',
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
    VideoGame.findByPk(req.params.videoGameId)
      .then(async videoGame => {
        if (!videoGame) {
          return res.status(404).send({
            success: false,
            message: 'VideoGame Not Found'
          })
        }
        let GM = await videoGame.getGenericMedium()
        let newGenres = genres.map(genre => {
          return Genre.findOrCreate({
            where: {
              name: genre,
              isFor: 'VideoGame'
            }
          })
        })
        newGenres = await Promise.all(newGenres)
        newGenres = newGenres.map(elem => elem[0])
        GM.setGenres(newGenres)
          .then(data => {
            res.status(200).send({
              success: true,
              message: 'Videgames genre change',
              data
            })
          })
          .catch(error => {
            res.status(400).send({
              success: false,
              message: 'Videogame modification failed',
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

  static changeConsoles(req, res) {
    const { consoles } = req.body
    VideoGame.findByPk(req.params.videoGameId)
      .then(async videoGame => {
        if (!videoGame) {
          return res.status(404).send({
            success: false,
            message: 'VideoGame Not Found'
          })
        }
        let newConsoles = consoles.map(console => {
          return Console.findOrCreate({
            where: {
              name: console
            }
          })
        })
        newConsoles = await Promise.all(newConsoles)
        newConsoles = newConsoles.map(elem => elem[0])
        videoGame
          .setConsoles(newConsoles)
          .then(data => {
            res.status(200).send({
              success: true,
              message: 'VideoGame console changed',
              data
            })
          })
          .catch(error => {
            res.status(400).send({
              success: false,
              message: 'Videgame modification failed',
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
              model: VideoGame,
              attributes: []
            }
          ],
          where: {
            [Op.not]: [{ $VideoGame$: null }]
          },
          through: {
            where: { consumed: false }
          },
          attributes: [
            [Sequelize.fn('SUM', Sequelize.col('VideoGame.HLTB')), 'total']
          ],
          raw: true
        })
        .then(videogames => res.status(200).send({ videogames }))
    })
  }
}

export default VideoGames
