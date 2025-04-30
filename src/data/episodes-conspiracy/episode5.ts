import { EpisodeData } from '../../types/game';

// エピソード5: 「秘密結社の暗号」
const episode5: EpisodeData = {
  id: 5, // 陰謀論ミステリー編の5番目のエピソード
  title: "秘密結社の暗号",
  subtitle: "街に刻まれた謎のパターン",
  description: "市内の公共施設や建造物に描かれた奇妙な記号が、世界を支配する秘密結社のメッセージだという噂が広がる。市民の間で不安が高まり、記号が見つかる場所を避ける人も出始めている。",
  location: "都市中心部と歴史地区",
  difficulty: "上級",
  scienceField: "認知心理学・記号学・都市工学",
  timeLimit: 300, // 5分（秒数）
  
  // 科学的概念説明
  scienceConcepts: [
    {
      title: "パターン認識バイアス",
      description: "人間の脳が偶然の中にパターンや意味を見出してしまう認知傾向。特に曖昧な情報や不安な状況下で顕著になる。",
      relevance: "市内の様々な記号を意図的なメッセージとして解釈してしまう心理メカニズムを説明する。",
      relatedConspiracy: "無関係な記号や模様に隠されたメッセージを見出す陰謀論",
      debunkingPoints: [
        "偶然発生するパターンの確率を理解する",
        "人間の脳が持つパターン認識の特性を認識する",
        "情報の少なさがパターン誤認を促進する仕組みを把握する"
      ]
    },
    {
      title: "都市インフラ記号システム",
      description: "公共工事、地下設備、都市計画などで使用される標準的なマーキングや記号の体系。",
      relevance: "「謎の記号」の多くが実は一般的な都市インフラのマーキングである可能性を検証する。",
      relatedConspiracy: "インフラ記号を秘密結社のメッセージと誤解する陰謀論",
      debunkingPoints: [
        "都市インフラ記号の標準化された意味を確認する",
        "実用目的で設計された記号の特徴を理解する",
        "世界各地で使用される共通記号システムを認識する"
      ]
    },
    {
      title: "集合記憶と都市伝説の形成",
      description: "共有された情報が社会的相互作用を通じて変容し、集団としての「記憶」や「物語」が形成されるプロセス。",
      relevance: "単純な観察から複雑な都市伝説へと発展する社会的メカニズムを理解する。",
      relatedConspiracy: "都市伝説が事実として拡散されるプロセス",
      debunkingPoints: [
        "物語の伝達過程での変容メカニズムを理解する",
        "集団の不安が物語形成に与える影響を認識する",
        "情報源の信頼性と伝聞情報の検証方法を学ぶ"
      ]
    }
  ],
  
  // 容疑者情報
  suspects: [
    {
      id: "student",
      name: "井上翔太",
      profile: "17歳の高校生。都市探索（アーバンエクスプローリング）を趣味としている。",
      motive: "SNSでの人気獲得？友人グループでの冒険ゲーム？",
      alibi: "放課後に友人たちと市内の古い建物や通路を探索している様子がSNSに投稿されている。",
      trustLevel: 50, // 初期信頼度
      motiveCard: [
        { id: 1, content: "「都市の謎を解け」という探索ゲームを友人たちと作成し、実行していた", revealed: false },
        { id: 2, content: "ゲームの一環として、特定の記号を市内の場所に残すルールを設定していた", revealed: false },
        { id: 3, content: "SNSフォロワー数が急増し、探索動画が大きな注目を集めていた", revealed: false },
        { id: 4, content: "記号が噂になり始めると、さらに複雑な記号を作り出すようになった", revealed: false },
        { id: 5, content: "噂の拡大に驚き、一部の記号は消去していたが、すべては対処できなかった", revealed: false },
        { id: 6, content: "探索ゲームが思わぬ方向に発展したことに対する罪悪感と興奮が入り混じっていた", revealed: false }
      ]
    },
    {
      id: "teacher",
      name: "鈴木啓介",
      profile: "45歳の高校歴史教師。歴史と文化人類学を専門とし、地域史研究も行っている。",
      motive: "社会実験としての噂の拡散？研究データの収集？",
      alibi: "記号に関する噂が広がった後、授業でシンボルの歴史について特別講義を行っている。",
      trustLevel: 50,
      motiveCard: [
        { id: 1, content: "「現代社会における都市伝説の形成過程」という研究論文を準備していた", revealed: false },
        { id: 2, content: "アイリスから「社会心理実験のアイデア」を匿名で提供されていた", revealed: false },
        { id: 3, content: "生徒たちに「都市の隠れたシンボル」を探す課題を出し、記録を集めていた", revealed: false },
        { id: 4, content: "SNS上で匿名アカウントを使い、記号の「解読」について投稿していた", revealed: false },
        { id: 5, content: "実験が予想以上に広がり、社会的影響を及ぼしていることに不安を感じていた", revealed: false },
        { id: 6, content: "研究成果を学術誌に投稿し、キャリアの飛躍につなげる計画を立てていた", revealed: false }
      ]
    },
    {
      id: "artist",
      name: "佐藤美咲",
      profile: "32歳のストリートアーティスト。公共空間における芸術表現をテーマに活動している。",
      motive: "芸術プロジェクトの一環？社会批評としての活動？",
      alibi: "記号に似たモチーフを使った作品展示会を最近開催したが、公共施設への無許可の描写は否定している。",
      trustLevel: 50,
      motiveCard: [
        { id: 1, content: "「現代社会における不安のシンボル化」をテーマにした芸術プロジェクトを進行中だった", revealed: false },
        { id: 2, content: "展示会の宣伝として、一部の記号を市内に配置する「ゲリラアート」を実施していた", revealed: false },
        { id: 3, content: "記号をめぐる噂が広がると、自分の芸術への注目度が高まり、メディア出演の機会が増えた", revealed: false },
        { id: 4, content: "芸術活動と噂の区別が曖昧になることで、作品の社会的影響力が強まることを意図していた", revealed: false },
        { id: 5, content: "芸術表現の自由と社会的責任の間で葛藤しながらも、状況を芸術実験として観察していた", revealed: false },
        { id: 6, content: "記号の一部は実際に古代シンボルを現代的に再解釈したもので、意図的な曖昧さを持たせていた", revealed: false }
      ]
    },
    {
      id: "city-worker",
      name: "高橋大輔",
      profile: "39歳の市役所都市計画課職員。最近の都市再開発プロジェクトの責任者を務めている。",
      motive: "再開発への反対意見をそらすため？特定地域への注目集め？",
      alibi: "記号が発見された場所の多くが、彼の担当する再開発区域内またはその周辺に位置している。",
      trustLevel: 50,
      motiveCard: [
        { id: 1, content: "再開発計画が住民の反対で難航しており、進行に焦りを感じていた", revealed: false },
        { id: 2, content: "工事用の標準マーキングシステムを独自にアレンジして使用するよう指示していた", revealed: false },
        { id: 3, content: "記号に関する噂が広がると、再開発地域への注目が集まり、プロジェクトのPRになると考えていた", revealed: false },
        { id: 4, content: "噂によって住民の団結が弱まり、再開発への反対運動が分散されることを密かに期待していた", revealed: false },
        { id: 5, content: "一部のマーキングは故意に標準から逸脱させ、注目を集める形にしていた", revealed: false },
        { id: 6, content: "状況が制御不能になると、標準的なマーキングに戻すよう指示したが、噂は既に広がっていた", revealed: false }
      ]
    }
  ],

  // 質問セット（4択質問）等の詳細データは省略

  // ミニゲーム
  miniGame: {
    type: "pattern-recognition",
    description: "様々な記号とパターンを分析し、都市インフラマーキング、標準シンボル、そして偶然の模様を区別するパズル。パターン認識バイアスの影響を体験しながら、客観的な分析能力を養う。",
    difficulty: {
      easy: "明確な区別がある基本的なシンボルとマーキングを分類する初級モード。",
      medium: "曖昧さを含む記号や、文脈依存的な意味を持つマーキングを解析する中級モード。",
      hard: "パターン認識バイアスを意識しながら、偶然の一致、意図的なシンボル、標準マーキングを厳密に区別する上級モード。"
    }
  },

  // 陰謀論ミステリー編の追加要素
  relationshipMap: {
    nodes: [
      { id: "student", type: "suspect", label: "井上翔太", details: "高校生", discovered: true },
      { id: "teacher", type: "suspect", label: "鈴木啓介", details: "歴史教師", discovered: true },
      { id: "artist", type: "suspect", label: "佐藤美咲", details: "ストリートアーティスト", discovered: true },
      { id: "city-worker", type: "suspect", label: "高橋大輔", details: "市役所職員", discovered: true },
      { id: "shadow-guide", type: "suspect", label: "影の指導者", details: "アイリスと名乗る存在", discovered: false },
      { id: "symbols", type: "evidence", label: "謎の記号", details: "市内各所に現れた記号", discovered: true },
      { id: "pattern-bias", type: "concept", label: "パターン認識バイアス", details: "脳の誤認識メカニズム", discovered: false },
      { id: "urban-legend", type: "concept", label: "都市伝説形成", details: "噂が事実化するプロセス", discovered: false },
      { id: "social-media", type: "event", label: "SNS拡散", details: "情報の急速な拡散現象", discovered: true },
      { id: "redevelopment", type: "event", label: "都市再開発", details: "論争になっているプロジェクト", discovered: true }
    ],
    edges: [
      // 省略
    ]
  },

  backstoryPrediction: {
    suspectKeywords: {
      "student": ["都市探索ゲーム", "記号設置", "SNS人気", "複雑化", "罪悪感", "友人グループ"],
      "teacher": ["社会実験", "研究論文", "匿名助言", "生徒課題", "社会的影響", "キャリア野心"],
      "artist": ["芸術プロジェクト", "ゲリラアート", "メディア注目", "意図的曖昧さ", "社会的影響力", "古代シンボル"],
      "city-worker": ["再開発計画", "マーキング変更", "注目獲得", "反対運動分散", "標準逸脱", "制御不能"]
    }
  },

  ethicalChoices: {
    title: "好奇心と社会的影響のジレンマ",
    description: "記号の真相が明らかになっても、単純に真実を公表すれば都市伝説は終わるのか、それとも更なる憶測を生むのか。真実の公開と社会的影響のバランスが問われています。",
    truthOption: {
      text: "記号の実際の起源と背景をすべて公開し、科学的説明を前面に出して陰謀論を否定する",
      impact: {
        socialTrust: -10,
        scienceTrust: +25
      }
    },
    stabilityOption: {
      text: "記号の背景を部分的に説明しつつ、パターン認識バイアスの教育機会として活用し、過度な不安を抑える",
      impact: {
        socialTrust: +15,
        scienceTrust: +5
      }
    }
  },

  socialThemes: [
    {
      title: "パターン認識バイアスと意味の過剰付与",
      description: "人間の脳が持つパターン認識能力が、無関係な事象や記号に意味を見出してしまう認知的傾向と、それが社会に与える影響。"
    },
    {
      title: "インターネット時代の都市伝説の進化",
      description: "SNSやデジタルメディアによって、都市伝説や噂が従来よりも早く、広く、そして変容しながら拡散していく現代的現象。"
    },
    {
      title: "社会不安と陰謀論の関係",
      description: "社会的・経済的不安が高まる時期に陰謀論が流行しやすく、単純で明確な「敵」や「原因」を求める心理が働く社会現象。"
    }
  ]
};

export default episode5;
