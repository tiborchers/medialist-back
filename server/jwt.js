import model from './models'
import passportJWT from 'passport-jwt'
const { User } = model

let ExtractJwt = passportJWT.ExtractJwt
let JwtStrategy = passportJWT.Strategy

let jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
jwtOptions.secretOrKey = '*ElmaxoOjoGato!#$'

let strategy = new JwtStrategy(jwtOptions, function(jwtPayload, next) {
  let user = User.findByPk(jwtPayload.id, {
    attributes: ['id', 'name', 'username', 'email']
  })
  if (user) {
    next(null, user)
  } else {
    next(null, false)
  }
})

export { strategy }
export { jwtOptions }
