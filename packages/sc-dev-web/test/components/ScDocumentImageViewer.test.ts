// @ts-nocheck


import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { ScDocumentImageViewer } from '../../src/components/ScDocumentImageViewer/ScDocumentImageViewer.js';
import '../../elements/sc-document-image-viewer.js';



const hocr = [
  {
    name: 'Test Entity1',
    value: 'communicates',
    confidence: 90.0,
    pageNo: 1,
    xmin: 465,
    xmax: 714,
    ymin: 972,
    ymax: 1001,
  },
  {
    name: 'Test Entity2',
    value: 'add-on',
    confidence: 70.0,
    pageNo: 1,
    xmin: 1794,
    xmax: 1921,
    ymin: 592,
    ymax: 627,
  },
  {
    name: 'Test Entity3',
    value: 'add-on',
    confidence: 70.0,
    pageNo: 1,
    xmin: 1543,
    xmax: 1734,
    ymin: 361,
    ymax: 392,
  },

];
const base64Png = 'data:image/png;base64,X';

const mockImgDetailsForJestRunner = async (imgViewerElement: HTMLElement, isError: boolean) => {
  if (typeof jest !== 'undefined') {
    if (imgViewerElement.config) {
      imgViewerElement.config.containerHeight = 500;
      imgViewerElement.config.containerWidth = 500;
    }
    if (imgViewerElement.img) {
      imgViewerElement.img.width = 500;
      imgViewerElement.img.height = 700;
      if (isError)
        imgViewerElement.img.onerror();
      else
        imgViewerElement.img.onload();

    }

    await new Promise(resovle => {
      setTimeout(() => resovle(null), 10);
    });
  }
};

class Touch {
  constructor(obj) {
    Object.assign(this, obj);
  }
}

describe('Document Image Viewer', () => {
  it('renders default viewer', async () => {
    const el = await fixture<ScDocumentImageViewer>(
      html`<sc-document-image-viewer
        style="width:900px;height:500px;display:block"
        .selections=${hocr}
        .data=${{ name: 'Test.pdf', pages: [base64Png] }}
      
      ></sc-document-image-viewer>`
    );
    await new Promise(resovle => {
      setTimeout(() => resovle(null), 20);
    });
    await expect(el).shadowDom.exist;
    const domEle = (el.shadowRoot.querySelector('img-viewer') as HTMLElement);
    await mockImgDetailsForJestRunner(domEle);

    const imgEle = (domEle.shadowRoot as ShadowRoot).querySelector('img');

    await expect(imgEle?.height).equal(500);
  });


  it('renders initial spinner', async () => {
    const el = await fixture<ScDocumentImageViewer>(
      html`<sc-document-image-viewer
        style="width:900px;height:500px;display:block"
      
      ></sc-document-image-viewer>`
    );
    await new Promise(resovle => {
      setTimeout(() => resovle(null), 10);
    });
    await expect(el).shadowDom.exist;
    const domEle = (el.renderRoot.querySelector('sc-spinner') as HTMLElement);
    await mockImgDetailsForJestRunner(domEle);
    expect(domEle).shadowDom.to.be.accessible();
  });


  it('verify next page navigation', async () => {
    const el = await fixture<ScDocumentImageViewer>(
      html`<sc-document-image-viewer
        style="width:900px;height:500px;display:block"
        .selections=${hocr}
        .data=${{ name: 'Test.pdf', pages: [base64Png, base64Png] }}
      
      ></sc-document-image-viewer>`
    );
    await new Promise(resovle => {
      setTimeout(() => resovle(null), 10);
    });
    await expect(el).shadowDom.exist;
    const pgNoStatus = (el.renderRoot.querySelector('#page-no-status') as HTMLElement);
    await expect(pgNoStatus.innerHTML.includes('1 / ')).to.equal(true);
    await expect(pgNoStatus.innerHTML.includes('2')).to.equal(true);

    const domEle = (el.renderRoot.querySelector('#forward') as HTMLElement);
    domEle.click();
    await new Promise(resovle => {
      setTimeout(() => resovle(null), 10);
    });
    await expect(pgNoStatus.innerHTML.includes('2 / ')).to.equal(true);
  });

  it('verify prev page navigation', async () => {
    const el = await fixture<ScDocumentImageViewer>(
      html`<sc-document-image-viewer
        style="width:900px;height:500px;display:block"
        .selections=${hocr}
        .data=${{ name: 'Test.pdf', pages: [base64Png, base64Png] }}
      
      ></sc-document-image-viewer>`
    );
    await new Promise(resovle => {
      setTimeout(() => resovle(null), 10);
    });
    await expect(el).shadowDom.exist;
    const pgNoStatus = (el.renderRoot.querySelector('#page-no-status') as HTMLElement);
    await expect(pgNoStatus.innerHTML.includes('1 / ')).to.equal(true);
    await expect(pgNoStatus.innerHTML.includes('2')).to.equal(true);

    let domEle = (el.renderRoot.querySelector('#forward') as HTMLElement);
    domEle.click();
    await new Promise(resovle => {
      setTimeout(() => resovle(null), 10);
    });
    await expect(pgNoStatus.innerHTML.includes('2 / ')).to.equal(true);

    domEle = (el.renderRoot.querySelector('#backward') as HTMLElement);
    domEle.click();
    await new Promise(resovle => {
      setTimeout(() => resovle(null), 10);
    });
    await expect(pgNoStatus.innerHTML.includes('1 / ')).to.equal(true);
  });


  it('verify zoom increment on button action', async () => {
    const el = await fixture<ScDocumentImageViewer>(
      html`<sc-document-image-viewer
        style="width:900px;height:500px;display:block"
        .selections=${hocr}
        .data=${{ name: 'Test.pdf', pages: [base64Png, base64Png] }}
      
      ></sc-document-image-viewer>`
    );
    await new Promise(resovle => {
      setTimeout(() => resovle(null), 10);
    });
    await expect(el).shadowDom.exist;

    const imgViewer = (el.renderRoot.querySelector('img-viewer') as HTMLElement);
    await mockImgDetailsForJestRunner(imgViewer);

    const imgEle = (imgViewer.shadowRoot as ShadowRoot).querySelector('img');
    const initialWidth = imgEle?.width;

    const zoomStatus = (el.renderRoot.querySelector('#zoom-status') as HTMLElement);
    await expect(zoomStatus.innerHTML.includes('100%')).to.equal(true);
    const domEle = (el.renderRoot.querySelector('#inc-zoom') as HTMLElement);
    domEle.click();
    await new Promise(resovle => {
      setTimeout(() => resovle(null), 100);
    });
    const curWidth = imgEle?.width;
    await expect(zoomStatus.innerHTML.includes('150%')).to.equal(true);
    await expect(curWidth).to.be.greaterThan(initialWidth as number);

  });

  it('verify zoom decrement on button action', async () => {
    const el = await fixture<ScDocumentImageViewer>(
      html`<sc-document-image-viewer
        style="width:900px;height:500px;display:block"
        .selections=${hocr}
        .data=${{ name: 'Test.pdf', pages: [base64Png, base64Png] }}
      
      ></sc-document-image-viewer>`
    );
    await new Promise(resovle => {
      setTimeout(() => resovle(null), 10);
    });
    await expect(el).shadowDom.exist;

    const imgViewer = (el.renderRoot.querySelector('img-viewer') as HTMLElement);
    await mockImgDetailsForJestRunner(imgViewer);

    const imgEle = (imgViewer.shadowRoot as ShadowRoot).querySelector('img');
    const initialWidth = imgEle?.width;

    const zoomStatus = (el.renderRoot.querySelector('#zoom-status') as HTMLElement);
    await expect(zoomStatus.innerHTML.includes('100%')).to.equal(true);
    const domEle = (el.renderRoot.querySelector('#dec-zoom') as HTMLElement);
    domEle.click();
    await new Promise(resovle => {
      setTimeout(() => resovle(null), 30);
    });
    const curWidth = imgEle?.width;
    await expect(zoomStatus.innerHTML.includes('50%')).to.equal(true);
    await expect(curWidth).to.be.lessThan(initialWidth as number);

  });


  it('verify zoom increment on mouse wheel action', async () => {
    const el = await fixture<ScDocumentImageViewer>(
      html`<sc-document-image-viewer
        style="width:900px;height:500px;display:block"
        .selections=${hocr}
        .data=${{ name: 'Test.pdf', pages: [base64Png, base64Png] }}
      
      ></sc-document-image-viewer>`
    );
    await new Promise(resovle => {
      setTimeout(() => resovle(null), 10);
    });
    await expect(el).shadowDom.exist;

    const imgViewer = (el.renderRoot.querySelector('img-viewer') as HTMLElement);
    await mockImgDetailsForJestRunner(imgViewer);

    const imgEle = (imgViewer.shadowRoot as ShadowRoot).querySelector('img');
    const initialWidth = imgEle?.width;

    const zoomStatus = (el.renderRoot.querySelector('#zoom-status') as HTMLElement);
    await expect(zoomStatus.innerHTML.includes('100%')).to.equal(true);
    const domEle = ((imgViewer.shadowRoot as ShadowRoot).querySelector('.grab') as HTMLElement);
    const wheelEvent = new WheelEvent('wheel', {
      deltaY: -1,
      deltaMode: 1,
    });
    domEle.dispatchEvent(wheelEvent);
    await new Promise(resovle => {
      setTimeout(() => resovle(null), 30);
    });
    const curWidth = imgEle?.width;
    await expect(curWidth).to.be.greaterThan(initialWidth as number);

  });

  it('verify zoom decrement on mouse wheel action', async () => {
    const el = await fixture<ScDocumentImageViewer>(
      html`<sc-document-image-viewer
        style="width:900px;height:500px;display:block"
        .selections=${hocr}
        .data=${{ name: 'Test.pdf', pages: [base64Png, base64Png] }}
      
      ></sc-document-image-viewer>`
    );
    await new Promise(resovle => {
      setTimeout(() => resovle(null), 10);
    });
    await expect(el).shadowDom.exist;

    const imgViewer = (el.renderRoot.querySelector('img-viewer') as HTMLElement);
    await mockImgDetailsForJestRunner(imgViewer);

    const imgEle = (imgViewer.shadowRoot as ShadowRoot).querySelector('img');
    const initialWidth = imgEle?.width;

    const zoomStatus = (el.renderRoot.querySelector('#zoom-status') as HTMLElement);
    await expect(zoomStatus.innerHTML.includes('100%')).to.equal(true);
    const domEle = ((imgViewer.shadowRoot as ShadowRoot).querySelector('.grab') as HTMLElement);
    const wheelEvent = new WheelEvent('wheel', {
      deltaY: 1,
      deltaMode: 1,
    });
    domEle.dispatchEvent(wheelEvent);
    await new Promise(resovle => {
      setTimeout(() => resovle(null), 30);
    });
    const curWidth = imgEle?.width;
    await expect(curWidth).to.be.lessThan(initialWidth as number);

  });


  it('verify img pan left on mouse drag action', async () => {
    const el = await fixture<ScDocumentImageViewer>(
      html`<sc-document-image-viewer
        style="width:900px;height:500px;display:block"
        .selections=${hocr}
        .data=${{ name: 'Test.pdf', pages: [base64Png, base64Png] }}
      
      ></sc-document-image-viewer>`
    );
    await new Promise(resovle => {
      setTimeout(() => resovle(null), 10);
    });
    await expect(el).shadowDom.exist;

    const imgViewer = (el.renderRoot.querySelector('img-viewer') as HTMLElement);
    await mockImgDetailsForJestRunner(imgViewer);

    const imgEle = (imgViewer.shadowRoot as ShadowRoot).querySelector('img');
    const initialLeft = Number(imgEle?.style.left.replace('px', ''));

    const zoomStatus = (el.renderRoot.querySelector('#zoom-status') as HTMLElement);
    await expect(zoomStatus.innerHTML.includes('100%')).to.equal(true);
    const domEle = ((imgViewer.shadowRoot as ShadowRoot).querySelector('.grab') as HTMLElement);
    // let mouseDownEvt = new MouseEvent("mousedown", { bubbles: true, cancelable: true })
    // domEle.dispatchEvent(mouseDownEvt);
    const mouseMoveEvt = new MouseEvent('mousemove',
      { bubbles: true, cancelable: true, movementX: -10, buttons: 1 });
    mouseMoveEvt.movementX = -10;

    domEle.dispatchEvent(mouseMoveEvt);

    await new Promise(resovle => {
      setTimeout(() => resovle(null), 30);
    });
    const curLeft = Number(imgEle?.style.left.replace('px', ''));
    await expect(curLeft).to.be.lessThan(initialLeft);

  });

  it('verify img pan right on mouse drag action', async () => {
    const el = await fixture<ScDocumentImageViewer>(
      html`<sc-document-image-viewer
        style="width:900px;height:500px;display:block"
        .selections=${hocr}
        .data=${{ name: 'Test.pdf', pages: [base64Png, base64Png] }}
      
      ></sc-document-image-viewer>`
    );
    await new Promise(resovle => {
      setTimeout(() => resovle(null), 10);
    });
    await expect(el).shadowDom.exist;

    const imgViewer = (el.renderRoot.querySelector('img-viewer') as HTMLElement);
    await mockImgDetailsForJestRunner(imgViewer);

    const imgEle = (imgViewer.shadowRoot as ShadowRoot).querySelector('img');
    const initialLeft = Number(imgEle?.style.left.replace('px', ''));

    const zoomStatus = (el.renderRoot.querySelector('#zoom-status') as HTMLElement);
    await expect(zoomStatus.innerHTML.includes('100%')).to.equal(true);
    const domEle = ((imgViewer.shadowRoot as ShadowRoot).querySelector('.grab') as HTMLElement);
    // let mouseDownEvt = new MouseEvent("mousedown", { bubbles: true, cancelable: true })
    // domEle.dispatchEvent(mouseDownEvt);
    const mouseMoveEvt = new MouseEvent('mousemove',
      { bubbles: true, cancelable: true, movementX: 10, buttons: 1 });
    mouseMoveEvt.movementX = 10;
    domEle.dispatchEvent(mouseMoveEvt);

    await new Promise(resovle => {
      setTimeout(() => resovle(null), 30);
    });
    const curLeft = Number(imgEle?.style.left.replace('px', ''));
    await expect(curLeft).to.be.greaterThan(initialLeft);

  });

  it('verify img pan right on touch drag action', async () => {
    const el = await fixture<ScDocumentImageViewer>(
      html`<sc-document-image-viewer
        style="width:900px;height:500px;display:block"
        .selections=${hocr}
        .data=${{ name: 'Test.pdf', pages: [base64Png, base64Png] }}
      
      ></sc-document-image-viewer>`
    );
    await new Promise(resovle => {
      setTimeout(() => resovle(null), 10);
    });
    await expect(el).shadowDom.exist;

    const imgViewer = (el.renderRoot.querySelector('img-viewer') as HTMLElement);
    await mockImgDetailsForJestRunner(imgViewer);

    const imgEle = (imgViewer.shadowRoot as ShadowRoot).querySelector('img');
    const initialLeft = Number(imgEle?.style.left.replace('px', ''));


    const domEle = ((imgViewer.shadowRoot as ShadowRoot).querySelector('.grab') as HTMLElement);
    // let mouseDownEvt = new MouseEvent("mousedown", { bubbles: true, cancelable: true })
    // domEle.dispatchEvent(mouseDownEvt);
    const firstTouch = new TouchEvent('touchmove',
      {
        bubbles: true, cancelable: true,
        touches: [new Touch({ pageX: 100, pageY: 100, identifier: 1, target: domEle })],
      });
    domEle.dispatchEvent(firstTouch);
    const secondTouch = new TouchEvent('touchmove',
      {
        bubbles: true, cancelable: true,
        touches: [new Touch({ pageX: 110, pageY: 110, identifier: 1, target: domEle })],
      });
    domEle.dispatchEvent(secondTouch);

    await new Promise(resovle => {
      setTimeout(() => resovle(null), 30);
    });
    const curLeft = Number(imgEle?.style.left.replace('px', ''));
    await expect(curLeft).to.be.greaterThan(initialLeft);

  });


  it('verify img pan left on touch drag action', async () => {
    const el = await fixture<ScDocumentImageViewer>(
      html`<sc-document-image-viewer
        style="width:900px;height:500px;display:block"
        .selections=${hocr}
        .data=${{ name: 'Test.pdf', pages: [base64Png, base64Png] }}
      
      ></sc-document-image-viewer>`
    );
    await new Promise(resovle => {
      setTimeout(() => resovle(null), 10);
    });
    await expect(el).shadowDom.exist;

    const imgViewer = (el.renderRoot.querySelector('img-viewer') as HTMLElement);
    await mockImgDetailsForJestRunner(imgViewer);

    const imgEle = (imgViewer.shadowRoot as ShadowRoot).querySelector('img');
    const initialLeft = Number(imgEle?.style.left.replace('px', ''));


    const domEle = ((imgViewer.shadowRoot as ShadowRoot).querySelector('.grab') as HTMLElement);

    const firstTouch = new TouchEvent('touchmove',
      {
        bubbles: true, cancelable: true,
        touches: [new Touch({ pageX: 100, pageY: 100, identifier: 1, target: domEle })],
      });
    domEle.dispatchEvent(firstTouch);
    const secondTouch = new TouchEvent('touchmove',
      {
        bubbles: true, cancelable: true,
        touches: [new Touch({ pageX: 90, pageY: 90, identifier: 1, target: domEle })],
      });
    const touchEnd = new TouchEvent('touchend',
      {
        bubbles: true, cancelable: true, touches:
          [new Touch({ pageX: 90, pageY: 90, identifier: 1, target: domEle })],
      });
    domEle.dispatchEvent(secondTouch);
    domEle.dispatchEvent(touchEnd);

    await new Promise(resovle => {
      setTimeout(() => resovle(null), 30);
    });
    const curLeft = Number(imgEle?.style.left.replace('px', ''));
    await expect(curLeft).to.be.lessThan(initialLeft);

  });


  it('verify pinch zoom in', async () => {
    const el = await fixture<ScDocumentImageViewer>(
      html`<sc-document-image-viewer
        style="width:900px;height:500px;display:block"
        .selections=${hocr}
        .data=${{ name: 'Test.pdf', pages: [base64Png, base64Png] }}
      
      ></sc-document-image-viewer>`
    );
    await new Promise(resovle => {
      setTimeout(() => resovle(null), 10);
    });
    await expect(el).shadowDom.exist;

    const imgViewer = (el.renderRoot.querySelector('img-viewer') as HTMLElement);
    await mockImgDetailsForJestRunner(imgViewer);

    const imgEle = (imgViewer.shadowRoot as ShadowRoot).querySelector('img');
    const initialWidth = imgEle?.width;


    const domEle = ((imgViewer.shadowRoot as ShadowRoot).querySelector('.grab') as HTMLElement);

    const firstTouch = new TouchEvent('touchmove',
      {
        bubbles: true, cancelable: true,
        touches: [new Touch({ pageX: 100, pageY: 100, identifier: 1, target: domEle }),
          new Touch({ pageX: 200, pageY: 200, identifier: 1, target: domEle })],
      });
    domEle.dispatchEvent(firstTouch);
    const secondTouch = new TouchEvent('touchmove',
      {
        bubbles: true, cancelable: true, touches:
          [new Touch({ pageX: 90, pageY: 90, identifier: 1, target: domEle }),
            new Touch({ pageX: 210, pageY: 210, identifier: 1, target: domEle })],
      });
    domEle.dispatchEvent(secondTouch);

    await new Promise(resovle => {
      setTimeout(() => resovle(null), 30);
    });
    const curWidth = Number(imgEle?.style.left.replace('px', ''));
    await expect(curWidth).to.be.lessThan(initialWidth as number);

  });


  it('verify pinch zoom out', async () => {
    const el = await fixture<ScDocumentImageViewer>(
      html`<sc-document-image-viewer
        style="width:900px;height:500px;display:block"
        .selections=${hocr}
        .data=${{ name: 'Test.pdf', pages: [base64Png, base64Png] }}
      
      ></sc-document-image-viewer>`
    );
    await new Promise(resovle => {
      setTimeout(() => resovle(null), 10);
    });
    await expect(el).shadowDom.exist;

    const imgViewer = (el.renderRoot.querySelector('img-viewer') as HTMLElement);
    await mockImgDetailsForJestRunner(imgViewer);

    const imgEle = (imgViewer.shadowRoot as ShadowRoot).querySelector('img');
    const initialWidth = imgEle?.width;


    const domEle = ((imgViewer.shadowRoot as ShadowRoot).querySelector('.grab') as HTMLElement);

    const startTouch = new TouchEvent('touchstart',
      {
        bubbles: true, cancelable: true,
        touches: [new Touch({ pageX: 100, pageY: 100, identifier: 1, target: domEle }),
          new Touch({ pageX: 200, pageY: 200, identifier: 1, target: domEle })],
      });
    const firstTouch = new TouchEvent('touchmove',
      {
        bubbles: true, cancelable: true,
        touches: [new Touch({ pageX: 100, pageY: 100, identifier: 1, target: domEle }),
          new Touch({ pageX: 200, pageY: 200, identifier: 1, target: domEle })],
      });
    domEle.dispatchEvent(startTouch);
    domEle.dispatchEvent(firstTouch);
    const secondTouch = new TouchEvent('touchmove',
      {
        bubbles: true, cancelable: true,
        touches: [new Touch({ pageX: 110, pageY: 110, identifier: 1, target: domEle }),
          new Touch({ pageX: 190, pageY: 190, identifier: 1, target: domEle })],
      });
    domEle.dispatchEvent(secondTouch);

    await new Promise(resovle => {
      setTimeout(() => resovle(null), 30);
    });
    const curWidth = Number(imgEle?.style.left.replace('px', ''));
    await expect(curWidth).to.be.lessThan(initialWidth as number);

  });


  it('verify error on invalid image', async () => {
    const el = await fixture<ScDocumentImageViewer>(
      html`<sc-document-image-viewer
        style="width:900px;height:500px;display:block"
        .selections=${hocr}
        .data=${{ name: 'Test.pdf', pages: [base64Png, base64Png] }}
      
      ></sc-document-image-viewer>`
    );
    await new Promise(resovle => {
      setTimeout(() => resovle(null), 10);
    });
    await expect(el).shadowDom.exist;
    const imgViewer = (el.renderRoot.querySelector('img-viewer') as HTMLElement);
    await mockImgDetailsForJestRunner(imgViewer, true);
    const errorElement = (imgViewer.shadowRoot as ShadowRoot).querySelector('#error-message');
    await expect(errorElement).exist;
  });


});


