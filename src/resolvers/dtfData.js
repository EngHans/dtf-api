const { getAllData } = require('../integrators/dtfGovAPI')

module.exports = {
  getDataFromAPI: (args) => {
    return getAllData(args)
  }
}
