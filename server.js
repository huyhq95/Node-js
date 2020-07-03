const { ApolloServer } = require('apollo-server-koa');

const Koa = require('koa');
const mongo = require('koa-mongo')
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const EmployeesAPI = require('./datasources/employees');
const UserAPI = require('./datasources/user');
const session = require('koa-session');

const app = new Koa();
app.keys = ['koajs'];
app.use(mongo());
app.use(session(app));

const server = new ApolloServer({
    typeDefs,
    resolvers,
    dataSources: () => {
        return {
            employeesAPI: new EmployeesAPI(),
            userAPI: new UserAPI(),
        };
    },
    context: ({ ctx }) => ctx,
});


server.applyMiddleware({ app });
app.listen({ port: 4000 }, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
)