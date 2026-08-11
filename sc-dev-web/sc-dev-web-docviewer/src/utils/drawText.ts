import { Context } from 'svgcanvas';

export class DrawText {
  x: number;
  y: number;
  content: string;
  color: string;
  size: number;
  height: number;
  width: number;
  id: string;
  ctx: CanvasRenderingContext2D | Context;
  constructor(
    ctx: CanvasRenderingContext2D | Context,
    x: number,
    y: number,
    content: string,
    color: string,
    size: number
  ) {
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.content = content;
    this.color = color;
    this.size = Math.max(size, 16);
    this.width = 0;
    this.height = 0;
    this.id = `${Date.now().toString(36)}-${Math.random()
      .toString(36)
      .substr(2)}`;
  }
  draw() {
    // Parse HTML content
    const parser = new DOMParser();
    const doc = parser.parseFromString(
      `<div>${this.content}</div>`,
      'text/html'
    );
    const root = doc.body.firstChild as HTMLElement;
    let currY = this.y;
    let maxWidth = 0;
    let totalHeight = 0;

    // Recursively render nodes
    const renderNode = (
      node: Node,
      x: number,
      y: number,
      parentStyle: Partial<CSSStyleDeclaration> = {},
      parentFontSize: number = this.size,
      draw = true,
    ): { width: number; height: number } => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent || '';
        // Ignore text nodes that only contain a newline character
        if (text === '\n') return { width: 0, height: 0 };
        if (!text.trim()) return { width: 0, height: 0 };
        // Inherit styles
        const style = parentStyle;
        const fontSize = style.fontSize
          ? parseFloat(style.fontSize)
          : parentFontSize;
        const fontWeight = style.fontWeight || 'normal';
        const fontStyle = style.fontStyle || 'normal';
        const textDecoration = style.textDecoration || '';
        const color = style.color || this.color;
        // eslint-disable-next-line
        const fontFamily = `'SC Prosper Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'`;
        this.ctx.save();
        this.ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`;
        this.ctx.fillStyle = color;
        this.ctx.textBaseline = 'top';
        if (draw) {
        // Background color
        if (style.backgroundColor && style.backgroundColor !== 'transparent') {
          const metrics = this.ctx.measureText(text);
          const h = fontSize * 1.2;
          this.ctx.save();
          this.ctx.fillStyle = style.backgroundColor;
          this.ctx.fillRect(x, y, metrics.width, h);
          this.ctx.restore();
        }
        // Underline/strikethrough
        if (
          textDecoration.includes('underline') ||
          textDecoration.includes('line-through')
        ) {
          const metrics = this.ctx.measureText(text);
          const h = fontSize * 1.2;
          this.ctx.fillText(text, x, y);
          this.ctx.save();
          this.ctx.strokeStyle = color;
          this.ctx.lineWidth = 1;
          if (textDecoration.includes('underline')) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, y + fontSize);
            this.ctx.lineTo(x + metrics.width, y + fontSize);
            this.ctx.stroke();
          }
          if (textDecoration.includes('line-through')) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, y + fontSize / 2);
            this.ctx.lineTo(x + metrics.width, y + fontSize / 2);
            this.ctx.stroke();
          }
          this.ctx.restore();
        } else {
          this.ctx.fillText(text, x, y);
        }
        }
        const metrics = this.ctx.measureText(text);
        this.ctx.restore();
        return { width: metrics.width, height: fontSize * 1.2 };
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node as HTMLElement;
        // Merge styles
        const style: Partial<CSSStyleDeclaration> = { ...parentStyle };
        const computed = el.style;
        for (const key of [
          'fontSize',
          'fontWeight',
          'fontStyle',
          'color',
          'backgroundColor',
          'textDecoration',
          'textAlign',
          'fontFamily',
          'verticalAlign',
        ] as any[]) {
          if (computed[key]) style[key] = computed[key];
        }
        // strong/b/bold
        if (
          el.tagName === 'STRONG' ||
          el.tagName === 'B' ||
          el.tagName === 'H4'
        )
          style.fontWeight = 'bold';
        // em/italic
        if (el.tagName === 'EM' || el.tagName === 'I')
          style.fontStyle = 'italic';
        // u/underline

        if (el.tagName === 'U')
          style.textDecoration = `${style.textDecoration || ''} underline`;
        // s/strike
        if (el.tagName === 'S' || el.tagName === 'STRIKE')
          style.textDecoration = `${style.textDecoration || ''} line-through`;
        // sub/sup
        let yOffset = 0;
        let fontSize = style.fontSize
          ? parseFloat(style.fontSize)
          : parentFontSize;
        if (el.tagName === 'SUB') {
          fontSize = Math.max(fontSize * 0.7, 10);
          yOffset = fontSize * 0.5;
        }
        if (el.tagName === 'SUP') {
          fontSize = Math.max(fontSize * 0.7, 10);
          yOffset = -fontSize * 0.5;
        }
        // Paragraph/title line break and text-align support
        let localX = x;
        const localY = y + yOffset;
        const lineHeight = fontSize * 1.5;
        const isBlockTag = ['P', 'H4', 'DIV'].includes(el.tagName);
        const textAlign = style.textAlign || el.getAttribute('align');
        if (isBlockTag) {
          const children = Array.from(el.childNodes);
          let totalLineWidth = 0;
          for (const child of children) {
            const { width: w } = renderNode(child, 0, 0, style, fontSize, false);
            totalLineWidth += w;
          }
          const contentWidth = Math.max(200, this.ctx.canvas.width * 0.1);
          if (textAlign === 'center') {
            localX = this.x + (contentWidth - totalLineWidth) / 2;
          } else if (textAlign === 'right') {
            localX = this.x + (contentWidth - totalLineWidth);
          } else {
            localX = this.x;
          }
        }
        const children = Array.from(el.childNodes);
        let offsetX = localX;
        let maxH = 0;
        for (const child of children) {
          const { width: w, height: h } = renderNode(
            child,
            offsetX,
            localY,
            style,
            fontSize,
            draw
          );
          offsetX += w;
          maxH = Math.max(maxH, h);
        }
        // Block element height is the actual content height, use lineHeight if content is empty
        return { width: offsetX - localX, height: isBlockTag ? (maxH || lineHeight) : maxH };
      }
      return { width: 0, height: 0 };
    };

    // Render by segment
    // Determine block elements
    const isBlock = (el: Node) => {
      if (el.nodeType !== Node.ELEMENT_NODE) return false;
      const tag = (el as HTMLElement).tagName;
      return [
        'DIV',
        'P',
        'H1',
        'H2',
        'H3',
        'H4',
        'H5',
        'H6',
        'UL',
        'OL',
        'LI',
        'BLOCKQUOTE',
        'PRE',
        'TABLE',
        'TR',
        'TD',
        'TH',
        'SECTION',
        'ARTICLE',
        'NAV',
        'ASIDE',
        'HEADER',
        'FOOTER',
        'ADDRESS',
      ].includes(tag);
    };
    if (root) {
      for (const node of Array.from(root.childNodes)) {
        const { width: w, height: h } = renderNode(node, this.x, currY);
        maxWidth = Math.max(maxWidth, w);
        // Only block elements with content height > 0 will trigger a line break
        if (isBlock(node) && h > 0) {
          currY += h;
          totalHeight += h;
        } else {
          // Inline elements accumulate height but do not trigger a line break
          totalHeight = Math.max(totalHeight, h);
        }
      }
    }
    this.width = maxWidth;
    this.height = totalHeight;
  }
  contains(x: number, y: number) {
    return (
      x >= this.x &&
      x <= this.x + this.width &&
      y >= this.y &&
      y <= this.y + this.height
    );
  }
}
