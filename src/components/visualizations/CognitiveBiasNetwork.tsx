import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { episodeBiases } from '../../data/cognitiveBiases';

export interface BiasNode {
  id: string;
  name: string;
  description: string;
  example?: string; // 具体的な例
  category: 'cognitive' | 'social' | 'memory' | 'probabilistic';
  discovered: boolean;
}

export interface BiasLink {
  source: string;
  target: string;
  strength: number; // 関連の強さ（0～1）
  description: string;
  discovered: boolean;
}

interface CognitiveBiasNetworkProps {
  nodes: BiasNode[];
  links: BiasLink[];
  width?: number;
  height?: number;
}

const CognitiveBiasNetwork: React.FC<CognitiveBiasNetworkProps> = ({ 
  nodes, 
  links,
  width = 800,
  height = 600
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [tooltip, setTooltip] = useState<{visible: boolean, content: string, x: number, y: number, nodeId: string}>({visible: false, content: "", x: 0, y: 0, nodeId: ""});
  
  // カテゴリーに基づく色のマッピング
  const categoryColors = {
    cognitive: '#4285F4', // 青
    social: '#EA4335',    // 赤
    memory: '#FBBC05',    // 黄
    probabilistic: '#34A853' // 緑
  };
  
  // 発見状態に基づく不透明度
  const getOpacity = (discovered: boolean) => discovered ? 1.0 : 0.3;
  
  useEffect(() => {
    if (!svgRef.current) return;
    
    // SVG要素をクリア
    d3.select(svgRef.current).selectAll('*').remove();
    
    // SVG要素を作成
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);
    
    // シミュレーションの設定
    const simulation = d3.forceSimulation()
      .force('link', d3.forceLink().id((d: any) => d.id).distance(80)) // 距離を短くする
      .force('charge', d3.forceManyBody().strength(-200)) // やや強さを下げる
      .force('center', d3.forceCenter(0, 0))
      .force('collision', d3.forceCollide().radius(30));
    
    // リンクの描画
    const link = svg.append('g')
      .selectAll('line')
      .data(links)
      .enter()
      .append('line')
      .attr('stroke', '#999')
      .attr('stroke-opacity', d => getOpacity(d.discovered))
      .attr('stroke-width', d => Math.max(0.5, d.strength * 3));
    
    // ノードの描画
    const nodeGroup = svg.append('g')
      .selectAll('.node')
      .data(nodes)
      .enter()
      .append('g')
      .attr('class', 'node')
      .call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended))
      .on('mouseover', (event, d) => {
        // ツールチップのコンテンツと位置を設定
        // 発見済みのバイアスのみ詳細情報を表示
        let tooltipContent;
        
        if (d.discovered) {
          // 発見済みの場合は詳細情報を表示
          tooltipContent = `<p class="mb-2 font-bold">${d.name}</p>
                           <p class="mb-2">${d.description}</p>
                           ${d.example ? `<p class="text-sm">${d.example}</p>` : ''}`;
        } else {
          // 未発見の場合は関連エピソード情報を表示
          // どのエピソードにこのバイアスが含まれるかを探す
          const relatedEpisodes = Object.entries(episodeBiases)
            .filter(([_, biases]) => biases.includes(d.id))
            .map(([episodeName]) => episodeName);
            
          tooltipContent = `<p class="mb-2 font-bold">${d.name}</p>
                           <p class="text-amber-300">🔒 このバイアスはまだ発見されていません</p>`;
                           
          if (relatedEpisodes.length > 0) {
            tooltipContent += `<p class="text-xs mt-2">関連エピソード:</p>
                               <ul class="text-xs list-disc pl-4 mt-1">`;
            relatedEpisodes.forEach(episode => {
              tooltipContent += `<li>「${episode}」</li>`;
            });
            tooltipContent += `</ul>
                              <p class="text-xs mt-2">これらのエピソードを解決して詳細を解放しましょう</p>`;
          } else {
            tooltipContent += `<p class="text-xs mt-2">関連するエピソードを解決して詳細を解放しましょう</p>`;
          }
        }
        
        setTooltip({
          visible: true,
          content: tooltipContent,
          x: event.pageX,
          y: event.pageY,
          nodeId: d.id
        });
      })
      .on('mousemove', (event) => {
        // マウスの動きに合わせてツールチップを移動
        setTooltip(prev => ({
          ...prev,
          x: event.pageX,
          y: event.pageY
        }));
      })
      .on('mouseout', () => {
        // マウスがノードから離れたらツールチップを非表示に
        setTooltip(prev => ({ ...prev, visible: false, nodeId: "" }));
      });
    
      // ノードの円を描画
      nodeGroup.append('circle')
        .attr('r', d => tooltip.nodeId === d.id ? 20 : 15)  // 選択されたノードは大きく
        .attr('fill', d => (categoryColors as any)[d.category])
        .attr('opacity', d => tooltip.nodeId === d.id ? 1.0 : getOpacity(d.discovered)) // 選択されたノードは完全に不透明
        .attr('stroke', d => tooltip.nodeId === d.id ? '#FFD700' : '#fff') // 選択されたノードは金色の枠
        .attr('stroke-width', d => tooltip.nodeId === d.id ? 2 : 1); // 選択されたノードは太い枠
    
    // テキストの背景を描画
    nodeGroup.append('rect')
      .attr('x', -30)
      .attr('y', '1.5em')
      .attr('width', 60)
      .attr('height', 16)
      .attr('rx', 3)
      .attr('fill', '#ffffff')
      .attr('opacity', d => getOpacity(d.discovered) * 0.7);
    
    // ノードのテキストを描画
    nodeGroup.append('text')
      .attr('dy', '2.5em') // 円の外側下部に表示
      .attr('text-anchor', 'middle')
      .attr('fill', '#000') // テキスト色を黒に
      .attr('opacity', d => getOpacity(d.discovered))
      .style('pointer-events', 'none')
      .style('font-size', '11px')
      .style('font-weight', 'bold')
      .text(d => d.name);
    
    // シミュレーションの更新関数
    simulation.nodes(nodes).on('tick', ticked);
    (simulation.force('link') as d3.ForceLink<any, any>).links(links);
    
    // 位置の更新関数
    function ticked() {
      link
        .attr('x1', d => (d.source as any).x)
        .attr('y1', d => (d.source as any).y)
        .attr('x2', d => (d.target as any).x)
        .attr('y2', d => (d.target as any).y);
      
      nodeGroup.attr('transform', d => `translate(${d.x}, ${d.y})`);
    }
    
    // ドラッグ関連の関数
    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }
    
    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }
    
    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }
    
    // クリーンアップ関数
    return () => {
      simulation.stop();
    };
  }, [nodes, links, width, height]);
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-md relative">
      <h3 className="text-xl font-bold text-detective-primary mb-4">認知バイアスネットワーク</h3>
      <div className="overflow-auto">
        <svg 
          ref={svgRef} 
          className="bg-gray-50 rounded-md"
          aria-label="認知バイアスのネットワーク図"
        />
      </div>
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
        {Object.entries(categoryColors).map(([category, color]) => (
          <div key={category} className="flex items-center">
            <div 
              className="w-4 h-4 rounded-full mr-2" 
              style={{ backgroundColor: color }}
            />
            <span className="text-sm">
              {category === 'cognitive' && '認知バイアス'}
              {category === 'social' && '社会的バイアス'}
              {category === 'memory' && '記憶バイアス'}
              {category === 'probabilistic' && '確率バイアス'}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <p className="text-sm text-gray-600">
          <span className="font-bold">操作方法:</span> ノードをドラッグして動かすことができます。
          ノードにカーソルを合わせると詳細な説明が表示されます。
          色の薄いノードとリンクは、まだ発見されていないバイアスや関連性を表しています。
        </p>
      </div>
      
      {/* カスタムツールチップ */}
      {tooltip.visible && (
        <div 
          className="fixed z-50 p-4 rounded-lg shadow-lg max-w-md" 
          style={{ 
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: nodes.find(n => n.id === tooltip.nodeId)?.discovered 
              ? 'rgba(30, 41, 59, 0.95)' // 発見済みの場合は濃い色
              : 'rgba(30, 41, 59, 0.8)', // 未発見の場合はやや薄い色
            color: 'white',
            pointerEvents: 'none',
            backdropFilter: 'blur(4px)',
            border: nodes.find(n => n.id === tooltip.nodeId)?.discovered
              ? '1px solid rgba(255, 255, 255, 0.4)' // 発見済みの場合はよりはっきりとした枠線
              : '1px solid rgba(255, 215, 0, 0.4)', // 未発見の場合は黄色の枠線
          }}
        >
          <div dangerouslySetInnerHTML={{ __html: tooltip.content }} />
          {!nodes.find(n => n.id === tooltip.nodeId)?.discovered && (
            <div 
              className="absolute -top-2 -right-2 w-6 h-6 flex items-center justify-center rounded-full" 
              style={{ backgroundColor: '#FFD700', color: '#000' }}
            >
              <span className="text-xs font-bold">🔒</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CognitiveBiasNetwork;
