import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { addField, moveField, updateField, deleteField, saveCurrent, setFormName } from '../store/formsSlice';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import FieldEditor from '../components/builder/FieldEditor';
import FieldList from '../components/builder/FieldList';
import DerivedFieldEditor from '../components/builder/DerivedFieldEditor';
import TopBar from '../components/common/TopBar';
import type { FormField } from '../types';
import type { RootState } from '../store';

export default function CreateFormPage() {
  const dispatch = useDispatch();
  const schema = useSelector((s: RootState) => s.forms.current);
  const [editingId, setEditingId] = useState<string | undefined>();
  const [nameDialog, setNameDialog] = useState(false);

  const editingField = schema.fields.find(f => f.id === editingId);

  function openAdd() { setEditingId(undefined); }

  function saveField(patch: Omit<FormField, 'id'>) {
    if (editingId) dispatch(updateField({ id: editingId, patch }));
    else dispatch(addField(patch));
    setEditingId(undefined);
  }

  return (
    <>
      <TopBar />
      <Container sx={{ py: 3 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card variant="outlined"><CardContent>
              <Stack spacing={2}>
                <Typography variant="h6">Form Details</Typography>
                <TextField label="Form Name" value={schema.name} onChange={e => dispatch(setFormName(e.target.value))} />
                <Button variant="outlined" onClick={() => openAdd()}>Add Field</Button>
                {editingId !== undefined ? (
                  <FieldEditor field={editingField} onSave={saveField} />
                ) : (
                  <FieldEditor onSave={saveField} />
                )}
              </Stack>
            </CardContent></Card>
          </Grid>
          <Grid size={{ xs: 12, md: 8 }}>
            <Card variant="outlined"><CardContent>
              <Stack spacing={2}>
                <Typography variant="h6">Fields</Typography>
                <FieldList
                  fields={schema.fields}
                  onMove={(id, dir) => dispatch(moveField({ id, direction: dir }))}
                  onDelete={(id) => dispatch(deleteField(id))}
                  onEdit={(id) => setEditingId(id)}
                />
                {editingField && (
                  <Card variant="outlined"><CardContent>
                    <DerivedFieldEditor field={editingField} allFields={schema.fields} onChange={(patch) => dispatch(updateField({ id: editingField.id, patch }))} />
                  </CardContent></Card>
                )}
                <Stack direction="row" justifyContent="flex-end">
                  <Button variant="contained" onClick={() => setNameDialog(true)}>Save Form</Button>
                </Stack>
              </Stack>
            </CardContent></Card>
          </Grid>
        </Grid>
      </Container>

      <Dialog open={nameDialog} onClose={() => setNameDialog(false)}>
        <DialogTitle>Save Form</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>Give your form a name to save in your browser.</Typography>
          <TextField autoFocus fullWidth label="Form Name" value={schema.name} onChange={e => dispatch(setFormName(e.target.value))} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNameDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => { dispatch(saveCurrent()); setNameDialog(false); }}>Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}