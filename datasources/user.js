const { DataSource } = require('apollo-datasource');
const bcrypt = require('bcrypt');

class UserAPI extends DataSource {
    constructor() {
        super();
    }

    initialize(config) {
        this.context = config.context;
    }

    async signup(email, username, password) {
        return await this.context.db.collection('users').insertOne({
            "email": email,
            "username": username,
            "password": bcrypt.hashSync(password, 10)
        });
    }

    async login(username, password) {
        const checkUserExists = await this.context.db.collection('users').findOne({
            'username': username
        }).then(async function (user) {
            if (!user) {
                return false;
            } else {
                if (bcrypt.compareSync(password, user.password) == true) {
                    return true;
                } else {
                    return false;
                }
            }
        });
        if (checkUserExists) {
            this.context.session.user = username;
        }
        return checkUserExists;
    }

}

module.exports = UserAPI;
