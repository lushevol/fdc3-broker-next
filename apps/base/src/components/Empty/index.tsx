import React, { type ReactElement } from 'react';
import useAnalytics from '../../analytics';
import type { AnalyticsData } from '../../analytics/model';
import useDispatcher from '../../hooks/dispathcer';
import { useIsNewLayout } from '../../hooks/model/root';
import { ScButton, ScParagraph, ScTitle } from '../webkit';

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
      <span className="empty-workspace-mark" aria-hidden="true">
        +
      </span>
      <ScTitle level={2}>Your workspace is empty</ScTitle>
      <ScParagraph>Browse the Tile Library to add an application to this workspace.</ScParagraph>
      <ScButton type="primary" role="button" onClick={onClick} data-testid="empty_Find_tile">
        Browse Tile Library
      </ScButton>
    </section>
  );
};

export default React.memo(Empty);
