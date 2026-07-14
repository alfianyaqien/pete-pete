import type { H3Event } from 'h3'
import type { ZodType } from 'zod'

/** Read + validate a JSON body against a Zod schema, 400 on failure. */
export async function readValidated<T>(event: H3Event, schema: ZodType<T>): Promise<T> {
  const body = await readBody(event)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid input',
      data: parsed.error.flatten(),
    })
  }
  return parsed.data
}

/**
 * Resolve a repository mutation: thrown domain errors (e.g. duplicate name) →
 * 400, a null result (bill not found) → 404.
 */
export async function mutationResult<T>(promise: Promise<T | null>): Promise<T> {
  let result: T | null
  try {
    result = await promise
  } catch (e) {
    throw createError({
      statusCode: 400,
      statusMessage: e instanceof Error ? e.message : 'Operation failed',
    })
  }
  if (result === null) throw createError({ statusCode: 404, statusMessage: 'Bill not found' })
  return result
}
