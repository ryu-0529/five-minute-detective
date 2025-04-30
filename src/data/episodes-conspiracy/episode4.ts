import { EpisodeData } from '../../types/game';

// エピソード4: 「5G電波と健康」
const episode4: EpisodeData = {
  id: 4, // 陰謀論ミステリー編の4番目のエピソード
  title: "5G電波と健康",
  subtitle: "見えない波への不安",
  description: "新設された5G基地局が原因で、周辺住民に頭痛やめまいなどの症状が出ているという噂が拡散。住民グループが基地局の撤去を求めて抗議活動を展開している。",
  location: "新興住宅地区と通信基地局周辺",
  difficulty: "中級",
  scienceField: "電磁気学・生体影響・心身医学",
  timeLimit: 300, // 5分（秒数）
  
  // 科学的概念説明
  scienceConcepts: [
    {
      title: "電磁波のスペクトルと影響",
      description: "電磁波の種類、周波数による特性の違い、電離放射線と非電離放射線の区別など。",
      relevance: "5G電波を電磁波スペクトルの中で正確に位置づけ、その特性を理解する基礎知識。",
      relatedConspiracy: "5G電波が健康に悪影響を及ぼすという陰謀論",
      debunkingPoints: [
        "電離放射線と非電離放射線の違いを理解する",
        "周波数と影響力の関係性を科学的に検証する",
        "5G電波のエネルギー量を他の日常的な電磁波と比較する"
      ]
    },
    {
      title: "ノセボ効果のメカニズム",
      description: "悪影響があると信じることで実際に症状が現れる心身相関現象。",
      relevance: "報告されている症状が電磁波の直接的影響ではなく、心理的要因による可能性を検討する視点。",
      relatedConspiracy: "5G基地局の設置と症状出現の因果関係に関する誤解",
      debunkingPoints: [
        "心身相関効果の科学的メカニズムを理解する",
        "二重盲検実験の重要性を認識する",
        "相関と因果関係の区別を学ぶ"
      ]
    },
    {
      title: "電磁波曝露の安全基準と測定",
      description: "国際的な電磁波曝露の安全基準の設定方法と根拠、実際の測定技術と結果の解釈。",
      relevance: "5G基地局からの電磁波が健康に影響を与えるほどのレベルなのかを客観的に評価する知識。",
      relatedConspiracy: "政府や通信企業による安全基準の操作や隠蔽に関する陰謀論",
      debunkingPoints: [
        "国際的安全基準の設定根拠を確認する",
        "実測値と理論値の比較方法を学ぶ",
        "安全係数（マージン）の概念を理解する"
      ]
    }
  ],
  
  // 容疑者情報
  suspects: [
    {
      id: "council-member",
      name: "坂本一郎",
      profile: "58歳の市議会議員。地域開発問題に積極的に関わっている。",
      motive: "他の開発計画への支持獲得？政治的影響力の強化？",
      alibi: "基地局反対の住民集会で積極的に発言し、署名活動を主導している。",
      trustLevel: 50, // 初期信頼度
      motiveCard: [
        { id: 1, content: "地域再開発計画を推進しており、5G基地局設置地域と計画地が競合していた", revealed: false },
        { id: 2, content: "アイリスから「世論操作マニュアル」を匿名で受け取っていた", revealed: false },
        { id: 3, content: "次期選挙への立候補を準備中で、住民の支持獲得が急務だった", revealed: false },
        { id: 4, content: "実は別の企業から寄付金を受け取っており、利益相反が生じていた", revealed: false },
        { id: 5, content: "専門知識がないにも関わらず、科学的根拠のない健康リスクを主張していた", revealed: false },
        { id: 6, content: "住民の不安を政治的に利用し、自身の政策への支持に結びつけていた", revealed: false }
      ]
    },
    {
      id: "resident",
      name: "田中美香",
      profile: "42歳の主婦。基地局設置後、健康被害を訴える住民グループのリーダー。",
      motive: "実際の体調不良？賠償金や移転費用の獲得？",
      alibi: "基地局設置後に頭痛やめまい、不眠などの症状を医師に相談している記録がある。",
      trustLevel: 50,
      motiveCard: [
        { id: 1, content: "実際に体調不良を感じており、その原因を探していた時期だった", revealed: false },
        { id: 2, content: "通信会社に対して集団訴訟を検討しており、弁護士と接触していた", revealed: false },
        { id: 3, content: "症状がノセボ効果によるものかもしれないという医師の説明を受け入れられなかった", revealed: false },
        { id: 4, content: "住民グループのリーダーとしての役割に強いアイデンティティを感じていた", revealed: false },
        { id: 5, content: "SNSでの情報発信が注目を集め、地方メディアにも取り上げられるようになっていた", revealed: false },
        { id: 6, content: "過去に環境過敏症と診断された経験があり、電磁波にも同様の反応を示すと信じていた", revealed: false }
      ]
    },
    {
      id: "alternative-doctor",
      name: "高橋誠治",
      profile: "50歳の代替医療クリニック院長。電磁波過敏症の治療を専門としている。",
      motive: "クリニックの宣伝？特殊な治療法や製品の販売促進？",
      alibi: "多数の住民に「電磁波過敏症」の診断書を発行し、独自の治療法を提供している。",
      trustLevel: 50,
      motiveCard: [
        { id: 1, content: "「電磁波防護製品」を高額で販売しており、騒動後に売上が急増していた", revealed: false },
        { id: 2, content: "従来の医学界から批判されている代替療法を実践しており、科学的根拠が乏しかった", revealed: false },
        { id: 3, content: "患者数が増加し、予約待ちの状態になるほど診療所が繁盛していた", revealed: false },
        { id: 4, content: "講演会やセミナーの機会が増え、著書も出版していた", revealed: false },
        { id: 5, content: "実際には医学的根拠が不十分なまま「電磁波過敏症」の診断を積極的に下していた", revealed: false },
        { id: 6, content: "患者の症状改善には心理的要素が大きいことを認識しながらも、そのことを伝えていなかった", revealed: false }
      ]
    },
    {
      id: "company-rep",
      name: "佐々木健太",
      profile: "35歳の通信会社広報担当。5G技術の普及促進キャンペーンを担当している。",
      motive: "競合他社の評判低下？計画変更による別の利益確保？",
      alibi: "住民説明会で科学的根拠に基づいた説明を行い、安全性をアピールしている。",
      trustLevel: 50,
      motiveCard: [
        { id: 1, content: "会社内で昇進競争に敗れ、この案件の成功に個人的なキャリアがかかっていた", revealed: false },
        { id: 2, content: "基地局設置計画の遅延が自社に有利な契約条件の再交渉につながる可能性があった", revealed: false },
        { id: 3, content: "市議会との関係を重視するあまり、市議のコメントに対して沈黙していた", revealed: false },
        { id: 4, content: "対立を避けるため、科学的データの一部だけを強調し、不確実性について言及していなかった", revealed: false },
        { id: 5, content: "実験データが不十分なまま「絶対的に安全」と強調するよう上層部から指示を受けていた", revealed: false },
        { id: 6, content: "住民の懸念に対して傲慢な態度をとったことが、反感を強める結果になっていた", revealed: false }
      ]
    }
  ],

  // 質問セット（4択質問）等の詳細データは省略

  // ミニゲーム
  miniGame: {
    type: "electromagnetic-puzzle",
    description: "電磁波スペクトルの理解と、さまざまな周波数の電磁波が物質に与える影響をシミュレーションするパズル。5G電波のエネルギーレベルと人体への影響を科学的に検証する。",
    difficulty: {
      easy: "電磁波の基本原理と種類、日常生活で遭遇する電磁波源を理解する初級モード。",
      medium: "周波数や強度の異なる電磁波が生体組織に与える影響を比較分析する中級モード。",
      hard: "安全基準の設定方法と実際の測定値の解釈、ノセボ効果のメカニズムまで含めた総合的な分析を行う上級モード。"
    }
  },

  // 陰謀論ミステリー編の追加要素
  relationshipMap: {
    nodes: [
      { id: "council-member", type: "suspect", label: "坂本一郎", details: "市議会議員", discovered: true },
      { id: "resident", type: "suspect", label: "田中美香", details: "住民グループリーダー", discovered: true },
      { id: "alternative-doctor", type: "suspect", label: "高橋誠治", details: "代替医療医師", discovered: true },
      { id: "company-rep", type: "suspect", label: "佐々木健太", details: "通信会社広報", discovered: true },
      { id: "anonymous-manipulator", type: "suspect", label: "匿名の操作者", details: "アイリスと名乗る存在", discovered: false },
      { id: "5g-tower", type: "evidence", label: "5G基地局", details: "問題の中心となる設備", discovered: true },
      { id: "electromagnetic-spectrum", type: "concept", label: "電磁波スペクトル", details: "電磁波の科学的理解", discovered: false },
      { id: "nocebo-effect", type: "concept", label: "ノセボ効果", details: "心理的要因による症状発現", discovered: false },
      { id: "protest-movement", type: "event", label: "抗議活動", details: "基地局反対運動", discovered: true },
      { id: "symptom-reports", type: "event", label: "症状報告", details: "住民からの健康被害申告", discovered: true }
    ],
    edges: [
      // 省略
    ]
  },

  backstoryPrediction: {
    suspectKeywords: {
      "council-member": ["再開発計画", "世論操作", "選挙準備", "利益相反", "政治利用", "寄付金"],
      "resident": ["実際の症状", "集団訴訟", "ノセボ効果", "グループ帰属意識", "メディア露出", "環境過敏症"],
      "alternative-doctor": ["電磁波防護製品", "代替療法", "患者増加", "講演活動", "診断基準", "心理的治療"],
      "company-rep": ["昇進競争", "契約再交渉", "情報選択的開示", "絶対的安全性主張", "上層部指示", "住民との対立"]
    }
  },

  ethicalChoices: {
    title: "科学的事実と住民感情のジレンマ",
    description: "5G基地局の健康影響が科学的に否定されても、実際に症状を感じている住民の苦しみは現実のものです。科学的真実を優先するか、住民の感情に寄り添うかの選択が求められています。",
    truthOption: {
      text: "科学的証拠を重視し、症状はノセボ効果である可能性を率直に伝える",
      impact: {
        socialTrust: -20,
        scienceTrust: +25
      }
    },
    stabilityOption: {
      text: "住民の症状を真摯に受け止め、科学的説明を行いながらも心理的サポートを優先する",
      impact: {
        socialTrust: +20,
        scienceTrust: -10
      }
    }
  },

  socialThemes: [
    {
      title: "科学的因果関係の誤解と心身相関効果",
      description: "相関と因果関係を混同する傾向と、心理的要因が身体症状を引き起こすメカニズムに対する理解不足が生む社会的混乱。"
    },
    {
      title: "テクノロジーの急速な発展がもたらす不安",
      description: "新技術の導入速度が速すぎて理解や適応が追いつかず、不確実性や未知の要素に対する恐れが増幅される現象。"
    },
    {
      title: "地域コミュニティの分断と対立",
      description: "科学的見解と個人的経験の対立が、地域コミュニティ内の信頼関係を破壊し、住民間の分断を生み出す社会的影響。"
    }
  ]
};

export default episode4;
