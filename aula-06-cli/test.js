const { deepEqual } = require('assert');
const database = require('./database');

const DEFAULT_ITEM_CADASTRAR = {
    id: 1,
    nome: 'Flash',
    poder: 'Speed'
}

const DEFAULT_ITEM_ATUALIZAR = {
    id: 2,
    nome: 'Lanterna Verde',
    poder: 'Anel'
}

describe(('Suite manipulação de arquivos'), () => {
    before(async () => {
        await database.cadastrar(DEFAULT_ITEM_CADASTRAR)
        await database.cadastrar(DEFAULT_ITEM_ATUALIZAR)
    })

    it('Deve listar todos os herois', async () => {
       const expected = DEFAULT_ITEM_CADASTRAR
       const [resultado] = await database.listar(expected.id)

       deepEqual(resultado, expected)
    });

    it('Deve cadastrar um novo heroi', async () => {
        const expected = DEFAULT_ITEM_CADASTRAR
        await database.cadastrar(DEFAULT_ITEM_CADASTRAR)
        const listaComTodos = await database.listar(DEFAULT_ITEM_CADASTRAR.id)
        const actual = listaComTodos[listaComTodos.length - 1]
        deepEqual(actual, expected)
    })

    it('Deve remover um heroi por id', async () => {
        const expected = true
        const resultado = await database.remover(DEFAULT_ITEM_CADASTRAR.id)
        deepEqual(resultado, expected)
    })

    it('Deve remover todos os herois', async () => {
        const expected = true
        const resultado = await database.remover()
        deepEqual(resultado, expected)
    })

    it('Deve atualizar um heroi por id', async () => {
        const expected = {
            ...DEFAULT_ITEM_ATUALIZAR,
            nome: 'Batman',
            poder: 'Dinheiro'
        }
        const novoDado = {
            nome: 'Batman',
            poder: 'Dinheiro'
        }
        await database.atualizar(DEFAULT_ITEM_ATUALIZAR.id, novoDado)
        const [resultado] = await database.listar(DEFAULT_ITEM_ATUALIZAR.id)
        deepEqual(resultado, expected)
    })
})