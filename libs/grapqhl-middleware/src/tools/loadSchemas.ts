export async function loadSchemas(paths: string[]): Promise<{ defs: any }> {
  const schemas = await Promise.all(paths.map((path) => import(path)));
  const defs = schemas.map((s) => s.typeDef);
  console.debug(defs);
  return { defs };
}
