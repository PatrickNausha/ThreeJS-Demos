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
	BoxGeometry,
	MeshBasicMaterial,
	Group,
	DoubleSide,
	ShapeBufferGeometry,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader";
import { updateStats, toggleStats } from "./debug-stats";
import { addLight, setDebugLightsOn } from "./lights";
import { slamItOnTheGround } from "./positioning";
import { GUI } from "dat.gui";

const ambientLightColor = 0x00ff00; //0xf0d8d2;

const renderer = new WebGLRenderer({ antialias: true });
renderer.setClearColor(ambientLightColor);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// In the beginning ...
const scene = new Scene();

// Camera
const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.x = 5;
camera.position.y = 5;
camera.position.z = 5;
const controls = new OrbitControls(camera, renderer.domElement);
controls.maxPolarAngle = Math.PI * 0.45;

const plainMaterial = new MeshStandardMaterial();

const loader = new SVGLoader();

loader.load(
	"./assets/shine-like-stars.svg",
	function ({ paths }) {
		const group = new Group();

		for (const path of paths) {
			const material = new MeshBasicMaterial({
				color: path.color,
				side: DoubleSide,
				depthWrite: false,
			});

			const shapes = path.toShapes(true);

			const { fill, stroke } = path.userData.style;
			if (fill && fill !== "none") {
				for (const shape of shapes) {
					const geometry = new ShapeBufferGeometry(shape);
					const mesh = new Mesh(geometry, material);
					group.add(mesh);
				}
			}

			if (stroke && stroke !== "none") {
				for (const shape of shapes) {
					const geometry = SVGLoader.pointsToStroke(shape.getPoints(), path.userData.style);
					const mesh = new Mesh(geometry, material);
					group.add(mesh);
				}
			}
		}

		scene.add(group);
	},
	function (xhr) {
		// called when loading is in progresses
	},
	function (error) {
		console.error(error);
	}
);

// Add the ground
const groundMesh = new Mesh(new PlaneBufferGeometry(1000, 1000), plainMaterial);
groundMesh.receiveShadow = true;
groundMesh.rotation.x = -Math.PI / 2;
scene.add(groundMesh);

// Add models
const spheres = [];
const boxes = [];
// for (let x = -1; x <= 1; x++) {
// 	for (let z = -1; z <= 1; z++) {
// 		const sphere = new Mesh(new SphereGeometry(1, 20, 20), plainMaterial);
// 		sphere.position.set(x, 0, z);
// 		sphere.castShadow = true;
// 		sphere.receiveShadow = true;
// 		slamItOnTheGround(sphere, x, z, 0);
// 		spheres.push(sphere);
// 		scene.add(sphere);
// 	}
// }
const models = [...spheres, ...boxes];

// Lights
const whiteLight = new PointLight(0xffffff, 1, 10, 2);
whiteLight.castShadow = true;
whiteLight.shadow.camera.near = 0.001;
whiteLight.shadow.camera.far = 10;
whiteLight.shadow.mapSize.width = 512;
whiteLight.shadow.mapSize.height = 512;
whiteLight.shadow.radius = 4;
const redLight = new PointLight(0xff0000, 1, 10, 2);
redLight.castShadow = true;
redLight.shadow.camera.near = 0.001;
redLight.shadow.camera.far = 10;
redLight.shadow.mapSize.width = 512;
redLight.shadow.mapSize.height = 512;
redLight.shadow.radius = 4;
redLight.castShadow = true;

addLight(scene, whiteLight);
addLight(scene, redLight);

const ambientLight = new AmbientLight(ambientLightColor);
scene.add(ambientLight);

const guiParams = {
	debugLights: true,
	light0: true,
	light1: true,
	animateLights: true,
	model: "sphere",
};

const gui = new GUI();
gui.add(guiParams, "debugLights").onChange((value) => {
	setDebugLightsOn(value);
});
setDebugLightsOn(guiParams.debugLights);

gui.add(guiParams, "light0").onChange((value) => {
	whiteLight.visible = value;
});
gui.add(guiParams, "light1").onChange((value) => {
	redLight.visible = value;
});

gui.add(guiParams, "model", ["sphere", "cube"]).onChange(showModels);
function showModels(value) {
	for (const model of models) {
		model.visible = false;
	}
	let thingsToShow;
	switch (value) {
		case "sphere":
			thingsToShow = spheres;
			break;
		case "cube":
			thingsToShow = boxes;
			break;
	}
	for (const model of thingsToShow) {
		model.visible = true;
	}
}
showModels(guiParams.model);

gui.add(guiParams, "animateLights");

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

let lastTime = new Date().getTime();
function step() {
	const time = guiParams.animateLights ? new Date().getTime() : lastTime;
	whiteLight.position.set(2 * Math.sin(time / 1000), 3, 2 * Math.cos(time / 1000));
	redLight.position.set(1, 3 + 2 * Math.sin(time / 1000), 3);
	lastTime = time;
}
