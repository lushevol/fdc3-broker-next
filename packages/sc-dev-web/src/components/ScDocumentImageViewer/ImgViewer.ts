import { LitElement, html, PropertyValueMap } from 'lit';
import { state, property } from 'lit/decorators.js';
import { PanelConfiguration, SwooshExtractionProps } from './ScDocumentImageViewer.js';
import ScTheme from '../../styles/ScTheme.js';
import ScImgViewerStyle from './ImgViewer.style.js';



export interface ImageProps {
  movementX: number;
  movementY: number;
  top: number;
  left: number;
  width: number;
  height: number;
  aspectRatio: number;
  originalWidth: number;
  originalHeight: number;
  isLoading: boolean;
  xScaleFactor: number;
  yScaleFactor: number;
  error: string
}

export class ImgViewer extends LitElement {
  @property({ attribute: false })
    config: PanelConfiguration;

  @property({ attribute: false })
    src: string;

  @property({ attribute: false })
    annotations: SwooshExtractionProps[];

  @property()
    setZoomIncrement: (zoom: number) => void;


  @state()
    previousTouch: Touch | null;

  @state()
    touchInitialDistance = 0;

  @state()
    imgDetails: ImageProps = {
      movementX: 0,
      movementY: 0,
      top: 0,
      left: 0,
      width: 0,
      height: 0,
      aspectRatio: 0,
      originalWidth: 0,
      originalHeight: 0,
      xScaleFactor: 0,
      yScaleFactor: 0,
      isLoading: true,
      error: '',
    };

  img: HTMLImageElement;


  static styles = ScTheme.getStyles().concat([ScImgViewerStyle]);


  onImgChange = (): void => {
    const img = new Image();
    this.img = img;
    this.imgDetails = {
      ...this.imgDetails,
      isLoading: true,
      error: '',
    };

    img.onerror = () => {
      this.imgDetails = {
        ...this.imgDetails,
        isLoading: false,
        // @ts-ignore
        error: `Error in loading image: ${img.src.split('/')?.at(-1)}`,
      };
    };

    img.onload = () => {
      const originalWidth = img.width;
      const originalHeight = img.height;

      const aspectRatio = originalWidth / originalHeight;
      const { top, left, height, width } = this.getImgDimension(aspectRatio,
        this.config.containerHeight,
        this.config.containerWidth,
        this.config.zoomLvl,
      );

      let xScaleFactor, yScaleFactor;
      if (this.config.zoomLvl === 1) {
        xScaleFactor = width / originalWidth;
        yScaleFactor = height / originalHeight;
      } else {
        const { height, width } = this.getImgDimension(aspectRatio,
          this.config.containerHeight,
          this.config.containerWidth,
          1,
        );
        xScaleFactor = width / originalWidth;
        yScaleFactor = height / originalHeight;
      }

      this.imgDetails = {
        ...this.imgDetails,
        originalWidth,
        originalHeight,
        aspectRatio,
        xScaleFactor,
        yScaleFactor,
        isLoading: false,
        left,
        top,
        width,
        height,
        error: '',
      };
    };
    img.src = `${this.src}`;
  };

  getImgDimension(aspectRatio: number, containerHeight: number, containerWidth: number, zoomLvl: number,
    currentLeft = 0, currentTop = 0) {
    let left = currentLeft, top = currentTop;

    const width = containerHeight * aspectRatio * zoomLvl;
    const height = containerHeight * zoomLvl;



    const panPadding = 10;

    if (left > panPadding && width > containerWidth) {
      left = panPadding;
    }

    if (left < containerWidth - width - panPadding) {
      left = containerWidth - width - panPadding;
    }

    if (width <= containerWidth) {
      left = (containerWidth - width) / 2;
    }

    if (currentLeft > 0 && currentLeft + width < containerWidth) {
      left = currentLeft;
    }


    if (top > panPadding && height > containerHeight) {
      top = panPadding;
    }

    if (top < containerHeight - height - panPadding) {
      top = containerHeight - height - panPadding;
    }

    if (height <= containerHeight) {
      top = (containerHeight - height) / 2;
    }

    if (currentTop > 0 && currentTop + height < containerHeight) {
      top = currentTop;
    }


    return { top, left, height, width };
  }



  protected updated(
    changedProps: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ) {
    if (
      changedProps.has('config') &&
      this.config &&
      changedProps.get('config')?.zoomLvl !== this.config.zoomLvl &&
      this.config.zoomLvl > 0
    ) {

      const { aspectRatio, left: currentLeft, top: currentTop } = this.imgDetails;
      const { containerHeight, containerWidth, zoomLvl } = this.config;

      const { top, left, height, width } = this.getImgDimension(aspectRatio,
        containerHeight,
        containerWidth,
        zoomLvl,
        currentLeft,
        currentTop,
      );

      this.imgDetails = { ...this.imgDetails, width, height, left, top };
    }

    if (changedProps.has('src')) {
      this.onImgChange();
    }
  }

  getDistance(touch1: Touch, touch2: Touch) {
    const x1: number = touch1.clientX;
    const x2: number = touch2.clientX;
    const y1: number = touch1.clientY;
    const y2: number = touch2.clientY;
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  }

  touchStart(event: TouchEvent) {
    if (event.touches.length === 2) {
      this.touchInitialDistance = this.getDistance(
        event.touches[0],
        event.touches[1]
      );
    }
  }

  handleMouseWheel(event: WheelEvent) {
    event.preventDefault();

    const scale = event.deltaY * -0.005;
    this.setZoomIncrement(scale);
  }

  handleMouseMove(event: MouseEvent | TouchEvent) {
    event.stopPropagation();
    event.preventDefault();

    let execute = !!(event instanceof MouseEvent && event.buttons);
    let initLeft = 0,
      initTop = 0;
    if (event instanceof TouchEvent && event.touches.length === 2) {
      const currentDistance: number = this.getDistance(
        event.touches[0],
        event.touches[1]
      );
      const incrementZoom =
        (currentDistance - this.touchInitialDistance) /
        this.touchInitialDistance /
        2;
      this.setZoomIncrement(incrementZoom);
      this.touchInitialDistance = currentDistance;

      initLeft = currentDistance * -incrementZoom;
      initTop = currentDistance * -incrementZoom;
      execute = true;
    } else if (event instanceof TouchEvent) {
      execute = true;
      const [touch] = event.touches;

      if (this.previousTouch) {
        initLeft = touch.pageX - this.previousTouch.pageX;
        initTop = touch.pageY - this.previousTouch.pageY;
      }
      this.previousTouch = touch;
    }

    if (event instanceof MouseEvent) {
      initLeft = event.movementX;
      initTop = event.movementY;
    }
    if (execute) {
      let { top, left } = this.imgDetails;
      const { aspectRatio } = this.imgDetails;
      left += initLeft;
      top += initTop;



      const { containerHeight, containerWidth, zoomLvl } = this.config;
      const { top: newTop, left: newLeft, height, width } = this.getImgDimension(aspectRatio,
        containerHeight,
        containerWidth,
        zoomLvl,
        left,
        top,

      );
      this.imgDetails = { ...this.imgDetails, width, height, left: newLeft, top: newTop };
      return;


    }
  }

  getAnnotationDimension(annotation: SwooshExtractionProps) {
    return {
      left:
        annotation.xmin * this.imgDetails.xScaleFactor * this.config.zoomLvl +
        this.imgDetails.left,
      top:
        annotation.ymin * this.imgDetails.yScaleFactor * this.config.zoomLvl +
        this.imgDetails.top,
      width:
        (annotation.xmax - annotation.xmin) *
        this.imgDetails.xScaleFactor *
        this.config.zoomLvl,
      height:
        (annotation.ymax - annotation.ymin) *
        this.imgDetails.yScaleFactor *
        this.config.zoomLvl,
      title: `Entity: ${annotation.name}; Confidence : ${annotation.confidence}`,
    };
  }

  render() {
    if (this.imgDetails.isLoading) {
      return html`<div class="center-align">
        <sc-spinner type="component" size="lg"></sc-spinner>
      </div>`;
    }
    if (this.imgDetails.error) {
      return html`<div class="center-align flex-column" id="error-message">
        <sc-icon name="alert-circle--line" label="" size="lg" library=""></sc-icon>
        ${this.imgDetails.error}
      </div>      `;
    }

    const imgContainerStyle =
      `overflow: clip; height: ${this.config.containerHeight}px; width: ${this.config.containerWidth}px;`;
    const imgStyle = `position: absolute; top: ${this.imgDetails.top}px; left: ${this.imgDetails.left}px;`;

    return html`
      <div
        class="wrapper"
        @contextmenu=${(event: Event) => event.preventDefault()}
      >
        <div style=${imgContainerStyle}>
          <img
            alt="page"
            @contextmenu=${(event: Event) => event.preventDefault()}
            class="doc-image"
            src="${this.src}"
            height=${this.imgDetails.height}
            width=${this.imgDetails.width}
            style=${imgStyle}
          />
        </div>

        <div
          class="grab"
          @mousemove=${this.handleMouseMove}
          @touchmove=${this.handleMouseMove}
          @touchend=${() => {
    this.previousTouch = null;
  }}
          @touchstart=${this.touchStart}
          @wheel=${this.handleMouseWheel}
        ></div>

        ${this.annotations?.map(annotation => {
    const dimension = this.getAnnotationDimension(annotation);
    return html`
            <doc-annotation
              .left=${dimension.left}
              .top=${dimension.top}
              .width=${dimension.width}
              .height=${dimension.height}
              .title=${dimension.title}
            >
            </doc-annotation>
          `;
  })}
      </div>
    `;
  }
}
