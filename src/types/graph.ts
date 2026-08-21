import type { Edge, Node } from "@xyflow/react";

export type GraphNodeData = {
  title: string;
  attributes: string[];
  kind: "root" | "collection" | "entity" | "value";
  sourceHandles?: string[];
};

export type GraphNode = Node<GraphNodeData, "tableNode">;
export type GraphEdge = Edge;

export type GraphData = {
  nodes: GraphNode[];
  edges: GraphEdge[];
};
