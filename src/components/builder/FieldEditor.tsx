import { useState } from 'react';
import type { FormField, FieldKind, FieldOption } from '../../types';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';

interface Props {
  field?: FormField; // if present, edit mode; otherwise create mode
  onSave: (patch: Omit<FormField, 'id'>) => void;
}

export default function FieldEditor({ field, onSave }: Props) {
  const [kind, setKind] = useState<FieldKind>(field?.kind || 'text');
  const [label, setLabel] = useState(field?.label || '');
  const [required, setRequired] = useState<boolean>(Boolean(field?.required));
  const [defaultValue, setDefaultValue] = useState<any>(field?.defaultValue ?? (kind === 'checkbox' ? false : ''));
  const [validations, setValidations] = useState<any>(field?.validations || {});
  const [options, setOptions] = useState<FieldOption[]>(field?.options || []);

  function handleSave() {
    onSave({ kind, label, required, defaultValue, validations, options, derived: field?.derived });
  }

  return (
    <Stack spacing={2}>
      <Typography variant="subtitle1">Field Settings</Typography>
      <TextField select label="Type" value={kind} onChange={e => setKind(e.target.value as FieldKind)}>
  {['text','number','textarea','select','radio','checkbox','date'].map(k => (
    <MenuItem key={k} value={k}>{k}</MenuItem>   // ✅
  ))}
</TextField>
      <TextField label="Label" value={label} onChange={e => setLabel(e.target.value)} fullWidth />
      <FormControlLabel control={<Checkbox checked={required} onChange={e => setRequired(e.target.checked)} />} label="Required" />
      <TextField label="Default Value" value={defaultValue as any} onChange={e => setDefaultValue(e.target.value)} fullWidth />

      <Divider />
      <Typography variant="subtitle2">Validation Rules</Typography>
      <Stack direction="row" spacing={2}>
        <FormControlLabel control={<Checkbox checked={Boolean(validations?.notEmpty)} onChange={e => setValidations((v: any) => ({...v, notEmpty: e.target.checked}))} />} label="Not empty" />
        <FormControlLabel control={<Checkbox checked={Boolean(validations?.email)} onChange={e => setValidations((v: any) => ({...v, email: e.target.checked}))} />} label="Email format" />
        <FormControlLabel control={<Checkbox checked={Boolean(validations?.passwordRule)} onChange={e => setValidations((v: any) => ({...v, passwordRule: e.target.checked}))} />} label="Password rule" />
      </Stack>
      <Stack direction="row" spacing={2}>
        <TextField type="number" label="Min length" value={validations?.minLength || ''} onChange={e => setValidations((v: any) => ({...v, minLength: e.target.value === '' ? undefined : Number(e.target.value)}))} />
        <TextField type="number" label="Max length" value={validations?.maxLength || ''} onChange={e => setValidations((v: any) => ({...v, maxLength: e.target.value === '' ? undefined : Number(e.target.value)}))} />
      </Stack>

      {(kind === 'select' || kind === 'radio') && (
        <Stack spacing={1}>
          <Typography variant="subtitle2">Options</Typography>
          {options.map((opt, idx) => (
            <Stack direction="row" spacing={1} key={idx}>
              <TextField label="Label" value={opt.label} onChange={e => setOptions(prev => prev.map((o,i) => i===idx? {...o, label: e.target.value}: o))} />
              <TextField label="Value" value={opt.value} onChange={e => setOptions(prev => prev.map((o,i) => i===idx? {...o, value: e.target.value}: o))} />
            </Stack>
          ))}
          <Button variant="outlined" onClick={() => setOptions(prev => [...prev, { label: '', value: '' }])}>Add Option</Button>
        </Stack>
      )}

      <Stack direction="row" spacing={1}>
        <Button variant="contained" onClick={handleSave}>Save Field</Button>
      </Stack>
    </Stack>
  );
}
