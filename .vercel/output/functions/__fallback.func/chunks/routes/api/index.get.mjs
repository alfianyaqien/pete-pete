import { d as defineEventHandler } from '../../nitro/nitro.mjs';
import { u as useRepositories } from '../../_/repositories.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import '../../_/schemas.mjs';
import 'zod';
import '../../_/settle.mjs';
import '../../_/badges.mjs';
import '@supabase/supabase-js';

const index_get = defineEventHandler(async (event) => {
  return await useRepositories(event).bills.list();
});

export { index_get as default };
//# sourceMappingURL=index.get.mjs.map
