const express = require('express')
const { graphqlHTTP } = require('express-graphql')
const resolvers = require('./src/resolvers')
const types = require('./src/schema')
const { buildSchema } = require('graphql')

const app = express()
app.get('/health', (req, res) =>
  res.status(200).send({
    message: 'Welcome to the DTF-API'
  })
)
app.use('/', graphqlHTTP({
  schema: buildSchema(types),
  rootValue: resolvers,
  graphiql: true
}))

app.listen(4000)
console.log('Running a GraphQL API server at localhost:4000')
