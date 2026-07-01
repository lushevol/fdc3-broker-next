/**
 * Position - Value Object
 * Represents x, y coordinates for node positioning
 */
export class Position {
  constructor(public readonly x: number, public readonly y: number) {
    if (isNaN(x) || isNaN(y)) {
      throw new Error("Position coordinates must be valid numbers.");
    }
  }

  equals(other: Position): boolean {
    return this.x === other.x && this.y === other.y;
  }

  distanceTo(other: Position): number {
    const dx = this.x - other.x;
    const dy = this.y - other.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  toString(): string {
    return `(${this.x}, ${this.y})`;
  }

  toJSON(): { x: number; y: number } {
    return { x: this.x, y: this.y };
  }
}
