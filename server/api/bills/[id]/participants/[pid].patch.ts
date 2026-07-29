import { participantPatchSchema } from '../../../../../shared/schemas'

/** PATCH /api/bills/:id/participants/:pid - rename / change trail badge. */
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  const pid = getRouterParam(event, 'pid')!
  const patch = await readValidated(event, participantPatchSchema)
  return await mutationResult(useRepositories(event).bills.updateParticipant(id, pid, patch))
})
