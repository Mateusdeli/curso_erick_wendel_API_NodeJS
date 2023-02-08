const Sequelize = require('sequelize')
const ICrud = require('./interfaces/interfaceCrud')

class Postgres extends ICrud {
    constructor() {
        super()
        this._driver = null
        this._heroes = null
    }

    async create(item) {
        const { dataValues } = await this._heroes.create(item, { raw: true })
        return dataValues
    }

    async read(filter = {}) {
        return await this._heroes.findAll({ where: filter, raw: true })
    }

    async update(id, item) {
        return await this._heroes.update(item, { where: { id } })
    }

    async delete(id) {
        const query = id ? { id } : {} 
        return await this._heroes.destroy({ where: query })
    }

    async isConnected() {
       try {
            await this._driver.authenticate()
            return true
       } catch(error) {
        console.error('Connection DB Error:', error)
       }
    }

    async defineModel() {
        this._heroes = this._driver.define('heroes', {
            id: {
                type: Sequelize.INTEGER,
                required: true,
                primaryKey: true,
                autoIncrement: true
            },
            nome: {
                type: Sequelize.STRING,
                required: true
            },
            poder: {
                type: Sequelize.STRING,
                required: true
            }
        }, {
            tableName: 'tb_heroes',
            freezeTableName: false,
            timestamps: false
        })
        await this._heroes.sync()
    }

    async connect() {
        this._driver = new Sequelize.Sequelize('heroes', 'mateusdeli', '123456', {
            host: 'localhost',
            port: 5432,
            dialect: 'postgres',
            quoteIdentifiers: false,
            operatorsAliases: false
        })
        await this.defineModel()
    }
}

module.exports = Postgres