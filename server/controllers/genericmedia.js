import model from '../models'
import Sequelize from 'sequelize'

const { GenericMedia, UserGM } = model

const Op = Sequelize.Op

class GenericMedias {
  static CreateGM(req, res) {
    const { image, title, year, commentary } = req.body
    return GenericMedia.create({
      image,
      title,
      year,
      commentary
    }).then(GMData => {
      res.status(201).send({
        success: true,
        message: 'GM successfully created',
        GMData
      })
    })
  }

  static list(req, res) {
    return GenericMedia.findAll({
      include: [
        GenericMedia.associations.Short,
        GenericMedia.associations.Movie,
        GenericMedia.associations.Documentary,
        GenericMedia.associations.VideoGame,
        GenericMedia.associations.Book
      ]
    }).then(gm => {
      res.status(200).send({
        gm: gm,
        coutnt: gm.length
      })
    })
  }

  static delete(req, res) {
    return GenericMedia.findByPk(req.params.gmId)
      .then(async gm => {
        if (!gm) {
          return res.status(400).send({
            message: 'GenericMedia Not Found'
          })
        }
        await gm.setUsers([])
        return gm
          .destroy()
          .then(() => {
            res.status(200).send({
              message: 'GenericMedia successfully deleted'
            })
          })
          .catch(error => res.status(400).send(error))
      })
      .catch(error => res.status(400).send(error))
  }

  static deleteNot(req, res) {
    return GenericMedia.findAll({
      include: [
        GenericMedia.associations.Short,
        GenericMedia.associations.Movie,
        GenericMedia.associations.Documentary,
        GenericMedia.associations.VideoGame,
        GenericMedia.associations.Book,
        GenericMedia.associations.Album
      ],
      where: {
        [Op.and]: [
          { $Short$: null },
          { $Movie$: null },
          { $Documentary$: null },
          { $VideoGame$: null },
          { $Book$: null },
          { $Album$: null }
        ]
      }
    }).then(gm => res.status(200).send(gm))
  }

  static count(req, res) {
    return GenericMedia.count().then(c => res.status(200).send({ c }))
  }

  static Cheking(req, res) {
    UserGM.findAll({
      where: {
        [Op.or]: [{ userId: null }, { GMId: null }]
      }
    }).then(usergm => {
      res.status(200).send(usergm)
    })
  }
}

export default GenericMedias
