import { describe, it, expect } from 'vitest'
import { generateSlug, isSlug } from './slug'

describe('generateSlug', () => {
  it('defaults to 7 chars and honours a custom length', () => {
    expect(generateSlug()).toHaveLength(7)
    expect(generateSlug(10)).toHaveLength(10)
  })

  it('only emits unambiguous URL-safe characters', () => {
    const s = generateSlug(200)
    expect(s).toMatch(/^[23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz]+$/)
    expect(s).not.toMatch(/[01OIl]/) // no look-alikes
  })

  it('is effectively collision-free at this scale', () => {
    const seen = new Set<string>()
    for (let i = 0; i < 5000; i++) seen.add(generateSlug())
    expect(seen.size).toBe(5000)
  })
})

describe('isSlug', () => {
  it('accepts generated slugs and rejects junk', () => {
    expect(isSlug(generateSlug())).toBe(true)
    expect(isSlug('has space')).toBe(false)
    expect(isSlug('has0look1alike')).toBe(false)
    expect(isSlug('')).toBe(false)
  })
})
