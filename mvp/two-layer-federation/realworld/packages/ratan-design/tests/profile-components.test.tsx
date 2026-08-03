import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import {
  Avatar,
  Card,
  DescriptionList,
  DesignSystemProvider,
  Disclosure,
  TagGroup,
} from '../src';

const appearance = {
  scheme: 'dark',
  density: 'comfortable',
  direction: 'ltr',
} as const;

describe('profile design-system components', () => {
  it('renders image and deterministic initial avatars', () => {
    render(
      <DesignSystemProvider appearance={appearance}>
        <Avatar name="Ada Lovelace" size="large" />
        <Avatar name="Grace Hopper" src="/grace.png" size="small" />
      </DesignSystemProvider>,
    );
    expect(screen.getByRole('img', { name: 'Ada Lovelace' })).toHaveTextContent('AL');
    expect(screen.getByRole('img', { name: 'Grace Hopper' }).querySelector('img'))
      .toHaveAttribute('src', '/grace.png');
  });

  it('composes cards, metadata, and role tags', () => {
    render(
      <DesignSystemProvider appearance={appearance}>
        <Card title="Operator profile" description="Identity metadata" actions={<span>Edit</span>}>
          <DescriptionList items={[
            { id: 'desk', term: 'Desk', description: 'Post trade' },
            { id: 'region', term: 'Region', description: 'Singapore' },
          ]} />
          <TagGroup
            label="Roles"
            tags={[
              { id: 'maker', label: 'Maker' },
              { id: 'reviewer', label: 'Reviewer' },
            ]}
          />
        </Card>
      </DesignSystemProvider>,
    );
    expect(screen.getByRole('heading', { name: 'Operator profile' })).toBeInTheDocument();
    expect(screen.getByText('Post trade')).toBeInTheDocument();
    expect(screen.getByLabelText('Roles')).toHaveTextContent('MakerReviewer');
  });

  it('expands and collapses disclosure content', async () => {
    const user = userEvent.setup();
    render(
      <DesignSystemProvider appearance={appearance}>
        <Disclosure title="Permissions">
          <p>Can approve limits</p>
        </Disclosure>
        <Disclosure title="Preferences" defaultExpanded>
          <p>Compact density</p>
        </Disclosure>
      </DesignSystemProvider>,
    );
    expect(screen.getByText('Can approve limits')).not.toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Permissions' }));
    expect(screen.getByText('Can approve limits')).toBeVisible();
    expect(screen.getByText('Compact density')).toBeInTheDocument();
  });

  it('supports unadorned card and empty metadata collections', () => {
    render(
      <DesignSystemProvider appearance={appearance}>
        <Card>Body only</Card>
        <DescriptionList items={[]} />
        <TagGroup label="No roles" tags={[]} />
      </DesignSystemProvider>,
    );
    expect(screen.getByText('Body only')).toBeInTheDocument();
    expect(screen.getByLabelText('No roles')).toBeInTheDocument();
  });
});
