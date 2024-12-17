declare namespace p5 {
  const p: {
    createCanvas: (
      width: number,
      height: number,
      dimension?: string,
      canvas?: HTMLCanvasElement
    ) => void;
    setup: () => void;
    draw: () => void;
    beginShape: () => void;
    endShape: () => void;
    vertex: (x: number, y: number) => void;
    strokeWeight: (number: number) => void;
    stroke: (num: number) => void;
  };
}
export default p5;
