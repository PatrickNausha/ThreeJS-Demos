import {
	Scene,
	PerspectiveCamera,
	WebGLRenderer,
	MeshStandardMaterial,
	HemisphereLight,
	Mesh,
	Group,
	MeshBasicMaterial,
	ShapeBufferGeometry,
	ExtrudeGeometry,
	BackSide,
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
const camera = new PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.z = -160;
new OrbitControls(camera, renderer.domElement);

const loader = new SVGLoader();
loader.load(
	"./assets/shine-like-stars-outlined-3.svg",
	function ({ paths }) {
		const group = new Group();
		for (const path of paths) {
			const extrudeMaterial = new MeshStandardMaterial({
				color: path.color,
			});

			const frontGlowMaterial = new MeshBasicMaterial({
				color: path.color,
				side: BackSide, // Not sure why it comes out backward by default, but it does.
				depthTest: false, // Hack: Since we're rendering the ShapeBufferGeometry directly on top of the ExtrudeGeometry, always render on top.
			});

			const shapes = path.toShapes(true);

			const { fill } = path.userData.style;
			if (fill && fill !== "none") {
				console.log(shapes.length);
				for (const shape of shapes) {
					const extrudeGeometry = new ExtrudeGeometry(shape, {
						depth: 4,
						bevelEnabled: false,
					});
					const extrudeMesh = new Mesh(extrudeGeometry, extrudeMaterial);
					group.add(extrudeMesh);

					const geometry = new ShapeBufferGeometry(shape);
					const mesh = new Mesh(geometry, frontGlowMaterial);
					group.add(mesh);
				}
			}
		}

		group.rotateZ(Math.PI); // Not sure why SVG comes out flipped around.
		group.position.x = 200;
		group.position.y = 160;
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
