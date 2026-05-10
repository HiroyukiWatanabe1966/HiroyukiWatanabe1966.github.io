# AI 3D Character Action Control 機能仕様
2026/5/1

## 1. システム概要

このシステムは、ブラウザ上の 3D 空間に VRM アバターを表示し、`Start Action` ボタンであらかじめ定義した動作シーケンスを再生する教材用アプリケーションです。画面左下の `Demo` ボタンでは、基本アクションと基本アニメーションを一通り紹介するデモシーケンスを再生できます。

受講者は主に `lesson_actions.js` を編集し、アバター、セリフ、歩行、ジャンプ、ダンス、エフェクトなどを組み合わせて、キャラクターの一連の演出を作成します。`index.html` と `main.js` は、3D 表示、VRM 読み込み、VRMA モーション再生、音声読み上げ、吹き出し表示、カメラ追従などの実行基盤を担当します。

## 2. ファイル構成

| パス | 役割 |
| --- | --- |
| `index.html` | ブラウザで開くメイン画面。A-Frame のシーン、カメラ、ライト、アバター表示位置、開始ボタン、外部ライブラリ読み込みを定義します。 |
| `lesson_actions.js` | 授業・体験用の編集対象ファイル。`window.lessonActionSettings` にアバター番号、デフォルトエフェクト色、動作シーケンスを書きます。 |
| `lesson_actions_demo.js` | `Demo` ボタンで実行するデモ用ファイル。`window.lessonActionDemoSettings` に、コマンド紹介用のアバター番号、デフォルトエフェクト色、動作シーケンスを書きます。 |
| `lesson_actions_original.js` | 初期状態のサンプル設定。編集前の内容を確認したい場合の参照用です。 |
| `main.js` | 実行ロジック本体。VRM/VRMA 読み込み、動作シーケンス再生、音声読み上げ、吹き出し、カメラ追従、アニメーション変換を担当します。 |
| `.vscode/settings.json` | Live Server のホストとポート設定です。現在は `0.0.0.0:5500` で他端末からアクセスできる設定です。 |
| `assets/VRM/` | 表示できる VRM アバターを格納します。`Avatar_0.vrm` から `Avatar_5.vrm`、`Avatar_z.vrm` を利用できます。 |
| `assets/VRM/VRMキャラクタ一覧.jpg` | アバター確認用の画像です。実行時には読み込まれません。 |
| `assets/vrma/` | 実行時に読み込む VRMA モーションを格納します。`main.js` の `LESSON_ANIMATION_FILES` に登録されたファイルだけがシーケンスから直接指定できます。 |
| `assets/stage/` | 背景ステージ用の GLB モデルを格納します。現在は `corporate_event_stage_1k.glb` を読み込みます。 |
| `assets/fbx/` | 元モーション素材の FBX ファイル群です。実行時は通常 `assets/vrma/` の VRMA を使用します。 |
| `assets/VRMA_MotionPack/` | 追加モーションパックと説明ファイルです。`VRMA_01.vrma` から `VRMA_07.vrma` は英語のtype名にリネームしたコピーを `assets/vrma/` に配置し、`main.js` から直接指定できるようにしています。 |

## 3. 画面仕様

### 3.1 `index.html` の構成

| 要素 | 内容 |
| --- | --- |
| `<button id="startActionButton">` | 画面下中央に表示される開始・停止ボタンです。未実行時は `Start Action`、通常シーケンス実行中は `Stop`、デモ実行中は `Stop Demo` と表示されます。 |
| `<button id="demoActionButton">` | 画面左下に表示されるデモ開始ボタンです。クリックすると `lesson_actions_demo.js` のシーケンス再生が始まります。シーケンス実行中は無効化されます。 |
| `<a-scene stats ...>` | A-Frame の 3D シーン全体です。読み込み中画面とフレームレート統計表示が有効です。 |
| `<a-assets>` | ステージGLBなど、シーンで使う外部アセットを事前読み込みします。 |
| `<a-asset-item id="stageModel" ...>` | `assets/stage/corporate_event_stage_1k.glb` をステージモデルとして登録します。 |
| `<a-sky color="#111111">` | ステージ背景に合わせて暗い背景色を設定します。 |
| `<a-entity environment="preset: none; lighting: none;">` | A-Frame environment component の背景生成を使わない設定です。ライティングは独自ライトを使うため `none` です。 |
| `<a-entity gltf-model="#stageModel" ...>` | 登録した GLB ステージモデルをシーンに配置します。 |
| ambient light | 全体を弱く照らす環境光です。 |
| directional light | 斜め上から当たる主光源です。キャラクターの立体感を出します。 |
| `<a-entity vrm-model="...">` | VRM アバターを読み込むエンティティです。初期 `src` はありますが、起動時は `lesson_actions.js` の `avatar` 設定が優先されます。 |
| `<a-camera id="my_camera">` | 視点カメラです。シーケンス再生中はキャラクターの顔や体の向きに合わせて自動追従します。 |

`environment` の `preset` を変更すると、背景や地面の雰囲気を切り替えられます。ただし現在は GLB のステージモデルを背景として使うため、`preset: none` にしています。`lighting: none` は、environment component 側の自動ライトを使わず、このアプリで定義している ambient light と directional light を使う指定です。

| `preset` | 簡単な説明 |
| --- | --- |
| `none` | environment component の背景生成を使わない設定です。 |
| `default` | 標準的な空と地面の背景です。 |
| `contact` | 接地面を見せやすいシンプルな背景です。 |
| `egypt` | 砂漠・古代遺跡風の背景です。 |
| `checkerboard` | チェッカーボード柄の地面です。 |
| `forest` | 木や自然物のある森風の背景です。 |
| `goaland` | 低い丘や草地のような背景です。 |
| `yavapai` | 乾いた岩場・荒野風の背景です。 |
| `goldmine` | 鉱山・洞窟風の背景です。 |
| `threetowers` | 塔のような構造物がある背景です。 |
| `poison` | 毒々しい色合いのファンタジー風背景です。 |
| `arches` | アーチ状の構造物がある背景です。 |
| `tron` | ネオン調のサイバー風背景です。 |
| `japan` | 和風の雰囲気を持つ背景です。 |
| `dream` | 幻想的でやわらかい雰囲気の背景です。 |
| `volcano` | 火山・溶岩風の背景です。 |
| `starry` | 星空を強調した背景です。 |
| `osiris` | 神殿・遺跡風の背景です。 |
| `moon` | 月面のような背景です。 |

### 3.2 外部ライブラリ

`index.html` では CDN から以下を読み込みます。

| ライブラリ | 用途 |
| --- | --- |
| A-Frame 1.4.0 | Web ブラウザで 3D シーンを構築します。 |
| Three.js GLTFLoader | VRM/VRMA の元になる glTF データを読み込みます。 |
| `@pixiv/three-vrm` 1.0.0 | VRM モデルを Three.js 上で扱います。 |
| `aframe-environment-component` | 背景環境を作成します。 |

CDN を使うため、インターネット接続がない環境では初期読み込みに失敗します。

## 4. 実行方法

Live Server などのローカル HTTP サーバで開くことを推奨します。VRM/VRMA は `fetch` や `FileLoader` で読み込むため、`file://` で直接開くとブラウザの制限で失敗することがあります。

基本操作:

1. VS Code の Go Live などで `index.html` を配信します。
2. ブラウザでページを開きます。
3. VRM アバターの読み込みが完了するまで待ちます。
4. 画面下中央の `Start Action` ボタンを押します。
5. `lesson_actions.js` の `sequence` に書かれた動作が上から順番に再生されます。
6. シーケンス終了後、カメラはキャラクターを見やすい位置へ戻り、キャラクターは待機モーションに戻ります。

ボタン動作:

| 状態 | `Start Action` ボタン | `Demo` ボタン |
| --- | --- | --- |
| 未実行 | `Start Action` と表示されます。クリックすると `lesson_actions.js` のシーケンスを開始します。 | `Demo` と表示されます。クリックすると `lesson_actions_demo.js` のシーケンスを開始します。 |
| 通常シーケンス実行中 | `Stop` と表示されます。クリックすると実行中の `lesson_actions.js` シーケンスを途中停止します。 | 無効化され、クリックできません。 |
| デモシーケンス実行中 | `Stop Demo` と表示されます。クリックすると実行中の `lesson_actions_demo.js` シーケンスを途中停止します。 | 無効化され、クリックできません。 |

途中停止した場合は、音声読み上げ、吹き出し、実行中アニメーション、エフェクトを停止し、キャラクターは `Standing Idle` に戻ります。その後、`Start Action` と `Demo` が再び受付状態になります。

`Start Action` と `Demo` の開始時には、それぞれの設定ファイルの `avatar` が先に反映されます。たとえば Demo 実行中にアバターを変更して途中停止したあとでも、次に `Start Action` を押すと `lesson_actions.js` の `avatar` に戻してから通常シーケンスを開始します。VRM がまだ読み込まれていない場合は、ボタンを押してもシーケンスは開始されず、コンソールに警告が出ます。

スマホから LAN 内の Go Live サーバにアクセスする場合、HTTP では A-Frame/ブラウザ側が VR や端末センサーの利用に HTTPS を要求することがあります。通常表示だけなら `Cancel` で閉じて操作できますが、VR/センサー利用まで確認する場合は HTTPS 配信が必要です。

## 5. 編集対象: `lesson_actions.js`

`lesson_actions.js` では、次の形式で設定します。

```js
const z = 'z';
window.lessonActionSettings = {
	avatar: 4,
	effectColor: '#60d8ff',
	sequence: [
		{ type: 'bow', durationMs: 1500 },
		{ type: 'speak', message: 'こんにちは。', waitMode: 1 },
		{ type: 'Walking', durationMs: 3000, speed: 0.62, turnAngle: 0 }
	]
};
```

### 5.1 設定項目

| キー | 内容 | 省略時 |
| --- | --- | --- |
| `avatar` | 最初に表示するアバターを指定します。 | `2` |
| `effectColor` | `effect0`, `effect1`, `effect2` アクションのデフォルト色です。各エフェクトの `color` が優先されます。 | `#60d8ff` |
| `sequence` | キャラクターに実行させる動作の配列です。 | アプリ内部のデフォルトシーケンス |

セリフは各 `speak` ステップに直接 `message`, `waitMode` を指定します。

### 5.2 `avatar`

最初に表示するアバターを指定します。

| 指定例 | 読み込まれるファイル |
| --- | --- |
| `0` | `assets/VRM/Avatar_0.vrm` |
| `1` | `assets/VRM/Avatar_1.vrm` |
| `2` | `assets/VRM/Avatar_2.vrm` |
| `3` | `assets/VRM/Avatar_3.vrm` |
| `4` | `assets/VRM/Avatar_4.vrm` |
| `5` | `assets/VRM/Avatar_5.vrm` |
| `z` または `'z'` | `assets/VRM/Avatar_z.vrm` |

通常は `0` から `5`、または `z` を指定してください。

### 5.3 `sequence`

`sequence` はキャラクターに実行させる動作の配列です。上から順番に実行されます。

短く書く場合は文字列で、パラメータを指定する場合は `{ type: 'speak', ... }` のようなオブジェクトで書きます。

```js
sequence: [
	'bow',
	{ type: 'speak', message: 'こんにちは。', waitMode: 1 },
	'Jump'
]
```

未知の `type` が指定された場合は、コンソールに警告を出してそのステップをスキップします。

### 5.4 `lesson_actions_demo.js`

`lesson_actions_demo.js` は、画面左下の `Demo` ボタンで実行するデモ用シーケンスです。通常の `Start Action` で使う `lesson_actions.js` とは別に読み込まれます。

`lesson_actions_demo.js` では、通常用の `window.lessonActionSettings` ではなく、次のように `window.lessonActionDemoSettings` を使います。

```js
window.lessonActionDemoSettings = {
	avatar: 2,
	effectColor: '#60d8ff',
	sequence: [
		{ type: 'speak', message: 'デモを開始します。', waitMode: 1 },
		{ type: 'Walking', durationMs: 3000, speed: 0.62, turnAngle: 0 }
	]
};
```

設定できる `avatar`, `effectColor`, `sequence` の意味は `lesson_actions.js` と同じです。`Start Action` は `lesson_actions.js` を実行し、`Demo` は `lesson_actions_demo.js` を実行します。

## 6. アクション仕様

### 6.1 基本アクション

基本アクションは、VRMA ファイルを指定せず、`main.js` の処理でキャラクターの位置、姿勢、表示演出、待ち時間、アバター変更を制御するアクションです。`speak` は `waitMode: 1` のときだけ、セリフ中の身振りとして `Talking.vrma` を内部的にループ再生します。

**姿勢**

| `type` | 内容 | 推奨パラメータ | 省略時の値 | VRMA 再生 |
| --- | --- | --- | --- | --- |
| `bow` | 背骨、胸、頭を傾けておじぎします。 | `durationMs` | `1500` | なし |

**セリフ・待機**

| `type` | 内容 | 推奨パラメータ | 省略時の値 | VRMA 再生 |
| --- | --- | --- | --- | --- |
| `speak` | セリフを音声読み上げし、頭付近に吹き出しを表示します。 | `message`, `waitMode` | `message: 'こんにちは！'`, `waitMode: 1` | `waitMode: 1` のとき `Talking.vrma` をループ再生 |
| `wait` | 指定時間だけ何もせず待ちます。 | `durationMs` | `1000` | なし |

**エフェクト**

| `type` | 内容 | 推奨パラメータ | 省略時の値 | VRMA 再生 |
| --- | --- | --- | --- | --- |
| `effect0` | A-Frame空間内に、全身を包むホログラムスキャンを表示します。 | `color`, `durationMs` | `color: effectColor`, `durationMs: 1400` | なし |
| `effect1` | A-Frame空間内に、頭付近から広がる3Dエネルギーバーストを表示します。 | `color`, `durationMs` | `color: effectColor`, `durationMs: 1400` | なし |
| `effect2` | A-Frame空間内に、足元から広がる3Dショックウェーブと光柱を表示します。 | `color`, `durationMs` | `color: effectColor`, `durationMs: 1400` | なし |

**アバター**

| `type` | 内容 | 推奨パラメータ | 省略時の値 | VRMA 再生 |
| --- | --- | --- | --- | --- |
| `avatar` | シーケンス途中でアバターを変更します。 | `avatar` | なし | なし |

基本アクションのうち、実行中にVRMAを本再生する可能性があるのは `speak` だけです。`speak` でも `waitMode: 0` の場合は `Talking.vrma` を再生しません。`bow`, `effect0`, `effect1`, `effect2`, `wait`, `avatar` はプログラム処理で動作します。

`effect0`, `effect1`, `effect2` はA-Frame空間内の3Dオブジェクトとして生成されるため、カメラを動かすと3D空間上の位置関係も変わります。

すべてのアクションの切り替わりでは、前のアクションの最後の姿勢から、次のアクションの最初の姿勢へ `500ms` かけて補間します。`bow` の開始姿勢には `Standing Idle` の先頭姿勢を使います。

### 6.2 基本アニメーション

基本アニメーションは、VRM アバター用のモーションファイル `.vrma` を読み込んで再生するアクションです。基本アクションが `main.js` の計算で位置や姿勢を動かすのに対し、基本アニメーションはファイルに記録された全身モーションをアバターのボーンへ適用します。

以下の `type` は基本アニメーションとして扱われます。短く書く場合は `'Walking'` のような文字列で、パラメータを指定する場合は `{ type: 'Walking', ... }` のようなオブジェクトで書きます。

**移動**

| `type` | ファイル | 内容 | 推奨パラメータ | 省略時の値 |
| --- | --- | --- | --- | --- |
| `Walking` | `Walking.vrma` | 歩行モーション | `durationMs`, `speed`, `turnAngle` | `durationMs: 3000`, `speed: 0.62`, `turnAngle: 0` |
| `Slow Run` | `Slow Run.vrma` | 走るモーション | `durationMs`, `speed`, `turnAngle` | `durationMs: 3000`, `speed: 1.2`, `turnAngle: 0` |
| `walkForward` | `Walking.vrma` | `Walking` を前方向に再生しながら移動します。 | `durationMs`, `speed`, `turnAngle` | `durationMs: 3000`, `speed: 0.62`, `turnAngle: 0` |
| `walkBack` | `Walking.vrma` | `Walking` を逆再生しながら後退します。 | `durationMs`, `speed`, `turnAngle` | `durationMs: 3000`, `speed: 0.62`, `turnAngle: 0` |

**待機・会話**

| `type` | ファイル | 内容 | 推奨パラメータ | 省略時の値 |
| --- | --- | --- | --- | --- |
| `Standing Idle` | `Standing Idle.vrma` | 待機モーション | `durationMs` | モーションを1回再生 |
| `Talking` | `Talking.vrma` | 会話中モーション | `durationMs` | モーションを1回再生 |

**ポーズ・ジェスチャー**

| `type` | ファイル | 内容 | 推奨パラメータ | 省略時の値 |
| --- | --- | --- | --- | --- |
| `Show Body` | `Show Body.vrma` | 全身を見せるポーズ | なし *1 | モーションを1回再生 |
| `Greeting` | `Greeting.vrma` | 挨拶モーション | なし *1 | モーションを1回再生 |
| `Peace Sign` | `Peace Sign.vrma` | Vサイン、ピースサイン | `durationMs` | `durationMs: 5000` |
| `Shoot` | `Shoot.vrma` | 撃つポーズ | なし *1 | モーションを1回再生 |
| `Model Pose` | `Model Pose.vrma` | モデルポーズ | なし *1 | モーションを1回再生 |

**ジャンプ・運動**

| `type` | ファイル | 内容 | 推奨パラメータ | 省略時の値 |
| --- | --- | --- | --- | --- |
| `Jump` | `Jump.vrma` | 1回ジャンプ | なし *1 | モーションを1回再生 |
| `Cross Jumps` | `Cross Jumps.vrma` | クロスジャンプ | なし *1 | モーションを1回再生 |
| `Squat` | `Squat.vrma` | 屈伸運動 | なし *1 | モーションを1回再生 |
| `Backflip` | `Backflip.vrma` | バク転 | なし *1 | モーションを1回再生 |
| `Cartwheel` | `Cartwheel.vrma` | 側転 | なし *1 | モーションを1回再生 |
| `Combo Punch` | `Combo Punch.vrma` | パンチ | なし *1 | モーションを1回再生 |
| `Mma Kick` | `Mma Kick.vrma` | キック | なし *1 | モーションを1回再生 |
| `Hip Hop Dancing` | `Hip Hop Dancing.vrma` | ヒップホップダンス | `durationMs` | モーションを1回再生 |
| `Breakdance Freezes` | `Breakdance Freezes.vrma` | ブレイクダンス | `durationMs` | モーションを1回再生 |
| `Golf Drive` | `Golf Drive.vrma` | ゴルフ | なし *1 | モーションを1回再生 |

**回転・ターン**

| `type` | ファイル | 内容 | 推奨パラメータ | 省略時の値 |
| --- | --- | --- | --- | --- |
| `Left Turn` | `Left Turn.vrma` | 左ターン | なし *1 | モーションを1回再生 |
| `Right Turn` | `Right Turn.vrma` | 右ターン | なし *1 | モーションを1回再生 |
| `Spin once` | `Spin once.vrma` | 1回転するモーション | なし *1 | モーションを1回再生 |
| `Spin twice` | `Spin In Place.vrma` | 2回転するモーション | なし *1 | モーションを1回再生 |

使用者向けの推奨書式:

```js
'Walking'
{ type: 'Walking', durationMs: 3000 }
```

`durationMs` は基本アニメーションにも指定できます。`Walking`, `Slow Run`, `walkForward`, `walkBack` では移動時間として扱われます。その他の基本アニメーションでは次の動作になります。

| `durationMs` の状態 | 動作 |
| --- | --- |
| 未指定 | モーションを 1 回再生します。`Peace Sign` は例外として `durationMs: 5000` で再生します。 |
| クリップ長より短い | 指定時間で途中終了します。 |
| クリップ長より長い | 指定時間までモーションを繰り返します。 |

*1 : `Show Body`, `Greeting`, `Shoot`, `Model Pose`, `Jump`, `Cross Jumps`, `Squat`, `Backflip`, `Cartwheel`, `Combo Punch`, `Mma Kick`, `Golf Drive`, `Left Turn`, `Right Turn`, `Spin once`, `Spin twice` は `durationMs` パラメータを持ってはいますが、なるべく `durationMs` を指定しないでください。これらは比較的短いモーション、または開始時と終了時で位置・回転・姿勢の差が大きいモーションです。途中終了や繰り返しを行うと、前後のアクションとの姿勢差分が大きくなり、つなぎ目でキャラクターがちらついて見えやすくなります。ちらつきを防ぐため、これらはモーションを1回そのまま再生する使い方（`durationMs` を未指定）を推奨します。

### 6.3 移動つきアニメーション

`Walking`, `Slow Run`, `walkForward`, `walkBack` は、モーション再生に加えて、キャラクター本体の位置と向きをプログラム側で動かします。

| パラメータ | 内容 | 省略時 |
| --- | --- | --- |
| `durationMs` | 移動を続ける時間。`1000` が 1 秒です。 | `3000` |
| `speed` | 1 秒あたりの移動距離です。 | `Walking: 0.62`, `Slow Run: 1.2` |
| `turnAngle` | 移動中に曲がる角度です。単位は度です。正の値で右方向、負の値で左方向に回転します。 | `0` |

例:

```js
{ type: 'Walking', durationMs: 4000, speed: 0.8, turnAngle: 45 }
{ type: 'Slow Run', durationMs: 5000, speed: 1.2, turnAngle: -90 }
{ type: 'walkForward', durationMs: 3000, speed: 0.62, turnAngle: 0 }
{ type: 'walkBack', durationMs: 2000, speed: 0.5, turnAngle: 0 }
```

移動開始時と終了時は約 `500ms` の慣性補正が入り、速度がなめらかに変化します。

## 7. セリフ・吹き出し仕様

### 7.1 音声読み上げ

`speak` アクションでは、PCブラウザでは Web Speech API を使って日本語音声を読み上げます。スマホブラウザでは Web Speech API を使用せず、音声なしで吹き出し表示だけを進めます。

`speak` で指定できるパラメータ:

| パラメータ | 内容 | 省略時の値 |
| --- | --- | --- |
| `message` | 読み上げるセリフと吹き出しに表示する文字列です。 | `こんにちは！` |
| `waitMode` | セリフ完了を待って次へ進むか、待たずに次へ進むかを指定します。 | `1` |

| 項目 | 内容 |
| --- | --- |
| PCブラウザ | `speechSynthesis` と `SpeechSynthesisUtterance` が使える場合、Web Speech API で音声を再生します。 |
| スマホブラウザ | Web Speech API を呼び出しません。音声は再生せず、吹き出し文字のタイプライター表示だけを行います。 |
| 言語 | PCブラウザの音声読み上げでは `ja-JP` を指定します。 |
| 会話モーション | `waitMode: 1` では、PCブラウザ、スマホブラウザのどちらでも `speak` 中に `Talking.vrma` をループ再生します。`waitMode: 0` では `Talking.vrma` を再生せず、次のアクションを優先します。 |
| 開始処理 | PCブラウザでは音声の `onstart` 後に文字表示を開始します。スマホブラウザでは音声を待たずに文字表示を開始します。 |
| 完了処理 | `waitMode: 1` では、PCブラウザは音声の `onend` または `onerror` 後、文字表示が終わると次へ進みます。スマホブラウザでは文字表示が終わると次へ進みます。`waitMode: 0` では完了を待たずに次へ進みます。 |
| 非対応ブラウザ | `speechSynthesis` または `SpeechSynthesisUtterance` が存在しない場合も、スマホブラウザと同じく音声なしで吹き出し表示を進めます。 |

この仕様は、スマホブラウザで `speak` が途中停止することを避けるためのものです。スマホでは Web Speech API がユーザー操作制限や自動再生制限の影響を受けやすく、音声の `onstart` / `onend` が返らない場合があります。`speak` はこれらのイベントを待って次のシーケンスへ進むため、スマホで Web Speech API を使うとセリフ後の動作が止まる原因になります。

そのため、スマホブラウザでは最初から Web Speech API を使わず、音声なしで吹き出し表示とシーケンス進行を優先します。`waitMode: 1` では `Talking.vrma` も再生します。現在の実装では、スマホ向けの音声ファイル再生や外部 TTS API は使っていません。スマホでも実際に音声を出したい場合は、別途、音声ファイル再生方式や外部 TTS API を使った方式を追加してください。

### 7.2 speakのwaitModeについて

`waitMode` は、`speak` がセリフ完了を待ってから次へ進むか、待たずに次のアクションへ進むかを指定します。省略時は `waitMode: 1` です。

| `waitMode` | 動作 |
| --- | --- |
| `1` | セリフの文字表示と音声再生が終わるまで、次の sequence へ進みません。従来通り `Talking.vrma` をループ再生します。 |
| `0` | セリフの文字表示と音声再生の完了を待たず、すぐ次の sequence へ進みます。`Talking.vrma` は再生しません。 |

`waitMode: 0` では、吹き出しの文字表示と音声再生だけが継続します。キャラクターの動きは次の sequence のアクションを優先するため、歩行、ターン、ダンスなどの VRMA と `Talking.vrma` が同時にボーンを動かすことはありません。

`waitMode: 0` のセリフは、指定された `message` に従って完了します。セリフが長い場合は、後続の複数アクションにまたがって吹き出し表示や音声再生が続くことがあります。文字表示と音声再生の両方が終わると、吹き出しは自動的に消えます。

継続中の `waitMode: 0` セリフがある状態で新しい `speak` が実行された場合、古いセリフの吹き出しと音声は途中終了し、新しい `speak` が優先されます。`avatar` アクションでアバターを変更する場合も、継続中の吹き出しと音声は中断されます。

例:

```js
{ type: 'speak', message: '歩きながら説明します。', waitMode: 0 },
{ type: 'Walking', durationMs: 3000, speed: 0.55 }
```

### 7.3 吹き出し

セリフ中は、キャラクターの頭付近に白い吹き出しが表示されます。

| 項目 | 内容 |
| --- | --- |
| 表示位置 | VRM の `head` ボーンを画面座標に変換して追従します。`head` が取れない場合はキャラクター上方の固定高さを使います。 |
| 文字表示 | 音声読み上げが始まるタイミングに合わせて、タイプライター風に表示します。 |
| 改行 | 吹き出しの横幅に合わせて右端で自動的に折り返します。メッセージ内の `\n` は明示的な改行として扱います。 |
| 幅 | 通常は `560px` 幅で表示し、画面が狭い場合は画面端の余白に収まる幅まで縮小します。 |
| 画面端処理 | 画面外にはみ出さないように位置を補正します。 |

## 8. アバター変更仕様

初期アバターは `lesson_actions.js` の `avatar` が優先されます。`index.html` の `vrm-model="src: ..."` は初期値として書かれていますが、アプリ起動時に `lessonActionSettings.avatar` に合わせて差し替えられます。

シーケンス途中で変更する場合は、次のように書きます。

```js
{ type: 'avatar', avatar: 3 }
{ type: 'avatar', avatar: z }
```

通常は `avatar` に `0` から `5`、または `z` を指定してください。無効な値の場合は警告を出してスキップします。現在と同じ VRM が指定されている場合は、再読み込みせずに次のステップへ進みます。

VRM ファイルをパスで直接指定する場合は、開発者向けの指定として `src` に `.vrm` ファイルのパスを指定できます。

```js
{ type: 'avatar', src: './assets/VRM/Avatar_1.vrm' }
```

変更時には現在のアニメーションと吹き出しを停止し、新しい VRM の読み込み完了後に次のステップへ進みます。新しい VRM の読み込み中は、古いアバターを消さずに `Standing Idle` で表示し続けます。読み込みと初期化が完了した時点で、古いアバターを外して新しいアバターへ一度に差し替えます。

アバター変更前のキャラクター本体の位置、向き、スケールは新しいアバターへ引き継がれます。姿勢は、対応する VRM ボーンの回転を引き継ぎます。

アバター変更中はカメラ追従を一時停止し、読み込み完了後にカメラ位置と角度を変更前の状態へ戻します。その後、カメラ追従の内部ターゲットを新しいアバターの現在位置へ同期します。これにより、変更中にカメラがアバターの初期位置へ一瞬移動することを防ぎます。

読み込みに失敗した場合は、エラーをコンソールに出して次のステップへ進みます。

## 9. カメラ仕様

シーケンス再生中、カメラはキャラクターを自動追従します。

| 状態 | 動作 |
| --- | --- |
| シーケンス開始時 | 現在のカメラ位置を基準に、キャラクターの頭・顔方向を追います。 |
| 通常アクション中 | キャラクターの向きや位置に合わせて、滑らかに追従します。 |
| `waitMode: 1` の `speak` 中 | セリフが見やすいように、通常より少し近い距離で顔から上半身を狙います。 |
| ユーザ操作中 | マウス、タッチ、キーボードによる A-Frame のカメラ操作を優先し、自動追従によるカメラ上書きを一時停止します。 |
| 操作停止後 | 約 `800ms` 操作がなければ、現在のカメラ位置・向きから自動追従の目標位置へ滑らかに復帰します。 |
| シーケンス終了時 | キャラクターを見やすい位置へ滑らかに戻します。 |

再生中も A-Frame の `look-controls` と `wasd-controls` は利用できます。`look-controls` は主にマウスやタッチによる視点変更、`wasd-controls` は主にキーボードによるカメラ位置移動です。

この仕様は、演出中でも利用者が見たい角度へ一時的にカメラを動かせるようにするためのものです。ユーザ操作中は手動操作を優先し、操作していない間は既存の自動追従アルゴリズムへ戻します。自動追従でカメラ角度を更新した後は、次のマウス操作で視点が跳ばないように A-Frame の内部 `look-controls` 状態も同期します。

## 10. アニメーション処理仕様

### 10.1 VRMA 読み込み

VRMA ファイルは `assets/vrma/` から必要になったタイミングで読み込まれます。一度読み込んだモーションはキャッシュされ、同じ VRM の読み込み中は再利用されます。アバター変更などで VRM を再読み込みすると、モーションキャッシュも初期化されます。

読み込みに失敗した場合はコンソールにエラーを出し、そのアニメーションステップを完了扱いにして次へ進みます。

### 10.2 ボーン変換

VRMA 内の Mixamo 系ボーン名は、VRM の正規化ボーン名へ変換されます。`mixamorig:` や `mixamorig_` の接頭辞も取り除いて判定します。

例:

| Mixamo 名 | VRM 正規化ボーン |
| --- | --- |
| `Hips` | `hips` |
| `Spine` | `spine` |
| `Spine1` | `chest` |
| `Spine2` | `upperChest` |
| `Neck` | `neck` |
| `Head` | `head` |
| `LeftArm` | `leftUpperArm` |
| `RightForeArm` | `rightLowerArm` |
| `LeftUpLeg` | `leftUpperLeg` |
| `RightFoot` | `rightFoot` |

### 10.3 VRM0 / VRMA 変換

VRM 読み込み時、three-vrm の `VRMUtils.rotateVRM0` が使える場合は VRM0 モデルの向きを補正します。

VRMA から Three.js の `AnimationClip` を作るときは、VRM の身長とソースモーションの腰位置からスケールを推定し、腰の移動量を VRM サイズに合わせて変換します。

### 10.4 ポーズ補間

アクションの切り替わりでは、前のアクションの最後の姿勢から、次のアクションの最初の姿勢へ補間します。対象は基本アクションと基本アニメーションのすべての組み合わせです。たとえば、基本アクションから基本アニメーション、基本アニメーションから基本アクション、基本アクション同士、基本アニメーション同士のどの切り替わりでも補間が入ります。

| 条件 | 補間時間 |
| --- | --- |
| 通常のアクション切り替わり | `500ms` |
| `Hip Hop Dancing` の終了後 | `1000ms` |

`speak` は `waitMode: 1` のときだけ、次の開始姿勢として `Talking.vrma` の先頭姿勢を使います。`waitMode: 0` の `speak` はキャラクター動作を行わないため、現在姿勢を開始姿勢として扱います。`effect0`, `effect1`, `effect2`, `wait`, `avatar` も独自のボーン姿勢を持たないため、現在姿勢を開始姿勢として扱います。この場合もアクション境界の補間処理は通りますが、姿勢自体は変化しません。

補間はボーンの位置、回転、スケールに対して行います。キャラクター本体の位置や向きは、歩行処理やルートモーション反映処理で更新します。

`Hip Hop Dancing` は終了姿勢と次アクションの開始姿勢の差が大きくなりやすいため、終了後だけ `1000ms` の長めの補間を使います。

`main.js` にアクションを追加する場合、そのアクションが独自の開始姿勢を持つなら `getLessonStepStartPose` に開始姿勢取得処理を追加してください。`main.js` 側で姿勢や位置を変える基本アクションで、開始姿勢に `Standing Idle` の先頭姿勢を使う場合は `LESSON_BASIC_ACTION_START_POSE_TYPES` に追加します。

### 10.5 ルートモーション

通常の VRMA モーションでは、終了時に腰やルートの移動量・回転量をキャラクター本体へ反映します。これにより、モーションだけが動いて位置が戻るのではなく、キャラクターの実際の位置や向きも更新されます。

反映後は、終了時の見た目を保つように `Hips` の位置と回転を補正します。これにより、`Left Turn`、`Right Turn`、`Spin twice` など、モーション内にルート回転や水平移動を持つ VRMA でも、キャラクター本体と `Hips` に同じ動きが二重に適用されることを防ぎます。

`Walking` と `Slow Run` は、モーション素材の移動量ではなく、`speed` と `turnAngle` から計算した移動を使います。

### 10.6 待機モーション

アクションが実行されていない間は `Standing Idle` がループ再生されます。`waitMode: 1` の `speak` 中は `Talking` がループ再生されます。`waitMode: 0` の `speak` では `Talking` を再生しません。

VRM の読み込み直後、アバター変更後、シーケンス終了後には、待機モーションが再開されます。

## 11. 姿勢補正

アバター読み込み直後やシーケンス終了後には、腕を自然に下げる補正が `1000ms` かけて実行されます。

`Avatar_z.vrm` は通常の腕下げ補正をスキップし、専用の腕向き補正を使います。この専用補正は、アクション未実行時と `waitMode: 1` の `speak` 中に適用されます。

## 12. `vrm-model` コンポーネント仕様

`main.js` は A-Frame コンポーネント `vrm-model` を登録します。

| 項目 | 内容 |
| --- | --- |
| schema | `src` 文字列を受け取ります。 |
| 初期アバター反映 | 初回読み込み時だけ `lessonActionSettings.avatar` を優先して `src` を同期します。 |
| `src` 変更 | `vrm-model` の `src` が変わると VRM を再読み込みします。 |
| `#asset` 参照 | `src` が `#id` の場合、該当要素の `src` 属性を解決します。 |
| モデル正規化 | 読み込んだモデルを高さ `1.6` 相当にスケールし、足元が地面に来るように位置補正します。 |
| カリング | モデル配下の `frustumCulled` を `false` にし、判定ズレで消えにくくします。 |
| 成功イベント | `vrm-loaded` を発火します。`detail.vrm` に VRM オブジェクトが入ります。 |
| 失敗イベント | `vrm-load-error` を発火します。`detail.src` と `detail.error` が入ります。 |

必要な外部ライブラリが読み込まれていない場合は、`THREE.GLTFLoader is not loaded.` または `three-vrm is not loaded.` をコンソールに出して読み込みを中断します。

## 13. 実行フロー

1. `index.html` が外部ライブラリ、`lesson_actions.js`、`lesson_actions_demo.js`、`main.js` を読み込みます。
2. A-Frame が `vrm-model` コンポーネントを初期化します。
3. `main.js` が `lessonActionSettings.avatar` を読み取り、対象 VRM を読み込みます。
4. VRM 読み込み後、モデルを高さ `1.6` 相当に正規化し、シーンへ追加します。
5. アクション未実行時は腕補正と待機モーションを開始します。
6. `Start Action` ボタンが押されると、`lessonActionSettings.avatar` を反映してから `lessonActionSettings.sequence` が正規化されます。
7. `Demo` ボタンが押されると、`lessonActionDemoSettings.avatar` を反映してから `lessonActionDemoSettings.sequence` が正規化されます。
8. 各ステップを順番に実行します。
9. 各ステップ終了時にポーズ補間を行い、次のステップへ進みます。
10. 最後まで終わるとアニメーションを停止し、カメラを見やすい位置へ戻し、待機モーションへ戻ります。
11. `Stop` または `Stop Demo` が押された場合は、実行中のステップを中断し、音声、吹き出し、アニメーション、エフェクトを停止して待機モーションへ戻ります。

## 14. 動作確認観点

変更後は、以下を確認します。

| 確認項目 | 期待結果 |
| --- | --- |
| ページ表示 | ブラウザに 3D 空間、統計表示、`Start Action` ボタン、`Demo` ボタンが表示される。 |
| アバター表示 | `lesson_actions.js` の `avatar` に対応する VRM が表示される。 |
| 開始ボタン | VRM 読み込み後に `Start Action` をクリックすると `lesson_actions.js` の `sequence` の最初の動作が始まり、ボタン表示が `Stop` に変わる。 |
| 停止ボタン | 通常シーケンス実行中に `Stop` をクリックすると途中停止し、キャラクターが `Standing Idle` に戻り、ボタン表示が `Start Action` に戻る。 |
| Demoボタン | 未実行時に `Demo` をクリックすると `lesson_actions_demo.js` の `sequence` が始まり、`Demo` ボタンが無効化され、`Start Action` ボタン表示が `Stop Demo` に変わる。 |
| Demo停止 | デモ実行中に `Stop Demo` をクリックすると途中停止し、キャラクターが `Standing Idle` に戻り、`Demo` ボタンが有効化され、ボタン表示が `Start Action` に戻る。 |
| ボタン排他 | 通常シーケンス実行中もデモシーケンス実行中も、`Demo` ボタンは無効化される。 |
| 基本動作 | `bow`, `wait`, `effect0`, `effect1`, `effect2`, `avatar` が指定通りに完了する。 |
| セリフ | PCブラウザでは吹き出しが表示され、日本語音声が再生される。Web Speech API 非対応環境では音声なしで文字表示後に次へ進む。 |
| スマホ音声 | スマホブラウザでは Web Speech API を使用せず、音声なしで吹き出し表示後に次へ進む。 |
| VRMA | `Walking`, `Slow Run`, `Jump`, `Hip Hop Dancing`, `Greeting`, `Peace Sign`, `Squat` などが再生される。 |
| VRMA時間指定 | 非移動モーションも `durationMs` で短縮または繰り返しできる。ただし `Show Body`, `Greeting`, `Shoot`, `Model Pose`, `Jump`, `Cross Jumps`, `Squat`, `Backflip`, `Cartwheel`, `Combo Punch`, `Mma Kick`, `Golf Drive`, `Left Turn`, `Right Turn`, `Spin once`, `Spin twice` は、ちらつき防止のため `durationMs` を指定しない。`Peace Sign` は省略時 `durationMs: 5000` で再生される。 |
| 移動 | `Walking` / `Slow Run` / `walkForward` / `walkBack` の `speed` と `turnAngle` が反映される。 |
| アバター変更 | `avatar` アクションで別の VRM に切り替わり、次の動作へ進む。 |
| カメラ | 再生中はキャラクターを追い、終了後も見やすい位置へ戻る。 |
| カメラ手動操作 | 再生中にマウス、タッチ、キーボードでカメラ操作できる。操作中は手動操作が優先され、操作停止後に自動追従へ滑らかに戻る。 |
| エフェクト | `effect0`, `effect1`, `effect2` の色と表示時間が反映される。 |
| コンソール | VRM/VRMA 読み込み失敗や未定義アクションがある場合、警告やエラーが出る。 |

## 15. 注意事項

- `lesson_actions.js` の `sequence` は JavaScript の配列です。カンマ抜け、クォート抜け、波かっこの閉じ忘れに注意してください。
- `durationMs` はミリ秒です。`1000` が 1 秒です。
- `Show Body`, `Greeting`, `Shoot`, `Model Pose`, `Jump`, `Cross Jumps`, `Squat`, `Backflip`, `Cartwheel`, `Combo Punch`, `Mma Kick`, `Golf Drive`, `Left Turn`, `Right Turn`, `Spin once`, `Spin twice` は、開始時と終了時の位置・回転・姿勢差が大きい、または再生時間が短いモーションです。`durationMs` で途中終了や繰り返しを行うと、前後のアクションとの姿勢差分が大きくなり、つなぎ目のちらつきとして目立つ場合があります。これらの type では `durationMs` を指定せず、モーションを1回そのまま再生してください。
- `speed` を大きくしすぎると、キャラクターがカメラ外へ移動しやすくなります。
- `turnAngle` は度数です。`90` は 90 度、`-90` は反対方向へ 90 度曲がります。
- VRM や VRMA のファイル名を変えた場合は、`main.js` の対応表や `lesson_actions.js` の指定も合わせて変更が必要です。
- VRMA を増やすだけではシーケンスから直接指定できません。`main.js` の `LESSON_ANIMATION_FILES` に `type` とファイル名を追加してください。
- ブラウザの音声読み上げは、環境やブラウザ設定によって声質や再生可否が変わります。
- シーケンス再生中もカメラ操作はできますが、操作を止めると自動追従に戻ります。手動で固定した視点を最後まで維持する仕様ではありません。
- スマホブラウザでは `speak` の Web Speech API を使用しません。音声は出ませんが、吹き出し表示とシーケンス進行は行われます。
- スマホブラウザでは端末センサーや VR モードの制限が PC より強く出ることがあります。
- HTTPS ではない LAN URL では、VR/端末センサー利用時に警告が表示されることがあります。
- CDN からライブラリを読み込むため、インターネット接続が必要です。

## 16. サンプル

### 16.1 短いあいさつ

```js
const z = 'z';
window.lessonActionSettings = {
	avatar: z,
	sequence: [
		'bow',
		{ type: 'speak', message: 'こんにちは。今日はよろしくお願いします。', waitMode: 1 }
	]
};
```

### 16.2 歩いて曲がる

```js
window.lessonActionSettings = {
	avatar: 2,
	sequence: [
		{ type: 'Walking', durationMs: 4000, speed: 0.7, turnAngle: 45 },
		{ type: 'speak', message: '少し右に曲がりながら歩きました。', waitMode: 1 },
		{ type: 'Walking', durationMs: 4000, speed: 0.7, turnAngle: -45 }
	]
};
```

### 16.3 ダンス演出

```js
window.lessonActionSettings = {
	avatar: 4,
	effectColor: '#7ee7ff',
	sequence: [
		{ type: 'speak', message: 'それでは、少し踊ってみます。', waitMode: 1 },
		{ type: 'effect2', durationMs: 1200 },
		{ type: 'Hip Hop Dancing', durationMs: 6800 },
		{ type: 'Spin twice' },
		{ type: 'bow', durationMs: 1500 }
	]
};
```

### 16.4 アバター変更

```js
const z = 'z';
window.lessonActionSettings = {
	avatar: 0,
	sequence: [
		{ type: 'speak', message: '最初のアバターです。', waitMode: 1 },
		{ type: 'avatar', avatar: z },
		{ type: 'speak', message: 'アバターを変更しました。', waitMode: 1 }
	]
};
```

### 16.5 VRMAモーション指定

```js
window.lessonActionSettings = {
	avatar: 3,
	sequence: [
		{ type: 'Greeting' },
		{ type: 'Peace Sign', durationMs: 5000 },
		{ type: 'Left Turn' },
		{ type: 'Right Turn' },
		{ type: 'Walking', durationMs: 3000, speed: 0.5 }
	]
};
```
