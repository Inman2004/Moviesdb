declare module 'colorthief' {
  type Color = [number, number, number];
  export default class ColorThief {
    getColor(sourceImage: HTMLImageElement | null): Color;
    getPalette(sourceImage: HTMLImageElement | null, colorCount?: number, quality?: number): Color[];
  }
}
