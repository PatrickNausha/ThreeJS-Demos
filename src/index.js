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
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const renderer = new WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new Scene();
const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 15;
new OrbitControls(camera, renderer.domElement);

const material = new MeshStandardMaterial();
const bottom = new Mesh(new BoxGeometry(8, 2, 5), material);
scene.add(bottom);
const middle = new Mesh(new BoxGeometry(7, 1, 3), material);
middle.position.set(0.5, 1.5, 0);
scene.add(middle);
const front = new Mesh(new BoxGeometry(1, 4, 3), material);
front.position.set(4.5, 1, 0);
scene.add(front);

const black = new MeshBasicMaterial({ color: 0 });
const entry = new Mesh(new BoxGeometry(0.1, 3, 1.75), black);
entry.position.set(5, 0.5, 0);
scene.add(entry);

const brown = new MeshStandardMaterial({ color: 0x964b00 });
const pillar1 = new Mesh(new CylinderGeometry(0.2, 0.2, 3), brown);
pillar1.position.set(5.25, 0.5, 1.125);
scene.add(pillar1);

const pillar2 = new Mesh(new CylinderGeometry(0.2, 0.2, 3), brown);
pillar2.position.set(5.25, 0.5, -1.125);
scene.add(pillar2);

const lights = [new PointLight(0xffffff, 1, 0), new PointLight(0xffffff, 1, 0), new PointLight(0xffffff, 0.5, 0)];

lights[0].position.set(0, 200, 0);
lights[1].position.set(100, 200, 100);
lights[2].position.set(-100, -200, -100);

scene.add(lights[0]);
scene.add(lights[1]);
scene.add(lights[2]);

function animate() {
	requestAnimationFrame(animate);
	renderer.render(scene, camera);
}
animate();
