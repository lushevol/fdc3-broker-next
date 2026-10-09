import React, { ReactElement } from 'react';
import { EmptyState, Button } from 'ratan-design-origin';
import { CallMade as CallMadeIcon } from 'ratan-design-origin/icons';
import Root, { classes, PREFIX } from '../../components/Empty/common/style';
import useDispatcher from '../../hooks/dispathcer';
import useAnalytics from '../../analytics';
import { AnalyticsData } from '../../analytics/model';
import { useContext } from '../../hooks/provider';
import PrototypeEmptyWorkspace from '../empty-workspace';
const analyticsData: AnalyticsData = { container: 'Base', tile: 'home' };

const Empty: React.FC = (): ReactElement => {
  const [store] = useContext();
  const { dispacthDrawer, dispacthLoading } = useDispatcher();
  const { ButtonEvent } = useAnalytics();
  const completeInitialLoading = React.useRef(dispacthLoading);
  React.useEffect(() => {
    completeInitialLoading.current(false);
  }, []);
  const onClick = () => {
    dispacthDrawer(true);
    ButtonEvent('click', {
      name: 'find tile',
      value: 'true',
      ...analyticsData,
    });
  };
  if (store.newStyles) {
    return <PrototypeEmptyWorkspace onFindTile={onClick} />;
  }
  return (
    <EmptyState
      component={Root}
      data-testid={`${PREFIX}`}
      wrapperProps={{ className: classes.div }}
      contentProps={{ className: classes.content }}
      illustration={<div className={classes.bg} />}
      title="Start customizing your workspace"
      description="find out what workspace preference options you have and how those options work."
      action={
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
      }
    />
  );
};

export default React.memo(Empty);
