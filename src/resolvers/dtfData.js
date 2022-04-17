const { getAllData, getLatestData } = require('../integrators/dtfGovAPI')

module.exports = {
  getDataFromAPI: ({ pagination, order }) => {
    return getAllData({ pagination, order })
  },
  getLastDateFromAPI: ({ pagination, order }) => {
    return getLatestData({ pagination, order })
  }
}
