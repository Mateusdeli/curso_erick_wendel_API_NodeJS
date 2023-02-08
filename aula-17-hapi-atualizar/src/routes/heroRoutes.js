const Joi = require('joi')
const BaseRoute = require('./base/baseRoute')

const failAction = (request, headers, error) => {
    throw error
}

class HeroRoutes extends BaseRoute {
    constructor(db) {
        super()
        this.db = db
    }

    list() {
        return {
            path: '/heroes',
            method: 'GET',
            config: {
                validate: {
                    failAction,
                    query: {
                        skip: Joi.number().integer().default(0),
                        limit: Joi.number().integer().default(10),
                        nome: Joi.string().min(3).max(100)
                    }
                }
            },
            handler: (request, headers) => {
                try {
                    const { skip, limit, nome } = request.query
                    let query = nome ? { nome: { $regex: `.*${nome}*.` }} : {}
                    return this.db.read(query, skip, limit)
                } catch(error) {
                    console.log('DEU RUIM', error)
                    return 'Erro interno no servidor'
                }
            }
        }
    }

    create() {
        return {
            path: '/heroes',
            method: 'POST',
            config: {
                validate: {
                    failAction,
                    payload: {
                        nome: Joi.string().required().min(3).max(100),
                        poder: Joi.string().required().min(2).max(100),
                    }
                }
            },
            handler: async (request) => {
                try {
                    const { nome, poder } = request.payload
                    const result = await this.db.create({ nome, poder })
                    return {
                        message: 'Heroi cadastrar com sucesso!',
                        _id: result._id
                    }
                } catch(error) {
                    console.log('DEU RUIM', error)
                    return 'Erro interno no servidor'
                }
            }
        }
    }

    update() {
        return {
            path: '/heroes/{id}',
            method: 'PATCH',
            config: {
                validate: {
                    failAction,
                    params: {
                        id: Joi.string().required()
                    },
                    payload: {
                        nome: Joi.string().min(3).max(100),
                        poder: Joi.string().min(2).max(100),
                    }
                }
            },
            handler: async (request) => {
                try {
                    const { id } = request.params
                    const { payload } = request

                    const dadosString = JSON.stringify(payload)
                    const dados = JSON.parse(dadosString)

                    const result = await this.db.update(id, dados)

                    if (result.modifiedCount !== 1) {
                        return { message: 'Não foi possivel atualizar!' }
                    }

                    return {
                        message: 'Heroi atualizado com sucesso!'
                    }
                } catch(error) {
                    console.log('DEU RUIM', error)
                    return 'Erro interno no servidor'
                }
            }
        }
    }
}

module.exports = HeroRoutes