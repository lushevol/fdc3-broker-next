import React from 'react';
import ReactDOM from 'react-dom/client';
import { ConfigProvider, theme, App, Button, Card, Input, Space, Typography, Divider, Tag, Alert, Switch, Progress, Table, Badge, Avatar, Rate, Segmented, Tooltip, message } from 'antd';
import type { ThemeConfig } from 'antd';

import { primitiveColors, foundationColors } from '../src/tokens/colors';
import { darkPrimitiveColors } from '../src/tokens/colorsDark';
import { fontFamily, fontSize } from '../src/tokens/typography';
import { componentRound, componentSizes } from '../src/tokens/sizes';

const { Title, Text, Paragraph } = Typography;

// =============================================================================
// Theme Configuration - Strictly using GDS tokens only
// =============================================================================

const getAntdThemeConfig = (isDark: boolean): ThemeConfig => {
  const colors = isDark ? darkPrimitiveColors : primitiveColors;

  // For dark mode, we don't use darkAlgorithm since we're providing
  // explicit token values from our design system
  return {
    algorithm: undefined,
    token: {
      // Primary brand color
      colorPrimary: foundationColors.basic.brandBlue,
      colorSuccess: foundationColors.basic.brandGreen,
      colorWarning: colors.amber[500],
      colorError: colors.red[500],
      colorInfo: colors.blue[500],

      // Background colors
      colorBgBase: isDark ? colors.grey[900] : colors.grey.white,
      colorBgContainer: isDark ? colors.grey[850] : colors.grey.white,
      colorBgElevated: isDark ? colors.grey[800] : colors.grey.white,
      colorBgLayout: isDark ? colors.grey[950] : colors.grey[50],

      // Text colors
      colorText: isDark ? colors.grey[100] : colors.grey[850],
      colorTextSecondary: isDark ? colors.grey[300] : colors.grey[600],
      colorTextTertiary: isDark ? colors.grey[400] : colors.grey[500],
      colorTextQuaternary: isDark ? colors.grey[500] : colors.grey[400],

      // Border colors
      colorBorder: isDark ? colors.grey[700] : colors.grey[200],
      colorBorderSecondary: isDark ? colors.grey[800] : colors.grey[100],

      // Link colors
      colorLink: isDark ? colors.blue[300] : colors.blue[500],
      colorLinkHover: isDark ? colors.blue[200] : colors.blue[400],
      colorLinkActive: isDark ? colors.blue[400] : colors.blue[600],

      // Font
      fontFamily: fontFamily.primary,
      fontSize: fontSize.smMd,

      // Border radius
      borderRadius: componentRound['6px'],
      borderRadiusLG: 8,
      borderRadiusSM: componentRound['4px'],

      // Control heights
      controlHeight: componentSizes['32px'],
      controlHeightLG: componentSizes['40px'],
      controlHeightSM: componentSizes['24px'],

      // Focus
      colorPrimaryBorder: foundationColors.basic.brandBlue,
      colorPrimaryBorderHover: isDark ? colors.blue[300] : colors.blue[400],
    },
    components: {
      Button: {
        primaryShadow: 'none',
        defaultShadow: 'none',
        dangerShadow: 'none',
      },
      Card: {
        colorBgContainer: isDark ? colors.grey[850] : colors.grey.white,
      },
      Input: {
        colorBgContainer: isDark ? colors.grey[900] : colors.grey.white,
        colorBorder: isDark ? colors.grey[700] : colors.grey[200],
        activeShadow: `0 0 0 2px ${isDark ? 'rgba(54, 143, 238, 0.2)' : 'rgba(4, 115, 234, 0.1)'}`,
        hoverBorderColor: foundationColors.basic.brandBlue,
      },
      Table: {
        headerBg: isDark ? colors.grey[850] : colors.grey[50],
        rowHoverBg: isDark ? colors.grey[800] : colors.grey[50],
        colorBgContainer: isDark ? colors.grey[900] : colors.grey.white,
      },
      Tag: {
        defaultBg: isDark ? colors.grey[800] : colors.grey[50],
      },
    },
  };
};

// =============================================================================
// Demo Components
// =============================================================================

const TokenDemo = () => {
  return (
    <Card title="Design Tokens" style={{ marginBottom: 24 }}>
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        <div>
          <Text strong>Color Primary:</Text>
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <div style={{ width: 40, height: 40, background: 'var(--ant-color-primary)', borderRadius: 4 }} />
            <div style={{ width: 40, height: 40, background: 'var(--ant-color-primary-bg)', borderRadius: 4 }} />
            <div style={{ width: 40, height: 40, background: 'var(--ant-color-primary-border)', borderRadius: 4 }} />
          </div>
        </div>
        <div>
          <Text strong>Semantic Colors:</Text>
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <div style={{ width: 40, height: 40, background: 'var(--ant-color-success)', borderRadius: 4 }} title="Success" />
            <div style={{ width: 40, height: 40, background: 'var(--ant-color-warning)', borderRadius: 4 }} title="Warning" />
            <div style={{ width: 40, height: 40, background: 'var(--ant-color-error)', borderRadius: 4 }} title="Error" />
            <div style={{ width: 40, height: 40, background: 'var(--ant-color-info)', borderRadius: 4 }} title="Info" />
          </div>
        </div>
      </Space>
    </Card>
  );
};

const ButtonDemo = () => {
  return (
    <Card title="Buttons" style={{ marginBottom: 24 }}>
      <Space wrap>
        <Button type="primary">Primary</Button>
        <Button>Default</Button>
        <Button type="dashed">Dashed</Button>
        <Button type="text">Text</Button>
        <Button type="link">Link</Button>
        <Button danger>Danger</Button>
        <Button type="primary" danger>Primary Danger</Button>
      </Space>
      <Divider />
      <Space wrap>
        <Button type="primary" size="small">Small</Button>
        <Button type="primary" size="middle">Middle</Button>
        <Button type="primary" size="large">Large</Button>
      </Space>
    </Card>
  );
};

const InputDemo = () => {
  return (
    <Card title="Inputs" style={{ marginBottom: 24 }}>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Input placeholder="Basic input" />
        <Input.Password placeholder="Password input" />
        <Input.Search placeholder="Search input" enterButton="Search" />
        <Input.TextArea placeholder="Text area" rows={3} />
      </Space>
    </Card>
  );
};

const DataDisplayDemo = () => {
  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Age', dataIndex: 'age', key: 'age' },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (status: string) => (
      <Tag color={status === 'Active' ? 'success' : 'warning'}>{status}</Tag>
    )},
  ];

  const data = [
    { key: '1', name: 'John Doe', age: 32, status: 'Active' },
    { key: '2', name: 'Jane Smith', age: 28, status: 'Pending' },
    { key: '3', name: 'Bob Wilson', age: 45, status: 'Active' },
  ];

  return (
    <Card title="Data Display" style={{ marginBottom: 24 }}>
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        <div>
          <Text strong>Tags:</Text>
          <div style={{ marginTop: 8 }}>
            <Space>
              <Tag>Default</Tag>
              <Tag color="success">Success</Tag>
              <Tag color="warning">Warning</Tag>
              <Tag color="error">Error</Tag>
              <Tag color="processing">Processing</Tag>
            </Space>
          </div>
        </div>
        <div>
          <Text strong>Progress & Rate:</Text>
          <div style={{ marginTop: 8 }}>
            <Progress percent={75} style={{ maxWidth: 300 }} />
            <Rate defaultValue={3} />
          </div>
        </div>
        <div>
          <Text strong>Table:</Text>
          <div style={{ marginTop: 8 }}>
            <Table columns={columns} dataSource={data} pagination={false} size="small" />
          </div>
        </div>
      </Space>
    </Card>
  );
};

const FeedbackDemo = () => {
  const [messageApi, contextHolder] = message.useMessage();

  return (
    <Card title="Feedback" style={{ marginBottom: 24 }}>
      {contextHolder}
      <Space direction="vertical" style={{ width: '100%' }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Alert message="Success message" type="success" showIcon />
          <Alert message="Warning message" type="warning" showIcon />
          <Alert message="Error message" type="error" showIcon />
          <Alert message="Info message" type="info" showIcon />
        </Space>
        <Divider />
        <Space>
          <Button onClick={() => messageApi.success('Success!')}>Show Success</Button>
          <Button onClick={() => messageApi.warning('Warning!')}>Show Warning</Button>
          <Button onClick={() => messageApi.error('Error!')}>Show Error</Button>
        </Space>
      </Space>
    </Card>
  );
};

const NavigationDemo = () => {
  return (
    <Card title="Navigation" style={{ marginBottom: 24 }}>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Text strong>Segmented:</Text>
        <Segmented
          options={['Daily', 'Weekly', 'Monthly', 'Yearly']}
          defaultValue="Weekly"
        />
        <Divider />
        <Text strong>Badges & Avatars:</Text>
        <Space size="large">
          <Badge count={5}>
            <Avatar shape="square" size="large" />
          </Badge>
          <Badge dot>
            <Avatar shape="square" size="large" />
          </Badge>
          <Avatar.Group>
            <Avatar style={{ backgroundColor: foundationColors.basic.brandBlue }}>A</Avatar>
            <Avatar style={{ backgroundColor: foundationColors.basic.brandGreen }}>B</Avatar>
            <Tooltip title="Ant User">
              <Avatar style={{ backgroundColor: primitiveColors.amber[500] }}>C</Avatar>
            </Tooltip>
          </Avatar.Group>
        </Space>
      </Space>
    </Card>
  );
};

const NestedThemeDemo = () => {
  return (
    <Card title="Nested Theme (Override)" style={{ marginBottom: 24 }}>
      <Text type="secondary">
        ConfigProvider supports nested themes. Child themes inherit from parent and can override tokens.
      </Text>
      <Divider />
      <Space direction="vertical" style={{ width: '100%' }}>
        <Button type="primary">Default Primary Button</Button>
        <ConfigProvider theme={{
          token: {
            colorPrimary: primitiveColors.green[500],
            borderRadius: 16,
          }
        }}>
          <Button type="primary">Green Theme Button (Nested)</Button>
        </ConfigProvider>
        <ConfigProvider theme={{
          token: {
            colorPrimary: primitiveColors.amber[500],
            borderRadius: 24,
          }
        }}>
          <Button type="primary">Amber Theme Button (Nested)</Button>
        </ConfigProvider>
      </Space>
    </Card>
  );
};

// =============================================================================
// Main App
// =============================================================================

const DemoApp = () => {
  const [isDark, setIsDark] = React.useState(false);
  const colors = isDark ? darkPrimitiveColors : primitiveColors;

  return (
    <ConfigProvider theme={getAntdThemeConfig(isDark)}>
      <App>
        <div
          style={{
            minHeight: '100vh',
            padding: 24,
            backgroundColor: isDark ? colors.grey[950] : colors.grey[50],
          }}
        >
          {/* Theme Toggle */}
          <div style={{ position: 'fixed', top: 16, right: 16, zIndex: 1000 }}>
            <Space>
              <Text style={{ color: isDark ? colors.grey[100] : undefined }}>Dark Mode</Text>
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
            <Title level={2}>GDS Design Token Demo</Title>
            <Paragraph type="secondary">
              Demonstrating GDS design tokens mapped to Ant Design ConfigProvider theme system.
              Toggle between light and dark themes to see token changes.
            </Paragraph>
          </div>

          {/* Demo Sections */}
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              <TokenDemo />
              <ButtonDemo />
              <InputDemo />
              <DataDisplayDemo />
              <FeedbackDemo />
              <NavigationDemo />
              <NestedThemeDemo />
            </Space>
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