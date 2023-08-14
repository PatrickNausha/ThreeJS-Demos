import { SphereGeometry, Scene, WebGLRenderer, Mesh, BoxGeometry, MeshBasicMaterial, OrthographicCamera } from "three";
import { updateStats, toggleStats } from "./debug-stats";
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
const plainMaterial = new MeshBasicMaterial({ color: 0x00ff00 });

const spaceCraft = new Mesh(new BoxGeometry(2, 2, 2), plainMaterial);
scene.add(spaceCraft);

const guiParams = {
	debugLights: true,
	light0: true,
	light1: true,
	animateLights: true,
	model: "sphere",
};

const gui = new GUI();

toggleStats();

const bullets = Array.from({ length: 10 }).map(() => ({
	mesh: new Mesh(new SphereGeometry(1, 20, 20), plainMaterial),
	velocity: new Vector3(0, 0, 0),
}));
for (const bullet of bullets) {
	scene.add(bullet.mesh);
}

const shotSpeed = 100.0;
const rotationSpeed = 3.0;
function step(timestampDifference) {
	if (keyStates["ArrowLeft"]) {
		spaceCraft.rotateZ(timestampDifference * rotationSpeed);
		console.log("foo");
	}
	if (keyStates["ArrowRight"]) {
		spaceCraft.rotateZ(-timestampDifference * rotationSpeed);
		console.log("bar");
	}
	for (const bullet of bullets) {
		const bulletPositionDelta = bullet.velocity.clone().multiplyScalar(timestampDifference);
		bullet.mesh.position.add(bulletPositionDelta);
	}

	if (keyStates["Space"]) {
		const velocity = new Vector3(0, shotSpeed, 0);
		velocity.applyMatrix4(new Matrix4().extractRotation(spaceCraft.matrix));
		fireBullet(new Vector3(), velocity);
	}
}

const keyStates = {};
window.document.addEventListener("keydown", (event) => {
	keyStates[event.code] = true;
});
window.document.addEventListener("keyup", (event) => {
	keyStates[event.code] = false;
});

// Main loop
let lastTimestamp;
function animate(timestamp) {
	const timestampDifference = timestamp - lastTimestamp;
	requestAnimationFrame(animate);
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
