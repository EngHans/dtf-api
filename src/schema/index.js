const { mergeTypes, fileLoader } = require('merge-graphql-schemas')

const typesArray = fileLoader(__dirname, { extensions: ['graphql'], recursive: true })
module.exports = mergeTypes(typesArray)
