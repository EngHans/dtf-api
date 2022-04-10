const { Consumer, _internal } = require('soda-js')
const dtfAPI = require('../src/resolvers/dtfData')
const Chance = require('chance')
const chance = new Chance()

jest.mock('soda-js')

const mockConsumerQuery = jest
  .spyOn(Consumer.prototype, 'query')
  .mockReturnValue(new _internal.Query(this))

const mockQueryWithDataset = jest
  .spyOn(_internal.Query.prototype, 'withDataset')
  .mockReturnThis()

const mockQueryLimit = jest
  .spyOn(_internal.Query.prototype, 'limit')
  .mockReturnThis()

const mockQueryOrder = jest
  .spyOn(_internal.Query.prototype, 'order')
  .mockReturnThis()

const mockQueryGetRows = jest
  .spyOn(_internal.Query.prototype, 'getRows')
  .mockImplementation(() => ({
    on: jest.fn().mockImplementation(
      (status, cb) => {
        cb()
      }
    )
  }))

it('Testing correct URL was called on module require', () => {
  expect(Consumer).toHaveBeenCalledTimes(1)
  expect(Consumer).toHaveBeenCalledWith('datos.gov.co')
})

describe('Testing the getDataFromAPI query', () => {
  beforeEach(() => {
    Consumer.mockClear()
    _internal.Connection.mockClear()
  })

  beforeEach(() => {
    Consumer.mockClear()
    mockConsumerQuery.mockClear()
    mockQueryWithDataset.mockClear()
    mockQueryLimit.mockClear()
    mockQueryOrder.mockClear()
    mockQueryGetRows.mockClear()
  })

  const defaultOrder = { column: 'fechacorte', direction: 'DESC' }
  const randomOrder = () => ({ column: chance.string(), direction: chance.string() })

  it('Should call the government API with the default parameters', async () => {
    const variables = {}
    await dtfAPI.getDataFromAPI(variables)
    expect(mockConsumerQuery).toHaveBeenCalledTimes(1)
    expect(mockQueryWithDataset).toHaveBeenCalledWith('axk9-g2nh')
    expect(mockQueryLimit).toHaveBeenCalledWith(5)
    expect(mockQueryOrder).toHaveBeenCalledWith(`${defaultOrder.column} ${defaultOrder.direction}`)
  })

  it('Should call the government API with custom limit, default order should remain', async () => {
    const limit = chance.integer()
    const variables = { limit }
    await dtfAPI.getDataFromAPI(variables)
    expect(mockConsumerQuery).toHaveBeenCalledTimes(1)
    expect(mockQueryWithDataset).toHaveBeenCalledWith('axk9-g2nh')
    expect(mockQueryLimit).toHaveBeenCalledWith(limit)
    expect(mockQueryOrder).toHaveBeenCalledWith(`${defaultOrder.column} ${defaultOrder.direction}`)
  })

  it('Should call the government API with custom order, default limit should remain', async () => {
    const order = randomOrder()
    const variables = { order }
    await dtfAPI.getDataFromAPI(variables)
    expect(mockConsumerQuery).toHaveBeenCalledTimes(1)
    expect(mockQueryWithDataset).toHaveBeenCalledWith('axk9-g2nh')
    expect(mockQueryLimit).toHaveBeenCalledWith(5)
    expect(mockQueryOrder).toHaveBeenCalledWith(`${order.column} ${order.direction}`)
  })

  it('Should call the government API with custom limit and order', async () => {
    const limit = chance.integer()
    const order = randomOrder()
    const variables = { limit, order }
    await dtfAPI.getDataFromAPI(variables)
    expect(mockConsumerQuery).toHaveBeenCalledTimes(1)
    expect(mockQueryWithDataset).toHaveBeenCalledWith('axk9-g2nh')
    expect(mockQueryLimit).toHaveBeenCalledWith(limit)
    expect(mockQueryOrder).toHaveBeenCalledWith(`${order.column} ${order.direction}`)
  })
})
