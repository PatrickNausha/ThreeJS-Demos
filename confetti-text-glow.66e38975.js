function e(e,o,n,t){Object.defineProperty(e,o,{get:n,set:t,enumerable:!0,configurable:!0})}var o="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{},n={},t={},i=o.parcelRequire1287;null==i&&((i=function(e){if(e in n)return n[e].exports;if(e in t){var o=t[e];delete t[e];var i={id:e,exports:{}};return n[e]=i,o.call(i.exports,i,i.exports),i.exports}var r=new Error("Cannot find module '"+e+"'");throw r.code="MODULE_NOT_FOUND",r}).register=function(e,o){t[e]=o},o.parcelRequire1287=i),i.register("l7X95",(function(o,n){e(o.exports,"slamItOnTheGround",(function(){return r})),e(o.exports,"makeCentered",(function(){return u}));var t=i("eq1Fs");function r(e,o,n,t=0){e.geometry.boundingBox||e.geometry.computeBoundingBox(),e.position.x=o,e.position.y=t-e.geometry.boundingBox.min.y,e.position.z=n}function u(e){e.geometry.boundingBox||e.geometry.computeBoundingBox(),e.position.x=-e.geometry.boundingBox.getSize(new t.Vector3).x/2,e.position.y=-e.geometry.boundingBox.getSize(new t.Vector3).y/2,e.position.z=-e.geometry.boundingBox.getSize(new t.Vector3).z/2}}));
//# sourceMappingURL=confetti-text-glow.66e38975.js.map