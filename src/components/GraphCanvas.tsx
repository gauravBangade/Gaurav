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
  root: "border-[#7a9a7f] bg-[#f9fcf6] text-[#1d2f22]",
  collection: "border-[#95af98] bg-[#fbfdf8] text-[#1d2f22]",
  entity: "border-[#87a68b] bg-[#f6faf3] text-[#1d2f22]",
  value: "border-[#a6bda8] bg-[#fdfdf9] text-[#243429]",
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
        <span className="text-[#466a52]">{key}:</span> {value}
      </span>
    );
  };

  return (
    <div className={`min-w-[280px] max-w-[360px] rounded-lg border bg-white/90 shadow-[0_8px_18px_rgba(77,106,83,0.08)] ${classes}`}>
      <Handle
        id="in"
        type="target"
        position={Position.Left}
        className="!h-2 !w-2 !border !border-[#769179] !bg-[#769179]"
      />
      {sourceHandles.length > 0 &&
        sourceHandles.map((handleId, index) => (
          <Handle
            key={handleId}
            id={handleId}
            type="source"
            position={Position.Right}
            style={{ top: `${((index + 1) / (sourceHandles.length + 1)) * 100}%` }}
            className="!h-2 !w-2 !border !border-[#769179] !bg-[#769179]"
          />
        ))}
      <div className="border-b border-[#b9cbb9] px-3 py-2.5 text-sm font-semibold tracking-wide text-[#466a52]">{data.title}</div>
      {data.attributes.length > 0 && (
        <div className="px-3 py-2.5 text-[13px] leading-6">
          {data.attributes.map((attribute, index) => (
            <div
              key={`${data.title}-${index}`}
              className="whitespace-pre-wrap break-all border-b border-[#d7e1d5] py-1.5 last:border-none"
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
          stroke: edge.id === hoveredEdgeId ? "#466a52" : "#769179",
          strokeWidth: edge.id === hoveredEdgeId ? 2.1 : 1.4,
        },
        labelStyle: {
          ...edge.labelStyle,
          fill: edge.id === hoveredEdgeId ? "#466a52" : "#6f7d70",
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
    <section ref={containerRef} className="json-toolkit-graph-canvas h-full w-full min-h-0 min-w-0 bg-[#f5f8f0]">
      <ReactFlow
        nodes={nodes}
        edges={renderedEdges}
        nodeTypes={nodeTypes}
        className="json-toolkit-flow"
        style={{ backgroundColor: "#f5f8f0", width: "100%", height: "100%" }}
        defaultEdgeOptions={{
          style: { stroke: "#769179", strokeWidth: 1.4 },
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
          maskColor="rgba(108, 139, 115, 0.16)"
          nodeColor={(node) => (node.data?.kind === "root" ? "#6c8b73" : "#8aa08f")}
        />
        <Controls
          position="top-right"
          showInteractive={false}
          className="json-toolkit-graph-controls"
        />
        <Background
          id="minor-grid"
          variant={BackgroundVariant.Lines}
          gap={26}
          size={1}
          color="rgba(108, 139, 115, 0.18)"
        />
        <Background
          id="major-grid"
          variant={BackgroundVariant.Lines}
          gap={130}
          size={1.2}
          color="rgba(70, 106, 82, 0.28)"
        />
      </ReactFlow>
    </section>
  );
}
