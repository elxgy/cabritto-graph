import { ArrowLeft, ArrowRight, ArrowUp, Pencil, Plus } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { TreeNode as TreeNodeType } from '../types';

interface Props {
  node: TreeNodeType;
  onAddChild: (
    parentId: string, 
    number: number, 
    position: 'left' | 'right', 
    placement: 'horizontal' | 'vertical'
  ) => void;
  onNumberChange?: (nodeId: string, number: number) => void;
  isRoot?: boolean;
  parentId?: string;
}

export const TreeNode: React.FC<Props> = ({ 
  node, 
  onAddChild, 
  onNumberChange, 
  isRoot = false, 
}) => {
  const [newNumber, setNewNumber] = useState('');
  const [activeGhost, setActiveGhost] = useState<'left' | 'right' | null>(null);
  const [selectedDirection, setSelectedDirection] = useState<'left' | 'right' | null>(null);
  const [showDirectionChoice, setShowDirectionChoice] = useState(false);
  const [isEditing, setIsEditing] = useState(isRoot && node.number === 0);
  const [editNumber, setEditNumber] = useState(node.number.toString());

  useEffect(() => {
    setEditNumber(node.number.toString());
  }, [node.number]);

  const handleAddClick = () => {
    setShowDirectionChoice(true);
  };

  const handleDirectionSelect = (direction: 'left' | 'right') => {
    setSelectedDirection(direction);
    setShowDirectionChoice(false);
    setActiveGhost(direction);
  };

  const handleBackClick = () => {
    setSelectedDirection(null);
    setActiveGhost(null);
    setShowDirectionChoice(true);
  };

  const handleNumberSubmit = (position: 'left' | 'right') => {
    const num = parseInt(newNumber);
    if (!isNaN(num)) {
      onAddChild(node.id, num, position, isRoot ? 'vertical' : 'horizontal');
      setNewNumber('');
      setActiveGhost(null);
      setSelectedDirection(null);
      setShowDirectionChoice(false);
    }
  };

  const handleEditSubmit = () => {
    const num = parseInt(editNumber);
    if (!isNaN(num) && onNumberChange) {
      onNumberChange(node.id, num);
      setIsEditing(false);
    }
  };

  const renderGhostNode = (position: 'left' | 'right') => (
    <div className="relative">
      {/* Connection line to ghost node */}
      <div className={`absolute top-1/2 ${position === 'left' ? 'right-0 translate-x-full' : 'left-0 -translate-x-full'} 
        w-8 h-[2px] bg-gray-300`} 
      />
      <div
        className={`w-12 h-12 rounded-full border-2 border-dashed 
          ${activeGhost === position ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white'} 
          cursor-pointer transition-all duration-200 flex items-center justify-center
          hover:border-blue-300 hover:bg-blue-50 shadow-sm`}
        onClick={() => setActiveGhost(activeGhost === position ? null : position)}
      >
        {activeGhost === position ? (
          <input
            type="number"
            className="w-8 text-center bg-transparent outline-none [appearance:textfield] 
              [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            value={newNumber}
            onChange={(e) => setNewNumber(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleNumberSubmit(position);
              }
            }}
            autoFocus
          />
        ) : (
          position === 'left' ? (
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          ) : (
            <ArrowRight className="w-5 h-5 text-gray-400" />
          )
        )}
      </div>
    </div>
  );

  return (
    <div className="relative flex flex-row items-center justify-center gap-16">
      {/* Left ghost node */}
      {selectedDirection === 'left' && (
        <div className="flex items-center">
          {renderGhostNode('left')}
        </div>
      )}

      <div className="flex flex-col items-center">
        {/* Add/Back button - Increased spacing */}
        {!isEditing && node.number !== 0 && !activeGhost && !showDirectionChoice && (
          <button
            onClick={selectedDirection ? handleBackClick : handleAddClick}
            className="absolute -top-12 left-1/2 -translate-x-1/2 p-2 rounded-full bg-white hover:bg-gray-100 
              shadow-md border border-gray-200 z-10 transition-all duration-200"
          >
            {selectedDirection ? (
              <ArrowUp className="w-4 h-4 text-gray-600" />
            ) : (
              <Plus className="w-4 h-4 text-gray-600" />
            )}
          </button>
        )}

        {/* Direction choice buttons - Adjusted position */}
        {showDirectionChoice && (
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            <button
              onClick={() => handleDirectionSelect('left')}
              className="p-2 rounded-full bg-white hover:bg-gray-100 shadow-md border border-gray-200 transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4 text-gray-600" />
            </button>
            <button
              onClick={() => handleDirectionSelect('right')}
              className="p-2 rounded-full bg-white hover:bg-gray-100 shadow-md border border-gray-200 transition-all duration-200"
            >
              <ArrowRight className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        )}

        {/* Connection line from parent */}
        {!isRoot && (
          <div className="absolute left-1/2 -top-12 w-[2px] h-12 bg-gray-300 -translate-x-1/2" />
        )}

        {/* Main node */}
        <div className="relative z-10">
          <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-md border-2 
            ${isRoot ? 'bg-blue-500 border-blue-600' : 'bg-green-400 border-green-500'}
            transition-all duration-200 hover:shadow-lg transform hover:scale-105`}
          >
            {isEditing ? (
              <input
                type="number"
                className="w-8 text-center bg-transparent outline-none text-white [appearance:textfield] 
                  [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
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
              <span className="text-xl font-bold text-white">{node.number}</span>
            )}
          </div>

          {/* Edit button - Adjusted position */}
          {!isEditing && node.number !== 0 && (
            <button
              className="absolute -right-10 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white 
                hover:bg-gray-100 flex items-center justify-center shadow-sm border border-gray-200 
                transition-all duration-200 hover:shadow-md transform hover:scale-105"
              onClick={() => setIsEditing(true)}
            >
              <Pencil className="w-4 h-4 text-gray-600" />
            </button>
          )}
        </div>

        {/* Children nodes - Increased spacing */}
        {node.children.length > 0 && (
          <div className="flex flex-row gap-24 mt-16">
            {node.children
              .sort((a) => (a.position === 'left' ? -1 : 1))
              .map((child) => (
                <div key={child.id} className="relative">
                  {/* Connection line to child */}
                  <div className="absolute left-1/2 -top-12 w-[2px] h-12 bg-gray-300 -translate-x-1/2" />
                  <TreeNode
                    node={child}
                    onAddChild={onAddChild}
                    onNumberChange={onNumberChange}
                    parentId={node.id}
                  />
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Right ghost node */}
      {selectedDirection === 'right' && (
        <div className="flex items-center">
          {renderGhostNode('right')}
        </div>
      )}
    </div>
  );
};

export default TreeNode;