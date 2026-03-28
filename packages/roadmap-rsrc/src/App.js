/**
 * FlowGram Roadmap Editor - Using Fixed Layout Editor API
 */
import React, { useMemo } from 'react';
import { 
  FixedLayoutEditorProvider, 
  EditorRenderer,
  FlowLayoutDefault,
  useNodeRender
} from '@flowgram.ai/fixed-layout-editor';
import '@flowgram.ai/fixed-layout-editor/index.css';
import { StartNode, TaskNode, EndNode, ConditionNode, BlockNode, nodeRegistries } from './nodeConfig';
import { initialData } from './initialData';

const nodeComponents = {
  start: StartNode,
  task: TaskNode,
  end: EndNode,
  condition: ConditionNode,
  block: BlockNode,
};

function NodeRenderer() {
  const { type } = useNodeRender();
  const Component = nodeComponents[type] || TaskNode;
  return <Component />;
}

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
    
    // Global spacing constants
    constants: {
      BRANCH_SPACING: 50,
      NODE_SPACING: 100,
    },
    
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
      renderDefaultNode: NodeRenderer,
      
      components: {
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
