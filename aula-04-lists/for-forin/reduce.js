const { obterPessoas } = require('./service')

Array.prototype.meuReduce = function(callback, valorInicial) {
    let valorFinal = typeof valorInicial !== 'undefined' ? valorInicial : this[0]
    for (let i = 0; i < this.length; i++) {
        valorFinal = callback(valorFinal, this[i], this)
    }
    return valorFinal
}

async function main() {
    try {
        const { results } = await obterPessoas('a')
        // const pesos = results.map(result => parseInt(result.mass))
        // const pesoTotal = pesos.meuReduce((prev, current) => current ? prev + current : prev, 0)
        // console.log(pesoTotal);

        const minhaLista = [
            ['Mateus', 'Deli'],
            ['NodeBR', 'Nerdzão']
        ]

        const total = minhaLista.meuReduce((prev, current) => {
            return prev.concat(current)
        }, [])
        .join(', ')

        console.log(total);
    } catch (erro) {
        console.error(erro)
    }
}

main()