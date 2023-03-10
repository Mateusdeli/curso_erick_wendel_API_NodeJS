const Joi = require('joi')
const BaseRoute = require('./base/baseRoute')

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
                    failAction: (request, headers, error) => {
                        throw error
                    },
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
}

module.exports = HeroRoutes