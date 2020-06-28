import {
	Scene,
	PerspectiveCamera,
	WebGLRenderer,
	MeshStandardMaterial,
	HemisphereLight,
	Mesh,
	Group,
	DoubleSide,
	ExtrudeBufferGeometry,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader";
import { updateStats, toggleStats } from "./debug-stats";

const renderer = new WebGLRenderer({ antialias: true, alpha: true });
renderer.setClearColor(0x000000, 0);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// In the beginning ...
const scene = new Scene();

// Camera
const camera = new PerspectiveCamera(28, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.z = -500;
new OrbitControls(camera, renderer.domElement);

const plainMaterial = new MeshStandardMaterial();

const loader = new SVGLoader();

loader.load(
	"./assets/shine-like-stars-outlined-3.svg",
	function ({ paths }) {
		const group = new Group();
		for (const path of paths) {
			const material = new MeshStandardMaterial({
				color: path.color,
			});

			const shapes = path.toShapes(true);

			const { fill, stroke } = path.userData.style;
			if (fill && fill !== "none") {
				for (const shape of shapes) {
					const geometry = new ExtrudeBufferGeometry(shape, {
						depth: 2,
						bevelEnabled: false,
					});
					const mesh = new Mesh(geometry, material);
					group.add(mesh);
				}
			}
		}

		group.rotateZ(Math.PI);
		group.position.x = 200;
		group.position.y = 150;
		scene.add(group);
	},
	function (xhr) {
		// called when loading is in progresses
	},
	function (error) {
		console.error(error);
	}
);

const light = new HemisphereLight(0xaaaaff, 0xffaaaa, 1);
scene.add(light);

// Show stats
toggleStats();

// Main loop
function animate() {
	requestAnimationFrame(animate);
	renderer.render(scene, camera);
	updateStats();
}
animate();
