import { useMemo, useState } from 'react';
import type { FormField } from '../../types';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Typography from '@mui/material/Typography';

interface Props {
  field: FormField;
  allFields: FormField[];
  onChange: (patch: Partial<FormField>) => void;
}

export default function DerivedFieldEditor({ field, allFields, onChange }: Props) {
  const [isDerived, setIsDerived] = useState<boolean>(Boolean(field.derived?.isDerived));
  const [parentIds, setParentIds] = useState<string[]>(field.derived?.parentIds || []);
  const [formula, setFormula] = useState<string>(field.derived?.formula || '');

  const parentCandidates = useMemo(() => allFields.filter(f => f.id !== field.id), [allFields, field.id]);

  function toggleParent(id: string) {
    setParentIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }

  function persist() {
    onChange({ derived: { isDerived, parentIds, formula } });
  }

  return (
    <Stack spacing={1}>
      <Typography variant="subtitle2">Derived Field</Typography>
      <FormControlLabel control={<Checkbox checked={isDerived} onChange={e => { setIsDerived(e.target.checked); }} />} label="Mark as derived" />
      <Typography variant="body2">Select parent fields:</Typography>
      <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
        {parentCandidates.map(f => (
          <FormControlLabel key={f.id} control={<Checkbox checked={parentIds.includes(f.id)} onChange={() => toggleParent(f.id)} />} label={f.label} />
        ))}
      </Stack>
      <TextField label="Formula (use values.<fieldId>)" value={formula} onChange={e => setFormula(e.target.value)} fullWidth />
      <Typography variant="caption" color="text.secondary">Example (Age from DOB field id `dob`): <code>Math.floor((Date.now() - new Date(values.dob))/31557600000)</code></Typography>
      <Stack direction="row" spacing={1}>
        <button onClick={persist}>Apply</button>
      </Stack>
    </Stack>
  );
}