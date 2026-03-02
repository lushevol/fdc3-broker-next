import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  ConfigProvider,
  theme,
  App,
  // Layout & Structure
  Card,
  Divider,
  Space,
  Typography,
  // Data Entry
  AutoComplete,
  Cascader,
  Checkbox,
  ColorPicker,
  DatePicker,
  Form,
  InputNumber,
  Mentions,
  Radio,
  Select,
  Slider,
  Switch,
  TimePicker,
  Transfer,
  TreeSelect,
  Upload,
  Input,
  Button,
  // Data Display
  Avatar,
  Badge,
  Calendar,
  Carousel,
  Collapse,
  Descriptions,
  Empty,
  Image,
  List,
  Popover,
  QRCode,
  Statistic,
  Table,
  Tabs,
  Tag,
  Timeline,
  Tooltip,
  Tree,
  // Feedback
  Alert,
  Drawer,
  message,
  Modal,
  notification,
  Popconfirm,
  Progress,
  Result,
  Skeleton,
  Spin,
  Rate,
  // Navigation
  Anchor,
  Breadcrumb,
  Dropdown,
  Menu,
  Pagination,
  Segmented,
  Steps,
} from 'antd';
import type {
  ThemeConfig,
  UploadProps,
  MenuProps,
  BreadcrumbProps,
  TransferProps,
  TreeSelectProps,
  TreeDataNode,
  TableColumnsType,
} from 'antd';
import {
  HomeOutlined,
  SettingOutlined,
  UserOutlined,
  SmileOutlined,
  SyncOutlined,
  ClockCircleOutlined,
  MinusCircleOutlined,
  PlusOutlined,
  InboxOutlined,
  CheckCircleFilled,
  CloseCircleFilled,
  InfoCircleFilled,
  WarningFilled,
} from '@ant-design/icons';

import { primitiveColors, foundationColors } from '../src/tokens/colors';
import { fontFamily, fontSize } from '../src/tokens/typography';
import { componentRound, componentSizes } from '../src/tokens/sizes';

const { Title, Text, Paragraph, Link } = Typography;
const { darkAlgorithm, defaultAlgorithm } = theme;
const { RangePicker } = DatePicker;

// =============================================================================
// Theme Configuration
// =============================================================================

const getAntdThemeConfig = (isDark: boolean): ThemeConfig => {
  return {
    algorithm: isDark ? darkAlgorithm : defaultAlgorithm,
    token: {
      colorPrimary: foundationColors.basic.brandBlue,
      colorSuccess: foundationColors.basic.brandGreen,
      fontFamily: fontFamily.primary,
      fontSize: fontSize.smMd,
      borderRadius: componentRound['6px'],
      borderRadiusLG: 8,
      borderRadiusSM: componentRound['4px'],
      controlHeight: componentSizes['32px'],
      controlHeightLG: componentSizes['40px'],
      controlHeightSM: componentSizes['24px'],
    },
    components: {
      Button: { primaryShadow: 'none', defaultShadow: 'none', dangerShadow: 'none' },
    },
  };
};

// =============================================================================
// Shared Data
// =============================================================================

const statusOptions = [
  { label: 'Active', value: 'active' },
  { label: 'Pending', value: 'pending' },
  { label: 'Inactive', value: 'inactive' },
];

const treeData: TreeDataNode[] = [
  {
    title: 'Parent 1',
    value: 'parent1',
    children: [
      { title: 'Child 1-1', value: 'child1-1' },
      { title: 'Child 1-2', value: 'child1-2' },
    ],
  },
  {
    title: 'Parent 2',
    value: 'parent2',
    children: [
      { title: 'Child 2-1', value: 'child2-1' },
    ],
  },
];

const cascaderOptions = [
  {
    value: 'usa',
    label: 'United States',
    children: [
      { value: 'ny', label: 'New York' },
      { value: 'ca', label: 'California' },
    ],
  },
  {
    value: 'uk',
    label: 'United Kingdom',
    children: [
      { value: 'london', label: 'London' },
      { value: 'manchester', label: 'Manchester' },
    ],
  },
];

// =============================================================================
// Section: General Components
// =============================================================================

const GeneralSection = () => {
  return (
    <Card title="General" style={{ marginBottom: 24 }}>
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        {/* Typography */}
        <div>
          <Text strong>Typography:</Text>
          <div style={{ marginTop: 8 }}>
            <Title level={1} style={{ margin: 0 }}>H1 Title</Title>
            <Title level={2} style={{ margin: 0 }}>H2 Title</Title>
            <Title level={3} style={{ margin: 0 }}>H3 Title</Title>
            <Title level={4} style={{ margin: 0 }}>H4 Title</Title>
            <Title level={5} style={{ margin: 0 }}>H5 Title</Title>
            <Paragraph>Paragraph text with <Link href="#">a link</Link> and <Text strong>bold</Text>, <Text italic>italic</Text>, <Text code>code</Text> styles.</Paragraph>
            <Paragraph type="secondary">Secondary text for descriptions</Paragraph>
            <Paragraph type="success">Success text</Paragraph>
            <Paragraph type="warning">Warning text</Paragraph>
            <Paragraph type="danger">Danger text</Paragraph>
          </div>
        </div>
        <Divider />
        {/* Button */}
        <div>
          <Text strong>Button:</Text>
          <Space wrap style={{ marginTop: 8 }}>
            <Button type="primary">Primary</Button>
            <Button>Default</Button>
            <Button type="dashed">Dashed</Button>
            <Button type="text">Text</Button>
            <Button type="link">Link</Button>
            <Button danger>Danger</Button>
            <Button type="primary" danger>Primary Danger</Button>
            <Button type="primary" ghost>Ghost</Button>
            <Button icon={<PlusOutlined />}>Icon</Button>
            <Button type="primary" loading>Loading</Button>
            <Button disabled>Disabled</Button>
            <Button type="primary" block>Block Button</Button>
          </Space>
          <div style={{ marginTop: 8 }}>
            <Space>
              <Button type="primary" size="small">Small</Button>
              <Button type="primary" size="middle">Middle</Button>
              <Button type="primary" size="large">Large</Button>
            </Space>
          </div>
        </div>
        <Divider />
        {/* Float Button & Icon */}
        <div>
          <Text strong>Icon:</Text>
          <Space style={{ marginTop: 8 }}>
            <HomeOutlined style={{ fontSize: 24 }} />
            <SettingOutlined style={{ fontSize: 24 }} />
            <UserOutlined style={{ fontSize: 24 }} />
            <SmileOutlined style={{ fontSize: 24 }} />
            <SyncOutlined spin style={{ fontSize: 24 }} />
          </Space>
        </div>
      </Space>
    </Card>
  );
};

// =============================================================================
// Section: Layout Components
// =============================================================================

const LayoutSection = () => {
  return (
    <Card title="Layout" style={{ marginBottom: 24 }}>
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        <div>
          <Text strong>Space:</Text>
          <div style={{ marginTop: 8 }}>
            <Space>
              <Button>Button 1</Button>
              <Button>Button 2</Button>
              <Button>Button 3</Button>
            </Space>
          </div>
          <div style={{ marginTop: 8 }}>
            <Space direction="vertical">
              <Button block>Vertical Button 1</Button>
              <Button block>Vertical Button 2</Button>
            </Space>
          </div>
        </div>
        <Divider />
        <div>
          <Text strong>Divider:</Text>
          <div style={{ marginTop: 8 }}>
            <Text>Left</Text>
            <Divider type="vertical" />
            <Text>Center</Text>
            <Divider type="vertical" />
            <Text>Right</Text>
          </div>
          <Divider>With Text</Divider>
          <Divider orientation="left">Left Text</Divider>
          <Divider orientation="right">Right Text</Divider>
        </div>
      </Space>
    </Card>
  );
};

// =============================================================================
// Section: Navigation Components
// =============================================================================

const NavigationSection = () => {
  const [current, setCurrent] = React.useState('mail');

  const menuItems: MenuProps['items'] = [
    { label: 'Navigation One', key: 'mail' },
    { label: 'Navigation Two', key: 'app', icon: <SettingOutlined /> },
    {
      label: 'Navigation Three - Submenu',
      key: 'SubMenu',
      icon: <SettingOutlined />,
      children: [
        { label: 'Option 1', key: 'option1' },
        { label: 'Option 2', key: 'option2' },
      ],
    },
  ];

  const dropdownItems: MenuProps['items'] = [
    { label: 'Action 1', key: '1' },
    { label: 'Action 2', key: '2' },
    { type: 'divider' },
    { label: 'Action 3', key: '3' },
  ];

  const breadcrumbItems: BreadcrumbProps['items'] = [
    { title: <><HomeOutlined /> Home</> },
    { title: <Link href="#">Application Center</Link> },
    { title: 'Application List' },
    { title: 'An Application' },
  ];

  return (
    <Card title="Navigation" style={{ marginBottom: 24 }}>
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        {/* Anchor */}
        <div>
          <Text strong>Anchor:</Text>
          <div style={{ marginTop: 8 }}>
            <Anchor direction="horizontal">
              <Anchor.Link href="#general" title="General" />
              <Anchor.Link href="#layout" title="Layout" />
              <Anchor.Link href="#navigation" title="Navigation" />
              <Anchor.Link href="#data-entry" title="Data Entry" />
            </Anchor>
          </div>
        </div>
        <Divider />
        {/* Breadcrumb */}
        <div>
          <Text strong>Breadcrumb:</Text>
          <div style={{ marginTop: 8 }}>
            <Breadcrumb items={breadcrumbItems} />
          </div>
        </div>
        <Divider />
        {/* Dropdown */}
        <div>
          <Text strong>Dropdown:</Text>
          <div style={{ marginTop: 8 }}>
            <Space>
              <Dropdown menu={{ items: dropdownItems }}>
                <Button>Hover me</Button>
              </Dropdown>
              <Dropdown menu={{ items: dropdownItems }} trigger={['click']}>
                <Button>Click me</Button>
              </Dropdown>
            </Space>
          </div>
        </div>
        <Divider />
        {/* Menu */}
        <div>
          <Text strong>Menu:</Text>
          <div style={{ marginTop: 8 }}>
            <Menu
              mode="horizontal"
              selectedKeys={[current]}
              onClick={(e) => setCurrent(e.key)}
              items={menuItems}
              style={{ width: '100%' }}
            />
          </div>
        </div>
        <Divider />
        {/* Pagination */}
        <div>
          <Text strong>Pagination:</Text>
          <div style={{ marginTop: 8 }}>
            <Space direction="vertical">
              <Pagination defaultCurrent={1} total={50} />
              <Pagination defaultCurrent={6} total={500} showSizeChanger />
              <Pagination defaultCurrent={1} total={50} simple />
            </Space>
          </div>
        </div>
        <Divider />
        {/* Steps */}
        <div>
          <Text strong>Steps:</Text>
          <div style={{ marginTop: 8 }}>
            <Steps current={1} items={[
              { title: 'Finished', description: 'This is a description' },
              { title: 'In Progress', description: 'This is a description', subTitle: 'Left 00:00:08' },
              { title: 'Waiting', description: 'This is a description' },
            ]} />
          </div>
          <div style={{ marginTop: 16 }}>
            <Steps size="small" current={1} items={[
              { title: 'Finished' },
              { title: 'In Progress' },
              { title: 'Waiting' },
            ]} />
          </div>
        </div>
      </Space>
    </Card>
  );
};

// =============================================================================
// Section: Data Entry Components
// =============================================================================

const DataEntrySection = () => {
  const [transferTargetKeys, setTransferTargetKeys] = React.useState<string[]>([]);
  const transferDataSource: TransferProps['dataSource'] = [
    { key: '1', title: 'Option 1' },
    { key: '2', title: 'Option 2' },
    { key: '3', title: 'Option 3' },
    { key: '4', title: 'Option 4' },
  ];

  const uploadProps: UploadProps = {
    name: 'file',
    multiple: true,
    showUploadList: false,
    beforeUpload: () => false,
  };

  return (
    <Card title="Data Entry" style={{ marginBottom: 24 }}>
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        {/* AutoComplete */}
        <div>
          <Text strong>AutoComplete:</Text>
          <div style={{ marginTop: 8 }}>
            <AutoComplete
              style={{ width: 200 }}
              options={[{ value: 'Option 1' }, { value: 'Option 2' }, { value: 'Option 3' }]}
              placeholder="Type to search"
            />
          </div>
        </div>
        <Divider />
        {/* Cascader */}
        <div>
          <Text strong>Cascader:</Text>
          <div style={{ marginTop: 8 }}>
            <Cascader
              style={{ width: '100%' }}
              options={cascaderOptions}
              placeholder="Select location"
            />
          </div>
        </div>
        <Divider />
        {/* Checkbox */}
        <div>
          <Text strong>Checkbox:</Text>
          <div style={{ marginTop: 8 }}>
            <Space direction="vertical">
              <Checkbox>Checkbox</Checkbox>
              <Checkbox defaultChecked>Checked</Checkbox>
              <Checkbox disabled>Disabled</Checkbox>
              <Checkbox indeterminate>Indeterminate</Checkbox>
              <Checkbox.Group defaultValue={['apple']}>
                <Space>
                  <Checkbox value="apple">Apple</Checkbox>
                  <Checkbox value="pear">Pear</Checkbox>
                  <Checkbox value="orange">Orange</Checkbox>
                </Space>
              </Checkbox.Group>
            </Space>
          </div>
        </div>
        <Divider />
        {/* ColorPicker */}
        <div>
          <Text strong>ColorPicker:</Text>
          <div style={{ marginTop: 8 }}>
            <Space>
              <ColorPicker defaultValue="#1677ff" />
              <ColorPicker defaultValue="#1677ff" showText />
            </Space>
          </div>
        </div>
        <Divider />
        {/* DatePicker */}
        <div>
          <Text strong>DatePicker:</Text>
          <div style={{ marginTop: 8 }}>
            <Space direction="vertical">
              <Space>
                <DatePicker placeholder="Select date" />
                <DatePicker picker="week" placeholder="Select week" />
                <DatePicker picker="month" placeholder="Select month" />
                <DatePicker picker="year" placeholder="Select year" />
              </Space>
              <RangePicker />
            </Space>
          </div>
        </div>
        <Divider />
        {/* Form */}
        <div>
          <Text strong>Form:</Text>
          <div style={{ marginTop: 8, maxWidth: 400 }}>
            <Form layout="vertical" size="small">
              <Form.Item label="Username" name="username" rules={[{ required: true }]}>
                <Input placeholder="Enter username" />
              </Form.Item>
              <Form.Item label="Email" name="email" rules={[{ type: 'email' }]}>
                <Input placeholder="Enter email" />
              </Form.Item>
              <Form.Item label="Status" name="status">
                <Select placeholder="Select status" options={statusOptions} />
              </Form.Item>
              <Form.Item>
                <Space>
                  <Button type="primary">Submit</Button>
                  <Button>Cancel</Button>
                </Space>
              </Form.Item>
            </Form>
          </div>
        </div>
        <Divider />
        {/* Input */}
        <div>
          <Text strong>Input:</Text>
          <div style={{ marginTop: 8 }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Input placeholder="Basic input" />
              <Input.Password placeholder="Password" />
              <Input.Search placeholder="Search" enterButton />
              <Input.TextArea placeholder="TextArea" rows={3} />
              <Space>
                <InputNumber placeholder="Number" min={0} max={100} />
                <InputNumber placeholder="Decimal" min={0} step={0.1} />
              </Space>
            </Space>
          </div>
        </div>
        <Divider />
        {/* Mentions */}
        <div>
          <Text strong>Mentions:</Text>
          <div style={{ marginTop: 8 }}>
            <Mentions
              style={{ width: '100%' }}
              placeholder="Type @ to mention someone"
              options={[
                { value: 'user1', label: 'User 1' },
                { value: 'user2', label: 'User 2' },
              ]}
            />
          </div>
        </div>
        <Divider />
        {/* Radio */}
        <div>
          <Text strong>Radio:</Text>
          <div style={{ marginTop: 8 }}>
            <Space direction="vertical">
              <Radio.Group defaultValue="a">
                <Radio value="a">Option A</Radio>
                <Radio value="b">Option B</Radio>
                <Radio value="c">Option C</Radio>
              </Radio.Group>
              <Radio.Group defaultValue="a" buttonStyle="solid">
                <Radio.Button value="a">A</Radio.Button>
                <Radio.Button value="b">B</Radio.Button>
                <Radio.Button value="c">C</Radio.Button>
              </Radio.Group>
            </Space>
          </div>
        </div>
        <Divider />
        {/* Rate */}
        <div>
          <Text strong>Rate:</Text>
          <div style={{ marginTop: 8 }}>
            <Space>
              <Rate defaultValue={3} />
              <Rate defaultValue={3} allowHalf />
              <Rate defaultValue={3} character={<SmileOutlined />} />
            </Space>
          </div>
        </div>
        <Divider />
        {/* Select */}
        <div>
          <Text strong>Select:</Text>
          <div style={{ marginTop: 8 }}>
            <Space wrap>
              <Select placeholder="Select" style={{ width: 120 }} options={statusOptions} />
              <Select mode="multiple" placeholder="Multi Select" style={{ width: 200 }} options={statusOptions} />
              <Select mode="tags" placeholder="Tags" style={{ width: 200 }} />
            </Space>
          </div>
        </div>
        <Divider />
        {/* Slider */}
        <div>
          <Text strong>Slider:</Text>
          <div style={{ marginTop: 8 }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Slider defaultValue={30} />
              <Slider range defaultValue={[20, 50]} />
              <Slider defaultValue={30} disabled />
            </Space>
          </div>
        </div>
        <Divider />
        {/* Switch */}
        <div>
          <Text strong>Switch:</Text>
          <div style={{ marginTop: 8 }}>
            <Space>
              <Switch defaultChecked />
              <Switch defaultChecked checkedChildren="ON" unCheckedChildren="OFF" />
              <Switch defaultChecked size="small" />
              <Switch defaultChecked loading />
              <Switch defaultChecked disabled />
            </Space>
          </div>
        </div>
        <Divider />
        {/* TimePicker */}
        <div>
          <Text strong>TimePicker:</Text>
          <div style={{ marginTop: 8 }}>
            <Space>
              <TimePicker />
              <TimePicker.RangePicker />
            </Space>
          </div>
        </div>
        <Divider />
        {/* Transfer */}
        <div>
          <Text strong>Transfer:</Text>
          <div style={{ marginTop: 8 }}>
            <Transfer
              dataSource={transferDataSource}
              titles={['Source', 'Target']}
              targetKeys={transferTargetKeys}
              onChange={setTransferTargetKeys}
              render={(item) => item.title}
            />
          </div>
        </div>
        <Divider />
        {/* TreeSelect */}
        <div>
          <Text strong>TreeSelect:</Text>
          <div style={{ marginTop: 8 }}>
            <TreeSelect
              style={{ width: '100%' }}
              treeData={treeData}
              placeholder="Select item"
              treeDefaultExpandAll
            />
          </div>
        </div>
        <Divider />
        {/* Upload */}
        <div>
          <Text strong>Upload:</Text>
          <div style={{ marginTop: 8 }}>
            <Upload.Dragger {...uploadProps}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">Click or drag file to this area to upload</p>
              <p className="ant-upload-hint">Support for single or bulk upload</p>
            </Upload.Dragger>
          </div>
        </div>
      </Space>
    </Card>
  );
};

// =============================================================================
// Section: Data Display Components
// =============================================================================

const DataDisplaySection = () => {
  const tableColumns: TableColumnsType = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Age', dataIndex: 'age', key: 'age', sorter: true },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (status: string) => (
      <Tag color={status === 'Active' ? 'success' : 'warning'}>{status}</Tag>
    )},
  ];

  const tableData = [
    { key: '1', name: 'John Doe', age: 32, status: 'Active' },
    { key: '2', name: 'Jane Smith', age: 28, status: 'Pending' },
    { key: '3', name: 'Bob Wilson', age: 45, status: 'Active' },
  ];

  return (
    <Card title="Data Display" style={{ marginBottom: 24 }}>
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        {/* Avatar */}
        <div>
          <Text strong>Avatar:</Text>
          <div style={{ marginTop: 8 }}>
            <Space>
              <Avatar icon={<UserOutlined />} />
              <Avatar>U</Avatar>
              <Avatar size={40}>User</Avatar>
              <Avatar style={{ backgroundColor: foundationColors.basic.brandBlue }}>A</Avatar>
              <Avatar style={{ backgroundColor: foundationColors.basic.brandGreen }}>B</Avatar>
              <Avatar.Group maxCount={2}>
                <Avatar style={{ backgroundColor: '#f56a00' }}>K</Avatar>
                <Avatar style={{ backgroundColor: '#1890ff' }}>J</Avatar>
                <Avatar style={{ backgroundColor: '#52c41a' }}>M</Avatar>
              </Avatar.Group>
            </Space>
          </div>
        </div>
        <Divider />
        {/* Badge */}
        <div>
          <Text strong>Badge:</Text>
          <div style={{ marginTop: 8 }}>
            <Space size="large">
              <Badge count={5}>
                <Avatar shape="square" size="large" />
              </Badge>
              <Badge count={99}>
                <Avatar shape="square" size="large" />
              </Badge>
              <Badge dot>
                <Avatar shape="square" size="large" />
              </Badge>
              <Badge count={0} showZero>
                <Avatar shape="square" size="large" />
              </Badge>
            </Space>
          </div>
        </div>
        <Divider />
        {/* Calendar */}
        <div>
          <Text strong>Calendar:</Text>
          <div style={{ marginTop: 8 }}>
            <Calendar fullscreen={false} style={{ maxWidth: 350 }} />
          </div>
        </div>
        <Divider />
        {/* Card */}
        <div>
          <Text strong>Card:</Text>
          <div style={{ marginTop: 8 }}>
            <Space wrap>
              <Card style={{ width: 250 }}>
                <p>Card content</p>
                <p>Card content</p>
              </Card>
              <Card title="Card Title" style={{ width: 250 }}>
                <p>Card with title</p>
              </Card>
              <Card title="Card with Actions" style={{ width: 250 }} actions={[<SettingOutlined key="setting" />, <SmileOutlined key="smile" />]}>
                <p>Card with actions</p>
              </Card>
            </Space>
          </div>
        </div>
        <Divider />
        {/* Carousel */}
        <div>
          <Text strong>Carousel:</Text>
          <div style={{ marginTop: 8 }}>
            <Carousel autoplay style={{ maxWidth: 400 }}>
              <div style={{ height: 160, background: '#364d79', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: '#fff', fontSize: 24 }}>Slide 1</Text>
              </div>
              <div style={{ height: 160, background: '#7265a0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: '#fff', fontSize: 24 }}>Slide 2</Text>
              </div>
              <div style={{ height: 160, background: '#00a698', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: '#fff', fontSize: 24 }}>Slide 3</Text>
              </div>
            </Carousel>
          </div>
        </div>
        <Divider />
        {/* Collapse */}
        <div>
          <Text strong>Collapse:</Text>
          <div style={{ marginTop: 8 }}>
            <Collapse
              items={[
                { key: '1', label: 'Panel 1', children: <p>This is panel 1 content</p> },
                { key: '2', label: 'Panel 2', children: <p>This is panel 2 content</p> },
                { key: '3', label: 'Panel 3', children: <p>This is panel 3 content</p> },
              ]}
            />
          </div>
        </div>
        <Divider />
        {/* Descriptions */}
        <div>
          <Text strong>Descriptions:</Text>
          <div style={{ marginTop: 8 }}>
            <Descriptions title="User Info" bordered column={2}>
              <Descriptions.Item label="Name">John Doe</Descriptions.Item>
              <Descriptions.Item label="Age">32</Descriptions.Item>
              <Descriptions.Item label="Address">123 Main St, Anytown, USA</Descriptions.Item>
              <Descriptions.Item label="Status"><Tag color="success">Active</Tag></Descriptions.Item>
            </Descriptions>
          </div>
        </div>
        <Divider />
        {/* Empty */}
        <div>
          <Text strong>Empty:</Text>
          <div style={{ marginTop: 8 }}>
            <Empty description="No data found" />
          </div>
        </div>
        <Divider />
        {/* Image */}
        <div>
          <Text strong>Image:</Text>
          <div style={{ marginTop: 8 }}>
            <Space>
              <Image
                width={160}
                src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
              />
              <Image.PreviewGroup>
                <Image width={80} src="https://picsum.photos/200/200?random=1" />
                <Image width={80} src="https://picsum.photos/200/200?random=2" />
              </Image.PreviewGroup>
            </Space>
          </div>
        </div>
        <Divider />
        {/* List */}
        <div>
          <Text strong>List:</Text>
          <div style={{ marginTop: 8 }}>
            <List
              size="small"
              header={<div>Header</div>}
              footer={<div>Footer</div>}
              dataSource={['Item 1', 'Item 2', 'Item 3']}
              renderItem={(item) => <List.Item>{item}</List.Item>}
            />
          </div>
        </div>
        <Divider />
        {/* Popover */}
        <div>
          <Text strong>Popover:</Text>
          <div style={{ marginTop: 8 }}>
            <Popover
              content={<div>This is the popover content</div>}
              title="Title"
              trigger="click"
            >
              <Button>Click me</Button>
            </Popover>
          </div>
        </div>
        <Divider />
        {/* QRCode */}
        <div>
          <Text strong>QRCode:</Text>
          <div style={{ marginTop: 8 }}>
            <QRCode value="https://ant.design/" />
          </div>
        </div>
        <Divider />
        {/* Segmented */}
        <div>
          <Text strong>Segmented:</Text>
          <div style={{ marginTop: 8 }}>
            <Space direction="vertical">
              <Segmented options={['Daily', 'Weekly', 'Monthly', 'Yearly']} />
              <Segmented
                options={[
                  { label: 'List', value: 'list', icon: <MinusCircleOutlined /> },
                  { label: 'Kanban', value: 'kanban', icon: <HomeOutlined /> },
                ]}
              />
            </Space>
          </div>
        </div>
        <Divider />
        {/* Statistic */}
        <div>
          <Text strong>Statistic:</Text>
          <div style={{ marginTop: 8 }}>
            <Space>
              <Statistic title="Active Users" value={112893} />
              <Statistic title="Account Balance" value={112893} precision={2} prefix="$" />
              <Statistic title="Growth" value={11.28} precision={2} valueStyle={{ color: '#3f8600' }} prefix={<SmileOutlined />} suffix="%" />
            </Space>
          </div>
        </div>
        <Divider />
        {/* Table */}
        <div>
          <Text strong>Table:</Text>
          <div style={{ marginTop: 8 }}>
            <Table columns={tableColumns} dataSource={tableData} pagination={false} size="small" />
          </div>
        </div>
        <Divider />
        {/* Tabs */}
        <div>
          <Text strong>Tabs:</Text>
          <div style={{ marginTop: 8 }}>
            <Tabs
              items={[
                { key: '1', label: 'Tab 1', children: 'Content of Tab 1' },
                { key: '2', label: 'Tab 2', children: 'Content of Tab 2' },
                { key: '3', label: 'Tab 3', children: 'Content of Tab 3' },
              ]}
            />
          </div>
        </div>
        <Divider />
        {/* Tag */}
        <div>
          <Text strong>Tag:</Text>
          <div style={{ marginTop: 8 }}>
            <Space wrap>
              <Tag>Default</Tag>
              <Tag color="success">Success</Tag>
              <Tag color="warning">Warning</Tag>
              <Tag color="error">Error</Tag>
              <Tag color="processing">Processing</Tag>
              <Tag color="magenta">Magenta</Tag>
              <Tag color="red">Red</Tag>
              <Tag color="volcano">Volcano</Tag>
              <Tag color="orange">Orange</Tag>
              <Tag color="gold">Gold</Tag>
              <Tag color="lime">Lime</Tag>
              <Tag color="green">Green</Tag>
              <Tag color="cyan">Cyan</Tag>
              <Tag color="blue">Blue</Tag>
              <Tag color="geekblue">Geekblue</Tag>
              <Tag color="purple">Purple</Tag>
              <Tag closable>Closable</Tag>
            </Space>
          </div>
        </div>
        <Divider />
        {/* Timeline */}
        <div>
          <Text strong>Timeline:</Text>
          <div style={{ marginTop: 8 }}>
            <Timeline
              items={[
                { children: 'Create a services site 2015-09-01', color: 'green' },
                { children: 'Solve initial network problems 2015-09-01', color: 'blue' },
                { dot: <ClockCircleOutlined style={{ fontSize: '16px' }} />, children: 'Technical testing 2015-09-01' },
                { children: 'Network problems being solved 2015-11-1', color: 'red' },
              ]}
            />
          </div>
        </div>
        <Divider />
        {/* Tooltip */}
        <div>
          <Text strong>Tooltip:</Text>
          <div style={{ marginTop: 8 }}>
            <Space>
              <Tooltip title="Default tooltip">
                <Button>Hover me</Button>
              </Tooltip>
              <Tooltip title="This is a long tooltip message">
                <Button>Long tooltip</Button>
              </Tooltip>
              <Tooltip placement="right" title="Right placement">
                <Button>Right tooltip</Button>
              </Tooltip>
            </Space>
          </div>
        </div>
        <Divider />
        {/* Tree */}
        <div>
          <Text strong>Tree:</Text>
          <div style={{ marginTop: 8 }}>
            <Tree
              defaultExpandAll
              treeData={[
                {
                  title: 'Parent 1',
                  key: 'p1',
                  children: [
                    { title: 'Child 1-1', key: 'c11' },
                    { title: 'Child 1-2', key: 'c12' },
                  ],
                },
                {
                  title: 'Parent 2',
                  key: 'p2',
                  children: [
                    { title: 'Child 2-1', key: 'c21' },
                    { title: 'Child 2-2', key: 'c22' },
                  ],
                },
              ]}
            />
          </div>
        </div>
      </Space>
    </Card>
  );
};

// =============================================================================
// Section: Feedback Components
// =============================================================================

const FeedbackSection = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [notification, notificationContextHolder] = notification.useNotification();
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [modalOpen, setModalOpen] = React.useState(false);

  return (
    <Card title="Feedback" style={{ marginBottom: 24 }}>
      {contextHolder}
      {notificationContextHolder}
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        {/* Alert */}
        <div>
          <Text strong>Alert:</Text>
          <div style={{ marginTop: 8 }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Alert message="Success Tips" type="success" showIcon />
              <Alert message="Informational Notes" type="info" showIcon />
              <Alert message="Warning" type="warning" showIcon />
              <Alert message="Error" type="error" showIcon />
              <Alert message="Closable Alert" type="info" closable />
              <Alert
                message="Alert with Description"
                description="This is a detailed description of the alert message."
                type="info"
                showIcon
              />
            </Space>
          </div>
        </div>
        <Divider />
        {/* Drawer */}
        <div>
          <Text strong>Drawer:</Text>
          <div style={{ marginTop: 8 }}>
            <Button onClick={() => setDrawerOpen(true)}>Open Drawer</Button>
            <Drawer
              title="Drawer Title"
              open={drawerOpen}
              onClose={() => setDrawerOpen(false)}
              width={400}
            >
              <p>Some contents...</p>
              <p>Some contents...</p>
              <p>Some contents...</p>
            </Drawer>
          </div>
        </div>
        <Divider />
        {/* Message */}
        <div>
          <Text strong>Message:</Text>
          <div style={{ marginTop: 8 }}>
            <Space>
              <Button onClick={() => messageApi.success('Success!')}>Success</Button>
              <Button onClick={() => messageApi.error('Error!')}>Error</Button>
              <Button onClick={() => messageApi.warning('Warning!')}>Warning</Button>
              <Button onClick={() => messageApi.info('Info!')}>Info</Button>
              <Button onClick={() => messageApi.loading('Loading...')}>Loading</Button>
            </Space>
          </div>
        </div>
        <Divider />
        {/* Modal */}
        <div>
          <Text strong>Modal:</Text>
          <div style={{ marginTop: 8 }}>
            <Space>
              <Button onClick={() => setModalOpen(true)}>Open Modal</Button>
              <Button onClick={() => Modal.confirm({
                title: 'Confirm',
                content: 'Are you sure you want to delete this item?',
                onOk: () => messageApi.success('Deleted!'),
              })}>
                Confirm Dialog
              </Button>
            </Space>
            <Modal
              title="Modal Title"
              open={modalOpen}
              onOk={() => setModalOpen(false)}
              onCancel={() => setModalOpen(false)}
            >
              <p>Some contents...</p>
              <p>Some contents...</p>
              <p>Some contents...</p>
            </Modal>
          </div>
        </div>
        <Divider />
        {/* Notification */}
        <div>
          <Text strong>Notification:</Text>
          <div style={{ marginTop: 8 }}>
            <Space>
              <Button onClick={() => notification.success({ message: 'Success', description: 'This is a success notification.' })}>
                Success
              </Button>
              <Button onClick={() => notification.error({ message: 'Error', description: 'This is an error notification.' })}>
                Error
              </Button>
              <Button onClick={() => notification.warning({ message: 'Warning', description: 'This is a warning notification.' })}>
                Warning
              </Button>
              <Button onClick={() => notification.info({ message: 'Info', description: 'This is an info notification.' })}>
                Info
              </Button>
            </Space>
          </div>
        </div>
        <Divider />
        {/* Popconfirm */}
        <div>
          <Text strong>Popconfirm:</Text>
          <div style={{ marginTop: 8 }}>
            <Space>
              <Popconfirm title="Are you sure?" onConfirm={() => messageApi.success('Confirmed!')}>
                <Button danger>Delete</Button>
              </Popconfirm>
              <Popconfirm title="Delete this item?" description="This action cannot be undone." okText="Yes" cancelText="No">
                <Button>Confirm Action</Button>
              </Popconfirm>
            </Space>
          </div>
        </div>
        <Divider />
        {/* Progress */}
        <div>
          <Text strong>Progress:</Text>
          <div style={{ marginTop: 8 }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Progress percent={30} />
              <Progress percent={50} status="active" />
              <Progress percent={70} status="exception" />
              <Progress percent={100} />
              <Progress percent={50} showInfo={false} />
              <Space>
                <Progress type="circle" percent={75} />
                <Progress type="circle" percent={70} status="exception" />
                <Progress type="circle" percent={100} />
              </Space>
              <Space>
                <Progress type="dashboard" percent={75} />
                <Progress type="dashboard" percent={50} gapPosition="bottom" />
              </Space>
            </Space>
          </div>
        </div>
        <Divider />
        {/* Result */}
        <div>
          <Text strong>Result:</Text>
          <div style={{ marginTop: 8 }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Result
                status="success"
                title="Successfully Purchased"
                subTitle="Order number: 2017182818828182881"
              />
            </Space>
          </div>
        </div>
        <Divider />
        {/* Skeleton */}
        <div>
          <Text strong>Skeleton:</Text>
          <div style={{ marginTop: 8 }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Skeleton />
              <Skeleton active />
              <Skeleton.Avatar active style={{ marginRight: 8 }} />
            </Space>
          </div>
        </div>
        <Divider />
        {/* Spin */}
        <div>
          <Text strong>Spin:</Text>
          <div style={{ marginTop: 8 }}>
            <Space size="large">
              <Spin />
              <Spin size="small" />
              <Spin size="large" />
              <Spin tip="Loading...">
                <Alert message="Loading alert" type="info" />
              </Spin>
            </Space>
          </div>
        </div>
      </Space>
    </Card>
  );
};

// =============================================================================
// Section: Other Components
// =============================================================================

const OtherSection = () => {
  return (
    <Card title="Other Components" style={{ marginBottom: 24 }}>
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        {/* ConfigProvider Demo */}
        <div>
          <Text strong>Nested Theme (ConfigProvider):</Text>
          <div style={{ marginTop: 8 }}>
            <Space>
              <Button type="primary">Default Theme</Button>
              <ConfigProvider theme={{ token: { colorPrimary: primitiveColors.green[500], borderRadius: 16 } }}>
                <Button type="primary">Green Theme</Button>
              </ConfigProvider>
              <ConfigProvider theme={{ token: { colorPrimary: primitiveColors.amber[500], borderRadius: 24 } }}>
                <Button type="primary">Amber Theme</Button>
              </ConfigProvider>
            </Space>
          </div>
        </div>
        <Divider />
        {/* Design Tokens */}
        <div>
          <Text strong>Design Tokens:</Text>
          <div style={{ marginTop: 8 }}>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <div style={{ width: 40, height: 40, background: 'var(--ant-color-primary)', borderRadius: 4 }} title="Primary" />
              <div style={{ width: 40, height: 40, background: 'var(--ant-color-primary-bg)', borderRadius: 4 }} title="Primary BG" />
              <div style={{ width: 40, height: 40, background: 'var(--ant-color-primary-border)', borderRadius: 4 }} title="Primary Border" />
              <div style={{ width: 40, height: 40, background: 'var(--ant-color-success)', borderRadius: 4 }} title="Success" />
              <div style={{ width: 40, height: 40, background: 'var(--ant-color-warning)', borderRadius: 4 }} title="Warning" />
              <div style={{ width: 40, height: 40, background: 'var(--ant-color-error)', borderRadius: 4 }} title="Error" />
              <div style={{ width: 40, height: 40, background: 'var(--ant-color-info)', borderRadius: 4 }} title="Info" />
            </div>
          </div>
        </div>
      </Space>
    </Card>
  );
};

// =============================================================================
// Main App
// =============================================================================

const DemoApp = () => {
  const [isDark, setIsDark] = React.useState(false);

  return (
    <ConfigProvider theme={getAntdThemeConfig(isDark)}>
      <App>
        <div style={{ minHeight: '100vh', padding: 24 }}>
          {/* Theme Toggle */}
          <div style={{ position: 'fixed', top: 16, right: 16, zIndex: 1000 }}>
            <Space>
              <Text>Dark Mode</Text>
              <Switch
                checked={isDark}
                onChange={setIsDark}
                checkedChildren="Dark"
                unCheckedChildren="Light"
              />
            </Space>
          </div>

          {/* Header */}
          <div style={{ marginBottom: 24, marginTop: 48 }}>
            <Title level={2}>Ant Design v6 Component Showcase</Title>
            <Paragraph type="secondary">
              Comprehensive demonstration of Ant Design v6 components with GDS design tokens.
              Toggle between light and dark themes to see token changes.
            </Paragraph>
          </div>

          {/* Table of Contents */}
          <Card style={{ marginBottom: 24 }}>
            <Space wrap>
              <a href="#general"><Tag color="blue">General</Tag></a>
              <a href="#layout"><Tag color="blue">Layout</Tag></a>
              <a href="#navigation"><Tag color="blue">Navigation</Tag></a>
              <a href="#data-entry"><Tag color="blue">Data Entry</Tag></a>
              <a href="#data-display"><Tag color="blue">Data Display</Tag></a>
              <a href="#feedback"><Tag color="blue">Feedback</Tag></a>
              <a href="#other"><Tag color="blue">Other</Tag></a>
            </Space>
          </Card>

          {/* Demo Sections */}
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <section id="general"><GeneralSection /></section>
            <section id="layout"><LayoutSection /></section>
            <section id="navigation"><NavigationSection /></section>
            <section id="data-entry"><DataEntrySection /></section>
            <section id="data-display"><DataDisplaySection /></section>
            <section id="feedback"><FeedbackSection /></section>
            <section id="other"><OtherSection /></section>
          </div>

          {/* Footer */}
          <Divider />
          <div style={{ textAlign: 'center' }}>
            <Text type="secondary">
              Built with Ant Design v6 ConfigProvider and GDS Design Tokens
            </Text>
          </div>
        </div>
      </App>
    </ConfigProvider>
  );
};

// Render
const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<DemoApp />);