import { Tab,TabList,TabPanel,Tabs } from '@fm/ratan-design/tabs';
export default function TabsParityFixture(){return <Tabs defaultSelectedKey="positions" aria-label="Workspace"><TabList><Tab id="positions">Positions</Tab><Tab id="orders">Orders</Tab></TabList><TabPanel id="positions">Position content</TabPanel><TabPanel id="orders">Order content</TabPanel></Tabs>;}
