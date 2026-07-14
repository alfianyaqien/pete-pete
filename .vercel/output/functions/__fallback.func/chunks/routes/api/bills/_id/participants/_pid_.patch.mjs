import { d as defineEventHandler, g as getRouterParam } from '../../../../../nitro/nitro.mjs';
import { r as readValidated, m as mutationResult } from '../../../../../_/validation.mjs';
import { u as useRepositories } from '../../../../../_/repositories.mjs';
import { a as participantPatchSchema } from '../../../../../_/schemas.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import '../../../../../_/settle.mjs';
import '../../../../../_/badges.mjs';
import '@supabase/supabase-js';
import 'zod';

const _pid__patch = defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  const pid = getRouterParam(event, "pid");
  const patch = await readValidated(event, participantPatchSchema);
  return await mutationResult(useRepositories(event).bills.updateParticipant(id, pid, patch));
});

export { _pid__patch as default };
//# sourceMappingURL=_pid_.patch.mjs.map
