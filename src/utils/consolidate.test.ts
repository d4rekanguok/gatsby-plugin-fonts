import { consolidate } from './consolidate'

describe('utils/consolidate', () => {
  it('should retrieve all texts', async () => {
    const result = await consolidate({
      root: __dirname,
      files: './consolidate-test/**/*'
    })

    expect(result).toMatchSnapshot()
  })
})