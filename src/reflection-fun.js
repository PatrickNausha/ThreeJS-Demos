import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Reflector } from "./reflector";
import { RectAreaLightUniformsLib } from "three/examples/jsm/lights/RectAreaLightUniformsLib";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import { FilmPass } from "three/examples/jsm/postprocessing/FilmPass";
import { MeshBasicMaterial } from "three";

let renderer, scene, bloomComposer, camera, finalComposer, groundMirror, rectLight1, rectLightHelper1;

const BLOOM_SCENE = 1;
const bloomLayer = new THREE.Layers();
bloomLayer.set(BLOOM_SCENE);

init();

function init() {
	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setAnimationLoop(animation);
	document.body.appendChild(renderer.domElement);

	const textureLoader = new THREE.TextureLoader();
	const concreteDiffuseMap = textureLoader.load("./assets/concrete/Concrete019_1K_Color.jpg");
	const concreteNormalMap = textureLoader.load("./assets/concrete/Concrete019_1K_NormalGL.jpg");
	concreteDiffuseMap.wrapS = concreteDiffuseMap.wrapT = THREE.RepeatWrapping;
	concreteNormalMap.wrapS = concreteNormalMap.wrapT = THREE.RepeatWrapping;
	concreteDiffuseMap.repeat.set(10, 10);
	concreteNormalMap.repeat.set(10, 10);

	camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
	camera.position.set(0, 15, -25);

	scene = new THREE.Scene();

	RectAreaLightUniformsLib.init();
	const lightWidth = 8;
	const lightHeight = 50;
	const lightColor = 0xff5500;
	rectLight1 = new THREE.RectAreaLight(lightColor, 10, lightWidth, lightHeight);
	const areaLightPlaneGeometry = new THREE.PlaneGeometry(lightWidth, lightHeight);
	const areaLightPlane = new THREE.Mesh(
		areaLightPlaneGeometry,
		new MeshBasicMaterial({
			color: lightColor,
		})
	);
	areaLightPlane.rotateX(Math.PI);
	rectLight1.position.set(0, lightHeight / 2, 66.8);
	areaLightPlane.position.set(0, lightHeight / 2, 66.8);
	scene.add(rectLight1);
	scene.add(areaLightPlane);

	areaLightPlane.layers.enable(BLOOM_SCENE);

	const geoFloor = new THREE.PlaneGeometry(100, 100);
	groundMirror = new Reflector(geoFloor, {
		clipBias: 0.003,
		textureWidth: window.innerWidth * window.devicePixelRatio,
		textureHeight: window.innerHeight * window.devicePixelRatio,
		color: 0xffffff,
		transparent: true,
		opacity: 0.4,
		depthFunc: THREE.EqualDepth, // Match ground depth exactly
	});
	groundMirror.rotateX(-Math.PI / 2);
	groundMirror.rotateZ(Math.PI / 4);
	scene.add(groundMirror);

	const matStdFloor = new THREE.MeshStandardMaterial({
		color: 0xffffff,
		roughness: 0.2,
		metalness: 0,
		normalMap: concreteNormalMap,
		map: concreteDiffuseMap,
	});
	const mshStdFloor = new THREE.Mesh(geoFloor, matStdFloor);
	mshStdFloor.rotateX(-Math.PI / 2);
	mshStdFloor.rotateZ(Math.PI / 4);
	scene.add(mshStdFloor);

	const geoKnot = new THREE.TorusKnotGeometry(1.5, 0.5, 200, 16);
	const matKnot = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0, metalness: 0 });
	const meshKnot = new THREE.Mesh(geoKnot, matKnot);
	meshKnot.name = "meshKnot";
	meshKnot.position.set(0, 3, 24);
	scene.add(meshKnot);

	const controls = new OrbitControls(camera, renderer.domElement);
	controls.target.set(0, 15, 100);
	controls.update();

	window.addEventListener("resize", onWindowResize);

	// Add render passes
	const renderPass = new RenderPass(scene, camera);
	const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
	const params = {
		exposure: 1,
		bloomStrength: 1,
		bloomThreshold: 0,
		bloomRadius: 1,
	};
	bloomPass.threshold = params.bloomThreshold;
	bloomPass.strength = params.bloomStrength;
	bloomPass.radius = params.bloomRadius;

	bloomComposer = new EffectComposer(renderer);
	bloomComposer.renderToScreen = false;
	bloomComposer.addPass(renderPass); // We'll darken non-bloomy things
	bloomComposer.addPass(bloomPass);

	const finalPass = new ShaderPass(
		new THREE.ShaderMaterial({
			uniforms: {
				baseTexture: { value: null },
				bloomTexture: { value: bloomComposer.renderTarget2.texture },
			},
			vertexShader: `
				varying vec2 vUv;

				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,
			fragmentShader: `
				uniform sampler2D baseTexture;
				uniform sampler2D bloomTexture;

				varying vec2 vUv;

				void main() {
					gl_FragColor = ( texture2D( baseTexture, vUv ) + vec4( 1.0 ) * texture2D( bloomTexture, vUv ) );
				}`,
			defines: {},
		}),
		"baseTexture"
	);
	finalPass.needsSwap = true;

	finalComposer = new EffectComposer(renderer);
	finalComposer.addPass(renderPass);
	finalComposer.addPass(finalPass);
	finalComposer.addPass(new FilmPass(0.35, 0, 0, false));
}

function onWindowResize() {
	renderer.setSize(window.innerWidth, window.innerHeight);
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
}

function animation(time) {
	const mesh = scene.getObjectByName("meshKnot");
	mesh.rotation.y = time / 1000;

	// Render bloom-enabled things to bloom texture
	renderBloom();

	finalComposer.render(0.01); // 0.01 is arbitrary for film pass
}

function renderBloom() {
	scene.traverse(darkenNonBloomed);
	groundMirror.visible = false;
	bloomComposer.render();
	scene.traverse(restoreDarkenedMaterial);
	groundMirror.visible = true;
}

const darkMaterial = new THREE.MeshBasicMaterial({ color: "black" });
const materials = {};
function darkenNonBloomed(obj) {
	if (obj.isMesh && bloomLayer.test(obj.layers) === false) {
		materials[obj.uuid] = obj.material;
		obj.material = darkMaterial;
	}
}

function restoreDarkenedMaterial(obj) {
	if (materials[obj.uuid]) {
		obj.material = materials[obj.uuid];
		delete materials[obj.uuid];
	}
}
