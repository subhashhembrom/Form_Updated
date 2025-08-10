import type { BaseValidation, FormField } from '../types';

export type ValidationErrors = Record<string, string | undefined>;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateValue(field: FormField, value: any): string | undefined {
  const v = field.validations || {} as BaseValidation;
  if (field.required || v.required) {
    if (value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0)) {
      return 'This field is required.';
    }
  }

  if (v.notEmpty && typeof value === 'string' && value.trim().length === 0) {
    return 'Value cannot be empty.';
  }

  if (typeof value === 'string') {
    if (v.minLength !== undefined && value.length < v.minLength) {
      return `Minimum length is ${v.minLength}.`;
    }
    if (v.maxLength !== undefined && value.length > v.maxLength) {
      return `Maximum length is ${v.maxLength}.`;
    }
    if (v.email && !emailRegex.test(value)) {
      return 'Please enter a valid email address.';
    }
    if (v.passwordRule) {
      const longEnough = value.length >= 8;
      const hasNumber = /\d/.test(value);
      if (!longEnough || !hasNumber) return 'Password must be ≥ 8 chars and include a number.';
    }
  }

  return undefined;
}

export function validateAll(fields: FormField[], values: Record<string, any>): ValidationErrors {
  const errs: ValidationErrors = {};
  for (const f of fields) {
    // Skip validation on derived (read-only) fields
    if (f.derived?.isDerived) continue;
    errs[f.id] = validateValue(f, values[f.id]);
  }
  return errs;
}

export function isValid(errors: ValidationErrors): boolean {
  return Object.values(errors).every(e => !e);
}
