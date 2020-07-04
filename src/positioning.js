import { Vector3 } from "three";

export function slamItOnTheGround(mesh, x, z, groundLevel) {
	if (!mesh.geometry.boundingBox) {
		mesh.geometry.computeBoundingBox();
	}
	mesh.position.x = x;
	mesh.position.y = 0 - mesh.geometry.boundingBox.min.y;
	mesh.position.z = z;
}

export function makeCentered(mesh) {
	if (!mesh.geometry.boundingBox) {
		mesh.geometry.computeBoundingBox();
	}

	// For some reason, Three requires a Vector3 passed into getSize
	mesh.position.x = -mesh.geometry.boundingBox.getSize(new Vector3()).x / 2;
	mesh.position.y = -mesh.geometry.boundingBox.getSize(new Vector3()).y / 2;
	mesh.position.z = -mesh.geometry.boundingBox.getSize(new Vector3()).z / 2;
}
