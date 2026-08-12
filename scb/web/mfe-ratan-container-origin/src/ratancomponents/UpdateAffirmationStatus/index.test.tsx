import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import "../../ratanstatic";
import { UpdateAffirmationStatus } from './index';

afterAll(() => {
  jest.clearAllMocks();
});

const onClose = jest.fn();
const submit = jest.fn(() => Promise.resolve());
const tradeGridReady = {
  api: {
    deselectAll: jest.fn(),
  },
};

describe("UpdateAffirmationStatus component", () => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // Deprecated
      removeListener: jest.fn(), // Deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
  it("Open", async () => {
    render(<UpdateAffirmationStatus
      isOpenAffirmation={true}
      onCloseFunction={onClose}
      submit={submit}
      gridEvent={tradeGridReady}
    />);
    expect(screen).toBeDefined();
    await waitFor(() => screen.findByTestId('update-affirmation-status'));
    await waitFor(() => screen.findByTestId('affirmedName'), { timeout: 4000 });
    const affirmName = screen.getByTestId('affirmedName');
    const affirmEmail = screen.getByTestId('affirmedEmail');
    userEvent.type(affirmName, '123');
    userEvent.type(affirmEmail, '123');
    const submitBtn = await screen.findByTestId('update-affirmation-status-submit');
    expect(submitBtn).toBeInTheDocument();
    userEvent.click(submitBtn);
    await waitFor(() => expect(submit).toBeCalled());
  });
  it("Close", async () => {
    render(
      <UpdateAffirmationStatus
        isOpenAffirmation={true}
        onCloseFunction={onClose}
        submit={submit}
        gridEvent={tradeGridReady}
      />
    );
    expect(screen).toBeDefined();
    await waitFor(() => screen.findByText('Close'))
    const closeBtn = screen.getByText('Close');

    await screen.findByTestId('update-affirmation-status');

    userEvent.click(closeBtn);
    await waitFor(() => expect(onClose).toBeCalled());
  });
});