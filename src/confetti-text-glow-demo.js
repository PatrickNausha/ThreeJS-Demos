import {
	Scene,
	PerspectiveCamera,
	WebGLRenderer,
	Mesh,
	Group,
	MeshNormalMaterial,
	FontLoader,
	TextGeometry,
	PlaneGeometry,
	Box3,
	Vector2,
	Vector3,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader.js";
import helvetikerRegularJson from "three/examples/fonts/helvetiker_bold.typeface.json"; // TODO: Add font license if published to web. https://github.com/mrdoob/three.js/blob/master/examples/fonts/LICENSE
import { makeCentered } from "./positioning";
import { updateStats, toggleStats } from "./debug-stats";

const renderer = new WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x070b34);
document.body.appendChild(renderer.domElement);

// In the beginning ...
const scene = new Scene();

// Camera
const camera = new PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 10000);
camera.position.z = 200;
const orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.enableDamping = true;
orbitControls.enablePan = false;
orbitControls.maxAzimuthAngle = Math.PI * (1 / 6);
orbitControls.minAzimuthAngle = -Math.PI * (1 / 6);
orbitControls.maxPolarAngle = Math.PI * (2 / 3);
orbitControls.minPolarAngle = Math.PI * (1 / 3);

const font = new FontLoader().parse(helvetikerRegularJson);
const fontGeometry = new TextGeometry("GLOW", {
	font,
	size: 24,
	height: 5,
	curveSegments: 12,
	bevelEnabled: false,
});
const fontMaterial = new MeshNormalMaterial();
const fontMesh = new Mesh(fontGeometry, fontMaterial);
makeCentered(fontMesh);

const fontGroup = new Group();
fontGroup.add(fontMesh);
scene.add(fontGroup);

const confettiBox = new Box3(new Vector3(-1000, -1000, -1000), new Vector3(1000, 1000, -100)); // Box within which to render confetti
const confetti = [];
const confettiPieceCount = 100;
const confettiPieceSize = 50;
for (let pieceCount = 0; pieceCount < confettiPieceCount; pieceCount++) {
	const group = new Group();
	const material = new MeshNormalMaterial({
		transparent: true,
	});
	const mesh = new Mesh(new PlaneGeometry(confettiPieceSize, confettiPieceSize), material);
	group.add(mesh);

	const orientation = getConfettiStartOrientation();
	group.position.copy(orientation.position);
	group.rotation.x = orientation.rotationX;
	group.rotation.y = orientation.rotationY;

	scene.add(group);
	confetti.push({ group, material });
}

function getConfettiStartOrientation() {
	const confettiBoxSize = confettiBox.getSize(new Vector3());
	return {
		position: new Vector3(
			Math.floor(Math.random() * confettiBoxSize.x) + confettiBox.min.x,
			Math.floor(Math.random() * confettiBoxSize.y) + confettiBox.min.y,
			Math.floor(Math.random() * confettiBoxSize.z) + confettiBox.min.z
		),
		rotationX: Math.random() * Math.PI,
		rotationY: Math.random() * Math.PI,
	};
}

function step(duration) {
	orbitControls.update(); // Required for damping.

	for (const piece of confetti) {
		piece.group.position.y += duration * 100;
		piece.group.rotation.x += duration * 2;
		piece.group.rotation.y += duration * 2;
		if (piece.group.position.y > confettiBox.max.y) {
			const orientation = getConfettiStartOrientation();
			piece.group.position.copy(orientation.position);
			piece.group.rotation.x += orientation.rotationX;
			piece.group.rotation.y += orientation.rotationX;
		}

		// Make more opaque when pointed at us
		const rotatedVector = new Vector3(0, 0, 1);
		rotatedVector.applyEuler(piece.group.rotation);
		piece.material.opacity = new Vector3(0, 0, 1).dot(rotatedVector);
	}
}

// Show stats
toggleStats();

// Add render passes
const composer = new EffectComposer(renderer);
composer.setSize(window.innerWidth, window.innerHeight);

const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

const bloomPass = new UnrealBloomPass(new Vector2(window.innerWidth, window.innerHeight), 0.75, 1, 0.1);
composer.addPass(bloomPass);

const fxaaPass = new ShaderPass(FXAAShader);
const pixelRatio = renderer.getPixelRatio();
fxaaPass.material.uniforms["resolution"].value.x = 1 / (window.innerWidth * pixelRatio);
fxaaPass.material.uniforms["resolution"].value.y = 1 / (window.innerHeight * pixelRatio);

composer.addPass(fxaaPass);

// Main loop
let lastTimeStamp;
function animate(timeStamp) {
	requestAnimationFrame(animate);

	if (!lastTimeStamp) {
		lastTimeStamp = timeStamp;
	}
	const duration = timeStamp - lastTimeStamp;
	step(duration / 1000);

	composer.render(scene, camera);
	lastTimeStamp = timeStamp;
	updateStats();
}
requestAnimationFrame(animate);
