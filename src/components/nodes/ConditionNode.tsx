import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { GitBranch, MoreHorizontal } from 'lucide-react';

interface ConditionNodeData {
  label: string;
  description?: string;
}

export const ConditionNode = memo(({ data }: NodeProps) => {
  const nodeData = data as unknown as ConditionNodeData;
  
  return (
    <div className="bg-flow-node-bg border-2 border-flow-node-border rounded-xl shadow-lg min-w-[240px] group hover:shadow-xl transition-all duration-200">
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-flow-condition border-2 border-white"
      />

      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-flow-condition rounded-full flex items-center justify-center">
            <GitBranch className="w-5 h-5 text-white" />
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

      {/* True/Yes handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="true"
        className="w-3 h-3 bg-green-500 border-2 border-white"
        style={{ left: '30%' }}
      />
      
      {/* False/No handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="false"
        className="w-3 h-3 bg-red-500 border-2 border-white"
        style={{ left: '70%' }}
      />

      {/* Branch labels */}
      <div className="flex justify-between px-6 pb-2">
        <span className="text-xs text-green-600 font-medium">Yes</span>
        <span className="text-xs text-red-600 font-medium">No</span>
      </div>
    </div>
  );
});

ConditionNode.displayName = 'ConditionNode';