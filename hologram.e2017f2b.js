function t(t){return t&&t.__esModule?t.default:t}var e="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{},n={},i={},o=e.parcelRequire1287;null==o&&((o=function(t){if(t in n)return n[t].exports;if(t in i){var e=i[t];delete i[t];var o={id:t,exports:{}};return n[t]=o,e.call(o.exports,o,o.exports),o.exports}var a=new Error("Cannot find module '"+t+"'");throw a.code="MODULE_NOT_FOUND",a}).register=function(t,e){i[t]=e},e.parcelRequire1287=o);var a,r=o("ilwiq"),l=o("e93rA"),s=o("5Rd1x");a=function(){var t=0,e=document.createElement("div");function n(t){return e.appendChild(t.dom),t}function i(n){for(var i=0;i<e.children.length;i++)e.children[i].style.display=i===n?"block":"none";t=n}e.style.cssText="position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000",e.addEventListener("click",(function(n){n.preventDefault(),i(++t%e.children.length)}),!1);var o=(performance||Date).now(),r=o,l=0,s=n(new a.Panel("FPS","#0ff","#002")),d=n(new a.Panel("MS","#0f0","#020"));if(self.performance&&self.performance.memory)var f=n(new a.Panel("MB","#f08","#201"));return i(0),{REVISION:16,dom:e,addPanel:n,showPanel:i,begin:function(){o=(performance||Date).now()},end:function(){l++;var t=(performance||Date).now();if(d.update(t-o,200),r+1e3<=t&&(s.update(1e3*l/(t-r),100),r=t,l=0,f)){var e=performance.memory;f.update(e.usedJSHeapSize/1048576,e.jsHeapSizeLimit/1048576)}return t},update:function(){o=this.end()},domElement:e,setMode:i}},a.Panel=function(t,e,n){var i=1/0,o=0,a=Math.round,r=a(window.devicePixelRatio||1),l=80*r,s=48*r,d=3*r,f=2*r,c=3*r,g=15*r,u=74*r,m=30*r,h=document.createElement("canvas");h.width=l,h.height=s,h.style.cssText="width:80px;height:48px";var p=h.getContext("2d");return p.font="bold "+9*r+"px Helvetica,Arial,sans-serif",p.textBaseline="top",p.fillStyle=n,p.fillRect(0,0,l,s),p.fillStyle=e,p.fillText(t,d,f),p.fillRect(c,g,u,m),p.fillStyle=n,p.globalAlpha=.9,p.fillRect(c,g,u,m),{dom:h,update:function(s,v){i=Math.min(i,s),o=Math.max(o,s),p.fillStyle=n,p.globalAlpha=1,p.fillRect(0,0,l,g),p.fillStyle=e,p.fillText(a(s)+" "+t+" ("+a(i)+"-"+a(o)+")",d,f),p.drawImage(h,c+r,g,u-r,m,c,g,u-r,m),p.fillRect(c+u-r,g,r,m),p.fillStyle=n,p.globalAlpha=.9,p.fillRect(c+u-r,g,r,a((1-s/v)*m))}}};const d=new(t(a));d.showPanel(0);let f=!1;var c=o("2HSCJ"),g=o("hlgjA"),u=o("l1cPW"),m=o("9ajTk"),h=o("9fA99");const p=new r.WebGLRenderer,v=window.devicePixelRatio||1,w=new r.Color(.07,.07,.15);p.setPixelRatio(v),p.setClearColor(w),p.setSize(window.innerWidth,window.innerHeight),document.body.appendChild(p.domElement);const y=new r.Scene,S=new r.PerspectiveCamera(50,window.innerWidth/window.innerHeight,.1,1e3);S.position.x=0,S.position.y=2,S.position.z=10,new s.OrbitControls(S,p.domElement);const x={time:{value:1},scanLineScale:{value:1/v},scanLineIntensity:{value:.75},color:{value:new r.Vector3(.07,.07,.15)},lightingIntensity:{value:3.5},filmGrainIntensity:{value:.15},resolution:{value:new r.Vector2(window.innerWidth*v,window.innerHeight*v)},opacity:{value:.8},opacityJitterStrength:{value:.05},opacityJitterSpeed:{value:40},smoothStepLighting:{value:!0},exposure:{value:2},wiggleStrength:{value:2},wigglePeriod:{value:3},wiggleDuration:{value:.1}},P=new r.ShaderMaterial({transparent:!0,uniforms:x,vertexShader:"\n\t\tvarying vec3 vNormal;\n\t\tuniform mat4 inverseViewMatrix;\n\t\tuniform float time;\n\t\tuniform float wiggleStrength;\n\t\tuniform float wigglePeriod;\n\t\tuniform float wiggleDuration;\n\n\t\tvoid main()\n\t\t{\n\t\t\tvNormal = normal;\n\t\t\tfloat viewSpaceY = (modelViewMatrix * vec4(position, 1.0)).y;\n\t\t\tfloat wiggleFactor = 0.0;\n\t\t\tif (fract(time / wigglePeriod) > 1.0 - wiggleDuration) {\n\t\t\t\twiggleFactor = wiggleStrength;\n\t\t\t}\n\n\t\t\tfloat jitterScale = 25.0;\n\t\t\tfloat jitterSpeed = 80.0;\n\t\t\tfloat x = viewSpaceY * jitterScale + time * jitterSpeed;\n\t\t\tvec4 noiseShift = inverseViewMatrix * vec4(wiggleFactor * sin(x / 3.0) * sin(x / 13.0), 0.0, 0.0, 0.0);\n\t\t\tvec3 shiftedPosition = noiseShift.xyz / 7.0 + position;\n\t\t\tvec4 mvPosition = modelViewMatrix * vec4(shiftedPosition, 1.0);\n\t\t\tgl_Position = projectionMatrix * mvPosition;\n\t\t}",fragmentShader:'\n\t\t#define PI 3.141592653589793\n\t\tuniform float scanLineScale;\n\t\tuniform float scanLineIntensity;\n\t\tuniform float filmGrainIntensity;\n\t\tuniform float time;\n\t\tuniform float exposure;\n\t\tuniform vec3 color;\n\t\tuniform float opacity;\n\t\tuniform vec2 resolution;\n\t\tuniform float lightingIntensity;\n\t\tuniform bool smoothStepLighting;\n\t\tuniform float opacityJitterStrength;\n\t\tuniform float opacityJitterSpeed;\n\t\tvarying vec3 vNormal;\t// Interpolated Normal vector passed in from vertex shader\n\n\t\t// Psuedo-random generator from https://thebookofshaders.com/10/\n\t\tfloat random(vec2 st) {\n\t\t\treturn fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);\n\t\t}\n\n\t\tfloat getVerticalNoise(float verticalNoiseFrameRate, float verticalNoiseSpeed, float verticalNoiseScale) {\n\t\t\tfloat v = gl_FragCoord.y / resolution.y * verticalNoiseScale;\n\t\t\tfloat theta = (v + floor(time * verticalNoiseFrameRate) * verticalNoiseSpeed);\n\t\t\tfloat verticalNoiseStrength = 1.5;\n\t\t\treturn pow(100.0, sin(theta) * sin(theta / 3.0) * sin(theta / 13.0)) / 100.0 * verticalNoiseStrength;\n\t\t}\n\n\t\tvoid main() {\n\t\t\t// Some basic Lambertian-ish reflectance.\n\t\t\tvec3 lightDirection = normalize(vec3(0.7, 0.5, 1.0));\n\t\t\tfloat diffuse = max(dot(vNormal, lightDirection), 0.0);\n\t\t\tif (smoothStepLighting)\n\t\t\t\tdiffuse = smoothstep(0.0, 1.0, diffuse);\n\t\t\tdiffuse *= lightingIntensity;\n\n\t\t\t// Use a "spikey" sine equation shifted by time for some moving glowing noise bars.\n\n\t\t\tfloat scanLineMultiplier = mix(1.0 - scanLineIntensity, 1.0, abs(sin(gl_FragCoord.y * scanLineScale * PI * 0.25)));\n\n\t\t\tfloat verticalNoise = getVerticalNoise(12.0, 2.0, 80.0) + getVerticalNoise(8.0, 1.0, 26.0);\n\n\t\t\tfloat brightness = diffuse + verticalNoise;\n\t\t\t\n\t\t\tfloat filmGrain = (2.0 * random(gl_FragCoord.xy / resolution + fract(time)) - 1.0) * filmGrainIntensity;\n\n\t\t\tvec3 fragColor = ((mix(color.xyz, vec3(0.1, 0.2, 1.0), brightness) * exposure) + filmGrain) * scanLineMultiplier;\n\n\t\t\tfloat theta = time * opacityJitterSpeed;\n\t\t\tfloat opacityJitter = (sin(theta) / 2.0 + 1.0) * opacityJitterStrength;\n\t\t\tgl_FragColor = vec4(fragColor, opacity - opacityJitter);\n\t\t}\n\t'}),C=new r.Mesh(new r.BoxGeometry(2,2,2,20,20,20),P);C.position.x=-4,y.add(C);const b=new r.Mesh(new r.SphereGeometry(1.2,22,22),P);y.add(b);const I=new r.Mesh(new r.TorusKnotGeometry(1,.34,128,16),P);I.position.x=4,y.add(I),f=!f,f?document.body.appendChild(d.dom):d.dom.remove();const L=new c.EffectComposer(p);L.setSize(window.innerWidth,window.innerHeight);const N=new u.RenderPass(y,S);L.addPass(N);const M=new g.UnrealBloomPass(new r.Vector2(window.innerWidth,window.innerHeight),.5,1,.2);L.addPass(M);const F=new m.ShaderPass(h.FXAAShader),J=p.getPixelRatio();F.material.uniforms.resolution.value.x=1/(window.innerWidth*J),F.material.uniforms.resolution.value.y=1/(window.innerHeight*J),L.addPass(F);const R=new l.GUI,W={bloom:M.enabled,"Anti-aliasing":F.enabled,Opacity:x.opacity.value},D={"Film grain":x.filmGrainIntensity.value,Jitter:x.opacityJitterStrength.value,"Jitter speed":x.opacityJitterSpeed.value,"Wiggle strength":x.wiggleStrength.value,"Wiggle period":x.wigglePeriod.value,"Wiggle duration":x.wiggleDuration.value},A=R.addFolder("Noise");A.add(D,"Film grain",0,1).onChange((t=>{P.uniforms.filmGrainIntensity.value=t})),A.add(D,"Jitter",0,1).onChange((t=>{P.uniforms.opacityJitterStrength.value=t})),A.add(D,"Jitter speed",0,100).onChange((t=>{P.uniforms.opacityJitterSpeed.value=t})),A.add(D,"Wiggle strength",0,10).onChange((t=>{x.wiggleStrength.value=t})),A.add(D,"Wiggle period",0,10).onChange((t=>{x.wigglePeriod.value=t})),A.add(D,"Wiggle duration",0,1).onChange((t=>{x.wiggleDuration.value=t})),A.open();const E={Intensity:x.lightingIntensity.value,Exposure:x.exposure.value,"Smooth step":x.smoothStepLighting.value},G=R.addFolder("Lighting");G.add(E,"Intensity",0,10).onChange((t=>{P.uniforms.lightingIntensity.value=t})),G.add(E,"Exposure",0,10).onChange((t=>{P.uniforms.exposure.value=t})),G.add(E,"Smooth step").onChange((t=>{P.uniforms.smoothStepLighting.value=t})),G.open(),R.add(W,"Opacity",0,1).onChange((t=>{P.uniforms.opacity.value=t})),R.add(W,"bloom").onChange((t=>{M.enabled=t})),R.add(W,"Anti-aliasing").onChange((t=>{F.enabled=t}));const V={Scale:x.scanLineScale.value,Intensity:x.scanLineIntensity.value},H=R.addFolder("Scanlines");H.add(V,"Scale",0,2).onChange((t=>{P.uniforms.scanLineScale.value=t})),H.add(V,"Intensity",0,1).onChange((t=>{P.uniforms.scanLineIntensity.value=t})),function t(e){const n=e/1e3;x.inverseViewMatrix={value:S.matrixWorld},x.time.value=n,requestAnimationFrame(t),L.render(y,S),d.update()}();
//# sourceMappingURL=hologram.e2017f2b.js.map
