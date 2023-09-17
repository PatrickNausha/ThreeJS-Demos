import { Sprite, RepeatWrapping, SpriteMaterial } from "three";

const spriteCount = 20;
export class Explosions {
	#sprites = [];
	#nextSpriteIndex = 0;

	initialize(scene, explosionTexture, fps, horizontalTileCount, verticalTileCount) {
		this.#sprites = Array.from({ length: spriteCount }).map(
			() => new AnimatedSprite(explosionTexture, fps, horizontalTileCount, verticalTileCount)
		);
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
	#horizontalTileCount;
	#verticalTileCount;
	#sprite;
	#fps = 0;

	constructor(spriteSheetTexture, fps, horizontalTileCount, verticalTileCount) {
		this.#fps = fps;
		const texture = spriteSheetTexture.clone();
		texture.needsUpdate = true;
		texture.wrapS = texture.wrapT = RepeatWrapping;
		this.#horizontalTileCount = horizontalTileCount;
		this.#verticalTileCount = verticalTileCount;
		texture.repeat.set(0.25, 0.25);

		const spriteMaterial = new SpriteMaterial({ map: texture, color: 0xffffff });
		this.#sprite = new Sprite(spriteMaterial);
		this.#sprite.scale.set(50, 50, 1);
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

		const currentFrame = Math.floor(this.#elapsedTime * this.#fps);
		const frameCount = this.#verticalTileCount * this.#horizontalTileCount;
		if (currentFrame >= frameCount) {
			this.#sprite.visible = false;
		} else {
			const horizontalTileIndex = currentFrame % this.#horizontalTileCount;
			const verticalTileIndex = Math.floor(currentFrame / this.#horizontalTileCount);
			const texture = this.#sprite.material.map;
			texture.offset.setX(horizontalTileIndex / this.#horizontalTileCount);
			const offsetY = 1 - 1 / this.#verticalTileCount - verticalTileIndex / this.#verticalTileCount;
			console.log(offsetY);
			texture.offset.setY(offsetY);
		}
	}
}
