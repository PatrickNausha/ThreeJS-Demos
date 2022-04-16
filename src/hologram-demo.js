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

const renderer = new WebGLRenderer();
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
	scanLineScale: { value: 1.0 / devicePixelRatio },
	scanLineIntensity: { value: 0.75 },
	color: { value: new Vector3(0.07, 0.07, 0.15) },
	lightingIntensity: { value: 3.5 },
	filmGrainIntensity: { value: 0.15 },
	resolution: { value: new Vector2(window.innerWidth * devicePixelRatio, window.innerHeight * devicePixelRatio) },
	opacity: { value: 0.8 },
	opacityJitterStrength: { value: 0.05 },
	opacityJitterSpeed: { value: 40 },
	smoothStepLighting: { value: true },
	exposure: { value: 2.0 },
	wiggleStrength: { value: 2.0 },
	wigglePeriod: { value: 3.0 },
	wiggleDuration: { value: 0.1 },
};
const material = new ShaderMaterial({
	transparent: true,
	uniforms,
	vertexShader: `
		varying vec3 vNormal;
		uniform mat4 inverseViewMatrix;
		uniform float time;
		uniform float wiggleStrength;
		uniform float wigglePeriod;
		uniform float wiggleDuration;

		void main()
		{
			vNormal = normal;
			float viewSpaceY = (modelViewMatrix * vec4(position, 1.0)).y;
			float wiggleFactor = 0.0;
			if (fract(time / wigglePeriod) > 1.0 - wiggleDuration) {
				wiggleFactor = wiggleStrength;
			}

			float jitterScale = 25.0;
			float jitterSpeed = 80.0;
			float x = viewSpaceY * jitterScale + time * jitterSpeed;
			vec4 noiseShift = inverseViewMatrix * vec4(wiggleFactor * sin(x / 3.0) * sin(x / 13.0), 0.0, 0.0, 0.0);
			vec3 shiftedPosition = noiseShift.xyz / 7.0 + position;
			vec4 mvPosition = modelViewMatrix * vec4(shiftedPosition, 1.0);
			gl_Position = projectionMatrix * mvPosition;
		}`,
	fragmentShader: `
		#define PI 3.141592653589793
		uniform float scanLineScale;
		uniform float scanLineIntensity;
		uniform float filmGrainIntensity;
		uniform float time;
		uniform float exposure;
		uniform vec3 color;
		uniform float opacity;
		uniform vec2 resolution;
		uniform float lightingIntensity;
		uniform bool smoothStepLighting;
		uniform float opacityJitterStrength;
		uniform float opacityJitterSpeed;
		varying vec3 vNormal;	// Interpolated Normal vector passed in from vertex shader

		// Psuedo-random generator from https://thebookofshaders.com/10/
		float random(vec2 st) {
			return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
		}

		float getVerticalNoise(float verticalNoiseFrameRate, float verticalNoiseSpeed, float verticalNoiseScale) {
			float v = gl_FragCoord.y / resolution.y * verticalNoiseScale;
			float theta = (v + floor(time * verticalNoiseFrameRate) * verticalNoiseSpeed);
			float verticalNoiseStrength = 1.5;
			return pow(100.0, sin(theta) * sin(theta / 3.0) * sin(theta / 13.0)) / 100.0 * verticalNoiseStrength;
		}

		void main() {
			// Some basic Lambertian-ish reflectance.
			vec3 lightDirection = normalize(vec3(0.7, 0.5, 1.0));
			float diffuse = max(dot(vNormal, lightDirection), 0.0);
			if (smoothStepLighting)
				diffuse = smoothstep(0.0, 1.0, diffuse);
			diffuse *= lightingIntensity;

			// Use a "spikey" sine equation shifted by time for some moving glowing noise bars.

			float scanLineMultiplier = mix(1.0 - scanLineIntensity, 1.0, abs(sin(gl_FragCoord.y * scanLineScale * PI * 0.25)));

			float verticalNoise = getVerticalNoise(12.0, 2.0, 80.0) + getVerticalNoise(8.0, 1.0, 26.0);

			float brightness = diffuse + verticalNoise;
			
			float filmGrain = (2.0 * random(gl_FragCoord.xy / resolution + fract(time)) - 1.0) * filmGrainIntensity;

			vec3 fragColor = ((mix(color.xyz, vec3(0.1, 0.2, 1.0), brightness) * exposure) + filmGrain) * scanLineMultiplier;

			float theta = time * opacityJitterSpeed;
			float opacityJitter = (sin(theta) / 2.0 + 1.0) * opacityJitterStrength;
			gl_FragColor = vec4(fragColor, opacity - opacityJitter);
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
	bloom: bloomPass.enabled,
	"Anti-aliasing": fxaaPass.enabled,
	Opacity: uniforms.opacity.value,
};

const noiseParams = {
	"Film grain": uniforms.filmGrainIntensity.value,
	Jitter: uniforms.opacityJitterStrength.value,
	"Jitter speed": uniforms.opacityJitterSpeed.value,
	"Wiggle strength": uniforms.wiggleStrength.value,
	"Wiggle period": uniforms.wigglePeriod.value,
	"Wiggle duration": uniforms.wiggleDuration.value,
};
const noiseFolder = gui.addFolder("Noise");
noiseFolder.add(noiseParams, "Film grain", 0, 1).onChange((value) => {
	material.uniforms.filmGrainIntensity.value = value;
});
noiseFolder.add(noiseParams, "Jitter", 0, 1).onChange((value) => {
	material.uniforms.opacityJitterStrength.value = value;
});
noiseFolder.add(noiseParams, "Jitter speed", 0, 100).onChange((value) => {
	material.uniforms.opacityJitterSpeed.value = value;
});
noiseFolder.add(noiseParams, "Wiggle strength", 0, 10).onChange((value) => {
	uniforms.wiggleStrength.value = value;
});
noiseFolder.add(noiseParams, "Wiggle period", 0, 10).onChange((value) => {
	uniforms.wigglePeriod.value = value;
});
noiseFolder.add(noiseParams, "Wiggle duration", 0, 1).onChange((value) => {
	uniforms.wiggleDuration.value = value;
});
noiseFolder.open();

const lightingParams = {
	Intensity: uniforms.lightingIntensity.value,
	Exposure: uniforms.exposure.value,
	"Smooth step": uniforms.smoothStepLighting.value,
};
const lightingFolder = gui.addFolder("Lighting");
lightingFolder.add(lightingParams, "Intensity", 0, 10).onChange((value) => {
	material.uniforms.lightingIntensity.value = value;
});
lightingFolder.add(lightingParams, "Exposure", 0, 10).onChange((value) => {
	material.uniforms.exposure.value = value;
});
lightingFolder.add(lightingParams, "Smooth step").onChange((value) => {
	material.uniforms.smoothStepLighting.value = value;
});
lightingFolder.open();

gui.add(guiParams, "Opacity", 0, 1).onChange((value) => {
	material.uniforms.opacity.value = value;
});
gui.add(guiParams, "bloom").onChange((value) => {
	bloomPass.enabled = value;
});
gui.add(guiParams, "Anti-aliasing").onChange((value) => {
	fxaaPass.enabled = value;
});

const scanlineParams = {
	Scale: uniforms.scanLineScale.value,
	Intensity: uniforms.scanLineIntensity.value,
};
const scanlineFolder = gui.addFolder("Scanlines");
scanlineFolder.add(scanlineParams, "Scale", 0, 2).onChange((value) => {
	material.uniforms.scanLineScale.value = value;
});
scanlineFolder.add(scanlineParams, "Intensity", 0, 1).onChange((value) => {
	material.uniforms.scanLineIntensity.value = value;
});

// Main loop
let hasConfirmedWarning = false;
function animate(time) {
	hasConfirmedWarning = hasConfirmedWarning || window.confirm('WARNING. This example may potentially trigger seizures for people with photosensitive epilepsy.');
	const timeSeconds = time / 1000;
	uniforms.inverseViewMatrix = { value: camera.matrixWorld };
	uniforms.time.value = timeSeconds;
	requestAnimationFrame(animate);

	if (hasConfirmedWarning) {
		composer.render(scene, camera);
	}
	updateStats();
}

animate();
