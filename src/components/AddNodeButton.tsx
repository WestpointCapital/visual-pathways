import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from './ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';

interface AddNodeButtonProps {
  position: { x: number; y: number };
  onAddNode: (type: 'trigger' | 'action' | 'condition' | 'delay', position: { x: number; y: number }) => void;
}

export const AddNodeButton = ({ position, onAddNode }: AddNodeButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleNodeTypeSelect = (type: 'trigger' | 'action' | 'condition' | 'delay') => {
    onAddNode(type, position);
    setIsOpen(false);
  };

  return (
    <div 
      className="absolute z-10 transform -translate-x-1/2 -translate-y-1/2"
      style={{ left: position.x, top: position.y }}
    >
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            size="sm"
            className="w-8 h-8 rounded-full bg-flow-toolbar border-2 border-white shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" className="w-48">
          <DropdownMenuItem onClick={() => handleNodeTypeSelect('trigger')}>
            <div className="w-3 h-3 bg-flow-trigger rounded-full mr-2"></div>
            Add Trigger
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleNodeTypeSelect('action')}>
            <div className="w-3 h-3 bg-flow-action rounded-full mr-2"></div>
            Add Action
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleNodeTypeSelect('condition')}>
            <div className="w-3 h-3 bg-flow-condition rounded-full mr-2"></div>
            Add Condition
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleNodeTypeSelect('delay')}>
            <div className="w-3 h-3 bg-flow-delay rounded-full mr-2"></div>
            Add Delay
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};