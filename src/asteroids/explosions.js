import { Sprite, RepeatWrapping, SpriteMaterial, AdditiveBlending } from "three";

const spriteCount = 20;
// https://sfxr.me/#7BMHBGBrvPrKMz7vdnH2arTppbTGtPrik6ypYCJazirRsGBVeid2uaLtz37CSy69ZJjGJ7C8h9NjU1LRXtL5tgW9vaPUQvE92L3q7UfV4TSbUF1N2G3urTRqZ
// https://sfxr.me/#7BMHBGBrvPrKMz7vdnH2arSxENYbWUNps8g7nqouBB9smtxAq2PYYsVoa5sjrzVZo7VNpDFNrSQTNtinkTFut1aGJnuigdFUTrtf7aaih5chRw6UQ5bBqVNz3
const explosionAudios = [
	new Audio("./assets/audio/explosion-3.wav"),
	new Audio("./assets/audio/explosion-4.wav"),
	new Audio("./assets/audio/explosion-3.wav"),
	new Audio("./assets/audio/explosion-4.wav"),
];
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

	explode(position, scale) {
		const sprite = this.#sprites[this.#nextSpriteIndex % this.#sprites.length];
		sprite.restart();
		const threeJsSprite = sprite.getObject3d();
		threeJsSprite.position.copy(position);
		threeJsSprite.scale.set(scale, scale, 1);
		this.#nextSpriteIndex++;
		explosionAudios[this.#nextSpriteIndex % explosionAudios.length].play();
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
		texture.repeat.set(1 / this.#horizontalTileCount, 1 / this.#verticalTileCount);

		const spriteMaterial = new SpriteMaterial({
			map: texture,
			alphaMap: texture,
			blending: AdditiveBlending,
			color: 0xffffff,
		});
		this.#sprite = new Sprite(spriteMaterial);
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
			texture.offset.setY(-(1 + verticalTileIndex) / this.#verticalTileCount);
		}
	}
}
