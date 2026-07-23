import { isSlug } from '../../../shared/slug'

/** GET /api/bills/:id — read a trip by its share-link id (slug). */
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  // Malformed link → 404 without a DB round-trip.
  if (!id || !isSlug(id)) throw createError({ statusCode: 404, statusMessage: 'Bill not found' })

  const repos = useRepositories(event)
  const bill = await repos.bills.get(id)
  if (!bill) throw createError({ statusCode: 404, statusMessage: 'Bill not found' })
  return bill
})
