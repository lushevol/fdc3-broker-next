import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import App from "./App";

vi.mock("../components/LimitationDataGrid", () => {
    const mockComponent = ({
      children,
      gridData,
      onOpenDetailsDialog,
      onDeleteLimitation,
      onApproveAddLimitation,
      onRejectAddLimitation,
      onApproveDeleteLimitation,
      onRejectDeleteLimitation,
      onApproveEditLimitation,
      onRejectEditLimitation,
    }) => {
      return <div>
        <button data-testid="test-open-dialog" onClick={() => onOpenDetailsDialog(true, {}, "Edit")}>open dialog</button>
        <button data-testid="test-delete" onClick={() => onDeleteLimitation({})}>delete</button>
        <button data-testid="test-approve-add" onClick={() => onApproveAddLimitation({})}>approve add</button>
        <button data-testid="test-reject-add" onClick={() => onRejectAddLimitation({})}>reject add</button>
        <button data-testid="test-approve-delete" onClick={() => onApproveDeleteLimitation({})}>approve delete</button>
        <button data-testid="test-reject-delete" onClick={() => onRejectDeleteLimitation({})}>reject delete</button>
        <button data-testid="test-approve-edit" onClick={() => onApproveEditLimitation({})}>approve edit</button>
        <button data-testid="test-reject-edit" onClick={() => onRejectEditLimitation({})}>reject edit</button>
        <div>{children}</div>
      </div>
    }
    return {
      __esModule: true,
      default: mockComponent,
    }
  });
  
vi.mock("../components/DetailsDialog", () => {
    const mockComponent = ({
      children,
      onSubmit,
      onClose
    }) => {
      return <div>
        <button data-testid="test-submit" onClick={() => onSubmit({})}>submit</button>
        <button data-testid="test-close" onClick={() => onClose({})}>close</button>
        <div>{children}</div>
      </div>
    }
    return {
      __esModule: true,
      default: mockComponent,
    }
  });

  vi.mock("../components/OperationActions", () => {
      const mockComponent = ({
        children,
        onCreateNewLimitation,
      }) => {
        return <div>
          <button data-testid="test-create-new" onClick={() => onCreateNewLimitation({})}>create</button>
          <div>{children}</div>
        </div>
      }
      return {
        __esModule: true,
        default: mockComponent,
      }
    });

  vi.mock("../services", () => {
    return {
        __esModule: true,
        default: vi.fn().mockImplementation(() => {
            return {
                getLimitationList: vi.fn().mockImplementation(() => Promise.resolve([{ id: 'test', profile: "test" }])),
                updateLimitation: vi.fn().mockImplementationOnce(() => Promise.resolve()).mockImplementationOnce(() => Promise.resolve({ deleted: true })).mockImplementation(() => Promise.resolve({})),
                createLimitation: vi.fn().mockImplementation(() => Promise.resolve({})),
                deleteLimitation: vi.fn().mockImplementation(() => Promise.resolve({})),
                approveActionLimitation: vi.fn().mockImplementation(() => Promise.resolve({})),
                rejectActionLimitation: vi.fn().mockImplementation(() => Promise.resolve({})),
            }
        }),
    }
  })

describe("Auth Limits", () => {
    it("all actions", () => {
        const { queryByTestId } = render(
            <App tile={""} />
        );

        const openDialog = queryByTestId("test-open-dialog");
        expect(openDialog).toBeInTheDocument();
        userEvent.click(openDialog!);
        
        const deleteBtn = queryByTestId("test-delete");
        expect(deleteBtn).toBeInTheDocument();
        userEvent.click(deleteBtn!);
        
        const approveAddBtn = queryByTestId("test-approve-add");
        expect(approveAddBtn).toBeInTheDocument();
        userEvent.click(approveAddBtn!);
        
        const rejectAddBtn = queryByTestId("test-reject-add");
        expect(rejectAddBtn).toBeInTheDocument();
        userEvent.click(rejectAddBtn!);
        
        const approveDeleteBtn = queryByTestId("test-approve-delete");
        expect(approveDeleteBtn).toBeInTheDocument();
        userEvent.click(approveDeleteBtn!);
        
        const rejectDeleteBtn = queryByTestId("test-reject-delete");
        expect(rejectDeleteBtn).toBeInTheDocument();
        userEvent.click(rejectDeleteBtn!);
        
        const approveEditBtn = queryByTestId("test-approve-edit");
        expect(approveEditBtn).toBeInTheDocument();
        userEvent.click(approveEditBtn!);
        
        const rejectEditBtn = queryByTestId("test-reject-edit");
        expect(rejectEditBtn).toBeInTheDocument();
        userEvent.click(rejectEditBtn!);
        
        const submitBtn = queryByTestId("test-submit");
        expect(submitBtn).toBeInTheDocument();
        userEvent.click(submitBtn!);
        
        const closeBtn = queryByTestId("test-close");
        expect(closeBtn).toBeInTheDocument();
        userEvent.click(closeBtn!);
        
        const createBtn = queryByTestId("test-create-new");
        expect(createBtn).toBeInTheDocument();
        userEvent.click(createBtn!);

        const submitBtn2 = queryByTestId("test-submit");
        expect(submitBtn2).toBeInTheDocument();
        userEvent.click(submitBtn2!);
        
        const deleteBtn2 = queryByTestId("test-delete");
        expect(deleteBtn2).toBeInTheDocument();
        userEvent.click(deleteBtn2!);
    });
    it("no permission", () => {
        vi.spyOn(require("./utils"), "hasViewPermission").mockImplementation(() => false);

        const { container } = render(
            <App tile={""} />
        );

        expect(container).toBeEmptyDOMElement();
    });
});