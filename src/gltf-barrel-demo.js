import { DirectionalLight } from "three";
import {
	Scene,
	PerspectiveCamera,
	WebGLRenderer,
	AmbientLight,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { updateStats, toggleStats } from "./debug-stats";

const renderer = new WebGLRenderer({ antialias: true });
renderer.setClearColor(0);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new Scene();

const camera = new PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.y = 1.5;
camera.position.z = -3;
new OrbitControls(camera, renderer.domElement);

const loader = new GLTFLoader().setPath('./assets/models/');
loader.load('barrel.gltf', function (gltf) {
	scene.add(gltf.scene);
	render();
});

const ambientLight = new AmbientLight(0x999999);
scene.add(ambientLight);

const directionalLight = new DirectionalLight(0xFFFFFF, 1.2);
directionalLight.position.set(-1, 1.5, -1);
scene.add(directionalLight);

toggleStats();

// Main loop
function animate() {
	requestAnimationFrame(animate);
	renderer.render(scene, camera);
	updateStats();
}
animate();
