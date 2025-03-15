import { ArrowLeft } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { TreeNode } from '../types';

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const treeData = location.state?.treeData;

  const formatTreeStructure = (root: TreeNode): string => {
    const structure: Record<number, number[]> = {};
    
    const traverse = (node: TreeNode) => {
      if (!structure[node.number]) {
        structure[node.number] = node.children.map(child => child.number);
      }
      node.children.forEach(child => traverse(child));
    };
  
    traverse(root);
  
    const orderedEntries: [number, number[]][] = [[root.number, structure[root.number] || []]];
    
    Object.entries(structure).forEach(([key, value]) => {
      const nodeNumber = Number(key);
      if (nodeNumber !== root.number) {
        orderedEntries.push([nodeNumber, value]);
      }
    });
  
    const formattedStructure = orderedEntries
      .map(([number, children]) => {
        const childrenStr = children.length ? children.join(', ') : '';
        return `    ${number}: [${childrenStr}]`;
      })
      .join(',\n');
  
    return `{\n${formattedStructure}\n}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center gap-3 mb-12">
          <button 
            onClick={() => navigate('/')}
            className="p-2 rounded-full hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Tree Structure</h1>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-12">
          <pre className="text-lg font-mono whitespace-pre-wrap bg-gray-50 p-6 rounded-lg border border-gray-200">
            {treeData ? formatTreeStructure(treeData) : 'No data available'}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default Result;