const service = require('./service')

Array.prototype.meuMap = function (callback) {
    const items = []
    for (let indice = 0; indice < this.length; indice++) {
        const resultado = callback(this[indice], indice)
        items.push(resultado)
    }
    return items
}

async function main() {
    const { results } = await service.obterPessoas('a')
    // const names = results.map(result => result.name)

    const names = results.meuMap((pessoa, indice) => {
        return `[${indice}] ${pessoa.name}`
    })

    console.log('nomes', names);
}

main()