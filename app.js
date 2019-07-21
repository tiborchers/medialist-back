import http from 'http'
import express from 'express'

import logger from 'morgan'
import bodyParser from 'body-parser'
import routes from './server/routes'
import passport from 'passport'

import compression from 'compression'
import helmet from 'helmet'

import { strategy } from './server/jwt'
const hostname = '127.0.0.1'
const port = 3000
const app = express()
// setup express application
const server = http.createServer(app)

app.use(logger('dev'))

app.use(compression())
app.use(helmet())

// log requests to the console
// Parse incoming requests data app.use(bodyParser.json());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// For Passport

passport.use(strategy)
app.use(passport.initialize())

routes(app)
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`)
})
