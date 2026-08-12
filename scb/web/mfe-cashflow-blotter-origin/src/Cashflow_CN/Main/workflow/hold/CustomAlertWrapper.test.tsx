import { render, screen } from '@testing-library/react';
import React from 'react';

import { AlertWrapper } from './CustomAlertWrapper';

describe('AlertWrapper Component', () => {
    it(`renders correctly with error type `, () => {
      const erroMessage = "error Message";
      render(<AlertWrapper message={erroMessage} type={"error"} />);
      expect(screen).toBeDefined();
      expect(screen.getByText(erroMessage)).toBeInTheDocument();
    });
     it(`renders correctly with warning type `, () => {
      const warningMessage = "warning Message";
      render(<AlertWrapper message={warningMessage} type={"warning"} />);
      expect(screen).toBeDefined();
      expect(screen.getByText(warningMessage)).toBeInTheDocument();
    });
});
