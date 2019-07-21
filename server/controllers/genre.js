import model from '../models'

const { Genre } = model

class Genres {
  static Create(req, res) {
    const { name } = req.body
    return Genre.findOrCreate({
      where: {
        name: name
      }
    })
      .then(GenreData => {
        res.status(201).send({
          success: true,
          message: 'Genre successfully created',
          GenreData
        })
      })
      .then(error => {
        res.status(400).send({
          success: false,
          message: 'failed to create a genre',
          error
        })
      })
  }

  static listMovies(req, res) {
    return Genre.findAll({
      order: [['name', 'ASC']],
      where: {
        isFor: 'Movie'
      }
    }).then(genres => {
      res.status(200).send({
        success: true,
        message: 'List retrieved',
        genres
      })
    })
  }

  static listShorts(req, res) {
    return Genre.findAll({
      order: [['name', 'ASC']],
      where: {
        isFor: 'Short'
      }
    }).then(genres => {
      res.status(200).send({
        success: true,
        message: 'List retrieved',
        genres
      })
    })
  }

  static list(req, res) {
    return Genre.findAll({
      order: [['name', 'ASC']]
    }).then(genres => {
      res.status(200).send({
        success: true,
        message: 'List retrieved',
        genres
      })
    })
  }

  static listDocumentaries(req, res) {
    return Genre.findAll({
      order: [['name', 'ASC']],
      where: {
        isFor: 'Documentary'
      }
    }).then(genres => {
      res.status(200).send({
        success: true,
        message: 'List retrieved',
        genres
      })
    })
  }

  static listVideoGames(req, res) {
    return Genre.findAll({
      order: [['name', 'ASC']],
      where: {
        isFor: 'VideoGame'
      }
    }).then(genres => {
      res.status(200).send({
        success: true,
        message: 'List retrieved',
        genres
      })
    })
  }

  static listBooks(req, res) {
    return Genre.findAll({
      order: [['name', 'ASC']],
      where: {
        isFor: 'Book'
      }
    }).then(genres => {
      res.status(200).send({
        success: true,
        message: 'List retrieved',
        genres
      })
    })
  }

  static listAlbums(req, res) {
    return Genre.findAll({
      order: [['name', 'ASC']],
      where: {
        isFor: 'Album'
      }
    }).then(genres => {
      res.status(200).send({
        success: true,
        message: 'List retrieved',
        genres
      })
    })
  }

  static delete(req, res) {
    return Genre.findByPk(req.params.genreId)
      .then(genre => {
        if (!genre) {
          return res.status(400).send({
            success: false,
            message: 'Genre Not Found'
          })
        }
        return genre.destroy().then(() => {
          res.status(200).send({
            success: true,
            message: 'Genre successfully deleted'
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

  static modify(req, res) {
    const { name, isFor } = req.body
    return Genre.findByPk(req.params.genreId)
      .then(genre => {
        genre
          .update({
            name: name || genre.name,
            isFor: isFor || genre.isFor
          })
          .then(updated => {
            res.status(200).send({
              message: 'Genre updated successfully',
              data: {
                name: name || genre.name,
                isFor: isFor || genre.isFor
              }
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

export default Genres
