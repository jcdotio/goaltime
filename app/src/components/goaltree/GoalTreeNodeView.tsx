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
  onNodeDrop: (draggedId: string, targetId: string, dropPosition: 'before' | 'after' | 'inside') => void;
  onEdit: (node: NodeItem) => void;
  onDelete: (node: NodeItem) => void;
  expandedNodes: Set<string>;
  onToggleExpand: (nodeId: string) => void;
  isSelectionMode: boolean;
  isSelected: boolean;
  onSelect: (nodeId: string) => void;
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
  expandedNodes,
  onToggleExpand,
  isSelectionMode = false, 
  isSelected = false,      
  onSelect,
}) => {
  
  const handleToggle = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    onToggleExpand(node.id);
  };

  const isExpanded = expandedNodes.has(node.id);
  const childNodes = node.children.map(id => allNodes[id]).filter(Boolean);
  const [dropTarget, setDropTarget] = useState<'before' | 'after' | 'inside' | null>(null);

  const handleDragStart = (e: React.DragEvent) => {
    e.stopPropagation();
    e.dataTransfer.setData('text/plain', node.id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top;
    
    if (y < rect.height * 0.25) {
      setDropTarget('before');
    } else if (y > rect.height * 0.75) {
      setDropTarget('after');
    } else {
      setDropTarget('inside');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const draggedId = e.dataTransfer.getData('text/plain');
    onNodeDrop(draggedId, node.id, dropTarget || 'inside');
    setDropTarget(null);
  };


  return (
    <div className="relative">
      {dropTarget === 'before' && (
        <div className="absolute w-full h-1 bg-purple-500 -top-1 z-10" />
      )}
  
      <div 
        className={`
          flex items-start flex-wrap md:flex-nowrap p-2 my-1 rounded-lg 
          hover:bg-opacity-80 ${isSelectionMode ? 'cursor-pointer' : 'cursor-move'} group
          ${dropTarget === 'inside' ? 'border-2 border-purple-500' : ''}
          ${isSelected ? 'ring-2 ring-purple-500' : ''}
          ${node.status === 'active' ? 'bg-green-100' : 
            node.status === 'completed' ? 'bg-blue-100' : 
            node.status === 'blocked' ? 'bg-red-100' : 
            node.status === 'in-progress' ? 'bg-yellow-100' : 'bg-gray-100'
          }
        `}
        style={{
          marginLeft: `${level * 24}px`
        }}
        draggable={!isSelectionMode}
        onDragStart={!isSelectionMode ? handleDragStart : undefined}
        onDragOver={!isSelectionMode ? handleDragOver : undefined}
        onDragLeave={() => !isSelectionMode && setDropTarget(null)}
        onDrop={!isSelectionMode ? handleDrop : undefined}
        onClick={isSelectionMode ? () => onSelect(node.id) : undefined}
        onKeyDown={e => {
          if (isSelectionMode && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            onSelect(node.id);
          }
        }}
        tabIndex={isSelectionMode ? 0 : undefined}
        role={isSelectionMode ? 'checkbox' : undefined}
        aria-checked={isSelectionMode ? isSelected : undefined}
      >
        <div className="flex-1 flex items-center min-w-0">
          <button 
            onClick={e => {
              e.stopPropagation();
              handleToggle();
            }}
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
          <span className="text-xs capitalize text-gray-600 px-2 py-1 rounded bg-white/50">
            {node.status}
          </span>
          {!isSelectionMode && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(node);
                }}
                className="opacity-0 group-hover:opacity-100 p-1 hover:opacity-70 rounded transition-opacity duration-200"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAddChild(node.id, node.title);
                }}
                className="opacity-0 group-hover:opacity-100 p-1 hover:opacity-70 rounded transition-opacity duration-200"
              >
                <PlusCircle className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(node);
                }}
                className="opacity-0 group-hover:opacity-100 p-1 hover:opacity-70 rounded transition-opacity duration-200 text-red-500"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>
  
      {isExpanded && childNodes.length > 0 && (
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
              expandedNodes={expandedNodes}
              onToggleExpand={onToggleExpand}
              isSelectionMode={isSelectionMode}
              isSelected={isSelected}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const GoalTreeNodeView: React.FC = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedParent, setSelectedParent] = useState<{ id: string; title: string } | null>(null);
  const [editingNode, setEditingNode] = useState<NodeItem | null>(null);
  const [selectedNodes, setSelectedNodes] = useState<Set<string>>(new Set());
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  const [nodes, setNodes] = useState<Record<string, NodeItem>>(() => {
    const savedNodes = localStorage.getItem('goalTreeNodes');
    return savedNodes ? JSON.parse(savedNodes) : {
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
  };
  });

  const [zoom, setZoom] = useState(() => {
    const saved = localStorage.getItem('gtm-zoom');
    return saved ? parseFloat(saved) : 1;
  });
  
  const handleZoomIn = () => {
    setZoom(prev => {
      const newZoom = Math.min(prev + 0.1, 2);
      localStorage.setItem('gtm-zoom', String(newZoom));
      return newZoom;
    });
  };
  
  const handleZoomOut = () => {
    setZoom(prev => {
      const newZoom = Math.max(prev - 0.1, 0.5);
      localStorage.setItem('gtm-zoom', String(newZoom));
      return newZoom;
    });
  };

  const toggleSelection = (nodeId: string) => {
    setSelectedNodes(prev => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  };

  const handleBulkDelete = () => {
    setNodes(prev => {
      const newNodes = { ...prev };
      selectedNodes.forEach(nodeId => {
        const node = newNodes[nodeId];
        if (node.parentId) {
          const parent = newNodes[node.parentId];
          parent.children = parent.children.filter(id => id !== nodeId);
        }
        delete newNodes[nodeId];
      });
      return newNodes;
    });
    
    setRootOrder(prev => prev.filter(id => !selectedNodes.has(id)));
    setSelectedNodes(new Set());
    setIsSelectionMode(false);
  };

  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('goalTreeExpanded');
    return saved ? new Set(JSON.parse(saved)) : new Set<string>();
  });

  const handleToggleExpand = (nodeId: string) => {
    setExpandedNodes(prev => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  };

  // Initialize rootOrder with proper defaults
  const [rootOrder, setRootOrder] = useState<string[]>(() => {
    const savedRootOrder = localStorage.getItem('goalTreeRootOrder');
    if (savedRootOrder) {
      return JSON.parse(savedRootOrder);
    }
    // Get initial root nodes from nodes state
    return Object.values(nodes)
      .filter(node => !node.parentId)
      .map(node => node.id);
  });

// Load data
useEffect(() => {
  const savedNodes = localStorage.getItem('goalTreeNodes');
  const savedRootOrder = localStorage.getItem('goalTreeRootOrder');
  
  if (savedNodes) {
    const loadedNodes = JSON.parse(savedNodes) as Record<string, NodeItem>;
    setNodes(loadedNodes);
    
    if (savedRootOrder) {
      setRootOrder(JSON.parse(savedRootOrder));
    } else {
      const initialRootOrder = Object.values(loadedNodes as Record<string, NodeItem>)
        .filter(node => !node.parentId)
        .map(node => node.id);
      setRootOrder(initialRootOrder);
    }
  }
}, []);

// Save data
useEffect(() => {
  localStorage.setItem('goalTreeNodes', JSON.stringify(nodes));
  localStorage.setItem('goalTreeRootOrder', JSON.stringify(rootOrder));
  localStorage.setItem('goalTreeExpanded', JSON.stringify([...expandedNodes]));
}, [nodes, rootOrder, expandedNodes]);

const handleNodeDrop = (draggedId: string, targetId: string, dropPosition: 'before' | 'after' | 'inside') => {
  // Validation checks
  const isDescendant = (parentId: string, childId: string): boolean => {
    const parent = nodes[parentId];
    if (!parent) return false;
    if (parent.children.includes(childId)) return true;
    return parent.children.some(id => isDescendant(id, childId));
  };

  if (draggedId === targetId || isDescendant(draggedId, targetId)) {
    return;
  }

  setNodes(prev => {
    const newNodes = { ...prev };
    const draggedNode = { ...newNodes[draggedId] };
    const targetNode = { ...newNodes[targetId] };
    
    // Update the nodes with copies to prevent reference issues
    newNodes[draggedId] = draggedNode;
    newNodes[targetId] = targetNode;

    // Remove from old parent
    if (draggedNode.parentId) {
      const oldParent = { ...newNodes[draggedNode.parentId] };
      oldParent.children = oldParent.children.filter(id => id !== draggedId);
      newNodes[draggedNode.parentId] = oldParent;
    }

    if (dropPosition === 'inside') {
      // Handle dropping inside target
      if (!draggedNode.parentId) {
        setRootOrder(prev => prev.filter(id => id !== draggedId));
      }
      draggedNode.parentId = targetId;
      targetNode.children = Array.from(new Set([...targetNode.children, draggedId]));
      setExpandedNodes(prev => new Set([...prev, targetId])); // expand target node

    } else {
      // Handle dropping before/after
      const newParentId = targetNode.parentId;
      draggedNode.parentId = newParentId;

      if (!newParentId) {
        // Root level drop
        setRootOrder(prev => {
          const filteredOrder = prev.filter(id => id !== draggedId);
          const targetIndex = filteredOrder.indexOf(targetId);
          const insertIndex = dropPosition === 'after' ? targetIndex + 1 : targetIndex;
          return [
            ...filteredOrder.slice(0, insertIndex),
            draggedId,
            ...filteredOrder.slice(insertIndex)
          ];
        });
      } else {
        // Non-root level drop
        const parent = { ...newNodes[newParentId] };
        const targetIndex = parent.children.indexOf(targetId);
        const insertIndex = dropPosition === 'after' ? targetIndex + 1 : targetIndex;
        
        // Remove draggedId if it exists and insert at new position
        parent.children = Array.from(new Set([
          ...parent.children.slice(0, insertIndex),
          draggedId,
          ...parent.children.slice(insertIndex)
        ])).filter(id => id !== draggedId || parent.children.indexOf(id) === insertIndex);
        
        newNodes[newParentId] = parent;
      }
    }

    return newNodes;
  });
};

    const handleAddNode = (nodeData: Omit<NodeItem, 'id' | 'children' | 'parentId'>) => {
    if (editingNode) {
      setNodes(prev => ({
        ...prev,
        [editingNode.id]: {
          ...prev[editingNode.id],
          ...nodeData
        }
      }));
      setEditingNode(null);
      return;
    }

    const newId = String(Math.max(0, ...Object.keys(nodes).map(Number)) + 1);
    const parentId = selectedParent?.id || null;
    
    const newNode: NodeItem = {
      id: newId,
      ...nodeData,
      children: [],
      parentId
    };

    setNodes(prev => ({
      ...prev,
      [newId]: newNode,
      ...(parentId && {
        [parentId]: {
          ...prev[parentId],
          children: [...prev[parentId].children, newId]
        }
      })
    }));

    if (!parentId) {
      setRootOrder(prev => [newId, ...prev]); // Add to start instead of end
    }
  };

  const handleEdit = (node: NodeItem) => {
    setEditingNode(node);
    setShowAddForm(true);
  };

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

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    
    // Clean and split content
    const lines = text
      .split('\n')
      .map(line => 
        // Remove special characters and extra whitespace
        line.replace(/[^\w\s-]/g, '').trim()
      )
      .filter(line => 
        // Keep only non-empty lines with actual content
        line && line.length > 0 && !line.match(/^[-•*+\s]+$/)
      );
  
    // Get next available ID
    let nextId = Math.max(0, ...Object.keys(nodes).map(Number)) + 1;
  
    lines.forEach(line => {
      try {
        const newId = String(nextId++);
        
        const newNode: NodeItem = {
          id: newId,
          title: line,
          type: 'task',
          status: 'active',
          children: [],
          parentId: null
        };
  
        // Update nodes state
        setNodes(prev => ({
          ...prev,
          [newId]: newNode
        }));
  
        // Add to root order
        setRootOrder(prev => [...prev, newId]);
  
      } catch (error) {
        console.error('Error creating node:', error);
      }
    });
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
      } else {
        // If it's a root node, update rootOrder
        setRootOrder(current => current.filter(id => !idsToDelete.includes(id)));
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
    <Card
      onPaste={handlePaste}
      tabIndex={0}
      className="focus:outline-none transition-colors relative"
    >
      <CardHeader className="flex flex-row items-center justify-between border-b pt-0 pb-4">
        <div className="flex items-center gap-2">
          <CardTitle></CardTitle>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
            ⌘V to paste text with newlines <br></br>
            ⌘A to add a new goal
          </span>
        </div>
        <div className="flex items-center gap-2">
          {/* Zoom controls always visible */}
          <div className="flex items-center gap-1 border rounded-lg overflow-hidden">
            <button
              onClick={handleZoomOut}
              className="px-2 py-1 hover:bg-gray-100"
              title="Zoom Out"
            >
              -
            </button>
            <span className="px-2 text-sm text-gray-600">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              className="px-2 py-1 hover:bg-gray-100"
              title="Zoom In"
            >
              +
            </button>
          </div>

          {/* Selection mode controls */}
          {isSelectionMode ? (
            <>
              <button
                onClick={handleBulkDelete}
                disabled={selectedNodes.size === 0}
                className="px-3 py-1 bg-red-500 text-white rounded-lg disabled:opacity-50"
              >
                Delete ({selectedNodes.size})
              </button>
              <button
                onClick={() => {
                  setIsSelectionMode(false);
                  setSelectedNodes(new Set());
                }}
                className="px-3 py-1 border rounded-lg"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsSelectionMode(true)}
                className="px-3 py-1 border rounded-lg"
              >
                Select Multiple
              </button>
              <button 
                onClick={() => setShowAddForm(true)}
                title="⌘/Ctrl + A"
                className="flex items-center gap-2 px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                <PlusCircle className="w-4 h-4" />
                Add Anything
              </button>
            </>
          )}
        </div>
      </CardHeader>

      <CardContent>
      <div 
         className="
            overflow-y-auto 
            max-h-[calc(100vh-12rem)]
            no-scrollbar
          "
          style={{
            scrollBehavior: 'smooth',
            overscrollBehavior: 'contain' // Prevents scroll chaining

          }}
        >
        <div className="mt-4"
           style={{
            transform: `scale(${zoom})`,
            transformOrigin: 'top left',
            transition: 'transform 0.2s'
          }}
          >
          
        {rootOrder.length > 0 ? rootOrder.map(nodeId => (
  <TreeNode
    key={nodeId}
    node={nodes[nodeId]}
    allNodes={nodes}
    onToggle={(id) => console.log('toggled:', id)}
    onAddChild={(parentId, parentTitle) => {
      setSelectedParent({ id: parentId, title: parentTitle });
      setShowAddForm(true);
    }}
    onNodeDrop={handleNodeDrop}
    onEdit={handleEdit}
    onDelete={handleDelete}
    expandedNodes={expandedNodes}
    onToggleExpand={handleToggleExpand}
    isSelectionMode={isSelectionMode}
    isSelected={selectedNodes.has(nodeId)}
    onSelect={toggleSelection}
  />
)) : Object.values(nodes)
    .filter(node => !node.parentId)
    .map(node => (
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
        expandedNodes={expandedNodes}
        onToggleExpand={handleToggleExpand}
        isSelectionMode={isSelectionMode}
        isSelected={selectedNodes.has(node.id)}
        onSelect={toggleSelection}
      />
    ))}
        </div>
        </div>
      </CardContent>
    </Card>

    {/* Delete Confirmation Modal */}
    {showDeleteConfirm && nodeToDelete && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
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

    {/* Add/Edit Node Modal */}
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