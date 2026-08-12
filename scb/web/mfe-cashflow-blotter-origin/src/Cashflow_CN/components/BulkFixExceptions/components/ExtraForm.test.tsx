import { render } from "@Test/test-utils";

import { ExtraForm } from "./ExtraForm";

afterAll(() => {
  jest.clearAllMocks();
});

describe('ExtraForm', () => {
  it("ExtraForm should render in document", () => {
    const { queryByTestId } = render(<ExtraForm showAffirmationForm={false} showBackValueDateForm={false} />);
    expect(queryByTestId("extra-form")).toBeInTheDocument();
  });
  it("Affirmation should render in document", () => {
    const { container } = render(<ExtraForm showAffirmationForm={true} showBackValueDateForm={false} />);
    expect(container).toContainHTML("Affirmed with");
  });
  it("BackValue should render in document", () => {
    const { container } = render(<ExtraForm showAffirmationForm={false} showBackValueDateForm={true} />);
    expect(container).toContainHTML("Back Value Date");
  });
});
