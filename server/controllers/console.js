import model from '../models'

const { Console } = model

class Consoles {
  static create(req, res) {
    const { name } = req.body
    return Console.findOrCreate({
      where: {
        name: name
      }
    })
      .then(ConsoleData => {
        res.status(201).send({
          success: true,
          message: 'Console successfully created',
          ConsoleData
        })
      })
      .catch(error => {
        res.status(400).send({
          success: false,
          message: 'Error in console creation',
          error
        })
      })
  }

  static list(req, res) {
    return Console.findAll({
      order: [['name', 'ASC']]
    }).then(consoles => {
      res.status(200).send({
        success: true,
        message: 'List retieved everything',
        consoles
      })
    })
  }

  static delete(req, res) {
    return Console.findByPk(req.params.genreId)
      .then(aConsole => {
        if (!aConsole) {
          return res.status(404).send({
            success: true,
            message: 'Console Not Found'
          })
        }
        return aConsole.destroy().then(() => {
          res.status(200).send({
            success: true,
            message: 'Console successfully deleted'
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
    const { name, image, year } = req.body
    return Console.findByPk(req.params.genreId)
      .then(aConsole => {
        if (!aConsole) {
          return res.status(404).send({
            success: false,
            message: 'VideoGame Not Found'
          })
        }
        aConsole
          .update({
            name: name || aConsole.name,
            image: image || aConsole.image,
            year: year || aConsole.year
          })
          .then(updated => {
            res.status(200).send({
              success: true,
              message: 'Console updated successfully',
              data: {
                name: name || aConsole.name,
                image: image || aConsole.image,
                year: year || aConsole.year
              }
            })
          })
          .catch(error => {
            res.status(400).send({
              success: false,
              message: 'Error in updating the console',
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

export default Consoles
