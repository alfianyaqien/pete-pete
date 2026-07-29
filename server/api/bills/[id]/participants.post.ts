import { participantInputSchema } from '../../../../shared/schemas'

/** POST /api/bills/:id/participants - add a soul to the trip. */
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  const input = await readValidated(event, participantInputSchema)
  return await mutationResult(useRepositories(event).bills.addParticipant(id, input))
})
