import { d as defineEventHandler, g as getRouterParam, c as createError } from '../../../nitro/nitro.mjs';
import { u as useRepositories } from '../../../_/repositories.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import '../../../_/schemas.mjs';
import 'zod';
import '../../../_/settle.mjs';
import '../../../_/badges.mjs';
import '@supabase/supabase-js';

const _id__get = defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  if (!id) throw createError({ statusCode: 400, statusMessage: "Missing bill id" });
  const repos = useRepositories(event);
  const bill = await repos.bills.get(id);
  if (!bill) throw createError({ statusCode: 404, statusMessage: "Bill not found" });
  return bill;
});

export { _id__get as default };
//# sourceMappingURL=_id_.get.mjs.map
