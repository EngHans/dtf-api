const soda = require('soda-js')
const clonedeep = require('lodash.clonedeep')

const datasetUrl = 'datos.gov.co'
const datasetId = 'axk9-g2nh'

const consumer = new soda.Consumer(datasetUrl)

async function getAllData (pagination, order = { column: 'fechacorte', direction: 'DESC' }) {
  if (!pagination) {
    pagination = {
      pageSize: 5
    }
  }
  const query = consumer.query()
    .withDataset(datasetId)
  const notLimitedCount = (await getQueryCount(query))[0].count

  query.limit(pagination.pageSize)
    .order(`${order.column} ${order.direction}`)
  let paginationResponse = {}
  if (pagination.page) {
    query.offset((pagination.page - 1) * pagination.pageSize)
    paginationResponse = {
      pageSize: pagination.pageSize,
      currentPage: pagination.page,
      pages: Math.ceil(notLimitedCount / pagination.pageSize)
    }
  }

  try {
    return {
      data: await getQueryResult(query),
      notLimitedCount,
      pagination: paginationResponse
    }
  } catch (error) {
    throw new Error(`QUERYING_DATA_ERROR: ${error.message}`)
  }
}

function getQueryCount (query) {
  const queryClone = clonedeep(query)
    .select('count(*)')
  return getQueryResult(queryClone)
}

function getQueryResult (query) {
  return new Promise((resolve, reject) => {
    query.getRows()
      .on('success', resolve)
      .on('error', reject)
  })
}

module.exports = {
  getAllData
}
