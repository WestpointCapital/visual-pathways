import { useCallback, useState, useRef } from 'react';
import {
  ReactFlow,
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
import { ContextualEdge } from './ContextualEdge';
import { FlowSidebar } from './FlowSidebar';
import { FlowToolbar } from './FlowToolbar';
import { BranchEndIndicators } from './BranchEndIndicators';
import { initialNodes, initialEdges } from '../data/flowData';

const nodeTypes = {
  trigger: TriggerNode,
  action: ActionNode,
  condition: ConditionNode,
  delay: DelayNode,
};

const edgeTypes = {
  contextual: ContextualEdge,
};

const edgeOptions = {
  style: { strokeDasharray: '5,5', strokeWidth: 2 },
  type: 'contextual',
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

  const generateNodeName = (type: string, data: any) => {
    switch (type) {
      case 'trigger':
        const triggerLabels = {
          sms_reply: 'SMS Reply Received',
          delivery_failed: 'Delivery Failed', 
          new_lead: 'New Lead Added',
          hubspot_form: 'HubSpot Form Submission'
        };
        return triggerLabels[data.triggerType as keyof typeof triggerLabels] || 'New Trigger';
      case 'action':
        const actionLabels = {
          send_sms: 'Send SMS',
          add_tag: 'Add Tag',
          update_contact: 'Update Contact',
          send_webhook: 'Send Webhook'
        };
        return actionLabels[data.actionType as keyof typeof actionLabels] || 'New Action';
      case 'condition':
        const conditionLabels = {
          message_contains: 'Message Contains Keywords',
          message_equals: 'Message Equals Exactly',
          any_reply: 'Any Reply Received'
        };
        return conditionLabels[data.condition as keyof typeof conditionLabels] || 'IF / ELSE';
      case 'delay':
        if (data.delayAmount && data.delayUnit) {
          return `Wait ${data.delayAmount} ${data.delayUnit}`;
        }
        return 'Delay';
      default:
        return 'New Node';
    }
  };

  const addNode = useCallback((type: 'trigger' | 'action' | 'condition' | 'delay', position: { x: number; y: number }) => {
    const newNode: Node = {
      id: `${type}-${Date.now()}`,
      type,
      position,
      data: { 
        label: generateNodeName(type, {}),
        description: `Configure your ${type}`,
      },
    };
    setNodes((nds) => [...nds, newNode]);
  }, [setNodes]);

  const updateNodeData = useCallback((nodeId: string, newData: any) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          const updatedData = { ...node.data, ...newData };
          // Auto-update label based on configuration
          if (newData.triggerType || newData.actionType || newData.condition || newData.delayAmount || newData.delayUnit) {
            updatedData.label = generateNodeName(node.type!, updatedData);
          }
          return { ...node, data: updatedData };
        }
        return node;
      })
    );
  }, [setNodes]);

  const deleteNode = useCallback((nodeId: string) => {
    // Get edges connected to this node
    const connectedEdges = edges.filter(edge => edge.source === nodeId || edge.target === nodeId);
    
    // Auto-reconnect: if node has one input and one output, connect them
    const incomingEdges = connectedEdges.filter(edge => edge.target === nodeId);
    const outgoingEdges = connectedEdges.filter(edge => edge.source === nodeId);
    
    if (incomingEdges.length === 1 && outgoingEdges.length === 1) {
      const newEdge: Edge = {
        id: `auto-${Date.now()}`,
        source: incomingEdges[0].source,
        target: outgoingEdges[0].target,
        type: 'contextual',
        style: { strokeDasharray: '5,5', strokeWidth: 2 },
      };
      setEdges((eds) => [...eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId), newEdge]);
    } else {
      setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
    }
    
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    
    if (selectedNode?.id === nodeId) {
      setSelectedNode(null);
      setSidebarOpen(false);
    }
  }, [setNodes, setEdges, selectedNode, edges]);

  const addNodeBetween = useCallback((edgeId: string, position: { x: number; y: number }) => {
    // Implementation for adding node between existing nodes would go here
    // For now, just add a new action node at the position
    addNode('action', position);
  }, [addNode]);

  const unlinkEdge = useCallback((edgeId: string) => {
    setEdges((eds) => eds.filter((edge) => edge.id !== edgeId));
  }, [setEdges]);

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
          edgeTypes={edgeTypes}
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
          <BranchEndIndicators 
            nodes={nodes}
            edges={edges}
            onAddNode={addNode}
          />
        </ReactFlow>
        
        <FlowToolbar 
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