const soda = require('soda-js')
const clonedeep = require('lodash.clonedeep')

const datasetUrl = 'datos.gov.co'
const datasetId = 'axk9-g2nh'

const consumer = new soda.Consumer(datasetUrl)

async function getAllData ({ pagination, where, order = { column: 'fechacorte', direction: 'DESC' } }) {
  if (!pagination) {
    pagination = {
      pageSize: 5
    }
  }
  const query = consumer.query()
    .withDataset(datasetId)
  if (where) {
    query.where(where)
  }
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

async function getLatestData ({ pagination, order = { column: 'fechacorte', direction: 'DESC' } }) {
  const latestDate = (await getAllData({ pageSize: 1 })).data[0].fechacorte
  return getAllData({ pagination, order, where: soda.expr.gte('fechacorte', latestDate) })
}

module.exports = {
  getAllData,
  getLatestData
}
