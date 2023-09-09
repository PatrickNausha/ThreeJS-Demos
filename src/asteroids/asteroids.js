import { Vector3 } from "three";

// TODO:
// * Import little asteroids.
// * Make big roids explode into little ones.
// * Add explosion effect.

const asteroidRadius = 10;

let asteroids = [];

let currentSmallAsteroid = 0;
let largeAsteroids = [];
let smallAsteroids = [];
export function createAsteroids(asteroidGltf, movables, scene) {
	const largeAsteroidCount = 7;
	const smallAsteroidCount = largeAsteroidCount * 2;
	const largeAsteroidMeshes = asteroidGltf.scene.children.filter(({ userData }) =>
		userData.name.startsWith("asteroid-large-")
	);
	const smallAsteroidMeshes = asteroidGltf.scene.children.filter(({ userData }) =>
		userData.name.startsWith("asteroid-small-")
	);
	largeAsteroids = Array.from({ length: largeAsteroidCount }).map((_, index) => {
		const asteroidMeshCopy = largeAsteroidMeshes[index % largeAsteroidMeshes.length].clone();

		scene.add(asteroidMeshCopy);
		movables.add(
			asteroidMeshCopy,
			new Vector3(0, 0, 0),
			new Vector3(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1)
		);
		return asteroidMeshCopy;
	});
	smallAsteroids = Array.from({ length: smallAsteroidCount }).map((_, index) => {
		const asteroidMeshCopy = smallAsteroidMeshes[index % smallAsteroidMeshes.length].clone();

		scene.add(asteroidMeshCopy);
		asteroidMeshCopy.visible = false;
		movables.add(
			asteroidMeshCopy,
			new Vector3(0, 0, 0),
			new Vector3(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1)
		);
		return asteroidMeshCopy;
	});
	asteroids = [...smallAsteroids, ...largeAsteroids];
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

export function explodeAsteroid(asteroid, movables) {
	asteroid.visible = false;
	if (!smallAsteroids.includes(asteroid)) {
		emitSmallAsteroid(asteroid.position.clone(), movables);
		emitSmallAsteroid(asteroid.position.clone(), movables);
	}
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

function emitSmallAsteroid(position, movables) {
	const smallAsteroid = smallAsteroids[currentSmallAsteroid % smallAsteroids.length];
	currentSmallAsteroid++;
	smallAsteroid.visible = true;
	smallAsteroid.position.copy(position);
	const velocity = new Vector3(20, 0, 0);
	velocity.applyAxisAngle(new Vector3(0, 0, 1), 2 * Math.PI * Math.random());
	movables.setVelocity(smallAsteroid, velocity);
}
