import { Sprite } from "three";

const spriteCount = 20;
export class Explosions {
	#sprites = [];
	#nextSpriteIndex = 0;

	initialize(scene, explosionTextures, fps) {
		this.#sprites = Array.from({ length: spriteCount }).map(() => new AnimatedSprite(explosionTextures, fps));
		for (const sprite of this.#sprites) {
			const threeSprite = sprite.getObject3d();
			threeSprite.visible = false;
			scene.add(threeSprite);
		}
	}

	explode(position) {
		const sprite = this.#sprites[this.#nextSpriteIndex % this.#sprites.length];
		sprite.restart();
		sprite.getObject3d().position.copy(position);
		this.#nextSpriteIndex++;
	}

	step(deltaSeconds) {
		for (const sprite of this.#sprites) {
			sprite.step(deltaSeconds);
		}
	}
}

class AnimatedSprite {
	#elapsedTime = 0;
	#textures = [];
	#sprite = null;
	#fps = 0;

	constructor(textures, fps) {
		this.#textures = textures;
		this.#fps = fps;
		this.#sprite = new Sprite();
	}

	getObject3d() {
		return this.#sprite;
	}

	restart() {
		this.#elapsedTime = 0;
		this.#sprite.visible = true;
	}

	step(deltaSeconds) {
		if (!this.#sprite.visible) {
			return;
		}

		this.#elapsedTime += deltaSeconds;

		const currentFrame = this.#elapsedTime * this.#fps;
		const texture = this.#textures.currentFrame;
		if (currentFrame >= this.#textures.length) {
			this.#sprite.visible = false;
		} else {
			// TODO: Set sprite texture to texture
		}
	}
}
