const { readFileSync, writeFileSync } = require('node:fs')

class Database {
    constructor() {
        this.NOME_ARQUIVO = 'herois.json'
    }

    async obterDadosArquivo() {
        const arquivo = await readFileSync(this.NOME_ARQUIVO, 'utf-8')
        return JSON.parse(arquivo.toString())
    }

    async escreverArquivo(dados) {
        await writeFileSync(this.NOME_ARQUIVO, JSON.stringify(dados))
        return true
    }

    async cadastrar(heroi) {
        const dados = await this.obterDadosArquivo()
        const id = heroi.id <= 2 ? heroi.id : Date.now()
        const heroiComId = {
            id,
            ...heroi
        }
        const dadosFinal = [
            ...dados,
            heroiComId
        ]
        const resultado = await this.escreverArquivo(dadosFinal)
        return resultado
    }

    async listar(id) {
        const dados = await this.obterDadosArquivo()
        return dados.filter(item => id ? item.id === id : true)
    }

    async remover(id) {
        if (!id) {
            return  await this.escreverArquivo([])
        }
        const dados = await this.obterDadosArquivo()

        const indice = dados.findIndex(item => item.id === parseInt(id))

        if (indice === -1) {
            throw new Error('Seu heroi nao existe.')
        }

        dados.splice(indice, 1)
        const resultado = await this.escreverArquivo(dados)
        return resultado
    }

    async atualizar(id, modificacoes) {
        const dados = await this.obterDadosArquivo()
        const indice = dados.findIndex(item => item.id === parseInt(id))

        if (indice === -1) {
            throw Error('O heroi informado nao existe')
        }

        const atual = dados[indice]
        const objetoAtualizar = {
            ...atual,
            ...modificacoes
        }

        dados.splice(indice, 1)

        return await this.escreverArquivo([
            ...dados,
            objetoAtualizar
        ])
    }
}

module.exports = new Database()