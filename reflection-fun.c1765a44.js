var e="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{},t={},n={},i=e.parcelRequire1287;null==i&&((i=function(e){if(e in t)return t[e].exports;if(e in n){var i=n[e];delete n[e];var r={id:e,exports:{}};return t[e]=r,i.call(r.exports,r,r.exports),r.exports}var s=new Error("Cannot find module '"+e+"'");throw s.code="MODULE_NOT_FOUND",s}).register=function(e,t){n[e]=t},e.parcelRequire1287=i);var r=i("ilwiq"),s=i("jzIcS"),o=i("5Rd1x"),a=i("1kdUw"),l=i("lhJUT"),c=i("hlgjA"),d=i("2HSCJ"),u=i("l1cPW"),v=i("9ajTk"),f=(r=i("ilwiq"),i("RPVlj"));const h={uniforms:{tDiffuse:{value:null},time:{value:0},nIntensity:{value:.5},sIntensity:{value:.05},sCount:{value:4096},grayscale:{value:1}},vertexShader:"\n\n\t\tvarying vec2 vUv;\n\n\t\tvoid main() {\n\n\t\t\tvUv = uv;\n\t\t\tgl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n\n\t\t}",fragmentShader:"\n\n\t\t#include <common>\n\n\t\t// control parameter\n\t\tuniform float time;\n\n\t\tuniform bool grayscale;\n\n\t\t// noise effect intensity value (0 = no effect, 1 = full effect)\n\t\tuniform float nIntensity;\n\n\t\t// scanlines effect intensity value (0 = no effect, 1 = full effect)\n\t\tuniform float sIntensity;\n\n\t\t// scanlines effect count value (0 = no effect, 4096 = full effect)\n\t\tuniform float sCount;\n\n\t\tuniform sampler2D tDiffuse;\n\n\t\tvarying vec2 vUv;\n\n\t\tvoid main() {\n\n\t\t// sample the source\n\t\t\tvec4 cTextureScreen = texture2D( tDiffuse, vUv );\n\n\t\t// make some noise\n\t\t\tfloat dx = rand( vUv + time );\n\n\t\t// add noise\n\t\t\tvec3 cResult = cTextureScreen.rgb + cTextureScreen.rgb * clamp( 0.1 + dx, 0.0, 1.0 );\n\n\t\t// get us a sine and cosine\n\t\t\tvec2 sc = vec2( sin( vUv.y * sCount ), cos( vUv.y * sCount ) );\n\n\t\t// add scanlines\n\t\t\tcResult += cTextureScreen.rgb * vec3( sc.x, sc.y, sc.x ) * sIntensity;\n\n\t\t// interpolate between source and result by intensity\n\t\t\tcResult = cTextureScreen.rgb + clamp( nIntensity, 0.0,1.0 ) * ( cResult - cTextureScreen.rgb );\n\n\t\t// convert to grayscale if desired\n\t\t\tif( grayscale ) {\n\n\t\t\t\tcResult = vec3( cResult.r * 0.3 + cResult.g * 0.59 + cResult.b * 0.11 );\n\n\t\t\t}\n\n\t\t\tgl_FragColor =  vec4( cResult, cTextureScreen.a );\n\n\t\t}"};class m extends f.Pass{constructor(e,t,n,i){super(),void 0===h&&console.error("THREE.FilmPass relies on FilmShader");const s=h;this.uniforms=r.UniformsUtils.clone(s.uniforms),this.material=new r.ShaderMaterial({uniforms:this.uniforms,vertexShader:s.vertexShader,fragmentShader:s.fragmentShader}),void 0!==i&&(this.uniforms.grayscale.value=i),void 0!==e&&(this.uniforms.nIntensity.value=e),void 0!==t&&(this.uniforms.sIntensity.value=t),void 0!==n&&(this.uniforms.sCount.value=n),this.fsQuad=new f.FullScreenQuad(this.material)}render(e,t,n,i){this.uniforms.tDiffuse.value=n.texture,this.uniforms.time.value+=i,this.renderToScreen?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(),this.fsQuad.render(e))}}r=i("ilwiq");let w,g,p,b,x,y,S;const R=new r.Layers;R.set(1),function(){w=new r.WebGLRenderer,w.setPixelRatio(window.devicePixelRatio),w.setSize(window.innerWidth,window.innerHeight),w.setAnimationLoop(U),document.body.appendChild(w.domElement);const e=new r.TextureLoader,t=e.load("./assets/concrete/Concrete019_1K_Color.jpg"),n=e.load("./assets/concrete/Concrete019_1K_NormalGL.jpg");t.wrapS=t.wrapT=r.RepeatWrapping,n.wrapS=n.wrapT=r.RepeatWrapping,t.repeat.set(10,10),n.repeat.set(10,10),b=new r.PerspectiveCamera(45,window.innerWidth/window.innerHeight,1,1e3),b.position.set(0,15,-25),g=new r.Scene,l.RectAreaLightUniformsLib.init();const i=16733440;S=new r.RectAreaLight(i,10,8,50);const s=new r.PlaneGeometry(8,50),f=new r.Mesh(s,new r.MeshBasicMaterial({color:i}));f.rotateX(Math.PI),S.position.set(0,25,66.8),f.position.set(0,25,66.8),g.add(S),g.add(f),f.layers.enable(1);const h=new r.PlaneGeometry(100,100);y=new a.Reflector(h,{clipBias:.003,textureWidth:window.innerWidth*window.devicePixelRatio,textureHeight:window.innerHeight*window.devicePixelRatio,color:16777215,transparent:!0,opacity:.4,depthFunc:r.EqualDepth}),y.rotateX(-Math.PI/2),y.rotateZ(Math.PI/4),g.add(y);const R=new r.MeshStandardMaterial({color:16777215,roughness:.2,metalness:0,normalMap:n,map:t}),T=new r.Mesh(h,R);T.rotateX(-Math.PI/2),T.rotateZ(Math.PI/4),g.add(T);const P=new r.TorusKnotGeometry(1.5,.5,200,16),M=new r.MeshStandardMaterial({color:16777215,roughness:0,metalness:0}),C=new r.Mesh(P,M);C.name="meshKnot",C.position.set(0,3,24),g.add(C);const I=new o.OrbitControls(b,w.domElement);I.target.set(0,15,100),I.update(),window.addEventListener("resize",L);const D=new u.RenderPass(g,b),E=new c.UnrealBloomPass(new r.Vector2(window.innerWidth,window.innerHeight),1.5,.4,.85),H={exposure:1,bloomStrength:1,bloomThreshold:0,bloomRadius:1};E.threshold=H.bloomThreshold,E.strength=H.bloomStrength,E.radius=H.bloomRadius,p=new d.EffectComposer(w),p.renderToScreen=!1,p.addPass(D),p.addPass(E);const W=new v.ShaderPass(new r.ShaderMaterial({uniforms:{baseTexture:{value:null},bloomTexture:{value:p.renderTarget2.texture}},vertexShader:"\n\t\t\t\tvarying vec2 vUv;\n\n\t\t\t\tvoid main() {\n\t\t\t\t\tvUv = uv;\n\t\t\t\t\tgl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n\t\t\t\t}",fragmentShader:"\n\t\t\t\tuniform sampler2D baseTexture;\n\t\t\t\tuniform sampler2D bloomTexture;\n\n\t\t\t\tvarying vec2 vUv;\n\n\t\t\t\tvoid main() {\n\t\t\t\t\tgl_FragColor = ( texture2D( baseTexture, vUv ) + vec4( 1.0 ) * texture2D( bloomTexture, vUv ) );\n\t\t\t\t}",defines:{}}),"baseTexture");W.needsSwap=!0,x=new d.EffectComposer(w),x.addPass(D),x.addPass(W),x.addPass(new m(.35,0,0,!1))}();const T=new s.PolySynth(s.Synth);let P;T.toDestination();const M=new Promise((e=>{P=e}));function L(){w.setSize(window.innerWidth,window.innerHeight),b.aspect=window.innerWidth/window.innerHeight,b.updateProjectionMatrix()}function U(e){g.getObjectByName("meshKnot").rotation.y=e/1e3,g.traverse(D),y.visible=!1,p.render(),g.traverse(E),y.visible=!0,x.render(.01)}document.body.addEventListener("click",(()=>{}));const C=new r.MeshBasicMaterial({color:"black"}),I={};function D(e){e.isMesh&&!1===R.test(e.layers)&&(I[e.uuid]=e.material,e.material=C)}function E(e){I[e.uuid]&&(e.material=I[e.uuid],delete I[e.uuid])}M.then((()=>{setInterval((()=>{S.visible=!S.visible,undefined.visible=!undefined.visible,S.visible?T.triggerAttack("C3"):T.triggerRelease("C3")}),1e3),setInterval((()=>{rectLight2.visible=!rectLight2.visible,rectLightHelper2.visible=!rectLightHelper2.visible,rectLight2.visible?T.triggerAttack("E3"):T.triggerRelease("E3")}),500),setInterval((()=>{rectLight3.visible=!rectLight3.visible,rectLightHelper3.visible=!rectLightHelper3.visible,rectLight3.visible?T.triggerAttack("G3"):T.triggerRelease("G3")}),1250)}));
//# sourceMappingURL=reflection-fun.c1765a44.js.map
