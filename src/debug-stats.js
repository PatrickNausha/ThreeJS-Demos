import Stats from "stats-js";

const stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom

export function updateStats() {
	stats.update();
}

let showStats = false;
export function toggleStats() {
	showStats = !showStats;
	if (showStats) {
		document.body.appendChild(stats.dom);
	} else {
		stats.dom.remove();
	}
}
