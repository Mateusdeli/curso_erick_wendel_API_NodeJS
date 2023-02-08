async function main() {
    const HeroiSchema = new Mongoose.Schema({
        nome: {
            type: String,
            required: true
        },
        poder: {
            type: String,
            required: true
        },
        insertedAt: {
            type: Date,
            default: new Date()
        }
    })    
    
    const HeroiModel = Mongoose.model('heroes', HeroiSchema)

    // await HeroiModel.create({
    //     nome: 'Batman',
    //     poder: 'Dinheiro'
    // })

    const x = await HeroiModel.find({})
    
    console.log(x);
}

main()