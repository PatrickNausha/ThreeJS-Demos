export class Movables {
	#movables = new Map();

	add(object3d, velocity, angularVelocity) {
		if (!object3d) {
			throw new Error("object3d parameter is required");
		}
		if (!velocity) {
			throw new Error("velocity parameter is required");
		}
		if (!angularVelocity) {
			throw new Error("angularVelocity parameter is required");
		}
		this.#movables.set(object3d, { velocity, angularVelocity });
	}

	setAngularVelocity(object3d, angularVelocity) {
		const movable = this.#movables.get(object3d);
		if (!movable) {
			console.error("Unknown object", object3d);
			throw new Error("Unknown object");
		}
		this.#movables.set(object3d, { velocity: movable.velocity, angularVelocity });
	}

	step(timestampDifference) {
		for (const [object3d, { velocity, angularVelocity }] of this.#movables) {
			object3d.rotateX(timestampDifference * angularVelocity.x);
			object3d.rotateY(timestampDifference * angularVelocity.y);
			object3d.rotateZ(timestampDifference * angularVelocity.z);
		}
	}
}
