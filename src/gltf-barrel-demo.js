import {
	Scene,
	PerspectiveCamera,
	WebGLRenderer,
	MeshStandardMaterial,
	Mesh,
	PointLight,
	SphereGeometry,
	AmbientLight,
	PlaneBufferGeometry,
	VSMShadowMap,
	PCFShadowMap,
	PCFSoftShadowMap,
	MeshBasicMaterial,
	BoxGeometry,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { updateStats, toggleStats } from "./debug-stats";
import { addLight, setDebugLightsOn } from "./lights";
import { slamItOnTheGround } from "./positioning";
import { GUI } from "dat.gui";

const ambientLightColor = 0xFFFFFF;

const renderer = new WebGLRenderer({ antialias: true });
renderer.setClearColor(0x111122);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// In the beginning ...
const scene = new Scene();

// Camera
const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.x = 5;
camera.position.y = 5;
camera.position.z = 5;
camera.far = 10;
const controls = new OrbitControls(camera, renderer.domElement);
controls.maxPolarAngle = Math.PI * 0.45;

const plainMaterial = new MeshBasicMaterial();

const loader = new GLTFLoader().setPath('./assets/models/');
loader.load('barrel.gltf', function (gltf) {
	scene.add(gltf.scene);
	render();
});

const ambientLight = new AmbientLight(ambientLightColor);
scene.add(ambientLight);

// const guiParams = {
// 	debugLights: true,
// 	light0: true,
// 	light1: true,
// 	animateLights: true,
// 	model: "sphere",
// };

// const gui = new GUI();
// gui.add(guiParams, "debugLights").onChange((value) => {
// 	setDebugLightsOn(value);
// });
// setDebugLightsOn(guiParams.debugLights);

// gui.add(guiParams, "light0").onChange((value) => {
// 	whiteLight.visible = value;
// });
// gui.add(guiParams, "light1").onChange((value) => {
// 	redLight.visible = value;
// });

// gui.add(guiParams, "model", ["sphere", "cube"]).onChange(showModels);
// function showModels(value) {
// 	for (const model of models) {
// 		model.visible = false;
// 	}
// 	let thingsToShow;
// 	switch (value) {
// 		case "sphere":
// 			thingsToShow = spheres;
// 			break;
// 		case "cube":
// 			thingsToShow = boxes;
// 			break;
// 	}
// 	for (const model of thingsToShow) {
// 		model.visible = true;
// 	}
// }
// showModels(guiParams.model);

// gui.add(guiParams, "animateLights");

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
	// const time = guiParams.animateLights ? new Date().getTime() : lastTime;
	// whiteLight.position.set(2 * Math.sin(time / 1000), 3, 2 * Math.cos(time / 1000));
	// redLight.position.set(1, 3 + 2 * Math.sin(time / 1000), 3);
	// lastTime = time;
}
