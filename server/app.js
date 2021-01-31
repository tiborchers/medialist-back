import 'babel-polyfill'
import http from 'http'
import express from 'express'

import logger from 'morgan'
import bodyParser from 'body-parser'
import routes from './routes'
import passport from 'passport'

import compression from 'compression'
import helmet from 'helmet'

import { strategy } from './jwt'
const env = process.env.NODE_ENV || 'development'
let hostname = '0.0.0.0'
if (env === 'development') {
  hostname = '0.0.0.0'
}

const port = process.env.PORT || 3000
const app = express()
// setup express application
const server = http.createServer(app)

app.use(logger('dev'))
app.use(helmet())
app.use(compression())

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
