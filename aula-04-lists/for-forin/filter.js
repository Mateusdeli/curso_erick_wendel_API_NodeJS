const { obterPessoas } = require('./service')

Array.prototype.meuFiltro = function(callback) {
    const items = []
    for (const index in this) {
        const item = this[index]
        const resultado = callback(item, index, this)
        if (!resultado) continue
        items.push(item)
    }
    return items
}

async function main() {
   try {
        const { results } = await obterPessoas('a')
        const familiaLars = results.filter((result, index, lista) => {
            console.log(`index: ${index}`, lista.length);
            return result.name.toLowerCase().match('lars')
        })
        const nomes = familiaLars.map(familia => familia.name)
        console.log(nomes);
   } catch (error) {
        console.error('DEU RUIM', error)
   }
}

main()