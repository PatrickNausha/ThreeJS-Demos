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

const renderer = new WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new Scene();
const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.x = 10;
camera.position.y = 7;
camera.position.z = 7;
new OrbitControls(camera, renderer.domElement);

const plainMaterial = new MeshStandardMaterial();
const sphere = new Mesh(new SphereGeometry(1, 20, 20), plainMaterial);
scene.add(sphere);

const lights = [new PointLight(0xffffff, 1, 0), new PointLight(0xffffff, 1, 0), new PointLight(0xffffff, 1, 0)];
lights[1].position.set(10, 10, 10);
lights[2].position.set(-10, -10, -10);

const debugableLight = addLight(scene, lights[0]);
scene.add(lights[1]);
scene.add(lights[2]);

debugableLight.group.position.set(0, 10, 0);

function animate() {
	requestAnimationFrame(animate);
	renderer.render(scene, camera);
}
animate();

window.document.addEventListener("keydown", (event) => {
	if (event.isComposing || event.keyCode === "1".charCodeAt(0)) {
		debugableLight.toggleDebug();
	}
});

const debugLightMaterial = new MeshBasicMaterial();
function addLight(scene, light) {
	const group = new Group();
	const debugLight = new Mesh(new BoxGeometry(0.4, 0.4, 0.4), debugLightMaterial);

	group.add(light);
	group.add(debugLight);

	scene.add(group);

	return {
		group,
		light,
		toggleDebug: () => {
			debugLight.visible = !debugLight.visible;
		},
	};
}
