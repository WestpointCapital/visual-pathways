import React from 'react';
import { useReactFlow, Node, Edge } from '@xyflow/react';
import { Plus } from 'lucide-react';

interface BranchEndIndicatorsProps {
  nodes: Node[];
  edges: Edge[];
  onAddNode: (type: 'trigger' | 'action' | 'condition' | 'delay', position: { x: number; y: number }) => void;
}

export const BranchEndIndicators: React.FC<BranchEndIndicatorsProps> = ({ 
  nodes, 
  edges, 
  onAddNode 
}) => {
  const { getViewport } = useReactFlow();
  const viewport = getViewport();

  // Find end nodes (nodes with no outgoing edges)
  const endNodes = nodes.filter(node => 
    !edges.some(edge => edge.source === node.id)
  );

  const handleAddNode = (endNode: Node, event: React.MouseEvent) => {
    event.stopPropagation();
    
    // Position the new node below the end node
    const newPosition = {
      x: endNode.position.x,
      y: endNode.position.y + 120
    };
    
    onAddNode('action', newPosition);
  };

  return (
    <>
      {endNodes.map(endNode => {
        // Calculate screen position
        const screenX = endNode.position.x * viewport.zoom + viewport.x;
        const screenY = (endNode.position.y + 80) * viewport.zoom + viewport.y; // 80px below node

        return (
          <div
            key={`end-indicator-${endNode.id}`}
            className="absolute pointer-events-auto z-10"
            style={{
              left: screenX + (200 * viewport.zoom / 2) - 20, // Center horizontally (assuming 200px node width)
              top: screenY,
              transform: 'translate(-50%, 0)',
            }}
          >
            <button
              onClick={(e) => handleAddNode(endNode, e)}
              className="
                w-10 h-10 rounded-full border-2 border-dashed border-muted-foreground/30
                bg-background hover:bg-muted
                flex items-center justify-center
                transition-all duration-200 hover:scale-110
                hover:border-primary hover:text-primary
                group shadow-sm hover:shadow-md
              "
            >
              <Plus className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </button>
          </div>
        );
      })}
    </>
  );
};