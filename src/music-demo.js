import * as THREE from "three";
import * as Tone from "tone";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper";
import { RectAreaLightUniformsLib } from "three/examples/jsm/lights/RectAreaLightUniformsLib";

let renderer, scene, camera, rectLight1, rectLight2, rectLight3, rectLightHelper1, rectLightHelper2, rectLightHelper3;

init();

function init() {
	renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setAnimationLoop(animation);
	renderer.outputEncoding = THREE.sRGBEncoding;
	document.body.appendChild(renderer.domElement);

	camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
	camera.position.set(0, 5, -15);

	scene = new THREE.Scene();

	RectAreaLightUniformsLib.init();
	rectLight1 = new THREE.RectAreaLight(0x8ce2dd, 5, 4, 100);
	rectLight1.position.set(-5, 50, 5);
	scene.add(rectLight1);

	rectLight2 = new THREE.RectAreaLight(0x21e7bd, 5, 4, 100);
	rectLight2.position.set(0, 50, 5);
	scene.add(rectLight2);

	rectLight3 = new THREE.RectAreaLight(0xefa20e, 5, 4, 100);
	rectLight3.position.set(5, 50, 5);
	scene.add(rectLight3);

	rectLightHelper1 = new RectAreaLightHelper(rectLight1);
	rectLightHelper2 = new RectAreaLightHelper(rectLight2);
	rectLightHelper3 = new RectAreaLightHelper(rectLight3);

	rectLight1.visible = false;
	rectLightHelper1.visible = false;
	rectLight2.visible = false;
	rectLightHelper2.visible = false;
	rectLight3.visible = false;
	rectLightHelper3.visible = false;

	scene.add(rectLightHelper1);
	scene.add(rectLightHelper2);
	scene.add(rectLightHelper3);

	const geoFloor = new THREE.BoxGeometry(2000, 0.1, 2000);
	const matStdFloor = new THREE.MeshStandardMaterial({ color: 0x808080, roughness: 0.1, metalness: 0 });
	const mshStdFloor = new THREE.Mesh(geoFloor, matStdFloor);
	scene.add(mshStdFloor);

	const geoKnot = new THREE.TorusKnotGeometry(1.5, 0.5, 200, 16);
	const matKnot = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0, metalness: 0 });
	const meshKnot = new THREE.Mesh(geoKnot, matKnot);
	meshKnot.name = "meshKnot";
	meshKnot.position.set(0, 5, 0);
	scene.add(meshKnot);

	const controls = new OrbitControls(camera, renderer.domElement);
	controls.target.copy(meshKnot.position);
	controls.update();

	window.addEventListener("resize", onWindowResize);
}

// const dist = new Tone.PingPongDelay("8n", 0.8).toDestination();
const synth = new Tone.PolySynth(Tone.Synth);
// synth.connect(dist);
synth.toDestination();

//create a synth and connect it to the main output (your speakers)
let resolveTonePromise;
const tonePromise = new Promise((resolve) => {
	resolveTonePromise = resolve;
});
document.body.addEventListener("click", () => {
	Tone.start().then(resolveTonePromise);
});

function onWindowResize() {
	renderer.setSize(window.innerWidth, window.innerHeight);
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
}

function animation(time) {
	const mesh = scene.getObjectByName("meshKnot");
	mesh.rotation.y = time / 1000;

	renderer.render(scene, camera);
}

tonePromise.then(() => {
	setInterval(() => {
		rectLight1.visible = !rectLight1.visible;
		rectLightHelper1.visible = !rectLightHelper1.visible;

		if (rectLight1.visible) {
			synth.triggerAttack("C3");
		} else {
			synth.triggerRelease("C3");
		}
	}, 1000);

	setInterval(() => {
		rectLight2.visible = !rectLight2.visible;
		rectLightHelper2.visible = !rectLightHelper2.visible;

		if (rectLight2.visible) {
			synth.triggerAttack("E3");
		} else {
			synth.triggerRelease("E3");
		}
	}, 500);

	setInterval(() => {
		rectLight3.visible = !rectLight3.visible;
		rectLightHelper3.visible = !rectLightHelper3.visible;

		if (rectLight3.visible) {
			synth.triggerAttack("G3");
		} else {
			synth.triggerRelease("G3");
		}
	}, 1250);
});
