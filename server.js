const express = require('express')
const { graphqlHTTP } = require('express-graphql')
const resolvers = require('./resolvers')
const types = require('./schema')
const { buildSchema } = require('graphql')

const app = express()
app.use('/graphql', graphqlHTTP({
  schema: buildSchema(types),
  rootValue: resolvers,
  graphiql: true
}))

app.listen(4000)
console.log('Running a GraphQL API server at localhost:4000/graphql')
