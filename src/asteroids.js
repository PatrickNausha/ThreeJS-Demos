import {
	SphereGeometry,
	Scene,
	WebGLRenderer,
	Mesh,
	MeshStandardMaterial,
	OrthographicCamera,
	DirectionalLight,
	MeshBasicMaterial,
} from "three";
import { updateStats, toggleStats } from "./debug-stats";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { GUI } from "dat.gui";
import { Vector3 } from "three";
import { Matrix4 } from "three";

const ambientLightColor = 0x111111;

const renderer = new WebGLRenderer({ antialias: true });
renderer.setClearColor(ambientLightColor);
renderer.setSize(700, 700);
renderer.setPixelRatio(window.devicePixelRatio || 1);
document.body.appendChild(renderer.domElement);

const scene = new Scene();

// Camera
const camera = new OrthographicCamera(-100, 100, 100, -100);
camera.position.z = 10;

let spaceCraft = null;

const loader = new GLTFLoader().setPath("./assets/models/");
loader.load("asteroids-spacecraft.gltf", function (gltf) {
	spaceCraft = gltf.scene;
	scene.add(spaceCraft);
});

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
const bullets = Array.from({ length: 10 }).map(() => ({
	mesh: new Mesh(laserGeometry, laserMaterial),
	velocity: new Vector3(0, 0, 0),
}));
for (const bullet of bullets) {
	scene.add(bullet.mesh);
}

const asteroidRadius = 10;
const asteroidCount = 5;
const asteroidMaterial = new MeshStandardMaterial({ color: 0xb07e41 });
const asteroidGeometry = new SphereGeometry(asteroidRadius, 10, 10);
const asteroids = Array.from({ length: asteroidCount }).map(() => ({
	mesh: new Mesh(asteroidGeometry, asteroidMaterial),
	velocity: new Vector3(0, 0, 0),
}));
for (const asteroid of asteroids) {
	asteroid.mesh.position.set(Math.random() * 200 - 100, Math.random() * 200 - 100, 0);
	scene.add(asteroid.mesh);
}

const shotSpeed = 100.0;
const rotationSpeed = 3.0;
function step(timestampDifference) {
	if (keyStates["ArrowLeft"]) {
		spaceCraft.rotateZ(timestampDifference * rotationSpeed);
	}
	if (keyStates["ArrowRight"]) {
		spaceCraft.rotateZ(-timestampDifference * rotationSpeed);
	}

	for (const bullet of bullets) {
		// Move bullets
		const bulletPositionDelta = bullet.velocity.clone().multiplyScalar(timestampDifference);
		bullet.mesh.position.add(bulletPositionDelta);

		// Detect collisions
		const collisions = detectBulletCollisions(bullet, asteroids);
		for (const collision of collisions) {
			scene.remove(collision.mesh);
		}
	}

	if (keyStates["Space"]) {
		const position = new Vector3(0, 5, -1);
		const velocity = new Vector3(0, shotSpeed, 0);
		velocity.applyMatrix4(new Matrix4().extractRotation(spaceCraft.matrix));
		position.applyMatrix4(spaceCraft.matrix);
		fireBullet(position, velocity);
	}
}

function detectBulletCollisions(bullet, collidables) {
	const collisions = [];
	for (const collidable of collidables) {
		if (bullet.mesh.position.distanceTo(collidable.mesh.position) < asteroidRadius) {
			collisions.push(collidable);
		}
	}
	return collisions;
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

const blueLight = new DirectionalLight(0x0077ff, 0.7);
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
	bullets[nextBulletIndex].mesh.position.copy(position);
	bullets[nextBulletIndex].velocity = velocity;

	nextBulletIndex = (nextBulletIndex + 1) % bullets.length;
}
