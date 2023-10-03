import {
	Scene,
	WebGLRenderer,
	Sprite,
	OrthographicCamera,
	DirectionalLight,
	SpriteMaterial,
	TextureLoader,
	AdditiveBlending,
	Group,
	sRGBEncoding,
	PointLight,
} from "three";
import { updateStats, toggleStats } from "../debug-stats";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { GUI } from "dat.gui";
import { Vector3 } from "three";
import { Movables } from "./movables";
import { Explosions } from "./explosions";
import {
	createAsteroids,
	resetAsteroids,
	detectBulletCollisions,
	explodeAsteroid,
	areAnyAsteroidsLeft,
	asteroidSizeLarge,
	asteroidSizeSmall,
	asteroidSizeSmaller,
	detectSpaceCraftCollision,
} from "./asteroids";
import { startEngineSound, stopEngineSound } from "./audio";
import { Warpables } from "./warpables";

// Gameplay notes
// First level has 4 asteroids
// Second level has 6 asteroids
// Third level has 8 asteroids
// Fourth level has 10 asteroids
// Ship location does not reset
// Sometimes when asteroid splits, smaller pieces are perfectly overlapping.
// Rocks have varying velocities
// Rocks spawn near edge of screen

// TODO:
// * Make asteroids not overlap on Z axis
// * Tune initial placement of asteroids (study original game)
// * Tune velocity of asteroids to match original game
// * Bake normals onto low-poly meshes
// * Add thrust
// * Add real collision detection
// * Fix bug where one bullet can take out multiple asteroids
// * Add explosion sounds
// * Make lasers look cool. Add lights to them?
// * Handle game over scenario. Make "loaded" bullets not collide with asteroids.
// * Add hyperspace
// * Add UFO
// * Add asteroid motion trail

const ambientLightColor = 0x111111;
const aspectRatio = 4 / 3;

const renderer = new WebGLRenderer({ antialias: true });
renderer.outputEncoding = sRGBEncoding;
renderer.setClearColor(ambientLightColor);
renderer.setPixelRatio(window.devicePixelRatio || 1);
document.body.appendChild(renderer.domElement);

const scene = new Scene();

// Camera
const viewportHeightMeters = 320;
const viewportWidthMeters = aspectRatio * viewportHeightMeters;
const camera = new OrthographicCamera(
	-viewportWidthMeters / 2,
	viewportWidthMeters / 2,
	viewportHeightMeters / 2,
	-viewportHeightMeters / 2
);
camera.position.z = 100;

const areaBounds = {
	top: camera.top,
	bottom: camera.bottom,
	left: camera.left,
	right: camera.right,
};

const movables = new Movables();
const explosions = new Explosions();
const warpables = new Warpables(movables, {
	top: areaBounds.top - 20,
	bottom: areaBounds.bottom + 20,
	left: areaBounds.left + 20,
	right: areaBounds.right - 20,
});

const gltfLoader = new GLTFLoader().setPath("./assets/models/");
function promisifiedGltfLoad(path) {
	return new Promise((resolve, reject) => {
		gltfLoader.load(path, resolve);
	});
}

const textureLoader = new TextureLoader().setPath("./assets/textures/");
function promisifiedTextureLoad(path) {
	return new Promise((resolve, reject) => {
		textureLoader.load(path, resolve);
	});
}

let spaceCraft = null;
let exhaust = null;
const loadPromise = (async function load() {
	const [spaceCraftGltf, rockGltf, explosionTexture, laserTexture] = await Promise.all([
		promisifiedGltfLoad("asteroids-spacecraft.gltf"),
		promisifiedGltfLoad("asteroids-scene.gltf"),
		promisifiedTextureLoad("explosion-sprite.png"),
		promisifiedTextureLoad("laser-sprite.png"),
	]);

	spaceCraft = spaceCraftGltf.scene;
	scene.add(spaceCraft);
	movables.add(spaceCraft, new Vector3(0, 0, 0), new Vector3(0, 0, 0), true, true);
	exhaust = spaceCraft.children[0].children.find(({ name }) => name === "exhaust-sprite");
	exhaust.visible = false;
	explosions.initialize(scene, explosionTexture, 30, 4, 4);
	createAsteroids(rockGltf, movables, scene);
	initializeBullets(laserTexture);

	resetGame();
})();

function resetGame() {
	spaceCraft.visible = true;
	resetAsteroids(areaBounds);
	spaceCraft.position.set(0, 0, 0);
	spaceCraft.rotation.set(0, 0, 0);
	movables.setVelocity(spaceCraft, new Vector3());
}

const guiParams = {
	debugLights: true,
	light0: true,
	light1: true,
	light2: true,
	"laser lights": false,
	animateLights: true,
	model: "sphere",
};

const gui = new GUI();
gui.add(guiParams, "light0").onChange((value) => {
	whiteLight.visible = value;
});
gui.add(guiParams, "light1").onChange((value) => {
	blueLight.visible = value;
});
gui.add(guiParams, "light2").onChange((value) => {
	orangeLight.visible = value;
});
gui.add(guiParams, "laser lights").onChange((value) => {
	for (const { children } of bullets) {
		children[1].visible = value;
	}
});

toggleStats();

const bullets = [];
function initializeBullets(texture) {
	bullets.push(
		...Array.from({ length: 10 }).map(() => {
			const laserMaterial = new SpriteMaterial({
				map: texture,
				alphaMap: texture,
				blending: AdditiveBlending,
				color: 0xffffff,
			});
			const sprite = new Sprite(laserMaterial);
			sprite.scale.set(8, 8, 1);
			const bulletGroup = new Group();
			bulletGroup.add(sprite);
			bulletGroup.add(new PointLight(0x00ff00, 1, 75));
			bulletGroup.children[1].visible = false;
			bulletGroup.visible = false;
			return bulletGroup;
		})
	);
	for (const bullet of bullets) {
		scene.add(bullet);
		movables.add(bullet, new Vector3(0, 0, 0), new Vector3(0, 0, 0));
	}
}

const timeForBulletToTravelScreenVertically = 1.5; // seconds
const shotSpeed = viewportHeightMeters / timeForBulletToTravelScreenVertically;
const rotationSpeed = 3.0;
const explosionSizeByAsteroidSize = {
	[asteroidSizeLarge]: 64,
	[asteroidSizeSmall]: 48,
	[asteroidSizeSmaller]: 24,
};
const thrustAcceleration = 40;
function step(timestampDifference) {
	if (!areAnyAsteroidsLeft()) {
		resetAsteroids(areaBounds);
	}

	if (spaceCraft.visible) {
		if (keyStates["ArrowLeft"]) {
			movables.setAngularVelocity(spaceCraft, new Vector3(0, 0, rotationSpeed));
		} else if (keyStates["ArrowRight"]) {
			movables.setAngularVelocity(spaceCraft, new Vector3(0, 0, -rotationSpeed));
		} else {
			movables.setAngularVelocity(spaceCraft, new Vector3(0, 0, 0));
		}

		if (keyStates["ArrowUp"]) {
			const acceleration = new Vector3(0, thrustAcceleration * timestampDifference, 0);
			acceleration.applyEuler(spaceCraft.rotation);
			movables.accelerate(spaceCraft, acceleration);
			exhaust.visible = true;
			startEngineSound();
		} else {
			stopEngineSound();
			exhaust.visible = false;
		}

		if (keyStates["ArrowDown"]) {
			warpables.warp(spaceCraft);
		}

		if (keyStates["Space"]) {
			const position = new Vector3(0, 5, 0);
			position.applyMatrix4(spaceCraft.matrix);
			fireBullet(position, spaceCraft.rotation.clone());
		}
	} else {
		stopEngineSound();
	}

	movables.step(timestampDifference, areaBounds);
	explosions.step(timestampDifference);
	warpables.step(timestampDifference);

	for (const bullet of bullets.filter(({ visible }) => visible)) {
		// Detect collisions
		const asteroidCollisions = detectBulletCollisions(bullet.position, movables.getVelocity(bullet));
		if (asteroidCollisions.length) {
			// Put bullet back in gun
			bullet.position.set(0, 0, 0);
			bullet.visible = false;
			movables.setVelocity(bullet, new Vector3(0, 0, 0));
		}
		for (const { object } of asteroidCollisions) {
			const asteroidSize = explodeAsteroid(object, movables);
			const explosionPosition = object.position.clone();
			explosionPosition.setZ(10);
			explosions.explode(explosionPosition, explosionSizeByAsteroidSize[asteroidSize]);
		}
	}

	if (spaceCraft.visible && detectSpaceCraftCollision(spaceCraft.position)) {
		explosions.explode(spaceCraft.position, 32);
		spaceCraft.visible = false;
		gameOverScreen.classList.toggle("d-none");
	}
}

const keyStates = {};
window.document.addEventListener("keydown", (event) => {
	keyStates[event.code] = true;
});
window.document.addEventListener("keyup", (event) => {
	keyStates[event.code] = false;
});

const whiteLight = new DirectionalLight(0xffffff, 1);
whiteLight.position.set(1, 1, 2);
scene.add(whiteLight);

const orangeLight = new DirectionalLight(0xff7700, 0.5);
orangeLight.position.set(1, -2, 0.5);
scene.add(orangeLight);

const blueLight = new DirectionalLight(0x0077ff, 0.5);
blueLight.position.set(-1, 1, 0.5);
scene.add(blueLight);

const maxStepSizeMs = 10;
const maxTotalStepsMs = 100; // Just let it slow down so it can catch up
async function startMainLoop() {
	await loadPromise;
	let lastTimestamp;
	function animate(timestamp) {
		const timestampDifference = Math.min(timestamp - lastTimestamp, maxTotalStepsMs);
		requestAnimationFrame(animate);
		if (!spaceCraft) {
			// Wait for assets to load.
			return;
		}

		if (lastTimestamp) {
			let remainingStepMs = timestampDifference;
			while (remainingStepMs > 0) {
				const stepMs = Math.min(maxStepSizeMs, remainingStepMs);
				step(stepMs / 1000);
				remainingStepMs -= stepMs;
			}
		}
		renderer.render(scene, camera);
		updateStats();
		lastTimestamp = timestamp;
	}
	animate();
}

const startScreen = document.getElementById("start-screen");
document.getElementById("start-button").addEventListener("click", () => {
	startMainLoop();
	startScreen.remove();
});

const gameOverScreen = document.getElementById("game-over-screen");
document.getElementById("restart-button").addEventListener("click", () => {
	resetGame();
	gameOverScreen.classList.toggle("d-none");
});

let nextBulletIndex = 0;
let isGunCoolingDown = false;

// Avoid pushing up sounds for now and annoying myself with the same noise over and over
// const audio = null;
const audio = new Audio("./assets/audio/laser-noise-2.wav");
function fireBullet(position, rotation) {
	if (isGunCoolingDown) {
		return;
	}
	isGunCoolingDown = true;
	setTimeout(() => {
		isGunCoolingDown = false;
	}, 250);

	const velocity = new Vector3(0, shotSpeed, 0);
	velocity.applyEuler(rotation);

	const bulletSprite = bullets[nextBulletIndex].children[0];
	bulletSprite.material.rotation = rotation.z;
	bullets[nextBulletIndex].position.copy(position);
	bullets[nextBulletIndex].visible = true;
	movables.setVelocity(bullets[nextBulletIndex], velocity);

	nextBulletIndex = (nextBulletIndex + 1) % bullets.length;
	if (audio) {
		audio.pause();
		audio.currentTime = 0;
		audio.play();
	}
}

function resizeWindow() {
	const height = window.innerHeight;
	const width = window.innerHeight * aspectRatio;
	renderer.setSize(width, height);
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
}
resizeWindow();
window.addEventListener("resize", resizeWindow);
