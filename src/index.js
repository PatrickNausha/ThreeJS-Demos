import {
	Scene,
	PerspectiveCamera,
	WebGLRenderer,
	BoxGeometry,
	MeshStandardMaterial,
	MeshBasicMaterial,
	Mesh,
	PointLight,
	CylinderGeometry,
	Group,
	SphereGeometry,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { toggleDebug, addLight } from "./lights";

const renderer = new WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new Scene();
const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.x = 5;
camera.position.y = 5;
camera.position.z = 5;
new OrbitControls(camera, renderer.domElement);

const plainMaterial = new MeshStandardMaterial();
const sphere = new Mesh(new SphereGeometry(1, 20, 20), plainMaterial);
scene.add(sphere);

const sceneLights = [addLight(scene, new PointLight(0xffffff, 1, 0))];
sceneLights[0].group.position.set(4, 4, 4);

function animate() {
	requestAnimationFrame(animate);
	renderer.render(scene, camera);
}
animate();

window.document.addEventListener("keydown", (event) => {
	if (event.isComposing || event.keyCode === "1".charCodeAt(0)) {
		toggleDebug();
	}
});
