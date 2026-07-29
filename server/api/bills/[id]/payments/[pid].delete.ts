/** DELETE /api/bills/:id/payments/:pid - void a recorded settlement payment. */
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  const pid = getRouterParam(event, 'pid')!
  return await mutationResult(useRepositories(event).bills.removePayment(id, pid))
})
