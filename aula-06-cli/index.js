const { Command } = require('commander')
const Heroi = require('./heroi')
const Database = require('./database')

async function main() {
    const program = new Command();

    program.version('v1')
        .option('-n, --nome [value]', 'Nome do Heroi')
        .option('-p, --poder [value]', 'Poder do Heroi')
        .option('-i, --id [value]', 'Id do Heroi')

        .option('-c, --cadastrar', 'Cadastrar Heroi')
        .option('-l, --listar', 'Listar Herois')
        .option('-r, --remover', 'Remove um Heroi pelo id')
        .option('-a, --atualizar [value]', 'Atualizar um Heroi pelo id')

    program.parse(process.argv)

    const options = program.opts();
    const heroi = new Heroi(options);

    try {
        if (options.cadastrar) {
            delete heroi.id
            const resultado = await Database.cadastrar(heroi)
            if (!resultado) {
                console.error('Heroi nao foi cadastrado.');
                return
            }
            console.log('Heroi cadastrado com sucesso!');
            return
        }

        if (options.listar) {
           const resultado = await Database.listar()
           console.log(resultado);
           return
        }

        if (options.remover) {
            const resultado = await Database.remover(heroi.id)
            if (!resultado) {
                console.error('Heroi nao foi removido.');
                return
            }
            console.log('Heroi foi removido com sucesso!');
            return
        }

        if (options.atualizar) {
            const idParaAtualizar = parseInt(options.atualizar)
            const dado = JSON.stringify(heroi)
            const heroiAtualizar = JSON.parse(dado)

            const resultado = await Database.atualizar(idParaAtualizar, heroiAtualizar)

            if (!resultado) {
                console.error('Heroi nao foi atualizado.');
                return
            }
            console.log('Heroi foi atualizado com sucesso!');
            return
        }
    } catch (error) {
        console.error(error)
    }
}

main()