import { ETools } from '../components/ScScriber.toolbar.util';
import { composeAlpha } from './colors';
import { Context } from 'svgcanvas';

export class Drawing {
  type: ETools;
  data: any;
  id: string;
  ctx: CanvasRenderingContext2D | Context;

  constructor(ctx: CanvasRenderingContext2D | Context, type: ETools, data: any, id?: string) {
    this.ctx = ctx;
    this.type = type;
    this.data = data;
    this.id = id ?? `${Date.now().toString(36)}-${Math.random()
      .toString(36)
      .substr(2)}`;
  }

  postCleanup?: () => void;
  prepare() {
    this.updateBrushStyle();
    switch (this.type) {
      case ETools.pen:
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        break;
      case ETools.highlightRect:
        this.ctx.strokeStyle = 'transparent';
        this.ctx.fillStyle = composeAlpha(this.data.color ?? '#FAAD14', 0.9) ?? this.data.color;
        // this.ctx.fillStyle = this.data.color ?? '#FAAD14';
        this.postCleanup = () => {
          this.ctx.strokeStyle = this.data.color ?? '#FAAD14';
          this.ctx.fillStyle = 'transparent';
        };
        break;
    }
  }

  updateBrushStyle() {
    this.ctx.strokeStyle = this.data.color;
    this.ctx.lineWidth = this.data.size;
  }

  drawArrow(fromX: number, fromY: number, toX: number, toY: number) {
    const headLength = 15;
    const dx = toX - fromX;
    const dy = toY - fromY;
    const angle = Math.atan2(dy, dx);
    this.ctx.beginPath();
    this.ctx.moveTo(fromX, fromY);
    this.ctx.lineTo(toX, toY);
    this.ctx.stroke();

    this.ctx.beginPath();
    this.ctx.moveTo(toX, toY);
    this.ctx.lineTo(
      toX - headLength * Math.cos(angle - Math.PI / 6),
      toY - headLength * Math.sin(angle - Math.PI / 6)
    );
    this.ctx.moveTo(toX, toY);
    this.ctx.lineTo(
      toX - headLength * Math.cos(angle + Math.PI / 6),
      toY - headLength * Math.sin(angle + Math.PI / 6)
    );
    this.ctx.stroke();
  }

  draw() {
    this.ctx.save();
    this.prepare();
    switch (this.type) {
      case ETools.pen:
        this.ctx.beginPath();
        this.ctx.moveTo(this.data.points[0].x, this.data.points[0].y);
        for (let i = 1; i < this.data.points.length; i++) {
          this.ctx.lineTo(this.data.points[i].x, this.data.points[i].y);
        }
        this.ctx.stroke();
        break;
      case ETools.line:
        this.ctx.beginPath();
        this.ctx.moveTo(this.data.startX, this.data.startY);
        this.ctx.lineTo(this.data.endX, this.data.endY);
        this.ctx.stroke();
        break;
      case ETools.rectangle:
        this.ctx.beginPath();
        const width = this.data.endX - this.data.startX;
        const height = this.data.endY - this.data.startY;
        this.ctx.strokeRect(this.data.startX, this.data.startY, width, height);
        break;
      case ETools.highlightRect: {
        const width = this.data.endX - this.data.startX;
        const height = this.data.endY - this.data.startY;
        this.ctx.fillRect(this.data.startX, this.data.startY, width, height);
      } break;
      case ETools.arrow:
        this.ctx.beginPath();
        this.drawArrow(
          this.data.startX,
          this.data.startY,
          this.data.endX,
          this.data.endY
        );
        break;
      case ETools.circle:
        const radius = Math.sqrt(
          Math.pow(this.data.endX - this.data.startX, 2) +
            Math.pow(this.data.endY - this.data.startY, 2)
        );
        this.ctx.beginPath();
        this.ctx.arc(
          this.data.startX,
          this.data.startY,
          radius,
          0,
          Math.PI * 2
        );
        this.ctx.stroke();
        break;
      case ETools.text:
        // this.ctx.fillStyle = this.data.color;
        // this.ctx.font = `${this.data.size}px 'SC Prosper Sans', -apple-system, BlinkMacSystemFont,
        // 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji',
        // 'Segoe UI Emoji', 'Segoe UI Symbol'`;
        // this.ctx.textBaseline = 'top';
        // this.ctx.fillText(this.data.content, this.data.x, this.data.y);
        break;
    }
    if (this.ctx instanceof Context) {
      // can later use for hovering or selecting, warn: internal imp may change
      this.ctx.__currentElement?.setAttribute('id', `svg__${this.id}`);
    }
    this.postCleanup?.();
    this.ctx.restore();
  }
  isErased(x: number, y: number, size: number) {
    if (this.type === ETools.text) {
      return false;
    }

    const dx = this.data.endX - this.data.startX;
    const dy = this.data.endY - this.data.startY;
    switch (this.type) {
      case ETools.pen:
        for (const point of this.data.points) {
          const dx = point.x - x;
          const dy = point.y - y;
          if (Math.sqrt(dx * dx + dy * dy) <= size / 2) {
            return true;
          }
        }
        break;
      case ETools.line:
        const lineLength = Math.sqrt(dx * dx + dy * dy);

        const dis =
          ((x - this.data.startX) * dx + (y - this.data.startY) * dy) /
          Math.pow(lineLength, 2);
        const closestX = this.data.startX + dis * dx;
        const closestY = this.data.startY + dis * dy;
        const onSegment =
          closestX >= Math.min(this.data.startX, this.data.endX) &&
          closestX <= Math.max(this.data.startX, this.data.endX) &&
          closestY >= Math.min(this.data.startY, this.data.endY) &&
          closestY <= Math.max(this.data.startY, this.data.endY);
        if (onSegment) {
          const distX = closestX - x;
          const distY = closestY - y;
          if (Math.sqrt(distX * distX + distY * distY) <= size / 2) {
            return true;
          }
        }

        break;
      case ETools.rectangle:
        const minX = Math.min(this.data.startX, this.data.endX);
        const maxX = Math.max(this.data.startX, this.data.endX);
        const minY = Math.min(this.data.startY, this.data.endY);
        const maxY = Math.max(this.data.startY, this.data.endY);
        const nearLeft =
          Math.abs(x - minX) <= size / 2 && y >= minY && y <= maxY;
        const nearRight =
          Math.abs(x - maxX) <= size / 2 && y >= minY && y <= maxY;
        const nearTop =
          Math.abs(y - minY) <= size / 2 && x >= minX && x <= maxX;
        const nearBottom =
          Math.abs(y - maxY) <= size / 2 && x >= minX && x <= maxX;
        return nearLeft || nearRight || nearTop || nearBottom;
        break;
      case ETools.circle:
        const radius = Math.sqrt(dx * dx + dy * dy);
        const circleDis = Math.sqrt(
          Math.pow(x - this.data.startX, 2) + Math.pow(y - this.data.startY, 2)
        );
        return Math.abs(circleDis - radius) <= size / 2;
        break;

      case ETools.arrow:
        const arrowLineLength = Math.sqrt(dx * dx + dy * dy);

        const arrowDis =
          ((x - this.data.startX) * dx + (y - this.data.startY) * dy) /
          Math.pow(arrowLineLength, 2);
        const arrowClosestX = this.data.startX + arrowDis * dx;
        const arrowClosestY = this.data.startY + arrowDis * dy;
        const arrawOnSegment =
          arrowClosestX >= Math.min(this.data.startX, this.data.endX) &&
          arrowClosestX <= Math.max(this.data.startX, this.data.endX) &&
          arrowClosestY >= Math.min(this.data.startY, this.data.endY) &&
          arrowClosestY <= Math.max(this.data.startY, this.data.endY);
        if (arrawOnSegment) {
          const distX = arrowClosestX - x;
          const distY = arrowClosestY - y;
          if (Math.sqrt(distX * distX + distY * distY) <= size / 2) {
            return true;
          }
        }

        const angle = Math.atan2(dy, dx);
        const headLength = 15;
        const headX = this.data.endX;
        const headY = this.data.endY;
        const p1 = { x: headX, y: headY };
        const p2 = {
          x: headX - headLength * Math.cos(angle - Math.PI / 6),
          y: headY - headLength * Math.sin(angle - Math.PI / 6),
        };
        const p3 = {
          x: headX - headLength * Math.cos(angle + Math.PI / 6),
          y: headY - headLength * Math.sin(angle + Math.PI / 6),
        };
        const area =
          0.5 *
          (-p2.y * p3.x +
            p1.y * (-p2.x + p3.x) +
            p1.x * (p2.y - p3.y) +
            p2.x * p3.y);
        const s =
          (1 / (2 * area)) *
          (p1.y * p3.x - p1.x * p3.y + (p3.y - p1.y) * x + (p1.x - p3.x) * y);
        const t2 =
          (1 / (2 * area)) *
          (p1.x * p2.y - p1.y * p2.x + (p1.y - p2.y) * x + (p2.x - p1.x) * y);
        if (s >= 0 && t2 >= 0 && 1 - s - t2 >= 0) {
          return true;
        }
        break;
    }
  }
}
