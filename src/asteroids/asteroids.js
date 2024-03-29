import { Raycaster, Vector3 } from "three";

const asteroidRadius = 10;

let asteroids = [];

let largeAsteroids = [];

let currentSmallAsteroid = 0;
let smallAsteroids = [];

let currentSmallerAsteroid = 0;
let smallerAsteroids = [];
export function createAsteroids(asteroidGltf, movables, scene) {
	const largeAsteroidCount = 6;
	const smallAsteroidCount = largeAsteroidCount * 2;
	const smallerAsteroidCount = smallAsteroidCount * 2;
	const largeAsteroidMeshes = asteroidGltf.scene.children.filter(({ userData }) =>
		userData.name.startsWith("asteroid-large-")
	);
	const smallAsteroidMeshes = asteroidGltf.scene.children.filter(({ userData }) =>
		userData.name.startsWith("asteroid-small-")
	);
	const smallerAsteroidMeshes = asteroidGltf.scene.children.filter(({ userData }) =>
		userData.name.startsWith("asteroid-smaller-")
	);
	largeAsteroids = Array.from({ length: largeAsteroidCount }).map((_, index) => {
		const asteroidMeshCopy = largeAsteroidMeshes[index % largeAsteroidMeshes.length].clone();

		scene.add(asteroidMeshCopy);
		asteroidMeshCopy.visible = false;
		const velocity = new Vector3(20, 0, 0);
		velocity.applyAxisAngle(new Vector3(0, 0, 1), 2 * Math.PI * Math.random());
		movables.add(
			asteroidMeshCopy,
			velocity,
			new Vector3(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1),
			true
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
			new Vector3(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1),
			true
		);
		return asteroidMeshCopy;
	});
	smallerAsteroids = Array.from({ length: smallerAsteroidCount }).map((_, index) => {
		const asteroidMeshCopy = smallerAsteroidMeshes[index % smallerAsteroidMeshes.length].clone();

		scene.add(asteroidMeshCopy);
		asteroidMeshCopy.visible = false;
		movables.add(
			asteroidMeshCopy,
			new Vector3(0, 0, 0),
			new Vector3(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1),
			true
		);
		return asteroidMeshCopy;
	});
	asteroids = [...smallerAsteroids, ...smallAsteroids, ...largeAsteroids];
}

export function areAnyAsteroidsLeft() {
	return asteroids.some((asteroid) => asteroid.visible);
}

export function resetAsteroids(areaBounds) {
	const gameAreaWidthMeters = areaBounds.right - areaBounds.left;
	const gameAreaHeightMeters = areaBounds.top - areaBounds.bottom;
	for (const asteroid of largeAsteroids) {
		asteroid.visible = true;
		const startLocations = [
			// Top of screen
			[(Math.random() - 0.5) * gameAreaWidthMeters, areaBounds.top],
			// Bottom of screen
			[(Math.random() - 0.5) * gameAreaWidthMeters, areaBounds.bottom],
			// Left of screen
			[areaBounds.left, (Math.random() - 0.5) * gameAreaHeightMeters],
			// Right of screen
			[areaBounds.right, (Math.random() - 0.5) * gameAreaHeightMeters],
		];
		const startLocation = startLocations[Math.floor(Math.random() * startLocations.length)];
		asteroid.position.set(startLocation[0], startLocation[1], 0);
	}

	for (const asteroid of [...smallAsteroids, ...smallerAsteroids]) {
		asteroid.visible = false;
	}
}

export const asteroidSizeLarge = 0;
export const asteroidSizeSmall = 1;
export const asteroidSizeSmaller = 2;
export function explodeAsteroid(asteroid, movables) {
	asteroid.visible = false;
	if (largeAsteroids.includes(asteroid)) {
		emitSmallAsteroid(asteroid.position.clone(), movables);
		emitSmallAsteroid(asteroid.position.clone(), movables);
		return asteroidSizeLarge;
	} else if (smallAsteroids.includes(asteroid)) {
		emitSmallerAsteroid(asteroid.position.clone(), movables);
		emitSmallerAsteroid(asteroid.position.clone(), movables);
		return asteroidSizeSmall;
	}
	return asteroidSizeSmaller;
}

export function detectSpaceCraftCollision(raycasters) {
	const visibleAsteroids = asteroids.filter(({ visible }) => visible);
	const rayCollisions = raycasters.flatMap((raycaster) => {
		const nearAsteroids = visibleAsteroids.filter(
			({ position }) => raycaster.ray.origin.distanceTo(position) < maxAsteroidSize
		);
		return raycaster.intersectObjects(nearAsteroids);
	});
	return rayCollisions.length > 0;
}

const maxAsteroidSize = 20;
export function detectBulletCollisions(bulletPosition, bulletVelocity) {
	const visibleAsteroids = asteroids.filter(({ visible }) => visible);
	const nearAsteroids = visibleAsteroids.filter(
		({ position }) => bulletPosition.distanceTo(position) < maxAsteroidSize
	);
	const direction = bulletVelocity.clone().normalize();
	const origin = new Vector3().subVectors(bulletPosition, direction);
	const ray = new Raycaster(origin, direction, 0, 2);
	const collisionResults = ray.intersectObjects(nearAsteroids);
	return collisionResults;
}

function emitSmallAsteroid(position, movables) {
	const asteroid = smallAsteroids[currentSmallAsteroid % smallAsteroids.length];
	currentSmallAsteroid++;
	asteroid.visible = true;
	asteroid.position.copy(position);
	const velocity = new Vector3(30, 0, 0);
	velocity.applyAxisAngle(new Vector3(0, 0, 1), 2 * Math.PI * Math.random());
	movables.setVelocity(asteroid, velocity);
}

function emitSmallerAsteroid(position, movables) {
	const asteroid = smallerAsteroids[currentSmallerAsteroid % smallerAsteroids.length];
	currentSmallerAsteroid++;
	asteroid.visible = true;
	asteroid.position.copy(position);
	const velocity = new Vector3(40, 0, 0);
	velocity.applyAxisAngle(new Vector3(0, 0, 1), 2 * Math.PI * Math.random());
	movables.setVelocity(asteroid, velocity);
}
