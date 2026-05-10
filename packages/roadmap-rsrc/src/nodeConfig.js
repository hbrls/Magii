/**
 * Node Configuration - All node type definitions and styling
 */
import React from 'react';
import { useNodeRender } from '@flowgram.ai/fixed-layout-editor';

export const StartNode = () => {
  const { activated, startDrag, onMouseEnter, onMouseLeave } = useNodeRender();
  return (
    <div
      style={{
        minWidth: '120px',
        minHeight: '50px',
        padding: '12px 24px',
        backgroundColor: '#4CAF50',
        border: `2px solid ${activated ? '#FFD700' : '#388E3C'}`,
        borderRadius: '8px',
        color: 'white',
        fontWeight: 'bold',
        fontSize: '14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: activated ? '0 4px 12px rgba(0,0,0,0.3)' : '0 2px 4px rgba(0,0,0,0.2)',
        cursor: 'grab',
        transition: 'box-shadow 0.2s, border-color 0.2s',
        userSelect: 'none',
      }}
      onMouseDown={startDrag}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      Start
    </div>
  );
};

export const TaskNode = () => {
  const { form, data, activated, startDrag, onMouseEnter, onMouseLeave } = useNodeRender();
  const title = form?.values?.title || data?.title || 'Task';
  return (
    <div
      style={{
        minWidth: '120px',
        minHeight: '50px',
        padding: '12px 24px',
        backgroundColor: '#2196F3',
        border: `2px solid ${activated ? '#FFD700' : '#1976D2'}`,
        borderRadius: '8px',
        color: 'white',
        fontWeight: 'bold',
        fontSize: '14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: activated ? '0 4px 12px rgba(0,0,0,0.3)' : '0 2px 4px rgba(0,0,0,0.2)',
        cursor: 'grab',
        transition: 'box-shadow 0.2s, border-color 0.2s',
        userSelect: 'none',
      }}
      onMouseDown={startDrag}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {title}
    </div>
  );
};

export const EndNode = () => {
  const { data, activated, startDrag, onMouseEnter, onMouseLeave } = useNodeRender();
  const title = data?.title || 'End';
  return (
    <div
      style={{
        minWidth: '120px',
        minHeight: '50px',
        padding: '12px 24px',
        backgroundColor: '#f44336',
        border: `2px solid ${activated ? '#FFD700' : '#D32F2F'}`,
        borderRadius: '8px',
        color: 'white',
        fontWeight: 'bold',
        fontSize: '14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: activated ? '0 4px 12px rgba(0,0,0,0.3)' : '0 2px 4px rgba(0,0,0,0.2)',
        cursor: 'grab',
        transition: 'box-shadow 0.2s, border-color 0.2s',
        userSelect: 'none',
      }}
      onMouseDown={startDrag}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {title}
    </div>
  );
};

export const ConditionNode = () => {
  const { form, data, activated, startDrag, onMouseEnter, onMouseLeave } = useNodeRender();
  const title = form?.values?.title || data?.title || 'Condition';
  return (
    <div
      style={{
        width: '50px',
        height: '50px',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onMouseDown={startDrag}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div
        style={{
          width: '35px',
          height: '35px',
          backgroundColor: '#FFFFFF',
          border: `2px solid ${activated ? '#FFD700' : '#999999'}`,
          transform: 'rotate(45deg)',
          boxShadow: activated ? '0 4px 12px rgba(0,0,0,0.3)' : '0 2px 4px rgba(0,0,0,0.2)',
          cursor: 'grab',
          transition: 'box-shadow 0.2s, border-color 0.2s',
        }}
      />
      <div
        style={{
          position: 'absolute',
          color: '#333333',
          fontWeight: 'bold',
          fontSize: '12px',
          userSelect: 'none',
          pointerEvents: 'none',
        }}
      >
        {title}
      </div>
    </div>
  );
};

export const BlockNode = () => {
  return null;
};

export const nodeRegistries = [
  {
    type: 'start',
    meta: {
      isStart: true,
      deleteDisable: true,
      copyDisable: true,
      selectable: false,
      expandable: false,
      addDisable: true,
      size: { width: 200, height: 50 },
    },
  },
  {
    type: 'task',
    meta: {
      isNodeEnd: false,
      size: { width: 200, height: 50 },
    },
    formMeta: {
      form: {
        title: {
          type: 'string',
          default: 'Task'
        }
      },
    },
  },
  {
    type: 'end',
    meta: {
      isNodeEnd: true,
      deleteDisable: true,
      copyDisable: true,
      size: { width: 200, height: 50 },
    },
    formMeta: {
      form: {
        title: {
          type: 'string',
          default: 'End'
        }
      },
    },
  },
  {
    type: 'condition',
    extend: 'dynamicSplit',
    meta: {
      size: { width: 50, height: 50 },
    },
    extendChildRegistries: [
      {
        type: 'blockOrderIcon',
        meta: {
          size: { width: 0, height: 0 },
          spacing: 0,
        },
      },
    ],
    formMeta: {
      form: {
        title: {
          type: 'string',
          default: 'Condition'
        }
      },
    },
  },
  {
    type: 'block',
    meta: {
      size: { width: 0, height: 0 },
      spacing: 0,
    },
  },
];
