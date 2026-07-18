import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import type { PlatformClient } from '@fm/platform-sdk';
import type { RatanDataGridProps } from '@fm/ratan-data-grid';
import { AuthorizationLimits } from './AuthorizationLimits';
import { AUTHORIZATION_LIMITS_PERMISSIONS } from './authorization-limits-policy';
import {
  authorizationLimitFixtures,
  type AuthorizationLimitRecord,
  type AuthorizationLimitsRepository,
} from './authorization-limits-repository';
import {
  AuthorizationLimitsMutationError,
  type AuthorizationLimitsService,
} from './authorization-limits-service';

let latestGridProps: RatanDataGridProps<AuthorizationLimitRecord> | undefined;
jest.mock('@fm/ratan-data-grid', () => ({
  RatanDataGrid: (props: RatanDataGridProps<AuthorizationLimitRecord>) => {
    latestGridProps = props;
    if (props.loading) return <div role="status">Loading {props.ariaLabel}</div>;
    return <div data-testid="authorization-grid">{props.rows.length} grid rows</div>;
  },
}));

function client(): PlatformClient {
  return {
    navigate: jest.fn(),
    notify: jest.fn(),
    track: jest.fn(),
    closeCurrentWorkspace: jest.fn(),
    getAppearance: jest.fn() as PlatformClient['getAppearance'],
    subscribeToAppearance: jest.fn(),
  };
}

function repository(): AuthorizationLimitsRepository {
  return { list: jest.fn().mockResolvedValue(authorizationLimitFixtures) };
}

function service(overrides: Partial<AuthorizationLimitsService> = {}): AuthorizationLimitsService {
  const first = authorizationLimitFixtures[0];
  return {
    list: jest.fn().mockResolvedValue(authorizationLimitFixtures),
    create: jest.fn().mockResolvedValue(first),
    edit: jest.fn().mockResolvedValue(first),
    confirm: jest.fn().mockResolvedValue(first),
    reject: jest.fn().mockResolvedValue(first),
    remove: jest.fn().mockResolvedValue(first),
    ...overrides,
  };
}

const maker = {
  userId: 'maker-one',
  permissions: [
    AUTHORIZATION_LIMITS_PERMISSIONS.access,
    AUTHORIZATION_LIMITS_PERMISSIONS.initiate,
  ],
} as const;

describe('Authorization Limits opt-in create/edit cohort', () => {
  beforeEach(() => {
    latestGridProps = undefined;
  });

  it('remains read-only without a mutation capability and for a Visitor', async () => {
    const view = render(
      <AuthorizationLimits
        basePath="/cashflow"
        path="/cashflow/authorization-limits"
        client={client()}
        repository={repository()}
      />,
    );
    expect(await screen.findByTestId('authorization-grid')).toHaveTextContent('12 grid rows');
    expect(screen.queryByRole('button', { name: 'Create Authorization Limit' })).not.toBeInTheDocument();

    view.rerender(
      <AuthorizationLimits
        basePath="/cashflow"
        path="/cashflow/authorization-limits"
        client={client()}
        repository={repository()}
        mutation={{
          principal: {
            userId: 'visitor-one',
            permissions: [AUTHORIZATION_LIMITS_PERMISSIONS.access],
          },
          service: service(),
        }}
      />,
    );
    await waitFor(() => expect(latestGridProps?.loading).toBe(false));
    expect(screen.queryByRole('button', { name: 'Create Authorization Limit' })).not.toBeInTheDocument();
  });

  it('validates and submits create, then reconciles the returned record', async () => {
    const created: AuthorizationLimitRecord = {
      ...authorizationLimitFixtures[0],
      limitationId: 'LIM-NEW',
      profile: 'NEW-PROFILE',
      limitation: 42,
      status: 'ADD_PENDING',
    };
    const mutationService = service({ create: jest.fn().mockResolvedValue(created) });
    render(
      <AuthorizationLimits
        basePath="/cashflow"
        path="/cashflow/authorization-limits"
        client={client()}
        repository={repository()}
        mutation={{ principal: maker, service: mutationService }}
      />,
    );
    await screen.findByTestId('authorization-grid');
    fireEvent.click(screen.getByRole('button', { name: 'Create Authorization Limit' }));
    expect(screen.getByRole('dialog', { name: 'Create Authorization Limit' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Currency' })).toBeDisabled();

    fireEvent.change(screen.getByRole('spinbutton', { name: 'Limitation' }), {
      target: { value: '' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
    expect(await screen.findByText('Profile is required.')).toBeInTheDocument();
    expect(screen.getByText('Limitation is required.')).toBeInTheDocument();
    expect(mutationService.create).not.toHaveBeenCalled();

    fireEvent.change(screen.getByRole('spinbutton', { name: 'Limitation' }), {
      target: { value: '100000000000' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
    expect(
      await screen.findByText('Limitation must be between 0 and 99999999999.'),
    ).toBeInTheDocument();
    expect(mutationService.create).not.toHaveBeenCalled();

    fireEvent.change(screen.getByRole('textbox', { name: 'Profile' }), {
      target: { value: ' NEW-PROFILE ' },
    });
    fireEvent.change(screen.getByRole('spinbutton', { name: 'Limitation' }), {
      target: { value: '42' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() =>
      expect(mutationService.create).toHaveBeenCalledWith({
        profile: 'NEW-PROFILE',
        currency: 'USD',
        limitation: 42,
      }),
    );
    expect(await screen.findByRole('status')).toHaveTextContent('Authorization Limit created.');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(latestGridProps?.rows).toHaveLength(13);
  });

  it('edits a confirmed detail with expected version and preserves deferred actions', async () => {
    const updated = { ...authorizationLimitFixtures[0], limitation: 75, version: 2 };
    const mutationService = service({ edit: jest.fn().mockResolvedValue(updated) });
    render(
      <AuthorizationLimits
        basePath="/cashflow"
        path="/cashflow/authorization-limits/details/LIM-1001"
        client={client()}
        repository={repository()}
        mutation={{ principal: maker, service: mutationService }}
      />,
    );
    await screen.findByRole('heading', { name: 'LIM-1001' });
    fireEvent.click(screen.getByRole('button', { name: 'Edit Authorization Limit' }));
    expect(screen.getByRole('textbox', { name: 'Profile' })).toBeDisabled();
    fireEvent.change(screen.getByRole('spinbutton', { name: 'Limitation' }), {
      target: { value: '75' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
    await waitFor(() =>
      expect(mutationService.edit).toHaveBeenCalledWith({
        profile: authorizationLimitFixtures[0].profile,
        currency: 'USD',
        limitation: 75,
        expectedVersion: 1,
      }),
    );
    expect(await screen.findByText('$75.00')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /approve|reject/i })).not.toBeInTheDocument();
  });

  it('does not expose edit or pending transitions for a self-updated pending detail', async () => {
    render(
      <AuthorizationLimits
        basePath="/cashflow"
        path="/cashflow/authorization-limits/details/LIM-1003"
        client={client()}
        repository={repository()}
        mutation={{
          principal: {
            userId: 'cashflow-operations',
            permissions: [AUTHORIZATION_LIMITS_PERMISSIONS.verify],
          },
          service: service(),
        }}
      />,
    );
    await screen.findByRole('heading', { name: 'LIM-1003' });
    expect(screen.queryByRole('button', { name: /edit|approve|reject|delete/i })).not.toBeInTheDocument();
  });

  it('keeps the dialog open on categorized error and permits retry', async () => {
    const created = { ...authorizationLimitFixtures[0], limitationId: 'LIM-RETRY' };
    const create = jest
      .fn()
      .mockRejectedValueOnce(
        new AuthorizationLimitsMutationError('unavailable', 'Limits service unavailable', {
          retryable: true,
        }),
      )
      .mockResolvedValueOnce(created);
    render(
      <AuthorizationLimits
        basePath="/cashflow"
        path="/cashflow/authorization-limits"
        client={client()}
        repository={repository()}
        mutation={{ principal: maker, service: service({ create }) }}
      />,
    );
    await screen.findByTestId('authorization-grid');
    fireEvent.click(screen.getByRole('button', { name: 'Create Authorization Limit' }));
    fireEvent.change(screen.getByRole('textbox', { name: 'Profile' }), {
      target: { value: 'RETRY-PROFILE' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Limits service unavailable');
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
    await waitFor(() => expect(create).toHaveBeenCalledTimes(2));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('prevents repeat submission and dismissal while loading', async () => {
    let resolveCreate!: (value: AuthorizationLimitRecord) => void;
    const pending = new Promise<AuthorizationLimitRecord>((resolve) => {
      resolveCreate = resolve;
    });
    const create = jest.fn().mockReturnValue(pending);
    render(
      <AuthorizationLimits
        basePath="/cashflow"
        path="/cashflow/authorization-limits"
        client={client()}
        repository={repository()}
        mutation={{ principal: maker, service: service({ create }) }}
      />,
    );
    await screen.findByTestId('authorization-grid');
    fireEvent.click(screen.getByRole('button', { name: 'Create Authorization Limit' }));
    fireEvent.change(screen.getByRole('textbox', { name: 'Profile' }), {
      target: { value: 'PENDING-PROFILE' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
    const progress = await screen.findByRole('button', { name: 'Submit in progress' });
    expect(progress).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeDisabled();
    expect(screen.queryByRole('button', { name: 'Close Create Authorization Limit' })).not.toBeInTheDocument();
    fireEvent.click(progress);
    expect(create).toHaveBeenCalledTimes(1);
    resolveCreate(authorizationLimitFixtures[0]);
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });
});

describe('Authorization Limits opt-in delete and transition cohort', () => {
  const checker = {
    userId: 'checker-one',
    permissions: [AUTHORIZATION_LIMITS_PERMISSIONS.verify],
  } as const;

  it.each([
    {
      id: 'LIM-1001',
      trigger: 'Delete Authorization Limit',
      title: 'Delete Authorization Limit?',
      confirmLabel: 'Delete',
      method: 'remove',
      command: { profile: 'GLOBAL-MAKER', currency: 'USD', expectedVersion: 1 },
      principal: maker,
    },
    {
      id: 'LIM-1003', trigger: 'Approve Add', title: 'Approve Add?', confirmLabel: 'Create', method: 'confirm',
      command: { profile: 'TREASURY-ASIA', currency: 'USD', status: 'ADD_PENDING', expectedVersion: 1 },
      principal: checker,
    },
    {
      id: 'LIM-1003', trigger: 'Reject Add', title: 'Reject Add?', confirmLabel: 'Reject Add', method: 'reject',
      command: { profile: 'TREASURY-ASIA', currency: 'USD', status: 'ADD_PENDING', expectedVersion: 1 },
      principal: checker,
    },
    {
      id: 'LIM-1004', trigger: 'Approve Edit', title: 'Approve Edit?', confirmLabel: 'Approve', method: 'confirm',
      command: { profile: 'TREASURY-EMEA', currency: 'USD', status: 'EDIT_PENDING', expectedVersion: 1 },
      principal: checker,
    },
    {
      id: 'LIM-1004', trigger: 'Reject Edit', title: 'Reject Edit?', confirmLabel: 'Reject', method: 'reject',
      command: { profile: 'TREASURY-EMEA', currency: 'USD', status: 'EDIT_PENDING', expectedVersion: 1 },
      principal: checker,
    },
    {
      id: 'LIM-1006', trigger: 'Approve Delete', title: 'Approve Deletion?', confirmLabel: 'Delete', method: 'confirm',
      command: { profile: 'OPERATIONS-EU', currency: 'USD', status: 'DELETE_PENDING', expectedVersion: 1 },
      principal: checker,
    },
    {
      id: 'LIM-1006', trigger: 'Reject Delete', title: 'Reject Deletion?', confirmLabel: 'Reject Deletion', method: 'reject',
      command: { profile: 'OPERATIONS-EU', currency: 'USD', status: 'DELETE_PENDING', expectedVersion: 1 },
      principal: checker,
    },
  ] as const)(
    'runs $trigger explicitly and refreshes records',
    async ({ id, trigger, title, confirmLabel, method, command, principal }) => {
      const mutationService = service();
      render(
        <AuthorizationLimits
          basePath="/cashflow"
          path={`/cashflow/authorization-limits/details/${id}`}
          client={client()}
          repository={repository()}
          mutation={{ principal, service: mutationService }}
        />,
      );
      await screen.findByRole('heading', { name: id });
      fireEvent.click(screen.getByRole('button', { name: trigger }));
      expect(screen.getByRole('dialog', { name: title })).toBeInTheDocument();
      fireEvent.click(screen.getByRole('button', { name: confirmLabel }));
      await waitFor(() =>
        expect(mutationService[method]).toHaveBeenCalledWith(command),
      );
      expect(mutationService.list).toHaveBeenCalledTimes(1);
      expect(await screen.findByRole('status')).toHaveTextContent('Authorization Limit');
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    },
  );

  it('treats Cancel as dismissal instead of an alternative rejection', async () => {
    const mutationService = service();
    render(
      <AuthorizationLimits
        basePath="/cashflow"
        path="/cashflow/authorization-limits/details/LIM-1004"
        client={client()}
        repository={repository()}
        mutation={{ principal: checker, service: mutationService }}
      />,
    );
    await screen.findByRole('heading', { name: 'LIM-1004' });
    fireEvent.click(screen.getByRole('button', { name: 'Reject Edit' }));
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(mutationService.confirm).not.toHaveBeenCalled();
    expect(mutationService.reject).not.toHaveBeenCalled();
    expect(mutationService.remove).not.toHaveBeenCalled();
    expect(mutationService.list).not.toHaveBeenCalled();
  });

  it('reconciles a removed record to existing not-found recovery', async () => {
    const mutationService = service({ list: jest.fn().mockResolvedValue([]) });
    render(
      <AuthorizationLimits
        basePath="/cashflow"
        path="/cashflow/authorization-limits/details/LIM-1001"
        client={client()}
        repository={repository()}
        mutation={{ principal: maker, service: mutationService }}
      />,
    );
    await screen.findByRole('heading', { name: 'LIM-1001' });
    fireEvent.click(screen.getByRole('button', { name: 'Delete Authorization Limit' }));
    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('record was not found');
    expect(mutationService.list).toHaveBeenCalledTimes(1);
  });

  it('retains a failed transition for local retry', async () => {
    const confirm = jest
      .fn()
      .mockRejectedValueOnce(new AuthorizationLimitsMutationError('conflict', 'Record version changed'))
      .mockResolvedValueOnce(authorizationLimitFixtures[3]);
    const mutationService = service({ confirm });
    render(
      <AuthorizationLimits
        basePath="/cashflow"
        path="/cashflow/authorization-limits/details/LIM-1004"
        client={client()}
        repository={repository()}
        mutation={{ principal: checker, service: mutationService }}
      />,
    );
    await screen.findByRole('heading', { name: 'LIM-1004' });
    fireEvent.click(screen.getByRole('button', { name: 'Approve Edit' }));
    fireEvent.click(screen.getByRole('button', { name: 'Approve' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Record version changed');
    expect(screen.getByRole('dialog', { name: 'Approve Edit?' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Approve' }));
    await waitFor(() => expect(confirm).toHaveBeenCalledTimes(2));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('prevents repeat transition and dismissal while loading', async () => {
    let resolveConfirm!: (value: AuthorizationLimitRecord) => void;
    const pending = new Promise<AuthorizationLimitRecord>((resolve) => {
      resolveConfirm = resolve;
    });
    const confirm = jest.fn().mockReturnValue(pending);
    render(
      <AuthorizationLimits
        basePath="/cashflow"
        path="/cashflow/authorization-limits/details/LIM-1003"
        client={client()}
        repository={repository()}
        mutation={{ principal: checker, service: service({ confirm }) }}
      />,
    );
    await screen.findByRole('heading', { name: 'LIM-1003' });
    fireEvent.click(screen.getByRole('button', { name: 'Approve Add' }));
    fireEvent.click(screen.getByRole('button', { name: 'Create' }));
    const progress = await screen.findByRole('button', { name: 'Create in progress' });
    expect(progress).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeDisabled();
    expect(screen.queryByRole('button', { name: 'Close Approve Add?' })).not.toBeInTheDocument();
    fireEvent.click(progress);
    expect(confirm).toHaveBeenCalledTimes(1);
    resolveConfirm(authorizationLimitFixtures[2]);
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });
});
