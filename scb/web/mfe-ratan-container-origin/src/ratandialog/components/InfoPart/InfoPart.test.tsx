import { render } from "@testing-library/react"
import { InfoPart } from "."

describe("Info Part", () => {
  it("should render InfoPart correctly", async () => {
    const partDetail = [ { key: 'testSubLabel', value: 'testSubField' } ]
    const details = { testField: 'testValue',  testSubField: "testSubValue" }
    const item1 = { key: 'testLabel', value : 'testField' }
    const item2 = { key: 'testLabel', value : '' }
    const { asFragment } = render(
    <>
      <InfoPart partDetail={partDetail} details={details} item={item1} />
      <InfoPart partDetail={partDetail} details={details} item={item2} />
    </>);
    expect(asFragment()).toMatchSnapshot();
  })
})