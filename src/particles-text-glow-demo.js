import {
	Scene,
	PerspectiveCamera,
	WebGLRenderer,
	Mesh,
	Group,
	MeshNormalMaterial,
	FontLoader,
	TextGeometry,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import helvetikerRegularJson from "three/examples/fonts/helvetiker_regular.typeface.json"; // TODO: Add font license if published to web. https://github.com/mrdoob/three.js/blob/master/examples/fonts/LICENSE
import { makeCentered } from "./positioning";
import { updateStats, toggleStats } from "./debug-stats";

const renderer = new WebGLRenderer({ antialias: true, alpha: true });
renderer.setClearColor(0x000000, 0);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// In the beginning ...
const scene = new Scene();

// Camera
const camera = new PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.z = 160;
new OrbitControls(camera, renderer.domElement);

const font = new FontLoader().parse(helvetikerRegularJson);
const fontGeometry = new TextGeometry("GLOW", {
	font,
	size: 80,
	height: 5,
	curveSegments: 12,
	bevelEnabled: false,
});
const fontMesh = new Mesh(
	fontGeometry,
	new MeshNormalMaterial({
		color: 0xffffff,
	})
);
makeCentered(fontMesh);

const fontGroup = new Group();
fontGroup.add(fontMesh);
scene.add(fontGroup);

// Show stats
toggleStats();

// Main loop
function animate() {
	requestAnimationFrame(animate);
	renderer.render(scene, camera);
	updateStats();
}
animate();
