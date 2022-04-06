const soda = require('soda-js')

const datasetUrl = 'datos.gov.co'
const datasetId = 'axk9-g2nh'

const consumer = new soda.Consumer(datasetUrl)

function getAllData (limit = 5, order = { column: 'fechacorte', direction: 'DESC' }) {
  const query = consumer.query()
    .withDataset(datasetId)
    .limit(limit)
    .order(`${order.column} ${order.direction}`)

  return new Promise((resolve, reject) => {
    query.getRows()
      .on('success', resolve)
      .on('error', reject)
  })
}

module.exports = {
  getAllData
}
