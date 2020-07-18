import {
	Scene,
	PerspectiveCamera,
	WebGLRenderer,
	ShaderMaterial,
	Mesh,
	BoxGeometry,
	SphereGeometry,
	Vector2,
	Color,
	TorusKnotGeometry,
	Vector3,
} from "three";
import { GUI } from "dat.gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { updateStats, toggleStats } from "./debug-stats";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader.js";

const renderer = new WebGLRenderer({ antialias: true });
const devicePixelRatio = window.devicePixelRatio || 1;
const clearColor = new Color(0.07, 0.07, 0.15);
renderer.setPixelRatio(devicePixelRatio);
renderer.setClearColor(clearColor);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// In the beginning ...
const scene = new Scene();

// Camera
const camera = new PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.x = 0;
camera.position.y = 2;
camera.position.z = 10;
new OrbitControls(camera, renderer.domElement);

const uniforms = {
	time: { value: 1.0 },
	scanLineWidth: { value: 100.0 },
	scanLineSpeed: { value: 10 },
	color: { value: new Vector3(0.07, 0.07, 0.15) },
	lightingIntensity: { value: 4.0 },
	filmGrainIntensity: { value: 0.5 },
	resolution: { value: new Vector2(window.innerWidth * devicePixelRatio, window.innerHeight * devicePixelRatio) },
	opacity: { value: 0.8 },
};
const material = new ShaderMaterial({
	transparent: true,
	uniforms,
	vertexShader: `
		varying vec3 vNormal;
		uniform mat4 inverseViewMatrix;
		uniform float time;

		void main()
		{
			vNormal = normal;
			float viewSpaceY = (modelViewMatrix * vec4(position, 1.0)).y;
			float constructiveInterference = 0.0;
			if (fract(time / 3.0) > 0.95) {
				constructiveInterference = 2.0;
			}
			float x = viewSpaceY * 25.0 + time * 80.0;
			vec4 noiseShift = inverseViewMatrix * vec4(constructiveInterference * sin(x / 3.0) * sin(x / 13.0), 0.0, 0.0, 0.0);
			vec3 shiftedPosition = noiseShift.xyz / 7.0 + position;
			vec4 mvPosition = modelViewMatrix * vec4(shiftedPosition, 1.0);
			gl_Position = projectionMatrix * mvPosition;
		}`,
	fragmentShader: `
		uniform float scanLineWidth;
		uniform float scanLineSpeed;
		uniform float filmGrainIntensity;
		uniform float time;
		uniform vec3 color;
		uniform float opacity;
		uniform vec2 resolution;
		uniform float lightingIntensity;
		varying vec3 vNormal;	// Interpolated Normal vector passed in from vertex shader

		// Psuedo-random generator from https://thebookofshaders.com/10/
		float random(vec2 st) {
			return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
		}

		void main() {
			float lightingBrightness = smoothstep(0.0, 1.0, max(dot(vNormal, normalize(vec3(0.7, 0.5, 1))), 0.0)) * lightingIntensity;	// Poor man's lighting

			// For some "noise," use an exponential sin-based equation.
			float verticalNoiseFrameRate = 16.0;
			float verticalNoiseSpeed = 32.0;
			float adderX = (gl_FragCoord.y + floor(time * verticalNoiseFrameRate) * verticalNoiseSpeed) / 20.0;
			float constructiveInterferenceStrength = mix(0.0, 0.25, 0.75 + sin(3.1416 * fract(time * verticalNoiseFrameRate)) * 0.25);
			float constructiveInterference = pow(100.0, sin(adderX) * sin(adderX / 3.0) * sin(adderX / 13.0)) / 100.0 * constructiveInterferenceStrength;

			float scanLineMultiplier = min(abs(sin(gl_FragCoord.y * scanLineWidth - time * scanLineSpeed)) + 0.5, 1.0);
			float filmGrain = random(gl_FragCoord.xy / resolution + fract(time)) * filmGrainIntensity;
			float brightness = (lightingBrightness + constructiveInterference) * scanLineMultiplier + filmGrain;

			vec3 fragColor = mix(color.xyz, vec3(0.1, 0.2, 1.0), brightness);
			
			gl_FragColor = vec4(fragColor, opacity);
		}
	`,
});

const box = new Mesh(new BoxGeometry(2, 2, 2, 20, 20, 20), material);
box.position.x = -4;
scene.add(box);

const sphere = new Mesh(new SphereGeometry(1.2, 22, 22), material);
scene.add(sphere);

const knot = new Mesh(new TorusKnotGeometry(1, 0.34, 128, 16), material);
knot.position.x = 4;
scene.add(knot);

// Show stats
toggleStats();

// Add render passes
const composer = new EffectComposer(renderer);
composer.setSize(window.innerWidth, window.innerHeight);

const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

const bloomPass = new UnrealBloomPass(new Vector2(window.innerWidth, window.innerHeight), 0.5, 1, 0.2);
composer.addPass(bloomPass);

const fxaaPass = new ShaderPass(FXAAShader);
const pixelRatio = renderer.getPixelRatio();
fxaaPass.material.uniforms["resolution"].value.x = 1 / (window.innerWidth * pixelRatio);
fxaaPass.material.uniforms["resolution"].value.y = 1 / (window.innerHeight * pixelRatio);
composer.addPass(fxaaPass);

// GUI
const gui = new GUI();
const guiParams = {
	lightingIntensity: uniforms.lightingIntensity.value,
	scanLineSpeed: uniforms.scanLineSpeed.value,
	filmGrainIntensity: uniforms.filmGrainIntensity.value,
	bloom: bloomPass.enabled,
	"anti-aliasing": fxaaPass.enabled,
	opacity: uniforms.opacity.value,
};
gui.add(guiParams, "lightingIntensity", 0, 10).onChange((value) => {
	material.uniforms.lightingIntensity.value = value;
});
gui.add(guiParams, "scanLineSpeed", 0, 100).onChange((value) => {
	material.uniforms.scanLineSpeed.value = value;
});
gui.add(guiParams, "filmGrainIntensity", 0, 10).onChange((value) => {
	material.uniforms.filmGrainIntensity.value = value;
});
gui.add(guiParams, "opacity", 0, 1).onChange((value) => {
	material.uniforms.opacity.value = value;
});
gui.add(guiParams, "bloom").onChange((value) => {
	bloomPass.enabled = value;
});
gui.add(guiParams, "anti-aliasing").onChange((value) => {
	fxaaPass.enabled = value;
});

// Main loop
function animate(time) {
	const timeSeconds = time / 1000;
	uniforms.inverseViewMatrix = { value: camera.matrixWorld };
	uniforms.time.value = timeSeconds;
	requestAnimationFrame(animate);
	composer.render(scene, camera);
	updateStats();
}
animate();
