import { Eye, Share2 } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendTreeData } from '../services/api';
import { TreeNode as TreeNodeComponent } from './components/TreeNode';
import { APITreeData, TreeNode } from './types';

const App = () => {
  const navigate = useNavigate();

  const [tree, setTree] = useState<TreeNode>({
    id: 'root',
    number: 0,
    children: [],
    position: 'right', 
    placement: 'vertical'
  });

  const handleAddChild = (parentId: string, number: number, position: 'left' | 'right', placement: 'horizontal' | 'vertical') => {
    setTree(prevTree => {
      const addChildToNode = (node: TreeNode): TreeNode => {
        if (node.id === parentId) {
          const newNode: TreeNode = {
            id: Math.random().toString(36).substr(2, 9),
            number,
            position,
            placement,
            children: []
          };
  
          return {
            ...node,
            children: [...node.children, newNode]
          };
        }
  
        return {
          ...node,
          children: node.children.map(addChildToNode)
        };
      };
  
      return addChildToNode(prevTree);
    });
  };
  
  const handleResultPage = async () => {
    try {
        const apiData: APITreeData = {};
        
        const convertToApiFormat = (node: TreeNode) => {
            if (!apiData[node.number]) {
                apiData[node.number] = [];
            }
            
            const sortedChildren = [...node.children].sort((a, b) => {
                if (a.position === 'left' && b.position === 'right') return -1;
                if (a.position === 'right' && b.position === 'left') return 1;
                return 0;
            });

            if (sortedChildren.length > 0 && sortedChildren[0].position === 'right') {
                apiData[node.number].push("None");
            }

            sortedChildren.forEach(child => {
                apiData[node.number].push(child.number);
            });

            sortedChildren.forEach(convertToApiFormat);
        };
        
        convertToApiFormat(tree);
        
        const response = await sendTreeData(apiData, tree);
        navigate('/result', { 
            state: { 
                treeData: tree, 
                apiResponse: response,
                apiFormat: apiData 
            } 
        });
    } catch (error) {
        console.error(error);
    }
};

  const handleNodeNumberChange = (nodeId: string, newNumber: number) => {
    setTree(prevTree => {
      const updateTree = (node: TreeNode): TreeNode => {
        const hasNumberConflict = node.children.some(child => child.number === newNumber);
        if (hasNumberConflict) {
          alert('A node with this number already exists!');
          return prevTree;
        }
  
        if (node.id === nodeId) {
          return {
            ...node,
            number: newNumber,
          };
        }
  
        return {
          ...node,
          children: node.children.map(updateTree)
        };
      };
  
      return updateTree(prevTree);
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3">
            <Share2 className="w-8 h-8 text-blue-500" />
            <h1 className="text-3xl font-bold text-gray-800">Construtor de Árvores</h1>
          </div>
          <button
            onClick={handleResultPage}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
          >
            <Eye className="w-4 h-4" />
            Veja o resultado
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
