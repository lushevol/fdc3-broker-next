import { css } from 'lit';

export default css`
  @keyframes wave-lines {
    0% {
      -webkit-background-position: -468px 0;
      background-position: -468px 0;
    }
    100% {
      -webkit-background-position: 468px 0;
      background-position: 468px 0;
    }
  }
  
  @-webkit-keyframes wave-lines, @keyframes wave-lines {
    0% {
      -webkit-background-position: -468px 0;
      background-position: -468px 0;
    }
    100% {
      -webkit-background-position: 468px 0;
      background-position: 468px 0;
    }
  }
  
  .sc-content-loader {
    width: var(--sc-content-loader-width, 100%);
    // border-radius: 5px;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    -webkit-justify-content: center;
    justify-content: center;
    -webkit-align-items: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
  }
  
  .sc-content-loader .wrapper {
    -webkit-flex: 2;
    -ms-flex: 2;
    flex: 2;
  }
  
  .sc-content-loader .wrapper .content {
    height: var(--sc-content-loader-height, 16px);
    border-radius: var(--sc-content-loader-radius, 0);
    background: rgba(130, 130, 130, 0.2);
    background: -webkit-gradient( 
      linear, left top, right top, 
      color-stop(var(--sc-content-loader-background-linear-stop-point-1, 8%), 
        var(--sc-content-loader-background-linear-stop-color-1, rgba(130, 130, 130, 0.2))), 
      color-stop(var(--sc-content-loader-background-linear-stop-point-2, 18%), 
        var(--sc-content-loader-background-linear-stop-color-2, rgba(130, 130, 130, 0.3))), 
      color-stop(var(--sc-content-loader-background-linear-stop-point-3, 33%), 
        var(--sc-content-loader-background-linear-stop-color-3, rgba(130, 130, 130, 0.2)))
    );
    background: linear-gradient( 
      to right, 
      var(--sc-content-loader-background-linear-stop-color-1, 
        rgba(130, 130, 130, 0.2)) var(--sc-content-loader-background-linear-stop-point-1, 8%), 
      var(--sc-content-loader-background-linear-stop-color-2, 
        rgba(130, 130, 130, 0.3)) var(--sc-content-loader-background-linear-stop-point-2, 18%), 
      var(--sc-content-loader-background-linear-stop-color-3, 
        rgba(130, 130, 130, 0.2)) var(--sc-content-loader-background-linear-stop-point-3, 33%)
    );
    -webkit-background-size: 800px 100px;
    background-size: 800px 100px;
    -webkit-animation: wave-lines 2s infinite ease-out;
    animation: wave-lines 2s infinite ease-out;
  }
`;