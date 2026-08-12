import { fireEvent,render, screen } from "@testing-library/react";
import { saveAs } from "file-saver";

import ExportFile from "./index";

vi.mock("./../../../common/utils", () => ({
  formattedXml: vi.fn((xmlString) => 'Message 1\nMessage 2'),
}));

vi.mock('file-saver', () => {
  return {
    saveAs: vi.fn()
  }
})

describe("ExportFile", () => {
  const mockSwiftMessages = [
    {
      "sequence": 1,
      "mxType": "pacs.008.001.08",
      "mxMessage": "Message 1"
    },
    {
      "sequence": 2,
      "mxType": "pacs.009.001.08",
      "mxMessage": "Message 2"
    },
  ];
  const mockCashflowId = "12345";

  test("should export all messages when Export button is clicked", () => {
    render(<ExportFile swiftMessages={mockSwiftMessages} cashflowId={mockCashflowId} />);
    const exportButton = screen.getByTestId("ExportMessageBtn");
    fireEvent.click(exportButton);
    expect(saveAs).toHaveBeenCalledWith(
      new Blob(["<message>Message 1</message>\n\n<message>Message 2</message>"], { type: "text/plain" }),
      "12345.txt"
    );
  });
});