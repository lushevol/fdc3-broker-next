import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { reconnectNotification } from './reconnectNotification';
test('reconnectNotification', async () => {
  const callback = vi.fn();
  const Comp = () => {
    React.useEffect(() => {
      reconnectNotification(callback);
    }, [])
    return <div></div>
  }
  render(<Comp />);
  const btn = await screen.findByText('Reconnect');
  fireEvent.click(btn);
  expect(callback).toBeCalled();
});
