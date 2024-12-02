"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { PlusCircle, ChevronDown, ChevronRight, X, Pencil, Trash2 } from 'lucide-react';


interface NodeItem {
  id: string;
  type: 'recurring' | 'event' | 'goal' | 'project' | 'task' | 'blocker';
  title: string;
  status: 'active' | 'completed' | 'blocked' | 'in-progress';
  children: string[];
  parentId: string | null;
}

interface AddNodeFormProps {
  onClose: () => void;
  onAdd: (node: Omit<NodeItem, 'id' | 'children' | 'parentId'>) => void;
  parentTitle?: string;
  editNode?: NodeItem | null;
}

const AddNodeForm: React.FC<AddNodeFormProps> = ({ onClose, onAdd, parentTitle, editNode }) => {
  const [newNode, setNewNode] = useState({
    title: editNode?.title || '',
    type: editNode?.type || 'task' as NodeItem['type'],
    status: editNode?.status || 'active' as NodeItem['status'],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(newNode);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md mx-auto">
        <div className="p-4 sm:p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-lg font-medium">{editNode ? 'Edit' : 'Add'} Node</h3>
              {parentTitle && !editNode && (
                <p className="text-sm text-gray-500 truncate max-w-[200px]">Under: {parentTitle}</p>
              )}
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                value={newNode.title}
                onChange={(e) => setNewNode({ ...newNode, title: e.target.value })}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                autoFocus
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              <select
                value={newNode.type}
                onChange={(e) => setNewNode({ ...newNode, type: e.target.value as NodeItem['type'] })}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="task">Task</option>
                <option value="goal">Goal</option>
                <option value="project">Project</option>
                <option value="recurring">Recurring</option>
                <option value="event">Event</option>
                <option value="blocker">Blocker</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                value={newNode.status}
                onChange={(e) => setNewNode({ ...newNode, status: e.target.value as NodeItem['status'] })}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="blocked">Blocked</option>
                <option value="in-progress">In Progress</option>
              </select>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border rounded-md hover:bg-gray-100 transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm"
              >
                {editNode ? 'Update' : 'Add'} Node
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

interface TreeNodeProps {
  node: NodeItem;
  allNodes: Record<string, NodeItem>;
  level?: number;
  onToggle: (id: string) => void;
  onAddChild: (parentId: string, parentTitle: string) => void;
  onNodeDrop: (draggedId: string, targetId: string) => void;
  onEdit: (node: NodeItem) => void;
  onDelete: (node: NodeItem) => void;
}

const TreeNode: React.FC<TreeNodeProps> = ({
  node,
  allNodes,
  level = 0,
  onToggle,
  onAddChild,
  onNodeDrop,
  onEdit,
  onDelete,
}) => {
  const childNodes = node.children.map(id => allNodes[id]).filter(Boolean);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isOver, setIsOver] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    e.stopPropagation();
    e.dataTransfer.setData('text/plain', node.id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOver(false);
    const draggedId = e.dataTransfer.getData('text/plain');
    if (draggedId !== node.id) {
      onNodeDrop(draggedId, node.id);
    }
  };

  return (
    <div className="relative">
      <div 
        className={`
          flex items-start flex-wrap md:flex-nowrap p-2 my-1 rounded-lg hover:bg-opacity-80 cursor-move group
          ${isOver ? 'border-2 border-blue-500' : ''}
          ${node.status === 'active' ? 'bg-green-100' : 
            node.status === 'completed' ? 'bg-blue-100' : 
            node.status === 'blocked' ? 'bg-red-100' : 
            node.status === 'in-progress' ? 'bg-yellow-100' : 'bg-gray-100'
          }
        `}
        style={{
          marginLeft: `${level * 24}px`
        }}
        draggable
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Node content */}
        <div className="flex-1 flex items-center min-w-0">
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="mr-2 flex-shrink-0"
          >
            {childNodes.length > 0 && (
              isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
            )}
          </button>
          <div className="flex-1 min-w-0">
            <span className="font-medium truncate block">{node.title}</span>
            <span className="text-sm text-gray-500 truncate block">({node.type})</span>
          </div>
        </div>
        
        <div className="flex items-center gap-1 ml-auto flex-shrink-0 mt-1 md:mt-0">
          <span className="text-xs capitalize text-gray-600 px-2 py-1 rounded bg-white/50">{node.status}</span>
          <button
            onClick={() => onEdit(node)}
            className="opacity-0 group-hover:opacity-100 p-1 hover:opacity-70 rounded transition-opacity duration-200"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => onAddChild(node.id, node.title)}
            className="opacity-0 group-hover:opacity-100 p-1 hover:opacity-70 rounded transition-opacity duration-200"
          >
            <PlusCircle className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(node)}
            className="opacity-0 group-hover:opacity-100 p-1 hover:opacity-70 rounded transition-opacity duration-200 text-red-500"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {isExpanded && childNodes.length > 0 && (
        <div 
          className={`
            transition-all duration-300
            ${isExpanded ? 'opacity-100' : 'opacity-0 h-0'}
          `}
        >
          {isExpanded && (
            <div className="border-l-2 border-gray-200">
              {childNodes.map(child => (
                <TreeNode
                  key={child.id}
                  node={child}
                  allNodes={allNodes}
                  level={level + 1}
                  onToggle={onToggle}
                  onAddChild={onAddChild}
                  onNodeDrop={onNodeDrop}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const GoalTreeNodeView: React.FC = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedParent, setSelectedParent] = useState<{ id: string; title: string } | null>(null);
  const [editingNode, setEditingNode] = useState<NodeItem | null>(null);
  const [nodes, setNodes] = useState<Record<string, NodeItem>>({
    '1': {
      id: '1',
      type: 'goal',
      title: 'Learn Piano',
      status: 'in-progress',
      children: ['2', '3'],
      parentId: null
    },
    '2': {
      id: '2',
      type: 'task',
      title: 'Practice Scales',
      status: 'active',
      children: [],
      parentId: '1'
    },
    '3': {
      id: '3',
      type: 'recurring',
      title: 'Weekly Lesson',
      status: 'active',
      children: ['4'],
      parentId: '1'
    },
    '4': {
      id: '4',
      type: 'blocker',
      title: 'Find Teacher',
      status: 'blocked',
      children: [],
      parentId: '3'
    }
  });

  // Load data from localStorage on mount
  useEffect(() => {
    const savedNodes = localStorage.getItem('goalTreeNodes');
    if (savedNodes) {
      setNodes(JSON.parse(savedNodes));
    }
  }, []);

   // Save to localStorage whenever nodes change
   useEffect(() => {
    localStorage.setItem('goalTreeNodes', JSON.stringify(nodes));
  }, [nodes]);

  const handleNodeDrop = (draggedId: string, targetId: string) => {
    setNodes(prev => {
      const newNodes = { ...prev };
      
      // Remove from old parent's children
      const oldParentId = newNodes[draggedId].parentId;
      if (oldParentId) {
        newNodes[oldParentId] = {
          ...newNodes[oldParentId],
          children: newNodes[oldParentId].children.filter(id => id !== draggedId)
        };
      }

      // Add to new parent's children
      newNodes[targetId] = {
        ...newNodes[targetId],
        children: [...newNodes[targetId].children, draggedId]
      };

      // Update dragged node's parentId
      newNodes[draggedId] = {
        ...newNodes[draggedId],
        parentId: targetId
      };

      return newNodes;
    });
  };

  const handleAddNode = (
    nodeData: Omit<NodeItem, 'id' | 'children' | 'parentId'>, 
    parentId?: string
  ) => {
    if (editingNode) {
      // Update existing node
      setNodes(prev => ({
        ...prev,
        [editingNode.id]: {
          ...prev[editingNode.id],
          ...nodeData
        }
      }));
      setEditingNode(null);
    } else {
      // Add new node
      const newId = String(Object.keys(nodes).length + 1);
      const newNode: NodeItem = {
        id: newId,
        ...nodeData,
        children: [],
        parentId: parentId || null
      };

      setNodes(prevNodes => {
        const updatedNodes = { ...prevNodes, [newId]: newNode };
        
        if (parentId) {
          updatedNodes[parentId] = {
            ...updatedNodes[parentId],
            children: [...updatedNodes[parentId].children, newId]
          };
        }
        
        return updatedNodes;
      });
    }
  };

  const handleEdit = (node: NodeItem) => {
    setEditingNode(node);
    setShowAddForm(true);
  };

  const rootNodes = Object.values(nodes).filter(node => !node.parentId);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [nodeToDelete, setNodeToDelete] = useState<NodeItem | null>(null);

  const getAllDescendantIds = (nodeId: string): string[] => {
    const node = nodes[nodeId];
    if (!node) return [];
    const descendants = [...node.children];
    node.children.forEach(childId => {
      descendants.push(...getAllDescendantIds(childId));
    });
    return descendants;
  };

  const handleDelete = (node: NodeItem) => {
    setNodeToDelete(node);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (!nodeToDelete) return;

    const descendantIds = getAllDescendantIds(nodeToDelete.id);
    const idsToDelete = [nodeToDelete.id, ...descendantIds];

    setNodes(prev => {
      const newNodes = { ...prev };
      
      // Remove node from parent's children
      if (nodeToDelete.parentId) {
        newNodes[nodeToDelete.parentId] = {
          ...newNodes[nodeToDelete.parentId],
          children: newNodes[nodeToDelete.parentId].children.filter(
            id => id !== nodeToDelete.id
          )
        };
      }

      // Delete all descendants and the node itself
      idsToDelete.forEach(id => {
        delete newNodes[id];
      });

      return newNodes;
    });

    setShowDeleteConfirm(false);
    setNodeToDelete(null);
  };
  useEffect(() => {
   const handleKeyPress = (e: KeyboardEvent) => {
     // Check for 'a' key press with Command (Mac) or Control (Windows)
     if ((e.metaKey || e.ctrlKey) && e.key === 'a') {
       e.preventDefault(); // Prevent default browser behavior
       setShowAddForm(true);
     }
   };
 
   window.addEventListener('keydown', handleKeyPress);
   
   // Cleanup listener when component unmounts
   return () => window.removeEventListener('keydown', handleKeyPress);
 }, []);

  return (
    <div className="p-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>🎯 Goal Time Money</CardTitle>
          <button 
            onClick={() => setShowAddForm(true)}
            title="⌘/Ctrl + A"
            className="flex items-center gap-2 px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
            <PlusCircle className="w-4 h-4" />
            Add Anything
          </button>
        </CardHeader>
        <CardContent>
          <div className="mt-4">
            {rootNodes.map(node => (
              <TreeNode
                key={node.id}
                node={node}
                allNodes={nodes}
                onToggle={(id) => console.log('toggled:', id)}
                onAddChild={(parentId, parentTitle) => {
                  setSelectedParent({ id: parentId, title: parentTitle });
                  setShowAddForm(true);
                }}
                onNodeDrop={handleNodeDrop}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {showDeleteConfirm && nodeToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-lg font-medium mb-4">Confirm Delete</h3>
            <p className="mb-4">
              Are you sure you want to delete &quot;{nodeToDelete.title}&quot; and all its children?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddForm && (
        <AddNodeForm
          onClose={() => {
            setShowAddForm(false);
            setSelectedParent(null);
            setEditingNode(null);
          }}
          onAdd={handleAddNode}
          parentTitle={selectedParent?.title}
          editNode={editingNode}
        />
      )}
    </div>
  );
};

export default GoalTreeNodeView;