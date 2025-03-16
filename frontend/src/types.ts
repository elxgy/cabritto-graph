export interface TreeNode {
  id: string;
  number: number;
  children: TreeNode[];
  position: 'left' | 'right';
  placement: 'horizontal' | 'vertical';
}

export interface TreeRequestData {
  root: number;
  children: {
    [key: number]: number[];
  };
}

export interface APITreeData {
  [key: number]: number[];
}

export interface Position {
  x: number;
  y: number;
}
