/** DELETE /api/bills/:id/entries/:eid — remove an expense. */
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  const eid = getRouterParam(event, 'eid')!
  return await mutationResult(useRepositories(event).bills.removeEntry(id, eid))
})
