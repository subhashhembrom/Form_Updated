import type { FormSchema } from "../types";

const KEY = 'form_builder_schemas_v1';

export function readAllSchemas(): FormSchema[] {
  const raw = localStorage.getItem(KEY);
  if (!raw) return [];
  try { return JSON.parse(raw) as FormSchema[]; } catch { return []; }
}

export function writeAllSchemas(schemas: FormSchema[]) {
  localStorage.setItem(KEY, JSON.stringify(schemas));
}

export function upsertSchema(schema: FormSchema) {
  const all = readAllSchemas();
  const idx = all.findIndex(s => s.id === schema.id);
  if (idx >= 0) all[idx] = schema; else all.push(schema);
  writeAllSchemas(all);
}

export function getSchemaById(id: string): FormSchema | undefined {
  return readAllSchemas().find(s => s.id === id);
}