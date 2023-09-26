!function(){var e,i,t="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{},n={},o={},a=t.parcelRequire1287;null==a&&((a=function(e){if(e in n)return n[e].exports;if(e in o){var i=o[e];delete o[e];var t={id:e,exports:{}};return n[e]=t,i.call(t.exports,t,t.exports),t.exports}var a=Error("Cannot find module '"+e+"'");throw a.code="MODULE_NOT_FOUND",a}).register=function(e,i){o[e]=i},t.parcelRequire1287=a);var l=a("6OvZu"),r=a("dUO1w"),s=a("3bF5H"),d={};(e=function(){var i=0,t=document.createElement("div");function n(e){return t.appendChild(e.dom),e}function o(e){for(var n=0;n<t.children.length;n++)t.children[n].style.display=n===e?"block":"none";i=e}t.style.cssText="position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000",t.addEventListener("click",function(e){e.preventDefault(),o(++i%t.children.length)},!1);var a=(performance||Date).now(),l=a,r=0,s=n(new e.Panel("FPS","#0ff","#002")),d=n(new e.Panel("MS","#0f0","#020"));if(self.performance&&self.performance.memory)var f=n(new e.Panel("MB","#f08","#201"));return o(0),{REVISION:16,dom:t,addPanel:n,showPanel:o,begin:function(){a=(performance||Date).now()},end:function(){r++;var e=(performance||Date).now();if(d.update(e-a,200),l+1e3<=e&&(s.update(1e3*r/(e-l),100),l=e,r=0,f)){var i=performance.memory;f.update(i.usedJSHeapSize/1048576,i.jsHeapSizeLimit/1048576)}return e},update:function(){a=this.end()},domElement:t,setMode:o}}).Panel=function(e,i,t){var n=1/0,o=0,a=Math.round,l=a(window.devicePixelRatio||1),r=80*l,s=48*l,d=3*l,f=2*l,g=3*l,u=15*l,c=74*l,m=30*l,p=document.createElement("canvas");p.width=r,p.height=s,p.style.cssText="width:80px;height:48px";var h=p.getContext("2d");return h.font="bold "+9*l+"px Helvetica,Arial,sans-serif",h.textBaseline="top",h.fillStyle=t,h.fillRect(0,0,r,s),h.fillStyle=i,h.fillText(e,d,f),h.fillRect(g,u,c,m),h.fillStyle=t,h.globalAlpha=.9,h.fillRect(g,u,c,m),{dom:p,update:function(s,v){n=Math.min(n,s),o=Math.max(o,s),h.fillStyle=t,h.globalAlpha=1,h.fillRect(0,0,r,u),h.fillStyle=i,h.fillText(a(s)+" "+e+" ("+a(n)+"-"+a(o)+")",d,f),h.drawImage(p,g+l,u,c-l,m,g,u,c-l,m),h.fillRect(g+c-l,u,l,m),h.fillStyle=t,h.globalAlpha=.9,h.fillRect(g+c-l,u,l,a((1-s/v)*m))}}},d=e;let f=new((i=d)&&i.__esModule?i.default:i);f.showPanel(0);let g=!1;var u=a("8MWs4"),c=a("8aNI6"),m=a("8uPQJ"),p=a("gy7bn"),h=a("74wVM");let v=new l.WebGLRenderer,w=window.devicePixelRatio||1,y=new l.Color(.07,.07,.15);v.setPixelRatio(w),v.setClearColor(y),v.setSize(window.innerWidth,window.innerHeight),document.body.appendChild(v.domElement);let S=new l.Scene,x=new l.PerspectiveCamera(50,window.innerWidth/window.innerHeight,.1,1e3);x.position.x=0,x.position.y=2,x.position.z=10,new s.OrbitControls(x,v.domElement);let P={time:{value:1},scanLineScale:{value:1/w},scanLineIntensity:{value:.75},color:{value:new l.Vector3(.07,.07,.15)},lightingIntensity:{value:3.5},filmGrainIntensity:{value:.15},resolution:{value:new l.Vector2(window.innerWidth*w,window.innerHeight*w)},opacity:{value:.8},opacityJitterStrength:{value:.05},opacityJitterSpeed:{value:40},smoothStepLighting:{value:!0},exposure:{value:2},wiggleStrength:{value:2},wigglePeriod:{value:3},wiggleDuration:{value:.1}},b=new l.ShaderMaterial({transparent:!0,uniforms:P,vertexShader:`
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
	`}),C=new l.Mesh(new l.BoxGeometry(2,2,2,20,20,20),b);C.position.x=-4,S.add(C);let I=new l.Mesh(new l.SphereGeometry(1.2,22,22),b);S.add(I);let N=new l.Mesh(new l.TorusKnotGeometry(1,.34,128,16),b);N.position.x=4,S.add(N),(g=!g)?document.body.appendChild(f.dom):f.dom.remove();let L=new u.EffectComposer(v);L.setSize(window.innerWidth,window.innerHeight);let M=new m.RenderPass(S,x);L.addPass(M);let F=new c.UnrealBloomPass(new l.Vector2(window.innerWidth,window.innerHeight),.5,1,.2);L.addPass(F);let J=new p.ShaderPass(h.FXAAShader),R=v.getPixelRatio();J.material.uniforms.resolution.value.x=1/(window.innerWidth*R),J.material.uniforms.resolution.value.y=1/(window.innerHeight*R),L.addPass(J);let W=new r.GUI,D={bloom:F.enabled,"Anti-aliasing":J.enabled,Opacity:P.opacity.value},G={"Film grain":P.filmGrainIntensity.value,Jitter:P.opacityJitterStrength.value,"Jitter speed":P.opacityJitterSpeed.value,"Wiggle strength":P.wiggleStrength.value,"Wiggle period":P.wigglePeriod.value,"Wiggle duration":P.wiggleDuration.value},V=W.addFolder("Noise");V.add(G,"Film grain",0,1).onChange(e=>{b.uniforms.filmGrainIntensity.value=e}),V.add(G,"Jitter",0,1).onChange(e=>{b.uniforms.opacityJitterStrength.value=e}),V.add(G,"Jitter speed",0,100).onChange(e=>{b.uniforms.opacityJitterSpeed.value=e}),V.add(G,"Wiggle strength",0,10).onChange(e=>{P.wiggleStrength.value=e}),V.add(G,"Wiggle period",0,10).onChange(e=>{P.wigglePeriod.value=e}),V.add(G,"Wiggle duration",0,1).onChange(e=>{P.wiggleDuration.value=e}),V.open();let E={Intensity:P.lightingIntensity.value,Exposure:P.exposure.value,"Smooth step":P.smoothStepLighting.value},z=W.addFolder("Lighting");z.add(E,"Intensity",0,10).onChange(e=>{b.uniforms.lightingIntensity.value=e}),z.add(E,"Exposure",0,10).onChange(e=>{b.uniforms.exposure.value=e}),z.add(E,"Smooth step").onChange(e=>{b.uniforms.smoothStepLighting.value=e}),z.open(),W.add(D,"Opacity",0,1).onChange(e=>{b.uniforms.opacity.value=e}),W.add(D,"bloom").onChange(e=>{F.enabled=e}),W.add(D,"Anti-aliasing").onChange(e=>{J.enabled=e});let A={Scale:P.scanLineScale.value,Intensity:P.scanLineIntensity.value},H=W.addFolder("Scanlines");H.add(A,"Scale",0,2).onChange(e=>{b.uniforms.scanLineScale.value=e}),H.add(A,"Intensity",0,1).onChange(e=>{b.uniforms.scanLineIntensity.value=e});let O=!1;!function e(i){O=O||window.confirm("WARNING. This example may potentially trigger seizures for people with photosensitive epilepsy."),P.inverseViewMatrix={value:x.matrixWorld},P.time.value=i/1e3,requestAnimationFrame(e),O&&L.render(S,x),f.update()}()}();
//# sourceMappingURL=hologram.a5449939.js.map
