import { DataGrid,type DataGridColumn } from '@fm/ratan-design/data-grid';
interface Row{id:string;symbol:string;quantity:number} const columns:DataGridColumn<Row>[]=[{id:'symbol',header:'Symbol',accessor:'symbol'},{id:'quantity',header:'Quantity',accessor:'quantity'}];
export default function DataGridParityFixture(){return <DataGrid aria-label="Trades" height={320} data={[{id:'1',symbol:'ALUM',quantity:10},{id:'2',symbol:'ZINC',quantity:20}]} columns={columns}/>;}
