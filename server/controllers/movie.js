import rc from '../redis'
import model from '../models'
import Sequelize from 'sequelize'

const { Movie, GenericMedia, Genre, UserGM, User } = model

const Op = Sequelize.Op

class Movies {
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
              where: { name: genre, isFor: 'Movie' }
            }).then(([newGenre, created]) => {
              newGM.addGenre(newGenre)
            })
          })
          let GMId = newGM.id
          Movie.create({ duration, rating, GMId })
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
      return Movie.create(
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
              association: Movie.associations.GenericMedium
            }
          ]
        }
      )
        .then(async newMovie => {
          let GM = await newMovie.getGenericMedium()
          genres.map(genre => {
            Genre.findOrCreate({
              where: { name: genre, isFor: 'Movie' }
            }).then(([newGenre, created]) => {
              GM.addGenre(newGenre)
            })
          })
          res.status(201).send({
            success: true,
            message: 'Movie successfully created',
            newMovie
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
  }

  static getMoviesToWatch(req, res) {
    return req.user.then(user => {
      user
        .getGenericMedia({
          include: [
            {
              model: Movie,
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
            [Op.not]: [{ $Movie$: null }]
          },
          through: {
            attributes: ['consumed', 'consumedDate'],
            where: { consumed: false }
          }
        })
        .then(movies => res.status(200).send(movies))
    })
  }

  static getMoviesWatched(req, res) {
    return req.user.then(user => {
      user
        .getGenericMedia({
          include: [
            {
              model: Movie,
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
          order: [[User, UserGM, 'consumedDate', 'ASC']],
          where: {
            [Op.not]: [{ $Movie$: null }]
          },
          through: {
            attributes: ['consumed', 'consumedDate'],
            where: { consumed: true }
          }
        })
        .then(movies => res.status(200).send(movies))
    })
  }

  static getMoviesCount(req, res) {
    console.log('no')
    return req.user.then(user => {
      user
        .getGenericMedia({
          include: [
            {
              model: Movie,
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
            [Op.not]: [{ $Movie$: null }]
          },
          through: {
            attributes: ['consumed', 'consumedDate'],
            where: { consumed: false }
          }
        })
        .then(movies => res.status(200).send({ count: movies.length }))
    })
  }

  static getMoviesSum(req, res) {
    return req.user.then(user => {
      user
        .getGenericMedia({
          includeIgnoreAttributes: false,
          include: [
            {
              model: Movie,
              attributes: []
            }
          ],
          where: {
            [Op.not]: [{ $Movie$: null }]
          },
          through: {
            where: { consumed: false }
          },
          attributes: [
            [Sequelize.fn('SUM', Sequelize.col('Movie.duration')), 'total']
          ],
          raw: true
        })
        .then(movies => res.status(200).send({ movies }))
    })
  }

  static list(req, res) {
    return req.user.then(user => {
      if (!user.admin) {
        return res.status(401).send({ message: 'NOPE' })
      }
      return Movie.findAll({
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
      }).then(movies => {
        res.status(200).send({
          success: true,
          message: 'Movie count successull',
          movies
        })
      })
    })
  }

  static get(req, res) {
    return Movie.findByPk(req.params.movieId, {
      include: [
        {
          model: GenericMedia,
          include: [{ model: Genre }]
        }
      ]
    })
      .then(movie => {
        if (!movie) {
          return res.status(400).send({
            success: true,
            message: 'Movie Not Found'
          })
        }
        return res.status(200).send({
          success: true,
          message: 'Movie retrieved',
          movie
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
    return req.user.then(user => {
      if (!user.admin) {
        return res.status(401).send({ message: 'NOPE' })
      }
      return Movie.findByPk(req.params.movieId)
        .then(movie => {
          if (!movie) {
            return res.status(400).send({
              success: false,
              message: 'Movie Not Found'
            })
          }
          GenericMedia.findByPk(movie.GMId).then(gm => {
            gm.destroy()
          })
          return movie.destroy().then(() => {
            rc.del('movieToWatch')
            res.status(200).send({
              success: true,
              message: 'Movie successfully deleted'
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

  static delete(req, res) {
    return req.user.then(user => {
      return Movie.findByPk(req.params.movieId)
        .then(movie => {
          if (!movie) {
            return res.status(400).send({
              success: false,
              message: 'Movie Not Found'
            })
          }
          GenericMedia.findByPk(movie.GMId).then(gm => {
            return user.removeGenericMedium(gm).then(() => {
              res.status(200).send({
                success: true,
                message: 'Movie successfully deleted'
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
                where: { name: genre, isFor: 'Movie' }
              }).then(([newGenre, created]) => {
                newGM.addGenre(newGenre)
              })
            })
            let GMId = newGM.id
            Movie.create({ duration, rating, GMId })
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
    return Movie.findByPk(req.params.movieId)
      .then(async movie => {
        let gm = await movie.getGenericMedium()
        gm.update({
          image: image || gm.image,
          title: title || gm.title,
          year: year || gm.year,
          commentary: commentary || gm.commentary
        })
        movie
          .update({
            duration: duration || movie.duration,
            rating: rating || movie.rating
          })
          .then(updated => {
            rc.del('movieToWatch')
            res.status(200).send({
              success: true,
              message: 'Movie updated successfully',
              data: {
                duration: duration || movie.duration,
                rating: rating || movie.rating,
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
              message: 'Movie modification failed',
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
      Movie.findByPk(req.params.movieId)
        .then(async movie => {
          let gm = await movie.getGenericMedium()
          user
            .addGenericMedium(gm, {
              through: {
                consumed: true,
                consumedDate: Date.now()
              }
            })
            .then(updated => {
              console.log(updated)
              res.status(200).send({
                success: true,
                message: 'Movie updated successfully!',
                updated
              })
            })
            .catch(error => {
              res.status(400).send({
                success: true,
                message: 'Movie updated successfully!',
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
      Movie.findByPk(req.params.movieId)
        .then(async movie => {
          let gm = await movie.getGenericMedium()
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
                message: 'Movie updated successfully',
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
      Movie.findByPk(req.params.movieId)
        .then(async movie => {
          let gm = await movie.getGenericMedium()
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
                message: 'Movie updated successfully',
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
    Movie.findByPk(req.params.movieId)
      .then(async movie => {
        let GM = await movie.getGenericMedium()
        let newGenres = genres.map(genre => {
          return Genre.findOrCreate({
            where: { name: genre, isFor: 'Movie' }
          })
        })
        newGenres = await Promise.all(newGenres)
        newGenres = newGenres.map(elem => elem[0])
        GM.setGenres(newGenres)
          .then(data => {
            res.status(200).send({
              success: true,
              message: 'Movies genres changed',
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

export default Movies
