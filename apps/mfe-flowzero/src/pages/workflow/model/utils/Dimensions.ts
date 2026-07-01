/**
 * Dimensions - Value Object
 * Represents width and height
 */
export class Dimensions {
  constructor(public readonly width: number, public readonly height: number) {
    if (width < 0 || height < 0) {
      throw new Error("Dimensions cannot be negative.");
    }
    if (isNaN(width) || isNaN(height)) {
      throw new Error("Dimensions must be valid numbers.");
    }
  }

  getArea(): number {
    return this.width * this.height;
  }

  equals(other: Dimensions): boolean {
    return this.width === other.width && this.height === other.height;
  }

  toString(): string {
    return `${this.width}x${this.height}`;
  }

  toJSON(): { width: number; height: number } {
    return { width: this.width, height: this.height };
  }
}
