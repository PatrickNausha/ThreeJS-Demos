!function(){let e;var i,t,n="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{},o={},a={},l=n.parcelRequire1287;null==l&&((l=function(e){if(e in o)return o[e].exports;if(e in a){var i=a[e];delete a[e];var t={id:e,exports:{}};return o[e]=t,i.call(t.exports,t,t.exports),t.exports}var n=Error("Cannot find module '"+e+"'");throw n.code="MODULE_NOT_FOUND",n}).register=function(e,i){a[e]=i},n.parcelRequire1287=l);var r=l("6OvZu"),s=l("dUO1w"),d=l("3bF5H"),f={};(i=function(){var e=0,t=document.createElement("div");function n(e){return t.appendChild(e.dom),e}function o(i){for(var n=0;n<t.children.length;n++)t.children[n].style.display=n===i?"block":"none";e=i}t.style.cssText="position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000",t.addEventListener("click",function(i){i.preventDefault(),o(++e%t.children.length)},!1);var a=(performance||Date).now(),l=a,r=0,s=n(new i.Panel("FPS","#0ff","#002")),d=n(new i.Panel("MS","#0f0","#020"));if(self.performance&&self.performance.memory)var f=n(new i.Panel("MB","#f08","#201"));return o(0),{REVISION:16,dom:t,addPanel:n,showPanel:o,begin:function(){a=(performance||Date).now()},end:function(){r++;var e=(performance||Date).now();if(d.update(e-a,200),l+1e3<=e&&(s.update(1e3*r/(e-l),100),l=e,r=0,f)){var i=performance.memory;f.update(i.usedJSHeapSize/1048576,i.jsHeapSizeLimit/1048576)}return e},update:function(){a=this.end()},domElement:t,setMode:o}}).Panel=function(e,i,t){var n=1/0,o=0,a=Math.round,l=a(window.devicePixelRatio||1),r=80*l,s=48*l,d=3*l,f=2*l,g=3*l,u=15*l,c=74*l,m=30*l,p=document.createElement("canvas");p.width=r,p.height=s,p.style.cssText="width:80px;height:48px";var h=p.getContext("2d");return h.font="bold "+9*l+"px Helvetica,Arial,sans-serif",h.textBaseline="top",h.fillStyle=t,h.fillRect(0,0,r,s),h.fillStyle=i,h.fillText(e,d,f),h.fillRect(g,u,c,m),h.fillStyle=t,h.globalAlpha=.9,h.fillRect(g,u,c,m),{dom:p,update:function(s,v){n=Math.min(n,s),o=Math.max(o,s),h.fillStyle=t,h.globalAlpha=1,h.fillRect(0,0,r,u),h.fillStyle=i,h.fillText(a(s)+" "+e+" ("+a(n)+"-"+a(o)+")",d,f),h.drawImage(p,g+l,u,c-l,m,g,u,c-l,m),h.fillRect(g+c-l,u,l,m),h.fillStyle=t,h.globalAlpha=.9,h.fillRect(g+c-l,u,l,a((1-s/v)*m))}}},f=i;let g=new((t=f)&&t.__esModule?t.default:t);g.showPanel(0);let u=!1;var c=l("8MWs4"),m=l("8aNI6"),p=l("8uPQJ"),h=l("gy7bn"),v=l("74wVM");let w=new r.WebGLRenderer,y=window.devicePixelRatio||1,S=new r.Color(.07,.07,.15);w.setPixelRatio(y),w.setClearColor(S),w.setSize(window.innerWidth,window.innerHeight),document.body.appendChild(w.domElement);let x=new r.Scene,C=new r.PerspectiveCamera(50,window.innerWidth/window.innerHeight,.1,1e3);C.position.x=0,C.position.y=2,C.position.z=10,new d.OrbitControls(C,w.domElement);let P={time:{value:1},scanLineScale:{value:1/y},scanLineIntensity:{value:.75},color:{value:new r.Vector3(.07,.07,.15)},lightingIntensity:{value:3.5},filmGrainIntensity:{value:.15},resolution:{value:new r.Vector2(window.innerWidth*y,window.innerHeight*y)},opacity:{value:.8},opacityJitterStrength:{value:.05},opacityJitterSpeed:{value:40},smoothStepLighting:{value:!0},exposure:{value:2},wiggleStrength:{value:2},wigglePeriod:{value:3},wiggleDuration:{value:.1}},b=new r.ShaderMaterial({transparent:!0,uniforms:P,vertexShader:`
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
	`}),I=new r.Mesh(new r.BoxGeometry(2,2,2,20,20,20),b);I.position.x=-4,x.add(I);let L=new r.Mesh(new r.SphereGeometry(1.2,22,22),b);x.add(L);let N=new r.Mesh(new r.TorusKnotGeometry(1,.34,128,16),b);N.position.x=4,x.add(N),(u=!u)?document.body.appendChild(g.dom):g.dom.remove();let M=new c.EffectComposer(w);M.setSize(window.innerWidth,window.innerHeight);let F=new p.RenderPass(x,C);M.addPass(F);let J=new m.UnrealBloomPass(new r.Vector2(window.innerWidth,window.innerHeight),.5,1,.2);M.addPass(J);let R=new h.ShaderPass(v.FXAAShader),W=w.getPixelRatio();R.material.uniforms.resolution.value.x=1/(window.innerWidth*W),R.material.uniforms.resolution.value.y=1/(window.innerHeight*W),M.addPass(R);let D=new s.GUI,E={bloom:J.enabled,"Anti-aliasing":R.enabled,Opacity:P.opacity.value},V={"Film grain":P.filmGrainIntensity.value,Jitter:P.opacityJitterStrength.value,"Jitter speed":P.opacityJitterSpeed.value,"Wiggle strength":P.wiggleStrength.value,"Wiggle period":P.wigglePeriod.value,"Wiggle duration":P.wiggleDuration.value},G=D.addFolder("Noise");G.add(V,"Film grain",0,1).onChange(e=>{b.uniforms.filmGrainIntensity.value=e}),G.add(V,"Jitter",0,1).onChange(e=>{b.uniforms.opacityJitterStrength.value=e}),G.add(V,"Jitter speed",0,100).onChange(e=>{b.uniforms.opacityJitterSpeed.value=e}),G.add(V,"Wiggle strength",0,10).onChange(e=>{P.wiggleStrength.value=e}),G.add(V,"Wiggle period",0,10).onChange(e=>{P.wigglePeriod.value=e}),G.add(V,"Wiggle duration",0,1).onChange(e=>{P.wiggleDuration.value=e}),G.open();let z={Intensity:P.lightingIntensity.value,Exposure:P.exposure.value,"Smooth step":P.smoothStepLighting.value},H=D.addFolder("Lighting");H.add(z,"Intensity",0,10).onChange(e=>{b.uniforms.lightingIntensity.value=e}),H.add(z,"Exposure",0,10).onChange(e=>{b.uniforms.exposure.value=e}),H.add(z,"Smooth step").onChange(e=>{b.uniforms.smoothStepLighting.value=e}),H.open(),D.add(E,"Opacity",0,1).onChange(e=>{b.uniforms.opacity.value=e}),D.add(E,"bloom").onChange(e=>{J.enabled=e}),D.add(E,"Anti-aliasing").onChange(e=>{R.enabled=e});let O={Scale:P.scanLineScale.value,Intensity:P.scanLineIntensity.value},A=D.addFolder("Scanlines");A.add(O,"Scale",0,2).onChange(e=>{b.uniforms.scanLineScale.value=e}),A.add(O,"Intensity",0,1).onChange(e=>{b.uniforms.scanLineIntensity.value=e}),function i(t){(e=null==e?window.confirm("Warning: This demo may potentially trigger seizures for people with photosensitive epilepsy. Click Cancel to Exit or OK to continue."):e)&&(P.inverseViewMatrix={value:C.matrixWorld},P.time.value=t/1e3,requestAnimationFrame(i),e&&M.render(x,C),g.update())}()}();
//# sourceMappingURL=hologram.94a13223.js.map
