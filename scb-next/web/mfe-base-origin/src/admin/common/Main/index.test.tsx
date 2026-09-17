import React from "react";
import { render, screen } from "@testing-library/react";
import Main from "./";
import { GridColDef } from "@mui/x-data-grid";
import Actions from "../Actions";
import Status from "../Status";


vi.mock("@mui/x-data-grid", async (importOriginal) => {
    const actual = await importOriginal<typeof import("@mui/x-data-grid")>();
    return {
        ...actual,
        __esModule: true,
        default: () => {
            return {
                GridActionsCellItem: (props) => { return (<div>{props.children}</div>) },
            };
        },
        GridActionsCellItem: (props) => { return (<div>{props.children}</div>) },
    };
});

const Comp = ({ openAuditPopup, auditRows }) => {
    const onOpen = React.useCallback(
        (row, mode) => () => {

        },
        []
    );
    const onOpenAudit = React.useCallback(
        (row) => () => {

        },
        []
    );
    const ems2Role = "SUPER_USER"
    const columns: GridColDef[] = React.useMemo(
        () =>
            [
                {
                    field: "actions",
                    type: "actions",
                    headerName: "Actions",
                    width: 150,
                    hideable: false,
                    getActions: (value) => Actions({ value, onOpen, onOpenAudit }),
                },
                {
                    field: "label",
                    headerName: "Category Label",
                    width: 300,
                    hideable: false,
                },
                {
                    field: "ems2Role",
                    headerName: "EMS2 Role Record Owner",
                    width: 200,
                    readOnly: ems2Role != "SUPER_USER",
                },
                {
                    field: "active",
                    headerName: "Verified?",
                    width: 100,
                    readOnly: true,
                    hideable: false,
                    align: "center",
                    renderCell: (props) => <Status {...props} />,
                },
                {
                    field: "createdAt",
                    headerName: "Created At",
                    width: 200,
                    readOnly: true,
                    valueGetter: ({ row }) => {
                        let date = new Date();
                        if (row?.updatedAt?.length) {
                            date = new Date(row.createdAt);
                        }
                        return date;
                    },
                },
                {
                    field: "createdBy",
                    headerName: "Created By",
                    width: 150,
                    readOnly: true,
                },
                {
                    field: "updatedAt",
                    headerName: "Updated At",
                    width: 200,
                    readOnly: true,
                    valueGetter: ({ row }) => {
                        let date = new Date();
                        if (row?.updatedAt?.length) {
                            date = new Date(row.updatedAt);
                        }
                        return date;
                    },
                },
                {
                    field: "updatedBy",
                    headerName: "Updated By",
                    width: 150,
                    readOnly: true,
                },
            ] as GridColDef[],
        [ems2Role]
    );
    const rows: any[] = [
        { id: 1, lastName: 'Snow', firstName: 'Jon', age: 14, mode: "new", template: true },
        { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 31, mode: "edit", template: false },
        { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 31, mode: "verify", template: false },
        { id: 4, lastName: 'Stark', firstName: 'Arya', age: 11, mode: "deactivate", template: false },
        { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: 12, mode: "new", template: false },
        { id: 6, lastName: 'Melisandre', firstName: 'Daenerys', age: 150, mode: "new", template: false },
        { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44, mode: "new", template: false },
        { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36, mode: "new", template: false },
        { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65, mode: "new", template: false },
    ];
    const [resetId, setResetId] = React.useState<number>(new Date().getTime());
    const [record, setRecord] = React.useState<any>(rows[0]);
    const onChange = React.useCallback(
        (value: any, field: string) => {
            const temp = { ...record };
            temp[field] = value;
            setRecord(temp);
        },
        [record]
    );
    const onCreateNew = () => {

    }
    const onCloseAudit = () => {

    }
    const onUpdate = () => {

    }
    const onVerify = () => {

    }
    const onDeactivate = () => {

    }
    const onSave = () => {

    }
    const onReset = () => {
        setResetId(new Date().getTime())
    }
    const onClose = () => {

    }
    const [openAudit, setOpenAudit] = React.useState<boolean>(openAuditPopup);
    const auditColumns: GridColDef[] = React.useMemo(
        () =>
            [
                {
                    field: "id",
                    headerName: "Audit ID",
                    width: 100,
                    hideable: false,
                    readOnly: true,
                },
                {
                    field: "transactionMode",
                    headerName: "Transaction Mode",
                    width: 200,
                    readOnly: true,
                },
                {
                    field: "applicationCategoryId",
                    headerName: "Category ID",
                    width: 100,
                    hideable: false,
                    readOnly: true,
                },
                {
                    field: "label",
                    headerName: "Category Label",
                    width: 300,
                },
                {
                    field: "active",
                    headerName: "Verified?",
                    width: 100,
                    hideable: false,
                    readOnly: true,
                    align: "center",
                    renderCell: (props) => <Status {...props} />,
                },
                {
                    field: "createdAt",
                    headerName: "Created At",
                    width: 200,
                    readOnly: true,
                    valueGetter: ({ row }) => {
                        let date = new Date();
                        if (row?.updatedAt?.length) {
                            date = new Date(row.createdAt);
                        }
                        return date;
                    },
                },
                {
                    field: "createdBy",
                    headerName: "Created By",
                    width: 150,
                    readOnly: true,
                },
                {
                    field: "updatedAt",
                    headerName: "Updated At",
                    width: 200,
                    readOnly: true,
                    valueGetter: ({ row }) => {
                        let date = new Date();
                        if (row?.updatedAt?.length) {
                            date = new Date(row.updatedAt);
                        }
                        return date;
                    },
                },
                {
                    field: "updatedBy",
                    headerName: "Updated By",
                    width: 150,
                    readOnly: true,
                },
                {
                    field: "ems2Role",
                    headerName: "EMS2 Role Record Owner",
                    width: 200,
                    readOnly: true,
                },
            ] as GridColDef[],
        []
    );
    
    return <Main
        rows={rows}
        columns={columns}
        record={record}
        openDetail={false}
        onChange={onChange}
        onUpdate={onUpdate}
        onVerify={onVerify}
        onDeactivate={onDeactivate}
        onSave={onSave}
        onReset={onReset}
        resetId={resetId}
        onClose={onClose}
        isLoading={false}
        onCreateNew={onCreateNew}
        titleCreateNew="New"
        openAudit={openAudit}
        onCloseAudit={onCloseAudit}
        auditColumns={auditColumns}
        auditRows={auditRows}
        disabledCreateNew={false}
    />
}

describe("Admin Module Main component", () => {
    it("renders Main component", async () => {
        render(<Comp openAuditPopup={false} auditRows={[]}/>);
        expect(screen).toBeDefined();
    });
    it("renders Main component", async () => {
        render(<Comp openAuditPopup={true} auditRows={[{ id: 1, lastName: 'Snow', firstName: 'Jon', age: 14, transactionMode: "new", template: true },]}/>);
        expect(screen).toBeDefined();
    });
});
