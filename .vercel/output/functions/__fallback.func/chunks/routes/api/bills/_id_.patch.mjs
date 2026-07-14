import { d as defineEventHandler, g as getRouterParam } from '../../../nitro/nitro.mjs';
import { r as readValidated, m as mutationResult } from '../../../_/validation.mjs';
import { u as useRepositories } from '../../../_/repositories.mjs';
import { u as updateBillInputSchema } from '../../../_/schemas.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import '../../../_/settle.mjs';
import '../../../_/badges.mjs';
import '@supabase/supabase-js';
import 'zod';

const _id__patch = defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  const patch = await readValidated(event, updateBillInputSchema);
  return await mutationResult(useRepositories(event).bills.update(id, patch));
});

export { _id__patch as default };
//# sourceMappingURL=_id_.patch.mjs.map
