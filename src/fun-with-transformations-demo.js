import {
	Scene,
	PerspectiveCamera,
	WebGLRenderer,
	Mesh,
	HemisphereLight,
	Color,
	TorusKnotGeometry,
	MeshStandardMaterial,
	PlaneGeometry,
	MeshBasicMaterial,
	Matrix4,
	Vector3,
	Group,
	ArrowHelper,
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

const planeMaterial = new MeshBasicMaterial({
	color: 0xff0000,
	wireframe: true,
});
const planeGroup = new Group();
const planeMesh = new Mesh(new PlaneGeometry(10, 10, 1, 1), planeMaterial);
const planeNormal = new Vector3(0, 0, 1);
const planeNormalHelper = new ArrowHelper(planeNormal, new Vector3(0, 0, 0), 2, 0x00ff00);
const planeMatrix = new Matrix4();
planeGroup.matrixAutoUpdate = false;
planeGroup.matrix = planeMatrix;
planeMatrix.setPosition(0, 0, -1);
planeGroup.add(planeMesh);
planeGroup.add(planeNormalHelper);
scene.add(planeGroup);

const material = new MeshStandardMaterial();
const mesh = new Mesh(new TorusKnotGeometry(1, 0.34, 128, 16), material);
const meshMatrix = new Matrix4();
meshMatrix.setPosition(0, 0, 2);
scene.add(mesh);
mesh.matrixAutoUpdate = false;
mesh.matrix = meshMatrix;

const reflection = new Mesh(new TorusKnotGeometry(1, 0.34, 128, 16), material);
reflection.matrixAutoUpdate = false;
scene.add(reflection);

const light = new HemisphereLight(0xccccff, 0xcc9999, 1);
scene.add(light);

// Show stats
toggleStats();

GUI;
const gui = new GUI();
const guiParams = {
	Opacity: 1,
};

gui.add(guiParams, "Opacity", 0, 1).onChange((value) => {
	material.opacity = value;
});

// Main loop
function animate() {
	requestAnimationFrame(animate);
	const meshMatrixCopy = meshMatrix.clone();
	const reflectionMatrix = meshMatrix;
	reflection.matrix = reflectionMatrix;
	renderer.render(scene, camera);
	updateStats();
}
animate();
