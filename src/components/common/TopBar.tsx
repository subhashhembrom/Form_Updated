import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Link as RouterLink } from 'react-router-dom';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';

export default function TopBar() {
  return (
    <AppBar position="static" color="transparent" elevation={0}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6" fontWeight={700}>Form Builder</Typography>
        <Stack direction="row" spacing={2}>
          <Link component={RouterLink} to="/create" underline="none">Create</Link>
          <Link component={RouterLink} to="/preview" underline="none">Preview</Link>
          <Link component={RouterLink} to="/myforms" underline="none">My Forms</Link>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}