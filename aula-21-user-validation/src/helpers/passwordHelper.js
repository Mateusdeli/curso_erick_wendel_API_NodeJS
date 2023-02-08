const Bcrypt = require('bcrypt')

const SALT = 3
class PasswordHelper {
    static async hashPassword(pass) {
        return await Bcrypt.hash(pass, SALT)
    }
    static async comparePassword(pass, hash) {
        return await Bcrypt.compare(pass, hash)
    }
}

module.exports = PasswordHelper