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

  const handleResultPage = async () => {
    try {
      const apiData: APITreeData = {};
      
      const convertToApiFormat = (node: TreeNode) => {
        if (node.id === 'root') {
          const sortedChildren = [...node.children].sort((a, b) => {
            if (a.position === 'left' && b.position === 'right') return -1;
            if (a.position === 'right' && b.position === 'left') return 1;
            return 0;
          });
          
          apiData[node.number] = sortedChildren.map(child => child.number);
        } else {
          const leftChildren = node.children.filter(child => child.position === 'left');
          const rightChildren = node.children.filter(child => child.position === 'right');
  
          apiData[node.number] = [
            leftChildren.length > 0 ? leftChildren[0].number : null,
            rightChildren.length > 0 ? rightChildren[0].number : null
          ];
  
          if (node.children.length === 0) {
            apiData[node.number] = [];
          }
        }
  
        node.children.forEach(child => {
          convertToApiFormat(child);
        });
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

  const handleAddChild = (parentId: string, number: number, position: 'left' | 'right', placement: 'horizontal' | 'vertical') => {
    const newNode: TreeNode = {
      id: Math.random().toString(36).substr(2, 9),
      number,
      position,
      placement,
      children: []
    };
  
    setTree(prevTree => {
      const addChildToNode = (node: TreeNode): TreeNode => {
        if (node.id === parentId) {
          const existingChildren = [...node.children];
          const existingNumbers = new Set(existingChildren.map(child => child.number));
          
          if (existingNumbers.has(number)) {
            alert('A node with this number already exists!');
            return node;
          }
  
          // Add new child maintaining position order
          const updatedChildren = [...existingChildren];
          if (position === 'left') {
            // Find the rightmost left child or the start of right children
            const insertIndex = updatedChildren.findIndex(child => child.position === 'right');
            if (insertIndex === -1) {
              updatedChildren.push(newNode);
            } else {
              updatedChildren.splice(insertIndex, 0, newNode);
            }
          } else {
            updatedChildren.push(newNode);
          }
  
          return {
            ...node,
            children: updatedChildren,
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
            <h1 className="text-3xl font-bold text-gray-800">Binary Tree Builder</h1>
          </div>
          <button
            onClick={handleResultPage}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
          >
            <Eye className="w-4 h-4" />
            View Result
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