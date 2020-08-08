import {
	Scene,
	PerspectiveCamera,
	WebGLRenderer,
	Mesh,
	HemisphereLight,
	Color,
	TorusKnotGeometry,
	MeshStandardMaterial,
} from "three";
import { GUI } from "dat.gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { updateStats, toggleStats } from "./debug-stats";

const renderer = new WebGLRenderer();
const devicePixelRatio = window.devicePixelRatio || 1;
const clearColor = new Color(0.07, 0.07, 0.15);
renderer.setPixelRatio(devicePixelRatio);
renderer.setClearColor(clearColor);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// In the beginning ...
const scene = new Scene();

// Camera
const camera = new PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.x = 0;
camera.position.y = 2;
camera.position.z = 10;
new OrbitControls(camera, renderer.domElement);

const material = new MeshStandardMaterial();
const meshes = [
	new Mesh(new TorusKnotGeometry(1, 0.34, 128, 16), material),
	new Mesh(new TorusKnotGeometry(1, 0.34, 128, 16), material),
	new Mesh(new TorusKnotGeometry(1, 0.34, 128, 16), material),
];
for (const mesh of meshes) scene.add(mesh);

const defaultDistance = 2;
function layOutMeshes(distance = defaultDistance) {
	let z = Math.floor(meshes.length / 2) * distance;
	for (const mesh of meshes) {
		mesh.position.z = z;
		z -= distance;
	}
}
layOutMeshes();

const light = new HemisphereLight(0xccccff, 0xcc9999, 1);
scene.add(light);

// Show stats
toggleStats();

GUI;
const gui = new GUI();
const guiParams = {
	Opacity: 1,
	Transparent: false,
	"Depth test": true,
	Distance: defaultDistance,
};

gui.add(guiParams, "Opacity", 0, 1).onChange((value) => {
	material.opacity = value;
});
gui.add(guiParams, "Transparent").onChange((value) => {
	material.transparent = value;
});
gui.add(guiParams, "Depth test").onChange((value) => {
	material.depthTest = value;
});
gui.add(guiParams, "Distance", 0, 10).onChange((distance) => {
	layOutMeshes(distance);
});

// Main loop
function animate() {
	requestAnimationFrame(animate);
	renderer.render(scene, camera);
	updateStats();
}
animate();
