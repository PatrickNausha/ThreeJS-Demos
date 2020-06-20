export function slamItOnTheGround(mesh, x, z, groundLevel) {
	if (!mesh.geometry.boundingBox) {
		mesh.geometry.computeBoundingBox();
	}
	mesh.position.x = x;
	mesh.position.y = 0 - mesh.geometry.boundingBox.min.y;
	mesh.position.z = z;
}
