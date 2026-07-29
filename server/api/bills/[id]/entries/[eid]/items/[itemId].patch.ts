import { itemClaimInputSchema } from '../../../../../../../shared/schemas'

/** PATCH /api/bills/:id/entries/:eid/items/:itemId — claim/unclaim one item. */
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  const eid = getRouterParam(event, 'eid')!
  const itemId = getRouterParam(event, 'itemId')!
  const { participantId, claimed } = await readValidated(event, itemClaimInputSchema)
  return await mutationResult(
    useRepositories(event).bills.claimItem(id, eid, itemId, participantId, claimed),
  )
})
