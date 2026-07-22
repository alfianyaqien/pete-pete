import { describe, it, expect } from 'vitest'
import { formatRupiah, formatCompact, formatSignedCompact } from './format'

describe('money formatting', () => {
  it('always carries the Rp prefix', () => {
    expect(formatRupiah(1284000)).toBe('Rp 1.284.000')
    expect(formatCompact(96000)).toMatch(/^Rp /)
    expect(formatSignedCompact(543000)).toContain('Rp ')
    expect(formatSignedCompact(0)).toBe('Rp 0')
  })

  it('uses "k" for thousands, not "rb"', () => {
    expect(formatCompact(24000)).toBe('Rp 24k')
    expect(formatCompact(30000)).toBe('Rp 30k')
    expect(formatCompact(96000)).toBe('Rp 96k')
    expect(formatCompact(96000)).not.toContain('rb')
  })

  it('keeps juta for millions and small values plain', () => {
    expect(formatCompact(1280000)).toBe('Rp 1,28jt')
    expect(formatCompact(540)).toBe('Rp 540')
  })

  it('signs compact balances', () => {
    expect(formatSignedCompact(543000)).toBe('+Rp 543k')
    expect(formatSignedCompact(-98000)).toBe('−Rp 98k')
  })
})
