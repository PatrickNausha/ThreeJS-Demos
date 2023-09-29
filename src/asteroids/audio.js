import * as Tone from "tone";

Tone.start();

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

export function playExplosionSound() {
	explosionPlayers[Math.floor(Math.random() * explosionPlayers.length)].start();
}

export function startEngineSound() {
	engineSynth.triggerAttack();
}

export function stopEngineSound() {
	engineSynth.triggerRelease();
}
