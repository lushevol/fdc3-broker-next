import { css } from 'lit';

export default css`
  .sc-bottom-navbar {
    width: 100%;
    height: 64px;
    background: transparent;
  }
  .sc-bottom-navbar.hidden {
    display: none;
  }
  .sc-bottom-navbar .navbar-item-container {
    max-width: 720px;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
  }
  .sc-bottom-navbar.sc-truncate .navbar-item-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(20px, 1fr));
  }
`;