import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import Container from '@mui/material/Container';
import TopBar from '../components/common/TopBar';
import FormRenderer from '../components/common/FormRenderer';
import { getSchemaById } from '../utils/storage';

export default function PreviewPage() {
  const { current, selectedPreviewId } = useSelector((s: RootState) => s.forms);
  const schema = useMemo(() => selectedPreviewId ? getSchemaById(selectedPreviewId) ?? current : current, [current, selectedPreviewId]);

  return (
    <>
      <TopBar />
      <Container sx={{ py: 3 }}>
        <FormRenderer schema={schema} onSubmit={(vals) => alert('Submitted! Check console.\n' + JSON.stringify(vals, null, 2))} />
      </Container>
    </>
  );
}