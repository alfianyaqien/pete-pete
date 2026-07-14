import { d as defineEventHandler, g as getRouterParam } from '../../../../nitro/nitro.mjs';
import { r as readValidated, m as mutationResult } from '../../../../_/validation.mjs';
import { u as useRepositories } from '../../../../_/repositories.mjs';
import { e as entryInputSchema } from '../../../../_/schemas.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import '../../../../_/settle.mjs';
import '../../../../_/badges.mjs';
import '@supabase/supabase-js';
import 'zod';

const entries_post = defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  const input = await readValidated(event, entryInputSchema);
  return await mutationResult(useRepositories(event).bills.addEntry(id, input));
});

export { entries_post as default };
//# sourceMappingURL=entries.post.mjs.map
