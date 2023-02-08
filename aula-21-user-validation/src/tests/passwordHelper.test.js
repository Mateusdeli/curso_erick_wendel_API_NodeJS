const assert = require('assert')
const PasswordHelper = require('../helpers/passwordHelper')

const SENHA = 'Mateus@1524a4!'
const HASH = '$2b$04$J3NdiZgdudMu/OXiuGBeAOhMqEIzy/pKru/TrZvbqrfnvMgDNZQr.'

describe('UserHelper test suite', () => {
    it('deve gerar hash a partir de uma senha', async () => {
        const result = await PasswordHelper.hashPassword(SENHA)
        assert.ok(result.length > 10)
    })

    it('deve comparar uma senha e seu hash', async () => {
        const result = await PasswordHelper.comparePassword(SENHA, HASH)
        assert.deepEqual(result, true)
    })
})