const THREE = AFRAME.THREE;
let currentVrm = null;
let currentVrmEntity = null;
let currentVrmModelUrl = null;
let armAction = null;
let characterAction = null;
let speechBubble = null;
let speechBubbleText = null;
let speechBubbleAction = null;
let lessonSpeakRunId = 0;
let vrmaAnimationClips = {};
let vrmaAnimationClipPromises = {};
let lessonAnimationMixer = null;
let lessonAnimationAction = null;
let lessonAnimationFinishedHandler = null;
let lessonAnimationRun = null;
let lessonAnimationTimeoutId = null;
let lessonCameraFollow = null;
let lessonPoseTransition = null;
let idleAnimationMixer = null;
let idleAnimationAction = null;
let idleAnimationStarting = false;
let idleAnimationRequestId = 0;

const VRMA_BASE_URL = './assets/vrma/';
const LESSON_ANIMATION_FILES = {
	'Cross Jumps': 'Cross Jumps.vrma',
	'Greeting': 'Greeting.vrma',
	'Hip Hop Dancing': 'Hip Hop Dancing.vrma',
	'Jump': 'Jump.vrma',
	'Left Turn': 'Left Turn.vrma',
	'Model Pose': 'Model Pose.vrma',
	'Peace Sign': 'Peace Sign.vrma',
	'Right Turn': 'Right Turn.vrma',
	'Shoot': 'Shoot.vrma',
	'Show Body': 'Show Body.vrma',
	'Slow Run': 'Slow Run.vrma',
	'Spin towice': 'Spin In Place.vrma',
	'Spin once': 'Spin once.vrma',
	'Standing Idle': 'Standing Idle.vrma',
	'Squat': 'Squat.vrma',
	'Talking': 'Talking.vrma',
	'Walking': 'Walking.vrma'
};
const LESSON_IDLE_ANIMATION_NAME = 'Standing Idle';
const LESSON_SPEAK_ANIMATION_NAME = 'Talking';
const LESSON_SYNTHETIC_LOCOMOTION = {
	Walking: {
		speed: 0.62,
		durationMs: 3000
	},
	'Slow Run': {
		speed: 1.8,
		durationMs: 3000
	}
};
const LESSON_SYNTHETIC_LOCOMOTION_INERTIA_MS = 500;
const SPEECH_BUBBLE_HEAD_WORLD_UP_OFFSET = 0.12;
const SPEECH_BUBBLE_FALLBACK_HEAD_HEIGHT = 1.4;
const SPEECH_BUBBLE_MIN_WIDTH = 320;
const SPEECH_BUBBLE_MAX_WIDTH = 560;
const SPEECH_BUBBLE_CHARACTER_WIDTH = 30;
const SPEECH_BUBBLE_LINE_HEIGHT = 40;
const SPEECH_BUBBLE_CHARACTER_DELAY_MS = 150;
const SPEECH_BUBBLE_TAIL_WIDTH = 120;
const SPEECH_BUBBLE_TAIL_TIP_Y = 36;
const SPEECH_BUBBLE_TAIL_LEFT = 28;
const SPEECH_BUBBLE_SCREEN_RIGHT_GAP = 92;
const SPEECH_BUBBLE_SCREEN_UP_GAP = 28;
const SPEECH_BUBBLE_SCREEN_MARGIN = 12;
const LESSON_CAMERA_TARGET_HEIGHT = 1.15;
const LESSON_CAMERA_POSITION_DAMPING = 3.8;
const LESSON_CAMERA_LOOK_DAMPING = 4.5;
const LESSON_CAMERA_TARGET_DAMPING = 5.5;
const LESSON_CAMERA_RETURN_DAMPING = 3.2;
const LESSON_CAMERA_DISTANCE_DAMPING = 4.2;
const LESSON_CAMERA_FACE_OFFSET_DAMPING = 3.2;
const LESSON_CAMERA_FACE_STABLE_SPEED = 0.85;
const LESSON_CAMERA_FACE_STABLE_DURATION_MS = 450;
const LESSON_CAMERA_SPEAK_DISTANCE_SCALE = 0.78;
const LESSON_CAMERA_SPEAK_MIN_DISTANCE = 1.35;
const LESSON_CAMERA_SPEAK_TARGET_MIX = 0.52;
const LESSON_CAMERA_SPEAK_HEAD_DOWN_OFFSET = 0.38;
const LESSON_CAMERA_MIN_DISTANCE = 1.8;
const LESSON_CAMERA_MAX_DELTA_SECONDS = 0.05;
const LESSON_CAMERA_USER_CONTROL_IDLE_MS = 800;
const LESSON_ROOT_MOTION_POSITION_EPSILON = 0.01;
const LESSON_ROOT_MOTION_YAW_EPSILON = 0.01;
const LESSON_ACTION_POSE_TRANSITION_MS = 500;
const LESSON_HIP_HOP_POSE_TRANSITION_MS = 1000;
const LESSON_AVATAR_BASE_URL = './assets/VRM/';
const LESSON_AVATAR_MIN_ID = 0;
const LESSON_AVATAR_MAX_ID = 5;
const AVATAR_Z_ARM_TARGET_OUTWARD = 0.18;
const AVATAR_Z_ARM_TARGET_FORWARD = 0.03;
const MIXAMO_TO_VRM_BONES = {
	Hips: 'hips',
	Spine: 'spine',
	Spine1: 'chest',
	Spine2: 'upperChest',
	Neck: 'neck',
	Head: 'head',
	LeftShoulder: 'leftShoulder',
	LeftArm: 'leftUpperArm',
	LeftForeArm: 'leftLowerArm',
	LeftHand: 'leftHand',
	RightShoulder: 'rightShoulder',
	RightArm: 'rightUpperArm',
	RightForeArm: 'rightLowerArm',
	RightHand: 'rightHand',
	LeftUpLeg: 'leftUpperLeg',
	LeftLeg: 'leftLowerLeg',
	LeftFoot: 'leftFoot',
	LeftToeBase: 'leftToes',
	RightUpLeg: 'rightUpperLeg',
	RightLeg: 'rightLowerLeg',
	RightFoot: 'rightFoot',
	RightToeBase: 'rightToes'
};
const J_BIP_TO_VRM_BONES = {
	J_Bip_C_Hips: 'hips',
	J_Bip_C_Spine: 'spine',
	J_Bip_C_Chest: 'chest',
	J_Bip_C_UpperChest: 'upperChest',
	J_Bip_C_Neck: 'neck',
	J_Bip_C_Head: 'head',
	J_Bip_L_Shoulder: 'leftShoulder',
	J_Bip_L_UpperArm: 'leftUpperArm',
	J_Bip_L_LowerArm: 'leftLowerArm',
	J_Bip_L_Hand: 'leftHand',
	J_Bip_L_Thumb1: 'leftThumbMetacarpal',
	J_Bip_L_Thumb2: 'leftThumbProximal',
	J_Bip_L_Thumb3: 'leftThumbDistal',
	J_Bip_L_Index1: 'leftIndexProximal',
	J_Bip_L_Index2: 'leftIndexIntermediate',
	J_Bip_L_Index3: 'leftIndexDistal',
	J_Bip_L_Middle1: 'leftMiddleProximal',
	J_Bip_L_Middle2: 'leftMiddleIntermediate',
	J_Bip_L_Middle3: 'leftMiddleDistal',
	J_Bip_L_Ring1: 'leftRingProximal',
	J_Bip_L_Ring2: 'leftRingIntermediate',
	J_Bip_L_Ring3: 'leftRingDistal',
	J_Bip_L_Little1: 'leftLittleProximal',
	J_Bip_L_Little2: 'leftLittleIntermediate',
	J_Bip_L_Little3: 'leftLittleDistal',
	J_Bip_R_Shoulder: 'rightShoulder',
	J_Bip_R_UpperArm: 'rightUpperArm',
	J_Bip_R_LowerArm: 'rightLowerArm',
	J_Bip_R_Hand: 'rightHand',
	J_Bip_R_Thumb1: 'rightThumbMetacarpal',
	J_Bip_R_Thumb2: 'rightThumbProximal',
	J_Bip_R_Thumb3: 'rightThumbDistal',
	J_Bip_R_Index1: 'rightIndexProximal',
	J_Bip_R_Index2: 'rightIndexIntermediate',
	J_Bip_R_Index3: 'rightIndexDistal',
	J_Bip_R_Middle1: 'rightMiddleProximal',
	J_Bip_R_Middle2: 'rightMiddleIntermediate',
	J_Bip_R_Middle3: 'rightMiddleDistal',
	J_Bip_R_Ring1: 'rightRingProximal',
	J_Bip_R_Ring2: 'rightRingIntermediate',
	J_Bip_R_Ring3: 'rightRingDistal',
	J_Bip_R_Little1: 'rightLittleProximal',
	J_Bip_R_Little2: 'rightLittleIntermediate',
	J_Bip_R_Little3: 'rightLittleDistal',
	J_Bip_L_UpperLeg: 'leftUpperLeg',
	J_Bip_L_LowerLeg: 'leftLowerLeg',
	J_Bip_L_Foot: 'leftFoot',
	J_Bip_L_ToeBase: 'leftToes',
	J_Bip_R_UpperLeg: 'rightUpperLeg',
	J_Bip_R_LowerLeg: 'rightLowerLeg',
	J_Bip_R_Foot: 'rightFoot',
	J_Bip_R_ToeBase: 'rightToes'
};
const VRM_FINGER_BONES = [
	'leftThumbMetacarpal',
	'leftThumbProximal',
	'leftThumbDistal',
	'leftIndexProximal',
	'leftIndexIntermediate',
	'leftIndexDistal',
	'leftMiddleProximal',
	'leftMiddleIntermediate',
	'leftMiddleDistal',
	'leftRingProximal',
	'leftRingIntermediate',
	'leftRingDistal',
	'leftLittleProximal',
	'leftLittleIntermediate',
	'leftLittleDistal',
	'rightThumbMetacarpal',
	'rightThumbProximal',
	'rightThumbDistal',
	'rightIndexProximal',
	'rightIndexIntermediate',
	'rightIndexDistal',
	'rightMiddleProximal',
	'rightMiddleIntermediate',
	'rightMiddleDistal',
	'rightRingProximal',
	'rightRingIntermediate',
	'rightRingDistal',
	'rightLittleProximal',
	'rightLittleIntermediate',
	'rightLittleDistal'
];
const LESSON_POSE_TRANSITION_BONES = Array.from(new Set(
	Object.values(MIXAMO_TO_VRM_BONES)
		.concat(Object.values(J_BIP_TO_VRM_BONES))
		.concat(VRM_FINGER_BONES)
));
// アクション追加時の注意:
// 新しいアクションが独自の開始姿勢を持つ場合は getLessonStepStartPose に追加し、
// すべてのアクションのつなぎ目で 500ms 補間される状態を保つこと。
// main.js 側で姿勢や位置を変える基本アクションは、ここへ登録すると Standing Idle の開始姿勢へ補間される。
const LESSON_BASIC_ACTION_START_POSE_TYPES = [
	'stepForward',
	'stepBack',
	'bow'
];

window.addEventListener('DOMContentLoaded', () => {
	const startActionButton = document.getElementById('startActionButton');

	if (startActionButton) {
		startActionButton.addEventListener('click', () => {
			startCharacterAction();
		});
	}
});

function startCharacterAction() {
	if (!currentVrm || !currentVrm.humanoid || !currentVrmEntity) {
		console.warn('VRM model is not ready yet.');
		return;
	}

	if (characterAction) {
		return;
	}

	stopLessonIdleAnimation();
	hideNonLessonSpeakBubble();

	const spine = currentVrm.humanoid.getNormalizedBoneNode('spine');
	const chest = currentVrm.humanoid.getNormalizedBoneNode('chest');
	const head = currentVrm.humanoid.getNormalizedBoneNode('head');
	const settings = getLessonActionSettings();

	characterAction = {
		sequence: normalizeLessonSequence(settings.sequence),
		stepIndex: -1,
		activeStep: null,
		settings: settings,
		spine: spine,
		chest: chest,
		head: head,
		startPosition: currentVrmEntity.object3D.position.clone(),
		startQuaternion: currentVrmEntity.object3D.quaternion.clone()
	};

	startLessonCameraFollow();
	transitionToNextLessonStep(null, () => {
		if (characterAction && characterAction.stepIndex === -1) {
			startNextLessonStep();
		}
	});
}

function updateCharacterAction() {
	if (!characterAction) {
		return;
	}

	const step = characterAction.activeStep;

	if (!step) {
		return;
	}

	if (step.completing) {
		return;
	}

	if (step.type === 'walkForward' || step.type === 'walkBack') {
		return;
	}

	if (step.type === 'vrmaAnimation') {
		return;
	}

	if (step.type === 'stepForward' || step.type === 'stepBack') {
		updateStepMoveLessonStep(step);
		return;
	}

	if (step.type === 'bow') {
		const durationMs = getNumber(step.durationMs, 1500);
		const holdStartMs = durationMs * 0.33;
		const holdEndMs = durationMs * 0.67;
		const bowTime = performance.now() - step.startTime;
		const bowIn = Math.min(bowTime / holdStartMs, 1);
		const bowOut = bowTime > holdEndMs ? Math.min((bowTime - holdEndMs) / (durationMs - holdEndMs), 1) : 0;
		const bowAmount = bowTime <= holdEndMs ? smoothStep(bowIn) : 1 - smoothStep(bowOut);
		applyBowPose(characterAction, bowAmount);

		if (bowTime >= durationMs) {
			applyBowPose(characterAction, 0);
			completeLessonStep(step);
		}

		return;
	}

	if (step.type === 'speak') {
		if (!step.bubbleShown) {
			const waitMode = getLessonSpeakWaitMode(step);

			startLessonSpeakStep(step, waitMode);

			if (waitMode === 0) {
				completeLessonStep(step);
			}

			return;
		}

		if (step.speechFinished && (!speechBubbleAction || speechBubbleAction.fullTextTime !== null)) {
			stopLessonIdleAnimation();
			hideSpeechBubbleForRun(step.speechRunId);
			completeLessonStep(step);
		}

		return;
	}

	if (isLessonEffectStep(step)) {
		updateEffectLessonStep(step);
		return;
	}

	if (step.type === 'wait') {
		const durationMs = getNumber(step.durationMs, 1000);

		if (performance.now() - step.startTime >= durationMs) {
			completeLessonStep(step);
		}
	}
}

function startNextLessonStep() {
	if (!characterAction) {
		return;
	}

	characterAction.stepIndex += 1;

	if (characterAction.stepIndex >= characterAction.sequence.length) {
		finishCharacterAction();
		return;
	}

	const step = characterAction.sequence[characterAction.stepIndex];
	characterAction.activeStep = step;
	step.startTime = performance.now();

	if (step.type === 'walkForward') {
		playLessonVrmaAnimation('Walking', 'forward', () => {
			completeLessonStep(step);
		}, step);
		return;
	}

	if (step.type === 'walkBack') {
		playLessonVrmaAnimation('Walking', 'backward', () => {
			completeLessonStep(step);
		}, step);
		return;
	}

	if (step.type === 'bow') {
		prepareBowPose(characterAction);
		return;
	}

	if (step.type === 'speak' || step.type === 'wait') {
		return;
	}

	if (step.type === 'stepForward' || step.type === 'stepBack') {
		prepareStepMoveLessonStep(step);
		return;
	}

	if (isLessonEffectStep(step)) {
		step.effectElement = createLessonEffectElement(step);
		return;
	}

	if (step.type === 'avatar') {
		changeLessonAvatar(step, () => {
			completeLessonStep(step);
		});
		return;
	}

	if (step.type === 'vrmaAnimation') {
		playLessonVrmaAnimation(step.animation, 'forward', () => {
			completeLessonStep(step);
		}, step);
		return;
	}

	console.warn('Unknown lesson action type:', step.type);
	startNextLessonStep();
}

function completeLessonStep(step) {
	if (!characterAction || characterAction.activeStep !== step) {
		return;
	}

	if (step.completing) {
		return;
	}

	step.completing = true;
	transitionToNextLessonStep(step, () => {
		if (!characterAction || characterAction.activeStep !== step) {
			return;
		}

		startNextLessonStep();
	});
}

function transitionToNextLessonStep(previousStep, onFinished) {
	const sourcePose = captureLessonVrmPose();

	if (!sourcePose || sourcePose.length === 0) {
		onFinished();
		return;
	}

	const nextStep = getNextLessonStep();

	getLessonStepStartPose(nextStep)
		.then((targetPose) => {
			if (!targetPose || targetPose.length === 0) {
				onFinished();
				return;
			}

			startLessonPoseTransition(sourcePose, targetPose, onFinished, getLessonPoseTransitionDuration(previousStep, nextStep));
		})
		.catch((error) => {
			console.error('Failed to prepare next action pose transition:', error);
			onFinished();
		});
}

function getLessonPoseTransitionDuration(previousStep, nextStep) {
	if (
		previousStep &&
		previousStep.type === 'vrmaAnimation' &&
		getLessonAnimationName(previousStep.animation) === 'Hip Hop Dancing'
	) {
		return LESSON_HIP_HOP_POSE_TRANSITION_MS;
	}

	return LESSON_ACTION_POSE_TRANSITION_MS;
}

function getNextLessonStep() {
	if (!characterAction) {
		return null;
	}

	return characterAction.sequence[characterAction.stepIndex + 1] || null;
}

function getLessonStepStartPose(nextStep) {
	if (!nextStep) {
		return captureLessonAnimationStartPose(LESSON_IDLE_ANIMATION_NAME, 'forward');
	}

	if (nextStep.type === 'speak') {
		if (getLessonSpeakWaitMode(nextStep) === 1) {
			return captureLessonAnimationStartPose(LESSON_SPEAK_ANIMATION_NAME, 'forward');
		}

		return captureLessonCurrentPoseAsStartPose();
	}

	if (isLessonBasicActionStartPoseStep(nextStep)) {
		return captureLessonBasicActionStartPose(nextStep);
	}

	if (nextStep.type === 'walkForward') {
		return captureLessonAnimationStartPose('Walking', 'forward');
	}

	if (nextStep.type === 'walkBack') {
		return captureLessonAnimationStartPose('Walking', 'backward');
	}

	if (nextStep.type === 'vrmaAnimation') {
		return captureLessonAnimationStartPose(nextStep.animation, 'forward');
	}

	return captureLessonCurrentPoseAsStartPose();
}

function isLessonBasicActionStartPoseStep(step) {
	return !!(step && LESSON_BASIC_ACTION_START_POSE_TYPES.indexOf(step.type) !== -1);
}

function captureLessonBasicActionStartPose(step) {
	return captureLessonAnimationStartPose(LESSON_IDLE_ANIMATION_NAME, 'forward');
}

function captureLessonCurrentPoseAsStartPose() {
	const currentPose = captureLessonVrmPose();

	return Promise.resolve(currentPose && currentPose.length > 0 ? currentPose : null);
}

function captureLessonAnimationStartPose(animationName, direction) {
	const currentPose = captureLessonVrmPose();
	const poseVrm = currentVrm;

	if (!currentPose || currentPose.length === 0 || !poseVrm || !poseVrm.scene) {
		return Promise.resolve(null);
	}

	return ensureLessonAnimationClip(animationName)
		.then((clip) => {
			if (currentVrm !== poseVrm || !currentVrm || !currentVrm.scene) {
				return null;
			}

			const mixer = new THREE.AnimationMixer(currentVrm.scene);
			const action = mixer.clipAction(clip);

			action.setLoop(THREE.LoopOnce, 1);
			action.clampWhenFinished = true;
			action.enabled = true;
			action.paused = false;

			if (direction === 'backward') {
				action.time = clip.duration;
				action.timeScale = -1;
			} else {
				action.reset();
				action.timeScale = 1;
			}

			action.play();
			mixer.update(0);

			const targetPose = captureLessonVrmPose();

			action.stop();
			mixer.stopAllAction();
			applyLessonVrmPose(currentPose);

			return targetPose;
		})
		.catch((error) => {
			applyLessonVrmPose(currentPose);
			throw error;
		});
}

function changeLessonAvatar(step, onFinished) {
	const entity = getLessonVrmEntity();
	const nextSrc = getLessonAvatarSrc(step.avatar, step.avatarId, step.id, step.number, step.src);

	if (!entity || !nextSrc) {
		console.warn('Avatar change was skipped. Avatar value is invalid:', step);

		if (typeof onFinished === 'function') {
			onFinished();
		}

		return;
	}

	const componentData = entity.getAttribute('vrm-model') || {};

	if (componentData.src === nextSrc && currentVrm) {
		if (typeof onFinished === 'function') {
			onFinished();
		}

		return;
	}

	const preservedState = captureLessonAvatarChangeState(entity);
	const preservedCameraState = suspendLessonCameraFollowForAvatarChange();

	stopLessonAnimation();
	cancelLessonSpeak();
	startLessonIdleAnimation({
		allowDuringAction: true,
		allowedStepType: 'avatar',
		animationName: LESSON_IDLE_ANIMATION_NAME,
		step: step
	});

	const finish = () => {
		entity.removeEventListener('vrm-loaded', finish);
		entity.removeEventListener('vrm-load-error', fail);
		refreshCharacterActionBones();
		applyLessonAvatarChangeState(preservedState, entity);
		restoreLessonCameraFollowAfterAvatarChange(preservedCameraState);

		if (typeof onFinished === 'function') {
			onFinished();
		}
	};
	const fail = (event) => {
		entity.removeEventListener('vrm-loaded', finish);
		entity.removeEventListener('vrm-load-error', fail);
		console.error('Avatar change failed:', event.detail && event.detail.error ? event.detail.error : event);
		stopLessonIdleAnimation();
		restoreLessonCameraFollowAfterAvatarChange(preservedCameraState);

		if (typeof onFinished === 'function') {
			onFinished();
		}
	};

	entity.addEventListener('vrm-loaded', finish);
	entity.addEventListener('vrm-load-error', fail);
	entity.setAttribute('vrm-model', 'src', nextSrc);
}

function captureLessonAvatarChangeState(entity) {
	return {
		position: entity.object3D.position.clone(),
		quaternion: entity.object3D.quaternion.clone(),
		scale: entity.object3D.scale.clone(),
		pose: captureLessonVrmPose()
	};
}

function applyLessonAvatarChangeState(state, entity) {
	if (!state || !entity) {
		return;
	}

	entity.object3D.position.copy(state.position);
	entity.object3D.quaternion.copy(state.quaternion);
	entity.object3D.scale.copy(state.scale);
	entity.object3D.updateMatrixWorld(true);
	applyLessonVrmPoseToCurrentAvatar(state.pose);
}

function getLessonVrmEntity() {
	if (currentVrmEntity) {
		return currentVrmEntity;
	}

	return document.querySelector('[vrm-model]');
}

function getLessonAvatarSrc() {
	for (let index = 0; index < arguments.length; index += 1) {
		const src = normalizeLessonAvatarSrc(arguments[index]);

		if (src) {
			return src;
		}
	}

	return null;
}

function normalizeLessonAvatarSrc(value) {
	if (value === null || value === undefined || value === '') {
		return null;
	}

	if (Number.isInteger(Number(value))) {
		const avatarId = Number(value);

		if (avatarId >= LESSON_AVATAR_MIN_ID && avatarId <= LESSON_AVATAR_MAX_ID) {
			return LESSON_AVATAR_BASE_URL + 'Avatar_' + avatarId + '.vrm';
		}
	}

	const text = String(value).trim();

	if (/^z$/i.test(text)) {
		return LESSON_AVATAR_BASE_URL + 'Avatar_z.vrm';
	}

	if (/^Avatar_[0-5]$/i.test(text)) {
		return LESSON_AVATAR_BASE_URL + text.replace(/^avatar_/i, 'Avatar_') + '.vrm';
	}

	if (/^Avatar_z$/i.test(text)) {
		return LESSON_AVATAR_BASE_URL + 'Avatar_z.vrm';
	}

	if (/^Avatar_[0-5]\.vrm$/i.test(text)) {
		return LESSON_AVATAR_BASE_URL + text.replace(/^avatar_/i, 'Avatar_');
	}

	if (/^Avatar_z\.vrm$/i.test(text)) {
		return LESSON_AVATAR_BASE_URL + 'Avatar_z.vrm';
	}

	if (/\.vrm$/i.test(text)) {
		return text;
	}

	return null;
}

function refreshCharacterActionBones() {
	if (!characterAction || !currentVrm || !currentVrm.humanoid) {
		return;
	}

	characterAction.spine = currentVrm.humanoid.getNormalizedBoneNode('spine');
	characterAction.chest = currentVrm.humanoid.getNormalizedBoneNode('chest');
	characterAction.head = currentVrm.humanoid.getNormalizedBoneNode('head');
}

function finishCharacterAction() {
	stopLessonAnimation();
	characterAction = null;
	returnLessonCameraToStart();
	startLowerArmsAction();
	startLessonIdleAnimation();
}

function prepareStepMoveLessonStep(step) {
	const direction = step.type === 'stepBack' ? -1 : 1;
	const distance = getNumber(step.distance, 0.55);
	const forward = new THREE.Vector3(0, 0, 1)
		.applyQuaternion(currentVrmEntity.object3D.quaternion)
		.multiplyScalar(distance * direction);

	step.startPosition = currentVrmEntity.object3D.position.clone();
	step.endPosition = step.startPosition.clone().add(forward);
}

function updateStepMoveLessonStep(step) {
	const durationMs = getNumber(step.durationMs, 700);
	const elapsed = performance.now() - step.startTime;
	const progress = Math.min(elapsed / durationMs, 1);
	const easedProgress = smoothStep(progress);

	currentVrmEntity.object3D.position.lerpVectors(step.startPosition, step.endPosition, easedProgress);

	if (progress >= 1) {
		currentVrmEntity.object3D.position.copy(step.endPosition);
		completeLessonStep(step);
	}
}

function updateEffectLessonStep(step) {
	const durationMs = getNumber(step.durationMs, 1400);
	const elapsed = performance.now() - step.startTime;

	updateLessonEffectPosition(step.effectElement);

	if (elapsed >= durationMs) {
		removeLessonEffectElement(step.effectElement);
		step.effectElement = null;
		completeLessonStep(step);
	}
}

function getLessonActionSettings() {
	const defaults = {
		effectColor: '#60d8ff',
		avatar: 2,
		sequence: [
			'stepForward',
			'bow',
			'speak',
			'stepBack'
		]
	};
	const custom = window.lessonActionSettings || {};

	return {
		effectColor: custom.effectColor || defaults.effectColor,
		avatar: custom.avatar !== undefined ? custom.avatar : defaults.avatar,
		sequence: Array.isArray(custom.sequence) ? custom.sequence : defaults.sequence
	};
}

function normalizeLessonSequence(sequence) {
	return sequence.map((step) => {
		if (typeof step === 'string') {
			return normalizeLessonStep(step);
		}

		const normalizedStep = Object.assign({}, step);
		const explicitAnimationName = normalizedStep.type === 'animation' || normalizedStep.type === 'vrmaAnimation'
			? normalizedStep.animation || normalizedStep.name
			: null;
		const animationName = getLessonAnimationName(explicitAnimationName || normalizedStep.type || normalizedStep.animation || normalizedStep.name);

		if (animationName && normalizedStep.type !== 'walkForward' && normalizedStep.type !== 'walkBack') {
			normalizedStep.type = 'vrmaAnimation';
			normalizedStep.animation = animationName;
			return normalizedStep;
		}

		normalizedStep.type = normalizeLessonStepType(normalizedStep.type);

		return normalizedStep;
	});
}

function normalizeLessonStep(stepName) {
	const animationName = getLessonAnimationName(stepName);

	if (animationName && stepName !== 'walkForward' && stepName !== 'walkBack') {
		return {
			type: 'vrmaAnimation',
			animation: animationName
		};
	}

	return {
		type: normalizeLessonStepType(stepName)
	};
}

function normalizeLessonStepType(type) {
	const actionType = String(type || '').trim();
	const aliases = {
		speech: 'speak',
		talk: 'speak',
		forward: 'stepForward',
		back: 'stepBack',
		changeAvatar: 'avatar',
		avatarChange: 'avatar',
		effect: 'effect0',
		flash: 'effect0'
	};

	return aliases[actionType] || actionType;
}

function getLessonAnimationName(name) {
	const normalizedName = String(name || '').trim();

	if (LESSON_ANIMATION_FILES[normalizedName]) {
		return normalizedName;
	}

	const lowerName = normalizedName.toLowerCase();
	const matchedName = Object.keys(LESSON_ANIMATION_FILES).find((animationName) => {
		return animationName.toLowerCase() === lowerName;
	});

	if (matchedName) {
		return matchedName;
	}

	const matchedFileName = Object.keys(LESSON_ANIMATION_FILES).find((animationName) => {
		return LESSON_ANIMATION_FILES[animationName].toLowerCase() === lowerName;
	});

	return matchedFileName || null;
}

function getNumber(value, fallback) {
	if (value === null || value === undefined || value === '') {
		return fallback;
	}

	return Number.isFinite(Number(value)) ? Number(value) : fallback;
}

function getLessonSpeakWaitMode(step) {
	return Number(step && step.waitMode) === 0 ? 0 : 1;
}

function startLessonSpeakStep(step, waitMode) {
	const message = step.message || 'こんにちは！';
	const typeDurationMs = getNumber(step.typeDurationMs, SPEECH_BUBBLE_CHARACTER_DELAY_MS);
	const runId = lessonSpeakRunId + 1;

	step.speechRunId = runId;
	step.speechFinished = false;
	step.bubbleShown = true;

	startLessonSpeakOutput(message, getNumber(step.rate, 1.8), typeDurationMs, {
		runId: runId,
		autoHideOnComplete: waitMode === 0
	});

	if (waitMode === 1) {
		startLessonIdleAnimation({
			allowDuringAction: true,
			animationName: LESSON_SPEAK_ANIMATION_NAME,
			step: step
		});
	}
}

function startLessonSpeakOutput(message, rate, typeDurationMs, options) {
	const settings = options || {};
	const runId = settings.runId || lessonSpeakRunId + 1;

	lessonSpeakRunId = runId;
	showSpeechBubbleMessage(message, typeDurationMs, Number.POSITIVE_INFINITY, {
		runId: runId,
		autoHideOnComplete: !!settings.autoHideOnComplete,
		speechFinished: false
	});
	pauseSpeechBubbleText(runId);
	speakLessonMessage(message, rate, () => {
		markLessonSpeakFinished(runId);
	}, () => {
		startSpeechBubbleText(runId);
	});

	return runId;
}

function markLessonSpeakFinished(runId) {
	if (!isCurrentLessonSpeakRun(runId)) {
		return;
	}

	speechBubbleAction.speechFinished = true;

	if (speechBubbleAction.autoHideOnComplete && speechBubbleAction.fullTextTime !== null) {
		hideSpeechBubbleForRun(runId);
	}

	if (characterAction && characterAction.activeStep && characterAction.activeStep.speechRunId === runId) {
		characterAction.activeStep.speechFinished = true;
	}
}

function isCurrentLessonSpeakRun(runId) {
	return !!(speechBubbleAction && speechBubbleAction.runId === runId && lessonSpeakRunId === runId);
}

function isLessonSpeakBubbleActive() {
	return !!(speechBubbleAction && speechBubbleAction.runId !== null && speechBubbleAction.runId === lessonSpeakRunId);
}

function cancelLessonSpeak() {
	lessonSpeakRunId += 1;
	cancelLessonSpeechSynthesis();
	hideSpeechBubble();
}

function cancelLessonSpeechSynthesis() {
	if (typeof window !== 'undefined' && window.speechSynthesis) {
		window.speechSynthesis.cancel();
	}
}

function speakLessonMessage(message, rate, onFinished, onStarted) {
	let started = false;
	let finished = false;
	const start = () => {
		if (started) {
			return;
		}

		started = true;

		if (typeof onStarted === 'function') {
			onStarted();
		}
	};
	const finish = () => {
		if (finished) {
			return;
		}

		start();
		finished = true;

		if (typeof onFinished === 'function') {
			onFinished();
		}
	};

	if (
		isLessonSmartphoneBrowser() ||
		typeof window === 'undefined' ||
		!window.speechSynthesis ||
		!window.SpeechSynthesisUtterance
	) {
		finish();
		return;
	}

	const utterance = new SpeechSynthesisUtterance(String(message));
	utterance.lang = 'ja-JP';
	utterance.rate = clamp(rate, 0.1, 10);
	utterance.onstart = start;
	utterance.onend = finish;
	utterance.onerror = finish;
	cancelLessonSpeechSynthesis();
	window.speechSynthesis.speak(utterance);
}

function isLessonSmartphoneBrowser() {
	if (typeof navigator === 'undefined') {
		return false;
	}

	if (
		navigator.userAgentData &&
		typeof navigator.userAgentData.mobile === 'boolean'
	) {
		return navigator.userAgentData.mobile;
	}

	const userAgent = navigator.userAgent || navigator.vendor || (typeof window !== 'undefined' && window.opera) || '';

	return /Mobi|Android.*Mobile|iPhone|iPod|Windows Phone|IEMobile|BlackBerry|BB10|Opera Mini/i.test(userAgent);
}

function isLessonEffectStep(step) {
	return !!(step && (
		step.type === 'effect0' ||
		step.type === 'effect1' ||
		step.type === 'effect2'
	));
}

function createLessonEffectElement(step) {
	const type = getLessonEffectType(step);
	const color = step.color || characterAction.settings.effectColor;
	const durationMs = getNumber(step.durationMs, 1400);

	if (type === 'effect0') {
		return createLessonHologramScanEffect(color, durationMs);
	}

	if (type === 'effect1') {
		return createLessonEnergyBurstEffect(color, durationMs);
	}

	if (type === 'effect2') {
		return createLessonShockwaveEffect(color, durationMs);
	}

	return createLessonHologramScanEffect(color, durationMs);
}

function getLessonEffectType(step) {
	if (step && (step.type === 'effect1' || step.type === 'effect2')) {
		return step.type;
	}

	return 'effect0';
}

function createLessonHologramScanEffect(color, durationMs) {
	const root = createLessonWorldEffectRoot('body');

	if (!root) {
		return createLessonScreenFallbackEffect(color);
	}

	const scanDuration = Math.max(durationMs, 900);

	root.setAttribute('animation__spin', 'property: rotation; to: 0 360 0; dur: ' + scanDuration + '; easing: linear');

	createLessonAframeElement('a-light', {
		light: 'type: point; color: ' + color + '; intensity: 1.8; distance: 3.8',
		position: '0 0.95 0',
		animation__fade: 'property: light.intensity; from: 1.8; to: 0; dur: ' + scanDuration + '; easing: easeOutQuad'
	}, root);
	createLessonAframeElement('a-cylinder', {
		radius: '0.72',
		height: '1.9',
		position: '0 0.95 0',
		material: getLessonEffectMaterial(color, 0.13),
		animation__scale: 'property: scale; from: 0.75 0.1 0.75; to: 1 1 1; dur: ' + Math.min(scanDuration, 850) + '; easing: easeOutCubic',
		animation__fade: 'property: material.opacity; from: 0.13; to: 0; dur: ' + scanDuration + '; easing: easeOutQuad'
	}, root);

	createLessonScanRing(root, color, '0 0.12 0', '0 1.85 0', 0, scanDuration, 0.84);
	createLessonScanRing(root, '#ffffff', '0 1.75 0', '0 0.18 0', 150, scanDuration, 0.68);
	createLessonScanRing(root, color, '0 0.55 0', '0 1.35 0', 300, scanDuration, 0.52);

	const panels = [
		['0.78 0.65 0', '0 0 0', 0],
		['-0.78 1.05 0', '0 0 0', 120],
		['0 0.85 0.78', '0 90 0', 240],
		['0 1.25 -0.78', '0 90 0', 360]
	];

	panels.forEach((panel, index) => {
		const delay = panel[2];
		const panelDuration = Math.max(420, scanDuration - delay);

		createLessonAframeElement('a-box', {
			depth: '0.018',
			height: index % 2 === 0 ? '0.34' : '0.22',
			width: '0.12',
			position: panel[0],
			rotation: panel[1],
			material: getLessonEffectMaterial(index % 2 === 0 ? '#ffffff' : color, 0.72),
			animation__float: 'property: position; dir: alternate; loop: true; to: ' + getLessonPanelFloatTarget(panel[0]) + '; dur: 420; delay: ' + delay + '; easing: easeInOutSine',
			animation__fade: 'property: material.opacity; from: 0.72; to: 0; dur: ' + panelDuration + '; delay: ' + delay + '; easing: easeOutQuad'
		}, root);
	});

	updateLessonWorldEffectPosition(root);

	return root;
}

function createLessonScanRing(parent, color, fromPosition, toPosition, delay, durationMs, radius) {
	createLessonAframeElement('a-ring', {
		'radius-inner': radius.toFixed(2),
		'radius-outer': (radius + 0.025).toFixed(2),
		position: fromPosition,
		rotation: '-90 0 0',
		material: getLessonEffectMaterial(color, 0.8),
		animation__move: 'property: position; from: ' + fromPosition + '; to: ' + toPosition + '; dur: ' + durationMs + '; delay: ' + delay + '; easing: easeInOutSine',
		animation__fade: 'property: material.opacity; from: 0.8; to: 0; dur: ' + durationMs + '; delay: ' + delay + '; easing: easeOutQuad'
	}, parent);
}

function getLessonPanelFloatTarget(positionText) {
	const values = positionText.split(' ').map(Number);
	values[1] += 0.18;

	return values.map((value) => value.toFixed(2)).join(' ');
}

function createLessonScreenFallbackEffect(color) {
	ensureLessonEffectStyles();

	const element = document.createElement('div');
	element.className = 'lesson-effect-overlay';
	element.style.setProperty('--lesson-effect-color', color || '#60d8ff');
	document.body.appendChild(element);
	updateLessonEffectPosition(element);

	return element;
}

function updateLessonEffectPosition(element) {
	if (!element) {
		return;
	}

	if (element.dataset && element.dataset.lessonEffectSpace === 'world') {
		updateLessonWorldEffectPosition(element);
		return;
	}

	const screenPosition = getHeadScreenPosition();

	if (!screenPosition) {
		element.style.visibility = 'hidden';
		return;
	}

	element.style.visibility = 'visible';
	element.style.left = screenPosition.x + 'px';
	element.style.top = screenPosition.y + 'px';
}

function createLessonEnergyBurstEffect(color, durationMs) {
	const root = createLessonWorldEffectRoot('head');

	if (!root) {
		return createLessonScreenFallbackEffect(color);
	}

	const mainDuration = Math.max(durationMs, 300);
	const pulseDuration = Math.min(mainDuration, 900);

	createLessonAframeElement('a-light', {
		light: 'type: point; color: ' + color + '; intensity: 2.6; distance: 4.5',
		position: '0 0 0'
	}, root);
	createLessonAframeElement('a-sphere', {
		radius: '0.09',
		material: getLessonEffectMaterial(color, 0.95),
		animation__scale: 'property: scale; from: 0.2 0.2 0.2; to: 2.2 2.2 2.2; dur: ' + pulseDuration + '; easing: easeOutCubic',
		animation__fade: 'property: material.opacity; from: 0.95; to: 0; dur: ' + pulseDuration + '; easing: easeOutQuad'
	}, root);

	createLessonEnergyRing(root, color, '0 0 0', 0, mainDuration, 2.8);
	createLessonEnergyRing(root, '#ffffff', '90 0 0', 90, mainDuration, 2.35);
	createLessonEnergyRing(root, color, '0 90 0', 180, mainDuration, 2.5);

	const particles = [
		['0.62 0.24 0.08', 0],
		['-0.58 0.18 -0.12', 60],
		['0.26 0.66 -0.18', 120],
		['-0.18 -0.48 0.36', 180],
		['0.42 -0.3 -0.44', 240],
		['-0.36 0.42 0.46', 300]
	];

	particles.forEach((particle, index) => {
		const delay = particle[1];
		const particleDuration = Math.max(320, mainDuration - delay);

		createLessonAframeElement('a-sphere', {
			radius: index % 2 === 0 ? '0.035' : '0.025',
			position: '0 0 0',
			material: getLessonEffectMaterial(index % 2 === 0 ? '#ffffff' : color, 0.9),
			animation__move: 'property: position; from: 0 0 0; to: ' + particle[0] + '; dur: ' + particleDuration + '; delay: ' + delay + '; easing: easeOutCubic',
			animation__fade: 'property: material.opacity; from: 0.9; to: 0; dur: ' + particleDuration + '; delay: ' + delay + '; easing: easeOutQuad'
		}, root);
	});

	updateLessonWorldEffectPosition(root);

	return root;
}

function createLessonEnergyRing(parent, color, rotation, delay, durationMs, scaleTo) {
	createLessonAframeElement('a-ring', {
		'radius-inner': '0.2',
		'radius-outer': '0.235',
		rotation: rotation,
		material: getLessonEffectMaterial(color, 0.85),
		animation__scale: 'property: scale; from: 0.25 0.25 0.25; to: ' + scaleTo + ' ' + scaleTo + ' ' + scaleTo + '; dur: ' + durationMs + '; delay: ' + delay + '; easing: easeOutCubic',
		animation__spin: 'property: rotation; to: ' + rotation.split(' ')[0] + ' ' + (Number(rotation.split(' ')[1]) + 360) + ' ' + rotation.split(' ')[2] + '; dur: ' + durationMs + '; delay: ' + delay + '; easing: linear',
		animation__fade: 'property: material.opacity; from: 0.85; to: 0; dur: ' + durationMs + '; delay: ' + delay + '; easing: easeOutQuad'
	}, parent);
}

function createLessonShockwaveEffect(color, durationMs) {
	const root = createLessonWorldEffectRoot('ground');

	if (!root) {
		return createLessonScreenFallbackEffect(color);
	}

	const mainDuration = Math.max(durationMs, 450);
	const ringDuration = Math.min(mainDuration, 1100);

	createLessonAframeElement('a-light', {
		light: 'type: point; color: ' + color + '; intensity: 3.4; distance: 6',
		position: '0 1.1 0',
		animation__fade: 'property: light.intensity; from: 3.4; to: 0; dur: ' + ringDuration + '; easing: easeOutQuad'
	}, root);
	createLessonAframeElement('a-cylinder', {
		radius: '0.42',
		height: '2.4',
		position: '0 1.15 0',
		material: getLessonEffectMaterial(color, 0.35),
		animation__scale: 'property: scale; from: 0.2 0.15 0.2; to: 1.3 1 1.3; dur: ' + ringDuration + '; easing: easeOutCubic',
		animation__fade: 'property: material.opacity; from: 0.35; to: 0; dur: ' + ringDuration + '; easing: easeOutQuad'
	}, root);

	createLessonGroundRing(root, color, 0, ringDuration, 4.2);
	createLessonGroundRing(root, '#ffffff', 130, ringDuration, 3.2);
	createLessonGroundRing(root, color, 260, ringDuration, 5.0);

	for (let index = 0; index < 8; index += 1) {
		const angle = index * 45;
		const radians = THREE.MathUtils.degToRad(angle);
		const radius = 0.56;
		const x = Math.sin(radians) * radius;
		const z = Math.cos(radians) * radius;
		const bladeDuration = Math.max(360, ringDuration - index * 35);

		createLessonAframeElement('a-cylinder', {
			radius: index % 2 === 0 ? '0.018' : '0.012',
			height: '1.3',
			position: x.toFixed(3) + ' 0.68 ' + z.toFixed(3),
			rotation: '0 ' + angle + ' 22',
			material: getLessonEffectMaterial(index % 2 === 0 ? '#ffffff' : color, 0.82),
			animation__scale: 'property: scale; from: 0.2 0.1 0.2; to: 1.1 1.35 1.1; dur: ' + bladeDuration + '; delay: ' + (index * 35) + '; easing: easeOutBack',
			animation__fade: 'property: material.opacity; from: 0.82; to: 0; dur: ' + bladeDuration + '; delay: ' + (index * 35) + '; easing: easeOutQuad'
		}, root);
	}

	updateLessonWorldEffectPosition(root);

	return root;
}

function createLessonGroundRing(parent, color, delay, durationMs, scaleTo) {
	createLessonAframeElement('a-ring', {
		'radius-inner': '0.32',
		'radius-outer': '0.38',
		rotation: '-90 0 0',
		material: getLessonEffectMaterial(color, 0.82),
		animation__scale: 'property: scale; from: 0.1 0.1 0.1; to: ' + scaleTo + ' ' + scaleTo + ' ' + scaleTo + '; dur: ' + durationMs + '; delay: ' + delay + '; easing: easeOutCubic',
		animation__fade: 'property: material.opacity; from: 0.82; to: 0; dur: ' + durationMs + '; delay: ' + delay + '; easing: easeOutQuad'
	}, parent);
}

function createLessonWorldEffectRoot(anchor) {
	const sceneEl = currentVrmEntity && currentVrmEntity.sceneEl
		? currentVrmEntity.sceneEl
		: document.querySelector('a-scene');

	if (!sceneEl) {
		return null;
	}

	const root = document.createElement('a-entity');
	root.dataset.lessonEffectSpace = 'world';
	root.dataset.lessonEffectAnchor = anchor;
	sceneEl.appendChild(root);

	if (root.object3D) {
		root.object3D.visible = false;
	}

	return root;
}

function createLessonAframeElement(tagName, attributes, parent) {
	const element = document.createElement(tagName);

	Object.keys(attributes).forEach((name) => {
		element.setAttribute(name, attributes[name]);
	});

	parent.appendChild(element);

	return element;
}

function getLessonEffectMaterial(color, opacity) {
	return 'color: ' + (color || '#60d8ff') + '; shader: flat; transparent: true; opacity: ' + opacity + '; side: double';
}

function updateLessonWorldEffectPosition(element) {
	if (!element.object3D) {
		return;
	}

	const worldPosition = getLessonEffectWorldPosition(element.dataset.lessonEffectAnchor);

	if (!worldPosition) {
		element.object3D.visible = false;
		return;
	}

	element.object3D.visible = true;
	element.object3D.position.copy(worldPosition);
}

function getLessonEffectWorldPosition(anchor) {
	if (!currentVrmEntity) {
		return null;
	}

	currentVrmEntity.object3D.updateMatrixWorld(true);

	if (anchor === 'ground') {
		const position = currentVrmEntity.object3D.getWorldPosition(new THREE.Vector3());
		position.y += 0.04;
		return position;
	}

	if (anchor === 'body') {
		const position = currentVrmEntity.object3D.getWorldPosition(new THREE.Vector3());
		position.y += 0.04;
		return position;
	}

	const position = getHeadWorldPosition();
	position.y += 0.22;
	return position;
}

function removeLessonEffectElement(element) {
	if (element) {
		element.remove();
	}
}

function ensureLessonEffectStyles() {
	if (document.getElementById('lessonEffectStyles')) {
		return;
	}

	const style = document.createElement('style');
	style.id = 'lessonEffectStyles';
	style.textContent = `
		.lesson-effect-overlay {
			position: fixed;
			left: 0;
			top: 0;
			z-index: 15;
			width: 54px;
			height: 54px;
			border-radius: 999px;
			background: var(--lesson-effect-color);
			box-shadow:
				0 0 54px 34px var(--lesson-effect-color),
				110px -72px 0 -12px var(--lesson-effect-color),
				-92px 58px 0 -16px var(--lesson-effect-color),
				48px 116px 0 -18px var(--lesson-effect-color),
				-118px -36px 0 -20px var(--lesson-effect-color);
			opacity: 0.88;
			pointer-events: none;
			transform: translate(-50%, -50%);
			transform-origin: center;
			animation: lessonEffectPulse 900ms ease-in-out infinite alternate;
		}

		@keyframes lessonEffectPulse {
			from {
				transform: translate(-50%, -50%) scale(0.75);
				opacity: 0.55;
			}

			to {
				transform: translate(-50%, -50%) scale(1.55);
				opacity: 1;
			}
		}
	`;
	document.head.appendChild(style);
}

function prepareBowPose(action) {
	action.spineStart = action.spine ? action.spine.quaternion.clone() : null;
	action.chestStart = action.chest ? action.chest.quaternion.clone() : null;
	action.headStart = action.head ? action.head.quaternion.clone() : null;
	action.spineTarget = action.spine ? action.spine.quaternion.clone().multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(0.35, 0, 0))) : null;
	action.chestTarget = action.chest ? action.chest.quaternion.clone().multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(0.25, 0, 0))) : null;
	action.headTarget = action.head ? action.head.quaternion.clone().multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(0.18, 0, 0))) : null;
}

function applyBowPose(action, amount) {
	if (action.spine && action.spineStart && action.spineTarget) {
		action.spine.quaternion.slerpQuaternions(action.spineStart, action.spineTarget, amount);
	}

	if (action.chest && action.chestStart && action.chestTarget) {
		action.chest.quaternion.slerpQuaternions(action.chestStart, action.chestTarget, amount);
	}

	if (action.head && action.headStart && action.headTarget) {
		action.head.quaternion.slerpQuaternions(action.headStart, action.headTarget, amount);
	}
}

function showSpeechBubbleMessage(message, typeDurationMs, hideDelayMs, options) {
	if (!currentVrmEntity) {
		return;
	}

	hideSpeechBubble();
	const settings = options || {};

	const lines = wrapSpeechText(message, 15);
	const maxLineLength = lines.reduce((max, line) => Math.max(max, Array.from(line).length), 1);
	const width = Math.min(
		SPEECH_BUBBLE_MAX_WIDTH,
		Math.max(SPEECH_BUBBLE_MIN_WIDTH, maxLineLength * SPEECH_BUBBLE_CHARACTER_WIDTH + 56)
	);

	speechBubble = createSpeechBubbleElement(width, lines.length);

	speechBubbleAction = {
		runId: settings.runId === undefined ? null : settings.runId,
		message: String(message),
		typeDurationMs: Math.max(typeDurationMs, 0),
		hideDelayMs: Math.max(hideDelayMs, 0),
		autoHideOnComplete: !!settings.autoHideOnComplete,
		speechFinished: !!settings.speechFinished,
		startTime: performance.now(),
		waitingForSpeechStart: false,
		fullTextTime: null,
		lastVisibleCount: -1
	};

	renderSpeechBubbleText(0);
	updateSpeechBubblePosition();
}

function updateSpeechBubble() {
	if (!speechBubbleAction) {
		return;
	}

	updateSpeechBubblePosition();

	if (speechBubbleAction.waitingForSpeechStart) {
		return;
	}

	const chars = Array.from(speechBubbleAction.message);
	const elapsed = performance.now() - speechBubbleAction.startTime;
	const visibleCount = speechBubbleAction.typeDurationMs === 0
		? chars.length
		: Math.min(chars.length, Math.floor(elapsed / speechBubbleAction.typeDurationMs) + 1);

	if (visibleCount !== speechBubbleAction.lastVisibleCount) {
		renderSpeechBubbleText(visibleCount);
		speechBubbleAction.lastVisibleCount = visibleCount;
	}

	if (visibleCount >= chars.length && speechBubbleAction.fullTextTime === null) {
		speechBubbleAction.fullTextTime = performance.now();
	}

	if (
		speechBubbleAction.autoHideOnComplete &&
		speechBubbleAction.speechFinished &&
		speechBubbleAction.fullTextTime !== null
	) {
		hideSpeechBubbleForRun(speechBubbleAction.runId);
		return;
	}

	if (
		speechBubbleAction.fullTextTime !== null &&
		performance.now() - speechBubbleAction.fullTextTime >= speechBubbleAction.hideDelayMs
	) {
		hideSpeechBubble();
	}
}

function pauseSpeechBubbleText(runId) {
	if (!speechBubbleAction) {
		return;
	}

	if (runId !== undefined && speechBubbleAction.runId !== runId) {
		return;
	}

	speechBubbleAction.waitingForSpeechStart = true;
	speechBubbleAction.startTime = performance.now();
	speechBubbleAction.fullTextTime = null;
	speechBubbleAction.lastVisibleCount = -1;
	renderSpeechBubbleText(0);
}

function startSpeechBubbleText(runId) {
	if (!speechBubbleAction || !speechBubbleAction.waitingForSpeechStart) {
		return;
	}

	if (runId !== undefined && speechBubbleAction.runId !== runId) {
		return;
	}

	speechBubbleAction.waitingForSpeechStart = false;
	speechBubbleAction.startTime = performance.now();
	speechBubbleAction.fullTextTime = null;
	speechBubbleAction.lastVisibleCount = -1;
	renderSpeechBubbleText(0);
}

function renderSpeechBubbleText(visibleCount) {
	if (!speechBubbleAction || !speechBubbleText) {
		return;
	}

	const state = speechBubbleAction;
	const visibleText = Array.from(state.message).slice(0, visibleCount).join('');
	const visibleLines = wrapSpeechText(visibleText, 15);

	speechBubbleText.textContent = visibleLines.join('\n');
}

function createSpeechBubbleElement(width, lineCount) {
	ensureSpeechBubbleStyles();

	const element = document.createElement('div');
	element.className = 'speech-bubble-overlay';
	element.style.width = width + 'px';

	const speechBubbleBody = document.createElement('div');
	speechBubbleBody.className = 'speech-bubble-body';
	speechBubbleText = document.createElement('div');
	speechBubbleText.className = 'speech-bubble-text';
	speechBubbleText.style.minHeight = Math.max(lineCount, 1) * SPEECH_BUBBLE_LINE_HEIGHT + 'px';

	const speechBubbleTail = createSpeechBubbleTailElement();
	element.appendChild(speechBubbleTail);
	speechBubbleBody.appendChild(speechBubbleText);
	element.appendChild(speechBubbleBody);
	document.body.appendChild(element);

	return element;
}

function createSpeechBubbleTailElement() {
	const namespace = 'http://www.w3.org/2000/svg';
	const tail = document.createElementNS(namespace, 'svg');
	const path = document.createElementNS(namespace, 'path');

	tail.setAttribute('class', 'speech-bubble-tail');
	tail.setAttribute('viewBox', '0 0 120 48');
	tail.setAttribute('width', String(SPEECH_BUBBLE_TAIL_WIDTH));
	tail.setAttribute('height', '48');
	tail.setAttribute('aria-hidden', 'true');
	path.setAttribute('d', 'M56 4 L8 44 L112 4 Z');
	path.setAttribute('fill', '#ffffff');
	path.setAttribute('stroke', '#333333');
	path.setAttribute('stroke-width', '8');
	path.setAttribute('stroke-linejoin', 'round');
	tail.appendChild(path);

	return tail;
}

function ensureSpeechBubbleStyles() {
	if (document.getElementById('speechBubbleOverlayStyles')) {
		return;
	}

	const style = document.createElement('style');
	style.id = 'speechBubbleOverlayStyles';
	style.textContent = `
		.speech-bubble-overlay {
			position: fixed;
			left: 0;
			top: 0;
			z-index: 20;
			box-sizing: border-box;
			color: #111111;
			filter: drop-shadow(0 8px 12px rgba(0, 0, 0, 0.18));
			font: 700 28px/${SPEECH_BUBBLE_LINE_HEIGHT}px sans-serif;
			letter-spacing: 0;
			line-height: ${SPEECH_BUBBLE_LINE_HEIGHT}px;
			overflow: visible;
			pointer-events: none;
			text-align: left;
			white-space: pre-line;
			will-change: transform;
		}

		.speech-bubble-body {
			position: relative;
			z-index: 1;
			box-sizing: border-box;
			padding: 22px 28px;
			border: 4px solid #333333;
			border-radius: 18px;
			background: #ffffff;
		}

		.speech-bubble-text {
			display: block;
			text-align: left;
		}

		.speech-bubble-tail {
			position: absolute;
			top: calc(100% - 8px);
			left: ${SPEECH_BUBBLE_TAIL_LEFT}px;
			z-index: 0;
			width: ${SPEECH_BUBBLE_TAIL_WIDTH}px;
			height: 48px;
			overflow: visible;
			pointer-events: none;
		}
	`;
	document.head.appendChild(style);
}

function updateSpeechBubblePosition() {
	if (!speechBubble || !currentVrmEntity) {
		return;
	}

	const screenPosition = getHeadScreenPosition();

	if (!screenPosition) {
		speechBubble.style.visibility = 'hidden';
		return;
	}

	speechBubble.style.visibility = 'visible';

	const viewportWidth = document.documentElement.clientWidth || window.innerWidth;
	const viewportHeight = document.documentElement.clientHeight || window.innerHeight;
	const bubbleRect = speechBubble.getBoundingClientRect();
	const maxLeft = viewportWidth - bubbleRect.width - SPEECH_BUBBLE_SCREEN_MARGIN;
	const maxTop = viewportHeight - bubbleRect.height - SPEECH_BUBBLE_TAIL_TIP_Y - SPEECH_BUBBLE_SCREEN_MARGIN;
	const left = clamp(
		screenPosition.x + SPEECH_BUBBLE_SCREEN_RIGHT_GAP,
		SPEECH_BUBBLE_SCREEN_MARGIN,
		Math.max(SPEECH_BUBBLE_SCREEN_MARGIN, maxLeft)
	);
	const top = clamp(
		screenPosition.y - bubbleRect.height - SPEECH_BUBBLE_TAIL_TIP_Y - SPEECH_BUBBLE_SCREEN_UP_GAP,
		SPEECH_BUBBLE_SCREEN_MARGIN,
		Math.max(SPEECH_BUBBLE_SCREEN_MARGIN, maxTop)
	);

	speechBubble.style.transform = 'translate3d(' + left + 'px, ' + top + 'px, 0)';
}

function getHeadScreenPosition() {
	const sceneEl = currentVrmEntity ? currentVrmEntity.sceneEl : null;
	const camera = sceneEl ? sceneEl.camera : null;
	const canvas = sceneEl ? sceneEl.canvas : null;

	if (!camera || !canvas) {
		return null;
	}

	currentVrmEntity.object3D.updateMatrixWorld(true);
	camera.updateMatrixWorld(true);

	const headPosition = getHeadWorldPosition();
	headPosition.y += SPEECH_BUBBLE_HEAD_WORLD_UP_OFFSET;

	const projected = headPosition.project(camera);

	if (
		!Number.isFinite(projected.x) ||
		!Number.isFinite(projected.y) ||
		!Number.isFinite(projected.z) ||
		projected.z < -1 ||
		projected.z > 1
	) {
		return null;
	}

	const canvasRect = canvas.getBoundingClientRect();

	return {
		x: canvasRect.left + (projected.x + 1) * 0.5 * canvasRect.width,
		y: canvasRect.top + (1 - projected.y) * 0.5 * canvasRect.height
	};
}

function getHeadWorldPosition() {
	const head = currentVrm && currentVrm.humanoid
		? currentVrm.humanoid.getNormalizedBoneNode('head')
		: null;

	if (head) {
		return head.getWorldPosition(new THREE.Vector3());
	}

	return currentVrmEntity.object3D.localToWorld(new THREE.Vector3(0, SPEECH_BUBBLE_FALLBACK_HEAD_HEIGHT, 0));
}

function wrapSpeechText(message, maxCharsPerLine) {
	const lines = [];
	const paragraphs = String(message).split('\n');

	paragraphs.forEach((paragraph) => {
		const chars = Array.from(paragraph);

		if (chars.length === 0) {
			lines.push('');
			return;
		}

		for (let index = 0; index < chars.length; index += maxCharsPerLine) {
			lines.push(chars.slice(index, index + maxCharsPerLine).join(''));
		}
	});

	return lines.length > 0 ? lines : [''];
}

function clamp(value, min, max) {
	return Math.min(Math.max(value, min), max);
}

function showSpeechBubble(message) {
	showSpeechBubbleMessage(message, 0, 5000);
}

function hideNonLessonSpeakBubble() {
	if (isLessonSpeakBubbleActive()) {
		return;
	}

	hideSpeechBubble();
}

function hideSpeechBubbleForRun(runId) {
	if (speechBubbleAction && speechBubbleAction.runId !== runId) {
		return;
	}

	hideSpeechBubble();
}

function hideSpeechBubble() {
	speechBubbleAction = null;
	speechBubbleText = null;

	if (!speechBubble) {
		return;
	}

	speechBubble.remove();
	speechBubble = null;
}

function smoothStep(value) {
	const x = Math.min(Math.max(value, 0), 1);

	return x * x * (3 - 2 * x);
}

function captureLessonAnimationRootMotion() {
	const root = getLessonRootMotionNode();

	if (!root || !currentVrmEntity) {
		return null;
	}

	currentVrmEntity.object3D.updateMatrixWorld(true);
	root.updateMatrixWorld(true);

	const position = root.getWorldPosition(new THREE.Vector3());
	const quaternion = root.getWorldQuaternion(new THREE.Quaternion());

	return {
		node: root,
		position: position,
		quaternion: quaternion,
		yaw: getYawFromQuaternion(quaternion)
	};
}

function applyLessonAnimationRootMotion(options) {
	if (!lessonAnimationAction) {
		return;
	}

	const shouldResetPose = !!(options && options.resetPose);
	const preservedPose = shouldResetPose ? null : captureLessonVrmPose();

	if (lessonAnimationRun && lessonAnimationRun.syntheticLocomotion) {
		lessonAnimationAction.stop();

		if (shouldResetPose) {
			resetVrmPoseForAnimation();
		} else {
			applyLessonVrmPose(preservedPose);
		}

		if (currentVrmEntity) {
			currentVrmEntity.object3D.updateMatrixWorld(true);
		}

		return;
	}

	if (!lessonAnimationAction.rootMotionStart || !currentVrmEntity) {
		lessonAnimationAction.stop();

		if (shouldResetPose) {
			resetVrmPoseForAnimation();
		} else {
			applyLessonVrmPose(preservedPose);
		}

		return;
	}

	const start = lessonAnimationAction.rootMotionStart;
	const end = captureLessonAnimationRootMotion();

	if (!end) {
		lessonAnimationAction.stop();

		if (shouldResetPose) {
			resetVrmPoseForAnimation();
		} else {
			applyLessonVrmPose(preservedPose);
		}

		return;
	}

	const deltaPosition = end.position.clone().sub(start.position);
	deltaPosition.y = 0;

	if (deltaPosition.length() > LESSON_ROOT_MOTION_POSITION_EPSILON) {
		moveCharacterEntityByWorldDelta(deltaPosition);
	}

	const yawDelta = normalizeAngle(end.yaw - start.yaw);

	if (Math.abs(yawDelta) > LESSON_ROOT_MOTION_YAW_EPSILON) {
		const yawRotation = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), yawDelta);
		currentVrmEntity.object3D.quaternion.multiply(yawRotation);
	}

	currentVrmEntity.object3D.updateMatrixWorld(true);
	lessonAnimationAction.stop();
	if (shouldResetPose) {
		resetVrmPoseForAnimation();
	} else {
		compensateExtractedLessonRootMotion(preservedPose, end);
		applyLessonVrmPose(preservedPose);
	}
	currentVrmEntity.object3D.updateMatrixWorld(true);
}

function compensateExtractedLessonRootMotion(pose, rootMotionEnd) {
	if (!pose || !rootMotionEnd || !rootMotionEnd.node || !rootMotionEnd.node.parent) {
		return;
	}

	const rootPose = pose.find((bone) => bone.node === rootMotionEnd.node);

	if (!rootPose) {
		return;
	}

	rootMotionEnd.node.parent.updateMatrixWorld(true);

	const localPosition = rootMotionEnd.position.clone();
	rootMotionEnd.node.parent.worldToLocal(localPosition);

	const parentWorldQuaternion = rootMotionEnd.node.parent.getWorldQuaternion(new THREE.Quaternion());
	const localQuaternion = parentWorldQuaternion.invert().multiply(rootMotionEnd.quaternion).normalize();

	rootPose.position.copy(localPosition);
	rootPose.quaternion.copy(localQuaternion);
}

function getLessonRootMotionNode() {
	if (currentVrm && currentVrm.humanoid) {
		const hips = currentVrm.humanoid.getNormalizedBoneNode('hips');

		if (hips) {
			return hips;
		}
	}

	return currentVrm ? currentVrm.scene : null;
}

function moveCharacterEntityByWorldDelta(deltaPosition) {
	const object = currentVrmEntity.object3D;
	const worldPosition = object.getWorldPosition(new THREE.Vector3()).add(deltaPosition);

	if (object.parent) {
		object.parent.worldToLocal(worldPosition);
	}

	object.position.copy(worldPosition);
}

function getYawFromQuaternion(quaternion) {
	const forward = new THREE.Vector3(0, 0, 1).applyQuaternion(quaternion);
	forward.y = 0;

	if (forward.lengthSq() < 0.000001) {
		return 0;
	}

	forward.normalize();

	return Math.atan2(forward.x, forward.z);
}

function normalizeAngle(angle) {
	let normalized = angle;

	while (normalized > Math.PI) {
		normalized -= Math.PI * 2;
	}

	while (normalized < -Math.PI) {
		normalized += Math.PI * 2;
	}

	return normalized;
}

function startLessonCameraFollow() {
	if (lessonCameraFollow) {
		stopLessonCameraFollow();
	}

	const cameraEl = getLessonCameraElement();

	if (!cameraEl || !currentVrmEntity) {
		return;
	}

	const camera = cameraEl.object3D;
	const target = getLessonCameraTargetWorldPosition();

	camera.updateMatrixWorld(true);

	const cameraWorldPosition = camera.getWorldPosition(new THREE.Vector3());
	const offset = cameraWorldPosition.clone().sub(target);
	const distance = Math.max(offset.length(), LESSON_CAMERA_MIN_DISTANCE);

	if (offset.lengthSq() < 0.000001) {
		offset.set(0, 0.25, 1).normalize().multiplyScalar(distance);
	}

	const cameraOffset = offset.clone().normalize().multiplyScalar(distance);
	const characterWorldQuaternion = currentVrmEntity.object3D.getWorldQuaternion(new THREE.Quaternion());
	const cameraLocalOffset = cameraOffset.clone().applyQuaternion(characterWorldQuaternion.invert());
	const cameraOffsetDirection = cameraOffset.clone().normalize();
	const offsetElevation = clamp(cameraOffsetDirection.y, -0.15, 0.35);
	const offsetLateral = clamp(cameraLocalOffset.x / distance, -0.35, 0.35);
	const faceForwardYawOffset = getLessonFaceForwardYawOffset();

	lessonCameraFollow = {
		mode: 'follow',
		cameraEl: cameraEl,
		camera: camera,
		initialPosition: camera.position.clone(),
		initialQuaternion: camera.quaternion.clone(),
		controlsState: getLessonCameraControlsState(cameraEl),
		offsetDirection: cameraOffsetDirection,
		offsetElevation: offsetElevation,
		offsetLateral: offsetLateral,
		faceForwardYawOffset: faceForwardYawOffset,
		stableOffsetDirection: cameraOffsetDirection.clone(),
		lastFaceOffsetYaw: null,
		faceStableTimeMs: LESSON_CAMERA_FACE_STABLE_DURATION_MS,
		normalDistance: distance,
		distance: distance,
		smoothedTarget: target.clone(),
		userControlLastTime: -Infinity,
		userControlPointerActive: false,
		userControlKeys: {}
	};

	syncLessonCameraLookControls(cameraEl);
	lessonCameraFollow.userControlCleanup = bindLessonCameraUserControls(cameraEl, lessonCameraFollow);
}

function returnLessonCameraToStart() {
	if (!lessonCameraFollow) {
		return;
	}

	lessonCameraFollow.mode = 'return';
}

function stopLessonCameraFollow() {
	if (!lessonCameraFollow) {
		return;
	}

	removeLessonCameraUserControls(lessonCameraFollow);
	restoreLessonCameraControls(lessonCameraFollow.cameraEl, lessonCameraFollow.controlsState);
	lessonCameraFollow = null;
}

function completeLessonCameraReturn(returnPose) {
	const camera = lessonCameraFollow.camera;
	const cameraEl = lessonCameraFollow.cameraEl;

	camera.position.copy(returnPose.localPosition);
	camera.quaternion.copy(returnPose.quaternion);
	camera.updateMatrixWorld(true);
	syncLessonCameraLookControls(cameraEl);
	removeLessonCameraUserControls(lessonCameraFollow);
	restoreLessonCameraControls(cameraEl, lessonCameraFollow.controlsState);
	lessonCameraFollow = null;
}

function suspendLessonCameraFollowForAvatarChange() {
	if (!lessonCameraFollow) {
		return null;
	}

	const camera = lessonCameraFollow.camera;
	camera.updateMatrixWorld(true);
	lessonCameraFollow.avatarChangeSuspended = true;

	return {
		position: camera.position.clone(),
		quaternion: camera.quaternion.clone()
	};
}

function restoreLessonCameraFollowAfterAvatarChange(state) {
	if (!lessonCameraFollow) {
		return;
	}

	lessonCameraFollow.avatarChangeSuspended = false;

	if (!state) {
		return;
	}

	const camera = lessonCameraFollow.camera;
	camera.position.copy(state.position);
	camera.quaternion.copy(state.quaternion);
	camera.updateMatrixWorld(true);
	syncLessonCameraLookControls(lessonCameraFollow.cameraEl);
	resyncLessonCameraFollowFromCurrentCamera();
}

function resyncLessonCameraFollowFromCurrentCamera() {
	if (!lessonCameraFollow || !currentVrmEntity) {
		return;
	}

	const camera = lessonCameraFollow.camera;
	const target = getLessonCameraTargetWorldPosition({ speakFraming: isLessonSpeakCameraStep() });

	camera.updateMatrixWorld(true);
	currentVrmEntity.object3D.updateMatrixWorld(true);

	const cameraWorldPosition = camera.getWorldPosition(new THREE.Vector3());
	const offset = cameraWorldPosition.clone().sub(target);
	const distance = Math.max(offset.length(), LESSON_CAMERA_MIN_DISTANCE);

	if (offset.lengthSq() < 0.000001) {
		offset.set(0, 0.25, 1).normalize().multiplyScalar(distance);
	}

	const offsetDirection = offset.clone().normalize();
	const characterWorldQuaternion = currentVrmEntity.object3D.getWorldQuaternion(new THREE.Quaternion());
	const cameraLocalOffset = offset.clone().applyQuaternion(characterWorldQuaternion.invert());

	lessonCameraFollow.smoothedTarget.copy(target);
	lessonCameraFollow.offsetDirection.copy(offsetDirection);
	lessonCameraFollow.stableOffsetDirection.copy(offsetDirection);
	lessonCameraFollow.normalDistance = distance;
	lessonCameraFollow.distance = distance;
	lessonCameraFollow.offsetElevation = clamp(offsetDirection.y, -0.15, 0.35);
	lessonCameraFollow.offsetLateral = clamp(cameraLocalOffset.x / distance, -0.35, 0.35);
	lessonCameraFollow.faceForwardYawOffset = getLessonFaceForwardYawOffset();
	lessonCameraFollow.lastFaceOffsetYaw = getLessonDirectionYaw(offsetDirection);
	lessonCameraFollow.faceStableTimeMs = 0;
}

function updateLessonCameraFollow(timeDelta) {
	if (!lessonCameraFollow) {
		return;
	}

	if (lessonCameraFollow.avatarChangeSuspended) {
		return;
	}

	const camera = lessonCameraFollow.camera;
	const dt = Math.min(timeDelta / 1000, LESSON_CAMERA_MAX_DELTA_SECONDS);

	if (lessonCameraFollow.mode === 'return') {
		const alpha = getDampingAlpha(LESSON_CAMERA_RETURN_DAMPING, dt);
		const returnPose = getLessonCameraReturnPose();

		if (isLessonCameraUserControlActive(lessonCameraFollow)) {
			return;
		}

		camera.position.lerp(returnPose.localPosition, alpha);
		camera.quaternion.slerp(returnPose.quaternion, alpha);
		camera.updateMatrixWorld(true);
		syncLessonCameraLookControls(lessonCameraFollow.cameraEl);

		if (
			camera.position.distanceTo(returnPose.localPosition) < 0.005 &&
			1 - Math.abs(camera.quaternion.dot(returnPose.quaternion)) < 0.0001
		) {
			completeLessonCameraReturn(returnPose);
		}

		return;
	}

	const isSpeakFraming = isLessonSpeakCameraStep();
	const target = getLessonCameraTargetWorldPosition({ speakFraming: isSpeakFraming });
	const targetAlpha = getDampingAlpha(LESSON_CAMERA_TARGET_DAMPING, dt);
	lessonCameraFollow.smoothedTarget.lerp(target, targetAlpha);

	const desiredOffsetDirection = getLessonStableFaceAwareCameraOffsetDirection(lessonCameraFollow, dt);
	const offsetAlpha = getDampingAlpha(LESSON_CAMERA_FACE_OFFSET_DAMPING, dt);
	lessonCameraFollow.offsetDirection.lerp(desiredOffsetDirection, offsetAlpha);

	if (lessonCameraFollow.offsetDirection.lengthSq() < 0.000001) {
		lessonCameraFollow.offsetDirection.copy(desiredOffsetDirection);
	}

	lessonCameraFollow.offsetDirection.normalize();

	const desiredDistance = getLessonCameraDesiredDistance(lessonCameraFollow, isSpeakFraming);
	const distanceAlpha = getDampingAlpha(LESSON_CAMERA_DISTANCE_DAMPING, dt);
	lessonCameraFollow.distance += (desiredDistance - lessonCameraFollow.distance) * distanceAlpha;

	const desiredWorldPosition = lessonCameraFollow.smoothedTarget.clone().add(
		lessonCameraFollow.offsetDirection.clone().multiplyScalar(lessonCameraFollow.distance)
	);

	if (isLessonCameraUserControlActive(lessonCameraFollow)) {
		return;
	}

	const desiredLocalPosition = desiredWorldPosition.clone();

	if (camera.parent) {
		camera.parent.worldToLocal(desiredLocalPosition);
	}

	const positionAlpha = getDampingAlpha(LESSON_CAMERA_POSITION_DAMPING, dt);
	camera.position.lerp(desiredLocalPosition, positionAlpha);

	const desiredQuaternion = getCameraLookAtQuaternion(camera, lessonCameraFollow.smoothedTarget);
	const lookAlpha = getDampingAlpha(LESSON_CAMERA_LOOK_DAMPING, dt);
	camera.quaternion.slerp(desiredQuaternion, lookAlpha);
	camera.updateMatrixWorld(true);
	syncLessonCameraLookControls(lessonCameraFollow.cameraEl);
}

function getLessonStableFaceAwareCameraOffsetDirection(follow, dt) {
	const candidateDirection = getLessonFaceAwareCameraOffsetDirection(follow);
	const candidateYaw = getLessonDirectionYaw(candidateDirection);

	if (!follow.stableOffsetDirection) {
		follow.stableOffsetDirection = candidateDirection.clone();
	}

	if (!Number.isFinite(follow.lastFaceOffsetYaw)) {
		follow.lastFaceOffsetYaw = candidateYaw;
		follow.faceStableTimeMs = LESSON_CAMERA_FACE_STABLE_DURATION_MS;
		follow.stableOffsetDirection.copy(candidateDirection);
		return follow.stableOffsetDirection.clone();
	}

	const yawDelta = normalizeAngle(candidateYaw - follow.lastFaceOffsetYaw);
	const yawSpeed = dt > 0 ? Math.abs(yawDelta) / dt : 0;

	follow.lastFaceOffsetYaw = candidateYaw;

	if (yawSpeed <= LESSON_CAMERA_FACE_STABLE_SPEED) {
		follow.faceStableTimeMs = Math.min(
			getNumber(follow.faceStableTimeMs, 0) + dt * 1000,
			LESSON_CAMERA_FACE_STABLE_DURATION_MS
		);
	} else {
		follow.faceStableTimeMs = 0;
	}

	if (follow.faceStableTimeMs >= LESSON_CAMERA_FACE_STABLE_DURATION_MS) {
		follow.stableOffsetDirection.copy(candidateDirection);
	}

	return follow.stableOffsetDirection.clone();
}

function getLessonCameraDesiredDistance(follow, isSpeakFraming) {
	const normalDistance = getNumber(follow.normalDistance, follow.distance);

	if (!isSpeakFraming) {
		return normalDistance;
	}

	return Math.min(
		normalDistance,
		Math.max(LESSON_CAMERA_SPEAK_MIN_DISTANCE, normalDistance * LESSON_CAMERA_SPEAK_DISTANCE_SCALE)
	);
}

function isLessonSpeakCameraStep() {
	return !!(
		characterAction &&
		characterAction.activeStep &&
		characterAction.activeStep.type === 'speak'
	);
}

function getLessonFaceAwareCameraOffsetDirection(follow) {
	const faceDirection = getLessonFaceForwardWorldDirection();
	const forward = faceDirection && faceDirection.lengthSq() >= 0.000001
		? faceDirection
		: follow.offsetDirection.clone();

	forward.y = 0;

	if (forward.lengthSq() < 0.000001) {
		forward.set(0, 0, 1);
	}

	forward.normalize();

	const up = new THREE.Vector3(0, 1, 0);
	const right = new THREE.Vector3().crossVectors(up, forward);

	if (right.lengthSq() < 0.000001) {
		right.set(1, 0, 0);
	} else {
		right.normalize();
	}

	const elevation = clamp(getNumber(follow.offsetElevation, 0.08), -0.15, 0.35);
	const lateral = clamp(getNumber(follow.offsetLateral, 0), -0.35, 0.35);
	const forwardScale = Math.sqrt(Math.max(0.01, 1 - elevation * elevation - lateral * lateral));

	return forward.multiplyScalar(forwardScale)
		.add(right.multiplyScalar(lateral))
		.add(up.multiplyScalar(elevation))
		.normalize();
}

function getLessonFaceForwardYawOffset() {
	const boneDirection = getLessonBoneForwardWorldDirection('head') || getLessonBoneForwardWorldDirection('chest');
	const entityDirection = getLessonEntityForwardWorldDirection();

	if (!boneDirection || !entityDirection) {
		return 0;
	}

	return normalizeAngle(getLessonDirectionYaw(entityDirection) - getLessonDirectionYaw(boneDirection));
}

function getLessonFaceForwardWorldDirection() {
	const boneDirection = getLessonBoneForwardWorldDirection('head') || getLessonBoneForwardWorldDirection('chest');

	if (boneDirection) {
		const yawOffset = lessonCameraFollow
			? getNumber(lessonCameraFollow.faceForwardYawOffset, 0)
			: getLessonFaceForwardYawOffset();

		return boneDirection
			.applyAxisAngle(new THREE.Vector3(0, 1, 0), yawOffset)
			.normalize();
	}

	return getLessonEntityForwardWorldDirection();
}

function getLessonDirectionYaw(direction) {
	const flatDirection = direction.clone();
	flatDirection.y = 0;

	if (flatDirection.lengthSq() < 0.000001) {
		return 0;
	}

	flatDirection.normalize();

	return Math.atan2(flatDirection.x, flatDirection.z);
}

function getLessonBoneForwardWorldDirection(boneName) {
	if (!currentVrm || !currentVrm.humanoid) {
		return null;
	}

	const bone = currentVrm.humanoid.getNormalizedBoneNode(boneName);

	if (!bone) {
		return null;
	}

	bone.updateMatrixWorld(true);

	const direction = new THREE.Vector3(0, 0, 1).applyQuaternion(
		bone.getWorldQuaternion(new THREE.Quaternion())
	);
	direction.y = 0;

	if (direction.lengthSq() < 0.000001) {
		return null;
	}

	return direction.normalize();
}

function getLessonEntityForwardWorldDirection() {
	if (!currentVrmEntity) {
		return null;
	}

	currentVrmEntity.object3D.updateMatrixWorld(true);

	const direction = new THREE.Vector3(0, 0, 1).applyQuaternion(
		currentVrmEntity.object3D.getWorldQuaternion(new THREE.Quaternion())
	);
	direction.y = 0;

	if (direction.lengthSq() < 0.000001) {
		return null;
	}

	return direction.normalize();
}

function getLessonCameraElement() {
	return document.getElementById('my_camera') || (currentVrmEntity && currentVrmEntity.sceneEl && currentVrmEntity.sceneEl.camera && currentVrmEntity.sceneEl.camera.el);
}

function getLessonCameraReturnPose() {
	const camera = lessonCameraFollow.camera;
	const target = getLessonCameraTargetWorldPosition();
	const returnDistance = getLessonCameraDesiredDistance(lessonCameraFollow, false);
	const returnOffsetDirection = lessonCameraFollow.stableOffsetDirection
		? lessonCameraFollow.stableOffsetDirection.clone().normalize()
		: getLessonFaceAwareCameraOffsetDirection(lessonCameraFollow);
	const worldOffset = returnOffsetDirection.multiplyScalar(returnDistance);
	const worldPosition = target.clone().add(worldOffset);
	const localPosition = worldPosition.clone();

	if (camera.parent) {
		camera.parent.worldToLocal(localPosition);
	}

	return {
		localPosition: localPosition,
		quaternion: getCameraLookAtQuaternionAtWorldPosition(camera, worldPosition, target)
	};
}

function getLessonCameraTargetWorldPosition(options) {
	if (currentVrmEntity) {
		currentVrmEntity.object3D.updateMatrixWorld(true);
	}

	if (options && options.speakFraming) {
		const speakTarget = getLessonSpeakCameraTargetWorldPosition();

		if (speakTarget) {
			return speakTarget;
		}
	}

	if (currentVrm && currentVrm.humanoid) {
		const head = currentVrm.humanoid.getNormalizedBoneNode('head');

		if (head) {
			const headPosition = head.getWorldPosition(new THREE.Vector3());
			headPosition.y -= 0.12;
			return headPosition;
		}
	}

	return currentVrmEntity.object3D.localToWorld(new THREE.Vector3(0, LESSON_CAMERA_TARGET_HEIGHT, 0));
}

function getLessonSpeakCameraTargetWorldPosition() {
	if (currentVrm && currentVrm.humanoid) {
		const head = currentVrm.humanoid.getNormalizedBoneNode('head');
		const hips = currentVrm.humanoid.getNormalizedBoneNode('hips');

		if (head && hips) {
			const headPosition = head.getWorldPosition(new THREE.Vector3());
			const hipsPosition = hips.getWorldPosition(new THREE.Vector3());

			return hipsPosition.lerp(headPosition, LESSON_CAMERA_SPEAK_TARGET_MIX);
		}

		if (head) {
			const headPosition = head.getWorldPosition(new THREE.Vector3());
			headPosition.y -= LESSON_CAMERA_SPEAK_HEAD_DOWN_OFFSET;
			return headPosition;
		}
	}

	return currentVrmEntity.object3D.localToWorld(new THREE.Vector3(0, LESSON_CAMERA_TARGET_HEIGHT - 0.25, 0));
}

function getCameraLookAtQuaternion(camera, worldTarget) {
	camera.updateMatrixWorld(true);

	const cameraWorldPosition = camera.getWorldPosition(new THREE.Vector3());

	return getCameraLookAtQuaternionAtWorldPosition(camera, cameraWorldPosition, worldTarget);
}

function getCameraLookAtQuaternionAtWorldPosition(camera, worldPosition, worldTarget) {
	const lookMatrix = new THREE.Matrix4().lookAt(worldPosition, worldTarget, new THREE.Vector3(0, 1, 0));
	const worldQuaternion = new THREE.Quaternion().setFromRotationMatrix(lookMatrix);

	if (!camera.parent) {
		return worldQuaternion;
	}

	const parentWorldQuaternion = camera.parent.getWorldQuaternion(new THREE.Quaternion());

	return parentWorldQuaternion.invert().multiply(worldQuaternion);
}

function bindLessonCameraUserControls(cameraEl, follow) {
	const sceneEl = cameraEl && cameraEl.sceneEl ? cameraEl.sceneEl : null;
	const canvas = sceneEl && sceneEl.canvas ? sceneEl.canvas : document;
	const cleanup = [];
	const addListener = (target, eventName, handler) => {
		if (!target || typeof target.addEventListener !== 'function') {
			return;
		}

		target.addEventListener(eventName, handler);
		cleanup.push(() => {
			target.removeEventListener(eventName, handler);
		});
	};
	const markControl = () => {
		markLessonCameraUserControl(follow);
	};
	const startPointerControl = () => {
		follow.userControlPointerActive = true;
		markControl();
	};
	const updatePointerControl = (event) => {
		if (
			follow.userControlPointerActive ||
			(event && event.buttons) ||
			(document.pointerLockElement && event && (event.movementX || event.movementY))
		) {
			markControl();
		}
	};
	const stopPointerControl = () => {
		if (follow.userControlPointerActive) {
			markControl();
		}

		follow.userControlPointerActive = false;
	};
	const handleKeyDown = (event) => {
		if (!isLessonCameraControlKey(event)) {
			return;
		}

		follow.userControlKeys[getLessonCameraControlKeyId(event)] = true;
		markControl();
	};
	const handleKeyUp = (event) => {
		if (!isLessonCameraControlKey(event)) {
			return;
		}

		delete follow.userControlKeys[getLessonCameraControlKeyId(event)];
		markControl();
	};

	if (window.PointerEvent) {
		addListener(canvas, 'pointerdown', startPointerControl);
		addListener(window, 'pointermove', updatePointerControl);
		addListener(window, 'pointerup', stopPointerControl);
		addListener(window, 'pointercancel', stopPointerControl);
	} else {
		addListener(canvas, 'mousedown', startPointerControl);
		addListener(window, 'mousemove', updatePointerControl);
		addListener(window, 'mouseup', stopPointerControl);
		addListener(canvas, 'touchstart', startPointerControl);
		addListener(window, 'touchmove', markControl);
		addListener(window, 'touchend', stopPointerControl);
		addListener(window, 'touchcancel', stopPointerControl);
	}

	addListener(canvas, 'wheel', markControl);
	addListener(window, 'keydown', handleKeyDown);
	addListener(window, 'keyup', handleKeyUp);
	addListener(window, 'blur', () => {
		follow.userControlPointerActive = false;
		follow.userControlKeys = {};
	});

	return () => {
		cleanup.forEach((removeListener) => {
			removeListener();
		});
	};
}

function removeLessonCameraUserControls(follow) {
	if (!follow || typeof follow.userControlCleanup !== 'function') {
		return;
	}

	follow.userControlCleanup();
	follow.userControlCleanup = null;
}

function markLessonCameraUserControl(follow) {
	if (!follow) {
		return;
	}

	follow.userControlLastTime = performance.now();
}

function isLessonCameraUserControlActive(follow) {
	if (!follow) {
		return false;
	}

	if (follow.userControlPointerActive || hasLessonCameraControlKeys(follow)) {
		return true;
	}

	return performance.now() - getNumber(follow.userControlLastTime, -Infinity) < LESSON_CAMERA_USER_CONTROL_IDLE_MS;
}

function hasLessonCameraControlKeys(follow) {
	return !!(follow && follow.userControlKeys && Object.keys(follow.userControlKeys).length > 0);
}

function isLessonCameraControlKey(event) {
	const keyId = getLessonCameraControlKeyId(event);

	return [
		'KeyW',
		'KeyA',
		'KeyS',
		'KeyD',
		'ArrowUp',
		'ArrowDown',
		'ArrowLeft',
		'ArrowRight',
		'KeyQ',
		'KeyE',
		'w',
		'a',
		's',
		'd',
		'arrowup',
		'arrowdown',
		'arrowleft',
		'arrowright',
		'q',
		'e'
	].indexOf(keyId) !== -1;
}

function getLessonCameraControlKeyId(event) {
	if (!event) {
		return '';
	}

	return event.code || String(event.key || '').toLowerCase();
}

function getLessonCameraControlsState(cameraEl) {
	const state = {};

	if (!cameraEl || !cameraEl.components) {
		return state;
	}

	['look-controls', 'wasd-controls'].forEach((componentName) => {
		const component = cameraEl.components[componentName];

		if (component && component.data) {
			state[componentName] = component.data.enabled !== false;
		}
	});

	return state;
}

function restoreLessonCameraControls(cameraEl, state) {
	if (!cameraEl || !state) {
		return;
	}

	Object.keys(state).forEach((componentName) => {
		setLessonCameraControlEnabled(cameraEl, componentName, state[componentName]);
	});
}

function syncLessonCameraLookControls(cameraEl) {
	if (!cameraEl || !cameraEl.components || !cameraEl.components['look-controls']) {
		return;
	}

	const controls = cameraEl.components['look-controls'];

	if (!controls.pitchObject || !controls.yawObject) {
		return;
	}

	const camera = cameraEl.object3D;
	const magicWindowDeltaEuler = controls.magicWindowDeltaEuler || { x: 0, y: 0, z: 0 };
	const cameraEuler = new THREE.Euler().setFromQuaternion(camera.quaternion, 'YXZ');

	controls.pitchObject.rotation.x = clamp(cameraEuler.x - (magicWindowDeltaEuler.x || 0), -Math.PI / 2, Math.PI / 2);
	controls.pitchObject.rotation.y = 0;
	controls.pitchObject.rotation.z = 0;
	controls.yawObject.rotation.x = 0;
	controls.yawObject.rotation.y = cameraEuler.y - (magicWindowDeltaEuler.y || 0);
	controls.yawObject.rotation.z = 0;
}

function setLessonCameraControlEnabled(cameraEl, componentName, enabled) {
	if (!cameraEl || !cameraEl.components || !cameraEl.components[componentName]) {
		return;
	}

	cameraEl.setAttribute(componentName, 'enabled', enabled);

	const component = cameraEl.components[componentName];

	if (enabled && typeof component.play === 'function') {
		component.play();
	} else if (!enabled && typeof component.pause === 'function') {
		component.pause();
	}
}

function getDampingAlpha(damping, dt) {
	return 1 - Math.exp(-damping * dt);
}

function playLessonVrmaAnimation(animationName, direction, onFinished, options) {
	const resolvedAnimationName = getLessonAnimationName(animationName);
	const animationOptions = getLessonAnimationOptions(options);

	ensureLessonAnimationClip(animationName)
		.then((clip) => {
			if (!currentVrm || !currentVrm.scene || !characterAction) {
				return;
			}

			stopLessonAnimation();

			if (!lessonAnimationMixer) {
				lessonAnimationMixer = new THREE.AnimationMixer(currentVrm.scene);
			}

			lessonAnimationAction = lessonAnimationMixer.clipAction(clip);
			const syntheticLocomotion = getLessonSyntheticLocomotion(resolvedAnimationName, animationOptions, clip);
			const deadlineDurationMs = syntheticLocomotion
				? syntheticLocomotion.durationMs
				: animationOptions.durationMs;
			lessonAnimationRun = {
				clip: clip,
				direction: direction,
				animationName: resolvedAnimationName,
				syntheticLocomotion: syntheticLocomotion,
				lastLocomotionTime: performance.now(),
				deadline: getAnimationDeadline(deadlineDurationMs),
				onFinished: onFinished,
				finished: false
			};

			lessonAnimationFinishedHandler = (event) => {
				if (event.action !== lessonAnimationAction) {
					return;
				}

				handleLessonAnimationCycleFinished();
			};

			if (!syntheticLocomotion) {
				lessonAnimationMixer.addEventListener('finished', lessonAnimationFinishedHandler);
			}

			startLessonAnimationCycle();

			if (lessonAnimationRun.deadline !== null) {
				const remainingMs = Math.max(0, lessonAnimationRun.deadline - performance.now());

				lessonAnimationTimeoutId = window.setTimeout(() => {
					finishLessonAnimationRun(true);
				}, remainingMs);
			}
		})
		.catch((error) => {
			console.error('Failed to play VRMA animation:', error);
			if (typeof onFinished === 'function') {
				onFinished();
			}
		});
}

function startLessonAnimationCycle() {
	if (!lessonAnimationAction || !lessonAnimationRun || !lessonAnimationMixer) {
		return;
	}

	lessonAnimationAction.stop();

	if (lessonAnimationRun.syntheticLocomotion) {
		lessonAnimationAction.setLoop(THREE.LoopRepeat, Infinity);
		lessonAnimationAction.clampWhenFinished = false;
	} else {
		lessonAnimationAction.setLoop(THREE.LoopOnce, 1);
		lessonAnimationAction.clampWhenFinished = true;
	}

	lessonAnimationAction.enabled = true;
	lessonAnimationAction.paused = false;

	if (lessonAnimationRun.direction === 'backward') {
		lessonAnimationAction.time = lessonAnimationRun.clip.duration;
		lessonAnimationAction.timeScale = -1;
	} else {
		lessonAnimationAction.reset();
		lessonAnimationAction.timeScale = 1;
	}

	lessonAnimationAction.play();
	lessonAnimationMixer.update(0);
	lessonAnimationAction.rootMotionStart = captureLessonAnimationRootMotion();
}

function handleLessonAnimationCycleFinished() {
	if (!lessonAnimationRun || lessonAnimationRun.finished) {
		return;
	}

	applyLessonAnimationRootMotion({ resetPose: false });

	if (shouldContinueLessonAnimation()) {
		startLessonAnimationCycle();
		return;
	}

	finishLessonAnimationRun(false);
}

function shouldContinueLessonAnimation() {
	if (!lessonAnimationRun || lessonAnimationRun.deadline === null) {
		return false;
	}

	return lessonAnimationRun.deadline - performance.now() > 16;
}

function finishLessonAnimationRun(shouldApplyRootMotion) {
	if (!lessonAnimationRun || lessonAnimationRun.finished) {
		return;
	}

	const run = lessonAnimationRun;

	updateLessonSyntheticLocomotion();
	run.finished = true;

	if (lessonAnimationTimeoutId !== null) {
		window.clearTimeout(lessonAnimationTimeoutId);
		lessonAnimationTimeoutId = null;
	}

	if (lessonAnimationMixer && lessonAnimationFinishedHandler) {
		lessonAnimationMixer.removeEventListener('finished', lessonAnimationFinishedHandler);
	}

	lessonAnimationFinishedHandler = null;

	if (shouldApplyRootMotion) {
		applyLessonAnimationRootMotion({ resetPose: false });
	} else if (lessonAnimationAction) {
		const preservedPose = captureLessonVrmPose();
		lessonAnimationAction.stop();
		applyLessonVrmPose(preservedPose);
	}

	lessonAnimationAction = null;
	lessonAnimationRun = null;

	if (typeof run.onFinished === 'function') {
		run.onFinished();
	}
}

function startLessonPoseTransition(sourcePose, targetPose, onFinished, durationMs) {
	if (!sourcePose || sourcePose.length === 0 || !targetPose || targetPose.length === 0) {
		return false;
	}

	applyLessonVrmPose(sourcePose);
	lessonPoseTransition = {
		startTime: performance.now(),
		durationMs: getNumber(durationMs, LESSON_ACTION_POSE_TRANSITION_MS),
		sourcePose: sourcePose,
		targetPose: targetPose,
		onFinished: onFinished
	};

	return true;
}

function updateLessonPoseTransition() {
	if (!lessonPoseTransition) {
		return;
	}

	const transition = lessonPoseTransition;
	const elapsed = performance.now() - transition.startTime;
	const progress = transition.durationMs > 0 ? Math.min(elapsed / transition.durationMs, 1) : 1;
	const easedProgress = smoothStep(progress);

	applyInterpolatedLessonVrmPose(transition.sourcePose, transition.targetPose, easedProgress);

	if (progress < 1) {
		return;
	}

	applyLessonVrmPose(transition.targetPose);
	lessonPoseTransition = null;

	if (typeof transition.onFinished === 'function') {
		transition.onFinished();
	}
}

function captureLessonVrmPose() {
	if (!currentVrm || !currentVrm.humanoid) {
		return [];
	}

	return LESSON_POSE_TRANSITION_BONES
		.map((boneName) => {
			const node = currentVrm.humanoid.getNormalizedBoneNode(boneName);

			if (!node) {
				return null;
			}

			return {
				boneName: boneName,
				node: node,
				position: node.position.clone(),
				quaternion: node.quaternion.clone(),
				scale: node.scale.clone()
			};
		})
		.filter(Boolean);
}

function applyLessonVrmPose(pose) {
	pose.forEach((bone) => {
		bone.node.position.copy(bone.position);
		bone.node.quaternion.copy(bone.quaternion);
		bone.node.scale.copy(bone.scale);
	});
}

function applyLessonVrmPoseToCurrentAvatar(pose) {
	if (!pose || !currentVrm || !currentVrm.humanoid) {
		return;
	}

	pose.forEach((bone) => {
		if (!bone.boneName) {
			return;
		}

		const node = currentVrm.humanoid.getNormalizedBoneNode(bone.boneName);

		if (!node) {
			return;
		}

		node.quaternion.copy(bone.quaternion);
	});

	if (currentVrm.scene) {
		currentVrm.scene.updateMatrixWorld(true);
	}
}

function applyInterpolatedLessonVrmPose(sourcePose, targetPose, progress) {
	const count = Math.min(sourcePose.length, targetPose.length);

	for (let index = 0; index < count; index += 1) {
		const source = sourcePose[index];
		const target = targetPose[index];

		source.node.position.lerpVectors(source.position, target.position, progress);
		source.node.quaternion.slerpQuaternions(source.quaternion, target.quaternion, progress);
		source.node.scale.lerpVectors(source.scale, target.scale, progress);
	}
}

function getAnimationDeadline(durationMs) {
	if (durationMs === null || durationMs === undefined || durationMs === '') {
		return null;
	}

	const duration = Number(durationMs);

	if (!Number.isFinite(duration) || duration < 0) {
		return null;
	}

	return performance.now() + duration;
}

function getLessonAnimationOptions(options) {
	if (options && typeof options === 'object') {
		return {
			durationMs: getOptionalNumber(options.durationMs, options.moveTimeMs, options.moveDurationMs, options.timeMs),
			speed: getOptionalNumber(options.speed, options.moveSpeed),
			turnAngle: getOptionalNumber(options.turnAngle, options.turnAngleDeg, options.angle, options.yawAngle)
		};
	}

	return {
		durationMs: getOptionalNumber(options),
		speed: null,
		turnAngle: null
	};
}

function getOptionalNumber() {
	for (let index = 0; index < arguments.length; index += 1) {
		const value = arguments[index];

		if (value === null || value === undefined || value === '') {
			continue;
		}

		if (Number.isFinite(Number(value))) {
			return Number(value);
		}
	}

	return null;
}

function getLessonSyntheticLocomotion(animationName, options, clip) {
	const locomotion = LESSON_SYNTHETIC_LOCOMOTION[animationName];

	if (!locomotion) {
		return null;
	}

	const now = performance.now();
	const durationMs = getNumber(options.durationMs, locomotion.durationMs);

	return {
		speed: getNumber(options.speed, locomotion.speed),
		durationMs: Math.max(durationMs, 0),
		inertiaMs: LESSON_SYNTHETIC_LOCOMOTION_INERTIA_MS,
		startTime: now,
		startQuaternion: currentVrmEntity ? currentVrmEntity.object3D.quaternion.clone() : new THREE.Quaternion(),
		turnAngleRadians: THREE.MathUtils.degToRad(getNumber(options.turnAngle, 0))
	};
}

function updateLessonSyntheticLocomotion() {
	if (
		!lessonAnimationRun ||
		lessonAnimationRun.finished ||
		!lessonAnimationRun.syntheticLocomotion ||
		!currentVrmEntity
	) {
		return;
	}

	const locomotion = lessonAnimationRun.syntheticLocomotion;
	const speed = getNumber(locomotion.speed, 0);
	const now = performance.now();
	const previousTime = lessonAnimationRun.lastLocomotionTime || now;
	let elapsedMs = Math.max(0, now - previousTime);

	if (lessonAnimationRun.deadline !== null) {
		elapsedMs = Math.min(elapsedMs, Math.max(0, lessonAnimationRun.deadline - previousTime));
	}

	lessonAnimationRun.lastLocomotionTime = now;

	const seconds = elapsedMs / 1000;
	const durationMs = Math.max(locomotion.durationMs, 0);
	const previousElapsedMs = Math.max(0, previousTime - locomotion.startTime);
	const currentElapsedMs = Math.max(0, now - locomotion.startTime);
	const previousProgress = durationMs > 0 ? Math.min(previousElapsedMs / durationMs, 1) : 1;
	const currentProgress = durationMs > 0 ? Math.min(currentElapsedMs / durationMs, 1) : 1;
	const moveProgress = (previousProgress + currentProgress) * 0.5;

	if (elapsedMs <= 0) {
		applyLessonSyntheticTurn(locomotion, currentProgress);
		return;
	}

	const moveRotation = new THREE.Quaternion().setFromAxisAngle(
		new THREE.Vector3(0, 1, 0),
		locomotion.turnAngleRadians * moveProgress
	);

	if (speed !== 0) {
		const direction = lessonAnimationRun.direction === 'backward' ? -1 : 1;
		const inertiaScale = getLessonSyntheticInertiaScale(locomotion, previousElapsedMs, currentElapsedMs);
		const forward = new THREE.Vector3(0, 0, 1).applyQuaternion(
			locomotion.startQuaternion.clone().multiply(moveRotation)
		);
		forward.y = 0;

		if (forward.lengthSq() >= 0.000001) {
			forward.normalize().multiplyScalar(speed * inertiaScale * direction * seconds);
			moveCharacterEntityByWorldDelta(forward);
		}
	}

	applyLessonSyntheticTurn(locomotion, currentProgress);
}

function getLessonSyntheticInertiaScale(locomotion, previousElapsedMs, currentElapsedMs) {
	const durationMs = Math.max(locomotion.durationMs, 0);
	const inertiaMs = Math.min(getNumber(locomotion.inertiaMs, 0), durationMs / 2);

	if (inertiaMs <= 0 || currentElapsedMs <= previousElapsedMs) {
		return 1;
	}

	const sampleCount = 4;
	let total = 0;

	for (let index = 0; index < sampleCount; index += 1) {
		const ratio = (index + 0.5) / sampleCount;
		const elapsedMs = previousElapsedMs + (currentElapsedMs - previousElapsedMs) * ratio;
		total += getLessonSyntheticInertiaScaleAt(elapsedMs, durationMs, inertiaMs);
	}

	return total / sampleCount;
}

function getLessonSyntheticInertiaScaleAt(elapsedMs, durationMs, inertiaMs) {
	if (durationMs <= 0 || elapsedMs <= 0 || elapsedMs >= durationMs) {
		return 0;
	}

	if (elapsedMs < inertiaMs) {
		return smoothStep(elapsedMs / inertiaMs);
	}

	if (durationMs - elapsedMs < inertiaMs) {
		return smoothStep((durationMs - elapsedMs) / inertiaMs);
	}

	return 1;
}

function applyLessonSyntheticTurn(locomotion, progress) {
	if (!currentVrmEntity) {
		return;
	}

	const currentRotation = new THREE.Quaternion().setFromAxisAngle(
		new THREE.Vector3(0, 1, 0),
		locomotion.turnAngleRadians * progress
	);
	currentVrmEntity.object3D.quaternion.copy(locomotion.startQuaternion).multiply(currentRotation);
}

function ensureLessonAnimationClip(animationName) {
	const resolvedName = getLessonAnimationName(animationName);

	if (!resolvedName) {
		return Promise.reject(new Error('Unknown VRMA animation: ' + animationName));
	}

	if (vrmaAnimationClips[resolvedName]) {
		return Promise.resolve(vrmaAnimationClips[resolvedName]);
	}

	if (vrmaAnimationClipPromises[resolvedName]) {
		return vrmaAnimationClipPromises[resolvedName];
	}

	if (!currentVrm || !currentVrm.humanoid) {
		return Promise.reject(new Error('VRM model is not ready yet.'));
	}

	vrmaAnimationClipPromises[resolvedName] = new Promise((resolve, reject) => {
		const loader = new THREE.GLTFLoader();
		const animationUrl = VRMA_BASE_URL + LESSON_ANIMATION_FILES[resolvedName];

		fetch(animationUrl)
			.then((response) => {
				if (!response.ok) {
					throw new Error('Failed to load VRMA file: ' + response.status);
				}

				return response.arrayBuffer();
			})
			.then((vrmaBuffer) => {
				loader.parse(vrmaBuffer, getBasePath(animationUrl), (gltf) => {
					if (!gltf.animations || gltf.animations.length === 0) {
						reject(new Error('VRMA animation was not found.'));
						return;
					}

					vrmaAnimationClips[resolvedName] = createVrmAnimationClipFromVrma(
						gltf.animations[0],
						currentVrm,
						gltf.scene,
						resolvedName
					);
					resolve(vrmaAnimationClips[resolvedName]);
				}, (error) => {
					reject(error);
				});
			})
			.catch((error) => {
				reject(error);
			});
	});

	return vrmaAnimationClipPromises[resolvedName];
}

function createVrmAnimationClipFromVrma(vrmaClip, vrm, sourceScene, clipName) {
	const tracks = [];

	if (sourceScene) {
		sourceScene.updateMatrixWorld(true);
	}

	const animationScale = getVrmAnimationScale(vrmaClip, vrm, sourceScene);

	vrmaClip.tracks.forEach((track) => {
		const lastDotIndex = track.name.lastIndexOf('.');

		if (lastDotIndex === -1) {
			return;
		}

		const sourceBoneName = track.name.slice(0, lastDotIndex);
		const propertyName = track.name.slice(lastDotIndex + 1);
		const vrmBoneName = getVrmBoneName(sourceBoneName);
		const vrmBone = vrm.humanoid.getNormalizedBoneNode(vrmBoneName);

		if (!vrmBone) {
			return;
		}

		if (propertyName === 'quaternion') {
			const sourceRotation = getSourceRestRotation(sourceScene, sourceBoneName);
			const values = vrm.meta && vrm.meta.metaVersion === '0'
				? convertQuaternionValuesForVrm0(track.values, sourceRotation)
				: convertQuaternionValues(track.values, sourceRotation);

			tracks.push(new THREE.QuaternionKeyframeTrack(
				vrmBone.name + '.quaternion',
				track.times,
				values
			));
			return;
		}

		if ((propertyName === 'position' || propertyName === 'undefined') && vrmBoneName === 'hips') {
			const values = convertHipsTranslationValues(track.values, animationScale, sourceScene, sourceBoneName, vrm);
			tracks.push(new THREE.VectorKeyframeTrack(
				vrmBone.name + '.position',
				track.times,
				values
			));
		}
	});

	return new THREE.AnimationClip('VRMA ' + clipName, vrmaClip.duration, tracks);
}

function getVrmBoneName(sourceBoneName) {
	const mixamoBoneName = sourceBoneName.replace(/^mixamorig[:_]?/, '');

	return MIXAMO_TO_VRM_BONES[mixamoBoneName] ||
		J_BIP_TO_VRM_BONES[sourceBoneName] ||
		sourceBoneName;
}

function getSourceRestRotation(sourceScene, sourceBoneName) {
	if (!sourceScene) {
		return {
			parent: new THREE.Quaternion(),
			inverse: new THREE.Quaternion()
		};
	}

	const sourceBone = sourceScene.getObjectByName(sourceBoneName);

	if (!sourceBone) {
		return {
			parent: new THREE.Quaternion(),
			inverse: new THREE.Quaternion()
		};
	}

	const parentRotation = new THREE.Quaternion();
	const boneRotation = new THREE.Quaternion();

	sourceBone.parent.matrixWorld.decompose(new THREE.Vector3(), parentRotation, new THREE.Vector3());
	sourceBone.matrixWorld.decompose(new THREE.Vector3(), boneRotation, new THREE.Vector3());
	boneRotation.invert();

	return {
		parent: parentRotation,
		inverse: boneRotation
	};
}

function convertQuaternionValues(values, sourceRotation) {
	const converted = new Float32Array(values.length);
	const quaternion = new THREE.Quaternion();

	for (let index = 0; index < values.length; index += 4) {
		quaternion.fromArray(values, index)
			.premultiply(sourceRotation.parent)
			.multiply(sourceRotation.inverse)
			.toArray(converted, index);
	}

	return converted;
}

function convertQuaternionValuesForVrm0(values, sourceRotation) {
	const converted = convertQuaternionValues(values, sourceRotation);

	for (let index = 0; index < converted.length; index += 4) {
		converted[index] *= -1;
		converted[index + 2] *= -1;
	}

	return converted;
}

function convertHipsTranslationValues(values, animationScale, sourceScene, sourceBoneName, vrm) {
	const converted = new Float32Array(values.length);
	const sourceBone = sourceScene ? sourceScene.getObjectByName(sourceBoneName) : null;
	const parentWorldMatrix = sourceBone && sourceBone.parent
		? sourceBone.parent.matrixWorld
		: new THREE.Matrix4();
	const position = new THREE.Vector3();

	for (let index = 0; index < values.length; index += 3) {
		position.fromArray(values, index).applyMatrix4(parentWorldMatrix);
		position.multiplyScalar(animationScale);

		if (vrm.meta && vrm.meta.metaVersion === '0') {
			position.x *= -1;
			position.z *= -1;
		}

		position.toArray(converted, index);
	}

	return converted;
}

function getVrmAnimationScale(vrmaClip, vrm, sourceScene) {
	const hipsTrack = vrmaClip.tracks.find((track) => {
		const lastDotIndex = track.name.lastIndexOf('.');
		const sourceBoneName = lastDotIndex === -1 ? track.name : track.name.slice(0, lastDotIndex);
		const propertyName = lastDotIndex === -1 ? '' : track.name.slice(lastDotIndex + 1);

		return getVrmBoneName(sourceBoneName) === 'hips' &&
			(propertyName === 'position' || propertyName === 'undefined');
	});
	const vrmHipsHeight = vrm.humanoid.normalizedRestPose &&
		vrm.humanoid.normalizedRestPose.hips &&
		vrm.humanoid.normalizedRestPose.hips.position
		? vrm.humanoid.normalizedRestPose.hips.position[1]
		: 1;
	const sourceHips = sourceScene
		? sourceScene.getObjectByName('mixamorig:Hips') ||
			sourceScene.getObjectByName('J_Bip_C_Hips') ||
			sourceScene.getObjectByName('hips')
		: null;
	const sourceHipsHeight = sourceHips ? sourceHips.getWorldPosition(new THREE.Vector3()).y : null;

	if (sourceHipsHeight) {
		return vrmHipsHeight / sourceHipsHeight;
	}

	if (!hipsTrack || hipsTrack.values.length < 2 || hipsTrack.values[1] === 0) {
		return 1;
	}

	return vrmHipsHeight / hipsTrack.values[1];
}

function updateWalkAnimation(timeDelta) {
	updateLessonSyntheticLocomotion();

	if (lessonAnimationMixer) {
		lessonAnimationMixer.update(timeDelta / 1000);
	}

	updateLessonPoseTransition();
	updateLessonIdleAnimation(timeDelta);
}

function startLessonIdleAnimation(options) {
	const allowDuringAction = !!(options && options.allowDuringAction);
	const activeStep = options && options.step ? options.step : null;
	const allowedStepType = options && options.allowedStepType ? options.allowedStepType : 'speak';
	const animationName = getLessonAnimationName(options && options.animationName) || LESSON_IDLE_ANIMATION_NAME;

	if (
		(characterAction && !allowDuringAction) ||
		idleAnimationAction ||
		idleAnimationStarting ||
		!currentVrm ||
		!currentVrm.scene
	) {
		return;
	}

	const idleVrm = currentVrm;
	const requestId = idleAnimationRequestId + 1;
	idleAnimationRequestId = requestId;
	idleAnimationStarting = true;

	ensureLessonAnimationClip(animationName)
		.then((clip) => {
			if (requestId !== idleAnimationRequestId) {
				return;
			}

			idleAnimationStarting = false;

			if (
				currentVrm !== idleVrm ||
				!currentVrm ||
				!currentVrm.scene ||
				(characterAction && !allowDuringAction) ||
				(allowDuringAction && (
					!characterAction ||
					characterAction.activeStep !== activeStep ||
					activeStep.type !== allowedStepType
				))
			) {
				return;
			}

			stopLessonIdleAnimation({ preserveRequest: true });
			idleAnimationMixer = new THREE.AnimationMixer(currentVrm.scene);
			idleAnimationAction = idleAnimationMixer.clipAction(clip);
			idleAnimationAction.setLoop(THREE.LoopRepeat, Infinity);
			idleAnimationAction.clampWhenFinished = false;
			idleAnimationAction.enabled = true;
			idleAnimationAction.paused = false;
			idleAnimationAction.reset();
			idleAnimationAction.play();
		})
		.catch((error) => {
			if (requestId !== idleAnimationRequestId) {
				return;
			}

			idleAnimationStarting = false;
			console.error('Failed to play idle animation:', error);
		});
}

function updateLessonIdleAnimation(timeDelta) {
	if (!characterAction && currentVrm && !idleAnimationAction) {
		startLessonIdleAnimation();
	}

	if (idleAnimationMixer && idleAnimationAction) {
		idleAnimationMixer.update(timeDelta / 1000);
	}
}

function stopLessonIdleAnimation(options) {
	if (!options || !options.preserveRequest) {
		idleAnimationRequestId += 1;
	}

	const shouldResetPose = !!(options && options.resetPose);
	const preservedPose = shouldResetPose ? null : captureLessonVrmPose();

	idleAnimationStarting = false;

	if (idleAnimationAction) {
		idleAnimationAction.stop();
	}

	if (idleAnimationMixer) {
		idleAnimationMixer.stopAllAction();
	}

	idleAnimationAction = null;
	idleAnimationMixer = null;

	if (options && options.resetPose) {
		resetVrmPoseForAnimation();
	} else {
		applyLessonVrmPose(preservedPose);
	}
}

function stopLessonAnimation() {
	if (lessonAnimationTimeoutId !== null) {
		window.clearTimeout(lessonAnimationTimeoutId);
		lessonAnimationTimeoutId = null;
	}

	if (lessonAnimationMixer && lessonAnimationFinishedHandler) {
		lessonAnimationMixer.removeEventListener('finished', lessonAnimationFinishedHandler);
	}

	if (lessonAnimationAction) {
		lessonAnimationAction.stop();
	}

	if (lessonAnimationMixer) {
		lessonAnimationMixer.stopAllAction();
	}

	lessonAnimationFinishedHandler = null;
	lessonAnimationAction = null;
	lessonAnimationRun = null;
	lessonAnimationMixer = null;
	lessonPoseTransition = null;
}

function resetWalkAnimation() {
	stopLessonIdleAnimation();
	stopLessonAnimation();
	vrmaAnimationClips = {};
	vrmaAnimationClipPromises = {};
}

function resetVrmPoseForAnimation() {
	if (currentVrm && currentVrm.humanoid && typeof currentVrm.humanoid.resetNormalizedPose === 'function') {
		currentVrm.humanoid.resetNormalizedPose();
	}

	if (currentVrm && currentVrm.lookAt && typeof currentVrm.lookAt.reset === 'function') {
		currentVrm.lookAt.reset();
	}
}

function getBasePath(url) {
	const lastSlash = url.lastIndexOf('/');

	if (lastSlash === -1) {
		return '';
	}

	return url.slice(0, lastSlash + 1);
}

function startLowerArmsAction() {
	if (!currentVrm || !currentVrm.humanoid) {
		console.warn('VRM model is not ready yet.');
		return;
	}

	if (isCurrentAvatarZ()) {
		armAction = null;
		return;
	}

	const leftUpperArm = currentVrm.humanoid.getNormalizedBoneNode('leftUpperArm');
	const rightUpperArm = currentVrm.humanoid.getNormalizedBoneNode('rightUpperArm');

	if (!leftUpperArm || !rightUpperArm) {
		console.warn('Upper arm bones were not found.');
		return;
	}

	const leftStart = leftUpperArm.quaternion.clone();
	const rightStart = rightUpperArm.quaternion.clone();
	const leftTarget = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, -1.25));
	const rightTarget = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 1.25));

	armAction = {
		startTime: performance.now(),
		duration: 1000,
		leftUpperArm: leftUpperArm,
		rightUpperArm: rightUpperArm,
		leftStart: leftStart,
		rightStart: rightStart,
		leftTarget: leftTarget,
		rightTarget: rightTarget
	};
}

function updateArmAction() {
	if (!armAction) {
		return;
	}

	const elapsed = performance.now() - armAction.startTime;
	const progress = Math.min(elapsed / armAction.duration, 1);
	const easedProgress = progress * progress * (3 - 2 * progress);

	armAction.leftUpperArm.quaternion.slerpQuaternions(
		armAction.leftStart,
		armAction.leftTarget,
		easedProgress
	);
	armAction.rightUpperArm.quaternion.slerpQuaternions(
		armAction.rightStart,
		armAction.rightTarget,
		easedProgress
	);

	if (progress >= 1) {
		armAction = null;
	}
}

function updateAvatarSpecificPoseCorrection() {
	const isSpeakStep = characterAction && characterAction.activeStep && characterAction.activeStep.type === 'speak';

	if (!isCurrentAvatarZ() || (characterAction && !isSpeakStep) || !currentVrm || !currentVrm.humanoid || !currentVrmEntity) {
		return;
	}

	applyAvatarZArmCorrection();
}

function applyAvatarZArmCorrection() {
	const humanoid = currentVrm.humanoid;
	const leftUpperArm = humanoid.getNormalizedBoneNode('leftUpperArm');
	const leftLowerArm = humanoid.getNormalizedBoneNode('leftLowerArm');
	const rightUpperArm = humanoid.getNormalizedBoneNode('rightUpperArm');
	const rightLowerArm = humanoid.getNormalizedBoneNode('rightLowerArm');

	applyAvatarZUpperArmDirectionCorrection(
		leftUpperArm,
		leftLowerArm,
		new THREE.Vector3(AVATAR_Z_ARM_TARGET_OUTWARD, -1, AVATAR_Z_ARM_TARGET_FORWARD)
	);
	applyAvatarZUpperArmDirectionCorrection(
		rightUpperArm,
		rightLowerArm,
		new THREE.Vector3(-AVATAR_Z_ARM_TARGET_OUTWARD, -1, AVATAR_Z_ARM_TARGET_FORWARD)
	);
}

function applyAvatarZUpperArmDirectionCorrection(upperArm, lowerArm, targetLocalDirection) {
	if (!upperArm || !lowerArm || !upperArm.parent || !currentVrmEntity) {
		return;
	}

	currentVrmEntity.object3D.updateMatrixWorld(true);
	upperArm.parent.updateMatrixWorld(true);
	upperArm.updateMatrixWorld(true);
	lowerArm.updateMatrixWorld(true);

	const upperPosition = upperArm.getWorldPosition(new THREE.Vector3());
	const lowerPosition = lowerArm.getWorldPosition(new THREE.Vector3());
	const currentDirection = lowerPosition.sub(upperPosition);

	if (currentDirection.lengthSq() < 0.000001) {
		return;
	}

	currentDirection.normalize();

	const characterWorldQuaternion = currentVrmEntity.object3D.getWorldQuaternion(new THREE.Quaternion());
	const targetDirection = targetLocalDirection.normalize().applyQuaternion(characterWorldQuaternion);

	if (targetDirection.lengthSq() < 0.000001) {
		return;
	}

	targetDirection.normalize();

	const correctionWorld = new THREE.Quaternion().setFromUnitVectors(currentDirection, targetDirection);
	const parentWorldQuaternion = upperArm.parent.getWorldQuaternion(new THREE.Quaternion());
	const correctionLocal = parentWorldQuaternion.clone()
		.invert()
		.multiply(correctionWorld)
		.multiply(parentWorldQuaternion);

	upperArm.quaternion.premultiply(correctionLocal);
	upperArm.updateMatrixWorld(true);
}

function isCurrentAvatarZ() {
	return /(^|[/\\])Avatar_z\.vrm(?:[?#].*)?$/i.test(currentVrmModelUrl || '');
}

AFRAME.registerComponent('vrm-model', {
	schema: {
		src: { type: 'string' }
	},

	init: function () {
		this.vrm = null;
		this.model = null;
		this.initialAvatarApplied = false;
		this.loadId = 0;
		this.loadingUrl = null;
		this.loadModel();
	},

	update: function (oldData) {
		if (oldData.src && oldData.src !== this.data.src) {
			this.loadModel();
		}
	},

	tick: function (time, timeDelta) {
		updateWalkAnimation(timeDelta);
		updateArmAction();
		updateCharacterAction();
		updateAvatarSpecificPoseCorrection();
		updateSpeechBubble();

		if (this.vrm && typeof this.vrm.update === 'function') {
			this.vrm.update(timeDelta / 1000);
		}
	},

	tock: function (time, timeDelta) {
		updateLessonCameraFollow(timeDelta);
	},

	remove: function () {
		if (this.model) {
			this.el.object3D.remove(this.model);
			this.model = null;
		}

		this.vrm = null;
		currentVrm = null;
		currentVrmEntity = null;
		currentVrmModelUrl = null;
		cancelLessonSpeak();
		resetWalkAnimation();
		stopLessonCameraFollow();
	},

	loadModel: function () {
		let src = this.data.src;
		let syncAttributeSrc = null;

		if (!this.initialAvatarApplied) {
			const initialAvatarSrc = getLessonAvatarSrc(getLessonActionSettings().avatar);
			this.initialAvatarApplied = true;

			if (initialAvatarSrc) {
				src = initialAvatarSrc;

				if (this.data.src !== initialAvatarSrc) {
					syncAttributeSrc = initialAvatarSrc;
				}
			}
		}

		const modelUrl = this.resolveAssetUrl(src);

		if (!modelUrl) {
			console.warn('VRM model src is empty.');
			return;
		}

		if (this.loadingUrl === modelUrl) {
			return;
		}

		if (!THREE.GLTFLoader) {
			console.error('THREE.GLTFLoader is not loaded.');
			return;
		}

		if (!window.THREE_VRM || !window.THREE_VRM.VRMLoaderPlugin) {
			console.error('three-vrm is not loaded.');
			return;
		}

		const loadId = this.loadId + 1;
		this.loadId = loadId;
		this.loadingUrl = modelUrl;

		if (syncAttributeSrc) {
			this.el.setAttribute('vrm-model', 'src', syncAttributeSrc);
		}

		const loader = new THREE.GLTFLoader();
		loader.register((parser) => new window.THREE_VRM.VRMLoaderPlugin(parser));
		const fileLoader = new THREE.FileLoader(loader.manager);
		fileLoader.setResponseType('arraybuffer');

		fileLoader.load(
			modelUrl,
			(arrayBuffer) => {
				loader.parse(arrayBuffer, this.getBasePath(modelUrl), (gltf) => {
					if (loadId !== this.loadId) {
						return;
					}

					const vrm = gltf.userData.vrm;

					if (!vrm) {
						console.error('VRM data was not found in the loaded file.');
						this.loadingUrl = null;
						this.el.emit('vrm-load-error', { src: modelUrl, error: new Error('VRM data was not found.') });
						return;
					}

					if (window.THREE_VRM.VRMUtils && window.THREE_VRM.VRMUtils.rotateVRM0) {
						window.THREE_VRM.VRMUtils.rotateVRM0(vrm);
					}

					const previousModel = this.model;
					const nextModel = vrm.scene;

					this.normalizeModel(nextModel);

					nextModel.traverse((object) => {
						object.frustumCulled = false;
					});

					stopLessonIdleAnimation({ resetPose: true });

					if (previousModel) {
						this.el.object3D.remove(previousModel);
					}

					this.vrm = vrm;
					currentVrm = vrm;
					currentVrmEntity = this.el;
					currentVrmModelUrl = modelUrl;
					this.model = nextModel;
					this.loadingUrl = null;
					resetWalkAnimation();
					refreshCharacterActionBones();

					this.el.object3D.add(this.model);
					this.el.emit('vrm-loaded', { vrm: vrm });
					if (!characterAction) {
						startLowerArmsAction();
						startLessonIdleAnimation();
					}
				}, (error) => {
					if (loadId !== this.loadId) {
						return;
					}

					this.loadingUrl = null;
					console.error('Failed to parse VRM model:', error);
					this.el.emit('vrm-load-error', { src: modelUrl, error: error });
				});
			},
			(progress) => {
				if (progress.total > 0) {
					const percent = Math.round((progress.loaded / progress.total) * 100);
					console.log('Loading VRM... ' + percent + '%');
				}
			},
			(error) => {
				if (loadId !== this.loadId) {
					return;
				}

				this.loadingUrl = null;
				console.error('Failed to load VRM model:', error);
				this.el.emit('vrm-load-error', { src: modelUrl, error: error });
			}
		);
	},

	resolveAssetUrl: function (src) {
		if (!src) {
			return '';
		}

		if (src.charAt(0) === '#') {
			const asset = document.querySelector(src);

			if (asset) {
				return asset.getAttribute('src');
			}
		}

		return src;
	},

	getBasePath: function (url) {
		const lastSlash = url.lastIndexOf('/');

		if (lastSlash === -1) {
			return '';
		}

		return url.slice(0, lastSlash + 1);
	},

	normalizeModel: function (model) {
		model.updateMatrixWorld(true);

		const box = new THREE.Box3().setFromObject(model);
		const size = box.getSize(new THREE.Vector3());
		const center = box.getCenter(new THREE.Vector3());

		if (!Number.isFinite(size.y) || size.y === 0) {
			return;
		}

		const targetHeight = 1.6;
		const scale = targetHeight / size.y;

		model.scale.setScalar(scale);
		model.position.x -= center.x * scale;
		model.position.y -= box.min.y * scale;
		model.position.z -= center.z * scale;
	}
});
