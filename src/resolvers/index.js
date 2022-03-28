const { mergeResolvers } = require('merge-graphql-schemas')
const tutorial = require('./tutorial')
const dtfData = require('./dtfData')

const resolverArray = [
  tutorial,
  dtfData
]

module.exports = mergeResolvers(resolverArray)
