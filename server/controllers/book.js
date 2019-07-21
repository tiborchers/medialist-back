import model from '../models'
import Sequelize from 'sequelize'

const { Book, GenericMedia, Genre, UserGM, User } = model

const Op = Sequelize.Op

class Books {
  static create(req, res) {
    const {
      image,
      title,
      year,
      commentary,
      pages,
      author,
      rating,
      genres
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
      .then(async ([newGM, createdMovie]) => {
        if (createdMovie) {
          genres.map(genre => {
            Genre.findOrCreate({
              where: { name: genre, isFor: 'Book' }
            }).then(([newGenre, created]) => {
              newGM.addGenre(newGenre)
            })
          })
          let GMId = newGM.id
          Book.create({ pages, author, rating, GMId })
        }

        let user = await req.user
        await user.addGenericMedium(newGM)
        res.status(201).send({
          success: true,
          message: 'Book successfully created',
          newGM
        })
      })
      .catch(error => {
        res.status(400).send({
          success: false,
          message: 'Book creation failed',
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
      pages,
      author,
      rating,
      genres
    } = req.body
    return Book.create(
      {
        pages,
        author,
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
            association: Book.associations.GenericMedium
          }
        ]
      }
    )
      .then(async newBook => {
        let GM = await newBook.getGenericMedium()
        genres.map(genre => {
          Genre.findOrCreate({
            where: { name: genre, isFor: 'Book' }
          }).then(([created, found]) => {
            GM.addGenre(created)
          })
        })
        res.status(201).send({
          success: true,
          message: 'Book successfully created',
          newBook
        })
      })
      .catch(error => {
        res.status(400).send({
          success: false,
          message: 'Book creation failed',
          error
        })
      })
  }

  static toRead(req, res) {
    return req.user.then(user => {
      user
        .getGenericMedia({
          include: [
            {
              model: Book,
              attributes: ['id', 'rating', 'pages', 'author']
            },
            {
              model: Genre,
              attributes: ['id', 'name'],
              through: { attributes: [] }
            }
          ],
          order: [['year', 'ASC'], ['title', 'ASC']],
          where: {
            [Op.not]: [{ $Book$: null }]
          },
          through: {
            attributes: ['consumed', 'consumedDate'],
            where: { consumed: false }
          }
        })
        .then(books => res.status(200).send(books))
    })
  }

  static getBooksCount(req, res) {
    return req.user.then(user => {
      user
        .getGenericMedia({
          include: [
            {
              model: Book,
              attributes: ['id', 'rating', 'pages', 'author']
            },
            {
              model: Genre,
              attributes: ['id', 'name'],
              through: { attributes: [] }
            }
          ],
          order: [['year', 'ASC'], ['title', 'ASC']],
          where: {
            [Op.not]: [{ $Book$: null }]
          },
          through: {
            attributes: ['consumed', 'consumedDate'],
            where: { consumed: false }
          }
        })
        .then(books => res.status(200).send({ count: books.length }))
    })
  }

  static readBooksCount(req, res) {
    return req.user.then(user => {
      user
        .getGenericMedia({
          include: [
            {
              model: Book,
              attributes: ['id', 'rating', 'pages', 'author']
            },
            {
              model: Genre,
              attributes: ['id', 'name'],
              through: { attributes: [] }
            }
          ],
          order: [['year', 'ASC'], ['title', 'ASC']],
          where: {
            [Op.not]: [{ $Book$: null }]
          },
          through: {
            attributes: ['consumed', 'consumedDate'],
            where: { consumed: true }
          }
        })
        .then(books => res.status(200).send({ count: books.length }))
    })
  }

  static sumOfHours(req, res) {
    return req.user.then(user => {
      user
        .getGenericMedia({
          includeIgnoreAttributes: false,
          include: [
            {
              model: Book,
              attributes: []
            }
          ],
          where: {
            [Op.not]: [{ $Book$: null }]
          },
          through: {
            where: { consumed: false }
          },
          attributes: [
            [Sequelize.fn('SUM', Sequelize.col('Book.pages')), 'total']
          ],
          raw: true
        })
        .then(books => res.status(200).send({ books }))
    })
  }

  static readList(req, res) {
    return req.user.then(user => {
      user
        .getGenericMedia({
          include: [
            {
              model: Book,
              attributes: ['id', 'rating', 'pages', 'author']
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
            [Op.not]: [{ $Book$: null }]
          },
          through: {
            attributes: ['consumed', 'consumedDate'],
            where: { consumed: true }
          }
        })
        .then(books => res.status(200).send(books))
    })
  }

  static list(req, res) {
    return Book.findAll({
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
      attributes: ['id', 'pages', 'author', 'rating']
    }).then(books => {
      res.status(200).send({
        success: true,
        message: 'Book list retrieved',
        books
      })
    })
  }

  static get(req, res) {
    return Book.findByPk(req.params.bookId, {
      include: [
        {
          model: GenericMedia,
          include: [{ model: Genre }]
        }
      ]
    })
      .then(book => {
        if (!book) {
          return res.status(400).send({
            success: true,
            message: 'Book Not Found'
          })
        }
        return res.status(200).send({
          success: true,
          message: 'Book retrieved',
          book
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
    return Book.findByPk(req.params.bookId)
      .then(book => {
        if (!book) {
          return res.status(400).send({
            success: false,
            message: 'Book Not Found'
          })
        }
        GenericMedia.findByPk(book.GMId).then(gm => {
          gm.destroy()
        })
        return book.destroy().then(() => {
          res.status(200).send({
            success: true,
            message: 'Book successfully deleted'
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
      return Book.findByPk(req.params.bookId)
        .then(book => {
          if (!book) {
            return res.status(400).send({
              success: false,
              message: 'Book Not Found'
            })
          }
          GenericMedia.findByPk(book.GMId).then(gm => {
            return user.removeGenericMedium(gm).then(() => {
              res.status(200).send({
                success: true,
                message: 'Book successfully deleted'
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
    if (
      typeof url === 'undefined' ||
      !url.includes('goodreads.com/book/show/')
    ) {
      return res.status(400).send({
        success: false,
        message: 'No url'
      })
    }
    const spawn = require('child_process').spawn
    const pythonProcess = await spawn('python', [
      'server/controllers/scripts/goodreads.py',
      url
    ])
    pythonProcess.stdout.on('data', data => {
      const {
        image,
        title,
        year,
        commentary,
        pages,
        author,
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
                where: { name: genre, isFor: 'Book' }
              }).then(([newGenre, created]) => {
                newGM.addGenre(newGenre)
              })
            })
            let GMId = newGM.id
            Book.create({ pages, author, rating, GMId })
          }

          let user = await req.user
          await user.addGenericMedium(newGM)
          res.status(201).send({
            success: true,
            message: 'Book successfully created',
            newGM
          })
        })
        .catch(error => {
          res.status(400).send({
            success: false,
            message: 'Book creation failed',
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
    const { image, title, year, commentary, pages, author, rating } = req.body
    return Book.findByPk(req.params.bookId)
      .then(async book => {
        let gm = await book.getGenericMedium()
        gm.update({
          image: image || gm.image,
          title: title || gm.title,
          year: year || gm.year,
          commentary: commentary || gm.commentary
        })
        book
          .update({
            pages: pages || book.pages,
            rating: rating || book.rating,
            author: author || book.author
          })
          .then(updated => {
            res.status(200).send({
              success: true,
              message: 'Book updated successfully',
              data: {
                pages: pages || book.pages,
                rating: rating || book.rating,
                author: author || book.author,
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
              message: 'Book modification failed',
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

  static read(req, res) {
    return req.user.then(user => {
      Book.findByPk(req.params.movieId)
        .then(async book => {
          let gm = await book.getGenericMedium()
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
                message: 'Book updated successfully!',
                updated
              })
            })
            .catch(error => {
              res.status(400).send({
                success: true,
                message: 'Book updated successfully!',
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

  static readDate(req, res) {
    const { date } = req.body
    return req.user.then(user => {
      Book.findByPk(req.params.movieId)
        .then(async book => {
          let gm = await book.getGenericMedium()
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
                message: 'Book updated successfully',
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

  static unread(req, res) {
    return req.user.then(user => {
      Book.findByPk(req.params.movieId)
        .then(async book => {
          let gm = await book.getGenericMedium()
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
                message: 'Book updated successfully',
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
    Book.findByPk(req.params.bookId).then(async book => {
      let GM = await book.getGenericMedium()
      let newGenres = genres.map(genre => {
        return Genre.findOrCreate({
          where: { name: genre, isFor: 'Book' }
        })
      })
      newGenres = await Promise.all(newGenres)
      newGenres = newGenres.map(elem => elem[0])
      GM.setGenres(newGenres)
        .then(data => {
          res.status(200).send({
            success: true,
            message: 'Books genres changed',
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
  }
}

export default Books
