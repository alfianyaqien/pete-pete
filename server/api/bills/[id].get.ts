/** GET /api/bills/:id — read an expedition by its share-link id. */
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Missing bill id' })

  const repos = useRepositories(event)
  const bill = await repos.bills.get(id)
  if (!bill) throw createError({ statusCode: 404, statusMessage: 'Bill not found' })
  return bill
})
