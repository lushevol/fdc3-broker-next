import logo from './logo-scwebkit.svg';
import './App.css';

import { createComponent } from '@scdevkit/webkit/react';
const ScButton = createComponent('sc-button');

const renderHeader = () => {
  return (
    <>
      <img src={logo} alt="WebKit Logo" />
      <h2>Congratulations, your WebKit project is running now.</h2>
      <br />
    </>
  )
}

const renderLinks = () => {
  return (
    <>
      <br />
      <h2>What's next ?</h2>
      <div style={{ textAlign: 'left', minWidth: 320 }}>
        <ul>
          <li>Join SC WebKit community at <a href="http://go/scwebkit-community" target="blank">http://go/scwebkit-community</a> for latest updates</li>
          <li>Check feature request and ideas at <a href="http://go/scwebkit-ideas" target="blank">http://go/scwebkit-ideas</a> and start contributing</li>
          <li>Find out more about WebKit from <a href="http://go/scwebkit-info" target="blank">http://go/scwebkit-info</a></li>
          <li>Contact us at <a href="mailto:scwebkit@sc.com" target="blank">scwebkit@sc.com</a></li>
        </ul>
      </div>
    </>
  )
}

const openDocumentation = () => {
  window.open("http://go/scwebkit", "blank");
}

const renderContent = () => {
  return (
    <>
      <p><ScButton onClick={openDocumentation}>View components</ScButton></p>
      <p>
        This button is created using the following code in <code>App.js</code>
        <br />
        <code>&lt;ScButton onClick=&#123;openDocumentation&#125;&gt;View components&lt;/ScButton&gt;</code>
        <br />
        Try updating the file to try other WebKit components.
      </p>
    </>
  )

}

function App() {
  return (
    <div className="container">
      {renderHeader()}
      {renderContent()}
      {renderLinks()}
    </div>
  );
}

export default App;
