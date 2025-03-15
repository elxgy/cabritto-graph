import { ArrowLeft, ArrowRight, Pencil } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface TreeNodeType {
  id: string;
  number: number;
  children: TreeNodeType[];
  position?: 'left' | 'right';
}

interface Props {
  node: TreeNodeType;
  onAddChild: (parentId: string, number: number, position: 'left' | 'right') => void;
  onNumberChange?: (nodeId: string, number: number) => void;
  isRoot?: boolean;
}

export const TreeNode: React.FC<Props> = ({ node, onAddChild, onNumberChange, isRoot = false }) => {
  const [newNumber, setNewNumber] = useState('');
  const [activeGhost, setActiveGhost] = useState<'left' | 'right' | null>(null);
  const [isEditing, setIsEditing] = useState(isRoot && node.number === 0);
  const [editNumber, setEditNumber] = useState(node.number.toString());

  useEffect(() => {
    setEditNumber(node.number.toString());
  }, [node.number]);

  const handleNumberSubmit = (position: 'left' | 'right') => {
    const num = parseInt(newNumber);
    if (!isNaN(num)) {
      onAddChild(node.id, num, position);
      setNewNumber('');
      setActiveGhost(null);
    }
  };

  const handleEditSubmit = () => {
    const num = parseInt(editNumber);
    if (!isNaN(num) && onNumberChange) {
      onNumberChange(node.id, num);
      setIsEditing(false);
    }
  };

  const leftChild = node.children.find(child => child.position === 'left');
  const rightChild = node.children.find(child => child.position === 'right');

  return (
    <div className="relative flex flex-col items-center">
      <div className="relative flex flex-col items-center">
        {/* Connection line */}
        {!isRoot && (
          <div className="absolute top-[-1rem] left-1/2 -translate-x-1/2 w-0.5 h-4 bg-gray-400" />
        )}

        {/* Main node with edit */}
        <div className="flex flex-col items-center">
          <div className="relative flex items-center">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-md border-2 
              ${isRoot ? 'bg-blue-500 border-blue-600' : 'bg-green-400 border-green-500'}`}
            >
              {(isEditing || (isRoot && node.number === 0)) ? (
                <input
                  type="number"
                  className="w-8 text-center bg-transparent outline-none text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  value={editNumber}
                  onChange={(e) => setEditNumber(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleEditSubmit();
                    }
                  }}
                  autoFocus
                />
              ) : (
                <span className="text-lg font-bold text-white">{node.number}</span>
              )}
            </div>
            {(!isRoot || node.number !== 0) && (
              <button
                className="absolute -right-8 w-6 h-6 rounded-full bg-white hover:bg-gray-100 flex items-center justify-center shadow-sm"
                onClick={() => setIsEditing(true)}
              >
                <Pencil className="w-3 h-3 text-gray-600" />
              </button>
            )}
          </div>
        </div>

        {/* Ghost Nodes */}
        <div className="relative mt-4 flex gap-8">
          {/* Left Ghost Node */}
          {!leftChild && (
            <div className="relative flex flex-col items-center">
              <div
                className={`w-12 h-12 rounded-full border-2 border-dashed 
                  ${activeGhost === 'left' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white'} 
                  cursor-pointer transition-all duration-200 flex items-center justify-center`}
                onClick={() => setActiveGhost(activeGhost === 'left' ? null : 'left')}
              >
                {activeGhost === 'left' ? (
                  <input
                    type="number"
                    className="w-8 text-center bg-transparent outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    value={newNumber}
                    onChange={(e) => setNewNumber(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleNumberSubmit('left');
                      }
                    }}
                    autoFocus
                  />
                ) : (
                  <ArrowLeft className="w-5 h-5 text-gray-400" />
                )}
              </div>
              <div className="absolute top-[-1rem] left-1/2 -translate-x-1/2 w-0.5 h-4 bg-gray-400" />
            </div>
          )}

          {/* Right Ghost Node */}
          {!rightChild && (
            <div className="relative flex flex-col items-center">
              <div
                className={`w-12 h-12 rounded-full border-2 border-dashed 
                  ${activeGhost === 'right' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white'} 
                  cursor-pointer transition-all duration-200 flex items-center justify-center`}
                onClick={() => setActiveGhost(activeGhost === 'right' ? null : 'right')}
              >
                {activeGhost === 'right' ? (
                  <input
                    type="number"
                    className="w-8 text-center bg-transparent outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    value={newNumber}
                    onChange={(e) => setNewNumber(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleNumberSubmit('right');
                      }
                    }}
                    autoFocus
                  />
                ) : (
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                )}
              </div>
              <div className="absolute top-[-1rem] left-1/2 -translate-x-1/2 w-0.5 h-4 bg-gray-400" />
            </div>
          )}
        </div>
      </div>

      {/* Children */}
      {node.children.length > 0 && (
        <div className="mt-8 flex gap-12 relative">
          <div className="absolute top-[-2rem] left-1/2 -translate-x-1/2 w-0.5 h-4 bg-gray-400" />
          <div className="absolute top-[-1rem] left-0 right-0 h-0.5 bg-gray-400" />
          {node.children.map((child) => (
            <div key={child.id} className="relative flex flex-col items-center">
              <div className="absolute top-[-1rem] left-1/2 -translate-x-1/2 w-0.5 h-6 bg-gray-400" />
              <TreeNode
                node={child}
                onAddChild={onAddChild}
                onNumberChange={onNumberChange}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};