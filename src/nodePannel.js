// nodePannel.js - Side panel with tabs
"use client";
import { useState } from "react";
import { useStore } from "./store";
import Editor from "@monaco-editor/react";
import { IconArrowLeft } from "@tabler/icons-react";
import { Button } from "./components/Button";

export const NodePannel = () => {
  const {
    currentSelectId,
    nodes,
    edges,
    setCurrentSelectId,
    addChild,
    deleteNode,
  } = useStore();
  const [activeTab, setActiveTab] = useState("details");
  const selectedNode = nodes.find((n) => n.id === currentSelectId);

  const renderDetails = () => {
    if (!selectedNode)
      return (
        <div className="p-4 text-gray-500 text-sm">
          Select a node to view details
        </div>
      );
    return (
      <div className="p-4 flex flex-col gap-4">
        <div className="flex items-center gap-1.5 text-lg font-semibold text-gray-900">
          <IconArrowLeft
            stroke={1}
            size={24}
            onClick={() => setCurrentSelectId(null)}
          />
          Node Details
        </div>
        <div>
          <strong>Type:</strong> {selectedNode.type}
        </div>
        <div>
          <strong>ID:</strong> {selectedNode.id}
        </div>
        <div className="flex flex-col gap-3">
          {selectedNode.type === "account" && (
            <>
              <Button
                variant="primary"
                onClick={() => addChild(selectedNode.id, "loan")}
              >
                Add Loan
              </Button>
              <Button
                variant="secondary"
                onClick={() => addChild(selectedNode.id, "collateral")}
              >
                Add Collateral
              </Button>
            </>
          )}
          {selectedNode.type === "loan" && (
            <Button
              variant="secondary"
              onClick={() => addChild(selectedNode.id, "collateral")}
            >
              Add Collateral
            </Button>
          )}
          <Button variant="danger" onClick={() => deleteNode(selectedNode.id)}>
            Delete Node
          </Button>
        </div>
      </div>
    );
  };

  const renderExport = () => (
    <div className="h-full">
      <Editor
        height="600px"
        defaultLanguage="json"
        options={{ readOnly: true, minimap: { enabled: false } }}
        value={JSON.stringify({ nodes, edges }, null, 2)}
      />
    </div>
  );

  return (
    <div className="w-[500px] h-full bg-gray-50 border-l border-gray-200 font-inter flex flex-col">
      <div className="flex border-b border-gray-200">
        <button
          className={`flex-1 py-2 text-sm cursor-pointer transition-colors
                        ${
                          activeTab === "details"
                            ? "text-gray-900 font-semibold border-b-2 border-indigo-500"
                            : "text-gray-500"
                        }`}
          onClick={() => setActiveTab("details")}
        >
          Node Details
        </button>
        <button
          className={`flex-1 py-2 text-sm cursor-pointer transition-colors
                        ${
                          activeTab === "export"
                            ? "text-gray-900 font-semibold border-b-2 border-indigo-500"
                            : "text-gray-500"
                        }`}
          onClick={() => setActiveTab("export")}
        >
          Tree Export
        </button>
      </div>
      {activeTab === "details" ? renderDetails() : renderExport()}
    </div>
  );
};
