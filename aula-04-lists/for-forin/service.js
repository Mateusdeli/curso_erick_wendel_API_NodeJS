const axios = require('axios')

const URL = `https://swapi.dev/api/people`

async function obterPessoas(nome) {
    const url = `${URL}/?search=${nome}&format=json`
    const resposta = await axios.get(url)
    return resposta.data
}

module.exports = {
    obterPessoas
}