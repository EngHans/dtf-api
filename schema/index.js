const path = require('path');
const { mergeTypes, fileLoader } = require('merge-graphql-schemas');

const typesArray = fileLoader(path.join(__dirname, './*.graphql'), { extensions: ['graphql'] });
module.exports = mergeTypes(typesArray);
