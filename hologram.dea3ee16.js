let e;var i="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{},t={},n={},o=i.parcelRequire1287;null==o&&((o=function(e){if(e in t)return t[e].exports;if(e in n){var i=n[e];delete n[e];var o={id:e,exports:{}};return t[e]=o,i.call(o.exports,o,o.exports),o.exports}var a=Error("Cannot find module '"+e+"'");throw a.code="MODULE_NOT_FOUND",a}).register=function(e,i){n[e]=i},i.parcelRequire1287=o);var a=o("eq1Fs"),r=o("dJCPM"),l=o("eOHOW"),s={};s=function(){"use strict";var e=function(){var i=0,t=document.createElement("div");function n(e){return t.appendChild(e.dom),e}function o(e){for(var n=0;n<t.children.length;n++)t.children[n].style.display=n===e?"block":"none";i=e}t.style.cssText="position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000",t.addEventListener("click",function(e){e.preventDefault(),o(++i%t.children.length)},!1);var a=(performance||Date).now(),r=a,l=0,s=n(new e.Panel("FPS","#0ff","#002")),d=n(new e.Panel("MS","#0f0","#020"));if(self.performance&&self.performance.memory)var c=n(new e.Panel("MB","#f08","#201"));return o(0),{REVISION:16,dom:t,addPanel:n,showPanel:o,begin:function(){a=(performance||Date).now()},end:function(){l++;var e=(performance||Date).now();if(d.update(e-a,200),r+1e3<=e&&(s.update(1e3*l/(e-r),100),r=e,l=0,c)){var i=performance.memory;c.update(i.usedJSHeapSize/1048576,i.jsHeapSizeLimit/1048576)}return e},update:function(){a=this.end()},domElement:t,setMode:o}};return e.Panel=function(e,i,t){var n=1/0,o=0,a=Math.round,r=a(window.devicePixelRatio||1),l=80*r,s=48*r,d=3*r,c=2*r,f=3*r,u=15*r,g=74*r,m=30*r,p=document.createElement("canvas");p.width=l,p.height=s,p.style.cssText="width:80px;height:48px";var h=p.getContext("2d");return h.font="bold "+9*r+"px Helvetica,Arial,sans-serif",h.textBaseline="top",h.fillStyle=t,h.fillRect(0,0,l,s),h.fillStyle=i,h.fillText(e,d,c),h.fillRect(f,u,g,m),h.fillStyle=t,h.globalAlpha=.9,h.fillRect(f,u,g,m),{dom:p,update:function(s,v){n=Math.min(n,s),o=Math.max(o,s),h.fillStyle=t,h.globalAlpha=1,h.fillRect(0,0,l,u),h.fillStyle=i,h.fillText(a(s)+" "+e+" ("+a(n)+"-"+a(o)+")",d,c),h.drawImage(p,f+r,u,g-r,m,f,u,g-r,m),h.fillRect(f+g-r,u,r,m),h.fillStyle=t,h.globalAlpha=.9,h.fillRect(f+g-r,u,r,a((1-s/v)*m))}}},e}();const d=new(function(e){return e&&e.__esModule?e.default:e}(s));d.showPanel(0);let c=!1;var f=o("6myVj"),u=o("4sCc1"),g=o("2qo6t"),m=o("ho3l0"),p=o("eaG5h");const h=new a.WebGLRenderer,v=window.devicePixelRatio||1,w=new a.Color(.07,.07,.15);h.setPixelRatio(v),h.setClearColor(w),h.setSize(window.innerWidth,window.innerHeight),document.body.appendChild(h.domElement);const y=new a.Scene,S=new a.PerspectiveCamera(50,window.innerWidth/window.innerHeight,.1,1e3);S.position.x=0,S.position.y=2,S.position.z=10,new l.OrbitControls(S,h.domElement);const x={time:{value:1},scanLineScale:{value:1/v},scanLineIntensity:{value:.75},color:{value:new a.Vector3(.07,.07,.15)},lightingIntensity:{value:3.5},filmGrainIntensity:{value:.15},resolution:{value:new a.Vector2(window.innerWidth*v,window.innerHeight*v)},opacity:{value:.8},opacityJitterStrength:{value:.05},opacityJitterSpeed:{value:40},smoothStepLighting:{value:!0},exposure:{value:2},wiggleStrength:{value:2},wigglePeriod:{value:3},wiggleDuration:{value:.1}},C=new a.ShaderMaterial({transparent:!0,uniforms:x,vertexShader:`
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
	`}),P=new a.Mesh(new a.BoxGeometry(2,2,2,20,20,20),C);P.position.x=-4,y.add(P);const b=new a.Mesh(new a.SphereGeometry(1.2,22,22),C);y.add(b);const I=new a.Mesh(new a.TorusKnotGeometry(1,.34,128,16),C);I.position.x=4,y.add(I),(c=!c)?document.body.appendChild(d.dom):d.dom.remove();const L=new f.EffectComposer(h);L.setSize(window.innerWidth,window.innerHeight);const N=new g.RenderPass(y,S);L.addPass(N);const M=new u.UnrealBloomPass(new a.Vector2(window.innerWidth,window.innerHeight),.5,1,.2);L.addPass(M);const F=new m.ShaderPass(p.FXAAShader),J=h.getPixelRatio();F.material.uniforms.resolution.value.x=1/(window.innerWidth*J),F.material.uniforms.resolution.value.y=1/(window.innerHeight*J),L.addPass(F);const R=new r.GUI,W={bloom:M.enabled,"Anti-aliasing":F.enabled,Opacity:x.opacity.value},D={"Film grain":x.filmGrainIntensity.value,Jitter:x.opacityJitterStrength.value,"Jitter speed":x.opacityJitterSpeed.value,"Wiggle strength":x.wiggleStrength.value,"Wiggle period":x.wigglePeriod.value,"Wiggle duration":x.wiggleDuration.value},E=R.addFolder("Noise");E.add(D,"Film grain",0,1).onChange(e=>{C.uniforms.filmGrainIntensity.value=e}),E.add(D,"Jitter",0,1).onChange(e=>{C.uniforms.opacityJitterStrength.value=e}),E.add(D,"Jitter speed",0,100).onChange(e=>{C.uniforms.opacityJitterSpeed.value=e}),E.add(D,"Wiggle strength",0,10).onChange(e=>{x.wiggleStrength.value=e}),E.add(D,"Wiggle period",0,10).onChange(e=>{x.wigglePeriod.value=e}),E.add(D,"Wiggle duration",0,1).onChange(e=>{x.wiggleDuration.value=e}),E.open();const G={Intensity:x.lightingIntensity.value,Exposure:x.exposure.value,"Smooth step":x.smoothStepLighting.value},V=R.addFolder("Lighting");V.add(G,"Intensity",0,10).onChange(e=>{C.uniforms.lightingIntensity.value=e}),V.add(G,"Exposure",0,10).onChange(e=>{C.uniforms.exposure.value=e}),V.add(G,"Smooth step").onChange(e=>{C.uniforms.smoothStepLighting.value=e}),V.open(),R.add(W,"Opacity",0,1).onChange(e=>{C.uniforms.opacity.value=e}),R.add(W,"bloom").onChange(e=>{M.enabled=e}),R.add(W,"Anti-aliasing").onChange(e=>{F.enabled=e});const z={Scale:x.scanLineScale.value,Intensity:x.scanLineIntensity.value},H=R.addFolder("Scanlines");H.add(z,"Scale",0,2).onChange(e=>{C.uniforms.scanLineScale.value=e}),H.add(z,"Intensity",0,1).onChange(e=>{C.uniforms.scanLineIntensity.value=e}),function i(t){(e=null==e?window.confirm("Warning: This demo may potentially trigger seizures for people with photosensitive epilepsy. Click Cancel to Exit or OK to continue."):e)&&(x.inverseViewMatrix={value:S.matrixWorld},x.time.value=t/1e3,requestAnimationFrame(i),e&&L.render(y,S),d.update())}();
//# sourceMappingURL=hologram.dea3ee16.js.map
