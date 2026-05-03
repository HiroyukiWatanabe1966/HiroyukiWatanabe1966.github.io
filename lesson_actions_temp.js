// オープンキャンパス体験授業用ファイルです。
// みなさんは、Copilotを使ってこのファイルだけを編集します。
//
// 最初に表示するアバター:
//   下の avatar の数字を 0 から 5 の間、または z に変更できます。
//   例: avatar: 0 なら Avatar_0.vrm、avatar: 5 なら Avatar_5.vrm を表示します。
//   例: avatar: z なら Avatar_z.vrm を表示します。
//
// sequenceには、上から順番にキャラクターにやらせたい動きを書きます。
// 文字だけで書けるものと、{ }で細かく指定できるものがあります。
// 詳細は配布した資料で確認してください。
const z = 'z';

window.lessonActionSettings = {
	avatar: 2,
	sequence: [
		{ type: 'stepForward', distance: 0.42, durationMs: 700 },
		{ type: 'bow', durationMs: 1500 },
		{ type: 'speak', message: 'こんにちは、カワハラ・アイです。今日は自然な動きで60秒、案内します。', rate: 1.8, typeDurationMs: 150, waitMode: 1},
		{ type: 'Standing Idle', durationMs: 3000 },
		{ type: 'speak', message: 'これから、歩きながら今日の体験授業でみなさんが何をするかをっ説明します。\nみなさんは、vscode開発環境で作業を進めます。また、GitHub Copilotを使って生成AIにキャラクタのアクション・シーケンスを作成させます。それでは体験してください！', rate: 1.8, typeDurationMs: 150, waitMode: 0},
		{ type: 'Walking', durationMs: 4500, speed: 0.55, turnAngle: 24 },
		{ type: 'Left Turn'},
		{ type: 'Walking', durationMs: 3000, speed: 0.55, turnAngle: 0 },
		{ type: 'Right Turn'},
		{ type: 'Walking', durationMs: 3000, speed: 0.55, turnAngle: 0 },
		{ type: 'Left Turn'},
		{ type: 'Walking', durationMs: 3000, speed: 0.55, turnAngle: 0 },
		{ type: 'Right Turn'},
		{ type: 'Walking', durationMs: 3000, speed: 0.55, turnAngle: 0 },
        { type: 'speak', message: '少し歩きながら、周りを見てみますね。', rate: 1.8 },
		{ type: 'Walking', durationMs: 5200, speed: 0.48, turnAngle: -60 },
		{ type: 'speak', message: 'これから、歩きながら今日の体験授業でみなさんが何をするかをっ説明します。\nみなさんは、vscode開発環境で作業を進めます。また、GitHub Copilotを使って生成AIにキャラクタのアクション・シーケンスを作成させます。それでは体験してください！', rate: 1.8, typeDurationMs: 150, waitMode: 0},
		{ type: 'stepBack', distance: 0.32, durationMs: 650 },
		{ type: 'Jump' },
		{ type: 'Cross Jumps' },
		{ type: 'speak', message: '楽しくなってきました。少しだけ踊ります。', rate: 1.8 },
		{ type: 'effect', color: '#7ee7ff', durationMs: 1300 },
		{ type: 'speak', message: 'これから、歩きながら今日の体験授業でみなさんが何をするかをっ説明します。\nみなさんは、vscode開発環境で作業を進めます。また、GitHub Copilotを使って生成AIにキャラクタのアクション・シーケンスを作成させます。それでは体験してください！', rate: 1.8, typeDurationMs: 150, waitMode: 0},
		{ type: 'Hip Hop Dancing', durationMs: 6800 },
        { type: 'avatar', avatar: 0 },
		{ type: 'Spin In Place'},
		{ type: 'Slow Run', durationMs: 4200, speed: 1.15, turnAngle: 90 },
		{ type: 'Walking', durationMs: 4600, speed: 0.46, turnAngle: -90 },
		{ type: 'speak', message: '最後は呼吸を整えて、ごあいさつします。', rate: 1.8 },
		{ type: 'Standing Idle', durationMs: 2500 },
		{ type: 'stepForward', distance: 0.22, durationMs: 550 },
		{ type: 'bow', durationMs: 1700 },
		{ type: 'speak', message: 'ありがとうございました。', rate: 1.2 }
	]
};
