import { Scene, WebGLRenderer, Mesh, BoxGeometry, MeshBasicMaterial, OrthographicCamera } from "three";
import { updateStats, toggleStats } from "./debug-stats";
import { GUI } from "dat.gui";

const ambientLightColor = 0x111111;

const renderer = new WebGLRenderer({ antialias: true });
renderer.setClearColor(ambientLightColor);
renderer.setSize(700, 700);
renderer.setPixelRatio(window.devicePixelRatio || 1);
document.body.appendChild(renderer.domElement);

const scene = new Scene();

// Camera
const camera = new OrthographicCamera(-100, 100, -100, 100);
const plainMaterial = new MeshBasicMaterial({ color: 0x00ff00 });

// Add models

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

const rotationSpeed = 5.0;
function step(timestampDifference) {
	if (keyStates["ArrowLeft"]) {
		spaceCraft.rotateZ(-timestampDifference * rotationSpeed);
		console.log("foo");
	}
	if (keyStates["ArrowRight"]) {
		spaceCraft.rotateZ(timestampDifference * rotationSpeed);
		console.log("bar");
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
	step(timestampDifference / 1000);
	renderer.render(scene, camera);
	updateStats();
	lastTimestamp = timestamp;
}
animate();
