import { createRef } from 'react';
import { render, screen } from '@testing-library/react';

import { Button } from '../button';

describe('Button', () => {
  it('forwards refs to the underlying button element', () => {
    const ref = createRef<HTMLButtonElement>();

    render(<Button ref={ref}>Send</Button>);

    expect(ref.current).toBe(screen.getByRole('button', { name: 'Send' }));
  });
});
