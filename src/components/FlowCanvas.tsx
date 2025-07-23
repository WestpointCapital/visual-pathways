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

  const getNodeLabel = useCallback((type: string, data: any) => {
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
        if (data.delayAmount && data.delayUnit) return `Delay ${data.delayAmount} ${data.delayUnit}`;
        return 'New Delay';
      default:
        return 'New Node';
    }
  }, []);

  const addNode = useCallback((type: 'trigger' | 'action' | 'condition' | 'delay', position: { x: number; y: number }) => {
    const newNode: Node = {
      id: `${type}-${Date.now()}`,
      type,
      position,
      data: { 
        label: getNodeLabel(type, {}),
        description: `Configure your ${type}`,
      },
    };
    setNodes((nds) => [...nds, newNode]);
  }, [setNodes, getNodeLabel]);

  const insertNodeBetween = useCallback((type: 'trigger' | 'action' | 'condition' | 'delay', sourceNodeId: string, targetNodeId: string) => {
    const sourceNode = nodes.find(n => n.id === sourceNodeId);
    const targetNode = nodes.find(n => n.id === targetNodeId);
    
    if (!sourceNode || !targetNode) return;

    // Calculate position between source and target
    const position = {
      x: (sourceNode.position.x + targetNode.position.x) / 2,
      y: sourceNode.position.y + 120,
    };

    const newNode: Node = {
      id: `${type}-${Date.now()}`,
      type,
      position,
      data: { 
        label: getNodeLabel(type, {}),
        description: `Configure your ${type}`,
      },
    };

    // Remove existing edge between source and target
    setEdges((eds) => eds.filter(edge => !(edge.source === sourceNodeId && edge.target === targetNodeId)));
    
    // Add new node
    setNodes((nds) => [...nds, newNode]);
    
    // Add new edges: source -> newNode -> target
    setEdges((eds) => [
      ...eds,
      { id: `e-${sourceNodeId}-${newNode.id}`, source: sourceNodeId, target: newNode.id, type: 'smoothstep' },
      { id: `e-${newNode.id}-${targetNodeId}`, source: newNode.id, target: targetNodeId, type: 'smoothstep' },
    ]);
  }, [nodes, setNodes, setEdges, getNodeLabel]);

  const updateNodeData = useCallback((nodeId: string, newData: any) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          const updatedData = { ...node.data, ...newData };
          // Auto-update label and description based on node type and configuration
          updatedData.label = getNodeLabel(node.type, updatedData);
          return { ...node, data: updatedData };
        }
        return node;
      })
    );
  }, [setNodes, getNodeLabel]);

  const deleteNode = useCallback((nodeId: string) => {
    // Find edges that connect through this node
    const incomingEdges = edges.filter(edge => edge.target === nodeId);
    const outgoingEdges = edges.filter(edge => edge.source === nodeId);
    
    // Reconnect nodes that were connected through the deleted node
    const newEdges = edges.filter(edge => edge.source !== nodeId && edge.target !== nodeId);
    
    // Connect incoming sources to outgoing targets
    incomingEdges.forEach(inEdge => {
      outgoingEdges.forEach(outEdge => {
        newEdges.push({
          id: `e-${inEdge.source}-${outEdge.target}`,
          source: inEdge.source,
          target: outEdge.target,
          type: 'smoothstep'
        });
      });
    });

    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setEdges(newEdges);
    
    if (selectedNode?.id === nodeId) {
      setSelectedNode(null);
      setSidebarOpen(false);
    }
  }, [setNodes, setEdges, selectedNode, edges]);

  // Calculate positions for add-node buttons between edges
  const getAddNodeButtonPositions = useCallback(() => {
    const positions: Array<{ x: number; y: number; sourceId: string; targetId: string }> = [];
    
    edges.forEach(edge => {
      const sourceNode = nodes.find(n => n.id === edge.source);
      const targetNode = nodes.find(n => n.id === edge.target);
      
      // Don't show add button after condition nodes (they have multiple outputs)
      if (sourceNode?.type === 'condition') return;
      
      if (sourceNode && targetNode) {
        positions.push({
          x: (sourceNode.position.x + targetNode.position.x) / 2 + 75, // Offset for node center
          y: (sourceNode.position.y + targetNode.position.y) / 2 + 25,
          sourceId: edge.source,
          targetId: edge.target,
        });
      }
    });
    
    return positions;
  }, [nodes, edges]);

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
        
        {/* Add Node Buttons between edges */}
        {getAddNodeButtonPositions().map((position, index) => (
          <AddNodeButton
            key={`add-${position.sourceId}-${position.targetId}-${index}`}
            position={position}
            onAddNode={(type, pos) => insertNodeBetween(type, position.sourceId, position.targetId)}
          />
        ))}
        
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