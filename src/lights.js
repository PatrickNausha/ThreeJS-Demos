import { BoxGeometry, MeshBasicMaterial, Mesh, Group } from "three";

const lights = [];
export function addLight(scene, light) {
	const group = new Group();
	const debugLightMaterial = new MeshBasicMaterial();
	debugLightMaterial.color = light.color;
	const debugLight = new Mesh(new BoxGeometry(0.4, 0.4, 0.4), debugLightMaterial);
	debugLight.visible = false;

	group.add(light);
	group.add(debugLight);

	scene.add(group);

	const debugableLight = {
		group,
		light,
		toggleDebug: () => {
			debugLight.visible = !debugLight.visible;
		},
	};
	lights.push(debugableLight);
	return debugableLight;
}

export function toggleDebugLights() {
	for (const light of lights) {
		light.toggleDebug();
	}
}
