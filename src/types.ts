export type FieldKind = 'text' | 'number' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'date';

export interface BaseValidation {
  required?: boolean;
  notEmpty?: boolean; 
  minLength?: number;
  maxLength?: number;
  email?: boolean;
  passwordRule?: boolean; // min 8 & must contain a number
}

export interface DerivedConfig {
  isDerived: boolean;
  parentIds: string[]; // IDs of parent fields
  // Expression uses `values` object. Example: "Math.floor((Date.now() - new Date(values.dob))/31557600000)"
  formula?: string;
}

export interface FieldOption { label: string; value: string; }

export interface FormField {
  id: string;
  kind: FieldKind;
  label: string;
  required?: boolean; // quick toggle mirrors validations.required
  defaultValue?: any;
  options?: FieldOption[]; // for select/radio/checkbox
  validations?: BaseValidation;
  derived?: DerivedConfig; // if isDerived=true, field is read-only and computed
}

export interface FormSchema {
  id: string; // stable id for schema
  name: string; // human friendly name
  createdAt: number; // epoch
  fields: FormField[];
}