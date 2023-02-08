const Hapi = require('@hapi/hapi')
const MongoDB = require('./db/strategies/mongodb')
const Context = require('./db/strategies/base/contextStrategy')
const HeroiSchema = require('./db/strategies/mongodb/schemas/heroiSchema')

const PORT = 5000

const app = Hapi.server({
    host: 'localhost',
    port: PORT
})

async function main() {
    const connection = MongoDB.connect()
    const context = new Context(new MongoDB(connection, HeroiSchema))

    app.route([
        {
            path: '/heroes',
            method: 'GET',
            handler: async (request, head) => {
                return await context.read()
            }
        }
    ])

    await app.start()
    console.log('Servidor rodando na porta', app.info.host);
}

main()