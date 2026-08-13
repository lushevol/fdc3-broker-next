import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import TableDetail from "./";
import { GridActionsCellItem } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import useController from "./common/Field.useController";
const waitFor = (time = 2000) => new Promise((resolve) => {
    setTimeout(() => {
        resolve(true);
    }, time)
});

const Field = (props) => {
    const { onChangeAutoComplete, RenderOptions } = useController(props);
    React.useEffect(() => {
        onChangeAutoComplete({}, "new value");
        RenderOptions({}, "")
    })
    return <div />
}

const FieldSelect = (props) => {
    const { onChangeAutoComplete, RenderOptions } = useController(props);
    React.useEffect(() => {
        onChangeAutoComplete({}, "new value");
        RenderOptions({}, "");
    })
    return <div />
}

const Comp = () => {

    const columns: any[] = [
        {
            field: "actions",
            type: "actions",
            headerName: "Actions",
            width: 150,
            getActions: (_value) => {
                return [
                    <GridActionsCellItem
                        icon={<EditIcon />}
                        label="Edit"
                        className="textPrimary"
                        color="primary"
                    />
                ]
            },
        },
        { field: 'id', headerName: 'ID', width: 90 },
        {
            field: 'firstName',
            headerName: 'First name',
            placeholder: 'placeholder',
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
            field: "template",
            headerName: "Is Template?",
            width: 100,
            type: "singleSelect",
            valueOptions: ["true", "false"],
        },
        {
            field: "mode",
            headerName: "Mode",
            width: 100,
            type: "singleSelect",
            valueOptions: ["new", "edit", "verify", "deactivate"],
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
            valueGetter: (_value, row) => `${row?.firstName || ''} ${row?.lastName || ''}`,
        },
        {
            field: "imageLightTheme",
            headerName: "Image URL for Light Theme",
            width: 300,
            type: "singleSelect",
            editorType: "autoComplete",
            valueOptions: [
                "lightIcons/cashflow.light.svg",
                "lightIcons/cn.settlement.light.svg",
                "lightIcons/exception.light.svg",
                "lightIcons/mo.exception.light.svg",
                "lightIcons/rules.light.svg",
                "lightIcons/settlment.exception.light.svg",
                "lightIcons/suppression.rules.svg",
                "lightIcons/trade.light.svg",
                "lightIcons/icon01.svg",
                "lightIcons/icon02.svg",
                "lightIcons/icon03.svg",
                "lightIcons/icon04.svg",
                "lightIcons/icon05.svg",
                "lightIcons/icon06.svg",
                "lightIcons/icon07.svg",
                "lightIcons/icon08.svg",
                "lightIcons/icon09.svg",
                "lightIcons/icon10.svg",
                "lightIcons/icon11.svg",
                "lightIcons/icon12.svg",
                "lightIcons/icon13.svg",
                "lightIcons/icon14.svg",
            ],
        },
    ];
    const rows: any[] = [
        { id: 1, lastName: 'Snow', firstName: 'Jon', age: 14, mode: "new", template: true, imageLightTheme: "lightIcons/icon14.svg" },
        { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 31, mode: "edit", template: false, imageLightTheme: "lightIcons/icon14.svg" },
        { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 31, mode: "verify", template: false, imageLightTheme: "lightIcons/icon14.svg" },
        { id: 4, lastName: 'Stark', firstName: 'Arya', age: 11, mode: "deactivate", template: false, imageLightTheme: "lightIcons/icon14.svg" },
        { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: 12, mode: "new", template: false, imageLightTheme: "lightIcons/icon14.svg" },
        { id: 6, lastName: 'Melisandre', firstName: 'Daenerys', age: 150, mode: "new", template: false, imageLightTheme: "lightIcons/icon14.svg" },
        { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44, mode: "new", template: false, imageLightTheme: "lightIcons/icon14.svg" },
        { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36, mode: "new", template: false, imageLightTheme: "lightIcons/icon14.svg" },
        { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65, mode: "new", template: false, imageLightTheme: "lightIcons/icon14.svg" },
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
    return <>
        <TableDetail
            columns={columns}
            title={`${record.mode} ID: ${record.id}`}
            isResizeble
            isDraggable
            defaultWidth={1000}
            defaultHeight={600}
            record={record}
            onChange={onChange}
            actionComponents={<></>}
            resetId={resetId}
        />
        <Field
            column={{
                field: 'firstName',
                headerName: 'First name',
                width: 150,
                editable: true,
            }}
            columnId={0}
            record={record}
            onChange={onChange}
            resetId={resetId}
            key={`Field-firstName`}
        />
        <FieldSelect
            column={{
                field: "imageLightTheme",
                headerName: "Image URL for Light Theme",
                width: 300,
                type: "singleSelect",
                editorType: "autoComplete",
                valueOptions: [
                    "lightIcons/cashflow.light.svg",
                    "lightIcons/cn.settlement.light.svg",
                    "lightIcons/exception.light.svg",
                    "lightIcons/mo.exception.light.svg",
                    "lightIcons/rules.light.svg",
                    "lightIcons/settlment.exception.light.svg",
                    "lightIcons/suppression.rules.svg",
                    "lightIcons/trade.light.svg",
                    "lightIcons/icon01.svg",
                    "lightIcons/icon02.svg",
                    "lightIcons/icon03.svg",
                    "lightIcons/icon04.svg",
                    "lightIcons/icon05.svg",
                    "lightIcons/icon06.svg",
                    "lightIcons/icon07.svg",
                    "lightIcons/icon08.svg",
                    "lightIcons/icon09.svg",
                    "lightIcons/icon10.svg",
                    "lightIcons/icon11.svg",
                    "lightIcons/icon12.svg",
                    "lightIcons/icon13.svg",
                    "lightIcons/icon14.svg",
                ],
            }}
            columnId={0}
            record={record}
            onChange={onChange}
            resetId={resetId}
            key={`Field-imageLightTheme`}
        />
    </>
}

describe("Table Detail component", () => {
    it("renders Table Detail component", async () => {
        render(<Comp />);
        expect(screen).toBeDefined();
        const lastName = screen.getByTestId(`ModalInput-lastName-3`);
        expect(lastName).toBeInTheDocument();
        if (lastName.children[1].firstChild) {
            fireEvent.change(lastName.children[1].firstChild, { target: { value: "dummy" } });
        }
        const template = screen.getByTestId(`ModalInput-template-4`);
        expect(template).toBeInTheDocument();
        if (template.children[1]) {
            fireEvent.change(template.children[1], { target: { value: "false" } });
        }

        const mode = screen.getByTestId(`ModalInput-mode-5`);
        expect(mode).toBeInTheDocument();
        if (mode.children[1]) {
            fireEvent.change(mode.children[1], { target: { value: "deactivate" } });
        }
        await waitFor(1000)
    });
});
