const assert = require('assert')
const api = require('../api')

let app = {}

describe('Teste da API Heroes', async function () {
    this.beforeAll(async () => {
        app = await api
    })

    it('listar /heroes', async () => {
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

        assert.deepEqual(result.payload, 'Erro interno no servidor')
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
})