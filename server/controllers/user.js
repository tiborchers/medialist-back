import model from '../models'
import jwt from 'jsonwebtoken'
import { jwtOptions } from '../jwt'

const { User } = model

class Users {
  static get(req, res) {
    return User.findByPk(req.params.id)
      .then(user => {
        if (!user) {
          return res.status(400).send({
            success: true,
            message: 'User Not Found'
          })
        }
        return res.status(200).send({
          success: true,
          message: 'User retrieved',
          user
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
  static list(req, res) {
    return User.findAll()
      .then(users => {
        return res.status(200).send({
          success: true,
          message: 'User list retrieved',
          users
        })
      })
      .catch(error => {
        res.status(400).send({
          success: false,
          message: 'Error',
          error
        })
      })
  }
  static create(req, res) {
    const { name, username, email, password } = req.body
    return User.create(
      {
        name,
        username,
        email,
        password
      },
      {}
    )
      .then(newUser => {
        let payload = { id: newUser.id }
        let token = jwt.sign(payload, jwtOptions.secretOrKey, {
          expiresIn: '2w'
        })
        res.status(201).send({
          success: true,
          message: 'User successfully created',
          user: newUser,
          token: token
        })
      })
      .catch(error => {
        res.status(400).send({
          success: false,
          message: 'User creation failed',
          error
        })
      })
  }
  static login(req, res) {
    const { email, password } = req.body
    return User.findOne({
      where: {
        email: email
      }
    })
      .then(async user => {
        if (!user) {
          return res.status(401).send({
            success: false,
            message: 'Incorrect Email or password'
          })
        }
        user.comparePassword(password).then(match => {
          if (match) {
            let payload = { id: user.id }
            let token = jwt.sign(payload, jwtOptions.secretOrKey, {
              expiresIn: '2w'
            })
            return res.status(200).send({ msg: 'ok', token: token, user: user })
          } else {
            return res.status(401).send({
              success: false,
              message: 'Incorrect Email or password'
            })
          }
        })
      })
      .catch(error => {
        res.status(400).send({
          success: false,
          message: 'login failed',
          error
        })
      })
  }
  static renew(req, res) {
    return req.user.then(user => {
      let payload = { id: user.id }
      let token = jwt.sign(payload, jwtOptions.secretOrKey, {
        expiresIn: '2w'
      })
      return res.status(200).send({ msg: 'ok', token: token, user: user })
    })
  }
}

export default Users
