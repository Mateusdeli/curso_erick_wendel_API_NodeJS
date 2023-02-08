const http = require('node:http')

const PORT = 7001

const server = http.createServer((request, response) => {
    response.end('Hello World')
})

server.listen(PORT, () => console.log(`O servidor está rodando na porta ${PORT}!`))