import { useState, useEffect } from 'react';
import { Node } from '@xyflow/react';
import { X, Save, Trash2, Settings } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Separator } from './ui/separator';

interface FlowSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  selectedNode: Node | null;
  onUpdateNode: (nodeId: string, newData: any) => void;
  onDeleteNode: (nodeId: string) => void;
}

export const FlowSidebar = ({ 
  isOpen, 
  onClose, 
  selectedNode, 
  onUpdateNode, 
  onDeleteNode 
}: FlowSidebarProps) => {
  const [label, setLabel] = useState('');
  const [description, setDescription] = useState('');
  const [triggerType, setTriggerType] = useState('');
  const [condition, setCondition] = useState('');

  useEffect(() => {
    if (selectedNode) {
      setLabel((selectedNode.data as any).label || '');
      setDescription((selectedNode.data as any).description || '');
      setTriggerType((selectedNode.data as any).triggerType || '');
      setCondition((selectedNode.data as any).condition || '');
    }
  }, [selectedNode]);

  const handleSave = () => {
    if (!selectedNode) return;
    
    onUpdateNode(selectedNode.id, {
      label,
      description,
      triggerType,
      condition,
    });
    onClose();
  };

  const handleDelete = () => {
    if (!selectedNode) return;
    onDeleteNode(selectedNode.id);
  };

  if (!isOpen || !selectedNode) return null;

  return (
    <div className="w-80 bg-flow-sidebar border-l border-border h-full flex flex-col shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-2">
          <Settings className="w-5 h-5 text-muted-foreground" />
          <h2 className="font-semibold text-foreground">Node Configuration</h2>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 space-y-6 overflow-y-auto">
        {/* Basic Info */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="node-label" className="text-sm font-medium">
              Node Name
            </Label>
            <Input
              id="node-label"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Enter node name"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="node-description" className="text-sm font-medium">
              Description
            </Label>
            <Textarea
              id="node-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description"
              rows={3}
              className="mt-1"
            />
          </div>
        </div>

        <Separator />

        {/* Node-specific configuration */}
        {selectedNode.type === 'trigger' && (
          <div className="space-y-4">
            <Label className="text-sm font-medium">Trigger Configuration</Label>
            <div>
              <Label htmlFor="trigger-type" className="text-sm text-muted-foreground">
                Trigger Type
              </Label>
              <Select value={triggerType} onValueChange={setTriggerType}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select trigger type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="order_placed">Order Placed</SelectItem>
                  <SelectItem value="lead_replies">Lead Replies with Keywords</SelectItem>
                  <SelectItem value="time_based">Time Based</SelectItem>
                  <SelectItem value="webhook">Webhook</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {selectedNode.type === 'action' && (
          <div className="space-y-4">
            <Label className="text-sm font-medium">Action Configuration</Label>
            <div>
              <Label htmlFor="action-type" className="text-sm text-muted-foreground">
                Action Type
              </Label>
              <Select>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select action type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="send_sms">Send SMS</SelectItem>
                  <SelectItem value="send_email">Send Email</SelectItem>
                  <SelectItem value="create_task">Create Task</SelectItem>
                  <SelectItem value="update_contact">Update Contact</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {selectedNode.type === 'condition' && (
          <div className="space-y-4">
            <Label className="text-sm font-medium">Condition Configuration</Label>
            <div>
              <Label htmlFor="condition-logic" className="text-sm text-muted-foreground">
                Condition Logic
              </Label>
              <Select value={condition} onValueChange={setCondition}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24_hours_before">24 hours before delivery</SelectItem>
                  <SelectItem value="keywords_match">Keywords match</SelectItem>
                  <SelectItem value="time_of_day">Time of day</SelectItem>
                  <SelectItem value="custom">Custom condition</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        <Separator />

        {/* Node Status */}
        <div className="space-y-4">
          <Label className="text-sm font-medium">Status</Label>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-muted-foreground">Active</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border space-y-2">
        <Button onClick={handleSave} className="w-full">
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
        <Button variant="destructive" onClick={handleDelete} className="w-full">
          <Trash2 className="w-4 h-4 mr-2" />
          Delete Node
        </Button>
      </div>
    </div>
  );
};