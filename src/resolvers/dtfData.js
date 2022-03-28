const { getAllData } = require('../integrators/dtfGovAPI')

module.exports = {
  getDataFromAPI: ({ limit }) => {
    return getAllData(limit)
  }
}
