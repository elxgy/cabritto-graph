import { Eye, Share2 } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TreeNode as TreeNodeComponent } from './components/TreeNode';
import { TreeNode } from './types';

const App = () => {
  const navigate = useNavigate();

  const [tree, setTree] = useState<TreeNode>({
    id: 'root',
    number: 0,
    children: []
  });

  const handleResultPage = () => {
    navigate('/result', { state: { treeData: tree } });
  };

  const handleAddChild = (parentId: string, number: number) => {
    const newNode: TreeNode = {
      id: Math.random().toString(36).substr(2, 9),
      number,
      children: []
    };

    const addChildToNode = (node: TreeNode): TreeNode => {
      if (node.id === parentId) {
        return {
          ...node,
          children: [...node.children, newNode],
        };
      }

      return {
        ...node,
        children: node.children.map(addChildToNode)
      };
    };

    setTree(addChildToNode(tree));
  };

  const handleNodeNumberChange = (nodeId: string, number: number) => {
    const updateNodeNumber = (node: TreeNode): TreeNode => {
      if (node.id === nodeId) {
        return {
          ...node,
          number
        };
      }

      return {
        ...node,
        children: node.children.map(updateNodeNumber)
      };
    };

    setTree(updateNodeNumber(tree));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3">
            <Share2 className="w-8 h-8 text-blue-500" />
            <h1 className="text-3xl font-bold text-gray-800">Crabritto Graph</h1>
          </div>
          <button
            onClick={handleResultPage}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
          >
            <Eye className="w-4 h-4" />
            Ver Resultado
          </button>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-12 min-h-[600px] flex items-start justify-center">
          <TreeNodeComponent
            node={tree}
            onAddChild={handleAddChild}
            onNumberChange={handleNodeNumberChange}
            isRoot={true}
          />
        </div>
      </div>
    </div>
  );
};

export default App;