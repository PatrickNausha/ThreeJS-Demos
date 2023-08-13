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
const boxes = [];
for (let x = -10; x <= 10; x += 5) {
	const box = new Mesh(new BoxGeometry(2, 2, 2), plainMaterial);
	box.position.set(x, 0, 0);
	boxes.push(box);
	scene.add(box);
}

const guiParams = {
	debugLights: true,
	light0: true,
	light1: true,
	animateLights: true,
	model: "sphere",
};

const gui = new GUI();

// Show stats
toggleStats();

// Main loop
function animate() {
	requestAnimationFrame(animate);
	step();
	renderer.render(scene, camera);
	updateStats();
}
animate();

var lastTime = new Date().getTime();
function step() {
	const time = new Date().getTime();
	lastTime = time;
}
