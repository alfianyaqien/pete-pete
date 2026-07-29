/** DELETE /api/bills/:id/participants/:pid - remove a soul; re-balances every
 *  expense they were in. */
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  const pid = getRouterParam(event, 'pid')!
  return await mutationResult(useRepositories(event).bills.removeParticipant(id, pid))
})
