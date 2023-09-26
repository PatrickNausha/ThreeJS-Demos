var e="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{},i={},t={},n=e.parcelRequire1287;null==n&&((n=function(e){if(e in i)return i[e].exports;if(e in t){var n=t[e];delete t[e];var o={id:e,exports:{}};return i[e]=o,n.call(o.exports,o,o.exports),o.exports}var a=Error("Cannot find module '"+e+"'");throw a.code="MODULE_NOT_FOUND",a}).register=function(e,i){t[e]=i},e.parcelRequire1287=n);var o=n("eq1Fs"),a=n("dJCPM"),r=n("eOHOW"),l={};l=function(){"use strict";var e=function(){var i=0,t=document.createElement("div");function n(e){return t.appendChild(e.dom),e}function o(e){for(var n=0;n<t.children.length;n++)t.children[n].style.display=n===e?"block":"none";i=e}t.style.cssText="position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000",t.addEventListener("click",function(e){e.preventDefault(),o(++i%t.children.length)},!1);var a=(performance||Date).now(),r=a,l=0,s=n(new e.Panel("FPS","#0ff","#002")),d=n(new e.Panel("MS","#0f0","#020"));if(self.performance&&self.performance.memory)var f=n(new e.Panel("MB","#f08","#201"));return o(0),{REVISION:16,dom:t,addPanel:n,showPanel:o,begin:function(){a=(performance||Date).now()},end:function(){l++;var e=(performance||Date).now();if(d.update(e-a,200),r+1e3<=e&&(s.update(1e3*l/(e-r),100),r=e,l=0,f)){var i=performance.memory;f.update(i.usedJSHeapSize/1048576,i.jsHeapSizeLimit/1048576)}return e},update:function(){a=this.end()},domElement:t,setMode:o}};return e.Panel=function(e,i,t){var n=1/0,o=0,a=Math.round,r=a(window.devicePixelRatio||1),l=80*r,s=48*r,d=3*r,f=2*r,c=3*r,u=15*r,g=74*r,m=30*r,p=document.createElement("canvas");p.width=l,p.height=s,p.style.cssText="width:80px;height:48px";var h=p.getContext("2d");return h.font="bold "+9*r+"px Helvetica,Arial,sans-serif",h.textBaseline="top",h.fillStyle=t,h.fillRect(0,0,l,s),h.fillStyle=i,h.fillText(e,d,f),h.fillRect(c,u,g,m),h.fillStyle=t,h.globalAlpha=.9,h.fillRect(c,u,g,m),{dom:p,update:function(s,v){n=Math.min(n,s),o=Math.max(o,s),h.fillStyle=t,h.globalAlpha=1,h.fillRect(0,0,l,u),h.fillStyle=i,h.fillText(a(s)+" "+e+" ("+a(n)+"-"+a(o)+")",d,f),h.drawImage(p,c+r,u,g-r,m,c,u,g-r,m),h.fillRect(c+g-r,u,r,m),h.fillStyle=t,h.globalAlpha=.9,h.fillRect(c+g-r,u,r,a((1-s/v)*m))}}},e}();const s=new(function(e){return e&&e.__esModule?e.default:e}(l));s.showPanel(0);let d=!1;var f=n("6myVj"),c=n("4sCc1"),u=n("2qo6t"),g=n("ho3l0"),m=n("eaG5h");const p=new o.WebGLRenderer,h=window.devicePixelRatio||1,v=new o.Color(.07,.07,.15);p.setPixelRatio(h),p.setClearColor(v),p.setSize(window.innerWidth,window.innerHeight),document.body.appendChild(p.domElement);const w=new o.Scene,y=new o.PerspectiveCamera(50,window.innerWidth/window.innerHeight,.1,1e3);y.position.x=0,y.position.y=2,y.position.z=10,new r.OrbitControls(y,p.domElement);const S={time:{value:1},scanLineScale:{value:1/h},scanLineIntensity:{value:.75},color:{value:new o.Vector3(.07,.07,.15)},lightingIntensity:{value:3.5},filmGrainIntensity:{value:.15},resolution:{value:new o.Vector2(window.innerWidth*h,window.innerHeight*h)},opacity:{value:.8},opacityJitterStrength:{value:.05},opacityJitterSpeed:{value:40},smoothStepLighting:{value:!0},exposure:{value:2},wiggleStrength:{value:2},wigglePeriod:{value:3},wiggleDuration:{value:.1}},x=new o.ShaderMaterial({transparent:!0,uniforms:S,vertexShader:`
		varying vec3 vNormal;
		uniform mat4 inverseViewMatrix;
		uniform float time;
		uniform float wiggleStrength;
		uniform float wigglePeriod;
		uniform float wiggleDuration;

		void main()
		{
			vNormal = normal;
			float viewSpaceY = (modelViewMatrix * vec4(position, 1.0)).y;
			float wiggleFactor = 0.0;
			if (fract(time / wigglePeriod) > 1.0 - wiggleDuration) {
				wiggleFactor = wiggleStrength;
			}

			float jitterScale = 25.0;
			float jitterSpeed = 80.0;
			float x = viewSpaceY * jitterScale + time * jitterSpeed;
			vec4 noiseShift = inverseViewMatrix * vec4(wiggleFactor * sin(x / 3.0) * sin(x / 13.0), 0.0, 0.0, 0.0);
			vec3 shiftedPosition = noiseShift.xyz / 7.0 + position;
			vec4 mvPosition = modelViewMatrix * vec4(shiftedPosition, 1.0);
			gl_Position = projectionMatrix * mvPosition;
		}`,fragmentShader:`
		#define PI 3.141592653589793
		uniform float scanLineScale;
		uniform float scanLineIntensity;
		uniform float filmGrainIntensity;
		uniform float time;
		uniform float exposure;
		uniform vec3 color;
		uniform float opacity;
		uniform vec2 resolution;
		uniform float lightingIntensity;
		uniform bool smoothStepLighting;
		uniform float opacityJitterStrength;
		uniform float opacityJitterSpeed;
		varying vec3 vNormal;	// Interpolated Normal vector passed in from vertex shader

		// Psuedo-random generator from https://thebookofshaders.com/10/
		float random(vec2 st) {
			return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
		}

		float getVerticalNoise(float verticalNoiseFrameRate, float verticalNoiseSpeed, float verticalNoiseScale) {
			float v = gl_FragCoord.y / resolution.y * verticalNoiseScale;
			float theta = (v + floor(time * verticalNoiseFrameRate) * verticalNoiseSpeed);
			float verticalNoiseStrength = 1.5;
			return pow(100.0, sin(theta) * sin(theta / 3.0) * sin(theta / 13.0)) / 100.0 * verticalNoiseStrength;
		}

		void main() {
			// Some basic Lambertian-ish reflectance.
			vec3 lightDirection = normalize(vec3(0.7, 0.5, 1.0));
			float diffuse = max(dot(vNormal, lightDirection), 0.0);
			if (smoothStepLighting)
				diffuse = smoothstep(0.0, 1.0, diffuse);
			diffuse *= lightingIntensity;

			// Use a "spikey" sine equation shifted by time for some moving glowing noise bars.

			float scanLineMultiplier = mix(1.0 - scanLineIntensity, 1.0, abs(sin(gl_FragCoord.y * scanLineScale * PI * 0.25)));

			float verticalNoise = getVerticalNoise(12.0, 2.0, 80.0) + getVerticalNoise(8.0, 1.0, 26.0);

			float brightness = diffuse + verticalNoise;
			
			float filmGrain = (2.0 * random(gl_FragCoord.xy / resolution + fract(time)) - 1.0) * filmGrainIntensity;

			vec3 fragColor = ((mix(color.xyz, vec3(0.1, 0.2, 1.0), brightness) * exposure) + filmGrain) * scanLineMultiplier;

			float theta = time * opacityJitterSpeed;
			float opacityJitter = (sin(theta) / 2.0 + 1.0) * opacityJitterStrength;
			gl_FragColor = vec4(fragColor, opacity - opacityJitter);
		}
	`}),C=new o.Mesh(new o.BoxGeometry(2,2,2,20,20,20),x);C.position.x=-4,w.add(C);const P=new o.Mesh(new o.SphereGeometry(1.2,22,22),x);w.add(P);const b=new o.Mesh(new o.TorusKnotGeometry(1,.34,128,16),x);b.position.x=4,w.add(b),(d=!d)?document.body.appendChild(s.dom):s.dom.remove();const I=new f.EffectComposer(p);I.setSize(window.innerWidth,window.innerHeight);const N=new u.RenderPass(w,y);I.addPass(N);const L=new c.UnrealBloomPass(new o.Vector2(window.innerWidth,window.innerHeight),.5,1,.2);I.addPass(L);const M=new g.ShaderPass(m.FXAAShader),F=p.getPixelRatio();M.material.uniforms.resolution.value.x=1/(window.innerWidth*F),M.material.uniforms.resolution.value.y=1/(window.innerHeight*F),I.addPass(M);const J=new a.GUI,R={bloom:L.enabled,"Anti-aliasing":M.enabled,Opacity:S.opacity.value},W={"Film grain":S.filmGrainIntensity.value,Jitter:S.opacityJitterStrength.value,"Jitter speed":S.opacityJitterSpeed.value,"Wiggle strength":S.wiggleStrength.value,"Wiggle period":S.wigglePeriod.value,"Wiggle duration":S.wiggleDuration.value},G=J.addFolder("Noise");G.add(W,"Film grain",0,1).onChange(e=>{x.uniforms.filmGrainIntensity.value=e}),G.add(W,"Jitter",0,1).onChange(e=>{x.uniforms.opacityJitterStrength.value=e}),G.add(W,"Jitter speed",0,100).onChange(e=>{x.uniforms.opacityJitterSpeed.value=e}),G.add(W,"Wiggle strength",0,10).onChange(e=>{S.wiggleStrength.value=e}),G.add(W,"Wiggle period",0,10).onChange(e=>{S.wigglePeriod.value=e}),G.add(W,"Wiggle duration",0,1).onChange(e=>{S.wiggleDuration.value=e}),G.open();const D={Intensity:S.lightingIntensity.value,Exposure:S.exposure.value,"Smooth step":S.smoothStepLighting.value},V=J.addFolder("Lighting");V.add(D,"Intensity",0,10).onChange(e=>{x.uniforms.lightingIntensity.value=e}),V.add(D,"Exposure",0,10).onChange(e=>{x.uniforms.exposure.value=e}),V.add(D,"Smooth step").onChange(e=>{x.uniforms.smoothStepLighting.value=e}),V.open(),J.add(R,"Opacity",0,1).onChange(e=>{x.uniforms.opacity.value=e}),J.add(R,"bloom").onChange(e=>{L.enabled=e}),J.add(R,"Anti-aliasing").onChange(e=>{M.enabled=e});const E={Scale:S.scanLineScale.value,Intensity:S.scanLineIntensity.value},z=J.addFolder("Scanlines");z.add(E,"Scale",0,2).onChange(e=>{x.uniforms.scanLineScale.value=e}),z.add(E,"Intensity",0,1).onChange(e=>{x.uniforms.scanLineIntensity.value=e});let A=!1;!function e(i){A=A||window.confirm("WARNING. This example may potentially trigger seizures for people with photosensitive epilepsy."),S.inverseViewMatrix={value:y.matrixWorld},S.time.value=i/1e3,requestAnimationFrame(e),A&&I.render(w,y),s.update()}();
//# sourceMappingURL=hologram.7e92630d.js.map
