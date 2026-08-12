import { screen, render, waitFor } from '@testing-library/react';
import { SwiftMessageDialog } from './index';

test('Should show swift message dialog!', async () => {
  const { container } = render(<SwiftMessageDialog details={'a \r\n b'} />);
  const dom = container.querySelector('.swift-message-dialog');
  expect(dom).toBeInTheDocument();
});

test('Should show swift message dialog!', async () => {
  render(<SwiftMessageDialog details={''} />);
  const dom = await screen.findByText('No Swift Message');
  expect(dom).toBeInTheDocument();
});
