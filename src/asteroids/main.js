import {
	SphereGeometry,
	Scene,
	WebGLRenderer,
	Mesh,
	OrthographicCamera,
	DirectionalLight,
	MeshBasicMaterial,
	sRGBEncoding,
} from "three";
import { updateStats, toggleStats } from "../debug-stats";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { GUI } from "dat.gui";
import { Vector3 } from "three";
import { Matrix4 } from "three";
import { Movables } from "./movables";
import { createAsteroids, resetAsteroids, detectBulletCollisions, explodeAsteroid } from "./asteroids";

const ambientLightColor = 0x111111;
const aspectRatio = 4 / 3;

const renderer = new WebGLRenderer({ antialias: true });
renderer.outputEncoding = sRGBEncoding;
renderer.setClearColor(ambientLightColor);
renderer.setPixelRatio(window.devicePixelRatio || 1);
document.body.appendChild(renderer.domElement);

const scene = new Scene();
const movables = new Movables();

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

const loader = new GLTFLoader().setPath("./assets/models/");
function promisifiedGltfLoad(path) {
	return new Promise((resolve, reject) => {
		loader.load(path, function (gltf) {
			resolve(gltf);
		});
	});
}

let spaceCraft = null;
(async function load() {
	const [spaceCraftGltf, rockGltf] = await Promise.all([
		promisifiedGltfLoad("asteroids-spacecraft.gltf"),
		promisifiedGltfLoad("asteroids-scene.gltf"),
	]);

	spaceCraft = spaceCraftGltf.scene;
	scene.add(spaceCraft);
	movables.add(spaceCraft, new Vector3(0, 0, 0), new Vector3(0, 0, 0));

	createAsteroids(rockGltf, movables, scene);
	resetAsteroids(viewportWidthMeters, viewportHeightMeters);
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

const laserGeometry = new SphereGeometry(1, 5, 5);
const laserMaterial = new MeshBasicMaterial({ color: 0x00ff00 });
const bullets = Array.from({ length: 10 }).map(() => new Mesh(laserGeometry, laserMaterial));
for (const bullet of bullets) {
	scene.add(bullet);
	movables.add(bullet, new Vector3(0, 0, 0), new Vector3(0, 0, 0));
}

const shotSpeed = 100.0;
const rotationSpeed = 3.0;
function step(timestampDifference) {
	if (keyStates["ArrowLeft"]) {
		movables.setAngularVelocity(spaceCraft, new Vector3(0, 0, rotationSpeed));
	} else if (keyStates["ArrowRight"]) {
		movables.setAngularVelocity(spaceCraft, new Vector3(0, 0, -rotationSpeed));
	} else {
		movables.setAngularVelocity(spaceCraft, new Vector3(0, 0, 0));
	}

	if (keyStates["Space"]) {
		const position = new Vector3(0, 5, -1);
		const velocity = new Vector3(0, shotSpeed, 0);
		velocity.applyMatrix4(new Matrix4().extractRotation(spaceCraft.matrix));
		position.applyMatrix4(spaceCraft.matrix);
		fireBullet(position, velocity);
	}

	movables.step(timestampDifference);

	for (const bullet of bullets) {
		// Detect collisions
		const asteroidCollisions = detectBulletCollisions(bullet.position);
		if (asteroidCollisions.length) {
			// Put bullet back in gun
			bullet.position.set(0, 0, 0);
			movables.setVelocity(bullet, new Vector3(0, 0, 0));
		}
		for (const asteroid of asteroidCollisions) {
			explodeAsteroid(asteroid, movables);
		}
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
function animate(timestamp) {
	const timestampDifference = timestamp - lastTimestamp;
	requestAnimationFrame(animate);
	if (!spaceCraft) {
		// Wait for assets to load.
		return;
	}

	if (lastTimestamp) {
		step(timestampDifference / 1000);
	}
	renderer.render(scene, camera);
	updateStats();
	lastTimestamp = timestamp;
}
animate();

let nextBulletIndex = 0;
let isCoolingDown = false;
function fireBullet(position, velocity) {
	if (isCoolingDown) {
		return;
	}
	isCoolingDown = true;
	setTimeout(() => {
		isCoolingDown = false;
	}, 250);
	bullets[nextBulletIndex].position.copy(position);
	movables.setVelocity(bullets[nextBulletIndex], velocity);

	nextBulletIndex = (nextBulletIndex + 1) % bullets.length;
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
