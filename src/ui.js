import { useState, useRef, useCallback, useEffect } from "react";
import ReactFlow, { Controls, Background } from "reactflow";
import Editor from "@monaco-editor/react";
import { useStore } from "./store";
import { shallow } from "zustand/shallow";
import { AccountNode } from "./nodes/accountNode";
import { LoanNode } from "./nodes/loanNode";
import { CollateralNode } from "./nodes/collateralNode";
import "reactflow/dist/style.css";

const gridSize = 20;
const proOptions = { hideAttribution: true };
const nodeTypes = {
  account: AccountNode,
  loan: LoanNode,
  collateral: CollateralNode,
};

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  getNodeID: state.getNodeID,
  addNode: state.addNode,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
  currentSelectId: state.currentSelectId,
  setCurrentSelectId: state.setCurrentSelectId,
  addChild: state.addChild,
  setReactFlowInstanceStore: state.setReactFlowInstance,
  layout: state.layout,
});

export const PipelineUI = () => {
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const {
    nodes,
    edges,
    getNodeID,
    addNode,
    onNodesChange,
    onEdgesChange,
    setCurrentSelectId,
    setReactFlowInstanceStore,
    onConnect,
  } = useStore(selector, shallow);

  const getInitNodeData = () => {
    let nodeData =
      nodes.length === 0 ? "text message" : `text message ${nodes.length}`;
    return nodeData;
  };

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      if (event?.dataTransfer?.getData("application/reactflow")) {
        const appData = JSON.parse(
          event.dataTransfer.getData("application/reactflow")
        );
        const type = appData?.nodeType;

        if (typeof type === "undefined" || !type) {
          return;
        }

        const position = reactFlowInstance.project({
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        });

        const nodeID = getNodeID(type);
        const newNode = {
          id: nodeID,
          type,
          position,
          data: getInitNodeData(),
        };

        addNode(newNode);
      }
    },
    [reactFlowInstance, getNodeID, addNode, nodes]
  );

  useEffect(() => {
    if (reactFlowInstance) {
      reactFlowInstance.fitView({ padding: 0.3 });
    }
  }, [nodes, edges, reactFlowInstance]);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  return (
    <>
      <div ref={reactFlowWrapper} className="w-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onInit={(inst) => {
            setReactFlowInstance(inst);
            setReactFlowInstanceStore(inst);
          }}
          nodeTypes={nodeTypes}
          proOptions={proOptions}
          snapGrid={[gridSize, gridSize]}
          connectionLineType="smoothstep"
          onClick={(e) => {
            if (e.target.classList.contains("react-flow__pane")) {
              setCurrentSelectId(null);
            }
          }}
        >
          <Background color="#aaa" gap={gridSize} />
          <Controls />
        </ReactFlow>
      </div>
      <div className="h-[30dvh]">
        <Editor
          height="100%"
          defaultLanguage="json"
          options={{ readOnly: true }}
          value={JSON.stringify({ nodes, edges }, null, 2)}
        />
      </div>
    </>
  );
};
