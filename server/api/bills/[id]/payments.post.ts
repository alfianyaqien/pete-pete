import { paymentInputSchema } from '../../../../shared/schemas'

/** POST /api/bills/:id/payments - record a real transfer someone made to settle. */
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  const input = await readValidated(event, paymentInputSchema)
  return await mutationResult(useRepositories(event).bills.addPayment(id, input))
})
