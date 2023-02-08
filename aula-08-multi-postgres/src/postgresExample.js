const Sequelize = require('sequelize')

const driver = new Sequelize.Sequelize('heroes', 'mateusdeli', '123456', {
    host: 'localhost',
    port: 5432,
    dialect: 'postgres',
    quoteIdentifiers: false,
    operatorsAliases: false
})

async function main() {
    
    const result = await Heroes.findAll({ raw: true, attributes: ['nome'] })
    console.log(result);
}

main()