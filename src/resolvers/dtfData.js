const { getAllData } = require('../integrators/dtfGovAPI')

module.exports = {
  getDataFromAPI: ({ pagination, order }) => {
    return getAllData(pagination, order)
  }
}
