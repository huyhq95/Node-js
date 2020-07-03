const { DataSource } = require('apollo-datasource');
require('isomorphic-fetch');

class EmployeesAPI extends DataSource {
    constructor() {
        super();
    }

    initialize(config) {
        this.context = config.context;
    }

    async getEmployees() {
        return await this.context.db.collection('employees').find().toArray();
    }

    async crawlEmployees() {
        const data = await fetch('http://dummy.restapiexample.com/api/v1/employees')
            .then(async response => {
                const jsonData = await response.json();
                await this.saveEmployees(jsonData.data);
                return jsonData.data;
            })
            .catch(function (error) {
                console.log('error', error);
            });
        return data;
    }

    async saveEmployees(data) {
        return await this.context.db.collection('employees').bulkWrite(data.map((obj) => {
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
    }

}

module.exports = EmployeesAPI;
