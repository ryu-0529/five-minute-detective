import React from 'react';
import { SocialTheme } from '../../types/game';

interface SocialThemeDisplayProps {
  themes: SocialTheme[];
}

/**
 * 社会風刺テーマ表示コンポーネント
 * 陰謀論ミステリー編の各エピソードに含まれる社会風刺テーマを表示する
 * プレイヤーに批判的思考を促すヒントとして機能する
 */
const SocialThemeDisplay: React.FC<SocialThemeDisplayProps> = ({ themes }) => {
  if (!themes || themes.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <h3 className="font-detective text-lg text-detective-dark font-bold mb-3">
        社会風刺テーマ
      </h3>
      
      <div className="space-y-3">
        {themes.map((theme, index) => (
          <div key={index} className="p-3 bg-detective-light/30 rounded-md">
            <h4 className="font-bold text-detective-dark text-sm mb-1">
              {theme.title}
            </h4>
            <p className="text-sm text-gray-700">
              {theme.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SocialThemeDisplay;
