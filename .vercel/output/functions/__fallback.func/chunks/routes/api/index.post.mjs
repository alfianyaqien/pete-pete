import { d as defineEventHandler, r as readBody, c as createError } from '../../nitro/nitro.mjs';
import { u as useRepositories } from '../../_/repositories.mjs';
import { c as createBillInputSchema } from '../../_/schemas.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import '../../_/settle.mjs';
import '../../_/badges.mjs';
import '@supabase/supabase-js';
import 'zod';

const index_post = defineEventHandler(async (event) => {
  var _a;
  const body = await readBody(event);
  const parsed = createBillInputSchema.safeParse(body);
  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid bill",
      data: parsed.error.flatten()
    });
  }
  const names = ((_a = parsed.data.participants) != null ? _a : []).map((p) => p.name.trim().toLowerCase());
  if (new Set(names).size !== names.length) {
    throw createError({ statusCode: 400, statusMessage: "Participant names must be unique" });
  }
  const repos = useRepositories(event);
  return await repos.bills.create(parsed.data);
});

export { index_post as default };
//# sourceMappingURL=index.post.mjs.map
