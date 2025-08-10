import type { FormField } from '../../types';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

interface Props {
  fields: FormField[];
  onMove: (id: string, dir: 'up' | 'down') => void;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}

export default function FieldList({ fields, onMove, onDelete, onEdit }: Props) {
  return (
    <List dense>
      {fields.map((f, idx) => (
        <ListItem key={f.id} secondaryAction={
          <>
            <IconButton edge="end" onClick={() => onEdit(f.id)}><EditIcon /></IconButton>
            <IconButton edge="end" onClick={() => onMove(f.id, 'up')} disabled={idx===0}><ArrowUpwardIcon /></IconButton>
            <IconButton edge="end" onClick={() => onMove(f.id, 'down')} disabled={idx===fields.length-1}><ArrowDownwardIcon /></IconButton>
            <IconButton edge="end" onClick={() => onDelete(f.id)}><DeleteIcon /></IconButton>
          </>
        }>
          <ListItemText primary={f.label} secondary={`${f.kind}${f.derived?.isDerived ? ' • derived' : ''}`} />
        </ListItem>
      ))}
    </List>
  );
}