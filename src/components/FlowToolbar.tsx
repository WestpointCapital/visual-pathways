import { useState } from 'react';
import { ZoomIn, ZoomOut, Save, History, Plus } from 'lucide-react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

interface FlowToolbarProps {
  onAddNode: (type: 'trigger' | 'action' | 'condition' | 'delay', position: { x: number; y: number }) => void;
  onSave: () => void;
  onRevisions: () => void;
}

export const FlowToolbar = ({ onAddNode, onSave, onRevisions }: FlowToolbarProps) => {
  const [zoom, setZoom] = useState(100);

  const handleAddNode = (type: 'trigger' | 'action' | 'condition' | 'delay') => {
    // Add node to center of viewport
    const position = { 
      x: Math.random() * 400 + 200, 
      y: Math.random() * 300 + 200 
    };
    onAddNode(type, position);
  };

  const handleZoomIn = () => {
    const newZoom = Math.min(zoom + 25, 200);
    setZoom(newZoom);
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(zoom - 25, 50);
    setZoom(newZoom);
  };

  return (
    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10">
      <div className="bg-flow-toolbar border border-border rounded-lg shadow-lg px-4 py-2 flex items-center space-x-2">
        {/* Add Node Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-1" />
              Add Node
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center" className="w-48">
            <DropdownMenuItem onClick={() => handleAddNode('trigger')}>
              <div className="w-3 h-3 bg-flow-trigger rounded-full mr-2"></div>
              Add Trigger
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleAddNode('action')}>
              <div className="w-3 h-3 bg-flow-action rounded-full mr-2"></div>
              Add Action
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleAddNode('condition')}>
              <div className="w-3 h-3 bg-flow-condition rounded-full mr-2"></div>
              Add Condition
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleAddNode('delay')}>
              <div className="w-3 h-3 bg-flow-delay rounded-full mr-2"></div>
              Add Delay
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="w-px h-6 bg-border"></div>

        {/* Zoom Controls */}
        <Button variant="outline" size="sm" onClick={handleZoomOut}>
          <ZoomOut className="w-4 h-4" />
        </Button>
        
        <span className="text-sm text-muted-foreground min-w-[50px] text-center">
          {zoom}%
        </span>
        
        <Button variant="outline" size="sm" onClick={handleZoomIn}>
          <ZoomIn className="w-4 h-4" />
        </Button>

        <div className="w-px h-6 bg-border"></div>

        {/* Save & Revisions */}
        <Button variant="outline" size="sm" onClick={onRevisions}>
          <History className="w-4 h-4 mr-1" />
          Revisions
        </Button>
        
        <Button variant="default" size="sm" onClick={onSave}>
          <Save className="w-4 h-4 mr-1" />
          Save
        </Button>
      </div>
    </div>
  );
};