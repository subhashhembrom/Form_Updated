import { createSlice, nanoid } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { FormField, FormSchema } from '../types';
import { readAllSchemas, upsertSchema } from '../utils/storage';

interface FormsState {
  current: FormSchema; // the builder in progress
  saved: FormSchema[]; // cache of localStorage
  selectedPreviewId?: string; // for /preview when opened via /myforms
}

const emptySchema = (): FormSchema => ({ id: nanoid(), name: 'Untitled Form', createdAt: Date.now(), fields: [] });

const initialState: FormsState = {
  current: emptySchema(),
  saved: readAllSchemas(),
  selectedPreviewId: undefined,
};

const formsSlice = createSlice({
  name: 'forms',
  initialState,
  reducers: {
    resetCurrent(state) { state.current = emptySchema(); },
    setFormName(state, action: PayloadAction<string>) { state.current.name = action.payload; },
    addField(state, action: PayloadAction<Omit<FormField, 'id'>>) {
      state.current.fields.push({ id: nanoid(), ...action.payload });
    },
    updateField(state, action: PayloadAction<{ id: string; patch: Partial<FormField> }>) {
      const idx = state.current.fields.findIndex(f => f.id === action.payload.id);
      if (idx >= 0) state.current.fields[idx] = { ...state.current.fields[idx], ...action.payload.patch };
    },
    deleteField(state, action: PayloadAction<string>) {
      state.current.fields = state.current.fields.filter(f => f.id !== action.payload);
    },
    moveField(state, action: PayloadAction<{ id: string; direction: 'up' | 'down' }>) {
      const i = state.current.fields.findIndex(f => f.id === action.payload.id);
      if (i < 0) return;
      const j = action.payload.direction === 'up' ? i - 1 : i + 1;
      if (j < 0 || j >= state.current.fields.length) return;
      const arr = state.current.fields;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    },
    saveCurrent(state) {
      const schema: FormSchema = { ...state.current, createdAt: Date.now() };
      upsertSchema(schema);
      state.saved = readAllSchemas();
    },
    setSelectedPreviewId(state, action: PayloadAction<string | undefined>) {
      state.selectedPreviewId = action.payload;
    },
    loadSchemaIntoCurrent(state, action: PayloadAction<string>) {
      const s = readAllSchemas().find(x => x.id === action.payload);
      if (s) state.current = { ...s, id: nanoid(), createdAt: Date.now() }; // clone into new id
    },
  },
});

export const { resetCurrent, setFormName, addField, updateField, deleteField, moveField, saveCurrent, setSelectedPreviewId, loadSchemaIntoCurrent } = formsSlice.actions;
export default formsSlice.reducer;