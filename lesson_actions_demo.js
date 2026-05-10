// デモ用のアクションシーケンス
// ここでは、READMEに掲載している基本アクションと基本アニメーションのコマンドを紹介するシーケンスを定義しています。
// 全再生時間：約5分10秒

const demoZ = 'z';
const demoAvatar = 0;

window.lessonActionDemoSettings = {
    avatar: demoAvatar,
	effectColor: '#60d8ff',
	sequence: [
		// 紹介: はじめのあいさつ
		{ type: 'speak', message: 'こんにちは！\n私の名前は「カワハラ アイ」です。\nよろしくお願いします！', waitMode: 1 },
		// 紹介: デモ開始説明
		{ type: 'speak', message: '今から基本アクションと基本アニメーションのコマンドをひとつずつ紹介します。', waitMode: 1 },

		// 紹介: bow
		{ type: 'speak', message: '今からbowをします。', waitMode: 1 },
		{ type: 'bow', durationMs: 1500 },

		// 紹介: speak waitMode 1
		{ type: 'speak', message: '今からspeakのwaitMode 1をします。', waitMode: 1 },
		{ type: 'speak', message: 'waitMode 1では、セリフが終わってから次のコマンドへ進みます。', waitMode: 1 },
		// 紹介: speak waitMode 0
		{ type: 'speak', message: '今からspeakのwaitMode 0をします。', waitMode: 1 },
		{ type: 'speak', message: 'speakのwaitMode:0では、次のコマンドに進みセリフを最後まで再生します。', waitMode: 0 },
		{ type: 'Hip Hop Dancing', durationMs: 7300 },
		// 紹介: wait
		{ type: 'speak', message: '今からwaitをします。', waitMode: 1 },
		{ type: 'wait', durationMs: 5000 },

		// 紹介: effect0
		{ type: 'speak', message: '今からeffect0をします。', waitMode: 1 },
		{ type: 'effect0', color: '#60d8ff', durationMs: 1400 },
		// 紹介: effect1
		{ type: 'speak', message: '今からeffect1をします。', waitMode: 1 },
		{ type: 'effect1', color: '#60d8ff', durationMs: 1400 },
		// 紹介: effect2
		{ type: 'speak', message: '今からeffect2をします。', waitMode: 1 },
		{ type: 'effect2', color: '#60d8ff', durationMs: 1400 },

		// 紹介: avatar 0
		//{ type: 'speak', message: '今からアバターを0に変更します。', waitMode: 1 },
		//{ type: 'avatar', avatar: 0 },
		//{ type: 'Standing Idle', durationMs: 3000 },
		// 紹介: avatar 1
		{ type: 'speak', message: '今からアバターを1に変更します。', waitMode: 1 },
		{ type: 'avatar', avatar: 1 },
		{ type: 'Standing Idle', durationMs: 3000 },
		// 紹介: avatar 2
		{ type: 'speak', message: '今からアバターを2に変更します。', waitMode: 1 },
		{ type: 'avatar', avatar: 2 },
		{ type: 'Standing Idle', durationMs: 3000 },
		// 紹介: avatar 3
		{ type: 'speak', message: '今からアバターを3に変更します。', waitMode: 1 },
		{ type: 'avatar', avatar: 3 },
		{ type: 'Standing Idle', durationMs: 3000 },
		// 紹介: avatar 4
		{ type: 'speak', message: '今からアバターを4に変更します。', waitMode: 1 },
		{ type: 'avatar', avatar: 4 },
		{ type: 'Standing Idle', durationMs: 3000 },
		// 紹介: avatar 5
		{ type: 'speak', message: '今からアバターを5に変更します。', waitMode: 1 },
		{ type: 'avatar', avatar: 5 },
		{ type: 'Standing Idle', durationMs: 3000 },
		// 紹介: avatar z
		{ type: 'speak', message: '今からアバターをzに変更します。', waitMode: 1 },
		{ type: 'avatar', avatar: demoZ },
		{ type: 'Standing Idle', durationMs: 3000 },
		// アバター紹介後はシーケンス最初のavatarへ戻します。
		{ type: 'avatar', avatar: demoAvatar },

		// 紹介: Walking
		{ type: 'speak', message: '今からWalkingをします。', waitMode: 1 },
		{ type: 'Walking', durationMs: 5000, speed: 0.62, turnAngle: 0 },
		// 紹介: Slow Run
		{ type: 'speak', message: '今からSlow Runをします。', waitMode: 1 },
		{ type: 'Slow Run', durationMs: 5000, speed: 1.2, turnAngle: 0 },
		// 紹介: walkForward
		{ type: 'speak', message: '今からwalkForwardをします。', waitMode: 1 },
		{ type: 'walkForward', durationMs: 5000, speed: 0.62, turnAngle: 0 },
		// 紹介: walkBack
		{ type: 'speak', message: '今からwalkBackをします。', waitMode: 1 },
		{ type: 'walkBack', durationMs: 5000, speed: 0.62, turnAngle: 0 },

		// VRMAのdurationMs: nullは、時間指定を省略した場合と同じく、モーションを1回そのまま再生します。
		// 紹介: Standing Idle
		{ type: 'speak', message: '今からStanding Idleをします。', waitMode: 1 },
		{ type: 'Standing Idle', durationMs: 5000 },
		// 紹介: Talking
		{ type: 'speak', message: '今からTalkingをします。', waitMode: 1 },
		{ type: 'Talking', durationMs: null },

		// 紹介: Show Body
		{ type: 'speak', message: '今からShow Bodyをします。', waitMode: 1 },
		{ type: 'Show Body' },
		// 紹介: Greeting
		{ type: 'speak', message: '今からGreetingをします。', waitMode: 1 },
		{ type: 'Greeting' },
		// 紹介: Peace Sign
		{ type: 'speak', message: '今からPeace Signをします。', waitMode: 1 },
		{ type: 'Peace Sign', durationMs: 5000 },
		// 紹介: Shoot
		{ type: 'speak', message: '今からShootをします。', waitMode: 1 },
		{ type: 'Shoot' },
		// 紹介: Model Pose
		{ type: 'speak', message: '今からModel Poseをします。', waitMode: 1 },
		{ type: 'Model Pose' },

		// 紹介: Jump
		{ type: 'speak', message: '今からJumpをします。', waitMode: 1 },
		{ type: 'Jump' },
		// 紹介: Cross Jumps
		{ type: 'speak', message: '今からCross Jumpsをします。', waitMode: 1 },
		{ type: 'Cross Jumps' },
		// 紹介: Squat
		{ type: 'speak', message: '今からSquatをします。', waitMode: 1 },
		{ type: 'Squat' },
		// 紹介: Backflip
		{ type: 'speak', message: '今からBackflipをします。', waitMode: 1 },
		{ type: 'Backflip' },
		// 紹介: Cartwheel
		{ type: 'speak', message: '今からCartwheelをします。', waitMode: 1 },
		{ type: 'Cartwheel' },
		// 紹介: Combo Punch
		{ type: 'speak', message: '今からCombo Punchをします。', waitMode: 1 },
		{ type: 'Combo Punch' },
		// 紹介: Mma Kick
		{ type: 'speak', message: '今からMma Kickをします。', waitMode: 1 },
		{ type: 'Mma Kick' },
		// 紹介: Hip Hop Dancing
		{ type: 'speak', message: '今からHip Hop Dancingをします。', waitMode: 1 },
		{ type: 'Hip Hop Dancing', durationMs: null },
		// 紹介: Breakdance Freezes
		{ type: 'speak', message: '今からBreakdance Freezesをします。', waitMode: 1 },
		{ type: 'Breakdance Freezes', durationMs: null },
		// 紹介: Golf Drive
		{ type: 'speak', message: '今からGolf Driveをします。', waitMode: 1 },
		{ type: 'Golf Drive' },

		// 紹介: Left Turn
		{ type: 'speak', message: '今からLeft Turnをします。', waitMode: 1 },
		{ type: 'Left Turn' },
		// 紹介: Right Turn
		{ type: 'speak', message: '今からRight Turnをします。', waitMode: 1 },
		{ type: 'Right Turn' },
		// 紹介: Spin once
		{ type: 'speak', message: '今からSpin onceをします。', waitMode: 1 },
		{ type: 'Spin once' },
		// 紹介: Spin twice
		{ type: 'speak', message: '今からSpin twiceをします。', waitMode: 1 },
		{ type: 'Spin twice' },

		// 紹介終了
		{ type: 'speak', message: 'これで、全てのコマンドの紹介を終わります。\n最後まで見てくれてありがとうございました！', waitMode: 1 }
	]
};
