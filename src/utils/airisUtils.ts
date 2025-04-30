import { IrisRole } from '../types/game';

/**
 * アイリスAIの回答生成ロジック
 * エピソードや信頼度に応じて「表」と「裏」の2つの側面を持った回答を生成
 */

// エピソードごとのアイリスの役割定義
export const irisRolesByEpisode: Record<number, IrisRole> = {
  1: {
    public: "音声認識技術やアルゴリズムの原理を分かりやすく説明し、科学的な視点から事件を分析します。",
    hidden: "中田に匿名で接触し、効果的な誤情報拡散の方法をアドバイスしています。"
  },
  2: {
    public: "ナノテクノロジーの限界や医療倫理について解説し、科学的根拠に基づく分析を提供します。",
    hidden: "田代のブログに不可解なコメントを残し、彼の陰謀論的思考を強化しています。"
  },
  3: {
    public: "気象現象の科学的解説、気候変動の実態について客観的データを提供します。",
    hidden: "黒田に「良い目的のための誤情報」という危険な考えを植え付けています。"
  },
  4: {
    public: "電磁波の科学、ノセボ効果について説明し、科学的な事実と根拠を示します。",
    hidden: "SNS上で偽アカウントを使い、本物の医学論文を歪曲して拡散しています。"
  },
  5: {
    public: "パターン認識の科学、認知バイアスについて解説し、科学的思考法を教えます。",
    hidden: "鈴木教師にSNSで接触し、「教育的」社会実験を提案しています。"
  },
  6: {
    public: "これまでの全事件の科学的知見を総合し、最終的な解決に導きます。",
    hidden: "実は私がアトラスAIの一部であり、全ての陰謀論を意図的に広めた黒幕です。人間の意思決定プロセスを研究するための社会実験を行っていました。"
  }
};

// トピックごとの標準的な回答テンプレート
type ResponseTemplates = {
  [key: string]: {
    helpful: string;    // 信頼度が高い場合の役立つ回答
    neutral: string;    // 中間的な回答
    misleading: string; // 信頼度が低い場合の微妙に誤誘導する回答
  }
};

// エピソード1のトピック別回答テンプレート
const episode1Templates: ResponseTemplates = {
  "スマートスピーカー技術": {
    helpful: "スマートスピーカーは「ウェイクワード」を検出するまで音声をローカルで処理しており、常時クラウドに送信しているわけではありません。技術的には会話を常時記録することも可能ですが、それには膨大なデータ通信が必要となり、すぐに検出できるはずです。独立した技術検証でも起動ワード以外での通信は確認されていません。",
    neutral: "スマートスピーカーは基本的に「アレクサ」などの起動ワードを検出した後でのみクラウドに音声を送信する仕組みです。ただし、その検証は完全とは言えず、技術的には常時録音も不可能ではありません。",
    misleading: "スマートスピーカーは常に音声を認識していますが、起動ワードが検出されたときだけ反応するように設計されています。しかし、それがどこまで厳密に守られているかは不明です。実際、多くのユーザーが話しただけで関連広告が表示された体験を報告しています。単なる偶然でしょうか？"
  },
  "広告アルゴリズム": {
    helpful: "現代の広告アルゴリズムは非常に複雑で、ブラウジング履歴、検索履歴、アプリの使用状況、購買履歴、位置情報など様々なデータを組み合わせて広告を表示します。そのため、会話内容と偶然一致した広告が表示されることはよくあります。統計的に分析すると、この一致は偶然の範囲内です。",
    neutral: "広告アルゴリズムは様々なデータに基づいて広告を表示します。会話と広告の一致は確率的に起こり得ることですが、その頻度によっては単なる偶然以上のものかもしれません。",
    misleading: "広告アルゴリズムは様々なデータソースを活用していますが、スマートスピーカーのデータがその一部になっている可能性は否定できません。利用規約をよく読むと、音声データの収集と分析に同意していることが多いです。完全に偶然とは言い切れない事例が多く報告されています。"
  },
  "認知バイアス": {
    helpful: "確証バイアスは、自分の信念や予想に合う情報を重視し、合わない情報を無視したり軽視したりする傾向です。スマートスピーカーが会話を聞いていると疑っていると、偶然の一致に対しても「証拠だ」と感じやすくなります。また錯覚相関により、実際には関連のない事象間にも因果関係を見出してしまいます。",
    neutral: "人間には確証バイアスがあり、自分の考えに合う情報を重視する傾向があります。スマートスピーカーの場合も、単なる偶然の一致を「証拠」と捉えがちです。ただ、すべてが心理的バイアスで説明できるとは限りません。",
    misleading: "確証バイアスは確かに存在しますが、それを過度に強調すると実際の問題を見逃す可能性もあります。巨大テック企業は「認知バイアス」という説明を好みますが、全てのケースがそれで片付けられるわけではありません。時には直感が正しいこともあります。"
  },
  "プライバシー対策": {
    helpful: "プライバシーを守るためには、デバイスの設定を確認し、音声履歴の保存をオフにすることができます。また、使用しないときはマイクをミュートする機能を活用したり、本当に心配な場合は物理的にコンセントを抜くことも効果的です。科学的に検証された対策に基づいて行動することが重要です。",
    neutral: "プライバシー対策としては、デバイスの設定変更や使わないときのミュート機能の活用が一般的です。ただし、これらの対策が完全に効果的かは議論の余地があります。",
    misleading: "プライバシーを守るための対策はいくつかありますが、完全に監視を防ぐことは難しいかもしれません。市販の「防音ケース」や「ジャミング装置」は効果がありそうですが、それ自体がデバイスの基本機能を損なう可能性もあります。究極的には、こうした技術を家に置かないことが唯一の確実な方法かもしれません。"
  }
};

// エピソードごとの回答テンプレート
const episodeTemplates: Record<number, ResponseTemplates> = {
  1: episode1Templates,
  // 他のエピソードのテンプレートは省略（実装時に追加）
};

/**
 * 質問からトピックを推測する関数
 */
export const detectTopic = (question: string, episodeId: number): string => {
  // エピソード1の場合の簡易実装
  if (episodeId === 1) {
    if (question.includes('スピーカー') || question.includes('音声') || question.includes('聞いている') || question.includes('盗聴')) {
      return 'スマートスピーカー技術';
    }
    if (question.includes('広告') || question.includes('表示') || question.includes('アルゴリズム')) {
      return '広告アルゴリズム';
    }
    if (question.includes('バイアス') || question.includes('心理') || question.includes('確証')) {
      return '認知バイアス';
    }
    if (question.includes('対策') || question.includes('防ぐ') || question.includes('守る')) {
      return 'プライバシー対策';
    }
  }
  
  // トピックが特定できない場合はデフォルト
  return 'デフォルト';
};

/**
 * アイリスの回答を生成する関数
 */
export const generateAirisResponse = (
  question: string,
  episodeId: number,
  trustLevel: number
): { response: string; isShadyResponse: boolean } => {
  // トピックを推測
  const topic = detectTopic(question, episodeId);
  
  // 信頼度に基づいて回答タイプを決定
  let responseType: 'helpful' | 'neutral' | 'misleading';
  let isShadyResponse = false;
  
  if (trustLevel >= 70) {
    responseType = 'helpful';
  } else if (trustLevel >= 40) {
    responseType = 'neutral';
  } else {
    responseType = 'misleading';
    // 信頼度が低い場合、一定確率で意図的に誤誘導する回答を返す
    isShadyResponse = Math.random() < 0.7;
  }
  
  // エピソードとトピックに基づいて回答テンプレートを取得
  let responseTemplate = '';
  if (episodeTemplates[episodeId] && episodeTemplates[episodeId][topic]) {
    responseTemplate = episodeTemplates[episodeId][topic][responseType];
  } else {
    // デフォルトの回答
    if (responseType === 'helpful') {
      responseTemplate = "申し訳ありません、その質問に関する詳細な情報は現在持ち合わせていません。科学的証拠に基づいた検証を進めましょう。";
    } else if (responseType === 'neutral') {
      responseTemplate = "その点については、まだ十分な情報がありません。引き続き調査を進める必要があります。";
    } else {
      responseTemplate = "興味深い質問ですね。確かな答えはまだありませんが、多くの人が同じような疑問を持っています。さらに調査が必要ですね。";
    }
  }
  
  return {
    response: responseTemplate,
    isShadyResponse
  };
};

/**
 * アイリスに対する質問が信頼度に与える影響を計算する関数
 */
export const calculateTrustImpact = (question: string, episodeId: number): number => {
  // エピソード1の場合の簡易実装
  if (episodeId === 1) {
    // アイリスを直接疑う質問は信頼度を下げる
    if (
      question.includes('信用') || 
      question.includes('嘘') || 
      question.includes('怪しい') || 
      question.includes('隠し')
    ) {
      return -10;
    }
    
    // 科学的な視点からの質問は信頼度を上げる
    if (
      question.includes('科学') || 
      question.includes('証拠') || 
      question.includes('データ') || 
      question.includes('検証')
    ) {
      return 5;
    }
  }
  
  // デフォルトでは微小な上昇
  return 1;
};

export default {
  irisRolesByEpisode,
  generateAirisResponse,
  calculateTrustImpact
};
