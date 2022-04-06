const tutorial = require('../src/resolvers/tutorial.js')

describe('Testing the quoteOfTheDay endpoint', () => {
  beforeAll(() => {
    jest.spyOn(global.Math, 'random')
      .mockReturnValueOnce(0.1)
      .mockReturnValueOnce(0.6)
  })

  afterAll(() => {
    jest.spyOn(global.Math, 'random').mockRestore()
  })

  it.each([
    ['Take it easy'],
    ['Salvation lies within']
  ])('Should return the proper quote of the day', (response) => {
    expect(tutorial.quoteOfTheDay()).toBe(response)
  })
})

it.concurrent('Should return a valid random number', () => {
  expect(tutorial.random()).toBeGreaterThanOrEqual(0)
  expect(tutorial.random()).toBeLessThanOrEqual(1)
})

it.concurrent('Should roll three dice', () => {
  tutorial.rollThreeDice().forEach((die) => {
    expect(die).toBeGreaterThanOrEqual(1)
    expect(die).toBeLessThanOrEqual(6)
  })
})
