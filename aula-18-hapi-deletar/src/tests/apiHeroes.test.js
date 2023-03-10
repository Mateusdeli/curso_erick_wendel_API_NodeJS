const assert = require('assert')
const api = require('../api')

let app = {}

const MOCK_HEROI_CADASTRAR = {
    nome: 'Laterna Verde',
    poder: 'anel'
}

const MOCK_HEROI_INICIAL = {
    nome: 'Chapolin',
    poder: 'Marreta'
}
let MOCK_ID = null
describe('Teste da API Heroes', async function () {
    this.beforeAll(async () => {
        app = await api
        const result = await app.inject({
            method: 'POST',
            url: '/heroes',
            payload: MOCK_HEROI_INICIAL
        })

        const { _id } = JSON.parse(result.payload)
        MOCK_ID = _id
    })

    it('listar GET - /heroes', async () => {
        const result = await app.inject({
            method: 'GET',
            url: '/heroes?skip=0&limit=10'
        })
        const dados = JSON.parse(result.payload)
        const statusCode = result.statusCode

        assert.deepEqual(statusCode, 200)
        assert.ok(Array.isArray(dados))
    })

    it('listar /heroes - deve retornar somente 5 registros', async () => {
        const TAMANHO_LIMITE = 5
        const result = await app.inject({
            method: 'GET',
            url: `/heroes?skip=0&limit=${TAMANHO_LIMITE}`,
        })

        const dados = JSON.parse(result.payload)
        const statusCode = result.statusCode

        assert.deepEqual(statusCode, 200)
        assert.ok(dados.length === TAMANHO_LIMITE)
    })

    it('listar /heroes - deve retornar um erro com o filtro limit incorreto', async () => {
        const TAMANHO_LIMITE = 'AEEE'
        const result = await app.inject({
            method: 'GET',
            url: `/heroes?skip=0&limit=${TAMANHO_LIMITE}`,
        })

        const errorResult = {"statusCode":400,"error":"Bad Request","message":"\"limit\" must be a number","validation":{"source":"query","keys":["limit"]}}

        assert.deepEqual(result.statusCode, 400)
        assert.deepEqual(result.payload, JSON.stringify(errorResult))
    })

    it('listar /heroes - deve filtrar 1 registro', async () => {
        const TAMANHO_LIMITE = 1000
        const NAME = 'Homem Aranha-1675388632929'
        const result = await app.inject({
            method: 'GET',
            url: `/heroes?skip=0&limit=${TAMANHO_LIMITE}&nome=${NAME}`,
        })
        const dados = JSON.parse(result.payload)
        const statusCode = result.statusCode

        assert.deepEqual(statusCode, 200)
        assert.deepEqual(dados[0].nome, NAME)
    })

    it('cadastrar POST - /heroes', async () => {
        const result = await app.inject({
            method: 'POST',
            url: `/heroes`,
            payload: MOCK_HEROI_CADASTRAR
        })

        const { _id, message } = JSON.parse(result.payload)

        assert.ok(result.statusCode === 200)
        assert.notStrictEqual(_id, undefined)
        assert.deepEqual(message, 'Heroi cadastrar com sucesso!')
    })

    it('atualizar PATCH - /heroes/:id', async () => {
        const _id = MOCK_ID
        const expected = {
            poder: 'Marreta Bionica'
        }
        const result = await app.inject({
            method: 'PATCH',
            url: `/heroes/${_id}`,
            payload: expected
        })

        const { message } = JSON.parse(result.payload)

        assert.ok(result.statusCode === 200)
        assert.deepEqual(message, 'Heroi atualizado com sucesso!')
    })

    it('atualizar PATCH - /heroes/:id - n??o deve atualizar com id incorreto', async () => {
        const _id = '63dc632a69a39955cddd80ad'
        const result = await app.inject({
            method: 'PATCH',
            url: `/heroes/${_id}`,
            payload: {
                poder: 'Marreta Bionica'
            }
        })

        const dados = JSON.parse(result.payload)

        const expected = {
            statusCode: 412,
            error: 'Precondition Failed',
            message: 'Id n??o encontrado no banco!'
          }

        assert.ok(dados.statusCode === 412)
        assert.deepEqual(dados.message, 'Id n??o encontrado no banco!')
        assert.deepEqual(dados, expected)
    })

    it('remover DELETE - /heroes/:id', async () => {
        const _id = MOCK_ID
        const result = await app.inject({
            method: 'DELETE',
            url: `/heroes/${_id}`
        })

        const { message } = JSON.parse(result.payload)

        assert.ok(result.statusCode === 200)
        assert.deepEqual(message, 'Heroi foi removido com sucesso!')
    })

    
    it('remover DELETE - /heroes/:id - n??o deve remover', async () => {
        const _id = '63dc632a69a39955cddd80ad'
        const result = await app.inject({
            method: 'DELETE',
            url: `/heroes/${_id}`
        })

        const dados = JSON.parse(result.payload)

        assert.ok(dados.statusCode === 412)
        assert.deepEqual(dados.message, 'Id n??o encontrado no banco!')
    })

    it('remover DELETE - /heroes/:id - n??o deve remover com id invalido', async () => {
        const _id = 'ID_INVALIDO'
        const result = await app.inject({
            method: 'DELETE',
            url: `/heroes/${_id}`
        })

        const dados = JSON.parse(result.payload)
        const expected = {
            statusCode: 500,
            error: "Internal Server Error",
            message: "An internal server error occurred"
        }

        assert.ok(dados.statusCode === 500)
        assert.deepEqual(dados, expected)
    })
})