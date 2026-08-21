import type { GraphData, GraphEdge, GraphNode } from "../types/graph";

type Primitive = string | number | boolean | null;

type NodeKind = GraphNode["data"]["kind"];

type ModelNode = {
  id: string;
  title: string;
  kind: NodeKind;
  attributes: string[];
  height: number;
};

type ModelEdge = {
  id: string;
  from: string;
  to: string;
  label?: string;
  sourceHandle?: string;
};

const NODE_WIDTH = 340;
const HEADER_HEIGHT = 42;
const ROW_HEIGHT = 30;
const NODE_MIN_HEIGHT = 84;
const COLUMN_GAP = 500;
const VERTICAL_GAP = 90;
const LEFT_PADDING = 28;
const TOP_PADDING = 28;
const MAX_GRAPH_NODES = 350;
const MAX_GRAPH_DEPTH = 24;
const MAX_ATTRIBUTES_PER_NODE = 80;
const MAX_PRIMITIVE_ARRAY_ITEMS = 40;

function isPrimitive(value: unknown): value is Primitive {
  return value === null || typeof value === "string" || typeof value === "number" || typeof value === "boolean";
}

function formatPrimitive(value: Primitive): string {
  if (value === null) return "null";
  if (typeof value === "string") return value;
  return String(value);
}

function computeNodeHeight(attributes: string[]): number {
  return Math.max(NODE_MIN_HEIGHT, HEADER_HEIGHT + Math.max(attributes.length, 1) * ROW_HEIGHT + 18);
}

function summaryForValue(value: unknown): string {
  if (Array.isArray(value)) return `[${value.length} items]`;
  if (value && typeof value === "object") return `{${Object.keys(value as Record<string, unknown>).length} keys}`;
  return formatPrimitive(value as Primitive);
}

function deriveEntityTitle(base: string, value: Record<string, unknown>, index: number): string {
  const name = value.name;
  if (typeof name === "string" && name.trim()) return name;
  return `${base} ${index + 1}`;
}

export function jsonToGraph(json: unknown): GraphData {
  const modelNodes = new Map<string, ModelNode>();
  const modelEdges: ModelEdge[] = [];
  let nodeIdCounter = 1;
  let edgeIdCounter = 1;
  let limitNodeId: string | null = null;

  const nextNodeId = () => `node-${nodeIdCounter++}`;
  const nextEdgeId = () => `edge-${edgeIdCounter++}`;

  const addModelNode = (title: string, kind: NodeKind, attributes: string[]): string => {
    const id = nextNodeId();
    modelNodes.set(id, {
      id,
      title,
      kind,
      attributes,
      height: computeNodeHeight(attributes),
    });
    return id;
  };

  const getLimitNode = (reason: string): string => {
    if (limitNodeId) return limitNodeId;

    limitNodeId = addModelNode("Graph limit reached", "value", [
      reason,
      "Try a smaller JSON sample or collapse the source data before visualizing.",
    ]);
    return limitNodeId;
  };

  const canCreateGraphNode = () => modelNodes.size < MAX_GRAPH_NODES;

  const addModelEdge = (from: string, to: string, label?: string) => {
    modelEdges.push({
      id: nextEdgeId(),
      from,
      to,
      label,
    });
  };

  const buildObjectNode = (title: string, input: Record<string, unknown>, depth: number): string => {
    if (depth > MAX_GRAPH_DEPTH) {
      return getLimitNode(`Depth limit of ${MAX_GRAPH_DEPTH} levels reached.`);
    }
    if (!canCreateGraphNode()) {
      return getLimitNode(`Node limit of ${MAX_GRAPH_NODES} reached.`);
    }

    const attributes: string[] = [];
    const deferredChildren: Array<{ key: string; value: unknown }> = [];

    const entries = Object.entries(input);

    entries.slice(0, MAX_ATTRIBUTES_PER_NODE).forEach(([key, value]) => {
      if (isPrimitive(value)) {
        attributes.push(`${key}: ${formatPrimitive(value)}`);
        return;
      }

      if (Array.isArray(value)) {
        if (value.every(isPrimitive)) {
          const printable = value.slice(0, MAX_PRIMITIVE_ARRAY_ITEMS).map(item => formatPrimitive(item)).join(", ");
          const suffix = value.length > MAX_PRIMITIVE_ARRAY_ITEMS ? ", ..." : "";
          attributes.push(`${key}: [${printable}${suffix}]`);
        } else {
          attributes.push(`${key}: [${value.length} items]`);
          deferredChildren.push({ key, value });
        }
        return;
      }

      attributes.push(`${key}: ${summaryForValue(value)}`);
      deferredChildren.push({ key, value });
    });

    if (entries.length > MAX_ATTRIBUTES_PER_NODE) {
      attributes.push(`...: ${entries.length - MAX_ATTRIBUTES_PER_NODE} more keys`);
    }

    const nodeId = addModelNode(title, "entity", attributes);

    for (const { key, value } of deferredChildren) {
      if (!canCreateGraphNode()) {
        const childId = getLimitNode(`Node limit of ${MAX_GRAPH_NODES} reached.`);
        addModelEdge(nodeId, childId, "more");
        break;
      }
      const childId = buildValueNode(key, value, depth + 1);
      addModelEdge(nodeId, childId, key);
    }

    return nodeId;
  };

  const buildArrayNode = (key: string, values: unknown[], depth: number): string => {
    if (depth > MAX_GRAPH_DEPTH) {
      return getLimitNode(`Depth limit of ${MAX_GRAPH_DEPTH} levels reached.`);
    }
    if (!canCreateGraphNode()) {
      return getLimitNode(`Node limit of ${MAX_GRAPH_NODES} reached.`);
    }

    const nodeId = addModelNode(`${key}: [${values.length} items]`, "collection", []);

    for (const [index, item] of values.entries()) {
      if (!canCreateGraphNode()) {
        const childId = getLimitNode(`Node limit of ${MAX_GRAPH_NODES} reached.`);
        addModelEdge(nodeId, childId, "more");
        break;
      }

      if (item && typeof item === "object" && !Array.isArray(item)) {
        const title = deriveEntityTitle(key, item as Record<string, unknown>, index);
        const childId = buildObjectNode(title, item as Record<string, unknown>, depth + 1);
        addModelEdge(nodeId, childId, title);
        continue;
      }

      const childId = buildValueNode(`[${index}]`, item, depth + 1);
      addModelEdge(nodeId, childId, `[${index}]`);
    }

    return nodeId;
  };

  const buildValueNode = (key: string, value: unknown, depth = 0): string => {
    if (depth > MAX_GRAPH_DEPTH) {
      return getLimitNode(`Depth limit of ${MAX_GRAPH_DEPTH} levels reached.`);
    }
    if (!canCreateGraphNode()) {
      return getLimitNode(`Node limit of ${MAX_GRAPH_NODES} reached.`);
    }

    if (Array.isArray(value)) {
      return buildArrayNode(key, value, depth);
    }

    if (value && typeof value === "object") {
      return buildObjectNode(key, value as Record<string, unknown>, depth);
    }

    return addModelNode(key, "value", [`value: ${formatPrimitive(value as Primitive)}`]);
  };

  const rootNodeId = addModelNode("root", "root", []);
  const rootNodeIds: string[] = [rootNodeId];

  if (json && typeof json === "object" && !Array.isArray(json)) {
    const entries = Object.entries(json as Record<string, unknown>);
    if (entries.length === 0) {
      const valueId = addModelNode("value", "value", ["value: {}"]);
      addModelEdge(rootNodeId, valueId, "value");
    } else {
      for (const [key, value] of entries) {
        if (!canCreateGraphNode()) {
          const childId = getLimitNode(`Node limit of ${MAX_GRAPH_NODES} reached.`);
          addModelEdge(rootNodeId, childId, "more");
          break;
        }
        const childId = buildValueNode(key, value);
        addModelEdge(rootNodeId, childId, key);
      }
    }
  } else {
    const valueId = buildValueNode("value", json);
    addModelEdge(rootNodeId, valueId, "value");
  }

  const childrenByNode = new Map<string, string[]>();
  modelEdges.forEach(edge => {
    const list = childrenByNode.get(edge.from) ?? [];
    list.push(edge.to);
    childrenByNode.set(edge.from, list);
  });

  const outgoingEdgesByNode = new Map<string, ModelEdge[]>();
  modelEdges.forEach(edge => {
    const list = outgoingEdgesByNode.get(edge.from) ?? [];
    list.push(edge);
    outgoingEdgesByNode.set(edge.from, list);
  });

  outgoingEdgesByNode.forEach(edges => {
    edges.forEach((edge, index) => {
      edge.sourceHandle = `out-${edge.from}-${index}`;
    });
  });

  const subtreeHeightMemo = new Map<string, number>();
  const getSubtreeHeight = (id: string): number => {
    const cached = subtreeHeightMemo.get(id);
    if (cached !== undefined) return cached;

    const current = modelNodes.get(id);
    if (!current) return NODE_MIN_HEIGHT + VERTICAL_GAP;

    const children = childrenByNode.get(id) ?? [];
    if (children.length === 0) {
      const leafHeight = current.height + VERTICAL_GAP;
      subtreeHeightMemo.set(id, leafHeight);
      return leafHeight;
    }

    const childTotal = children.reduce((sum, childId) => sum + getSubtreeHeight(childId), 0);
    const result = Math.max(current.height + VERTICAL_GAP, childTotal);
    subtreeHeightMemo.set(id, result);
    return result;
  };

  const positioned = new Map<string, { x: number; y: number }>();
  const layout = (id: string, depth: number, top: number): void => {
    const node = modelNodes.get(id);
    if (!node) return;

    const children = childrenByNode.get(id) ?? [];
    const x = LEFT_PADDING + depth * COLUMN_GAP;

    if (children.length === 0) {
      positioned.set(id, { x, y: top });
      return;
    }

    let cursor = top;
    const childCenters: number[] = [];

    children.forEach(childId => {
      const subtreeHeight = getSubtreeHeight(childId);
      layout(childId, depth + 1, cursor);
      const childNode = modelNodes.get(childId);
      const childPos = positioned.get(childId);
      if (childNode && childPos) {
        childCenters.push(childPos.y + childNode.height / 2);
      }
      cursor += subtreeHeight;
    });

    const firstCenter = childCenters[0] ?? top;
    const lastCenter = childCenters[childCenters.length - 1] ?? top;
    const center = (firstCenter + lastCenter) / 2;
    const y = center - node.height / 2;
    positioned.set(id, { x, y });
  };

  let rootCursor = TOP_PADDING;
  rootNodeIds.forEach(rootNodeId => {
    const subtreeHeight = getSubtreeHeight(rootNodeId);
    layout(rootNodeId, 0, rootCursor);
    rootCursor += subtreeHeight;
  });

  const nodes: GraphNode[] = Array.from(modelNodes.values()).map((node): GraphNode => {
    const pos = positioned.get(node.id) ?? { x: LEFT_PADDING, y: TOP_PADDING };
    const outgoingEdges = outgoingEdgesByNode.get(node.id) ?? [];
    return {
      id: node.id,
      type: "tableNode",
      data: {
        title: node.title,
        attributes: node.attributes,
        kind: node.kind,
        sourceHandles: outgoingEdges.map((edge) => edge.sourceHandle!).filter(Boolean),
      },
      position: pos,
      style: { width: NODE_WIDTH },
    };
  });

  const edges: GraphEdge[] = modelEdges.map(edge => ({
    id: edge.id,
    source: edge.from,
    target: edge.to,
    sourceHandle: edge.sourceHandle ?? "out",
    targetHandle: "in",
    label: edge.label ?? "",
    labelStyle: { fill: "#6f7d70", fontSize: 12 },
    labelBgStyle: { fill: "transparent" },
    style: { stroke: "#769179", strokeWidth: 1.6 },
  }));

  return { nodes, edges };
}
