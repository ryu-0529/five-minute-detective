import { EpisodeData } from '../../types/game';

// エピソード3: 「気象操作」
const episode3: EpisodeData = {
  id: 3, // 陰謀論ミステリー編の3番目のエピソード
  title: "気象操作",
  subtitle: "空に広がる不安の正体",
  description: "飛行機雲（ケムトレイル）が政府の秘密気象操作計画だという噂が広がる。近年の異常気象も人為的な気象操作の証拠だと主張する人々が増え、航空会社への抗議活動が激化。",
  location: "シティパーク周辺と気象観測所",
  difficulty: "中級",
  scienceField: "気象学・環境科学",
  timeLimit: 300, // 5分（秒数）
  
  // 科学的概念説明
  scienceConcepts: [
    {
      title: "飛行機雲の形成メカニズム",
      description: "高高度における水蒸気の凝結過程と飛行機エンジンの排気が及ぼす影響。",
      relevance: "飛行機雲の正体を科学的に説明し、ケムトレイル説の矛盾点を指摘する基礎知識。",
      relatedConspiracy: "飛行機雲が実は化学物質散布（ケムトレイル）だという陰謀論",
      debunkingPoints: [
        "航空機の高度と気温・湿度の関係を確認する",
        "水蒸気の凝結と結晶化のプロセスを理解する",
        "飛行機雲の持続時間と気象条件の相関を検証する"
      ]
    },
    {
      title: "気候変動と異常気象の関係",
      description: "地球温暖化による気候パターンの変化と極端な気象現象の増加についての科学的知見。",
      relevance: "近年の異常気象が人為的な気象操作ではなく、気候変動の結果である可能性を示す。",
      relatedConspiracy: "政府や秘密組織による人工的な気象操作・気象兵器説",
      debunkingPoints: [
        "長期的な気候データと短期的な気象現象を区別する",
        "気象パターン変化の科学的メカニズムを理解する",
        "自然変動と人為的影響の区別方法を学ぶ"
      ]
    },
    {
      title: "気象改変技術の現状と限界",
      description: "雲種、人工降雨など実在する気象改変技術の科学的原理と現在の技術的限界。",
      relevance: "実際に存在する気象改変技術と陰謀論で主張される技術の差異を理解する。",
      relatedConspiracy: "高度な気象操作技術の秘密開発と実験的使用",
      debunkingPoints: [
        "現存する気象改変技術の規模と効果を確認する",
        "大規模気象操作に必要なエネルギー量を計算する",
        "技術的・物理的限界を理解する"
      ]
    }
  ],
  
  // 容疑者情報
  suspects: [
    {
      id: "activist",
      name: "黒田真一 (環境活動家)",
      profile: "42歳で気候変動問題への注目を集めるために活動している。",
      motive: "環境問題への関心を高めるため？気候変動対策の緊急性を訴えるため？",
      alibi: "抗議活動の計画・実行に関わりながらも、科学的根拠については言及を避けている。",
      trustLevel: 50, // 初期信頼度
      motiveCard: [
        { id: 1, content: "環境活動家としての影響力が低下し、支持者や資金が減少していた", revealed: false },
        { id: 2, content: "「良い目的のための誤情報は許される」という考えを持っていた", revealed: false },
        { id: 3, content: "アイリスから匿名で「環境活動家向け心理操作ガイド」を受け取っていた", revealed: false },
        { id: 4, content: "気候変動の深刻さに実際に危機感を抱いており、行動を起こす必要性を感じていた", revealed: false },
        { id: 5, content: "SNSでケムトレイル写真を拡散し、自身の環境団体へのリンクを添付していた", revealed: false },
        { id: 6, content: "皮肉にも、この陰謀論が気候変動対策を遅らせていることを密かに懸念していた", revealed: false }
      ]
    },
    {
      id: "pilot",
      name: "青木雄一 (元パイロット)",
      profile: "55歳で現在は退職し、航空に関する講演活動を行っている。",
      motive: "注目を集め、講演依頼を増やすため？航空業界への不満？",
      alibi: "講演会で飛行機雲について専門知識を説明しながらも、陰謀論的解釈の余地を残している。",
      trustLevel: 50,
      motiveCard: [
        { id: 1, content: "航空会社との労働争議で敗れ、強制退職に追い込まれた過去がある", revealed: false },
        { id: 2, content: "講演やセミナーの予約が急増し、収入が大幅に増加していた", revealed: false },
        { id: 3, content: "専門知識を利用して噂を信頼性のあるものに見せる技術を持っていた", revealed: false },
        { id: 4, content: "元同僚のパイロットたちが抗議活動のターゲットになることに罪悪感を持っていた", revealed: false },
        { id: 5, content: "「空の真実」というメルマガを匿名で運営し、有料会員を集めていた", revealed: false },
        { id: 6, content: "実は気象観測プログラムに参加経験があり、その知識を歪めて伝えていた", revealed: false }
      ]
    },
    {
      id: "professor",
      name: "鈴木広子 (気象学教授)",
      profile: "50歳で気候変動研究の権威だが、一般大衆への発信は少ない。",
      motive: "研究資金獲得のため？アウトリーチ活動の一環？",
      alibi: "気象操作に関する技術的可能性について学術的に言及しているが、陰謀論については否定も肯定もしていない。",
      trustLevel: 50,
      motiveCard: [
        { id: 1, content: "研究費削減の危機に直面し、注目を集める新たな方法を模索していた", revealed: false },
        { id: 2, content: "実際に小規模な気象改変実験を行っていたことがあり、その知識が漏洩していた", revealed: false },
        { id: 3, content: "アイリスからの匿名メッセージで「公衆の気候変動への関心を高める方法」を受信していた", revealed: false },
        { id: 4, content: "大衆とのコミュニケーションが苦手で、説明が誤解を招きやすかった", revealed: false },
        { id: 5, content: "メディアからの取材が急増し、学術的説明が切り取られて報道されていた", revealed: false },
        { id: 6, content: "政府の気象研究プログラムに関わっていた経歴が、陰謀論者によって誤用されていた", revealed: false }
      ]
    },
    {
      id: "reporter",
      name: "西村達也 (フリージャーナリスト)",
      profile: "38歳でセンセーショナルな記事で知られるウェブメディアに所属。",
      motive: "記事のバズりを狙って？視聴率や読者数の増加？",
      alibi: "噂を「市民の声」として中立的に報道しているが、科学的検証は不十分。",
      trustLevel: 50,
      motiveCard: [
        { id: 1, content: "ケムトレイル関連記事がウェブサイトのアクセス数を大幅に増加させていた", revealed: false },
        { id: 2, content: "「人々が望む真実」を提供するというメディア戦略を採用していた", revealed: false },
        { id: 3, content: "実は新興メディア企業の立ち上げを計画しており、知名度向上を図っていた", revealed: false },
        { id: 4, content: "匿名ソースからの情報提供を受けていたが、事実確認が不十分だった", revealed: false },
        { id: 5, content: "「両論併記」というジャーナリズムの原則を盾に、科学的根拠の薄い主張も掲載していた", revealed: false },
        { id: 6, content: "広告収入と記事内容の相関を分析し、戦略的に陰謀論的コンテンツを配信していた", revealed: false }
      ]
    }
  ],

  // 質問セット（4択質問）等の詳細データは省略

  // ミニゲーム
  miniGame: {
    type: "weather-simulation",
    description: "飛行機雲の形成過程と気象条件の関係をシミュレーションするパズル。大気の温度、湿度、高度などの条件を調整しながら飛行機雲の形成メカニズムを理解する。",
    difficulty: {
      easy: "基本的な雲の形成原理と飛行機雲の発生条件を理解する初級モード。",
      medium: "様々な気象条件下での飛行機雲の持続時間や形状変化をシミュレーションする中級モード。",
      hard: "実際の気象データに基づいて観測された飛行機雲のパターンを再現し、気候変動との関連を分析する上級モード。"
    }
  },

  // 陰謀論ミステリー編の追加要素
  relationshipMap: {
    nodes: [
      { id: "activist", type: "suspect", label: "黒田真一", details: "環境活動家", discovered: true },
      { id: "pilot", type: "suspect", label: "青木雄一", details: "元パイロット", discovered: true },
      { id: "professor", type: "suspect", label: "鈴木広子", details: "気象学教授", discovered: true },
      { id: "reporter", type: "suspect", label: "西村達也", details: "フリージャーナリスト", discovered: true },
      { id: "anonymous-guide", type: "suspect", label: "匿名ガイド", details: "アイリスと名乗る存在", discovered: false },
      { id: "contrails", type: "evidence", label: "飛行機雲", details: "噂の中心となる現象", discovered: true },
      { id: "climate-change", type: "concept", label: "気候変動", details: "グローバルな環境問題", discovered: false },
      { id: "weather-modification", type: "concept", label: "気象改変技術", details: "現在の科学技術の限界", discovered: false },
      { id: "protest", type: "event", label: "抗議活動", details: "航空会社への抗議運動", discovered: true },
      { id: "media-coverage", type: "event", label: "メディア報道", details: "噂を増幅させる報道の連鎖", discovered: true }
    ],
    edges: [
      // 省略
    ]
  },

  backstoryPrediction: {
    suspectKeywords: {
      "activist": ["影響力低下", "誤情報拡散", "心理操作ガイド", "気候危機感", "SNS活動", "支持者獲得"],
      "pilot": ["強制退職", "収入増加", "専門知識悪用", "メルマガ運営", "講演活動", "元同僚罪悪感"],
      "professor": ["研究費削減", "気象改変実験", "アイリスメッセージ", "コミュニケーション不足", "政府プログラム", "メディア誤用"],
      "reporter": ["アクセス数増加", "メディア戦略", "両論併記主義", "広告収入", "匿名ソース", "新興メディア"]
    }
  },

  ethicalChoices: {
    title: "環境活動と科学的誠実さのジレンマ",
    description: "環境問題への注目を集めるためには効果的だが科学的に不正確な主張を広めることの是非について判断を迫られる状況。",
    truthOption: {
      text: "科学的事実のみに基づいた情報発信を徹底し、短期的には注目度が下がっても長期的な信頼性を重視する",
      impact: {
        socialTrust: +5,
        scienceTrust: +20
      }
    },
    stabilityOption: {
      text: "科学的厳密さを多少犠牲にしても、より多くの人々に環境問題への関心を持ってもらうための戦略的コミュニケーションを行う",
      impact: {
        socialTrust: +15,
        scienceTrust: -15
      }
    }
  },

  socialThemes: [
    {
      title: "気候変動の政治化",
      description: "科学的事実である気候変動問題が、政治的・イデオロギー的対立の材料となり、事実よりも信念や立場で情報が判断される社会現象。"
    },
    {
      title: "複雑な問題に対する単純な答えを求める心理",
      description: "気候変動のような複雑で多面的な問題に対して、簡潔で分かりやすい（ただし誤った）説明が広く受け入れられやすい人間心理。"
    },
    {
      title: "国家と企業の結びつきへの不信感",
      description: "政府機関や大企業に対する不信感が、陰謀論的思考を促進し、科学的コンセンサスよりも「隠された真実」を求めさせる社会背景。"
    }
  ]
};

export default episode3;
