declare class p5 {
  constructor(sketch: (p: sketchFns) => void);
  p: sketchFns;
}

declare class axios {
  static get: (url: string, settings?: any) => Promise<any>;
  static post: (url: string, data: any, settings?: any) => Promise<any>;
  static put: (url: string, data: any, settings?: any) => Promise<any>;
  static delete: (url: string, settings?: any) => Promise<any>;
}

interface sketchFns {
  createCanvas: (
    width: number,
    height: number,
    canvas?: HTMLCanvasElement
  ) => void;
  setup: () => void;
  background: (color: number, color2?: number, color3?: number) => void;
  draw: () => void;
  beginShape: () => void;
  endShape: () => void;
  vertex: (x: number, y: number) => void;
  strokeWeight: (weight: number) => void;
  stroke: (
    color: number,
    color2?: number,
    color3?: number,
    ...colors: number[]
  ) => void;
  line: (x1: number, y1: number, x2: number, y2: number) => void;
  noLoop: () => void;
  fill: (color: number, color2?: number, color3?: number) => void;
  noFill: () => void;
  point: (x: number, y: number) => void;
  width: number;
  height: number;
}
interface ServiceInDBI {
  serviceName: string;
  domain: string;
  html: {
    name: string;
    pageLink: string;
    price: string;
    ul: string;
    image: string;
    availability: {
      exists: boolean;
      className: string;
    };
  };
  search: {
    normalText: string;
    additionalText: string;
  };
  visits?: Array<{
    date: string;
    count: number;
  }>;
  _id?: string;
}
