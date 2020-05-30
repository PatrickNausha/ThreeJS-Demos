import { Scene, PerspectiveCamera, WebGLRenderer, BoxGeometry, MeshStandardMaterial, Mesh, PointLight } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const renderer = new WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new Scene();
const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;
const controls = new OrbitControls(camera, renderer.domElement);

const geometry = new BoxGeometry();
const material = new MeshStandardMaterial();
const cube = new Mesh(geometry, material);

const lights = [new PointLight(0xffffff, 1, 0), new PointLight(0xffffff, 1, 0), new PointLight(0xffffff, 0.5, 0)];

lights[0].position.set(0, 200, 0);
lights[1].position.set(100, 200, 100);
lights[2].position.set(-100, -200, -100);

scene.add(lights[0]);
scene.add(lights[1]);
scene.add(lights[2]);
scene.add(cube);

function animate() {
	requestAnimationFrame(animate);
	renderer.render(scene, camera);
}
animate();
