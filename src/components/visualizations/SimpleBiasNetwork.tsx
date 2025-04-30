import React from 'react';

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

interface SimpleBiasNetworkProps {
  nodes: BiasNode[];
  links: BiasLink[];
  width?: number;
  height?: number;
}

const SimpleBiasNetwork: React.FC<SimpleBiasNetworkProps> = ({ 
  nodes, 
  links,
  width = 800,
  height = 600
}) => {
  // カテゴリーに基づく色のマッピング
  const categoryColors = {
    cognitive: '#4285F4', // 青
    social: '#EA4335',    // 赤
    memory: '#FBBC05',    // 黄
    probabilistic: '#34A853' // 緑
  };
  
  // 発見状態に基づく不透明度
  const getOpacity = (discovered: boolean) => discovered ? 1.0 : 0.3;
  
  // ノードの位置を計算（簡易的な円状配置）
  const nodePositions = nodes.map((node, index) => {
    const angle = (index / nodes.length) * 2 * Math.PI;
    const radius = height / 3;
    const x = width / 2 + radius * Math.cos(angle);
    const y = height / 2 + radius * Math.sin(angle);
    
    return {
      ...node,
      x,
      y
    };
  });
  
  // ノードIDから位置情報を取得するヘルパー関数
  const getNodeById = (id: string) => {
    return nodePositions.find(node => node.id === id);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-xl font-bold text-detective-primary mb-4">認知バイアスネットワーク</h3>
      <div className="overflow-auto">
        <svg 
          width={width}
          height={height}
          className="bg-gray-50 rounded-md"
          aria-label="認知バイアスのネットワーク図"
        >
          {/* リンクを描画 */}
          {links.map((link, index) => {
            const sourceNode = getNodeById(link.source);
            const targetNode = getNodeById(link.target);
            
            if (!sourceNode || !targetNode) return null;
            
            return (
              <line
                key={`link-${index}`}
                x1={sourceNode.x}
                y1={sourceNode.y}
                x2={targetNode.x}
                y2={targetNode.y}
                stroke="#999"
                strokeOpacity={getOpacity(link.discovered)}
                strokeWidth={Math.max(1, link.strength * 5)}
              />
            );
          })}
          
          {/* ノードを描画 */}
          {nodePositions.map((node) => (
            <g 
              key={node.id}
              transform={`translate(${node.x}, ${node.y})`}
            >
              <circle
                r={30}
                fill={(categoryColors as any)[node.category]}
                opacity={getOpacity(node.discovered)}
                stroke="#fff"
                strokeWidth={2}
              />
              <text
                dy=".35em"
                textAnchor="middle"
                fill="#fff"
                opacity={getOpacity(node.discovered)}
                style={{ pointerEvents: 'none', fontSize: '12px', fontWeight: 'bold' }}
              >
                {node.name}
              </text>
              <title>{node.description}</title>
            </g>
          ))}
        </svg>
      </div>
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
        {Object.entries(categoryColors).map(([category, color]) => (
          <div key={category} className="flex items-center">
            <div 
              className="w-4 h-4 rounded-full mr-2" 
              style={{ backgroundColor: color as string }}
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
    </div>
  );
};

export default SimpleBiasNetwork;
