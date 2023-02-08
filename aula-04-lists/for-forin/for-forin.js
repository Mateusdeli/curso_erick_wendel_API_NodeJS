const service = require('./service')

async function main() {
    try {
        const nomes = []
        const dados = await service.obterPessoas('a')

        console.time('for')
        for (let i = 0; i < dados.results.length; i++) {
            const pessoa = dados.results[i];
            nomes.push(pessoa.name)
        }
        console.timeEnd('for')

        console.time('for-in')
        for (const i in dados.results) {
            const pessoa = dados.results[i]
            nomes.push(pessoa.name)
        }
        console.timeEnd('for-in')

        console.time('for-of')
        for (const pessoa of dados.results) {
            nomes.push(pessoa.name);
        }
        console.timeEnd('for-of')

        console.log(nomes);
    } catch (erro) {
        console.error('DEU RUIM', erro)
    }
}

main()