import { useCallback, useState, useRef } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  BackgroundVariant,
  OnConnect,
  OnNodesChange,
  OnEdgesChange,
  NodeMouseHandler,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { TriggerNode } from './nodes/TriggerNode';
import { ActionNode } from './nodes/ActionNode';
import { ConditionNode } from './nodes/ConditionNode';
import { DelayNode } from './nodes/DelayNode';
import { FlowSidebar } from './FlowSidebar';
import { FlowToolbar } from './FlowToolbar';
import { initialNodes, initialEdges } from '../data/flowData';

const nodeTypes = {
  trigger: TriggerNode,
  action: ActionNode,
  condition: ConditionNode,
  delay: DelayNode,
};

const edgeOptions = {
  style: { strokeDasharray: '5,5', strokeWidth: 2 },
  type: 'smoothstep',
};

export const FlowCanvas = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const onConnect: OnConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeClick: NodeMouseHandler = useCallback((event, node) => {
    setSelectedNode(node);
    setSidebarOpen(true);
  }, []);

  const addNode = useCallback((type: 'trigger' | 'action' | 'condition' | 'delay', position: { x: number; y: number }) => {
    const newNode: Node = {
      id: `${type}-${Date.now()}`,
      type,
      position,
      data: { 
        label: type === 'trigger' ? 'New Trigger' : type === 'action' ? 'New Action' : 'New Condition',
        description: `Configure your ${type}`,
      },
    };
    setNodes((nds) => [...nds, newNode]);
  }, [setNodes]);

  const updateNodeData = useCallback((nodeId: string, newData: any) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, ...newData } } : node
      )
    );
  }, [setNodes]);

  const deleteNode = useCallback((nodeId: string) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
    if (selectedNode?.id === nodeId) {
      setSelectedNode(null);
      setSidebarOpen(false);
    }
  }, [setNodes, setEdges, selectedNode]);

  return (
    <div className="h-screen w-full flex bg-flow-canvas">
      <div className="flex-1 relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          defaultEdgeOptions={edgeOptions}
          fitView
          className="bg-flow-canvas"
          proOptions={{ hideAttribution: true }}
        >
          <Background 
            variant={BackgroundVariant.Dots} 
            gap={24} 
            size={1} 
            color="hsl(var(--flow-connection))"
          />
          <Controls 
            className="bg-flow-toolbar border border-border rounded-lg shadow-sm"
            showZoom={false}
            showFitView={false}
            showInteractive={false}
          />
          <MiniMap 
            className="bg-flow-toolbar border border-border rounded-lg"
            nodeColor={(node) => {
              switch (node.type) {
                case 'trigger': return 'hsl(var(--flow-trigger))';
                case 'action': return 'hsl(var(--flow-action))';
                case 'condition': return 'hsl(var(--flow-condition))';
                case 'delay': return 'hsl(var(--flow-delay))';
                default: return 'hsl(var(--muted))';
              }
            }}
          />
        </ReactFlow>
        
        <FlowToolbar 
          onAddNode={addNode}
          onSave={() => console.log('Save flow')}
          onRevisions={() => console.log('View revisions')}
        />
      </div>

      <FlowSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        selectedNode={selectedNode}
        onUpdateNode={updateNodeData}
        onDeleteNode={deleteNode}
      />
    </div>
  );
};