import {
	Scene,
	PerspectiveCamera,
	WebGLRenderer,
	MeshStandardMaterial,
	Mesh,
	MeshBasicMaterial,
	Group,
	DoubleSide,
	ShapeBufferGeometry,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader";
import { updateStats, toggleStats } from "./debug-stats";

const ambientLightColor = 0xf0d8d2;

const renderer = new WebGLRenderer({ antialias: true });
renderer.setClearColor(ambientLightColor);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// In the beginning ...
const scene = new Scene();

// Camera
const camera = new PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.z = -500;
new OrbitControls(camera, renderer.domElement);

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

		group.rotateZ(Math.PI);
		group.position.x = 288;
		group.position.y = 256;
		scene.add(group);
	},
	function (xhr) {
		// called when loading is in progresses
	},
	function (error) {
		console.error(error);
	}
);

// Show stats
toggleStats();

// Main loop
function animate() {
	requestAnimationFrame(animate);
	renderer.render(scene, camera);
	updateStats();
}
animate();
