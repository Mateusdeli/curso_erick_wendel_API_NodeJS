const { config } = require('dotenv')
const { join } = require('path')
const { ok } = require('assert')

const env = process.env.NODE_ENV || 'dev'
ok(env === 'prod' || env === 'dev', 'a env é invalida, ou dev ou prod.')

const configPath = join(__dirname, './config', `.env.${env}`)
config({
    path: configPath
})

const Hapi = require('@hapi/hapi')
const Joi = require('joi')
const MongoDB = require('./db/strategies/mongodb')
const Context = require('./db/strategies/base/contextStrategy')
const HeroiSchema = require('./db/strategies/mongodb/schemas/heroiSchema')

const HeroRoute = require('./routes/heroRoutes')

const HapiSwagger = require('hapi-swagger')
const Vision = require('@hapi/vision')
const Inert = require('@hapi/inert')

const AuthRoute = require('./routes/authRoutes')
const HapiJwt = require('hapi-auth-jwt2')

const Postgres = require('./db/strategies/postgres')
const UsuarioSchema = require('./db/strategies/postgres/schemas/usuarioSchema')

const JWT_SECRET = process.env.JWT_KEY

const PORT = process.env.PORT

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

    const connectionPostgres = await Postgres.connect()
    const model = await Postgres.defineModel(connectionPostgres, UsuarioSchema)
    const contextPostgres = new Context(new Postgres(connectionPostgres, model))

    const swaggerOptions = {
        info: {
            title: 'API Herois - #CursoNodeBR',
            version: 'v1.0'
        }
    }

    await app.register([
        HapiJwt,
        Vision,
        Inert,
        {
            plugin: HapiSwagger,
            options: swaggerOptions
        }
    ])

    app.validator(Joi)
    app.auth.strategy('jwt', 'jwt', {
        key: JWT_SECRET,
        // options: {
        //     expiresIn: 20,
        // },
        validate: async (dado, request) => {
            const [usuario] = await contextPostgres.read({
                username: dado.username.toLowerCase()
            })

            if (!usuario) {
                return {
                    isValid: false
                }
            }

            return {
                isValid: true
            }
        }
    })
    app.auth.default('jwt')
    app.route([
        ...mapRoutes(new HeroRoute(context), HeroRoute.methods()),
        ...mapRoutes(new AuthRoute(JWT_SECRET, contextPostgres), AuthRoute.methods())
    ])

    await app.start()
    console.log('Servidor rodando na porta', app.info.host);

    return app
}

module.exports = main()