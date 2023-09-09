import { Vector3 } from "three";

// TODO:
// * Import little asteroids.
// * Make big roids explode into little ones.
// * Add explosion effect.

const asteroidRadius = 10;

let asteroids = [];

let currentSmallAsteroid = 0;
let smallAsteroids = [];
export function createAsteroids(asteroidGltf, movables, scene) {
	const asteroidCount = 15;
	asteroids = Array.from({ length: asteroidCount }).map(() => {
		const asteroidMeshCopy = asteroidGltf.scene.children[0].clone();

		scene.add(asteroidMeshCopy);
		movables.add(
			asteroidMeshCopy,
			new Vector3(0, 0, 0),
			new Vector3(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1)
		);
		return asteroidMeshCopy;
	});
	smallAsteroids = asteroids.slice(-5);
	for (const smallAsteroid of smallAsteroids) {
		smallAsteroid.visible = false;
	}
}

export function resetAsteroids(gameAreaWidthMeters, gameAreaHeightMeters) {
	for (const asteroid of asteroids) {
		asteroid.position.set(
			Math.random() * gameAreaWidthMeters - gameAreaWidthMeters / 2,
			Math.random() * gameAreaHeightMeters - gameAreaHeightMeters / 2,
			0
		);
	}
}

export function explodeAsteroid(asteroid) {
	asteroid.visible = false;
	if (!smallAsteroids.includes(asteroid)) {
		emitSmallAsteroid(asteroid.position.clone());
		emitSmallAsteroid(asteroid.position.clone());
	}
}

export function emitSmallAsteroid(position) {
	const smallAsteroid = smallAsteroids[currentSmallAsteroid % smallAsteroids.length];
	currentSmallAsteroid++;
	smallAsteroid.visible = true;
	smallAsteroid.position.copy(position);
}

export function detectBulletCollisions(bulletPosition) {
	const collisions = [];
	for (const asteroid of asteroids.filter(({ visible }) => visible)) {
		if (bulletPosition.distanceTo(asteroid.position) < asteroidRadius) {
			collisions.push(asteroid);
		}
	}
	return collisions;
}
