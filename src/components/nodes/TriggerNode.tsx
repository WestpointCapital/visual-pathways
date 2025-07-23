import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Zap, MoreHorizontal } from 'lucide-react';

interface TriggerNodeData {
  label: string;
  description?: string;
}

export const TriggerNode = memo(({ data }: NodeProps) => {
  const nodeData = data as unknown as TriggerNodeData;
  
  return (
    <div className="bg-flow-node-bg border-2 border-flow-node-border rounded-xl shadow-lg min-w-[240px] group hover:shadow-xl transition-all duration-200">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-flow-trigger rounded-full flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground text-sm">{nodeData.label}</h3>
            <p className="text-muted-foreground text-xs">{nodeData.description}</p>
          </div>
        </div>
        <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-muted rounded">
          <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-flow-trigger border-2 border-white"
      />
    </div>
  );
});

TriggerNode.displayName = 'TriggerNode';