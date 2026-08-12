import { formatBuySell, FXArray, handleReviewStatus } from './fieldsConfig';

afterAll(() => {
  vi.clearAllMocks();
});

vi.mock("../../componentEnabling", () => {
  return { getEnable: () => true }
});

test("formatBuySell", async () => {
  expect(formatBuySell({ data: {}})).toEqual("");
  FXArray.forEach((item) => {
    formatBuySell({ data: { Forward_Future_Instrument: { [item]: "party1" } }});
    formatBuySell({ data: { Forward_Future_Instrument: { [item]: "party2" } }});
    formatBuySell({ data: { Cash_Financial_Instrument: { [item]: "party1" } }});
    formatBuySell({ data: { Cash_Financial_Instrument: { [item]: "party2" } }});
  })
});

test('handleReviewStatus', () => {
  const result = handleReviewStatus({ value: 'AUTO_VALIDATED_ERROR'});
  expect(result).toEqual('Auto Validated Error');
})