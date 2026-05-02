// オープンキャンパス体験授業用ファイルです。
// みなさんは、Copilotを使ってこのファイルだけを編集します。
//
//
// 最初に表示するアバター:
//   下の avatar の数字を 0 から 5 の間、または z に変更できます。
//   例: avatar: 0 なら Avatar_0.vrm、avatar: 5 なら Avatar_5.vrm を表示します。
//   例: avatar: z なら Avatar_z.vrm を表示します。
//
// sequenceには、上から順番にキャラクターにやらせたい動きを書きます。
// 文字だけで書けるものと、{ }で細かく指定できるものがあります。
//
// sequenceで使える基本の動き:
//      'stepForward'      少し前に進む
//      'stepBack'         少し後ろに下がる
//      'bow'              おじぎする
//      'speak'            セリフを話す
//      'effect'           光の演出を出す
//      'wait'             指定した時間だけ待つ
//      'avatar'           アバターを変更する
//
// sequenceで使えるアニメーション:
//      'Walking'          歩く
//      'Slow Run'         走る
//      'Cross Jumps'      クロスジャンプ
//      'Hip Hop Dancing'  ヒップホップダンス
//      'Jump'             その場でジャンプ
//      'Left Turn'        左ターン
//      'Right Turn'       右ターン
//      'Spin In Place'    その場でスピン
//      'Standing Idle'    待機モーション
//      'Talking'          話すときのモーション
//
// Walking と Slow Run は、次の3つの引数で動きを調整できます。
//
// durationMs:
//   移動時間です。1000で1秒です。
//   例: durationMs: 3000 なら3秒間移動します。
//   省略した場合は、Walking も Slow Run も 3000 になります。
//
// speed:
//   1秒あたりに進む距離です。
//   省略した場合は、Walking は 0.62、Slow Run は 1.8 になります。
//   値を大きくすると速く進み、小さくするとゆっくり進みます。
//
// turnAngle:
//   移動している間に、Y軸方向へ少しずつ向きを変える角度です。
//   単位は「度」です。
//   例: turnAngle: 90 なら、移動が終わるまでに90度向きが変わります。
//   逆方向に曲がらせたいときは、turnAngle: -90 のようにマイナスにします。
//
// Walking / Slow Run の書き方の例:
// { type: 'Walking', durationMs: 3000, speed: 0.62, turnAngle: 0 }
// { type: 'Walking', durationMs: 4000, speed: 0.8, turnAngle: 45 }
// { type: 'Slow Run', durationMs: 5000, speed: 1.8, turnAngle: -90 }
//
// walkForward と walkBack は、Walkingを使うための短い書き方です。
// こちらにも durationMs、speed、turnAngle を指定できます。
// { type: 'walkForward', durationMs: 3000, speed: 0.62, turnAngle: 0 }
// { type: 'walkBack', durationMs: 2000, speed: 0.5, turnAngle: 0 }
//
// その他の書き方の例:
// { type: 'stepForward', distance: 0.55, durationMs: 700 }         // 少し前進
// { type: 'stepBack', distance: 0.55, durationMs: 700 }            // 少し後退
// { type: 'bow', durationMs: 1500 }                                // おじぎ
// { type: 'effect', color: '#ff8bd1', durationMs: 1400 }         // 演出
// { type: 'wait', durationMs: 800 }                                // 待つ
// { type: 'speak', message: 'ここに直接セリフを書いてください。' } // 話す
// { type: 'avatar', avatar: 3 }                                    // Avatar_3.vrmに変更
// { type: 'avatar', avatar: z }                                    // Avatar_z.vrmに変更
// 'Jump'
// 'Spin In Place'
const z = 'z';
window.lessonActionSettings = {
    avatar: z,
	sequence: [
		'stepForward',
		'bow',
		{ type: 'speak', message: 'こんにちは！「カワハラ・アイ」です。今日は、私と一緒に、オープンキャンパスを楽しみましょう！' },
        'bow',
		'stepBack'
	]
};
