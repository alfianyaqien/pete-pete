/** GET /api/bills — list all expeditions (newest first). */
export default defineEventHandler(async (event) => {
  return await useRepositories(event).bills.list()
})
