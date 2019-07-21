import model from '../models'
import Sequelize from 'sequelize'

const { Documentary, GenericMedia, Genre, User, UserGM } = model

const Op = Sequelize.Op

class Documentaries {
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
      .then(async ([newGM, createdMovie]) => {
        if (createdMovie) {
          genres.map(genre => {
            Genre.findOrCreate({
              where: { name: genre, isFor: 'Documentary' }
            }).then(([newGenre, created]) => {
              newGM.addGenre(newGenre)
            })
          })
          let GMId = newGM.id
          Documentary.create({ duration, rating, GMId })
        }

        let user = await req.user
        await user.addGenericMedium(newGM)
        res.status(201).send({
          success: true,
          message: 'Documentary successfully created',
          newGM
        })
      })
      .catch(error => {
        res.status(400).send({
          success: false,
          message: 'Documentary creation failed',
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
      return Documentary.create(
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
              association: Documentary.associations.GenericMedium
            }
          ]
        }
      )
        .then(async newDocumentary => {
          let GM = await newDocumentary.getGenericMedium()
          genres.map(genre => {
            Genre.findOrCreate({
              where: { name: genre, isFor: 'Documentary' }
            }).then(([newGenre, created]) => {
              GM.addGenre(newGenre)
            })
          })
          res.status(201).send({
            success: true,
            message: 'Documentary successfully created',
            newDocumentary
          })
        })
        .catch(error => {
          res.status(400).send({
            success: false,
            message: 'Documentary creation failed',
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
              model: Documentary,
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
            [Op.not]: [{ $Documentary$: null }]
          },
          through: {
            attributes: ['consumed', 'consumedDate'],
            where: { consumed: false }
          }
        })
        .then(documentaries => res.status(200).send(documentaries))
    })
  }

  static toWatchCount(req, res) {
    return req.user.then(user => {
      user
        .getGenericMedia({
          include: [
            {
              model: Documentary,
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
            [Op.not]: [{ $Documentary$: null }]
          },
          through: {
            attributes: ['consumed', 'consumedDate'],
            where: { consumed: false }
          }
        })
        .then(documentaries =>
          res.status(200).send({ count: documentaries.length })
        )
    })
  }

  static toWatchSum(req, res) {
    return req.user.then(user => {
      user
        .getGenericMedia({
          includeIgnoreAttributes: false,
          include: [
            {
              model: Documentary,
              attributes: []
            }
          ],
          where: {
            [Op.not]: [{ $Documentary$: null }]
          },
          through: {
            where: { consumed: false }
          },
          attributes: [
            [
              Sequelize.fn('SUM', Sequelize.col('Documentary.duration')),
              'total'
            ]
          ],
          raw: true
        })
        .then(documentaries => res.status(200).send({ documentaries }))
    })
  }

  static watchedList(req, res) {
    return req.user.then(user => {
      user
        .getGenericMedia({
          include: [
            {
              model: Documentary,
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
            [Op.not]: [{ $Documentary$: null }]
          },
          through: {
            attributes: ['consumed', 'consumedDate'],
            where: { consumed: true }
          }
        })
        .then(documentaries => res.status(200).send(documentaries))
    })
  }

  static list(req, res) {
    return req.user.then(user => {
      if (!user.admin) {
        return res.status(401).send({ message: 'NOPE' })
      }
      return Documentary.findAll({
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
      }).then(documentaries => {
        res.status(200).send({
          success: true,
          message: 'Documentary count successull',
          documentaries
        })
      })
    })
  }

  static get(req, res) {
    return Documentary.findByPk(req.params.documentaryId, {
      include: [
        {
          model: GenericMedia,
          include: [{ model: Genre }]
        }
      ]
    })
      .then(documentary => {
        if (!documentary) {
          return res.status(400).send({
            success: true,
            message: 'Documentary Not Found'
          })
        }
        return res.status(200).send({
          success: true,
          message: 'Documentary retrieved',
          documentary
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
    return Documentary.findByPk(req.params.documentaryId)
      .then(documentary => {
        if (!documentary) {
          return res.status(400).send({
            success: false,
            message: 'Documentary Not Found'
          })
        }
        GenericMedia.findByPk(documentary.GMId).then(gm => {
          gm.destroy()
        })
        return documentary.destroy().then(() => {
          res.status(200).send({
            success: true,
            message: 'Documentary successfully deleted'
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
      return Documentary.findByPk(req.params.movieId)
        .then(documentary => {
          if (!documentary) {
            return res.status(400).send({
              success: false,
              message: 'Documentary Not Found'
            })
          }
          GenericMedia.findByPk(documentary.GMId).then(gm => {
            return user.removeGenericMedium(gm).then(() => {
              res.status(200).send({
                success: true,
                message: 'Documentary successfully deleted'
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
        .then(async ([newGM, createdMovie]) => {
          if (createdMovie) {
            genres.map(genre => {
              Genre.findOrCreate({
                where: { name: genre, isFor: 'Documentary' }
              }).then(([newGenre, created]) => {
                newGM.addGenre(newGenre)
              })
            })
            let GMId = newGM.id
            Documentary.create({ duration, rating, GMId })
          }

          let user = await req.user
          await user.addGenericMedium(newGM)
          res.status(201).send({
            success: true,
            message: 'Movie successfully created',
            newGM
          })
        })
        .catch(error => {
          res.status(400).send({
            success: false,
            message: 'Movie creation failed',
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
    return Documentary.findByPk(req.params.documentaryId)
      .then(async documentary => {
        let gm = await documentary.getGenericMedium()
        gm.update({
          image: image || gm.image,
          title: title || gm.title,
          year: year || gm.year,
          commentary: commentary || gm.commentary
        })
        documentary
          .update({
            duration: duration || documentary.duration,
            rating: rating || documentary.rating
          })
          .then(updated => {
            res.status(200).send({
              success: true,
              message: 'Documentary updated successfully',
              data: {
                duration: duration || documentary.duration,
                rating: rating || documentary.rating,
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
              message: 'Documentary modification failed',
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
      Documentary.findByPk(req.params.movieId)
        .then(async documentary => {
          let gm = await documentary.getGenericMedium()
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
                message: 'Documentary updated successfully!',
                updated
              })
            })
            .catch(error => {
              res.status(400).send({
                success: true,
                message: 'Documentary updated successfully!',
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
      Documentary.findByPk(req.params.movieId)
        .then(async documentary => {
          let gm = await documentary.getGenericMedium()
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
                message: 'Documentary updated successfully',
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
      Documentary.findByPk(req.params.movieId)
        .then(async documentary => {
          let gm = await documentary.getGenericMedium()
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
                message: 'Documentary updated successfully',
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
    Documentary.findByPk(req.params.documentaryId)
      .then(async documentary => {
        let GM = await documentary.getGenericMedium()
        let newGenres = genres.map(genre => {
          return Genre.findOrCreate({
            where: { name: genre, isFor: 'Documentary' }
          })
        })
        newGenres = await Promise.all(newGenres)
        newGenres = newGenres.map(elem => elem[0])
        GM.setGenres(newGenres)
          .then(data => {
            res.status(200).send({
              success: true,
              message: 'Documentaries genres changed',
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

export default Documentaries
