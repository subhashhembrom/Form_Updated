import { useEffect, useMemo, useState } from 'react';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import type { FormField, FormSchema } from '../../types';
import { recomputeAllDerived } from '../../utils/derived';
import { validateAll, validateValue, isValid } from '../../utils/validation';

interface Props { schema: FormSchema; onSubmit?: (values: Record<string, any>) => void; }

export default function FormRenderer({ schema, onSubmit }: Props) {
  const initialValues = useMemo(() => {
    const v: Record<string, any> = {};
    for (const f of schema.fields) v[f.id] = f.defaultValue ?? (f.kind === 'checkbox' ? false : '');
    return recomputeAllDerived(schema.fields, v);
  }, [schema]);

  const [values, setValues] = useState<Record<string, any>>(initialValues);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => { setValues(recomputeAllDerived(schema.fields, values));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schema.fields.map(f => `${f.id}:${f.derived?.formula || ''}`).join('|')]);

  function handleChange(field: FormField, raw: any) {
    const next = { ...values, [field.id]: raw };
    const recomputed = recomputeAllDerived(schema.fields, next);
    setValues(recomputed);
    setErrors(prev => ({ ...prev, [field.id]: validateValue(field, raw) }));
  }

  function handleSubmit() {
    const errs = validateAll(schema.fields, values);
    setErrors(errs);
    setSubmitted(true);
    if (isValid(errs)) onSubmit?.(values);
  }

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h6" gutterBottom>{schema.name}</Typography>
        <Grid container spacing={2}>
          {schema.fields.map(field => (
            <Grid size={{ xs: 12, md: 6 }} key={field.id}>
              {renderField(field, values[field.id], (v: any) => handleChange(field, v), errors[field.id])}
            </Grid>
          ))}
        </Grid>
        <Stack direction="row" justifyContent="flex-end" mt={3}>
          <Button variant="contained" onClick={handleSubmit}>Submit</Button>
        </Stack>
        {submitted && !isValid(errors) && (
          <Alert severity="error" sx={{ mt: 2 }}>Please fix the errors above and try again.</Alert>
        )}
      </CardContent>
    </Card>
  );
}

function renderField(field: FormField, value: any, onChange: (v: any) => void, error?: string) {
  const common = {
    label: field.label,
    fullWidth: true,
    helperText: error,
    error: Boolean(error),
    required: field.required,
    InputProps: field.derived?.isDerived ? { readOnly: true } : undefined,
  } as const;

  switch (field.kind) {
    case 'text':
      return <TextField {...common} value={value ?? ''} onChange={e => onChange(e.target.value)} />;
    case 'number':
      return <TextField {...common} type="number" value={value ?? ''} onChange={e => onChange(e.target.value === '' ? '' : Number(e.target.value))} />;
    case 'textarea':
      return <TextField {...common} multiline minRows={3} value={value ?? ''} onChange={e => onChange(e.target.value)} />;
    case 'select':
      return (
        <TextField {...common} select value={value ?? ''} onChange={e => onChange(e.target.value)}>
          {(field.options || []).map(opt => (<MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>))}
        </TextField>
      );
    case 'radio':
      return (
        <>
          <Typography variant="body2" sx={{ mb: .5 }}>{field.label}{field.required ? ' *' : ''}</Typography>
          <RadioGroup value={value ?? ''} onChange={(_, v) => onChange(v)}>
            {(field.options || []).map(opt => (
              <FormControlLabel key={opt.value} value={opt.value} control={<Radio />} label={opt.label} />
            ))}
          </RadioGroup>
          {error && <Typography color="error" variant="caption">{error}</Typography>}
        </>
      );
    case 'checkbox':
      return (
        <FormControlLabel control={<Checkbox checked={Boolean(value)} onChange={e => onChange(e.target.checked)} />} label={field.label} />
      );
    case 'date':
      return <TextField {...common} type="date" InputLabelProps={{ shrink: true }} value={value ?? ''} onChange={e => onChange(e.target.value)} />;
    default:
      return <div>Unsupported field</div>;
  }
}