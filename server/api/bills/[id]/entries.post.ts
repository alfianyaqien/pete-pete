import { entryInputSchema } from '../../../../shared/schemas'

/** POST /api/bills/:id/entries - add an expense (simple or shared order). */
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  const input = await readValidated(event, entryInputSchema)
  return await mutationResult(useRepositories(event).bills.addEntry(id, input))
})
