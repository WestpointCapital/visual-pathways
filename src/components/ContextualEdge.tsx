import React, { useState } from 'react';
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  useReactFlow,
  EdgeProps,
} from '@xyflow/react';
import { Plus, Unlink } from 'lucide-react';
import { Button } from './ui/button';

export const ContextualEdge = (props: EdgeProps) => {
  const {
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style = {},
    markerEnd,
  } = props;
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [showNodeTypeMenu, setShowNodeTypeMenu] = useState(false);

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setContextMenuPosition({ x: event.clientX, y: event.clientY });
    setShowContextMenu(true);
  };

  const handleUnlink = () => {
    // For now, just log - will be handled by parent component
    console.log('Unlink edge:', id);
    setShowContextMenu(false);
  };

  const handleAddNode = () => {
    setShowContextMenu(false);
    setShowNodeTypeMenu(true);
  };

  const handleNodeTypeSelect = (nodeType: 'trigger' | 'action' | 'condition' | 'delay') => {
    // For now, just log - will be handled by parent component
    console.log('Add node between:', nodeType, id);
    setShowNodeTypeMenu(false);
  };

  const closeMenus = () => {
    setShowContextMenu(false);
    setShowNodeTypeMenu(false);
  };

  return (
    <>
      <BaseEdge 
        path={edgePath} 
        markerEnd={markerEnd} 
        style={style}
        onContextMenu={handleContextMenu}
      />
      
      {/* Context Menu */}
      {showContextMenu && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={closeMenus}
          />
          <div 
            className="fixed z-50 bg-background border border-border rounded-lg shadow-lg py-1 min-w-[150px]"
            style={{ 
              left: contextMenuPosition.x, 
              top: contextMenuPosition.y 
            }}
          >
            <button
              onClick={handleUnlink}
              className="w-full px-3 py-2 text-left text-sm hover:bg-muted flex items-center gap-2"
            >
              <Unlink className="w-4 h-4" />
              Unlink
            </button>
            <button
              onClick={handleAddNode}
              className="w-full px-3 py-2 text-left text-sm hover:bg-muted flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add a node
            </button>
          </div>
        </>
      )}

      {/* Node Type Selection Menu */}
      {showNodeTypeMenu && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={closeMenus}
          />
          <div 
            className="fixed z-50 bg-background border border-border rounded-lg shadow-lg py-1 min-w-[150px]"
            style={{ 
              left: contextMenuPosition.x, 
              top: contextMenuPosition.y 
            }}
          >
            <button
              onClick={() => handleNodeTypeSelect('trigger')}
              className="w-full px-3 py-2 text-left text-sm hover:bg-muted"
            >
              Trigger Node
            </button>
            <button
              onClick={() => handleNodeTypeSelect('action')}
              className="w-full px-3 py-2 text-left text-sm hover:bg-muted"
            >
              Action Node
            </button>
            <button
              onClick={() => handleNodeTypeSelect('condition')}
              className="w-full px-3 py-2 text-left text-sm hover:bg-muted"
            >
              Condition Node
            </button>
            <button
              onClick={() => handleNodeTypeSelect('delay')}
              className="w-full px-3 py-2 text-left text-sm hover:bg-muted"
            >
              Delay Node
            </button>
          </div>
        </>
      )}
    </>
  );
};