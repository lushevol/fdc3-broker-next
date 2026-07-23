import Box from '@mui/material/Box';
import React, { type ReactElement } from 'react';
import Container from '../Home/common/Container';
import {
  getOpenFinSingleViewHandoff,
  getSingleViewHandoff,
  SINGLE_VIEW_QUERY_PARAM,
  type SingleViewHandoff,
} from '../Home/common/singleView';

const SingleView: React.FC = (): ReactElement => {
  const handoffId = new URLSearchParams(window.location.search).get(SINGLE_VIEW_QUERY_PARAM);
  const storedHandoff = React.useMemo(() => getSingleViewHandoff(handoffId), [handoffId]);
  const [handoff, setHandoff] = React.useState<SingleViewHandoff | null>(storedHandoff);
  const [resolved, setResolved] = React.useState(Boolean(storedHandoff));

  React.useEffect(() => {
    if (storedHandoff) {
      setHandoff(storedHandoff);
      setResolved(true);
      return;
    }

    void getOpenFinSingleViewHandoff().then((openFinHandoff) => {
      setHandoff(openFinHandoff);
      setResolved(true);
    });
  }, [storedHandoff]);

  if (!resolved) return <Box data-testid="single-view-loading" sx={{ height: '100vh' }} />;

  if (!handoff) {
    return <Box role="alert">This single-view tile is unavailable.</Box>;
  }

  return (
    <Box data-testid="single-view" sx={{ height: '100vh', overflow: 'hidden' }}>
      <Container {...handoff.container} />
    </Box>
  );
};

export default SingleView;
