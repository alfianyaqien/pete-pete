import { updateBillInputSchema } from '../../../shared/schemas'

/** PATCH /api/bills/:id — update title and/or lunas (settled) flag. */
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  const patch = await readValidated(event, updateBillInputSchema)
  return await mutationResult(useRepositories(event).bills.update(id, patch))
})
