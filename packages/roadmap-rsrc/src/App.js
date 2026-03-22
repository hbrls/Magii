/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 * 
 * FlowGram Roadmap Editor - Using Fixed Layout Editor API
 */
import React, { useMemo } from 'react';
import { 
  FixedLayoutEditorProvider, 
  EditorRenderer,
  useNodeRender,
  FlowLayoutDefault
} from '@flowgram.ai/fixed-layout-editor';
import '@flowgram.ai/fixed-layout-editor/index.css';

/**
 * Node Registries - Define how each node type is configured and rendered
 */
/**
 * Node type styling configuration
 */
const nodeStyles = {
  start: {
    backgroundColor: '#4CAF50',
    borderColor: '#388E3C',
    label: 'Start'
  },
  task: {
    backgroundColor: '#2196F3',
    borderColor: '#1976D2',
    label: null // uses data.title
  },
  end: {
    backgroundColor: '#f44336',
    borderColor: '#D32F2F',
    label: 'End'
  }
};

/**
 * BaseNode - The VISUAL WRAPPER component for all nodes on the canvas
 * This is the CRITICAL component that creates the visible box for each node.
 * Without this, nodes have 0px dimensions and are invisible.
 */
const BaseNode = () => {
  const { 
    node, 
    type, 
    data,
    form, 
    activated, 
    startDrag,
    onMouseEnter, 
    onMouseLeave 
  } = useNodeRender();
  
  // Get styling based on node type
  const style = nodeStyles[type] || nodeStyles.task;
  
  // 优先从 form.values 获取 title（当 formMeta 定义了 form 字段时）
  // 其次从 data.title 获取（initialData 中的 data.title）
  // 最后使用类型名作为默认值
  const title = form?.values?.title || data?.title || style.label || type;
  
  return (
    <div
      style={{
        // CRITICAL: Explicit dimensions ensure the node is visible
        minWidth: '120px',
        minHeight: '50px',
        padding: '12px 24px',
        backgroundColor: style.backgroundColor,
        border: `2px solid ${activated ? '#FFD700' : style.borderColor}`,
        borderRadius: '8px',
        color: 'white',
        fontWeight: 'bold',
        fontSize: '14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: activated 
          ? '0 4px 12px rgba(0,0,0,0.3)' 
          : '0 2px 4px rgba(0,0,0,0.2)',
        cursor: 'grab',
        transition: 'box-shadow 0.2s, border-color 0.2s',
        userSelect: 'none',
      }}
      onMouseDown={startDrag}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* 直接显示 title，formMeta.render 可以用于更复杂的自定义渲染 */}
      {title}
    </div>
  );
};

/**
 * Node Registries - Define how each node type is configured
 * Note: formMeta.render is now simpler since BaseNode handles the visual wrapper
 */
const nodeRegistries = [
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
    formMeta: {
      // Form content is rendered inside the BaseNode visual wrapper
      render: () => <span>Start</span>
    }
  },
  {
    type: 'task',
    meta: {
      isNodeEnd: false,
      size: { width: 200, height: 50 },
    },
    formMeta: {
      // 定义表单字段结构 - title 字段
      form: {
        title: {
          type: 'string',
          default: 'Task'
        }
      },
      render: ({ form }) => {
        // 从表单值中获取 title
        const title = form?.values?.title || 'Task';
        return <span>{title}</span>;
      }
    }
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
      render: () => <span>End</span>
    }
  }
];

/**
 * Initial Data - The starting state of the flow document
 */
const initialData = {
  nodes: [
    { id: 'start_0', type: 'start', blocks: [], data: { title: 'Start' } },
    { id: 'roadmap', type: 'task', blocks: [], data: { title: 'Roadmap' } },
    { id: 'magii', type: 'task', blocks: [], data: { title: 'Magii' } },
    { id: 'end_0', type: 'end', blocks: [], data: { title: 'End' } },
  ]
};

/**
 * Hook to create editor props configuration
 */
function useEditorProps(data, registries) {
  return useMemo(() => ({
    // Enable background grid
    background: true,
    
    // Initial document data
    initialData: data,
    
    // Node type registrations
    nodeRegistries: registries,
    
    // Editor configuration
    readonly: false,
    
    // Use enum for layout (CRITICAL)
    defaultLayout: FlowLayoutDefault.HORIZONTAL_FIXED_LAYOUT,
    
    // Enable node engine (CRITICAL)
    nodeEngine: { enable: true },
    
    // Get default registry with expanded meta
    getNodeDefaultRegistry(type) {
      return { type, meta: { defaultExpanded: true } };
    },
    
    // Auto-fit view when all layers rendered
    onAllLayersRendered: (ctx) => {
      setTimeout(() => { ctx.tools.fitView(); }, 10);
    },
    
    // Playground configuration
    playground: {
      autoFit: true,
      canZoom: true,
    },
    
    // Enable history (undo/redo)
    history: {
      enable: true,
    },
    
    // Materials configuration - register required UI components
    materials: {
      // CRITICAL: renderDefaultNode provides the VISUAL WRAPPER for all nodes
      // Without this, nodes have 0px dimensions and are invisible on the canvas
      renderDefaultNode: BaseNode,
      
      components: {
        // node-render: Alternative to renderDefaultNode (same purpose)
        // Using renderDefaultNode above, but can also use:
        // 'node-render': BaseNode,
        
        // Drag node placeholder (CRITICAL - required to prevent crash)
        'drag-node': () => (
          <div style={{
            padding: '8px 12px',
            backgroundColor: '#2196F3',
            color: 'white',
            borderRadius: '4px',
            opacity: 0.8,
            fontSize: '12px',
          }}>
            Dragging...
          </div>
        ),
        // Other required renderers (minimal implementations)
        'adder': () => null,
        'collapse': () => null,
        'branch-adder': () => null,
        'selector-box-popover': () => null,
      },
    },
    
    // Callbacks
    onInit: (ctx) => {
      console.log('FlowGram editor initialized', ctx);
    },
    
    onContentChange: (ctx, event) => {
      console.log('Content changed:', event);
    },
  }), [data, registries]);
}

/**
 * Main Editor Component
 */
function Editor() {
  const editorProps = useEditorProps(initialData, nodeRegistries);
  
  return (
    <div className="flowgram-editor-container" style={{ 
      width: '100%', 
      height: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <FixedLayoutEditorProvider {...editorProps}>
        <EditorRenderer 
          style={{ 
            flex: 1,
            width: '100%',
            height: '100%'
          }} 
        />
      </FixedLayoutEditorProvider>
    </div>
  );
}

/**
 * App Root Component
 */
function App() {
  return <Editor />;
}

export default App;
