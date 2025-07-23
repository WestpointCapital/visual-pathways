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

  const handleAddNode = (type: 'trigger' | 'action' | 'condition' | 'delay') => {
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
            variant="outline"
            className="w-8 h-8 rounded-full p-0 bg-background border-2 border-border hover:border-primary shadow-md"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" className="w-40">
          <DropdownMenuItem onClick={() => handleAddNode('trigger')}>
            <div className="w-3 h-3 rounded-full bg-flow-trigger mr-2"></div>
            Trigger
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleAddNode('action')}>
            <div className="w-3 h-3 rounded-full bg-flow-action mr-2"></div>
            Action
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleAddNode('condition')}>
            <div className="w-3 h-3 rounded-full bg-flow-condition mr-2"></div>
            Condition
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleAddNode('delay')}>
            <div className="w-3 h-3 rounded-full bg-flow-delay mr-2"></div>
            Delay
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};