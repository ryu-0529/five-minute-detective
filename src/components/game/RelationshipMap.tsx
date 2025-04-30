import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { RelationshipNode, RelationshipEdge } from '../../types/game';

interface RelationshipMapProps {
  nodes: RelationshipNode[];
  edges: RelationshipEdge[];
  onNodeClick?: (nodeId: string) => void;
}

/**
 * 関連性マップコンポーネント
 * キャラクター、証拠、概念間の関連性を視覚化
 */
const RelationshipMap: React.FC<RelationshipMapProps> = ({
  nodes,
  edges,
  onNodeClick
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 600, height: 400 });
  
  // コンテナのサイズに応じてSVGサイズを調整
  useEffect(() => {
    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect();
      setDimensions({ width, height });
    }
  }, []);

  // D3.jsを使ってグラフ可視化
  useEffect(() => {
    if (!svgRef.current || nodes.length === 0) return;

    // 既存のグラフをクリア
    d3.select(svgRef.current).selectAll('*').remove();

    // ノードとエッジのフィルタリング（発見済みのみ表示）
    const visibleNodes = nodes.filter(node => node.discovered);
    const visibleEdges = edges.filter(edge => 
      edge.discovered && 
      visibleNodes.some(node => node.id === edge.source) && 
      visibleNodes.some(node => node.id === edge.target)
    );

    // 色の設定
    const nodeColors: Record<string, string> = {
      'suspect': '#FF6B6B',   // 赤 (容疑者)
      'evidence': '#4ECDC4',  // 青緑 (証拠)
      'concept': '#FFD166',   // 黄色 (概念)
      'event': '#845EC2'      // 紫 (イベント)
    };

    // エッジの線種設定
    const edgeStyles: Record<string, string> = {
      'knows': '5, 5',        // 破線（知っている関係）
      'opposes': '10, 2',     // 長い破線（対立関係）
      'related': '',          // 実線（関連あり）
      'causes': '2, 2',       // 短い破線（原因）
      'influences': '8, 3, 2, 3' // 複合破線（影響）
    };

    // D3 フォースシミュレーション設定
    const simulation = d3.forceSimulation(visibleNodes as d3.SimulationNodeDatum[])
      .force('link', d3.forceLink(visibleEdges)
        .id((d: any) => d.id)
        .distance(100)
        .strength(edge => (edge as RelationshipEdge).strength * 0.8)
      )
      .force('charge', d3.forceManyBody().strength(-200))
      .force('center', d3.forceCenter(dimensions.width / 2, dimensions.height / 2))
      .force('collision', d3.forceCollide().radius(40));

    // SVG要素の作成
    const svg = d3.select(svgRef.current);

    // 矢印マーカー定義
    svg.append('defs').selectAll('marker')
      .data(['arrow'])
      .enter().append('marker')
      .attr('id', d => d)
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 20)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('fill', '#999')
      .attr('d', 'M0,-5L10,0L0,5');

    // エッジの描画
    const link = svg.append('g')
      .selectAll('line')
      .data(visibleEdges)
      .enter().append('line')
      .attr('stroke', '#999')
      .attr('stroke-opacity', d => d.strength)
      .attr('stroke-width', d => 1 + d.strength * 2)
      .attr('stroke-dasharray', d => edgeStyles[d.type])
      .attr('marker-end', 'url(#arrow)');

    // ノードグループの作成
    const node = svg.append('g')
      .selectAll('.node')
      .data(visibleNodes)
      .enter().append('g')
      .attr('class', 'node')
      .call(d3.drag<SVGGElement, RelationshipNode>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended) as any
      )
      .on('click', (event, d) => {
        if (onNodeClick) onNodeClick(d.id);
      });

    // ノードの円の描画
    node.append('circle')
      .attr('r', 20)
      .attr('fill', d => nodeColors[d.type])
      .attr('stroke', '#fff')
      .attr('stroke-width', 2);

    // ノードのラベル描画
    node.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '.3em')
      .attr('fill', '#fff')
      .attr('font-size', '10px')
      .text(d => d.label.length > 10 ? d.label.substring(0, 10) + '...' : d.label);

    // ホバー時のツールチップ
    node.append('title')
      .text(d => `${d.label}\n${d.details || ''}`);

    // シミュレーション更新時の処理
    simulation.on('tick', () => {
      link
        .attr('x1', d => Math.max(20, Math.min(dimensions.width - 20, (d.source as any).x)))
        .attr('y1', d => Math.max(20, Math.min(dimensions.height - 20, (d.source as any).y)))
        .attr('x2', d => Math.max(20, Math.min(dimensions.width - 20, (d.target as any).x)))
        .attr('y2', d => Math.max(20, Math.min(dimensions.height - 20, (d.target as any).y)));

      node
        .attr('transform', d => `translate(${
          Math.max(20, Math.min(dimensions.width - 20, (d as any).x))
        },${
          Math.max(20, Math.min(dimensions.height - 20, (d as any).y))
        })`);
    });

    // ドラッグ関連の関数
    function dragstarted(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: any, d: any) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    // クリーンアップ
    return () => {
      simulation.stop();
    };
  }, [nodes, edges, dimensions, onNodeClick]);

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4" ref={containerRef}>
      <h3 className="font-detective text-lg text-detective-dark font-bold mb-3">
        関連性マップ
      </h3>
      <p className="text-sm text-gray-600 mb-3">
        証拠、人物、概念の関連性を可視化しています。ノードをドラッグして動かせます。
      </p>
      <div className="bg-gray-100 rounded-md overflow-hidden" style={{ height: '400px' }}>
        <svg ref={svgRef} width={dimensions.width} height={dimensions.height}>
          {/* D3.jsによる描画 */}
        </svg>
      </div>
      <div className="mt-3 flex flex-wrap gap-3">
        <div className="flex items-center">
          <span className="w-3 h-3 rounded-full bg-[#FF6B6B] inline-block mr-1"></span>
          <span className="text-xs">容疑者</span>
        </div>
        <div className="flex items-center">
          <span className="w-3 h-3 rounded-full bg-[#4ECDC4] inline-block mr-1"></span>
          <span className="text-xs">証拠</span>
        </div>
        <div className="flex items-center">
          <span className="w-3 h-3 rounded-full bg-[#FFD166] inline-block mr-1"></span>
          <span className="text-xs">概念</span>
        </div>
        <div className="flex items-center">
          <span className="w-3 h-3 rounded-full bg-[#845EC2] inline-block mr-1"></span>
          <span className="text-xs">イベント</span>
        </div>
      </div>
    </div>
  );
};

export default RelationshipMap;