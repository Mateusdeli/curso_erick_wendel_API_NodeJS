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
            url: '/heroes'
        })
        const dados = JSON.parse(result.payload)
        const statusCode = result.statusCode

        assert.deepEqual(statusCode, 200)
        assert.ok(Array.isArray(dados))
    })
})