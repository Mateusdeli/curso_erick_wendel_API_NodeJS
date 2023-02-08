const EventEmitter = require('events')

class MeuEmissor extends EventEmitter {

}

const meuEmissor = new MeuEmissor()
const nomeEvento = 'usuario:click'

meuEmissor.on(nomeEvento, (click) => {
    console.log('um usuario clicou', click)
})

meuEmissor.emit(nomeEvento, 'na barra de rolagem')

let contador = 0
setInterval(() => {
    meuEmissor.emit(nomeEvento, 'no ok ' + (contador++))
}, 1000)

// const stdin = process.openStdin()
// stdin.addListener('data', (value) => {
//     console.log(`Você digitou: ${value.toString().trim()}`)
// })
