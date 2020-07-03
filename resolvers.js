module.exports = {
    Query: {
        employees: async (_, __, { dataSources }) => {
            const Employees = await dataSources.employeesAPI.getEmployees();
            if (Employees) return Employees;
        },
    },
    Mutation: {
        signUp: async (_, { email, username, password }, { dataSources }) => {
            const user = await dataSources.userAPI.signup(email, username, password);
            if (user) {
                return {
                    'status': true,
                    'msg': 'Sign up succesfully'
                }
            } else {
                return {
                    'status': false,
                    'msg': 'Unauthorized'
                }
            }
        },
        login: async (_, { username, password }, { dataSources }) => {
            const user = await dataSources.userAPI.login(username, password);
            if (user) {
                return {
                    'status': true,
                    'msg': 'Log in succesfully'
                }
            } else {
                return {
                    'status': false,
                    'msg': 'Unauthorized'
                }
            }
        },
        crawlEmployees: async (_, __, { dataSources }) => {
            const Employees = await dataSources.employeesAPI.crawlEmployees();
            if (Employees) return Employees;
        },
    },
};
