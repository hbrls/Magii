import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import {
  FixedLayoutEditorProvider,
  EditorRenderer,
  FlowLayoutDefault,
  useNodeRender
} from '@flowgram.ai/fixed-layout-editor';
import '@flowgram.ai/fixed-layout-editor/index.css';
import { StartNode, TaskNode, EndNode, ConditionNode, BlockNode, nodeRegistries } from '../../nodeConfig';
import { loadConfig } from '../../data';

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

function useEditorProps(data, registries) {
  return useMemo(() => ({
    background: true,
    initialData: data,
    nodeRegistries: registries,
    readonly: false,
    defaultLayout: FlowLayoutDefault.HORIZONTAL_FIXED_LAYOUT,
    nodeEngine: { enable: true },
    constants: {
      BRANCH_SPACING: 50,
      NODE_SPACING: 100,
    },
    getNodeDefaultRegistry(type) {
      return { type, meta: { defaultExpanded: true } };
    },
    onAllLayersRendered: (ctx) => {
      setTimeout(() => { ctx.tools.fitView(); }, 10);
    },
    playground: {
      autoFit: true,
      canZoom: true,
    },
    history: {
      enable: true,
    },
    materials: {
      renderDefaultNode: NodeRenderer,
      components: {
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
        'adder': () => null,
        'collapse': () => null,
        'branch-adder': () => null,
        'selector-box-popover': () => null,
      },
    },
    onInit: (ctx) => {
      console.log('FlowGram editor initialized', ctx);
    },
    onContentChange: (ctx, event) => {
      console.log('Content changed:', event);
    },
  }), [data, registries]);
}

function Editor({ data }) {
  const editorProps = useEditorProps(data, nodeRegistries);

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

export default function RoadmapEditor() {
  const { appId, planId } = useParams();
  const data = loadConfig(appId, planId);

  if (!data) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
        No data found for /{appId}/{planId}
      </div>
    );
  }

  return <Editor data={data} />;
}
