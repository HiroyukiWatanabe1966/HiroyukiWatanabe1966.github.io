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
	avatar: 2,
	effectColor: '#ffb347',
	sequence: [
		{ type: 'effect0', color: '#ffb347', durationMs: 1200 },
		{ type: 'Greeting' },
		{ type: 'speak', message: 'こんにちは！私はカワハラ・アイです。今日は明るく、楽しく、私らしく自己紹介します！', waitMode: 1 },
		{ type: 'effect1', color: '#7ee7ff', durationMs: 1000 },
		{ type: 'speak', message: 'まずは一つ目のダンス！モモとヒメと散歩するときみたいに、元気いっぱい動きます！', waitMode: 0 },
		{ type: 'Hip Hop Dancing', durationMs: 8000 },
		{ type: 'speak', message: '二つ目のダンスです！やさしさとねばり強さをこめて、もう一回楽しくいきます！', waitMode: 0 },
		{ type: 'Breakdance Freezes', durationMs: 8000 },
		{ type: 'effect2', color: '#ffd86b', durationMs: 1200 },
		{ type: 'speak', message: '私の好きな時間は、ポメのモモとチワワのヒメとの散歩です。ふたりと歩いていると、毎日が小さな冒険みたいで、自然と笑顔になります。', waitMode: 1 },
		{ type: 'speak', message: '私の長所は、明るくて人にやさしいところです。それから気が長くて、あまり怒らないところ。まわりの人が安心できる存在になりたいです。', waitMode: 1 },
		{ type: 'speak', message: 'これからは生成AIの勉強をがんばりたいです。河原電子ビジネス専門学校に入って、新しい技術を学び、楽しいアイデアを形にしていきます！', waitMode: 0 },
		{ type: 'Walking', durationMs: 6500, speed: 0.32, turnAngle: 18 },
		{ type: 'Spin once' },
		{ type: 'speak', message: '明るく、やさしく、全力前進！', waitMode: 0 },
		{ type: 'Peace Sign', durationMs: 5000 }
	]
};
