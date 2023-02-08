const Mongoose = require('mongoose')
const ICrud = require('./interfaces/interfaceCrud')

const STATUS = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
    99: 'uninitialized'
}

class MongoDB extends ICrud {
    constructor() {
        super()
        this._driver = null
        this._heroes = null
    }

    create(item) {
        return this._heroes.create(item)
    }

    read(filter, skip=0, limit=10) {
        return this._heroes.find(filter).limit(limit).skip(skip)
    }

    update(id, item) {
        return this._heroes.updateOne({ _id: id }, { $set: item })
    }

    delete(id) {
        return this._heroes.deleteOne({ _id: id })
    }

    async isConnected() {
        const state = STATUS[this._driver.readyState]
        if (state === 'connected') return state
        if (state !== 'connecting') return state
        await new Promise(resolve => setTimeout(resolve, 100))
        return state
    }

    async connect() {
        Mongoose.connect('mongodb://mateusdeli:123456@localhost:27017',
        (error) => {
            if (!error) return
            console.error('Houve na conexão com o MongoDB:', error)
        })
        const connection = Mongoose.connection
        
        this._driver = connection
        connection.once('open', () => console.log('A conexão com o banco MongoDB foi estabelecida com sucesso.'))
        this.defineModel()
    }

    async defineModel() {
        const HeroiSchema = new Mongoose.Schema({
            nome: {
                type: String,
                required: true
            },
            poder: {
                type: String,
                required: true
            },
            insertedAt: {
                type: Date,
                default: new Date()
            }
        })
        const HeroiModel = Mongoose.model('heroes', HeroiSchema)
        this._heroes = HeroiModel
    }
}

module.exports = MongoDB