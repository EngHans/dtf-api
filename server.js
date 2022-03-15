var express = require('express');
var { graphqlHTTP } = require('express-graphql');
var resolvers = require('./resolvers')
var types =  require('./schema')
var { buildSchema } = require('graphql');

var app = express();
app.use('/graphql', graphqlHTTP({
  schema: buildSchema(types),
  rootValue: resolvers,
  graphiql: true,
}));

app.listen(4000);
console.log('Running a GraphQL API server at localhost:4000/graphql');