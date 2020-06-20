import {
	Scene,
	PerspectiveCamera,
	WebGLRenderer,
	BoxGeometry,
	MeshStandardMaterial,
	Mesh,
	PointLight,
	SphereGeometry,
	AmbientLight,
	PlaneBufferGeometry,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { updateStats, toggleStats } from "./debug-stats";
import { toggleDebugLights, addLight } from "./lights";

const renderer = new WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// In the beginning ...
const scene = new Scene();

// Camera
const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.x = 5;
camera.position.y = 5;
camera.position.z = 5;
new OrbitControls(camera, renderer.domElement);

const plainMaterial = new MeshStandardMaterial();

// Add the ground
const groundMesh = new Mesh(new PlaneBufferGeometry(1000, 1000), plainMaterial);
groundMesh.receiveShadow = true;
groundMesh.rotation.x = -Math.PI / 2;
scene.add(groundMesh);

// Tons of spheres for fun
for (let x = -50; x <= 50; x += 5) {
	for (let z = -50; z <= 50; z += 5) {
		const sphere = new Mesh(new SphereGeometry(1, 20, 20), plainMaterial);
		scene.add(sphere);
		sphere.position.set(x, 0, z);
	}
}

// Box for fun
const box = new Mesh(new BoxGeometry(1, 1, 1), plainMaterial);
box.position.set(4, 0, 4);
box.rotateY(45);
scene.add(box);

// Lights
const sceneLights = [
	addLight(scene, new PointLight(0xffffff, 1, 10, 2)),
	addLight(scene, new PointLight(0xff0000, 1, 10, 2)),
];
sceneLights[0].group.position.set(3, 4, 3);

var light = new AmbientLight(0x111111); // soft white light
scene.add(light);

// Main loop
function animate() {
	requestAnimationFrame(animate);
	step();
	renderer.render(scene, camera);
	updateStats();
}
animate();

function step() {
	sceneLights[0].group.position.set(
		2 * Math.sin(new Date().getTime() / 1000),
		3,
		2 * Math.cos(new Date().getTime() / 1000)
	);
	sceneLights[1].group.position.set(1, 4 + 5 * Math.sin(new Date().getTime() / 1000), 3);
}

window.document.addEventListener("keydown", (event) => {
	if (event.isComposing || event.keyCode === "1".charCodeAt(0)) {
		toggleDebugLights();
		toggleStats();
	}
});
