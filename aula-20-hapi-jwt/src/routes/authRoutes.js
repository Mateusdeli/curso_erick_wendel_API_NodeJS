const Joi = require('joi')
const Boom = require('boom')
const BaseRoute = require('./base/baseRoute')
const Jwt = require('jsonwebtoken')

const failAction = (request, headers, error) => {
    throw error
}

const USER = {
    username: 'goku',
    password: '123456'
}

class AuthRoutes extends BaseRoute {
    constructor(secret) {
        super()
        this.secret = secret
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
            handler: (request, headers) => {
                try {
                    const { username, password } = request.payload

                    if (username.toLowerCase() !== USER.username || password.toLowerCase() !== USER.password) {
                        return Boom.unauthorized()
                    }
                    
                    const token = Jwt.sign({
                        username,
                        id: 1
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