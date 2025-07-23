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
import { AddNodeButton } from './AddNodeButton';
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

  const getNodeLabel = (type: string, data: any) => {
    switch (type) {
      case 'trigger':
        if (data.triggerType === 'sms_reply') return 'SMS Reply Received';
        if (data.triggerType === 'delivery_failed') return 'Delivery Failed';
        if (data.triggerType === 'new_lead') return 'New Lead Added';
        if (data.triggerType === 'hubspot_form') return 'HubSpot Form Submission';
        return 'New Trigger';
      case 'action':
        if (data.actionType === 'send_sms') return 'Send SMS';
        if (data.actionType === 'add_tag') return 'Add Tag';
        if (data.actionType === 'update_contact') return 'Update Contact';
        if (data.actionType === 'send_webhook') return 'Send Webhook';
        return 'New Action';
      case 'condition':
        if (data.condition === 'message_contains') return 'Message Contains Keywords';
        if (data.condition === 'message_equals') return 'Message Equals Exactly';
        if (data.condition === 'any_reply') return 'Any Reply Received';
        return 'New Condition';
      case 'delay':
        if (data.delayAmount && data.delayUnit) return `Wait ${data.delayAmount} ${data.delayUnit}`;
        return 'New Delay';
      default:
        return 'New Node';
    }
  };

  const getNodeDescription = (type: string, data: any) => {
    switch (type) {
      case 'trigger':
        return 'Starts the automation flow';
      case 'action':
        return 'Performs an action';
      case 'condition':
        return 'Creates a decision branch';
      case 'delay':
        return 'Waits before continuing';
      default:
        return 'Configure this node';
    }
  };

  const addNode = useCallback((type: 'trigger' | 'action' | 'condition' | 'delay', position: { x: number; y: number }) => {
    const newNode: Node = {
      id: `${type}-${Date.now()}`,
      type,
      position,
      data: { 
        label: getNodeLabel(type, {}),
        description: getNodeDescription(type, {}),
      },
    };
    setNodes((nds) => [...nds, newNode]);
  }, [setNodes]);

  const insertNodeBetween = useCallback((sourceId: string, targetId: string, type: 'trigger' | 'action' | 'condition' | 'delay') => {
    const sourceNode = nodes.find(n => n.id === sourceId);
    const targetNode = nodes.find(n => n.id === targetId);
    
    if (!sourceNode || !targetNode) return;

    // Calculate position between nodes
    const position = {
      x: (sourceNode.position.x + targetNode.position.x) / 2,
      y: sourceNode.position.y + 150
    };

    const newNode: Node = {
      id: `${type}-${Date.now()}`,
      type,
      position,
      data: { 
        label: getNodeLabel(type, {}),
        description: getNodeDescription(type, {}),
      },
    };

    // Add the new node
    setNodes((nds) => [...nds, newNode]);

    // Update edges: remove old edge and create two new ones
    setEdges((eds) => {
      const oldEdge = eds.find(e => e.source === sourceId && e.target === targetId);
      const edgesWithoutOld = eds.filter(e => !(e.source === sourceId && e.target === targetId));
      
      const newEdges = [
        {
          id: `e${sourceId}-${newNode.id}`,
          source: sourceId,
          target: newNode.id,
          style: oldEdge?.style || { strokeDasharray: '5,5', strokeWidth: 2 },
          type: 'smoothstep',
          sourceHandle: oldEdge?.sourceHandle
        },
        {
          id: `e${newNode.id}-${targetId}`,
          source: newNode.id,
          target: targetId,
          style: { strokeDasharray: '5,5', strokeWidth: 2 },
          type: 'smoothstep',
        }
      ];

      return [...edgesWithoutOld, ...newEdges];
    });
  }, [nodes, setNodes, setEdges]);

  const updateNodeData = useCallback((nodeId: string, newData: any) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          const updatedData = { ...node.data, ...newData };
          // Auto-update label and description based on node type and configuration
          updatedData.label = getNodeLabel(node.type!, updatedData);
          updatedData.description = getNodeDescription(node.type!, updatedData);
          return { ...node, data: updatedData };
        }
        return node;
      })
    );
  }, [setNodes]);

  const deleteNode = useCallback((nodeId: string) => {
    // Find edges connected to this node
    const connectedEdges = edges.filter(edge => edge.source === nodeId || edge.target === nodeId);
    
    // If node is between two nodes, reconnect them
    const incomingEdge = connectedEdges.find(edge => edge.target === nodeId);
    const outgoingEdge = connectedEdges.find(edge => edge.source === nodeId);
    
    if (incomingEdge && outgoingEdge) {
      const reconnectionEdge = {
        id: `e${incomingEdge.source}-${outgoingEdge.target}`,
        source: incomingEdge.source,
        target: outgoingEdge.target,
        style: incomingEdge.style,
        type: 'smoothstep',
        sourceHandle: incomingEdge.sourceHandle
      };
      
      setEdges((eds) => [
        ...eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId),
        reconnectionEdge
      ]);
    } else {
      setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
    }
    
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    
    if (selectedNode?.id === nodeId) {
      setSelectedNode(null);
      setSidebarOpen(false);
    }
  }, [setNodes, setEdges, selectedNode, edges]);

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
        </ReactFlow>

        {/* Add Node Buttons between connected nodes */}
        {edges.map((edge) => {
          const sourceNode = nodes.find(n => n.id === edge.source);
          const targetNode = nodes.find(n => n.id === edge.target);
          
          if (!sourceNode || !targetNode) return null;
          
          // Don't show add button after condition nodes (they have specific branches)
          if (sourceNode.type === 'condition') return null;
          
          const midX = (sourceNode.position.x + targetNode.position.x) / 2 + 120; // offset for node width
          const midY = sourceNode.position.y + 75; // position between nodes
          
          return (
            <AddNodeButton
              key={`add-${edge.id}`}
              position={{ x: midX, y: midY }}
              onAddNode={(type, position) => insertNodeBetween(edge.source, edge.target, type)}
            />
          );
        })}
        
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