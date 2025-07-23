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

export const ContextualEdge = (props: EdgeProps & { 
  onAddNodeBetween?: (edgeId: string, position: { x: number; y: number }, nodeType?: 'trigger' | 'action' | 'condition' | 'delay') => void;
  onUnlinkEdge?: (edgeId: string) => void;
}) => {
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
    onAddNodeBetween,
    onUnlinkEdge,
  } = props;
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [showNodeTypeMenu, setShowNodeTypeMenu] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

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
    onUnlinkEdge?.(id);
    setShowContextMenu(false);
  };

  const handleAddNode = () => {
    setShowContextMenu(false);
    setShowNodeTypeMenu(true);
  };

  const handleNodeTypeSelect = (nodeType: 'trigger' | 'action' | 'condition' | 'delay') => {
    // Calculate position between source and target
    const position = {
      x: (sourceX + targetX) / 2,
      y: (sourceY + targetY) / 2
    };
    onAddNodeBetween?.(id, position, nodeType);
    setShowNodeTypeMenu(false);
  };

  const closeMenus = () => {
    setShowContextMenu(false);
    setShowNodeTypeMenu(false);
  };

  const handlePlusClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    setContextMenuPosition({ x: event.clientX, y: event.clientY });
    setShowNodeTypeMenu(true);
  };

  return (
    <>
      {/* Main Edge */}
      <BaseEdge 
        path={edgePath} 
        markerEnd={markerEnd} 
        style={{
          ...style,
          strokeWidth: isHovered ? 3 : 2,
          stroke: isHovered ? 'hsl(var(--primary))' : style.stroke || '#94a3b8',
        }}
        onContextMenu={handleContextMenu}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      />
      
      {/* Visual Add Node Indicator */}
      <EdgeLabelRenderer>
        <div
          className="absolute pointer-events-all"
          style={{
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <button
            onClick={handlePlusClick}
            onContextMenu={handleContextMenu}
            className={`
              w-6 h-6 rounded-full border-2 border-background shadow-md 
              flex items-center justify-center transition-all duration-200
              ${isHovered 
                ? 'bg-primary text-primary-foreground border-primary scale-110 shadow-lg' 
                : 'bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground hover:scale-110'
              }
            `}
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>
      </EdgeLabelRenderer>
      
      {/* Context Menu */}
      {showContextMenu && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={closeMenus}
          />
          <div 
            className="fixed z-50 bg-background border border-border rounded-lg shadow-lg py-1 min-w-[150px] animate-fade-in"
            style={{ 
              left: contextMenuPosition.x, 
              top: contextMenuPosition.y 
            }}
          >
            <button
              onClick={handleUnlink}
              className="w-full px-3 py-2 text-left text-sm hover:bg-muted flex items-center gap-2 transition-colors"
            >
              <Unlink className="w-4 h-4" />
              Unlink
            </button>
            <button
              onClick={handleAddNode}
              className="w-full px-3 py-2 text-left text-sm hover:bg-muted flex items-center gap-2 transition-colors"
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
            className="fixed z-50 bg-background border border-border rounded-lg shadow-lg py-1 min-w-[150px] animate-fade-in"
            style={{ 
              left: contextMenuPosition.x, 
              top: contextMenuPosition.y 
            }}
          >
            <button
              onClick={() => handleNodeTypeSelect('trigger')}
              className="w-full px-3 py-2 text-left text-sm hover:bg-muted transition-colors"
            >
              Trigger Node
            </button>
            <button
              onClick={() => handleNodeTypeSelect('action')}
              className="w-full px-3 py-2 text-left text-sm hover:bg-muted transition-colors"
            >
              Action Node
            </button>
            <button
              onClick={() => handleNodeTypeSelect('condition')}
              className="w-full px-3 py-2 text-left text-sm hover:bg-muted transition-colors"
            >
              Condition Node
            </button>
            <button
              onClick={() => handleNodeTypeSelect('delay')}
              className="w-full px-3 py-2 text-left text-sm hover:bg-muted transition-colors"
            >
              Delay Node
            </button>
          </div>
        </>
      )}
    </>
  );
};