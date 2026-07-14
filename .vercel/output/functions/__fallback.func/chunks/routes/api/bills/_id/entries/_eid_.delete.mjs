import { d as defineEventHandler, g as getRouterParam } from '../../../../../nitro/nitro.mjs';
import { m as mutationResult } from '../../../../../_/validation.mjs';
import { u as useRepositories } from '../../../../../_/repositories.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import '../../../../../_/schemas.mjs';
import 'zod';
import '../../../../../_/settle.mjs';
import '../../../../../_/badges.mjs';
import '@supabase/supabase-js';

const _eid__delete = defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  const eid = getRouterParam(event, "eid");
  return await mutationResult(useRepositories(event).bills.removeEntry(id, eid));
});

export { _eid__delete as default };
//# sourceMappingURL=_eid_.delete.mjs.map
