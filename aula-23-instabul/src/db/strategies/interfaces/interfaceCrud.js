const NotImplementedException = require('../errors/notImplementedException')

class ICrud {
    create(item) {
        throw new NotImplementedException()
    }
    read(filter) {
        throw new NotImplementedException()
    }
    update(id, item, upsert=false) {
        throw new NotImplementedException()
    }
    delete(id) {
        throw new NotImplementedException()
    }
    isConnected() {
        throw new NotImplementedException()
    }
    static connect() {
        throw new NotImplementedException()
    }
}

module.exports = ICrud