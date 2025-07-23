import { useState } from 'react';
import { ZoomIn, ZoomOut, Save, History } from 'lucide-react';
import { Button } from './ui/button';

interface FlowToolbarProps {
  onSave: () => void;
  onRevisions: () => void;
}

export const FlowToolbar = ({ onSave, onRevisions }: FlowToolbarProps) => {
  const [zoom, setZoom] = useState(100);

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