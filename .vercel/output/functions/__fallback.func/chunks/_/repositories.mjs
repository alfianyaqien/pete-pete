import { u as useRuntimeConfig, c as createError } from '../nitro/nitro.mjs';
import { b as billSchema } from './schemas.mjs';
import { s as splitProportional } from './settle.mjs';
import { n as nextBadge } from './badges.mjs';
import { randomUUID } from 'node:crypto';
import { createClient } from '@supabase/supabase-js';

function uid() {
  const c = globalThis.crypto;
  return (c == null ? void 0 : c.randomUUID) ? c.randomUUID() : "id-" + Math.random().toString(36).slice(2, 11);
}
const norm = (s) => s.trim().toLowerCase();
function addParticipant(bill, input) {
  if (bill.participants.some((p) => norm(p.name) === norm(input.name))) {
    throw new Error("Participant names must be unique");
  }
  const taken = bill.participants.map((p) => p.badgeKey);
  const badgeKey = input.badgeKey && !taken.includes(input.badgeKey) ? input.badgeKey : nextBadge(taken);
  return {
    ...bill,
    participants: [...bill.participants, { id: uid(), name: input.name.trim(), badgeKey }]
  };
}
function updateParticipant(bill, pid, patch) {
  if (patch.name !== void 0 && bill.participants.some((p) => p.id !== pid && norm(p.name) === norm(patch.name))) {
    throw new Error("Participant names must be unique");
  }
  return {
    ...bill,
    participants: bill.participants.map(
      (p) => p.id === pid ? {
        ...p,
        ...patch.name !== void 0 ? { name: patch.name.trim() } : {},
        ...patch.badgeKey !== void 0 ? { badgeKey: patch.badgeKey } : {}
      } : p
    )
  };
}
function removeParticipant(bill, pid) {
  const participants = bill.participants.filter((p) => p.id !== pid);
  const entries = bill.entries.map((e) => stripParticipant(e, pid)).filter((e) => e !== null);
  return { ...bill, participants, entries };
}
function stripParticipant(entry, pid) {
  return entry.type === "simple" ? stripFromSimple(entry, pid) : stripFromShared(entry, pid);
}
function equalShares(amount, ids) {
  const parts = splitProportional(amount, ids.map(() => 1));
  return ids.map((participantId, i) => ({ participantId, share: parts[i] }));
}
function stripFromSimple(e, pid) {
  let sharers = e.sharers.filter((s) => s.participantId !== pid);
  if (sharers.length === 0) return null;
  sharers = e.shareMethod === "equally" ? equalShares(e.amount, sharers.map((s) => s.participantId)) : rebalance(e.amount, sharers, (s) => s.share, (s, v) => ({ ...s, share: v }));
  let payers = e.payers.filter((p) => p.participantId !== pid);
  payers = payers.length === 0 ? [{ participantId: sharers[0].participantId, amount: e.amount }] : rebalance(e.amount, payers, (p) => p.amount, (p, v) => ({ ...p, amount: v }));
  return { ...e, sharers, payers };
}
function stripFromShared(e, pid) {
  const items = e.items.map((it) => ({ ...it, orderedBy: it.orderedBy.filter((x) => x !== pid) })).filter((it) => it.orderedBy.length > 0);
  if (items.length === 0) return null;
  const payerId = e.payerId === pid ? items[0].orderedBy[0] : e.payerId;
  return { ...e, items, payerId };
}
function rebalance(total, rows, get, set) {
  const parts = splitProportional(total, rows.map(get));
  return rows.map((r, i) => set(r, parts[i]));
}
function materializeEntry(input, id) {
  if (input.type === "simple") {
    return { ...input, id };
  }
  return { ...input, id, items: input.items.map((it) => ({ ...it, id: uid() })) };
}
function addEntry(bill, input) {
  return { ...bill, entries: [...bill.entries, materializeEntry(input, uid())] };
}
function updateEntry(bill, entryId, input) {
  return {
    ...bill,
    entries: bill.entries.map((e) => e.id === entryId ? materializeEntry(input, entryId) : e)
  };
}
function removeEntry(bill, entryId) {
  return { ...bill, entries: bill.entries.filter((e) => e.id !== entryId) };
}

function buildBill(input) {
  var _a;
  const taken = [];
  const participants = ((_a = input.participants) != null ? _a : []).map((p) => {
    const badgeKey = p.badgeKey && !taken.includes(p.badgeKey) ? p.badgeKey : nextBadge(taken);
    taken.push(badgeKey);
    return { id: randomUUID(), name: p.name, badgeKey };
  });
  return {
    id: randomUUID(),
    title: input.title,
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    participants,
    entries: [],
    lunas: false
  };
}

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, key + "" , value);
const TABLE = "bills";
function mapRow(row) {
  var _a, _b, _c;
  return billSchema.parse({
    id: row.id,
    title: row.title,
    createdAt: row.created_at,
    participants: (_a = row.participants) != null ? _a : [],
    entries: (_b = row.entries) != null ? _b : [],
    lunas: (_c = row.lunas) != null ? _c : false
  });
}
class SupabaseBillRepository {
  constructor(sb) {
    __publicField(this, "sb", sb);
  }
  async list() {
    const { data, error } = await this.sb.from(TABLE).select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return (data != null ? data : []).map(mapRow);
  }
  async create(input) {
    const bill = buildBill(input);
    const { data, error } = await this.sb.from(TABLE).insert(toRow(bill)).select().single();
    if (error) throw error;
    return mapRow(data);
  }
  async get(id) {
    const { data, error } = await this.sb.from(TABLE).select("*").eq("id", id).maybeSingle();
    if (error) throw error;
    return data ? mapRow(data) : null;
  }
  async update(id, patch) {
    const upd = {};
    if (patch.title !== void 0) upd.title = patch.title;
    if (patch.lunas !== void 0) upd.lunas = patch.lunas;
    const { data, error } = await this.sb.from(TABLE).update(upd).eq("id", id).select().maybeSingle();
    if (error) throw error;
    return data ? mapRow(data) : null;
  }
  // Mutations are read-modify-write: apply the shared pure operation, then
  // persist the participants/entries JSONB.
  async mutate(id, fn) {
    const current = await this.get(id);
    if (!current) return null;
    const next = fn(current);
    const { data, error } = await this.sb.from(TABLE).update({ title: next.title, lunas: next.lunas, participants: next.participants, entries: next.entries }).eq("id", id).select().maybeSingle();
    if (error) throw error;
    return data ? mapRow(data) : null;
  }
  addParticipant(id, input) {
    return this.mutate(id, (b) => addParticipant(b, input));
  }
  updateParticipant(id, pid, patch) {
    return this.mutate(id, (b) => updateParticipant(b, pid, patch));
  }
  removeParticipant(id, pid) {
    return this.mutate(id, (b) => removeParticipant(b, pid));
  }
  addEntry(id, input) {
    return this.mutate(id, (b) => addEntry(b, input));
  }
  updateEntry(id, entryId, input) {
    return this.mutate(id, (b) => updateEntry(b, entryId, input));
  }
  removeEntry(id, entryId) {
    return this.mutate(id, (b) => removeEntry(b, entryId));
  }
}
function toRow(bill) {
  return {
    id: bill.id,
    title: bill.title,
    created_at: bill.createdAt,
    participants: bill.participants,
    entries: bill.entries,
    lunas: bill.lunas
  };
}

const store = /* @__PURE__ */ new Map();
class MemoryBillRepository {
  async list() {
    return [...store.values()].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
  async create(input) {
    const bill = buildBill(input);
    store.set(bill.id, bill);
    return bill;
  }
  async get(id) {
    var _a;
    return (_a = store.get(id)) != null ? _a : null;
  }
  mutate(id, fn) {
    const existing = store.get(id);
    if (!existing) return null;
    const updated = fn(existing);
    store.set(id, updated);
    return updated;
  }
  async update(id, patch) {
    return this.mutate(id, (b) => ({
      ...b,
      ...patch.title !== void 0 ? { title: patch.title } : {},
      ...patch.lunas !== void 0 ? { lunas: patch.lunas } : {}
    }));
  }
  async addParticipant(id, input) {
    return this.mutate(id, (b) => addParticipant(b, input));
  }
  async updateParticipant(id, pid, patch) {
    return this.mutate(id, (b) => updateParticipant(b, pid, patch));
  }
  async removeParticipant(id, pid) {
    return this.mutate(id, (b) => removeParticipant(b, pid));
  }
  async addEntry(id, input) {
    return this.mutate(id, (b) => addEntry(b, input));
  }
  async updateEntry(id, entryId, input) {
    return this.mutate(id, (b) => updateEntry(b, entryId, input));
  }
  async removeEntry(id, entryId) {
    return this.mutate(id, (b) => removeEntry(b, entryId));
  }
}

let client = null;
function useSupabase(event) {
  const cfg = useRuntimeConfig(event);
  const url = cfg.supabaseUrl;
  const key = cfg.supabaseServiceKey;
  if (!url || !key) {
    throw createError({ statusCode: 500, statusMessage: "Supabase is not configured" });
  }
  if (!client) {
    client = createClient(url, key, { auth: { persistSession: false } });
  }
  return client;
}

let memoryRepos = null;
function useRepositories(event) {
  const cfg = useRuntimeConfig(event);
  if (cfg.supabaseUrl && cfg.supabaseServiceKey) {
    const sb = useSupabase(event);
    return { bills: new SupabaseBillRepository(sb) };
  }
  if (!memoryRepos) memoryRepos = { bills: new MemoryBillRepository() };
  return memoryRepos;
}

export { useRepositories as u };
//# sourceMappingURL=repositories.mjs.map
