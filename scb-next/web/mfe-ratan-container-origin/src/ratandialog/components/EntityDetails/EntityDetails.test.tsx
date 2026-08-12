import { render, screen } from "@testing-library/react";
import { EntityDetails } from "./EntityDetails";
const data = [{ key: 'Booking Entity Name', version: 'testEntity' }];
test('should render EntityDetails', () => {
  render(<EntityDetails data={data} />);
  expect(screen).toBeDefined();
  const key = screen.getAllByText(/Booking Entity Name/i);
  expect(key.length).toBeGreaterThan(0);
});
