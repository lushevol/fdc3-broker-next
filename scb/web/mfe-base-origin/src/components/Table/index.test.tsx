import React from "react";
import { render, screen } from "@testing-library/react";
import DataGrid from "./";
import { GridColDef } from "@mui/x-data-grid";


const Comp = (props) => {
    const { columnVisibilityModel } = props
    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 90 },
        {
            field: 'firstName',
            headerName: 'First name',
            width: 150,
            editable: true,
        },
        {
            field: 'lastName',
            headerName: 'Last name',
            width: 150,
            editable: true,
        },
        {
            field: 'age',
            headerName: 'Age',
            type: 'number',
            width: 110,
            editable: true,
        },
        {
            field: 'fullName',
            headerName: 'Full name',
            description: 'This column has a value getter and is not sortable.',
            sortable: false,
            width: 160,
            valueGetter: (value: any) => `${value?.row?.firstName || ''} ${value?.row?.lastName || ''}`,
        },
    ];
    const rows: any[] = [
        { id: 1, lastName: 'Snow', firstName: 'Jon', age: 14, mode: "new" },
        { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 31, mode: "edit" },
        { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 31, mode: "verify" },
        { id: 4, lastName: 'Stark', firstName: 'Arya', age: 11, mode: "deactivate" },
        { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: 12, mode: "new" },
        { id: 6, lastName: 'Melisandre', firstName: 'Daenerys', age: 150, mode: "new" },
        { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44, mode: "new" },
        { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36, mode: "new" },
        { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65, mode: "new" },
    ];
    const [resetId, setResetId] = React.useState<number>(new Date().getTime());
    const [openDetail, setOpenDetail] = React.useState<boolean>(true);
    const [record, setRecord] = React.useState<any>(rows[0]);
    const onChange = React.useCallback(
        (value: any, field: string) => {
            const temp = { ...record };
            temp[field] = value;
            setRecord(temp);
        },
        [record]
    );
    const onClose = React.useCallback(() => {
        setRecord(undefined);
        setOpenDetail(false);
    }, []);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const onVerify = React.useCallback(async () => {
        setIsLoading(true);
        setIsLoading(false);
        onClose();
    }, [record]);
    const onUpdate = React.useCallback(async () => {
        setIsLoading(true);
        setIsLoading(false);
        onClose();
    }, [record]);
    const onDeactivate = React.useCallback(async () => {
        setIsLoading(true);
        setIsLoading(false);
        onClose();
    }, [record]);
    const onSave = React.useCallback(async () => {
        setIsLoading(true);
        setIsLoading(false);
        onClose();
    }, [record]);
    const onReset = React.useCallback(async () => {
        setResetId(new Date().getTime());
    }, []);

    return <DataGrid
        columns={columns}
        rows={rows}
        openDetail={openDetail}
        record={record}
        onChange={onChange}
        onVerify={onVerify}
        onUpdate={onUpdate}
        onDeactivate={onDeactivate}
        onSave={onSave}
        onReset={onReset}
        onClose={onClose}
        resetId={resetId}
        isLoading={isLoading}
        columnVisibilityModel={columnVisibilityModel}
    />
}

const Comp1 = (props) => {
    const { columnVisibilityModel } = props
    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 90 },
        {
            field: 'firstName',
            headerName: 'First name',
            width: 150,
            editable: true,
        },
        {
            field: 'lastName',
            headerName: 'Last name',
            width: 150,
            editable: true,
        },
        {
            field: 'age',
            headerName: 'Age',
            type: 'number',
            width: 110,
            editable: true,
        },
        {
            field: 'fullName',
            headerName: 'Full name',
            description: 'This column has a value getter and is not sortable.',
            sortable: false,
            width: 160,
            valueGetter: (value: any) => `${value?.row?.firstName || ''} ${value?.row?.lastName || ''}`,
        },
    ];
    const rows: any[] = [
        { id: 1, lastName: 'Snow', firstName: 'Jon', age: 14, mode: "new" },
        { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 31, mode: "edit" },
        { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 31, mode: "verify" },
        { id: 4, lastName: 'Stark', firstName: 'Arya', age: 11, mode: "deactivate" },
        { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: 12, mode: "new" },
        { id: 6, lastName: 'Melisandre', firstName: 'Daenerys', age: 150, mode: "new" },
        { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44, mode: "new" },
        { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36, mode: "new" },
        { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65, mode: "new" },
    ];
    const [resetId, setResetId] = React.useState<number>(new Date().getTime());
    const [openDetail, setOpenDetail] = React.useState<boolean>(true);
    const [record, setRecord] = React.useState<any>(rows[1]);
    const onChange = React.useCallback(
        (value: any, field: string) => {
            const temp = { ...record };
            temp[field] = value;
            setRecord(temp);
        },
        [record]
    );
    const onClose = React.useCallback(() => {
        setRecord(undefined);
        setOpenDetail(false);
    }, []);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const onVerify = React.useCallback(async () => {
        setIsLoading(true);
        setIsLoading(false);
        onClose();
    }, [record]);
    const onUpdate = React.useCallback(async () => {
        setIsLoading(true);
        setIsLoading(false);
        onClose();
    }, [record]);
    const onDeactivate = React.useCallback(async () => {
        setIsLoading(true);
        setIsLoading(false);
        onClose();
    }, [record]);
    const onSave = React.useCallback(async () => {
        setIsLoading(true);
        setIsLoading(false);
        onClose();
    }, [record]);
    const onReset = React.useCallback(async () => {
        setResetId(new Date().getTime());
    }, []);

    return <DataGrid
        columns={columns}
        rows={rows}
        openDetail={openDetail}
        record={record}
        onChange={onChange}
        onVerify={onVerify}
        onUpdate={onUpdate}
        onDeactivate={onDeactivate}
        onSave={onSave}
        onReset={onReset}
        onClose={onClose}
        resetId={resetId}
        isLoading={isLoading}
        columnVisibilityModel={columnVisibilityModel}
    />
}

const Comp2 = (props) => {
    const { columnVisibilityModel } = props
    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 90 },
        {
            field: 'firstName',
            headerName: 'First name',
            width: 150,
            editable: true,
        },
        {
            field: 'lastName',
            headerName: 'Last name',
            width: 150,
            editable: true,
        },
        {
            field: 'age',
            headerName: 'Age',
            type: 'number',
            width: 110,
            editable: true,
        },
        {
            field: 'fullName',
            headerName: 'Full name',
            description: 'This column has a value getter and is not sortable.',
            sortable: false,
            width: 160,
            valueGetter: (value: any) => `${value?.row?.firstName || ''} ${value?.row?.lastName || ''}`,
        },
    ];
    const rows: any[] = [
        { id: 1, lastName: 'Snow', firstName: 'Jon', age: 14, mode: "new" },
        { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 31, mode: "edit" },
        { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 31, mode: "verify" },
        { id: 4, lastName: 'Stark', firstName: 'Arya', age: 11, mode: "deactivate" },
        { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: 12, mode: "new" },
        { id: 6, lastName: 'Melisandre', firstName: 'Daenerys', age: 150, mode: "new" },
        { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44, mode: "new" },
        { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36, mode: "new" },
        { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65, mode: "new" },
    ];
    const [resetId, setResetId] = React.useState<number>(new Date().getTime());
    const [openDetail, setOpenDetail] = React.useState<boolean>(true);
    const [record, setRecord] = React.useState<any>(rows[2]);
    const onChange = React.useCallback(
        (value: any, field: string) => {
            const temp = { ...record };
            temp[field] = value;
            setRecord(temp);
        },
        [record]
    );
    const onClose = React.useCallback(() => {
        setRecord(undefined);
        setOpenDetail(false);
    }, []);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const onVerify = React.useCallback(async () => {
        setIsLoading(true);
        setIsLoading(false);
        onClose();
    }, [record]);
    const onUpdate = React.useCallback(async () => {
        setIsLoading(true);
        setIsLoading(false);
        onClose();
    }, [record]);
    const onDeactivate = React.useCallback(async () => {
        setIsLoading(true);
        setIsLoading(false);
        onClose();
    }, [record]);
    const onSave = React.useCallback(async () => {
        setIsLoading(true);
        setIsLoading(false);
        onClose();
    }, [record]);
    const onReset = React.useCallback(async () => {
        setResetId(new Date().getTime());
    }, []);

    return <DataGrid
        columns={columns}
        rows={rows}
        openDetail={openDetail}
        record={record}
        onChange={onChange}
        onVerify={onVerify}
        onUpdate={onUpdate}
        onDeactivate={onDeactivate}
        onSave={onSave}
        onReset={onReset}
        onClose={onClose}
        resetId={resetId}
        isLoading={isLoading}
        columnVisibilityModel={columnVisibilityModel}
    />
}

const Comp3 = (props) => {
    const { columnVisibilityModel } = props
    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 90 },
        {
            field: 'firstName',
            headerName: 'First name',
            width: 150,
            editable: true,
        },
        {
            field: 'lastName',
            headerName: 'Last name',
            width: 150,
            editable: true,
        },
        {
            field: 'age',
            headerName: 'Age',
            type: 'number',
            width: 110,
            editable: true,
        },
        {
            field: 'fullName',
            headerName: 'Full name',
            description: 'This column has a value getter and is not sortable.',
            sortable: false,
            width: 160,
            valueGetter: (value: any) => `${value?.row?.firstName || ''} ${value?.row?.lastName || ''}`,
        },
    ];
    const rows: any[] = [
        { id: 1, lastName: 'Snow', firstName: 'Jon', age: 14, mode: "new" },
        { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 31, mode: "edit" },
        { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 31, mode: "verify" },
        { id: 4, lastName: 'Stark', firstName: 'Arya', age: 11, mode: "deactivate" },
        { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: 12, mode: "new" },
        { id: 6, lastName: 'Melisandre', firstName: 'Daenerys', age: 150, mode: "new" },
        { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44, mode: "new" },
        { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36, mode: "new" },
        { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65, mode: "new" },
    ];
    const [resetId, setResetId] = React.useState<number>(new Date().getTime());
    const [openDetail, setOpenDetail] = React.useState<boolean>(true);
    const [record, setRecord] = React.useState<any>(rows[3]);
    const onChange = React.useCallback(
        (value: any, field: string) => {
            const temp = { ...record };
            temp[field] = value;
            setRecord(temp);
        },
        [record]
    );
    const onClose = React.useCallback(() => {
        setRecord(undefined);
        setOpenDetail(false);
    }, []);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const onVerify = React.useCallback(async () => {
        setIsLoading(true);
        setIsLoading(false);
        onClose();
    }, [record]);
    const onUpdate = React.useCallback(async () => {
        setIsLoading(true);
        setIsLoading(false);
        onClose();
    }, [record]);
    const onDeactivate = React.useCallback(async () => {
        setIsLoading(true);
        setIsLoading(false);
        onClose();
    }, [record]);
    const onSave = React.useCallback(async () => {
        setIsLoading(true);
        setIsLoading(false);
        onClose();
    }, [record]);
    const onReset = React.useCallback(async () => {
        setResetId(new Date().getTime());
    }, []);

    return <DataGrid
        columns={columns}
        rows={rows}
        openDetail={openDetail}
        record={record}
        onChange={onChange}
        onVerify={onVerify}
        onUpdate={onUpdate}
        onDeactivate={onDeactivate}
        onSave={onSave}
        onReset={onReset}
        onClose={onClose}
        resetId={resetId}
        isLoading={isLoading}
        columnVisibilityModel={columnVisibilityModel}
    />
}

const Comp4 = (props) => {
    const { columnVisibilityModel } = props
    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 90 },
        {
            field: 'firstName',
            headerName: 'First name',
            width: 150,
            editable: true,
        },
        {
            field: 'lastName',
            headerName: 'Last name',
            width: 150,
            editable: true,
        },
        {
            field: 'age',
            headerName: 'Age',
            type: 'number',
            width: 110,
            editable: true,
        },
        {
            field: 'fullName',
            headerName: 'Full name',
            description: 'This column has a value getter and is not sortable.',
            sortable: false,
            width: 160,
            valueGetter: (value: any) => `${value?.row?.firstName || ''} ${value?.row?.lastName || ''}`,
        },
    ];
    const rows: any[] = [
        { id: 1, lastName: 'Snow', firstName: 'Jon', age: 14, mode: "new" },
        { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 31, mode: "edit" },
        { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 31, mode: "verify" },
        { id: 4, lastName: 'Stark', firstName: 'Arya', age: 11, mode: "deactivate" },
        { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: 12, mode: "new" },
        { id: 6, lastName: 'Melisandre', firstName: 'Daenerys', age: 150, mode: "new" },
        { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44, mode: "new" },
        { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36, mode: "new" },
        { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65, mode: "new" },
    ];
    const [resetId, setResetId] = React.useState<number>(new Date().getTime());
    const [openDetail, setOpenDetail] = React.useState<boolean>(true);
    const [record, setRecord] = React.useState<any>(rows[4]);
    const onChange = React.useCallback(
        (value: any, field: string) => {
            const temp = { ...record };
            temp[field] = value;
            setRecord(temp);
        },
        [record]
    );
    const onClose = React.useCallback(() => {
        setRecord(undefined);
        setOpenDetail(false);
    }, []);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const onVerify = React.useCallback(async () => {
        setIsLoading(true);
        setIsLoading(false);
        onClose();
    }, [record]);
    const onUpdate = React.useCallback(async () => {
        setIsLoading(true);
        setIsLoading(false);
        onClose();
    }, [record]);
    const onDeactivate = React.useCallback(async () => {
        setIsLoading(true);
        setIsLoading(false);
        onClose();
    }, [record]);
    const onSave = React.useCallback(async () => {
        setIsLoading(true);
        setIsLoading(false);
        onClose();
    }, [record]);
    const onReset = React.useCallback(async () => {
        setResetId(new Date().getTime());
    }, []);

    return <DataGrid
        columns={columns}
        rows={rows}
        openDetail={openDetail}
        record={record}
        onChange={onChange}
        onVerify={onVerify}
        onUpdate={onUpdate}
        onDeactivate={onDeactivate}
        onSave={onSave}
        onReset={onReset}
        onClose={onClose}
        resetId={resetId}
        isLoading={isLoading}
        columnVisibilityModel={columnVisibilityModel}
    />
}

const Comp5 = (props) => {
    const { columnVisibilityModel } = props
    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 90 },
        {
            field: 'firstName',
            headerName: 'First name',
            width: 150,
            editable: true,
        },
        {
            field: 'lastName',
            headerName: 'Last name',
            width: 150,
            editable: true,
        },
        {
            field: 'age',
            headerName: 'Age',
            type: 'number',
            width: 110,
            editable: true,
        },
        {
            field: 'fullName',
            headerName: 'Full name',
            description: 'This column has a value getter and is not sortable.',
            sortable: false,
            width: 160,
            valueGetter: (value: any) => `${value?.row?.firstName || ''} ${value?.row?.lastName || ''}`,
        },
    ];
    const rows: any[] = [
        { id: 1, lastName: 'Snow', firstName: 'Jon', age: 14, mode: "new" },
        { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 31, mode: "edit" },
        { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 31, mode: "verify" },
        { id: 4, lastName: 'Stark', firstName: 'Arya', age: 11, mode: "deactivate" },
        { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: 12, mode: "nexyzw" },
        { id: 6, lastName: 'Melisandre', firstName: 'Daenerys', age: 150, mode: undefined },
        { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44, mode: "new" },
        { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36, mode: "new" },
        { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65, mode: "new" },
    ];
    const [resetId, setResetId] = React.useState<number>(new Date().getTime());
    const [openDetail, setOpenDetail] = React.useState<boolean>(true);
    const [record, setRecord] = React.useState<any>(rows[5]);
    const onChange = React.useCallback(
        (value: any, field: string) => {
            const temp = { ...record };
            temp[field] = value;
            setRecord(temp);
        },
        [record]
    );
    const onClose = React.useCallback(() => {
        setRecord(undefined);
        setOpenDetail(false);
    }, []);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const onVerify = React.useCallback(async () => {
        setIsLoading(true);
        setIsLoading(false);
        onClose();
    }, [record]);
    const onUpdate = React.useCallback(async () => {
        setIsLoading(true);
        setIsLoading(false);
        onClose();
    }, [record]);
    const onDeactivate = React.useCallback(async () => {
        setIsLoading(true);
        setIsLoading(false);
        onClose();
    }, [record]);
    const onSave = React.useCallback(async () => {
        setIsLoading(true);
        setIsLoading(false);
        onClose();
    }, [record]);
    const onReset = React.useCallback(async () => {
        setResetId(new Date().getTime());
    }, []);

    return <DataGrid
        columns={columns}
        rows={rows}
        openDetail={openDetail}
        record={record}
        onChange={onChange}
        onVerify={onVerify}
        onUpdate={onUpdate}
        onDeactivate={onDeactivate}
        onSave={onSave}
        onReset={onReset}
        onClose={onClose}
        resetId={resetId}
        isLoading={isLoading}
        columnVisibilityModel={columnVisibilityModel}
    />
}

describe("Table DataGrid component", () => {
    it("renders Table DataGrid component", () => {
        render(<Comp />);
        expect(screen).toBeDefined();
    });
    it("renders Table DataGrid component", () => {
        render(<Comp1 />);
        expect(screen).toBeDefined();
    });
    it("renders Table DataGrid component", () => {
        render(<Comp2 />);
        expect(screen).toBeDefined();
    });
    it("renders Table DataGrid component", () => {
        render(<Comp3 />);
        expect(screen).toBeDefined();
    });
    it("renders Table DataGrid component", () => {
        render(<Comp4 columnVisibilityModel={{ firstName: false }} />);
        expect(screen).toBeDefined();
    });
    it("renders Table DataGrid component", () => {
        render(<Comp5 columnVisibilityModel={{ firstName: false }} />);
        expect(screen).toBeDefined();
    });
});