import { describe, it, expect } from 'vitest'

describe('Example Test', () => {
  it('should pass', () => {
    expect(1 + 1).toBe(2)
  })
  
  it('should work with strings', () => {
    expect('hello world').toContain('world')
  })
})