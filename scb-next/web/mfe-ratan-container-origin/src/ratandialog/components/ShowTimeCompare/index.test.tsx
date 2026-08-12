import { render } from "@testing-library/react";
import { ShowTimeCompare } from "./index";

test("ShowTimeCompare", () => {
  const data = {
    Cashflow: {
      Payment_Cutoff_Time: "xxx"
    }
  }
  const { asFragment } = render(<ShowTimeCompare data={data}/>);
  expect(asFragment()).toMatchSnapshot();
})