import { createBillInputSchema } from '../../../shared/schemas'

/** POST /api/bills — create a trip. */
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const parsed = createBillInputSchema.safeParse(body)
  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid bill',
      data: parsed.error.flatten(),
    })
  }

  // Names must be unique within a bill (case-insensitive) — handoff requirement.
  const names = (parsed.data.participants ?? []).map((p) => p.name.trim().toLowerCase())
  if (new Set(names).size !== names.length) {
    throw createError({ statusCode: 400, statusMessage: 'Participant names must be unique' })
  }

  const repos = useRepositories(event)
  return await repos.bills.create(parsed.data)
})
