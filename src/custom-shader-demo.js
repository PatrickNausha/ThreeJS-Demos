import { Scene, PerspectiveCamera, WebGLRenderer, ShaderMaterial, Mesh, BoxGeometry } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { updateStats, toggleStats } from "./debug-stats";

const renderer = new WebGLRenderer({ antialias: true });
const devicePixelRatio = window.devicePixelRatio || 1;
renderer.setPixelRatio();
renderer.setClearColor(0x111111);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// In the beginning ...
const scene = new Scene();

// Camera
const camera = new PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.x = 3;
camera.position.y = 3;
camera.position.z = 3;
new OrbitControls(camera, renderer.domElement);

const uniforms = {
	time: { value: 1.0 },
	scanLineWidth: { value: 3 * devicePixelRatio },
	scanLineSpeed: { value: 10 },
};
const material = new ShaderMaterial({
	uniforms,

	vertexShader: `
		varying vec2 vUv;
		varying vec3 vNormal;
		void main()
		{
			vUv = uv;
			vNormal = normal;
			vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
			gl_Position = projectionMatrix * mvPosition;
		}`,
	fragmentShader: `
		uniform float scanLineWidth;
		uniform float scanLineSpeed;
		uniform float devicePixelRatio;
		uniform float time;
		varying vec2 vUv;	// Interpolated UV coordinate passed in from vertex shader
		varying vec3 vNormal;	// Interpolated Normal vector passed in from vertex shader

		void main() {
			float lightingBrightness = dot(vNormal, vec3(1, 0.7, 0.1));	// Poor man's lighting
			float scanLineMultiplier = min(abs(sin(gl_FragCoord.y * scanLineWidth - time * scanLineSpeed)) + 0.5, 1.0);
			float brightness = lightingBrightness * scanLineMultiplier;
			gl_FragColor = vec4(brightness, brightness, brightness, 1.0);
		}
	`,
});

const box = new Mesh(new BoxGeometry(2, 2, 2), material);
scene.add(box);

// Show stats
toggleStats();

// Main loop
function animate(time) {
	const timeSeconds = time / 1000;
	uniforms.time.value = timeSeconds;
	requestAnimationFrame(animate);
	renderer.render(scene, camera);
	updateStats();
}
animate();
