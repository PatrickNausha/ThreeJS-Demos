export class Movables {
	#movables = new Map();

	add(object3d, velocity, angularVelocity) {
		if (!velocity) {
			throw new Error("velocity parameter is required");
		}
		if (!angularVelocity) {
			throw new Error("angularVelocity parameter is required");
		}
		this.#movables.set(object3d, { velocity, angularVelocity });
	}

	step(timestampDifference) {
		for (const [object3d, { velocity, angularVelocity }] of this.#movables) {
			object3d.rotateZ(timestampDifference * angularVelocity.x);
			object3d.rotateY(timestampDifference * angularVelocity.y);
			object3d.rotateZ(timestampDifference * angularVelocity.z);
		}
	}
}
