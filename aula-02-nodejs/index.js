const util = require('node:util')

const obterEnderecoAsync = util.promisify(obterEndereco)

function obterUsuario() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            return resolve({
                id: 1,
                nome: 'Aladin',
                dataNascimento: new Date()
            })
        }, 1000)
    })
}

function obterTelefone(idUsuario) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            return resolve({
                numero: '115545',
                ddd: '15' 
            })
        }, 2000)
    })
}

function obterEndereco(idUsuario) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            return resolve({
                rua: 'Vagueiro',
                numero: '38'
            })
        }, 2000)
    })
}

main()
async function main() {
   try {
        console.time('medida-promise')
        const usuario = await obterUsuario()
        // const endereco = await obterEndereco(usuario.id)
        // const telefone = await obterTelefone(usuario.id)

        const resultado = await Promise.all([obterTelefone(usuario.id), obterEndereco(usuario.id)])
        const telefone = resultado[0];
        const endereco = resultado[1];

        console.log(`
            Nome: ${usuario.nome},
            Telefone: (${telefone.ddd}) ${telefone.numero},
            Endereço: ${endereco.rua} ${endereco.numero} 
        `);
        console.timeEnd('medida-promise')
   } catch(error) {
        console.error('DEU RUIM', error);
   }
}

// obterUsuario()
//     .then(usuario => {
//         return obterTelefone()
//             .then(telefone => {
//                 return {
//                     usuario: {
//                         nome: usuario.nome,
//                         id: usuario.id
//                     },
//                     telefone
//                 }
//             })
//     })
//     .then(resultado => {
//         const endereco = obterEnderecoAsync(resultado.usuario.id)
//         return endereco.then(result => {
//             return {
//                 usuario: resultado.usuario,
//                 telefone: resultado.telefone,
//                 endereco: result
//             }
//         })
//     })
//     .then(resultado => {
//         console.log(resultado);
//     })

// const usuario = obterUsuario((erro, usuario) => {
//     if (erro){
//         console.error("DEU RUIM AO TRAZER USUARIO", erro)
//         return
//     }
//     obterTelefone(usuario.id, (erro1, telefone) => {
//         if (erro1){
//             console.error("DEU RUIM AO TRAZER TELEFONE", erro1)
//             return
//         }
//         obterEndereco(usuario.id, (erro2, endereco) => {
//             if (erro2){
//                 console.error("DEU RUIM AO TRAZER ENDEREÇO", erro2)
//                 return
//             }
//             console.log(`
//                 Nome: ${usuario.nome},
//                 Endereço: ${endereco.rua}, ${endereco.numero},
//                 Telefone: (${telefone.ddd}) ${telefone.numero}
//             `);
//         })
//     })
// })

// console.log(telefone);