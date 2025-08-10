import type { FormField } from '../types';
import { Parser } from 'expr-eval';

// Compute value of a derived field using expr-eval parser
export function computeDerivedValue(field: FormField, values: Record<string, any>) {
  const cfg = field.derived;
  if (!cfg?.isDerived || !cfg.formula) return undefined;
  try {
    const parser = new Parser({ operators: { in: false, assignment: false } });
    // Expose values.* to the expression. We re-map: values.name -> variable values_name
    // But expr-eval supports object members via dot in newer versions, to be safe we map manually.
    // We'll allow variables for each parent id: p_<id>
    const scope: Record<string, any> = {};
    for (const pid of cfg.parentIds) {
      scope[`p_${pid}`] = values[pid];
    }
    // Replace occurrences of values.<id> with p_<id>
    const normalized = cfg.formula.replace(/values\.([a-zA-Z0-9_-]+)/g, (_, id) => `p_${id}`);
    const expr = parser.parse(normalized);
    return expr.evaluate(scope);
  } catch (e) {
    return undefined; // fail silently; show as blank
  }
}

export function recomputeAllDerived(fields: FormField[], values: Record<string, any>) {
  const out: Record<string, any> = { ...values };
  // naive multi-pass to handle simple dependencies
  for (let pass = 0; pass < 3; pass++) {
    for (const f of fields) {
      if (f.derived?.isDerived) {
        const v = computeDerivedValue(f, out);
        if (v !== undefined) out[f.id] = v;
      }
    }
  }
  return out;
}