import { Vector3 } from "three";
import { playWarpSound } from "./audio";

const warpOutDuration = 0.25;
const warpInDuration = 0.25;

export class Warpables {
	#movables = null;
	#warpStatesByObject = new Map();
	#warpableAreaRect = null;

	constructor(movables, warpableAreaRect) {
		this.#movables = movables;
		this.#warpableAreaRect = warpableAreaRect;
	}

	step(timestampDifference) {
		for (const [object3d, state] of this.#warpStatesByObject) {
			if (state.state === "none") {
				return;
			}

			state.animationEllapsed += timestampDifference;

			if (state.state === "animate-out") {
				const lerpAlpha = Math.min(1, state.animationEllapsed / warpOutDuration);
				object3d.scale.lerpVectors(new Vector3(1, 1, 1), new Vector3(0, 0, 0), lerpAlpha);
				if (lerpAlpha >= 1) {
					state.state = "warping";
					state.animationEllapsed = 0;
				}
			} else if (state.state === "warping") {
				this.#warpMove(object3d);
				state.state = "animate-in";
			} else if (state.state === "animate-in") {
				const lerpAlpha = Math.max(0, state.animationEllapsed / warpInDuration);
				object3d.scale.lerpVectors(new Vector3(0, 0, 0), new Vector3(1, 1, 1), lerpAlpha);
				if (lerpAlpha >= 1) {
					state.state = "none";
					this.endWarp(object3d);
				}
			} else {
				throw new Error("Unknown warp state.");
			}
		}
	}

	endWarp(object3d) {
		this.#warpStatesByObject.delete(object3d);
	}

	warp(object3d) {
		if (this.#warpStatesByObject.has(object3d)) {
			// Already warping.
			return;
		}

		this.#warpStatesByObject.set(object3d, {
			state: "animate-out",
			animationEllapsed: 0,
		});
		playWarpSound();
	}

	#warpMove(object3d) {
		const warpableAreaWidth = this.#warpableAreaRect.right - this.#warpableAreaRect.left;
		const warpableAreaHeight = this.#warpableAreaRect.top - this.#warpableAreaRect.bottom;
		const randomX = Math.random() * warpableAreaWidth + this.#warpableAreaRect.left;
		const randomY = Math.random() * warpableAreaHeight + this.#warpableAreaRect.bottom;
		object3d.position.set(randomX, randomY, 0);
		this.#movables.setVelocity(object3d, new Vector3(0, 0, 0));
	}
}
