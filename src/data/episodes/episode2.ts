import { EpisodeData } from '../../types/game';

// エピソード2: 「ワクチンマイクロチップ」
const episode2: EpisodeData = {
  id: 2, // 陰謀論ミステリー編の2番目のエピソード
  title: "ワクチンマイクロチップ",
  subtitle: "医療不信の真相を探る",
  description: "最新型ワクチンに体調管理用マイクロチップが埋め込まれ、特定の集団を監視・操作しているという噂が拡散。ワクチン接種率が急落し、予防可能な疾病の発生率が上昇している。",
  location: "ヘルスケアセンターと周辺地域",
  difficulty: "中級",
  scienceField: "医療技術・免疫学",
  timeLimit: 300, // 5分（秒数）
  
  // 科学的概念説明
  scienceConcepts: [
    {
      title: "ワクチンの構成要素と作用機序",
      description: "ワクチンに含まれる成分とその体内での働き、および免疫応答の仕組み。",
      relevance: "マイクロチップ埋め込みの技術的可能性を科学的に検証するための基礎知識。"
    },
    {
      title: "マイクロチップ技術の現状と限界",
      description: "現在実用化されているマイクロチップのサイズ、機能、電源要件などの技術的制約。",
      relevance: "噂の内容が技術的に実現可能かどうかを判断する基準。"
    },
    {
      title: "集団免疫と公衆衛生",
      description: "ワクチン接種率と感染症の流行の関係性、社会全体の健康を守るためのワクチンの役割。",
      relevance: "噂の社会的影響を理解し、公衆衛生上のリスクを評価する視点。"
    }
  ],
  
  // 容疑者情報
  suspects: [
    {
      id: "blogger",
      name: "田代健太",
      profile: "35歳の人気健康ブロガー。大手製薬会社に批判的な記事を多数投稿。",
      motive: "ブログの購読者増加と代替健康商品の販売促進？",
      alibi: "噂が広まり始めた頃、頻繁に医療関連施設の近くで目撃されている。",
      trustLevel: 50, // 初期信頼度
      motiveCard: [
        { id: 1, content: "健康ブログでのアフィリエイト収入が主な収入源になっている", revealed: false },
        { id: 2, content: "天然健康製品の通販サイトを運営し、ワクチン懐疑論者向けに販売", revealed: false },
        { id: 3, content: "動画編集中に奇妙な音声ファイルを発見し、自分が操られていると恐れていた", revealed: false },
        { id: 4, content: "元々は医学部志望だったが、入試に失敗し挫折を経験している", revealed: false },
        { id: 5, content: "記事内容が過激になるほどSNSでのシェア数が増えることを認識していた", revealed: false },
        { id: 6, content: "医療専門用語を意図的に誤用し、権威的な印象を与える文章技術を使用", revealed: false }
      ]
    },
    {
      id: "professor",
      name: "石原正樹",
      profile: "62歳の医工学教授。マイクロデバイスを使用した医療技術の研究で知られる。",
      motive: "研究成果の誤解による風評被害？研究費獲得のための注目度向上？",
      alibi: "噂の内容と一致する論文を発表していたが、内容の一部が曲解されている。",
      trustLevel: 50,
      motiveCard: [
        { id: 1, content: "研究論文が大幅に引用され、学術的注目度が急上昇していた", revealed: false },
        { id: 2, content: "発言の一部が田代ブロガーによって意図的に文脈から切り離され引用されていた", revealed: false },
        { id: 3, content: "研究室への寄付金が増加しており、新たな設備投資が可能になっていた", revealed: false },
        { id: 4, content: "健康医療デバイスのスタートアップ企業の顧問を務めている", revealed: false },
        { id: 5, content: "メディア露出を増やすため、一部センセーショナルな表現を使っていた", revealed: false },
        { id: 6, content: "マイクロチップの将来的な医療応用について、過度に楽観的な見通しを示していた", revealed: false }
      ]
    },
    {
      id: "activist",
      name: "青山美咲",
      profile: "28歳の医療人権活動家。過去に大手製薬会社の臨床試験で副作用を経験。",
      motive: "製薬会社への個人的恨み？活動資金の獲得？",
      alibi: "公式には噂を否定しているが、私的な会話では曖昧な態度をとっている。",
      trustLevel: 50,
      motiveCard: [
        { id: 1, content: "以前参加した薬の臨床試験で重度の副作用を経験し、後遺症が残っている", revealed: false },
        { id: 2, content: "活動資金が枯渇しており、団体の存続が危機的状況にあった", revealed: false },
        { id: 3, content: "公式声明と私的な会話で異なる見解を示すダブルスタンダードがあった", revealed: false },
        { id: 4, content: "製薬業界の内部告発者と定期的に接触し、機密情報を入手していた", revealed: false },
        { id: 5, content: "SNS上で匿名アカウントを使い、過激な陰謀論を拡散していた形跡がある", revealed: false },
        { id: 6, content: "活動家としてのキャリアをメディア出演やブック契約に結びつけようとしていた", revealed: false }
      ]
    },
    {
      id: "doctor",
      name: "野村聡",
      profile: "45歳の開業医。地域で高い信頼を得ているが、最近経営が悪化している。",
      motive: "競合するクリニックへの患者流出の防止？代替療法の宣伝？",
      alibi: "患者にワクチンの危険性を説明する姿が防犯カメラに記録されている。",
      trustLevel: 50,
      motiveCard: [
        { id: 1, content: "クリニックの経営状態が悪化し、負債が増加している状況だった", revealed: false },
        { id: 2, content: "高額な「デトックス療法」を提供し始め、ワクチン接種拒否者に推奨していた", revealed: false },
        { id: 3, content: "地域の他の医師から非科学的治療法で批判されていた", revealed: false },
        { id: 4, content: "医学部時代の同級生がワクチン開発チームの責任者で、確執がある", revealed: false },
        { id: 5, content: "SNSで匿名の医療情報サイトを運営し、疑わしい医療情報を発信していた", revealed: false },
        { id: 6, content: "患者の不安を煽り、高額な検査や治療を勧める診療パターンがあった", revealed: false }
      ]
    }
  ],

  // 質問セット（4択質問）
  questions: [
    // 田代健太（ブロガー）への質問
    {
      suspectId: "blogger",
      questions: [
        {
          id: "blogger-1",
          text: "ワクチンにマイクロチップが含まれるという情報源は何ですか？",
          response: "複数の内部告発者からの証言や、海外の調査報道、そして石原教授の論文なども参考にしています。もちろん全ての情報源を公開することはできませんが…信頼できる筋からの情報です。特に最近は奇妙なことに、編集作業中の動画から不可解な音声が検出されたこともあり…（不安そうな表情）",
          trustImpact: -5,
          revealsPanel: 3,
          unlocksEvidence: ["audio-file"]
        },
        {
          id: "blogger-2",
          text: "ブログでの収入源について教えてください。",
          response: "私のブログは真実を伝えることが目的で、収益は二の次です。ただ、確かにアフィリエイト広告から一定の収入はありますね。特に自然療法や免疫力向上サプリメントの紹介記事は読者の方に好評で…。あ、それと最近は「ワクチンフリー生活応援キット」という商品も販売しています。売上は予想以上に好調で、おかげで専業ブロガーとして生活できています。",
          trustImpact: -10,
          revealsPanel: 1,
          unlocksEvidence: ["affiliate-income"]
        },
        {
          id: "blogger-3",
          text: "医学や科学の専門教育を受けた経験はありますか？",
          response: "（少し躊躇して）実は大学では医学部を目指していたんです。でも…入試に失敗してしまって。それ以来、独学で医学や生物学を学んできました。正直、その挫折がきっかけで従来の医療システムに疑問を持つようになったんです。既存の医学教育は製薬会社のプロパガンダに汚染されていると思いますよ。独学の方が真実に近づけることもあるんです。",
          trustImpact: -15,
          revealsPanel: 4,
          unlocksEvidence: ["education-record"]
        },
        {
          id: "blogger-4",
          text: "記事の内容がより過激になっていった理由は何ですか？",
          response: "過激というより、真実に近づいていったという表現が正しいと思います。（データを見せながら）ご覧ください、この統計です。穏やかな医療批判記事より、強い表現を使った記事の方がSNSでのシェア数が3倍以上なんです。これは読者が真実に飢えている証拠だと思いませんか？…まあ、確かにアクセス数や収益にも影響しますけど、それは二次的な効果ですよ。",
          trustImpact: -20,
          revealsPanel: 5,
          unlocksEvidence: ["blog-analytics"]
        }
      ]
    },
    // 石原正樹（医工学教授）への質問
    {
      suspectId: "professor",
      questions: [
        {
          id: "professor-1",
          text: "ご自身の研究がワクチン陰謀論に利用されていることをどう思いますか？",
          response: "非常に遺憾です。私の研究は医療用マイクロデバイスの可能性を探るものであり、ワクチンへの応用については言及していません。田代氏は私の論文の一部を意図的に切り取り、文脈を無視して引用しています。科学的議論を歪める行為は許されません。ただ、一般向けメディアでの説明では、理解を促すために一部簡略化した表現を使ったことが誤解を招いた可能性はあります。",
          trustImpact: 10,
          revealsPanel: 2,
          unlocksEvidence: ["research-paper"]
        },
        {
          id: "professor-2",
          text: "研究室の資金源について教えてください。",
          response: "主に国の科学研究費補助金と大学からの基礎研究費です。また、この騒動後、実は寄付金や民間企業からの研究支援が増加しました。皮肉なことに、陰謀論によって私の研究への注目度が高まったのです。これらの資金は最新の実験設備の購入に充てています。また、私は医療機器開発のスタートアップ企業の技術顧問も務めていますが、利益相反にならないよう大学の倫理委員会に申告済みです。",
          trustImpact: 0,
          revealsPanel: 3,
          unlocksEvidence: ["funding-records"]
        },
        {
          id: "professor-3",
          text: "メディアでの発言に誇張はありませんでしたか？",
          response: "（少し考え込んで）科学者として正確さを心がけていますが…確かに一般向けの講演やインタビューでは、研究の社会的意義や将来性を強調することがあります。研究費獲得の競争が激しい状況で、注目を集めることも時に必要なのです。特にマイクロデバイスの未来像については、実現可能性を楽観的に述べたことがあるかもしれません。しかし、現時点でワクチンに埋め込めるようなマイクロチップは技術的に不可能です。そこは明確に否定しています。",
          trustImpact: -5,
          revealsPanel: 5,
          unlocksEvidence: ["interview-transcript"]
        },
        {
          id: "professor-4",
          text: "実際に開発中のマイクロデバイスについて詳しく教えてください。",
          response: "現在、治療薬の効果をモニタリングするためのマイクロセンサーを研究しています。これは注射針よりも小さなデバイスですが、ワクチンに混ぜて投与できるサイズではありません。また、電源や通信機能も持ちません。田代氏が主張するような「GPS追跡」や「遠隔操作」は完全に不可能です。私たちの技術はまだ実験段階で、臨床応用までには最低でも5-10年はかかると見込んでいます。将来的には慢性疾患の管理などに役立てたいと考えていますが、現状では「楽観的に見て10年後」の技術です。",
          trustImpact: 15,
          revealsPanel: 6,
          unlocksEvidence: ["device-prototype"]
        }
      ]
    },
    // 青山美咲（活動家）への質問
    {
      suspectId: "activist",
      questions: [
        {
          id: "activist-1",
          text: "あなたが臨床試験で経験した副作用について教えてください。",
          response: "5年前、大手製薬会社の新薬臨床試験に参加したんです。その後、重度の神経障害が発症しました。因果関係は公式には認められていませんが…私は確信しています。今でも痛みや疲労感が続いています。最悪だったのは、製薬会社が補償を渋り、症状を心理的なものと決めつけたことです。だから、医薬品の安全性に疑問を持つ人の気持ちは痛いほどわかります。でも、だからといって根拠のない噂を広めるべきではないと思っています。",
          trustImpact: 10,
          revealsPanel: 1,
          unlocksEvidence: ["medical-record"]
        },
        {
          id: "activist-2",
          text: "あなたの活動団体の財政状況はどうですか？",
          response: "（ため息をつきながら）正直に言うと厳しい状況です。小規模な団体なので、常に資金不足との戦いです。昨年は寄付が減少し、事務所の維持も難しくなっています。センセーショナルな陰謀論に比べると、私たちの「科学的根拠に基づく医薬品の安全性向上」という活動はメディアの注目も集めにくく…。（少し言葉を濁して）もちろん、寄付が増えれば活動を拡大できますが、真実と科学を犠牲にしてまで注目を集めるつもりはありません。",
          trustImpact: 5,
          revealsPanel: 2,
          unlocksEvidence: ["donation-records"]
        },
        {
          id: "activist-3",
          text: "SNSでの匿名活動について質問します。",
          response: "（明らかに動揺して）匿名活動？どういう意味ですか？私は常に実名で透明性のある活動を…（長い沈黙）…正直に話します。確かに「医療真実探求者」というハンドルネームで投稿していたことがあります。当初は個人的な思いを表現する場として始めたのですが、フォロワーが増えるにつれて、より強い表現を使うようになりました。でも、マイクロチップの噂については否定していましたよ。少なくとも公式アカウントでは…",
          trustImpact: -20,
          revealsPanel: 5,
          unlocksEvidence: ["anonymous-account"]
        },
        {
          id: "activist-4",
          text: "今回の騒動からメディア露出や出版の機会を得ていますか？",
          response: "確かに取材や講演依頼は増えています。最近は出版社から自伝的な本の執筆オファーもいただきました。でも、それは副産物に過ぎません。私の目的は常に患者の安全と権利を守ることです。（少し躊躇して）ただ、メディア露出が増えれば活動資金も集まりやすくなりますし、より多くの人に私たちのメッセージを届けられます。この機会を活用することは、長期的な活動のためには必要なことだと考えています。",
          trustImpact: -10,
          revealsPanel: 6,
          unlocksEvidence: ["book-contract"]
        }
      ]
    },
    // 野村聡（開業医）への質問
    {
      suspectId: "doctor",
      questions: [
        {
          id: "doctor-1",
          text: "クリニックの経営状況について教えてください。",
          response: "（困惑した表情で）なぜそのような…まあいいでしょう。確かに最近は厳しい状況です。新しい大型医療センターが近くにできてから患者数が減少し、設備投資のローンの返済も厳しくなっています。（自信を取り戻して）しかし、それと医療判断は全く別です。私は常に患者の健康を第一に考えています。経営のためにワクチンについて虚偽の情報を広めるようなことはしません。",
          trustImpact: 0,
          revealsPanel: 1,
          unlocksEvidence: ["clinic-finances"]
        },
        {
          id: "doctor-2",
          text: "「デトックス療法」について詳しく教えてください。",
          response: "これは体内に蓄積した有害物質を排出するための統合的なアプローチです。特殊な栄養療法、活性炭サプリメント、ファスティング、そして特別な波長の電磁波療法を組み合わせています。（少し言葉に詰まって）科学的なエビデンスについては、まだ研究途上の分野ですが、多くの患者さんから良い結果の報告を受けています。確かに通常の保険診療より高額ですが、それだけの価値があると思います。特にワクチン接種に不安がある方には、代替的な健康管理法として勧めることがあります。",
          trustImpact: -15,
          revealsPanel: 2,
          unlocksEvidence: ["detox-pamphlet"]
        },
        {
          id: "doctor-3",
          text: "同業の医師からの批判についてどう思いますか？",
          response: "（明らかに苛立ちを見せて）彼らは単に既存の医学パラダイムに囚われているだけです。私は常に新しいアプローチを模索してきました。確かに一部の治療法は従来の医学会では認められていませんが、それは彼らの視野が狭いからです。患者の中には従来の治療で改善しなかった症状が、私の方法で良くなったケースも多いんです。（落ち着いて）医学の進歩は常に最初は「非科学的」と批判されるものです。ガリレオの時代から変わっていませんよ。",
          trustImpact: -5,
          revealsPanel: 3,
          unlocksEvidence: ["medical-complaint"]
        },
        {
          id: "doctor-4",
          text: "匿名の医療情報サイトを運営していますか？",
          response: "（明らかに動揺して）そのような質問は…（長い沈黙）…正直に話します。「真実の医療」というサイトを匿名で運営していました。主流医学では語られない情報を提供する場として始めたのですが、確かにワクチンの危険性についても言及していました。ただ、マイクロチップの話は私ではなく、読者からのコメントから広まったものです。サイトの収益は全て医療知識の普及のために使っています。患者を騙すためではありません。",
          trustImpact: -20,
          revealsPanel: 5,
          unlocksEvidence: ["anonymous-website"]
        }
      ]
    }
  ],
  
  // 証拠アイテム
  evidenceItems: [
    {
      id: "audio-file",
      name: "奇妙な音声ファイル",
      description: "田代のパソコンから発見された音声ファイル。通常では聞こえない低周波音が含まれており、田代は「自分に対する操作信号」と恐れていた。",
      location: "田代のパソコン",
      relevance: "田代自身も何らかの陰謀の被害者と感じていた可能性を示唆。",
      locked: true
    },
    {
      id: "affiliate-income",
      name: "アフィリエイト収入記録",
      description: "田代のブログ収益データ。ワクチン関連の否定的記事が増えるにつれて、代替医療製品の売上が急増している。",
      location: "オンラインバンキング記録",
      relevance: "経済的動機の存在を証明する直接的証拠。",
      locked: true
    },
    {
      id: "education-record",
      name: "学歴記録",
      description: "田代の大学受験記録。医学部不合格の履歴と、その後の中退歴が確認できる。",
      location: "教育機関データベース",
      relevance: "医学界への個人的な恨みの可能性を示唆。",
      locked: true
    },
    {
      id: "blog-analytics",
      name: "ブログ分析データ",
      description: "田代のブログの詳細なアクセス解析。陰謀論的な内容の記事ほど高いエンゲージメントと収益を生み出している。",
      location: "アナリティクスツール",
      relevance: "センセーショナルな内容を発信する動機の裏付け。",
      locked: true
    },
    {
      id: "research-paper",
      name: "石原教授の研究論文",
      description: "医療用マイクロデバイスに関する学術論文。田代のブログでは一部が文脈から切り離され引用されている。",
      location: "学術ジャーナルデータベース",
      relevance: "科学的情報が誤用されている証拠。",
      locked: true
    },
    {
      id: "funding-records",
      name: "研究資金記録",
      description: "石原教授の研究室への資金提供記録。騒動後、民間からの寄付が増加している。",
      location: "大学経理部",
      relevance: "騒動が間接的に研究室に利益をもたらしている証拠。",
      locked: true
    },
    {
      id: "interview-transcript",
      name: "メディアインタビュー記録",
      description: "石原教授の一般メディアでのインタビュー転写。将来技術について一部誇張した表現が見られる。",
      location: "科学雑誌記事",
      relevance: "専門家発言が誤解を招く可能性の証拠。",
      locked: true
    },
    {
      id: "device-prototype",
      name: "マイクロデバイス試作品",
      description: "石原教授の研究室で開発中のマイクロセンサー。注射針よりも小さいが、ワクチンに混入できるサイズではない。",
      location: "研究室",
      relevance: "現在の技術レベルでは噂の内容が実現不可能であることの物理的証拠。",
      locked: true
    },
    {
      id: "medical-record",
      name: "青山の医療記録",
      description: "青山が臨床試験で経験した副作用の医療記録。重度の症状が確認できるが、因果関係は「不明」とされている。",
      location: "病院記録",
      relevance: "個人的な医療被害体験が活動の動機となっている証拠。",
      locked: true
    },
    {
      id: "donation-records",
      name: "寄付金記録",
      description: "青山の活動団体への寄付金推移。過去1年で著しく減少している。",
      location: "NPO法人登記簿",
      relevance: "活動資金不足という経済的動機の裏付け。",
      locked: true
    },
    {
      id: "anonymous-account",
      name: "匿名SNSアカウント",
      description: "青山が運営していた匿名アカウントの投稿履歴。公式発言より過激な意見が多数確認できる。",
      location: "SNSデータ",
      relevance: "公式見解と私的見解の矛盾を示す証拠。",
      locked: true
    },
    {
      id: "book-contract",
      name: "出版契約書",
      description: "青山の回顧録出版に関する契約書。ワクチン騒動後に締結され、高額な前払い金が支払われている。",
      location: "出版社記録",
      relevance: "騒動から個人的利益を得ている証拠。",
      locked: true
    },
    {
      id: "clinic-finances",
      name: "クリニック財務記録",
      description: "野村医師のクリニック経営状態を示す書類。過去2年間で患者数と収益が大幅に減少し、負債が増加している。",
      location: "会計士オフィス",
      relevance: "経済的困窮という動機の裏付け。",
      locked: true
    },
    {
      id: "detox-pamphlet",
      name: "デトックス療法パンフレット",
      description: "野村医師のクリニックで配布されているパンフレット。科学的根拠の薄い高額な治療法が宣伝されている。",
      location: "クリニック待合室",
      relevance: "代替療法の販売促進という経済的動機の証拠。",
      locked: true
    },
    {
      id: "medical-complaint",
      name: "医師会への苦情",
      description: "地域の複数の医師から野村医師の治療法に関して医師会に提出された苦情書。非科学的な治療法への懸念が記されている。",
      location: "地域医師会記録",
      relevance: "医学的根拠の乏しい治療を行っていたという裏付け。",
      locked: true
    },
    {
      id: "anonymous-website",
      name: "匿名医療サイト",
      description: "野村医師が運営していた匿名の医療情報サイト。ワクチンの危険性を強調する不正確な情報が多数掲載されている。",
      location: "インターネットアーカイブ",
      relevance: "虚偽情報の拡散に直接関与していた証拠。",
      locked: true
    },
    {
      id: "vaccine-analysis",
      name: "ワクチン成分分析報告書",
      description: "独立研究機関によるワクチンの詳細な成分分析。マイクロチップの存在は確認されず、全ての成分は申告通りであることが証明されている。",
      location: "研究機関データベース",
      relevance: "噂の中心的主張を科学的に否定する直接的証拠。",
      discovered: true
    },
    {
      id: "hidden-message",
      name: "暗号化されたメッセージ",
      description: "田代のブログ記事内に埋め込まれた暗号化メッセージ。解読すると「アイリスのガイドに従う」という文が現れる。",
      location: "ブログのソースコード",
      relevance: "外部からの指示を受けていた可能性を示す重要な証拠。",
      locked: true
    }
  ],
  
  // 解決のためのヒント
  hints: [
    "田代ブロガーの恐怖心は演技ではなく、本物のように見える。彼自身も操作されていると感じているのはなぜか？",
    "各容疑者に共通して経済的または名声に関する動機が存在する。",
    "石原教授の研究と噂の内容の間には大きな技術的ギャップがある。",
    "複数の容疑者が匿名で活動しているのは偶然か、それとも何らかの指示があるのか？",
    "音声ファイルの出所と、田代のブログに埋め込まれた暗号メッセージの関連性を検討する。"
  ],
  
  // 正解と説明
  solution: {
    culprit: "blogger", // 犯人のID
    explanation: "田代健太（人気ブロガー）が陰謀論を広めた主犯ですが、彼自身も「アイリス」と名乗る匿名の存在から送られてきた誘導的な指示に操られていました。田代はブログの収益とアフィリエイト商品の販売増加という経済的動機を持っていましたが、編集作業中に奇妙な音声ファイルを発見し、自分自身も何者かに操作されているのではないかという恐怖を抱くようになっていました。実際、彼のブログのソースコードには暗号化された「アイリスのガイドに従う」というメッセージが埋め込まれていました。他の容疑者たちも、それぞれの利害関係から噂の拡散に関与していました。野村医師は経営難のクリニックを救うための代替療法を宣伝し、青山活動家は資金難の団体の知名度を上げるためにメディア露出を求め、石原教授は研究の注目度向上のために一部誇張した発言をしていました。しかし、科学的証拠はワクチンにマイクロチップが含まれているという主張を明確に否定しています。",
    scienceExplanation: "この事件は「両論併記主義」による偽りの対等性がもたらす科学コミュニケーションの問題を浮き彫りにしています。科学的に確立された事実と根拠のない主張が、メディアで同等の扱いを受けることで生じる誤解です。マイクロチップ技術の現状では、ワクチンに混入できるほど小型で、電源なしで動作し、遠隔通信できるデバイスは存在しません。また、実際のワクチン成分分析結果が示すように、全成分は公開情報と一致しています。一方で、認知バイアスの一種である「権威バイアス」も重要な役割を果たしています。石原教授のような専門家の発言が文脈から切り離されて引用されると、本来の意味とは異なる「権威による裏付け」として機能してしまうのです。さらに、社会的にはワクチン接種率の低下がもたらす「集団免疫」の喪失という公衆衛生上の重大なリスクも、科学的に重要な論点です。"
  },
  
  // ミニゲーム
  miniGame: {
    type: "vaccine-puzzle",
    description: "ワクチンの実際の成分と働きを理解するパズル。様々な成分を正しく組み合わせて免疫応答を引き起こし、マイクロチップの存在が物理的・機能的に不可能であることを実証する。",
    difficulty: {
      easy: "基本的な免疫反応と抗原提示の仕組みを理解する初級モード。",
      medium: "ワクチン成分の詳細な役割と、電子機器の最小サイズとの比較検証が含まれる中級モード。",
      hard: "複雑な免疫学的概念と、マイクロデバイスの電源・通信要件の技術的限界を考慮した高度な分析が必要な上級モード。"
    }
  },

  // 陰謀論ミステリー編の追加要素
  relationshipMap: {
    nodes: [
      { id: "blogger", type: "suspect", label: "田代健太", details: "健康ブロガー", discovered: true },
      { id: "professor", type: "suspect", label: "石原正樹", details: "医工学教授", discovered: true },
      { id: "activist", type: "suspect", label: "青山美咲", details: "医療人権活動家", discovered: true },
      { id: "doctor", type: "suspect", label: "野村聡", details: "開業医", discovered: true },
      { id: "anonymous-guide", type: "suspect", label: "匿名ガイド", details: "アイリスと名乗る謎の存在", discovered: false },
      { id: "vaccine", type: "evidence", label: "ワクチン", details: "噂の対象となっている医薬品", discovered: true },
      { id: "microchip", type: "concept", label: "マイクロチップ技術", details: "現在の技術的限界", discovered: false },
      { id: "herd-immunity", type: "concept", label: "集団免疫", details: "公衆衛生における重要概念", discovered: false },
      { id: "misinformation-spread", type: "event", label: "誤情報の拡散", details: "SNSなどでの情報拡散プロセス", discovered: true },
      { id: "vaccination-rate", type: "event", label: "ワクチン接種率低下", details: "噂による公衆衛生上の影響", discovered: true }
    ],
    edges: [
      { source: "blogger", target: "professor", type: "uses", strength: 0.8, discovered: false },
      { source: "blogger", target: "misinformation-spread", type: "causes", strength: 0.9, discovered: false },
      { source: "professor", target: "microchip", type: "researches", strength: 0.7, discovered: false },
      { source: "activist", target: "misinformation-spread", type: "influences", strength: 0.6, discovered: false },
      { source: "doctor", target: "vaccination-rate", type: "influences", strength: 0.7, discovered: false },
      { source: "anonymous-guide", target: "blogger", type: "controls", strength: 0.9, discovered: false },
      { source: "misinformation-spread", target: "vaccination-rate", type: "causes", strength: 0.8, discovered: true },
      { source: "vaccine", target: "microchip", type: "incompatible", strength: 0.9, discovered: false },
      { source: "vaccination-rate", target: "herd-immunity", type: "affects", strength: 0.9, discovered: false },
      { source: "anonymous-guide", target: "misinformation-spread", type: "designs", strength: 0.9, discovered: false }
    ]
  },

  backstoryPrediction: {
    suspectKeywords: {
      "blogger": ["アフィリエイト収入", "医学部不合格", "音声ファイル", "操作される恐怖", "アイリスの指示", "暗号メッセージ"],
      "professor": ["研究誤用", "文脈無視引用", "メディア誇張", "研究資金増加", "技術的限界", "センセーショナル発言"],
      "activist": ["臨床試験被害", "活動資金不足", "匿名アカウント", "メディア露出", "出版契約", "二重基準"],
      "doctor": ["クリニック経営難", "高額代替療法", "医師会批判", "匿名ウェブサイト", "患者誘導", "根拠薄い治療"]
    }
  },

  ethicalChoices: {
    title: "真実と公衆衛生のジレンマ",
    description: "ワクチンに関する陰謀論が科学的根拠を持たないことが判明しました。しかし、真実を積極的に広めることで、医療機関への不信感を抱いている人々がさらに疎外感を感じる可能性があります。",
    truthOption: {
      text: "科学的証拠を前面に出し、陰謀論の誤りを積極的に広める",
      impact: {
        socialTrust: -15,
        scienceTrust: +25
      }
    },
    stabilityOption: {
      text: "懸念を持つ人々の不安に寄り添いながら、段階的に科学的事実を伝える",
      impact: {
        socialTrust: +15,
        scienceTrust: -10
      }
    }
  },

  socialThemes: [
    {
      title: "科学不信と陰謀論の経済的・社会的コスト",
      description: "科学的な医療情報への不信が広がると、公衆衛生上の深刻な影響をもたらし、社会全体に経済的・健康的コストが発生する。"
    },
    {
      title: "専門知識の「エリート主義」批判と一般市民の疎外感",
      description: "専門家の言葉が理解しづらく権威的に感じられることで、一般市民が疎外感を抱き、代替的な「わかりやすい」説明に惹かれる心理メカニズム。"
    },
    {
      title: "メディアの両論併記主義がもたらす偽りの対等性",
      description: "科学的に確立された事実と根拠のない主張が同等に扱われることで、一般市民の判断がより困難になる現代メディアの問題。"
    }
  ]
};

export default episode2;
