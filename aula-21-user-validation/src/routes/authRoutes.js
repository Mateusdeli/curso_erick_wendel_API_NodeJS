const Joi = require('joi')
const Boom = require('boom')
const BaseRoute = require('./base/baseRoute')
const Jwt = require('jsonwebtoken')
const PasswordHelper = require('../helpers/passwordHelper')

const failAction = (request, headers, error) => {
    throw error
}

const USER = {
    username: 'goku',
    password: '123456'
}

class AuthRoutes extends BaseRoute {
    constructor(secret, db) {
        super()
        this.secret = secret
        this.db = db
    }

    login() {
        return {
            path: '/login',
            method: 'POST',
            config: {
                auth: false,
                tags: ['api'],
                description: 'Deve obter um token',
                notes: 'fazer login com usuario e senha do banco',
                validate: {
                    failAction,
                    payload: {
                        username: Joi.string().required(),
                        password: Joi.string().required(),
                    }
                }
            },
            handler: async (request, headers) => {
                try {
                    const { username, password } = request.payload

                    const [usuario] = await this.db.read({ username: username.toLowerCase() })

                    if (!usuario) {
                        return Boom.unauthorized('O Usuario informado não existe!')
                    }

                    const match = await PasswordHelper.comparePassword(password, usuario.password)

                    if (!match) {
                        return Boom.unauthorized('O usuario ou senha invalidos!')
                    }
                    
                    const token = Jwt.sign({
                        username,
                        id: usuario.id
                    }, this.secret)

                    return {
                        token
                    }
                } catch(error) {
                    console.log('DEU RUIM', error)
                    return Boom.internal()
                }
            }
        }
    }
}

module.exports = AuthRoutes