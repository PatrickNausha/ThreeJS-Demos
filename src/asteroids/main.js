import {
	Scene,
	WebGLRenderer,
	Sprite,
	OrthographicCamera,
	DirectionalLight,
	SpriteMaterial,
	TextureLoader,
	AdditiveBlending,
	sRGBEncoding,
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
const movables = new Movables();
const explosions = new Explosions();

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
(async function load() {
	const [spaceCraftGltf, rockGltf, explosionTexture, laserTexture] = await Promise.all([
		promisifiedGltfLoad("asteroids-spacecraft.gltf"),
		promisifiedGltfLoad("asteroids-scene.gltf"),
		promisifiedTextureLoad("explosion-sprite.png"),
		promisifiedTextureLoad("laser-sprite.png"),
	]);

	spaceCraft = spaceCraftGltf.scene;
	scene.add(spaceCraft);
	movables.add(spaceCraft, new Vector3(0, 0, 0), new Vector3(0, 0, 0));

	explosions.initialize(scene, explosionTexture, 30, 4, 4);
	createAsteroids(rockGltf, movables, scene);
	resetAsteroids(areaBounds);
	initializeBullets(laserTexture);
})();

const guiParams = {
	debugLights: true,
	light0: true,
	light1: true,
	light2: true,
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
			sprite.visible = false;
			return sprite;
		})
	);
	for (const bullet of bullets) {
		bullet.scale.set(8, 8, 1);
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

		if (keyStates["Space"]) {
			const position = new Vector3(0, 5, -1);
			position.applyMatrix4(spaceCraft.matrix);
			fireBullet(position, spaceCraft.rotation.clone());
		}
	}

	movables.step(timestampDifference, areaBounds);
	explosions.step(timestampDifference);

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

// Main loop
let lastTimestamp;
const maxStepSizeMs = 10;
function animate(timestamp) {
	const timestampDifference = timestamp - lastTimestamp;
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

let nextBulletIndex = 0;
let isCoolingDown = false;

// Avoid pushing up sounds for now and annoying myself with the same noise over and over
// const audio = null;
const audio = new Audio("./assets/audio/laser-noise-2.wav");
function fireBullet(position, rotation) {
	if (isCoolingDown) {
		return;
	}
	isCoolingDown = true;
	setTimeout(() => {
		isCoolingDown = false;
	}, 250);

	const velocity = new Vector3(0, shotSpeed, 0);
	velocity.applyEuler(rotation);

	bullets[nextBulletIndex].position.copy(position);
	bullets[nextBulletIndex].material.rotation = rotation.z;
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
