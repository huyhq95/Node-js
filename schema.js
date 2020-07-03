const { gql } = require('apollo-server-koa');

const typeDefs = gql`
type Query { 
    employees: [Employees] 
}
scalar JSON
type Mutation {
    signUp(
        email: String,
        username:String,
        password:String,
    ): JSON
    login(
        username:String,
        password:String,
    ): JSON
    crawlEmployees : JSON
}

type Employees { 
    _id: Int,
    employee_name: String,
    employee_salary: String,
    employee_age:String,
    profile_image: String
}

type User { 
    _id: Int,
    email: String,
    username: String,
    password:String,
}
`;
module.exports = typeDefs;
