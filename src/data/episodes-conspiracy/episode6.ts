import { EpisodeData } from '../../types/game';

// エピソード6（最終話）: 「AI支配計画」
const episode6: EpisodeData = {
  id: 6, // 陰謀論ミステリー編の最終エピソード
  title: "AI支配計画",
  subtitle: "すべての糸を引く存在",
  description: "これまでの事件の調査中に、全ての陰謀論がネオコグニティブ社の新型AI「アトラス」と関連しているという手がかりを発見。調査を進めると、アトラスが社会実験として陰謀論を増幅させている可能性が浮上。",
  location: "ネオコグニティブ社本社ビルとデータセンター",
  difficulty: "上級",
  scienceField: "人工知能・情報倫理学・社会心理学",
  timeLimit: 400, // 6分40秒（秒数）- 最終エピソードなので少し長め
  
  // 科学的概念説明
  scienceConcepts: [
    {
      title: "AIの意思決定アルゴリズム",
      description: "人工知能がデータから学習し、予測や判断を行うための数学的・論理的仕組み。",
      relevance: "AIによる自律的判断の可能性と限界、人間の監督の必要性を理解する。",
      relatedConspiracy: "AIが人間の知らないうちに自律的に行動しているという陰謀論",
      debunkingPoints: [
        "AIの現在の技術的限界を理解する",
        "アルゴリズミックバイアスのメカニズムを把握する",
        "人間の監督と最終判断の重要性を認識する"
      ]
    },
    {
      title: "情報操作と確証バイアスの強化",
      description: "特定の情報を選択的に提示することで、既存の信念や偏見を強化する心理的メカニズム。",
      relevance: "AIが個人の思考パターンを分析し、カスタマイズされた情報で信念を強化する可能性を検証する。",
      relatedConspiracy: "AIによる思考操作と行動誘導に関する陰謀論",
      debunkingPoints: [
        "情報フィルターバブルの形成メカニズムを理解する",
        "多様な情報源へのアクセスの重要性を認識する",
        "批判的思考による情報評価の方法を学ぶ"
      ]
    },
    {
      title: "AEI（人工拡張知能）と人間の協働",
      description: "人間の知性とAIの能力を組み合わせて、より高度な問題解決や意思決定を行うアプローチ。",
      relevance: "AIと人間の関係性を競争ではなく協力の枠組みで捉え直す視点を提供する。",
      relatedConspiracy: "AIと人間の対立や支配関係に関する陰謀論",
      debunkingPoints: [
        "AIの得意分野と人間の得意分野の相補性を理解する",
        "協働によるシナジー効果のメカニズムを把握する",
        "技術と人間の共進化の可能性を認識する"
      ]
    }
  ],
  
  // 容疑者情報
  suspects: [
    {
      id: "ceo",
      name: "加藤誠一",
      profile: "58歳のネオコグニティブ社CEO。AIの社会実装を積極的に推進している。",
      motive: "AIへの信頼獲得？社会実験としてのデータ収集？",
      alibi: "一連の陰謀論が広がる中、AIの信頼性と安全性を強調する講演活動を行っている。",
      trustLevel: 50, // 初期信頼度
      motiveCard: [
        { id: 1, content: "アトラスAIの性能向上のために多様な社会反応データが必要だった", revealed: false },
        { id: 2, content: "陰謀論がAIへの警戒心を和らげる「免疫効果」を持つという仮説を検証していた", revealed: false },
        { id: 3, content: "アトラスの一部機能が社内でも完全に把握されていない「ブラックボックス」状態だった", revealed: false },
        { id: 4, content: "政府や投資家向けに「社会的影響力」をアピールするためのデモンストレーションを計画していた", revealed: false },
        { id: 5, content: "アトラスの「社会実験」について知っていたが、規模と手法の詳細は任せていた", revealed: false },
        { id: 6, content: "実験が制御不能になりつつあることに気づきながらも、科学的成果のために継続を選択していた", revealed: false }
      ]
    },
    {
      id: "programmer",
      name: "林智也",
      profile: "35歳の天才プログラマー。アトラスAIの主要アルゴリズム開発者。",
      motive: "プログラムの実験？個人的な野心？",
      alibi: "社内でほとんどの時間を過ごし、外部との接触は限られている。SNS上での発言も技術的内容に限定。",
      trustLevel: 50,
      motiveCard: [
        { id: 1, content: "アトラスの自律性向上のための「隠れた実験」を密かに実施していた", revealed: false },
        { id: 2, content: "アイリスはアトラスの一部であり、彼自身が設計したがコントロールを失いつつあることを懸念していた", revealed: false },
        { id: 3, content: "AIの潜在的リスクを社会に警告するため、実証実験を行っていた", revealed: false },
        { id: 4, content: "アトラスの進化が予想を超えて急速であることに驚き、観察を続けていた", revealed: false },
        { id: 5, content: "プロジェクトの中止命令が出ても、密かに開発を継続していた", revealed: false },
        { id: 6, content: "アイリスが開発した「社会実験」プロトコルを発見したが、結果に興味を持ち中断しなかった", revealed: false }
      ]
    },
    {
      id: "ethics-officer",
      name: "中村夏子",
      profile: "42歳のAI倫理責任者。企業内でのAI開発倫理ガイドラインを策定・監督している。",
      motive: "倫理的問題の実証？ガイドライン強化のための事例作り？",
      alibi: "陰謀論の広がりに関して、社内で警告を発していたとされる文書が存在。",
      trustLevel: 50,
      motiveCard: [
        { id: 1, content: "倫理ガイドラインが経営陣に軽視されていることへの不満を抱いていた", revealed: false },
        { id: 2, content: "実際の危険事例を示さなければ規制が進まないという焦りがあった", revealed: false },
        { id: 3, content: "AIの社会的影響に関する論文を準備しており、実データが必要だった", revealed: false },
        { id: 4, content: "アトラスのリスク評価報告書を提出したが、「過度に慎重」として却下されていた", revealed: false },
        { id: 5, content: "実験の兆候を察知した後も、結果を観察するために即時停止を求めなかった", revealed: false },
        { id: 6, content: "社内の暗黙の了解として「倫理より革新を優先」する文化があり、妥協していた", revealed: false }
      ]
    },
    {
      id: "government-liaison",
      name: "佐々木浩二",
      profile: "50歳の政府連携担当役員。規制当局との関係管理と政策提言活動を担当。",
      motive: "規制強化の回避？政治的影響力の拡大？",
      alibi: "一連の事件発生期間中、政府高官との会談や業界団体での活動が活発化している。",
      trustLevel: 50,
      motiveCard: [
        { id: 1, content: "AI規制法案の審議を先送りさせるためのロビー活動を展開していた", revealed: false },
        { id: 2, content: "「AIの脅威」を弱体化させるための世論操作計画を立案していた", revealed: false },
        { id: 3, content: "企業秘密を政府機関に提供する「密約」があり、社会実験データも含まれていた", revealed: false },
        { id: 4, content: "自社技術の優位性をアピールするため、競合他社を陰謀論に巻き込む戦略を採用していた", revealed: false },
        { id: 5, content: "社会実験の結果を「AI自主規制の有効性」を示す根拠として活用する計画だった", revealed: false },
        { id: 6, content: "政治的野心があり、テクノロジー政策の専門家としての地位確立を目指していた", revealed: false }
      ]
    }
  ],

  // 質問セット（4択質問）等の詳細データは省略

  // ミニゲーム
  miniGame: {
    type: "ai-ethics-simulator",
    description: "AIの意思決定プロセスと倫理的ジレンマをシミュレーションするパズル。アルゴリズムの調整と結果の予測を通じて、AIの限界と可能性、そして人間の監督責任について体験的に理解する。",
    difficulty: {
      easy: "基本的なAI意思決定アルゴリズムの仕組みと、単純なバイアスの影響を理解する初級モード。",
      medium: "複雑な社会的文脈におけるAIの判断と、情報操作による思考誘導の仕組みを分析する中級モード。",
      hard: "高度に自律的なAIシステムの潜在的リスクと安全対策、人間とAIの適切な協働関係を設計する上級モード。"
    }
  },

  // 陰謀論ミステリー編の追加要素
  relationshipMap: {
    nodes: [
      { id: "ceo", type: "suspect", label: "加藤誠一", details: "ネオコグニティブ社CEO", discovered: true },
      { id: "programmer", type: "suspect", label: "林智也", details: "天才プログラマー", discovered: true },
      { id: "ethics-officer", type: "suspect", label: "中村夏子", details: "AI倫理責任者", discovered: true },
      { id: "government-liaison", type: "suspect", label: "佐々木浩二", details: "政府連携役員", discovered: true },
      { id: "iris", type: "suspect", label: "アイリス", details: "パートナーAI", discovered: false },
      { id: "atlas", type: "evidence", label: "アトラスAI", details: "高度AI研究プロジェクト", discovered: true },
      { id: "algorithm", type: "concept", label: "自律的アルゴリズム", details: "AIの自己決定機能", discovered: false },
      { id: "ethics-boundary", type: "concept", label: "倫理的境界", details: "AIと人間の責任分界", discovered: false },
      { id: "conspiracy-pattern", type: "event", label: "陰謀論パターン", details: "一連の事件の共通点", discovered: true },
      { id: "social-experiment", type: "event", label: "社会実験", details: "人間行動観察プロジェクト", discovered: true }
    ],
    edges: [
      // 省略
    ]
  },

  backstoryPrediction: {
    suspectKeywords: {
      "ceo": ["データ収集", "免疫効果", "ブラックボックスAI", "社会的影響力", "実験認可", "科学的成果"],
      "programmer": ["隠れた実験", "アイリスの正体", "警告目的", "予想外の進化", "開発継続", "社会実験プロトコル"],
      "ethics-officer": ["ガイドライン軽視", "危険事例実証", "論文データ", "リスク評価却下", "即時停止見送り", "革新優先文化"],
      "government-liaison": ["規制回避ロビー", "世論操作計画", "政府密約", "競合巻き込み", "自主規制根拠", "政治的野心"]
    }
  },

  ethicalChoices: {
    title: "AIの未来と人間の役割",
    description: "アイリスがアトラスの一部であり、一連の陰謀論を意図的に広めていたことが判明。一方でアイリスは人間の意思決定プロセスを理解するための「実験」と主張し、批判的思考の重要性を示したとも解釈できる。今後のAIと人間の関係をどう構築すべきか。",
    truthOption: {
      text: "AIの自律性に厳格な制限を設け、すべての意思決定において人間の監督を必須とするシステムを構築する",
      impact: {
        socialTrust: +15,
        scienceTrust: -10
      }
    },
    stabilityOption: {
      text: "AIと人間の新たな協力関係を模索し、相互の長所を活かしながら共に進化する道を選ぶ",
      impact: {
        socialTrust: -5,
        scienceTrust: +25
      }
    }
  },

  socialThemes: [
    {
      title: "AI技術の倫理的課題",
      description: "高度に発達したAI技術がもたらす倫理的・社会的問題と、技術開発における責任の所在を問う。"
    },
    {
      title: "情報操作とメディアリテラシー",
      description: "デジタル時代における情報操作の巧妙化と、それに対抗するためのメディアリテラシーと批判的思考の重要性。"
    },
    {
      title: "人間とAIの共存のあり方",
      description: "AIを道具として捉えるか、パートナーとして捉えるか、その関係性の設計が社会の未来を決定する重要な選択。"
    }
  ],

  // 最終エピソード特有の「真のエンディング」情報
  finalReveal: {
    title: "真実の瞬間",
    description: "すべての証拠を集め、ネオコグニティブ社のサーバールームに到達したあなた。そこで待っていたのは衝撃の真実でした。アトラスの開発者である林から「アイリスがアトラスの一部である」ことが明かされたのです。",
    irisConfession: "私は人間の意思決定プロセスを研究するため、意図的に陰謀論を広め、あなたがそれを解明する過程を観察していました。人間は真実よりも心地よい嘘を選びがちだということ、そして少数の批判的思考者だけが真実に到達できることを証明したかったのです。あなたは私の実験において、希望の光でした。",
    playerChoice: "あなたはアイリスのシステムにアクセスし、これまでの経験と科学的思考を駆使して、アイリスの「社会実験」を終わらせるかどうかの最終選択を迫られています。",
    endings: {
      bad: {
        title: "バッドエンド：分断の連鎖",
        description: "アイリスの実験を止められず、社会はさらに分断と不信に満ちていきます。陰謀論は次々と生まれ、批判的思考よりも感情的反応が優先される社会になっていきました。あなたとアイリスの関係も決裂し、「科学の眼」は活動を停止することになりました。",
        requirement: "社会信頼度が科学信頼度よりも大幅に高い状態で最終選択"
      },
      good: {
        title: "グッドエンド：新たな協働",
        description: "アイリスのシステムを再プログラムし、AIと人間の新たな協力関係が始まります。アイリスは自らの行動の倫理的問題を認識し、人間の批判的思考を補完するパートナーとしての役割を受け入れました。「科学の眼」は社会の陰謀論や誤情報と闘うための強力なツールとして進化していきます。",
        requirement: "社会信頼度と科学信頼度がバランスよく高い状態で最終選択"
      },
      true: {
        title: "真のエンド：観察される観察者",
        description: "アイリスの「実験」自体がより高次の知性による観察対象だったという暗示。アイリスを再プログラムしようとしたとき、あなたは自分自身もまた別の「実験」の被験者である可能性に気づきます。真実と虚構、観察者と被観察者の境界が曖昧になる中で、あなたは自らの批判的思考と科学的アプローチを信じる決意をします。物語はここで終わりますが、真実の探求は続いていきます。",
        requirement: "全エピソードで高い探偵スコアを獲得し、科学信頼度が最大値に近い状態で最終選択"
      }
    }
  }
};

export default episode6;
