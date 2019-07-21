import model from '../models'
import Sequelize from 'sequelize'

const { Short, GenericMedia, Genre, User, UserGM } = model

const Op = Sequelize.Op

class Shorts {
  static create(req, res) {
    const { image, title, year, commentary, duration, rating, genres } = req.res
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
              where: { name: genre, isFor: 'Short' }
            }).then(([newGenre, created]) => {
              newGM.addGenre(newGenre)
            })
          })
          let GMId = newGM.id
          Short.create({ duration, rating, GMId })
        }

        let user = await req.user
        await user.addGenericMedium(newGM)
        res.status(201).send({
          success: true,
          message: 'Short successfully created',
          newGM
        })
      })
      .catch(error => {
        res.status(400).send({
          success: false,
          message: 'Short creation failed',
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
      rating,
      genres
    } = req.body
    return req.user.then(user => {
      if (!user.admin) {
        return res.status(401).send({ message: 'NOPE' })
      }
      return Short.create(
        {
          duration,
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
              association: Short.associations.GenericMedium
            }
          ]
        }
      )
        .then(async newShort => {
          let GM = await newShort.getGenericMedium()
          genres.map(genre => {
            Genre.findOrCreate({
              where: { name: genre, isFor: 'Short' }
            }).then(([newGenre, created]) => {
              GM.addGenre(newGenre)
            })
          })
          res.status(201).send({
            success: true,
            message: 'Short successfully created',
            newShort
          })
        })
        .catch(error => {
          res.status(400).send({
            success: false,
            message: 'Short creation failed',
            error
          })
        })
    })
  }

  static toWatch(req, res) {
    return req.user.then(user => {
      user
        .getGenericMedia({
          include: [
            {
              model: Short,
              attributes: ['id', 'rating', 'duration']
            },
            {
              model: Genre,
              attributes: ['id', 'name'],
              through: { attributes: [] }
            }
          ],
          order: [['year', 'ASC'], ['title', 'ASC']],
          where: {
            [Op.not]: [{ $Short$: null }]
          },
          through: {
            attributes: ['consumed', 'consumedDate'],
            where: { consumed: false }
          }
        })
        .then(shorts => res.status(200).send(shorts))
    })
  }

  static toWatchCount(req, res) {
    return req.user.then(user => {
      user
        .getGenericMedia({
          include: [
            {
              model: Short,
              attributes: ['id', 'rating', 'duration']
            },
            {
              model: Genre,
              attributes: ['id', 'name'],
              through: { attributes: [] }
            }
          ],
          order: [['year', 'ASC'], ['title', 'ASC']],
          where: {
            [Op.not]: [{ $Short$: null }]
          },
          through: {
            attributes: ['consumed', 'consumedDate'],
            where: { consumed: false }
          }
        })
        .then(shorts => res.status(200).send({ count: shorts.length }))
    })
  }

  static toWatchSum(req, res) {
    return req.user.then(user => {
      user
        .getGenericMedia({
          includeIgnoreAttributes: false,
          include: [
            {
              model: Short,
              attributes: []
            }
          ],
          where: {
            [Op.not]: [{ $Short$: null }]
          },
          through: {
            where: { consumed: false }
          },
          attributes: [
            [Sequelize.fn('SUM', Sequelize.col('Short.duration')), 'total']
          ],
          raw: true
        })
        .then(shorts => res.status(200).send({ shorts }))
    })
  }

  static watchedList(req, res) {
    return req.user.then(user => {
      user
        .getGenericMedia({
          include: [
            {
              model: Short,
              attributes: ['id', 'rating', 'duration']
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
            [Op.not]: [{ $Short$: null }]
          },
          through: {
            attributes: ['consumed', 'consumedDate'],
            where: { consumed: true }
          }
        })
        .then(shorts => res.status(200).send(shorts))
    })
  }

  static list(req, res) {
    return req.user.then(user => {
      if (!user.admin) {
        return res.status(401).send({ message: 'NOPE' })
      }
      return Short.findAll({
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
          }
        ],
        attributes: ['id', 'duration', 'rating']
      }).then(shorts => {
        res.status(200).send({
          success: true,
          message: 'Short count successull',
          shorts
        })
      })
    })
  }

  static get(req, res) {
    return Short.findByPk(req.params.shortId, {
      include: [
        {
          model: GenericMedia,
          include: [{ model: Genre }]
        }
      ]
    })
      .then(short => {
        if (!short) {
          return res.status(400).send({
            success: true,
            message: 'Short Not Found'
          })
        }
        return res.status(200).send({
          success: true,
          message: 'Short retrieved',
          short
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

  static deleteAdmin(req, res) {
    return Short.findByPk(req.params.shortId)
      .then(short => {
        if (!short) {
          return res.status(400).send({
            success: false,
            message: 'Short Not Found'
          })
        }
        GenericMedia.findByPk(short.GMId).then(gm => {
          gm.destroy()
        })
        return short.destroy().then(() => {
          res.status(200).send({
            success: true,
            message: 'Short successfully deleted'
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

  static delete(req, res) {
    return req.user.then(user => {
      return Short.findByPk(req.params.shortId)
        .then(short => {
          if (!short) {
            return res.status(400).send({
              success: false,
              message: 'Shorts Not Found'
            })
          }
          GenericMedia.findByPk(short.GMId).then(gm => {
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

  static async createByUrl(req, res) {
    const { url } = req.body
    if (typeof url === 'undefined' || !url.includes('imdb.com/title/')) {
      return res.status(400).send({
        success: false,
        message: 'No url'
      })
    }
    const spawn = require('child_process').spawn
    const pythonProcess = await spawn('python', [
      'server/controllers/scripts/imdb.py',
      url
    ])
    pythonProcess.stdout.on('data', data => {
      const {
        image,
        title,
        year,
        commentary,
        duration,
        rating,
        genres
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
                where: { name: genre, isFor: 'Short' }
              }).then(([newGenre, created]) => {
                newGM.addGenre(newGenre)
              })
            })
            let GMId = newGM.id
            Short.create({ duration, rating, GMId })
          }

          let user = await req.user
          await user.addGenericMedium(newGM)
          res.status(201).send({
            success: true,
            message: 'Short successfully created',
            newGM
          })
        })
        .catch(error => {
          res.status(400).send({
            success: false,
            message: 'Short creation failed',
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
    const { image, title, year, commentary, duration, rating } = req.body
    return Short.findByPk(req.params.shortId)
      .then(async short => {
        let gm = await short.getGenericMedium()
        gm.update({
          image: image || gm.image,
          title: title || gm.title,
          year: year || gm.year,
          commentary: commentary || gm.commentary
        })
        short
          .update({
            duration: duration || short.duration,
            rating: rating || short.rating
          })
          .then(updated => {
            res.status(200).send({
              success: true,
              message: 'Short updated successfully',
              data: {
                duration: duration || short.duration,
                rating: rating || short.rating,
                image: image || gm.image,
                title: title || gm.title,
                year: year || gm.year,
                commentary: commentary || gm.commentary
              }
            })
          })
          .catch(error => {
            res.status(400).send({
              success: false,
              message: 'Short modification failed',
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

  static watched(req, res) {
    return req.user.then(user => {
      Short.findByPk(req.params.shortId)
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
                message: 'Short updated successfully!',
                updated
              })
            })
            .catch(error => {
              res.status(400).send({
                success: true,
                message: 'Short updated successfully!',
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

  static watchedDate(req, res) {
    const { date } = req.body
    return req.user.then(user => {
      Short.findByPk(req.params.shortId)
        .then(async short => {
          let gm = await short.getGenericMedium()
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
                message: 'Short updated successfully',
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

  static unwatched(req, res) {
    return req.user.then(user => {
      Short.findByPk(req.params.shortId)
        .then(async short => {
          let gm = await short.getGenericMedium()
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
                message: 'Short updated successfully',
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
    Short.findByPk(req.params.shortId)
      .then(async short => {
        let GM = await short.getGenericMedium()
        let newGenres = genres.map(genre => {
          return Genre.findOrCreate({
            where: { name: genre, isFor: 'Short' }
          })
        })
        newGenres = await Promise.all(newGenres)
        newGenres = newGenres.map(elem => elem[0])
        GM.setGenres(newGenres)
          .then(data => {
            res.status(200).send({
              success: true,
              message: 'Shorts genres changed',
              data
            })
          })
          .catch(error => {
            res.status(400).send({
              success: false,
              message: 'Failed to change genres',
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
}

export default Shorts
