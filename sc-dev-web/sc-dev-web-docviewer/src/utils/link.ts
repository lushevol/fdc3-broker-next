import type { PDFDocumentProxy } from 'pdfjs-dist';
import type { IPDFLinkService } from 'pdfjs-dist/types/web/interfaces.js';
import type {
  Dest,
  ExternalLinkRel,
  ExternalLinkTarget,
  ResolvedDest,
  ScrollPageIntoViewArgs,
} from './pdf.type.js';

const DEFAULT_LINK_REL = 'noopener noreferrer nofollow';

type PDFViewer = {
  currentPageNumber?: number;
  scrollPageIntoView: (args: ScrollPageIntoViewArgs) => void;
};

export default class LinkService implements IPDFLinkService {
  externalLinkEnabled: boolean;
  externalLinkRel?: ExternalLinkRel;
  externalLinkTarget?: ExternalLinkTarget;
  isInPresentationMode: boolean;
  pdfDocument?: PDFDocumentProxy | null;
  pdfViewer?: PDFViewer | null;

  constructor() {
    this.externalLinkEnabled = true;
    this.externalLinkRel = undefined;
    this.externalLinkTarget = undefined;
    this.isInPresentationMode = false;
    this.pdfDocument = undefined;
    this.pdfViewer = undefined;
  }

  setDocument(pdfDocument: PDFDocumentProxy): void {
    this.pdfDocument = pdfDocument;
  }

  setViewer(pdfViewer: PDFViewer): void {
    this.pdfViewer = pdfViewer;
  }

  setExternalLinkRel(externalLinkRel?: ExternalLinkRel): void {
    this.externalLinkRel = externalLinkRel;
  }

  setExternalLinkTarget(externalLinkTarget?: ExternalLinkTarget): void {
    this.externalLinkTarget = externalLinkTarget;
  }

  setHistory(): void {
    // Intentionally empty
  }

  get pagesCount(): number {
    return this.pdfDocument ? this.pdfDocument.numPages : 0;
  }

  get page(): number {
    return this.pdfViewer?.currentPageNumber || 0;
  }

  set page(value: number) {
    if (this.pdfViewer) {
      this.pdfViewer.currentPageNumber = value;
    }
  }

  get rotation(): number {
    return 0;
  }

  set rotation(_value) {
    // Intentionally empty
  }

  goToDestination(dest: Dest): Promise<void> {
    return new Promise<ResolvedDest | null>(resolve => {
      if (typeof dest === 'string') {
        this.pdfDocument?.getDestination(dest).then(resolve);
      } else if (Array.isArray(dest)) {
        resolve(dest);
      } else {
        dest?.then(resolve);
      }
    }).then(explicitDest => {
      const destRef = explicitDest?.[0];

      new Promise<number>(resolve => {
        if (destRef instanceof Object) {
          this.pdfDocument
            ?.getPageIndex(destRef)
            .then(pageIndex => {
              resolve(pageIndex);
            })
            .catch(() => {
              // console.error(`"${destRef}" is not a valid page reference.`);
            });
        } else if (typeof destRef === 'number') {
          resolve(destRef);
        } else {
          // console.error(`"${destRef}" is not a valid destination reference.`);
        }
      }).then(pageIndex => {
        const pageNumber = pageIndex + 1;

        this.pdfViewer?.scrollPageIntoView({
          dest: explicitDest as ResolvedDest | undefined,
          pageIndex,
          pageNumber,
        });
      });
    });
  }

  navigateTo(dest: Dest): void {
    this.goToDestination(dest);
  }
  goToXY() {}

  goToPage(pageNumber: number): void {
    const pageIndex = pageNumber - 1;

    this.pdfViewer?.scrollPageIntoView({
      pageIndex,
      pageNumber,
    });
  }

  addLinkAttributes(
    link: HTMLAnchorElement,
    url: string,
    newWindow: boolean
  ): void {
    link.href = url;
    link.rel = this.externalLinkRel || DEFAULT_LINK_REL;
    link.target = newWindow ? '_blank' : this.externalLinkTarget || '';
  }

  getDestinationHash(): string {
    return '#';
  }

  getAnchorUrl(): string {
    return '#';
  }

  setHash(): void {
    // Intentionally empty
  }

  executeNamedAction(): void {
    // Intentionally empty
  }

  cachePageRef(): void {
    // Intentionally empty
  }

  isPageVisible(): boolean {
    return true;
  }

  isPageCached(): boolean {
    return true;
  }

  executeSetOCGState(): void {
    // Intentionally empty
  }
}
