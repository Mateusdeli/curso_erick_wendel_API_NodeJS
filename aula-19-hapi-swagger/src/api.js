const Hapi = require('@hapi/hapi')
const Joi = require('joi')
const MongoDB = require('./db/strategies/mongodb')
const Context = require('./db/strategies/base/contextStrategy')
const HeroiSchema = require('./db/strategies/mongodb/schemas/heroiSchema')
const HeroRoute = require('./routes/heroRoutes')
const HapiSwagger = require('hapi-swagger')
const Vision = require('@hapi/vision')
const Inert = require('@hapi/inert')

const PORT = 5000

const app = Hapi.server({
    host: 'localhost',
    port: PORT
})

function mapRoutes(instance, methods) {
   return methods.map(method => instance[method]())
}

async function main() {
    const connection = MongoDB.connect()
    const context = new Context(new MongoDB(connection, HeroiSchema))

    const swaggerOptions = {
        info: {
            title: 'API Herois - #CursoNodeBR',
            version: 'v1.0'
        }
    }

    await app.register([
        Vision,
        Inert,
        {
            plugin: HapiSwagger,
            options: swaggerOptions
        }
    ])

    app.validator(Joi)
    app.route(
        mapRoutes(new HeroRoute(context), HeroRoute.methods())
    )

    await app.start()
    console.log('Servidor rodando na porta', app.info.host);

    return app
}

module.exports = main()