import * as Tone from "tone";

// https://sfxr.me/#7BMHBGBrvPrKMz7vdnH2arTppbTGtPrik6ypYCJazirRsGBVeid2uaLtz37CSy69ZJjGJ7C8h9NjU1LRXtL5tgW9vaPUQvE92L3q7UfV4TSbUF1N2G3urTRqZ
// https://sfxr.me/#7BMHBGBrvPrKMz7vdnH2arSxENYbWUNps8g7nqouBB9smtxAq2PYYsVoa5sjrzVZo7VNpDFNrSQTNtinkTFut1aGJnuigdFUTrtf7aaih5chRw6UQ5bBqVNz3
const explosionPlayers = ["./assets/audio/explosion-3.wav", "./assets/audio/explosion-4.wav"].map((url) =>
	new Tone.Player({ url, autostart: false }).toDestination()
);
explosionPlayers[0].connect(
	new Tone.Filter({
		type: "lowpass",
		frequency: 500,
		rolloff: -48,
	}).toDestination()
);
explosionPlayers[1].connect(
	new Tone.Filter({
		type: "lowpass",
		frequency: 500,
		rolloff: -48,
	}).toDestination()
);

// https://sfxr.me/#6mTcDit2EJ23UxjnAaQtSF2wN267yGjoUTLbm221ePzG7L8T9Zv9W3brhzvPHm8vVwHU1kVUpRoV99FweWf1iVVZAMYzzXM9B9xhovQ9HXmNRaZFAEjBHCGT9
const warpPlayer = new Tone.Player({ url: "./assets/audio/hyperspace-warp.wav", autostart: false }).toDestination();

const laserPlayer = new Tone.Player({ url: "./assets/audio/laser-noise-2.wav", autostart: false }).toDestination();

const engineSynth = new Tone.NoiseSynth({
	noise: {
		type: "brown",
		playbackRate: 1.5,
	},
	envelope: {
		attack: 0.1,
		decay: 1,
		sustain: 0.2,
		release: 0.5,
	},
}).toDestination();

const engineLowpassFilter = new Tone.Filter({
	type: "lowpass",
	frequency: 500,
	rolloff: -48,
}).toDestination();

engineSynth.connect(engineLowpassFilter);

export function initTone() {
	Tone.start();
}

export function playExplosionSound() {
	explosionPlayers[Math.floor(Math.random() * explosionPlayers.length)].start();
}

export function playWarpSound() {
	warpPlayer.start();
}

export function startEngineSound() {
	engineSynth.triggerAttack();
}

export function stopEngineSound() {
	engineSynth.triggerRelease();
}

export function playLaserSound() {
	laserPlayer.start();
}
