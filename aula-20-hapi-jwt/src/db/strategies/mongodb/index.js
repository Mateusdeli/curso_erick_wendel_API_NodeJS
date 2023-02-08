const Mongoose = require('mongoose')
const ICrud = require('../interfaces/interfaceCrud')

const STATUS = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
    99: 'uninitialized'
}

class MongoDB extends ICrud {
    constructor(connection, schema) {
        super()
        this._connection = connection
        this._schema = schema
    }

    create(item) {
        return this._schema.create(item)
    }

    read(filter, skip=0, limit=10) {
        return this._schema.find(filter).limit(limit).skip(skip)
    }

    update(id, item) {
        return this._schema.updateOne({ _id: id }, { $set: item })
    }

    delete(id) {
        return this._schema.deleteOne({ _id: id })
    }

    async isConnected() {
        const state = STATUS[this._connection.readyState]
        if (state === 'connected') return state
        if (state !== 'connecting') return state
        await new Promise(resolve => setTimeout(resolve, 100))
        return state
    }

    static connect() {
        Mongoose.connect('mongodb://mateusdeli:123456@localhost:27017',
        (error) => {
            if (!error) return
            console.error('Houve na conexão com o MongoDB:', error)
        })
        const connection = Mongoose.connection
        connection.once('open', () => console.log('A conexão com o banco MongoDB foi estabelecida com sucesso.'))
        return connection
    }
}

module.exports = MongoDB