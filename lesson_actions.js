// デモ用のアクションシーケンス
// ここでは、基本的なアクションとアニメーションの全てのコマンドを紹介するシーケンスを定義しています。
// 全再生時間：約5分45秒


const z = 'z';

window.lessonActionSettings = {
    avatar: 2,
	effectColor: '#60d8ff',
	sequence: [
		// 紹介: はじめのあいさつ
		{ type: 'speak', message: 'こんにちは！\n私の名前は「カワハラ アイ」です。\nよろしくお願いします！', rate: 1.8, typeDurationMs: 150, waitMode: 1 },
		// 紹介: デモ開始説明
		{ type: 'speak', message: '今から基本アクションと基本アニメーションのコマンドをひとつずつ紹介します。', rate: 1.8, typeDurationMs: 150, waitMode: 1 },

		// 紹介: stepForward
		{ type: 'speak', message: '今からstepForwardをします。', rate: 1.8, typeDurationMs: 150, waitMode: 1 },
		{ type: 'stepForward', distance: 5.00, durationMs: 5000 },
		// 紹介: stepBack
		{ type: 'speak', message: '今からstepBackをします。', rate: 1.8, typeDurationMs: 150, waitMode: 1 },
		{ type: 'stepBack', distance: 5.00, durationMs: 5000 },
		// 紹介: bow
		{ type: 'speak', message: '今からbowをします。', rate: 1.8, typeDurationMs: 150, waitMode: 1 },
		{ type: 'bow', durationMs: 1500 },

		// 紹介: speak waitMode 1
		{ type: 'speak', message: '今からspeakのwaitMode 1をします。', rate: 1.8, typeDurationMs: 150, waitMode: 1 },
		{ type: 'speak', message: 'waitMode 1では、セリフが終わってから次のアクションへ進みます。', rate: 1.8, typeDurationMs: 150, waitMode: 1 },
		// 紹介: speak waitMode 0
		{ type: 'speak', message: '今からspeakのwaitMode 0をします。', rate: 1.8, typeDurationMs: 150, waitMode: 1 },
		{ type: 'speak', message: 'speakのwaitMode:0では、次のアクションに進みセリフを最後まで再生します。', rate: 1.8, typeDurationMs: 150, waitMode: 0 },
		{ type: 'Hip Hop Dancing', durationMs: 7300 },
		// 紹介: wait
		{ type: 'speak', message: '今からwaitをします。', rate: 1.8, typeDurationMs: 150, waitMode: 1 },
		{ type: 'wait', durationMs: 5000 },

		// 紹介: effect0
		{ type: 'speak', message: '今からeffect0をします。', rate: 1.8, typeDurationMs: 150, waitMode: 1 },
		{ type: 'effect0', color: '#60d8ff', durationMs: 1400 },
		// 紹介: effect1
		{ type: 'speak', message: '今からeffect1をします。', rate: 1.8, typeDurationMs: 150, waitMode: 1 },
		{ type: 'effect1', color: '#60d8ff', durationMs: 1400 },
		// 紹介: effect2
		{ type: 'speak', message: '今からeffect2をします。', rate: 1.8, typeDurationMs: 150, waitMode: 1 },
		{ type: 'effect2', color: '#60d8ff', durationMs: 1400 },

		// 紹介: avatar 0
		{ type: 'speak', message: '今からアバターを0に変更します。', rate: 1.8, typeDurationMs: 150, waitMode: 1 },
		{ type: 'avatar', avatar: 0 },
		{ type: 'Standing Idle', durationMs: 3000 },
		// 紹介: avatar 1
		{ type: 'speak', message: '今からアバターを1に変更します。', rate: 1.8, typeDurationMs: 150, waitMode: 1 },
		{ type: 'avatar', avatar: 1 },
		{ type: 'Standing Idle', durationMs: 3000 },
		// 紹介: avatar 2
		{ type: 'speak', message: '今からアバターを2に変更します。', rate: 1.8, typeDurationMs: 150, waitMode: 1 },
		{ type: 'avatar', avatar: 2 },
		{ type: 'Standing Idle', durationMs: 3000 },
		// 紹介: avatar 3
		{ type: 'speak', message: '今からアバターを3に変更します。', rate: 1.8, typeDurationMs: 150, waitMode: 1 },
		{ type: 'avatar', avatar: 3 },
		{ type: 'Standing Idle', durationMs: 3000 },
		// 紹介: avatar 4
		{ type: 'speak', message: '今からアバターを4に変更します。', rate: 1.8, typeDurationMs: 150, waitMode: 1 },
		{ type: 'avatar', avatar: 4 },
		{ type: 'Standing Idle', durationMs: 3000 },
		// 紹介: avatar 5
		{ type: 'speak', message: '今からアバターを5に変更します。', rate: 1.8, typeDurationMs: 150, waitMode: 1 },
		{ type: 'avatar', avatar: 5 },
		{ type: 'Standing Idle', durationMs: 3000 },
		// 紹介: avatar z
		{ type: 'speak', message: '今からアバターをzに変更します。', rate: 1.8, typeDurationMs: 150, waitMode: 1 },
		{ type: 'avatar', avatar: z },
		{ type: 'Standing Idle', durationMs: 3000 },
		// アバター紹介後は標準のavatar 2へ戻します。
		{ type: 'avatar', avatar: 2 },

		// 紹介: Walking
		{ type: 'speak', message: '今からWalkingをします。', rate: 1.8, typeDurationMs: 150, waitMode: 1 },
		{ type: 'Walking', durationMs: 5000, speed: 0.62, turnAngle: 0 },
		// 紹介: Slow Run
		{ type: 'speak', message: '今からSlow Runをします。', rate: 1.8, typeDurationMs: 150, waitMode: 1 },
		{ type: 'Slow Run', durationMs: 5000, speed: 1.8, turnAngle: 0 },
		// 紹介: walkForward
		{ type: 'speak', message: '今からwalkForwardをします。', rate: 1.8, typeDurationMs: 150, waitMode: 1 },
		{ type: 'walkForward', durationMs: 5000, speed: 0.62, turnAngle: 0 },
		// 紹介: walkBack
		{ type: 'speak', message: '今からwalkBackをします。', rate: 1.8, typeDurationMs: 150, waitMode: 1 },
		{ type: 'walkBack', durationMs: 5000, speed: 0.62, turnAngle: 0 },

		// VRMAのdurationMs: nullは、時間指定を省略した場合と同じく、モーションを1回そのまま再生します。
		// 紹介: Standing Idle
		{ type: 'speak', message: '今からStanding Idleをします。', rate: 1.8, typeDurationMs: 150, waitMode: 1 },
		{ type: 'Standing Idle', durationMs: 5000 },
		// 紹介: Talking
		{ type: 'speak', message: '今からTalkingをします。', rate: 1.8, typeDurationMs: 150, waitMode: 1 },
		{ type: 'Talking', durationMs: null },

		// 紹介: Show Body
		{ type: 'speak', message: '今からShow Bodyをします。', rate: 1.8, typeDurationMs: 150, waitMode: 1 },
		{ type: 'Show Body', durationMs: null },
		// 紹介: Greeting
		{ type: 'speak', message: '今からGreetingをします。', rate: 1.8, typeDurationMs: 150, waitMode: 1 },
		{ type: 'Greeting', durationMs: null },
		// 紹介: Peace Sign
		{ type: 'speak', message: '今からPeace Signをします。', rate: 1.8, typeDurationMs: 150, waitMode: 1 },
		{ type: 'Peace Sign', durationMs: null },
		// 紹介: Shoot
		{ type: 'speak', message: '今からShootをします。', rate: 1.8, typeDurationMs: 150, waitMode: 1 },
		{ type: 'Shoot', durationMs: null },
		// 紹介: Model Pose
		{ type: 'speak', message: '今からModel Poseをします。', rate: 1.8, typeDurationMs: 150, waitMode: 1 },
		{ type: 'Model Pose', durationMs: null },

		// 紹介: Jump
		{ type: 'speak', message: '今からJumpをします。', rate: 1.8, typeDurationMs: 150, waitMode: 1 },
		{ type: 'Jump', durationMs: null },
		// 紹介: Cross Jumps
		{ type: 'speak', message: '今からCross Jumpsをします。', rate: 1.8, typeDurationMs: 150, waitMode: 1 },
		{ type: 'Cross Jumps', durationMs: null },
		// 紹介: Squat
		{ type: 'speak', message: '今からSquatをします。', rate: 1.8, typeDurationMs: 150, waitMode: 1 },
		{ type: 'Squat', durationMs: null },
		// 紹介: Hip Hop Dancing
		{ type: 'speak', message: '今からHip Hop Dancingをします。', rate: 1.8, typeDurationMs: 150, waitMode: 1 },
		{ type: 'Hip Hop Dancing', durationMs: null },

		// 紹介: Left Turn
		{ type: 'speak', message: '今からLeft Turnをします。', rate: 1.8, typeDurationMs: 150, waitMode: 1 },
		{ type: 'Left Turn', durationMs: null },
		// 紹介: Right Turn
		{ type: 'speak', message: '今からRight Turnをします。', rate: 1.8, typeDurationMs: 150, waitMode: 1 },
		{ type: 'Right Turn', durationMs: null },
		// 紹介: Spin once
		{ type: 'speak', message: '今からSpin onceをします。', rate: 1.8, typeDurationMs: 150, waitMode: 1 },
		{ type: 'Spin once', durationMs: null },
		// 紹介: Spin towice
		{ type: 'speak', message: '今からSpin towiceをします。', rate: 1.8, typeDurationMs: 150, waitMode: 1 },
		{ type: 'Spin towice', durationMs: null },

		// 紹介終了
		{ type: 'speak', message: 'これで、全てのコマンドの紹介を終わります。\n最後まで見てくれてありがとうございました！', rate: 1.8, typeDurationMs: 150, waitMode: 1 }
	]
};
