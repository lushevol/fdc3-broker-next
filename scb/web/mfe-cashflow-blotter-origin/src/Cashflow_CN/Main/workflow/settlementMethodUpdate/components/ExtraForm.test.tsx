import { act, render, screen } from "@Test/test-utils";
import React, { createRef } from "react";

import { ExtraFormRef } from "../type";
import { ExtraForm } from "./ExtraForm";

afterAll(() => {
  jest.clearAllMocks();
});

describe("ExtraForm", () => {
  describe("Basic Render", () => {
    it("should render ExtraForm in document", () => {
      render(<ExtraForm ref={createRef()} />);
      expect(screen.getByTestId("extra-form")).toBeInTheDocument();
    });

    it("should render textarea with correct placeholder", () => {
      render(<ExtraForm ref={createRef()} />);
      expect(
        screen.getByPlaceholderText("Please type in comment.")
      ).toBeInTheDocument();
    });

    it("should render Form with vertical layout", () => {
      render(<ExtraForm ref={createRef()} />);
      expect(screen.getByTestId("extra-form")).toBeInTheDocument();
    });
  });

  describe("disabled prop", () => {
    it("should render textarea as enabled when disabled is false", () => {
      render(<ExtraForm ref={createRef()} disabled={false} />);
      const textarea = screen.getByPlaceholderText("Please type in comment.");
      expect(textarea).not.toBeDisabled();
    });

    it("should render textarea as disabled when disabled is true", () => {
      render(<ExtraForm ref={createRef()} disabled={true} />);
      const textarea = screen.getByPlaceholderText("Please type in comment.");
      expect(textarea).toBeDisabled();
    });

    it("should render textarea as enabled when disabled is undefined", () => {
      render(<ExtraForm ref={createRef()} />);
      const textarea = screen.getByPlaceholderText("Please type in comment.");
      expect(textarea).not.toBeDisabled();
    });
  });

  describe("useImperativeHandle submit", () => {
    it("should return empty comment when form is not filled", async () => {
      const ref = createRef<ExtraFormRef>();
      render(<ExtraForm ref={ref} />);

      let result: any;
      await act(async () => {
        result = await ref.current?.submit();
      });

      expect(result).toEqual({
        comment: undefined,
      });
    });

    it("should return correct ExtraFormSubmitFormDataType structure", async () => {
      const ref = createRef<ExtraFormRef>();
      render(<ExtraForm ref={ref} />);

      let result: any;
      await act(async () => {
        result = await ref.current?.submit();
      });

      expect(result).toHaveProperty("comment");
      expect(result.comment).toBeUndefined();
    });

    it("should handle submit error and scroll into view", async () => {
      const ref = createRef<ExtraFormRef>();
      render(<ExtraForm ref={ref} />);

      const consoleSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const scrollIntoViewMock = jest.fn();
      Element.prototype.scrollIntoView = scrollIntoViewMock;

      jest.spyOn(React, "useRef").mockReturnValueOnce({
        current: { scrollIntoView: scrollIntoViewMock },
      });

      consoleSpy.mockRestore();
    });
  });

  describe("ref", () => {
    it("should expose submit method via ref", () => {
      const ref = createRef<ExtraFormRef>();
      render(<ExtraForm ref={ref} />);
      expect(ref.current).not.toBeNull();
      expect(typeof ref.current?.submit).toBe("function");
    });

    it("should return null ref when not mounted", () => {
      const ref = createRef<ExtraFormRef>();
      expect(ref.current).toBeNull();
    });
  });

  describe("className", () => {
    it("should render textarea with add-comment-area class", () => {
      render(<ExtraForm ref={createRef()} />);
      const textarea = screen.getByPlaceholderText("Please type in comment.");
      expect(textarea).toHaveClass("add-comment-area");
    });

    it("should render textarea with 2 rows", () => {
      render(<ExtraForm ref={createRef()} />);
      const textarea = screen.getByPlaceholderText("Please type in comment.");
      expect(textarea).toHaveAttribute("rows", "2");
    });
  });
});
