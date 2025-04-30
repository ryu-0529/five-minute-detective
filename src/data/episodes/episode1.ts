import { EpisodeData } from '../../types/game';

// エピソード1: 「スマートスピーカーの陰謀」
const episode1: EpisodeData = {
  id: 1, // 陰謀論ミステリー編のスタートエピソード
  title: "スマートスピーカーの陰謀",
  subtitle: "デジタル監視社会の真実",
  description: "あるコミュニティで、スマートスピーカーが常に会話を盗聴し、広告会社に情報を売っているという噂が拡散。実際に「話しただけで関連広告が表示された」という証言が相次ぎ、地域でスマートスピーカー不買運動が起きている。",
  location: "テクノシティ住宅地区",
  difficulty: "初級",
  scienceField: "データサイエンス・アルゴリズム論",
  timeLimit: 0, // 制限時間なし（0で無制限）
  
  // 科学的概念説明
  scienceConcepts: [
    {
      title: "音声認識技術の仕組み",
      description: "スマートスピーカーが音声を認識し、コマンドとして処理する技術的な仕組み。キーワード（「ヘイ〇〇〇」など）を検出するまでは音声をクラウドに送信せず、キーワード検出後のコマンドのみを処理のために送信します。常時録音しているように思えても、実際には特定のキーワードを検出するためのローカル処理が行われているだけです。",
      relevance: "音声認識がどの範囲で機能し、どのようなデータが処理されるかを理解する。"
    },
    {
      title: "フィルターバブルとアルゴリズム推薦",
      description: "オンラインサービスが過去の行動履歴から嗜好を予測し、表示するコンテンツを調整する仕組み。GoogleやAmazonなどのサービスは、あなたの検索履歴、閲覧したウェブサイト、購入した商品、使用したアプリ、居住地域など、様々なデータポイントを組み合わせて個人の興味や行動パターンを予測します。そのため、会話を録音しなくても類似した広告が表示されることがあります。",
      relevance: "関連広告が表示される原因が、必ずしも会話の録音によるものではない可能性。"
    },
    {
      title: "確証バイアスと錯誤相関",
      description: "既存の信念に合致する情報を優先的に受け入れ、偶然の一致を因果関係と誤認する認知傾向。例えば、「スマートスピーカーは盗聴している」と信じると、その信念を裏付ける出来事（話題に関連する広告が表示された）に注目し、反証となる出来事（関連しない広告が表示された）は無視する傾向があります。また、単なる偶然の一致を因果関係と誤解することもあります。",
      relevance: "スマートスピーカーに対する不信感が、確証バイアスにより強化される心理メカニズム。"
    }
  ],
  
  // 容疑者情報
  suspects: [
    {
      id: "youtuber",
      name: "中田陽介",
      profile: "17歳の高校生でテックYouTuber。地元で視聴者を増やしている。",
      motive: "YouTubeの視聴者獲得と収益化のため？",
      alibi: "噂が広まり始めた時期に関連する動画を複数投稿していた。",
      trustLevel: 50, // 初期信頼度
      motiveCard: [
        { id: 1, content: "登録者10万人を目指してセンセーショナルな内容を追求", revealed: false },
        { id: 2, content: "オンライン上で'AI監視社会'に関する匿名の指南を受け取っていた", revealed: false },
        { id: 3, content: "地元商店街の電気店が経営難で、彼の親族が経営している", revealed: false },
        { id: 4, content: "SNSで噂を意図的に広めるための複数のダミーアカウントを運用", revealed: false },
        { id: 5, content: "情報拡散の専門家からアドバイスを受けていたが、その正体はアイリスだった", revealed: false },
        { id: 6, content: "本当は技術に詳しく、噂の科学的不正確さを理解していながら拡散", revealed: false }
      ]
    },
    {
      id: "store-owner",
      name: "佐藤誠",
      profile: "45歳の地元電気店オーナー。スマートスピーカーを扱わない方針を打ち出している。",
      motive: "競合するオンラインショップへの対抗心？",
      alibi: "不買運動が始まってから売上が増加している。",
      trustLevel: 50,
      motiveCard: [
        { id: 1, content: "大手ECサイトとスマートスピーカーメーカーに押され経営難に陥っていた", revealed: false },
        { id: 2, content: "店のSNSで「プライバシー重視」をアピールし、不安を間接的に煽っていた", revealed: false },
        { id: 3, content: "中田陽介は実は甥で、裏で協力関係にあった", revealed: false },
        { id: 4, content: "独自の「プライバシー保護デバイス」を高額で販売開始していた", revealed: false },
        { id: 5, content: "テクノロジーへの不安を煽るチラシを配布していた", revealed: false },
        { id: 6, content: "自身は最新技術に詳しく、家では実際にスマートスピーカーを使用していた", revealed: false }
      ]
    },
    {
      id: "privacy-activist",
      name: "田村香織",
      profile: "35歳のプライバシー保護活動家。テクノロジー企業の監視行為に警鐘を鳴らしている。",
      motive: "活動の注目度を高め、支援を得るため？",
      alibi: "噂が広まる1ヶ月前から全国各地で講演活動を行っていた。",
      trustLevel: 50,
      motiveCard: [
        { id: 1, content: "以前は大手テック企業のエンジニアとして働いていた経歴がある", revealed: false },
        { id: 2, content: "団体の活動資金が枯渇しており、センセーショナルな話題で寄付を募っていた", revealed: false },
        { id: 3, content: "講演では科学的に誤った情報も含まれていたが、意図的に修正しなかった", revealed: false },
        { id: 4, content: "SNS上での情報拡散テクニックに関する特殊なアドバイスを受け取っていた", revealed: false },
        { id: 5, content: "実際にはプライバシーよりも反テクノロジー思想が根底にある", revealed: false },
        { id: 6, content: "地元コミュニティの不安を利用して自著の販売促進を図っていた", revealed: false }
      ]
    },
    {
      id: "tech-company",
      name: "鈴木健太郎",
      profile: "40歳のテクノロジー企業地域マネージャー。スマートスピーカーの普及に尽力している。",
      motive: "競合他社の評判を下げるため？",
      alibi: "不買運動期間中も地道に製品デモと説明会を実施していた。",
      trustLevel: 50,
      motiveCard: [
        { id: 1, content: "自社製品は批判されておらず、むしろ売上が増加していた", revealed: false },
        { id: 2, content: "「安全な選択肢」として自社製品を推すマーケティングを強化していた", revealed: false },
        { id: 3, content: "実際の音声処理技術について故意に曖昧な説明をしていた", revealed: false },
        { id: 4, content: "競合他社の製品に特化した「プライバシーリスク」の資料を配布", revealed: false },
        { id: 5, content: "匿名で他社製品の「プライバシー侵害事例」をオンラインで投稿", revealed: false },
        { id: 6, content: "実は複数の企業の製品を販売しており、全体的な不信感から利益を得ていた", revealed: false }
      ]
    }
  ],

  // 質問セット（4択質問）
  questions: [
    // 中田陽介（YouTuber）への質問
    {
      suspectId: "youtuber",
      questions: [
        {
          id: "youtuber-1",
          text: "あなたのチャンネルでスマートスピーカーの盗聴について取り上げた理由は？",
          response: "僕のチャンネルは最新テクノロジーのリスクもきちんと検証するべきだと思ってて、視聴者からの要望も多かったんです。実際に色々実験してみたら、予想以上に不気味な一致がたくさんあったので…これは警告する義務があると思いました。",
          trustImpact: 5,
          revealsPanel: 1
        },
        {
          id: "youtuber-2",
          text: "動画のためにどんな検証実験を行いましたか？",
          response: "えっと…いくつかの家庭でスマートスピーカーの近くで特定の商品名を話してもらって、その後のスマホ広告を24時間観察しました。約70%のケースで関連広告が表示されたんです！統計的に有意だと思います。…ただ、実は対照実験はあまりきちんとやってないかも…",
          trustImpact: -10,
          unlocksEvidence: ["experiment-notes"]
        },
        {
          id: "youtuber-3",
          text: "以前から陰謀論系の内容を投稿していましたか？",
          response: "陰謀論っていうレッテルは不本意ですね。僕は単に真実を追求しているだけで…まあ確かに以前からワクチン追跡チップの話とか5G電波の危険性とか取り上げたことはありますけど、すべて視聴者の関心が高いトピックだったからです。再生数も他より3倍くらい多いんですよね。",
          trustImpact: -15,
          revealsPanel: 4
        },
        {
          id: "youtuber-4",
          text: "この噂が広まり始めた時期にネット上で何か特別な指示や情報を受け取りましたか？",
          response: "え？なぜそんなことを…（明らかに動揺している）特に何もないですよ。すべて自分で調査して…あ、まあ確かにネット上で誰かが効果的な情報拡散方法についてアドバイスをくれたことはありましたけど、それは単なるYouTubeのノウハウだと思ってました。匿名の方でしたけど…",
          trustImpact: -20,
          revealsPanel: 2,
          unlocksEvidence: ["anonymous-messages"]
        }
      ]
    },
    // 佐藤誠（電気店オーナー）への質問
    {
      suspectId: "store-owner",
      questions: [
        {
          id: "store-owner-1",
          text: "スマートスピーカーを扱わない理由は何ですか？",
          response: "当店は昔ながらの確かな商品だけを扱う方針なんです。スマートスピーカーは便利かもしれませんが、長期的な品質や修理対応に疑問があるんですよ。それに…お客様のプライバシーを第一に考える店としては、少しでもリスクがある商品は推奨できないという考えもあります。",
          trustImpact: 10
        },
        {
          id: "store-owner-2",
          text: "ご家族にYouTuberの中田さんがいるという噂がありますが？",
          response: "（少し焦った様子で）ああ、そうなんです。実は甥っ子にあたるんですよ。でも彼の活動と当店の方針は全く別物です。家族だからといって特別な関係はありません…確かに時々店を手伝いに来ることはありますが。",
          trustImpact: -10,
          revealsPanel: 3,
          unlocksEvidence: ["family-connection"]
        },
        {
          id: "store-owner-3",
          text: "最近売上は増加していますか？",
          response: "ええ、おかげさまで。やはり人々は自分のプライバシーに関心を持ち始めていますから。当店では特別な「デジタルプライバシー保護パッケージ」も提供していて、これが非常に好評なんです。スマートスピーカーよりも高価ですが、安心は何物にも代えられないとお客様には喜ばれています。",
          trustImpact: -5,
          revealsPanel: 4
        },
        {
          id: "store-owner-4",
          text: "ご自宅ではどのようなデジタル機器を使用していますか？",
          response: "もちろん当店で販売している信頼できる製品だけを…あ、すみません、それは商売の話でした。正直に言うと、家では便利さを優先して、実はスマートスピーカーも含めかなり最新のガジェットを使ってますよ。この業界にいると、実際に使ってみないと良し悪しが判断できないですから…（言葉を濁す）",
          trustImpact: -15,
          revealsPanel: 6,
          unlocksEvidence: ["privacy-products"]
        }
      ]
    },
    // 田村香織（プライバシー活動家）への質問
    {
      suspectId: "privacy-activist",
      questions: [
        {
          id: "privacy-activist-1",
          text: "スマートスピーカーの盗聴問題について科学的な証拠はありますか？",
          response: "明確な直接証拠を掴むのは難しい状況です。テック企業は情報を公開しませんから。ただ、多くの証言と状況証拠が集まっています。私の講演でも常に「100%確実とは言えない」と但し書きを入れていますよ。…ただ、警鐘を鳴らすことが私の役目だと考えています。",
          trustImpact: 0,
          revealsPanel: 3
        },
        {
          id: "privacy-activist-2",
          text: "以前はどのような職業に就いていましたか？",
          response: "（ためらいながら）実は5年前までシリコンバレーの大手テック企業でプライバシー関連のエンジニアとして働いていました。だからこそ内部の仕組みを知っているんです。辞めた理由は…企業の方針と私の価値観の不一致というところでしょうか。これ以上の詳細は契約上お話しできません。",
          trustImpact: 10,
          revealsPanel: 1,
          unlocksEvidence: ["former-employee"]
        },
        {
          id: "privacy-activist-3",
          text: "活動資金はどのように調達していますか？",
          response: "主に講演料や書籍販売、そして支援者からの寄付です。正直に言うと最近は厳しい状況で…注目を集める話題がないと資金調達が難しいんです。でも私は真実だけを伝えるよう心がけています。ええ、もちろん。（少し視線をそらす）",
          trustImpact: -5,
          revealsPanel: 2,
          unlocksEvidence: ["financial-records"]
        },
        {
          id: "privacy-activist-4",
          text: "情報拡散の方法について特別なアドバイスを受けたことはありますか？",
          response: "（驚いた様子で）なぜそんなことを…ええ、確かに数ヶ月前に匿名の方から「効果的な情報拡散のためのガイド」というものが送られてきました。非常に洗練された心理学的テクニックが書かれていて、私も一部を活動に取り入れました。送り主は不明ですが、プライバシー活動の支援者だと思っていました…",
          trustImpact: -10,
          revealsPanel: 4,
          unlocksEvidence: ["information-guide"]
        }
      ]
    },
    // 鈴木健太郎（テック企業マネージャー）への質問
    {
      suspectId: "tech-company",
      questions: [
        {
          id: "tech-company-1",
          text: "貴社のスマートスピーカーは実際にどのように音声データを処理していますか？",
          response: "基本的にはキーワード（「ヘイ〇〇〇」など）を検出するまでは音声をクラウドに送信しません。キーワード検出後のコマンドのみを処理のために送信します。...ただ、品質向上のため一部のデータを匿名化して分析することはあります。これはユーザー規約にも明記しています。詳細な技術仕様は企業秘密なのでお話しできない部分もあります。",
          trustImpact: 0,
          unlocksEvidence: ["speaker-manual"]
        },
        {
          id: "tech-company-2",
          text: "この噂によって貴社の売上はどう変化しましたか？",
          response: "実は当社の製品は他社と比べて影響が少なく、むしろ売上は増加しています。当社は以前からプライバシー重視の設計を強調してきましたので、不安が高まるなか「安全な選択肢」として認識されているようです。この状況は決して喜ばしいことではありませんが、消費者の信頼を得ている証でもあります。",
          trustImpact: 5,
          revealsPanel: 2,
          unlocksEvidence: ["sales-data"]
        },
        {
          id: "tech-company-3",
          text: "競合他社の製品について何か特別な情報を発信していますか？",
          response: "（少し動揺して）いえ、当社は常に自社製品の優位性のみを主張しており、他社を誹謗中傷するようなことはありません...（ため息）...正直に申し上げると、マーケティング部門が「プライバシーリスク比較」という資料を作成し、競合製品の懸念点を強調したことはあります。しかし純粋に技術的観点からの比較を意図したものです。",
          trustImpact: -10,
          revealsPanel: 4,
          unlocksEvidence: ["competitor-document"]
        },
        {
          id: "tech-company-4",
          text: "オンライン上での匿名の活動に関与していますか？",
          response: "（明らかに動揺して）そ、そのような質問の意図がわかりません。企業の公式な広報活動以外に関与することはありま...（長い沈黙）...実は少し個人的に、製品レビューサイトで「一般ユーザー」を装って書き込みをしたことがあります。競合製品の問題点を指摘するようなものです。会社の指示ではなく完全に個人的な判断でした。今思えば不適切だったと反省しています。",
          trustImpact: -15,
          revealsPanel: 5,
          unlocksEvidence: ["anonymous-reviews"]
        }
      ]
    }
  ],
  
  // 証拠アイテム
  evidenceItems: [
    {
      id: "experiment-notes",
      name: "中田の実験ノート",
      description: "YouTube動画のために行った「実験」の記録。データ収集方法には明らかな統計的バイアスがあり、対照実験も不十分。",
      location: "中田のスマートフォン",
      relevance: "科学的手法を無視した実験設計が確認できる。",
      locked: true
    },
    {
      id: "anonymous-messages",
      name: "匿名メッセージ",
      description: "中田が受信した匿名メッセージ。「効果的な情報拡散のための7つの原則」という内容で、心理学的な誘導テクニックが詳細に説明されている。",
      location: "中田のパソコン",
      relevance: "何者かが意図的に情報拡散の方法を指南していた証拠。",
      locked: true
    },
    {
      id: "family-connection",
      name: "家族の写真",
      description: "佐藤と中田が一緒に写った家族写真。裏には「電気店手伝い、YouTubeのネタになりそう」というメモ書きがある。",
      location: "佐藤の店の事務所",
      relevance: "二人の密接な関係と共謀の可能性を示唆。",
      locked: true
    },
    {
      id: "privacy-products",
      name: "プライバシー保護製品カタログ",
      description: "佐藤の店で販売している「デジタルプライバシー保護パッケージ」のカタログ。通常の家電に比べて大幅に高い利益率が記載されている。",
      location: "佐藤の店",
      relevance: "噂の拡散が直接的な経済的利益につながっていることを示す。",
      locked: true
    },
    {
      id: "former-employee",
      name: "雇用履歴書類",
      description: "田村がテック企業を退職した際の書類。退職理由は「製品のプライバシー方針への倫理的懸念」と記載されている。",
      location: "田村の自宅オフィス",
      relevance: "田村の主張の一部に実体験による裏付けがあることを示す。",
      locked: true
    },
    {
      id: "financial-records",
      name: "活動団体の財務記録",
      description: "田村のプライバシー保護団体の財務記録。過去6ヶ月で寄付金が大幅に減少し、新著の売上も低迷していることが記載されている。",
      location: "オンラインストレージ",
      relevance: "田村が資金確保のために注目を集める必要があったことを示す。",
      locked: true
    },
    {
      id: "information-guide",
      name: "情報拡散ガイド",
      description: "田村が受け取った「効果的な情報拡散のためのガイド」。中田のメッセージと同じフォーマットとコンテンツが確認できる。",
      location: "田村のメール",
      relevance: "同一の送信者が複数の関係者に同様の指示を送っていた証拠。",
      locked: true
    },
    {
      id: "speaker-manual",
      name: "スマートスピーカー技術マニュアル",
      description: "スマートスピーカーの技術仕様書。音声データの収集と処理に関する詳細な説明が含まれ、キーワード検出以外の常時録音や送信は技術的に行われないことが明記されている。",
      location: "オンライン技術文書",
      relevance: "噂の技術的可能性に疑問を投げかける客観的資料。",
      locked: true
    },
    {
      id: "sales-data",
      name: "市場シェア分析レポート",
      description: "スマートスピーカー市場の分析レポート。噂が広まって以降、鈴木の会社の製品が「プライバシー重視」というポジショニングで売上を伸ばしていることが示されている。",
      location: "市場調査会社のデータベース",
      relevance: "鈴木の会社がこの噂から間接的に利益を得ていることを示す。",
      locked: true
    },
    {
      id: "competitor-document",
      name: "競合製品比較資料",
      description: "鈴木の会社が作成した「プライバシーリスク比較」資料。競合製品のリスクを誇張し、科学的根拠の薄い主張も含まれている。",
      location: "鈴木のブリーフケース",
      relevance: "鈴木が意図的に競合製品の評判を下げる活動をしていた証拠。",
      locked: true
    },
    {
      id: "anonymous-reviews",
      name: "匿名レビュー投稿記録",
      description: "鈴木が「一般ユーザー」を装って投稿したと思われるレビューの記録。複数のアカウントで競合製品の「盗聴」問題を指摘している。",
      location: "鈴木のパソコン",
      relevance: "鈴木も噂の拡散に関与していた証拠。",
      locked: true
    },
    {
      id: "algorithm-explanation",
      name: "アルゴリズム解説記事",
      description: "オンライン行動追跡と広告表示の仕組みを説明する技術記事。会話を録音せずとも、ブラウジング履歴やアプリ使用状況から関連広告が表示される仕組みが詳細に解説されている。",
      location: "テクノロジーブログ",
      relevance: "噂の中心となっている現象に対する科学的説明を提供。",
      discovered: true
    },
    {
      id: "chat-screenshots",
      name: "チャットスクリーンショット",
      description: "「アイリス」という名前の匿名ユーザーと中田陽介とのチャットスクリーンショット。情報操作の具体的な方法論について詳細なアドバイスが記載されている。",
      location: "中田のクラウドバックアップ",
      relevance: "噂の拡散が意図的に設計されたものである最も直接的な証拠。",
      locked: true
    }
  ],
  
  // 解決のためのヒント
  hints: [
    "関連広告が表示される現象には、音声録音以外にも説明可能な技術的メカニズムがある。",
    "噂が広まることで利益を得る人々が複数存在する。それぞれの動機を比較してみよう。",
    "同じパターンの「情報拡散ガイド」が複数の人物に送られている点に注目。",
    "誰が最初に噂を広め始めたのか、そのタイミングと方法を調査する。",
    "科学的な検証方法と、噂の拡散に使われた「実験」の方法論の違いを分析する。"
  ],
  
  // 正解と説明
  solution: {
    culprit: "youtuber", // 犯人のID
    explanation: "中田陽介（高校生YouTuber）が視聴者獲得のため意図的に噂を広めていたのが真相です。彼は「アイリス」という匿名の存在から情報拡散の効果的な方法についてアドバイスを受け、それをもとに科学的に不正確な「実験」を行い、センセーショナルな動画を制作しました。彼の甥である佐藤店主もこの状況を利用して高利益率の「プライバシー保護製品」を販売することで経済的利益を得ていました。田村活動家は資金難から噂を積極的に援用し、鈴木マネージャーも競合他社の評判を下げるために噂を間接的に強化していました。しかし、実際にはスマートスピーカーが会話を常時録音して広告に利用しているという技術的証拠はなく、関連広告が表示される現象は主にオンライン行動追跡アルゴリズムと確証バイアスによって説明できます。",
    scienceExplanation: "この事件では、「確証バイアス」と「錯誤相関」という認知バイアスが重要な役割を果たしています。確証バイアスにより、人々は自分の既存の信念（スマートスピーカーは盗聴している）を支持する情報に注目し、それに反する証拠を無視する傾向があります。また錯誤相関により、偶然の一致（会話の内容と表示される広告の一致）を因果関係と誤解してしまいます。実際には、オンライン広告はブラウジング履歴、検索履歴、位置情報、アプリ使用状況など様々なデータソースを組み合わせた複雑なアルゴリズムによって表示されており、会話を録音しなくても高い精度で関連広告を表示することが可能なのです。また、情報拡散においては「社会的証明」や「権威の原理」といった心理学的影響力の原則が利用され、一部の人々の動機と結びついて噂が増幅されていきました。"
  },

  // ミニゲーム（無効化）
  miniGame: {
    type: "none",
    description: "",
    difficulty: {
      easy: "",
      medium: "",
      hard: ""
    }
  },
  
  // 陰謀論ミステリー編の追加要素
  relationshipMap: {
    nodes: [
      { id: "youtuber", type: "suspect", label: "中田陽介", details: "テックYouTuber", discovered: true },
      { id: "store-owner", type: "suspect", label: "佐藤誠", details: "電気店オーナー", discovered: true },
      { id: "privacy-activist", type: "suspect", label: "田村香織", details: "プライバシー活動家", discovered: true },
      { id: "tech-company", type: "suspect", label: "鈴木健太郎", details: "テック企業マネージャー", discovered: true },
      { id: "anonymous-advisor", type: "suspect", label: "匿名アドバイザー", details: "情報拡散の指南役", discovered: false },
      { id: "smart-speaker", type: "evidence", label: "スマートスピーカー", details: "噂の中心となる製品", discovered: true },
      { id: "algorithm", type: "concept", label: "広告アルゴリズム", details: "オンライン行動追跡システム", discovered: false },
      { id: "confirmation-bias", type: "concept", label: "確証バイアス", details: "既存の信念を強化する認知傾向", discovered: false },
      { id: "rumor-spread", type: "event", label: "噂の拡散", details: "コミュニティ内での情報の広がり", discovered: true },
      { id: "boycott", type: "event", label: "不買運動", details: "スマートスピーカーへの抗議活動", discovered: true }
    ],
    edges: [
      { source: "youtuber", target: "store-owner", type: "knows", strength: 0.9, discovered: false },
      { source: "youtuber", target: "rumor-spread", type: "causes", strength: 0.8, discovered: false },
      { source: "store-owner", target: "boycott", type: "influences", strength: 0.7, discovered: false },
      { source: "privacy-activist", target: "rumor-spread", type: "influences", strength: 0.6, discovered: false },
      { source: "tech-company", target: "smart-speaker", type: "knows", strength: 0.9, discovered: true },
      { source: "anonymous-advisor", target: "youtuber", type: "influences", strength: 0.9, discovered: false },
      { source: "anonymous-advisor", target: "privacy-activist", type: "influences", strength: 0.7, discovered: false },
      { source: "smart-speaker", target: "algorithm", type: "related", strength: 0.8, discovered: false },
      { source: "rumor-spread", target: "confirmation-bias", type: "related", strength: 0.7, discovered: false },
      { source: "boycott", target: "store-owner", type: "benefits", strength: 0.8, discovered: false }
    ]
  },

  backstoryPrediction: {
    suspectKeywords: {
      "youtuber": ["視聴者獲得", "再生数", "匿名アドバイザー", "科学的不正確さ", "情報操作", "甥"],
      "store-owner": ["経営難", "高利益率製品", "プライバシー商品", "家族関係", "二重基準", "共謀"],
      "privacy-activist": ["元テック企業", "資金難", "寄付金", "講演料", "書籍売上", "情報拡散ガイド"],
      "tech-company": ["競合他社", "市場シェア", "匿名レビュー", "比較資料", "プライバシー対策", "技術的矛盾"]
    }
  },

  ethicalChoices: {
    title: "真実の公開と社会不安",
    description: "スマートスピーカーの噂が科学的に不正確であることが判明しました。しかし、この真実を公開することで、既に形成されたコミュニティの結束や、プライバシーへの意識向上といったポジティブな側面も失われる可能性があります。",
    truthOption: {
      text: "科学的事実と噂の作られた経緯を完全に公開する",
      impact: {
        socialTrust: -10,
        scienceTrust: +20
      }
    },
    stabilityOption: {
      text: "事実を部分的に公開しつつ、プライバシー意識の向上という社会的利益を維持する",
      impact: {
        socialTrust: +10,
        scienceTrust: -15
      }
    }
  },

  socialThemes: [
    {
      title: "デジタル監視社会への不安",
      description: "テクノロジーの発展による個人情報の収集と活用が、現代社会における不安の源泉となっている。"
    },
    {
      title: "テクノロジーリテラシーの格差",
      description: "技術の仕組みに対する理解の差が、社会的な分断や誤解を生み出す要因となっている。"
    },
    {
      title: "確証バイアスと偶然の一致の誤認",
      description: "人間の認知バイアスが、テクノロジーに関する誤った信念を強化し、社会に広める仕組み。"
    }
  ]
};

export default episode1;