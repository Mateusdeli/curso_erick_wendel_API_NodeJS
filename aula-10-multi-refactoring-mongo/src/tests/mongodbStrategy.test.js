const assert = require('node:assert')
const MongoDB = require('../db/strategies/mongodb')
const Context = require('../db/strategies/base/contextStrategy')
const HeroiSchema = require('../db/strategies/mongodb/schemas/heroiSchema')

const MOCK_HEROI_CADASTRAR = {
    nome: 'Flash',
    poder: 'Velocidade'
}

const MOCK_HEROI_DEFAULT = {
    nome: `Homem Aranha-${Date.now()}`,
    poder: `Super teia`
}

const MOCK_HEROI_ATUALIZAR = {
    nome: `Patolino`,
    poder: `Velocidade`
}

let MOCK_HEROI_ID = null

let context = {}
describe('MongoDB Strategy', async () => {
    before(async () => {
        const connection = MongoDB.connect()
        context = new Context(new MongoDB(connection, HeroiSchema))
        await context.create(MOCK_HEROI_DEFAULT)
        const result = await context.create(MOCK_HEROI_ATUALIZAR)
        MOCK_HEROI_ID = result._id
    })
    it('MongoDB Connection', async () => {
        const result = await context.isConnected()
        const expecteds = {connected: 'connected', connecting: 'connecting'}

        assert.deepEqual(result, expecteds[result])
    })
    it('Cadastrar', async () => {
        const { nome, poder } = await context.create(MOCK_HEROI_CADASTRAR)

        assert.deepEqual({ nome, poder }, MOCK_HEROI_CADASTRAR)
    })
    it('Listar', async () => {
        const [{ nome, poder }] = await context.read({ nome: MOCK_HEROI_DEFAULT.nome })
        const result = { nome, poder }

        assert.deepEqual(result, MOCK_HEROI_DEFAULT)
    })
    it('Atualizar', async () => {
        const result = await context.update(MOCK_HEROI_ID, {
            nome: 'Pernalonga'
        })
        assert.deepEqual(result.modifiedCount, 1)
    })
    it('Deletar', async () => {
        const result = await context.delete(MOCK_HEROI_ID)
        assert.deepEqual(result.deletedCount, 1)
    })
})