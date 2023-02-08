const Sequelize = require('sequelize')
const ICrud = require('../interfaces/interfaceCrud')

class Postgres extends ICrud {
    constructor(connection, schema) {
        super()
        this._connection = connection
        this._schema = schema
    }

    async create(item) {
        const { dataValues } = await this._schema.create(item, { raw: true })
        return dataValues
    }

    async read(filter = {}) {
        return await this._schema.findAll({ where: filter, raw: true })
    }

    async update(id, item, upsert = false) {
        const fn = upsert ? 'upsert' : 'update'
        return await this._schema[fn](item, { where: { id } })
    }

    async delete(id) {
        const query = id ? { id } : {} 
        return await this._schema.destroy({ where: query })
    }

    async isConnected() {
       try {
            await this._connection.authenticate()
            return true
       } catch(error) {
        console.error('Connection DB Error:', error)
       }
    }

    static async defineModel(connection, schema) {
        const model = connection.define(schema.name, schema.schema, schema.options)
        await model.sync()
        return model
    }

    static connect() {
        const connection = new Sequelize.Sequelize('heroes', 'mateusdeli', '123456', {
            host: 'localhost',
            port: 5432,
            dialect: 'postgres',
            quoteIdentifiers: false,
            operatorsAliases: false,
            logging: false
        })
        return connection
    }
}

module.exports = Postgres