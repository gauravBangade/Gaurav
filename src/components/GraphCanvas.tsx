import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  type EdgeMouseHandler,
  Handle,
  MiniMap,
  Position,
  type ReactFlowInstance,
  type NodeProps,
  type NodeTypes,
} from "reactflow";
import "reactflow/dist/style.css";
import type { GraphEdge, GraphNode, GraphNodeData } from "../types/graph";

type GraphCanvasProps = {
  nodes: GraphNode[];
  edges: GraphEdge[];
};

const kindClasses: Record<GraphNodeData["kind"], string> = {
  root: "bg-[#2a2a2a] text-zinc-100 border-zinc-600",
  collection: "bg-[#2f2f2f] text-zinc-100 border-zinc-600",
  entity: "bg-[#2b2b2b] text-zinc-100 border-zinc-600",
  value: "bg-[#262626] text-zinc-100 border-zinc-700",
};

const TableNode = memo(({ data }: NodeProps<GraphNodeData>) => {
  const classes = kindClasses[data.kind];
  const sourceHandles = data.sourceHandles ?? [];
  const renderAttribute = (attribute: string) => {
    const separatorIndex = attribute.indexOf(":");
    if (separatorIndex < 0) return <span>{attribute}</span>;

    const key = attribute.slice(0, separatorIndex);
    const value = attribute.slice(separatorIndex + 1).trimStart();

    return (
      <span>
        <span className="text-cyan-300">{key}:</span> {value}
      </span>
    );
  };

  return (
    <div className={`min-w-[260px] max-w-[340px] rounded-lg border shadow-sm ${classes}`}>
      <Handle
        id="in"
        type="target"
        position={Position.Left}
        className="!h-2 !w-2 !border !border-zinc-500 !bg-zinc-500/90"
      />
      {sourceHandles.length > 0 &&
        sourceHandles.map((handleId, index) => (
          <Handle
            key={handleId}
            id={handleId}
            type="source"
            position={Position.Right}
            style={{ top: `${((index + 1) / (sourceHandles.length + 1)) * 100}%` }}
            className="!h-2 !w-2 !border !border-zinc-500 !bg-zinc-500/90"
          />
        ))}
      <div className="border-b border-zinc-600 px-3 py-2 text-xs font-semibold tracking-wide text-cyan-300">{data.title}</div>
      {data.attributes.length > 0 && (
        <div className="px-3 py-2 text-[11px] leading-5">
          {data.attributes.map((attribute, index) => (
            <div
              key={`${data.title}-${index}`}
              className="whitespace-pre-wrap break-all border-b border-zinc-700 py-1 last:border-none"
            >
              {renderAttribute(attribute)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

TableNode.displayName = "TableNode";

const nodeTypes: NodeTypes = {
  tableNode: TableNode,
};

export default function GraphCanvas({ nodes, edges }: GraphCanvasProps) {
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);
  const [hoveredEdgeId, setHoveredEdgeId] = useState<string | null>(null);
  const containerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!rfInstance || nodes.length === 0) return;

    // Wait for node dimensions + edges to settle before fitting.
    let frame2: number | null = null;
    const frame1 = requestAnimationFrame(() => {
      frame2 = requestAnimationFrame(() => {
        rfInstance.fitView({
          includeHiddenNodes: true,
          padding: 0.22,
          duration: 220,
          maxZoom: 1.2,
        });
      });
    });

    return () => {
      cancelAnimationFrame(frame1);
      if (frame2 !== null) cancelAnimationFrame(frame2);
    };
  }, [rfInstance, nodes, edges]);

  useEffect(() => {
    if (!rfInstance || nodes.length === 0) return;

    const onResize = () => {
      requestAnimationFrame(() => {
        rfInstance.fitView({
          includeHiddenNodes: true,
          padding: 0.22,
          duration: 180,
          maxZoom: 1.2,
        });
      });
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [rfInstance, nodes.length]);

  useEffect(() => {
    if (!rfInstance || nodes.length === 0 || !containerRef.current) return;

    const observer = new ResizeObserver(() => {
      requestAnimationFrame(() => {
        rfInstance.fitView({
          includeHiddenNodes: true,
          padding: 0.22,
          duration: 180,
          maxZoom: 1.2,
        });
      });
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [rfInstance, nodes.length]);

  const renderedEdges = useMemo(
    () =>
      edges.map(edge => ({
        ...edge,
        style: {
          ...edge.style,
          cursor: "pointer",
          stroke: edge.id === hoveredEdgeId ? "#22c55e" : "#4b5563",
          strokeWidth: edge.id === hoveredEdgeId ? 2.1 : 1.4,
        },
        labelStyle: {
          ...edge.labelStyle,
          fill: edge.id === hoveredEdgeId ? "#86efac" : "#a1a1aa",
        },
      })),
    [edges, hoveredEdgeId],
  );

  const onEdgeClick = useCallback<EdgeMouseHandler>(
    (_event, edge) => {
      if (!rfInstance) return;

      const targetNode = nodes.find((node) => node.id === edge.target);
      if (!targetNode) return;

      const x = targetNode.position.x + 160;
      const y = targetNode.position.y + 40;

      rfInstance.setCenter(x, y, { zoom: 1.05, duration: 350 });
    },
    [nodes, rfInstance],
  );

  return (
    <section ref={containerRef} className="json-toolkit-graph-canvas h-full w-full min-h-0 min-w-0 bg-[#0b0c10]">
      <ReactFlow
        nodes={nodes}
        edges={renderedEdges}
        nodeTypes={nodeTypes}
        className="json-toolkit-flow"
        style={{ backgroundColor: "#0b0c10", width: "100%", height: "100%" }}
        defaultEdgeOptions={{
          style: { stroke: "#4b5563", strokeWidth: 1.4 },
        }}
        minZoom={0.12}
        maxZoom={1.6}
        onInit={setRfInstance}
        onEdgeClick={onEdgeClick}
        onEdgeMouseEnter={(_event, edge) => setHoveredEdgeId(edge.id)}
        onEdgeMouseLeave={() => setHoveredEdgeId(null)}
        proOptions={{ hideAttribution: true }}
      >
        <MiniMap
          className="json-toolkit-minimap"
          zoomable
          pannable
          position="top-left"
          maskColor="rgba(52, 211, 153, 0.12)"
          nodeColor={(node) => (node.data?.kind === "root" ? "#3f8c63" : "#2f855a")}
        />
        <Controls
          position="top-right"
          showInteractive={false}
          className="json-toolkit-graph-controls"
        />
        <Background
          id="minor-grid"
          variant={BackgroundVariant.Lines}
          gap={28}
          size={1}
          color="rgba(82, 82, 91, 0.25)"
        />
        <Background
          id="major-grid"
          variant={BackgroundVariant.Lines}
          gap={140}
          size={1.2}
          color="rgba(113, 113, 122, 0.3)"
        />
      </ReactFlow>
    </section>
  );
}
