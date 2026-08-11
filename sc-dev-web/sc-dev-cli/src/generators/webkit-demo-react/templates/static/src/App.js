import Header from './common/Header';
import Footer from './common/Footer';
import Home from './pages/Home';
import PayTransfer from './pages/PayTransfer';
import Invest from './pages/Invest';
import Discover from './pages/Discover';
import Services from './pages/Services';
import { useState } from 'react';
import '@sctoolkit/webkit/styles/util.css';
import '@sctoolkit/webkit/styles/ScDarkMode.css'
import './App.css';

function App() {

  const [selectedMenu, setSelectedMenu] = useState('pay-transfer');
  const [mode, setMode] = useState('');
  const [accessibilityMode, setAccessibilityMode] = useState('');

  const onModeChange = (mode) => {
    setMode(mode);
  }   

  const onAccessibilityModeChange = (mode) => {
    setAccessibilityMode(mode);
  }

  const onMenuChange = (menu) => {
    setSelectedMenu(menu);
  }

  return (
    <div className={`App demo-app ${mode} ${accessibilityMode? 'sc-mode-dyslexic' : ''}`}>
      <Header />
      <div className='content overflow-y-scroll no-scrollbar'>
        {selectedMenu === 'home' &&
          <Home />
        }
        {selectedMenu === 'pay-transfer' &&
          <PayTransfer />
        }
        {selectedMenu === 'invest' &&
          <Invest />
        }
        {selectedMenu === 'discover' &&
          <Discover />
        }
        {selectedMenu === 'services' &&
          <Services
            mode={mode}
            accessibilityMode={accessibilityMode}
            onModeChange={onModeChange}
            onAccessibilityModeChange={onAccessibilityModeChange}
          />
        }
      </div>
      <Footer
        onMenuChange={onMenuChange}
      />
    </div>
  );
}

export default App;
