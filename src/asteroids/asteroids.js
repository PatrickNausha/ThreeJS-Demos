import { Vector3 } from "three";

const asteroidRadius = 10;

let asteroids = [];
export function createAsteroids(asteroidGltf, movables, scene) {
	const asteroidCount = 5;
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

export function detectBulletCollisions(bulletPosition) {
	const collisions = [];
	for (const asteroid of asteroids) {
		if (bulletPosition.distanceTo(asteroid.position) < asteroidRadius) {
			collisions.push(asteroid);
		}
	}
	return collisions;
}
