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
    [key: string]: (number | "None")[];
  };
}
export interface APITreeData {
  [key: string]: (number | "None")[];
}