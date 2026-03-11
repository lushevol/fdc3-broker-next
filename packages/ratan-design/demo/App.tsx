import React, { useState, useEffect } from 'react';
import {
  ConfigProvider,
  theme,
  Layout,
  Menu,
  Typography,
  Card,
  Space,
  Switch,
} from 'antd';
import {
  AppstoreOutlined,
  TableOutlined,
  HomeOutlined,
  MoonOutlined,
  SunOutlined,
} from '@ant-design/icons';
import CashflowBlotter from './cashflow-blotter/CashflowBlotter';
import ComponentShowcase from './ComponentShowcase';
import './demo.css';

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

type ViewType = 'home' | 'components' | 'cashflow' | 'trading';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [darkMode, setDarkMode] = useState(false);

  // Apply dark mode class to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const renderContent = () => {
    switch (currentView) {
      case 'cashflow':
        return <CashflowBlotter />;
      case 'components':
        return <ComponentShowcase />;
      case 'home':
      default:
        return (
          <div className="home-container">
            <div className="hero-section">
              <Title level={1} className="hero-title">
                Ratan Design System
              </Title>
              <Text className="hero-subtitle">
                A professional design system for financial applications
              </Text>
              <Space size="large" className="hero-actions">
                <Card
                  hoverable
                  className="demo-card"
                  onClick={() => setCurrentView('cashflow')}
                  styles={{ body: { padding: '24px' } }}
                >
                  <div className="demo-icon-wrapper">
                    <TableOutlined className="demo-icon" />
                  </div>
                  <Title
                    level={4}
                    style={{ marginTop: 0, marginBottom: '8px' }}
                  >
                    Cashflow Blotter
                  </Title>
                  <Text type="secondary">
                    Professional financial operations dashboard with advanced
                    filtering and data grid
                  </Text>
                </Card>
                <Card
                  hoverable
                  className="demo-card"
                  onClick={() => setCurrentView('components')}
                  styles={{ body: { padding: '24px' } }}
                >
                  <div className="demo-icon-wrapper">
                    <AppstoreOutlined className="demo-icon" />
                  </div>
                  <Title
                    level={4}
                    style={{ marginTop: 0, marginBottom: '8px' }}
                  >
                    Component Showcase
                  </Title>
                  <Text type="secondary">
                    Browse the complete set of design system components and
                    tokens
                  </Text>
                </Card>
              </Space>
            </div>
          </div>
        );
    }
  };

  if (currentView === 'cashflow') {
    return <CashflowBlotter />;
  }

  return (
    <ConfigProvider
      theme={{
        algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: '#0473ea',
          borderRadius: 6,
        },
      }}
    >
      <Layout className="demo-layout" style={{ minHeight: '100vh' }}>
        <Header className="demo-header">
          <div className="demo-header-left">
            <HomeOutlined
              className="home-icon"
              onClick={() => setCurrentView('home')}
            />
            <Title level={4} style={{ margin: 0, color: 'white' }}>
              Ratan Design System
            </Title>
          </div>
          <div className="demo-header-right">
            <Switch
              checked={darkMode}
              onChange={setDarkMode}
              checkedChildren={<MoonOutlined />}
              unCheckedChildren={<SunOutlined />}
              style={{ marginRight: '8px' }}
            />
          </div>
        </Header>
        <Layout>
          <Sider width={200} className="demo-sider">
            <Menu
              mode="inline"
              selectedKeys={[currentView]}
              style={{ height: '100%', borderRight: 0 }}
              onClick={({ key }) => setCurrentView(key as ViewType)}
              items={[
                {
                  key: 'home',
                  icon: <HomeOutlined />,
                  label: 'Home',
                },
                {
                  key: 'cashflow',
                  icon: <TableOutlined />,
                  label: 'Cashflow Blotter',
                },
                {
                  key: 'components',
                  icon: <AppstoreOutlined />,
                  label: 'Component Showcase',
                },
              ]}
            />
          </Sider>
          <Content className="demo-content">{renderContent()}</Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default App;
