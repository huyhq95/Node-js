const bcrypt = require('bcrypt');

module.exports = {
    checkUserExist: function (ctx, username) {
        return ctx.db.collection('users').findOne({ "username": username });
    },
    signUp: function (ctx, username, password) {
        return ctx.db.collection('users').insertOne({ "username": username, "password": bcrypt.hashSync(password, 10) });
    },
    logIn: function (ctx, username, password) {
        return ctx.db.collection('users').findOne({
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
    },
    crawlData: function (ctx, data) {
        ctx.db.collection('employees').bulkWrite(data.map((obj) => {
            const { id, ...update } = obj;
            return {
                updateOne: {
                    filter: { _id: id },
                    update: {
                        $setOnInsert: { _id: id },
                        $set: update,
                    },
                    upsert: true,
                },
            };
        }));
        ctx.db.collection('employees').createIndex({ employee_name: "text" })
    },
    getEmployees : function (ctx, name) {
        return name ? ctx.db.collection('employees').find( { $text: { $search: name } } ).toArray() : ctx.db.collection('employees').find().toArray();
    },
}