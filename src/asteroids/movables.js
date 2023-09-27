const globalDrag = 0.4;

export class Movables {
	#movables = new Map();

	add(object3d, velocity, angularVelocity, shouldWrap = false, hasDrag = false) {
		if (!object3d) {
			throw new Error("object3d parameter is required");
		}
		if (!velocity) {
			throw new Error("velocity parameter is required");
		}
		if (!angularVelocity) {
			throw new Error("angularVelocity parameter is required");
		}
		this.#movables.set(object3d, { velocity, angularVelocity, shouldWrap, hasDrag });
	}

	setAngularVelocity(object3d, angularVelocity) {
		const movable = this.#movables.get(object3d);
		if (!movable) {
			console.error("Unknown object", object3d);
			throw new Error("Unknown object");
		}
		this.#movables.set(object3d, { ...movable, angularVelocity });
	}

	setVelocity(object3d, velocity) {
		const movable = this.#movables.get(object3d);
		if (!movable) {
			console.error("Unknown object", object3d);
			throw new Error("Unknown object");
		}
		this.#movables.set(object3d, { ...movable, velocity });
	}

	accelerate(object3d, acceleration) {
		const movable = this.#movables.get(object3d);
		if (!movable) {
			console.error("Unknown object", object3d);
			throw new Error("Unknown object");
		}
		movable.velocity.add(acceleration);
	}

	getVelocity(object3d) {
		const movable = this.#movables.get(object3d);
		if (!movable) {
			console.error("Unknown object", object3d);
			throw new Error("Unknown object");
		}
		return movable.velocity.clone();
	}

	step(timestampDifference, areaBounds) {
		const { top, bottom, left, right } = areaBounds;
		for (const [object3d, { velocity, angularVelocity, shouldWrap, hasDrag }] of this.#movables) {
			if (hasDrag) {
				const dragAcceleration = velocity
					.clone()
					.negate()
					.multiplyScalar(globalDrag * timestampDifference);
				velocity.add(dragAcceleration);
			}
			object3d.rotateX(timestampDifference * angularVelocity.x);
			object3d.rotateY(timestampDifference * angularVelocity.y);
			object3d.rotateZ(timestampDifference * angularVelocity.z);

			const positionDelta = velocity.clone().multiplyScalar(timestampDifference);
			object3d.position.add(positionDelta);

			if (shouldWrap) {
				if (object3d.position.x > right) {
					object3d.position.setX(left);
				} else if (object3d.position.x < left) {
					object3d.position.setX(right);
				} else if (object3d.position.y > top) {
					object3d.position.setY(bottom);
				} else if (object3d.position.y < bottom) {
					object3d.position.setY(top);
				}
			}
		}
	}
}
