import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../store';
import { setSelectedPreviewId } from '../store/formsSlice';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import TopBar from '../components/common/TopBar';
import { readAllSchemas } from '../utils/storage';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { useNavigate } from 'react-router-dom';

export default function MyFormsPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const saved = useSelector((s: RootState) => s.forms.saved);

  const list = saved.length ? saved : readAllSchemas();

  return (
    <>
      <TopBar />
      <Container sx={{ py: 3 }}>
        <Grid container spacing={2}>
          {list.map(s => (
            <Grid key={s.id} size={{ xs: 12, md: 6 }}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle1" fontWeight={600}>{s.name}</Typography>
                  <Typography variant="body2" color="text.secondary">Created on {new Date(s.createdAt).toLocaleString()}</Typography>
                  <Stack direction="row" spacing={1} mt={2}>
                    <Button variant="outlined" onClick={() => { dispatch(setSelectedPreviewId(s.id)); navigate('/preview'); }}>Open</Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
}
