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
	AmbientLight,
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
const spheres = [
	new Mesh(new SphereGeometry(1, 20, 20), plainMaterial),
	new Mesh(new SphereGeometry(2, 20, 20), plainMaterial),
	new Mesh(new SphereGeometry(1, 20, 20), plainMaterial),
];
scene.add(spheres[0]);
spheres[1].position.set(-4, 0, -3);
scene.add(spheres[1]);
scene.add(spheres[2]);

const box = new Mesh(new BoxGeometry(1, 1, 1), plainMaterial);
box.position.set(4, 0, 4);
box.rotateY(45);
scene.add(box);

const sceneLights = [addLight(scene, new PointLight(0xffffff, 1, 0))];
sceneLights[0].group.position.set(3, 4, 3);

var light = new AmbientLight(0x111111); // soft white light
scene.add(light);

function animate() {
	step();
	requestAnimationFrame(animate);
	renderer.render(scene, camera);
}
animate();

function step() {
	sceneLights[0].group.position.set(
		2 * Math.sin(new Date().getTime() / 1000),
		3,
		2 * Math.cos(new Date().getTime() / 1000)
	);
}

window.document.addEventListener("keydown", (event) => {
	if (event.isComposing || event.keyCode === "1".charCodeAt(0)) {
		toggleDebug();
	}
});
