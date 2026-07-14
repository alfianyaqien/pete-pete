import { r as readBody, c as createError } from '../nitro/nitro.mjs';

async function readValidated(event, schema) {
  const body = await readBody(event);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid input",
      data: parsed.error.flatten()
    });
  }
  return parsed.data;
}
async function mutationResult(promise) {
  let result;
  try {
    result = await promise;
  } catch (e) {
    throw createError({
      statusCode: 400,
      statusMessage: e instanceof Error ? e.message : "Operation failed"
    });
  }
  if (result === null) throw createError({ statusCode: 404, statusMessage: "Bill not found" });
  return result;
}

export { mutationResult as m, readValidated as r };
//# sourceMappingURL=validation.mjs.map
