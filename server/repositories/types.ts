import type { Bill, CreateBillInput, UpdateBillInput, ParticipantInput, EntryInput } from '../../shared/types'
import type { ParticipantPatch } from '../../shared/operations'

/**
 * Storage-agnostic contract the API depends on. Swapping databases = providing
 * a new implementation of these interfaces; routes and frontend never change.
 * Mutations return the full updated Bill (or null if the bill doesn't exist).
 */
export interface BillRepository {
  // No list()/"all bills" method by design: the app has no login, so bills are
  // addressed only by their share-link id - there is no global collection to
  // enumerate (that would leak every device's bills to anyone).
  create(input: CreateBillInput): Promise<Bill>
  get(id: string): Promise<Bill | null>
  update(id: string, patch: UpdateBillInput): Promise<Bill | null>

  addParticipant(billId: string, input: ParticipantInput): Promise<Bill | null>
  updateParticipant(billId: string, participantId: string, patch: ParticipantPatch): Promise<Bill | null>
  removeParticipant(billId: string, participantId: string): Promise<Bill | null>

  addEntry(billId: string, input: EntryInput): Promise<Bill | null>
  updateEntry(billId: string, entryId: string, input: EntryInput): Promise<Bill | null>
  removeEntry(billId: string, entryId: string): Promise<Bill | null>

  claimItem(
    billId: string,
    entryId: string,
    itemId: string,
    participantId: string,
    claimed: boolean,
  ): Promise<Bill | null>
}

export interface Repositories {
  bills: BillRepository
}
