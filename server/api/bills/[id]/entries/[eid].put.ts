import { entryInputSchema } from '../../../../../shared/schemas'

/** PUT /api/bills/:id/entries/:eid - replace an expense. */
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  const eid = getRouterParam(event, 'eid')!
  const input = await readValidated(event, entryInputSchema)
  return await mutationResult(useRepositories(event).bills.updateEntry(id, eid, input))
})
