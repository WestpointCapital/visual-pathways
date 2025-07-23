import { Node, Edge } from '@xyflow/react';

export const initialNodes: Node[] = [
  {
    id: 'trigger-1',
    type: 'trigger',
    position: { x: 300, y: 100 },
    data: { 
      label: 'Order: 24 hours to delivery date',
      description: 'Triggers when order is placed',
      triggerType: 'order_placed'
    },
  },
  {
    id: 'action-1',
    type: 'action',
    position: { x: 300, y: 250 },
    data: { 
      label: 'When SMS arrive',
      description: 'When lead replies with keywords'
    },
  },
  {
    id: 'condition-1',
    type: 'condition',
    position: { x: 300, y: 400 },
    data: { 
      label: 'IF / ELSE',
      description: 'When lead replies with keywords',
      condition: '24_hours_before'
    },
  },
  {
    id: 'action-2',
    type: 'action',
    position: { x: 150, y: 550 },
    data: { 
      label: 'When SMS arrive',
      description: 'When lead replies with keywords'
    },
  },
  {
    id: 'action-3',
    type: 'action',
    position: { x: 450, y: 550 },
    data: { 
      label: 'When SMS arrive',
      description: 'When lead replies with keywords'
    },
  },
];

export const initialEdges: Edge[] = [
  {
    id: 'e1-2',
    source: 'trigger-1',
    target: 'action-1',
    style: { strokeDasharray: '5,5', strokeWidth: 2 },
    type: 'smoothstep',
  },
  {
    id: 'e2-3',
    source: 'action-1',
    target: 'condition-1',
    style: { strokeDasharray: '5,5', strokeWidth: 2 },
    type: 'smoothstep',
  },
  {
    id: 'e3-4',
    source: 'condition-1',
    sourceHandle: 'true',
    target: 'action-2',
    style: { strokeDasharray: '5,5', strokeWidth: 2, stroke: '#10b981' },
    type: 'smoothstep',
  },
  {
    id: 'e3-5',
    source: 'condition-1',
    sourceHandle: 'false',
    target: 'action-3',
    style: { strokeDasharray: '5,5', strokeWidth: 2, stroke: '#ef4444' },
    type: 'smoothstep',
  },
];