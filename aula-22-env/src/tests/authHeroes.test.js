const assert = require('assert')
const api = require('../api')
const Context = require('../db/strategies/base/contextStrategy')
const Postgres = require('../db/strategies/postgres')
const UsuarioSchema = require('../db/strategies/postgres/schemas/usuarioSchema')

let app = {}
let context = {}

const USER = {
    username: 'goku',
    password: '123456'
}

const USER_DB = {
    username: USER.username.toLowerCase(),
    password: '$2b$04$fWC8HxMlU.cY63rUNqSAfe3OOXOAC7/7TKPINoqMlYjdpQWmdeYGm'
}

describe('Auth test suite', function() {
    this.beforeAll(async () => {
        app = await api
        const connectionPostgres = await Postgres.connect()
        const model = await Postgres.defineModel(connectionPostgres, UsuarioSchema)
        context = new Context(new Postgres(connectionPostgres, model))
        await context.update(null, USER_DB, true)
    })

    it('Deve obter um token', async () => {
        const result = await app.inject({
            method: 'POST',
            url: '/login',
            payload: {
                username: 'goku',
                password: '123456'
            }
        })

        const dados = JSON.parse(result.payload)
        const statusCode = result.statusCode

        assert.deepEqual(statusCode, 200)
        assert.ok(dados.token.length > 10)
    })

    it('Deve retornar nao autorizado ao tentar obter token com login invalido', async () => {
        const result = await app.inject({
            method: 'POST',
            url: '/login',
            payload: {
                username: 'goku',
                password: '123'
            }
        })

        const statusCode = result.statusCode
        const dados = JSON.parse(result.payload)

        assert.deepEqual(statusCode, 401)
        assert.deepEqual(dados.error, 'Unauthorized')
    })

})