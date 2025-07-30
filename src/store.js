import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import dagre from "dagre";
import {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  MarkerType,
} from "reactflow";

const nodeWidth = 172;
const nodeHeight = 36;

const getLayouted = (nodes, edges, direction = "TB") => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  const separation = { nodesep: 200, ranksep: 120 };
  dagreGraph.setGraph({ rankdir: direction, ...separation });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  return nodes.map((node) => {
    const { x, y } = dagreGraph.node(node.id);
    return {
      ...node,
      position: { x: x - nodeWidth / 2, y: y - nodeHeight / 2 },
    };
  });
};

export const useStore = create((set, get) => ({
  reactFlowInstance: null,
  setReactFlowInstance: (inst) => set({ reactFlowInstance: inst }),
  nodes: [
    { id: uuidv4(), type: "account", position: { x: 250, y: 50 }, data: "" },
  ],
  edges: [],
  currentSelectId: null,
  setCurrentSelectId: (id) => {
    set({ currentSelectId: id });
  },
  error: null,
  setError: (error) => {
    set({ error });
  },
  validateNodes: () => {
    const { nodes, edges } = get();
    if (nodes.length <= 1) return true;
    const nodesWithEmptyTargets = nodes.filter((node) => {
      const incomingEdges = edges.filter((edge) => edge.target === node.id);
      return incomingEdges.length === 0;
    });

    if (nodesWithEmptyTargets.length > 1) {
      set({
        error: "Multiple nodes have empty target handles. Please connect them.",
      });
      return false;
    }
    set({ error: null });
    return true;
  },
  getNodeID: () => {
    return uuidv4();
  },

  addNode: (node) => {
    if (get().nodes.find((n) => n.id === node.id)) return;

    const updatedNodes = [...get().nodes, node];
    const layouted = getLayouted(updatedNodes, get().edges);
    set({ nodes: layouted });
  },
  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },
  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  onConnect: (connection) => {
    const updatedEdges = addEdge(
      {
        ...connection,
        type: "smoothstep",
        animated: true,
        markerEnd: { type: MarkerType.Arrow, height: "20px", width: "20px" },
      },
      get().edges
    );
    const layouted = getLayouted(get().nodes, updatedEdges);
    set({ nodes: layouted, edges: updatedEdges });
  },
  addChild: (parentId, childType) => {
    const { nodes, edges, getNodeID } = get();
    const parent = nodes.find((n) => n.id === parentId);
    if (!parent) return;

    const allowed = {
      account: ["loan", "collateral"],
      loan: ["collateral"],
      collateral: [],
    };
    if (!allowed[parent.type].includes(childType)) return;

    const childId = getNodeID();
    const newNode = {
      id: childId,
      type: childType,
      position: { x: 0, y: 0 },
      data: "",
    };
    const updatedNodes = [...nodes, newNode];
    const updatedEdges = [
      ...edges,
      {
        id: `${parentId}-${childId}`,
        source: parentId,
        target: childId,
        type: "smoothstep",
      },
    ];
    const layouted = getLayouted(updatedNodes, updatedEdges);
    set({ nodes: layouted, edges: updatedEdges });
  },
  deleteNode: (nodeId) => {
    const { nodes, edges } = get();

    const toDelete = new Set([nodeId]);
    let added = true;
    while (added) {
      added = false;
      edges.forEach((edge) => {
        if (toDelete.has(edge.source) && !toDelete.has(edge.target)) {
          toDelete.add(edge.target);
          added = true;
        }
      });
    }

    const remainingNodes = nodes.filter((n) => !toDelete.has(n.id));
    const remainingEdges = edges.filter(
      (e) => !toDelete.has(e.source) && !toDelete.has(e.target)
    );
    const layouted = getLayouted(remainingNodes, remainingEdges);
    set({ nodes: layouted, edges: remainingEdges, currentSelectId: null });
  },
  layout: () => {
    const { nodes, edges } = get();
    const layouted = getLayouted([...nodes], edges);
    set({ nodes: layouted });
  },
  updateNodeField: (nodeId, data) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          node.data = data;
        }

        return node;
      }),
    });
  },
}));
