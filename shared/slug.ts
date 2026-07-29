/**
 * Short, URL-friendly share-link ids (e.g. "kR7vTq2"). A bill is addressed only
 * by its share link, so its primary id *is* this slug - no separate mapping
 * table needed. 7 chars from a 56-symbol alphabet ≈ 1.7e12 combinations, so
 * collisions are astronomically unlikely; the repository retries on the rare
 * clash anyway.
 *
 * The alphabet omits look-alike characters (0/O, 1/l/I) so a link is safe to
 * read aloud or type by hand. Uses Web Crypto (available in the browser, Node
 * 20, and the Vercel/Nitro runtime), with rejection sampling for no modulo bias.
 */
const ALPHABET = '23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz'
const N = ALPHABET.length // 56
const CEIL = 256 - (256 % N) // 224 - reject bytes at/above this to stay unbiased

export function generateSlug(length = 7): string {
  let out = ''
  const buf = new Uint8Array(length * 2)
  while (out.length < length) {
    globalThis.crypto.getRandomValues(buf)
    for (let i = 0; i < buf.length && out.length < length; i++) {
      const b = buf[i]!
      if (b < CEIL) out += ALPHABET[b % N]
    }
  }
  return out
}

/** Whether a string looks like one of our slugs (for light route validation). */
export function isSlug(s: string): boolean {
  return /^[23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz]{4,16}$/.test(s)
}
