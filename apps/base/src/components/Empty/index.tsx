import CallMadeIcon from '@mui/icons-material/CallMade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import React, { type ReactElement } from 'react';
import useAnalytics from '../../analytics';
import type { AnalyticsData } from '../../analytics/model';
import useDispatcher from '../../hooks/dispathcer';
import Root, { classes, PREFIX } from './common/style';

const analyticsData: AnalyticsData = { container: 'Base', tile: 'home' };

const Empty: React.FC = (): ReactElement => {
  const { dispacthDrawer, dispacthLoading } = useDispatcher();
  const { ButtonEvent } = useAnalytics();
  React.useEffect(() => {
    dispacthLoading(false);
  }, []);
  const onClick = () => {
    dispacthDrawer(true);
    ButtonEvent('click', {
      name: 'find tile',
      value: 'true',
      ...analyticsData,
    });
  };
  return (
    <Root data-testid={`${PREFIX}`}>
      <div className={classes.div}>
        <section className={classes.content}>
          <div className={classes.bg} />
          <Typography variant="body1" gutterBottom>
            Start customizing your workspace
          </Typography>
          <Typography variant="body2" gutterBottom>
            find out what workspace preference options you have and how those options work.
          </Typography>
          <Button
            variant="outlined"
            endIcon={<CallMadeIcon />}
            className={classes.button}
            onClick={onClick}
            size="large"
            data-testid={`${PREFIX}_Find_tile`}
          >
            Find tile
          </Button>
        </section>
      </div>
    </Root>
  );
};

export default React.memo(Empty);
