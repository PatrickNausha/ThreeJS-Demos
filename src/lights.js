import { BoxGeometry, MeshBasicMaterial, Mesh, Group, PointLightHelper } from "three";

const lights = [];
const lightHelperSize = 0.1;
export function addLight(scene, light) {
	const pointLightHelper = new PointLightHelper(light, lightHelperSize);
	pointLightHelper.visible = false;

	scene.add(light);
	scene.add(pointLightHelper);

	const debugableLight = {
		light,
		setDebugLightOn: (value) => {
			pointLightHelper.visible = value;
		},
	};
	lights.push(debugableLight);
	return debugableLight;
}

export function setDebugLightsOn(value) {
	for (const light of lights) {
		light.setDebugLightOn(value);
	}
}
