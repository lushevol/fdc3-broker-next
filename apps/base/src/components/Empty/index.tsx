import React, { type ReactElement } from 'react';
import useAnalytics from '../../analytics';
import type { AnalyticsData } from '../../analytics/model';
import useDispatcher from '../../hooks/dispathcer';
import { useIsNewLayout } from '../../hooks/model/root';
import { ScButton } from '../webkit';
import { LayoutGrid, Plus } from 'lucide-react';

const analyticsData: AnalyticsData = { container: 'Base', tile: 'home' };

const Empty: React.FC = (): ReactElement => {
  const { dispacthDrawer, dispacthLoading } = useDispatcher();
  const { ButtonEvent } = useAnalytics();
  const isNewLayout = useIsNewLayout();

  React.useEffect(() => {
    dispacthLoading(false);
  }, [dispacthLoading]);

  const onClick = () => {
    dispacthDrawer(true);
    ButtonEvent('click', {
      name: 'find tile',
      value: 'true',
      ...analyticsData,
    });
  };

  if (!isNewLayout) {
    return (
      <section data-testid="empty">
        <p>Start customizing your workspace</p>
        <p>Find out what workspace preference options you have and how those options work.</p>
        <button type="button" onClick={onClick} data-testid="empty_Find_tile">Find tile</button>
      </section>
    );
  }

  return (
    <section className="base-webkit-scope empty-workspace" data-testid="empty">
      <div className="empty-workspace-status"><span aria-hidden="true" />Workspace ready</div>
      <div className="empty-workspace-content">
        <div className="empty-workspace-visual" aria-hidden="true">
          <LayoutGrid size={42} strokeWidth={1.35} />
          <span><Plus size={18} /></span>
        </div>
        <div className="empty-workspace-copy">
          <p className="empty-workspace-eyebrow">0 applications</p>
          <h2>Build your workspace</h2>
          <p>Choose an application from the Tile Library to begin this workspace.</p>
          <ScButton type="primary" noPill role="button" onClick={onClick} data-testid="empty_Find_tile">
            <Plus size={16} aria-hidden="true" />
            Browse Tile Library
          </ScButton>
        </div>
      </div>
    </section>
  );
};

export default React.memo(Empty);
