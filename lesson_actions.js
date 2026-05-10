const z = 'z';
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

window.lessonActionSettings = {
    avatar: z,
	sequence: [
		{ type: 'stepForward' , distance: 0.6, durationMs: 700 },
		{ type: 'speak', message: 'こんにちは！「カワハラ・アイ」です。今日は、私と一緒に、オープンキャンパスを楽しみましょう！' },
        { type: 'stepBack', distance: 0.6, durationMs: 700 }
	]
};
