const { getAllData } = require('../integrators/dtfGovAPI')

module.exports = {
  getDataFromAPI: ({ limit, order }) => {
    return getAllData(limit, order)
  }
}
