export type TextNode = {
  id: string;
  value: string;
  x: number;
  y: number;
  color: string;
  width: number;
  height: number;
  fontSize: number;
};

export type ResizingSettings = {
  nodeId: string;
  startX: number;
  startY: number;
  width?: number;
  height?: number;
  handle: string;
};

export type MovingSettings = {
  nodeId: string;
  startX: number;
  startY: number;
  x?: number;
  y?: number;
};
