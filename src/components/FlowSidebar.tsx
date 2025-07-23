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
  const [actionType, setActionType] = useState('');
  const [delayAmount, setDelayAmount] = useState('');
  const [delayUnit, setDelayUnit] = useState('');
  const [keywords, setKeywords] = useState('');

  useEffect(() => {
    if (selectedNode) {
      setLabel((selectedNode.data as any).label || '');
      setDescription((selectedNode.data as any).description || '');
      setTriggerType((selectedNode.data as any).triggerType || '');
      setCondition((selectedNode.data as any).condition || '');
      setActionType((selectedNode.data as any).actionType || '');
      setDelayAmount((selectedNode.data as any).delayAmount || '');
      setDelayUnit((selectedNode.data as any).delayUnit || '');
      setKeywords((selectedNode.data as any).keywords || '');
    }
  }, [selectedNode]);

  const handleSave = () => {
    if (!selectedNode) return;
    
    onUpdateNode(selectedNode.id, {
      label,
      description,
      triggerType,
      condition,
      actionType,
      delayAmount,
      delayUnit,
      keywords,
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
                  <SelectItem value="sms_reply">SMS Reply Received</SelectItem>
                  <SelectItem value="delivery_failed">Delivery Failed</SelectItem>
                  <SelectItem value="new_lead">New Lead Added</SelectItem>
                  <SelectItem value="hubspot_form">HubSpot Form Submission</SelectItem>
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
                Action
              </Label>
              <Select value={actionType} onValueChange={setActionType}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select action type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="send_sms">Send SMS</SelectItem>
                  <SelectItem value="add_tag">Add Tag</SelectItem>
                  <SelectItem value="update_contact">Update Contact</SelectItem>
                  <SelectItem value="send_webhook">Send Webhook</SelectItem>
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
                  <SelectItem value="message_contains">Message contains keywords</SelectItem>
                  <SelectItem value="message_equals">Message equals exactly</SelectItem>
                  <SelectItem value="any_reply">Any reply received</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {(condition === 'message_contains' || condition === 'message_equals') && (
              <div>
                <Label htmlFor="keywords" className="text-sm text-muted-foreground">
                  {condition === 'message_contains' ? 'Keywords' : 'Exact Text'}
                </Label>
                <Input
                  id="keywords"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder={condition === 'message_contains' ? 'Enter keywords (comma separated)' : 'Enter exact text'}
                  className="mt-1"
                />
              </div>
            )}
          </div>
        )}

        {selectedNode.type === 'delay' && (
          <div className="space-y-4">
            <Label className="text-sm font-medium">Delay Configuration</Label>
            <div>
              <Label htmlFor="delay-amount" className="text-sm text-muted-foreground">
                Delay Amount
              </Label>
              <Input
                id="delay-amount"
                type="number"
                value={delayAmount}
                onChange={(e) => setDelayAmount(e.target.value)}
                placeholder="Enter amount"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="delay-unit" className="text-sm text-muted-foreground">
                Delay Unit
              </Label>
              <Select value={delayUnit} onValueChange={setDelayUnit}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select time unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="seconds">Seconds</SelectItem>
                  <SelectItem value="minutes">Minutes</SelectItem>
                  <SelectItem value="hours">Hours</SelectItem>
                  <SelectItem value="days">Days</SelectItem>
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