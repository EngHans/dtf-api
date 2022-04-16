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

const mockQueryOffset = jest
  .spyOn(_internal.Query.prototype, 'offset')
  .mockReturnThis()

const mockQueryLimit = jest
  .spyOn(_internal.Query.prototype, 'limit')
  .mockReturnThis()

const mockQueryOrder = jest
  .spyOn(_internal.Query.prototype, 'order')
  .mockReturnThis()

const mockQuerySelect = jest
  .spyOn(_internal.Query.prototype, 'select')
  .mockReturnThis()

const mockGetRowsOn = jest.fn().mockImplementation(
  (status, cb) => {
    cb()
  }
)

const mockQueryGetRows = jest
  .spyOn(_internal.Query.prototype, 'getRows')
  .mockImplementation(() => ({
    on: mockGetRowsOn
  }))

it('Testing correct URL was called on module require', () => {
  expect(Consumer).toHaveBeenCalledTimes(1)
  expect(Consumer).toHaveBeenCalledWith('datos.gov.co')
})

describe('Testing the getDataFromAPI query', () => {
  beforeEach(() => {
    Consumer.mockClear()
    _internal.Connection.mockClear()
    mockConsumerQuery.mockClear()
    mockQueryWithDataset.mockClear()
    mockQueryLimit.mockClear()
    mockQueryOrder.mockClear()
    mockQueryGetRows.mockClear()
    mockQuerySelect.mockClear()
    mockGetRowsOn.mockClear()
    mockQueryOffset.mockClear()
    mockGetRowsOn.mockImplementationOnce((status, emit) => {
      emit([0])
    })
  })

  const defaultOrder = { column: 'fechacorte', direction: 'DESC' }
  const randomOrder = () => ({ column: chance.string(), direction: chance.string() })
  const randomPagination = () => ({ pageSize: chance.integer(), page: chance.integer() })

  it('Should call the government API with the default parameters', async () => {
    const variables = {}
    await dtfAPI.getDataFromAPI(variables)
    expect(mockConsumerQuery).toHaveBeenCalledTimes(1)
    expect(mockQueryWithDataset).toHaveBeenCalledWith('axk9-g2nh')
    expect(mockQueryLimit).toHaveBeenCalledWith(5)
    expect(mockQueryOrder).toHaveBeenCalledWith(`${defaultOrder.column} ${defaultOrder.direction}`)
    expect(mockQuerySelect).toHaveBeenCalledTimes(1)
    expect(mockQueryOffset).not.toHaveBeenCalled()
  })

  it('Should call the government API with custom limit, default order should remain', async () => {
    const pagination = randomPagination()
    const variables = { pagination }
    await dtfAPI.getDataFromAPI(variables)
    expect(mockConsumerQuery).toHaveBeenCalledTimes(1)
    expect(mockQueryWithDataset).toHaveBeenCalledWith('axk9-g2nh')
    expect(mockQueryLimit).toHaveBeenCalledWith(pagination.pageSize)
    expect(mockQueryOrder).toHaveBeenCalledWith(`${defaultOrder.column} ${defaultOrder.direction}`)
    expect(mockQueryOffset).toHaveBeenCalledWith((pagination.page - 1) * pagination.pageSize)
  })

  it('Should call the government API with custom order, default limit should remain', async () => {
    const order = randomOrder()
    const variables = { order }
    await dtfAPI.getDataFromAPI(variables)
    expect(mockConsumerQuery).toHaveBeenCalledTimes(1)
    expect(mockQueryWithDataset).toHaveBeenCalledWith('axk9-g2nh')
    expect(mockQueryLimit).toHaveBeenCalledWith(5)
    expect(mockQueryOrder).toHaveBeenCalledWith(`${order.column} ${order.direction}`)
    expect(mockQueryOffset).not.toHaveBeenCalled()
  })

  it('Should call the government API with custom limit and order', async () => {
    const pagination = randomPagination()
    const order = randomOrder()
    const variables = { pagination, order }
    await dtfAPI.getDataFromAPI(variables)
    expect(mockConsumerQuery).toHaveBeenCalledTimes(1)
    expect(mockQueryWithDataset).toHaveBeenCalledWith('axk9-g2nh')
    expect(mockQueryLimit).toHaveBeenCalledWith(pagination.pageSize)
    expect(mockQueryOrder).toHaveBeenCalledWith(`${order.column} ${order.direction}`)
    expect(mockQueryOffset).toHaveBeenCalledWith((pagination.page - 1) * pagination.pageSize)
  })
})
