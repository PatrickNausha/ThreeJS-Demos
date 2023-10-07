!function(){function e(e,t,r,i){Object.defineProperty(e,t,{get:r,set:i,enumerable:!0,configurable:!0})}var t="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{},r={},i={},s=t.parcelRequire1287;null==s&&((s=function(e){if(e in r)return r[e].exports;if(e in i){var t=i[e];delete i[e];var s={id:e,exports:{}};return r[e]=s,t.call(s.exports,s,s.exports),s.exports}var a=Error("Cannot find module '"+e+"'");throw a.code="MODULE_NOT_FOUND",a}).register=function(e,t){i[e]=t},t.parcelRequire1287=s),s.register("8MWs4",function(t,r){e(t.exports,"EffectComposer",function(){return n});var i=s("6OvZu"),a=s("2wkXx"),o=s("gy7bn"),l=s("im5gf");class n{constructor(e,t){if(this.renderer=e,void 0===t){let r={minFilter:i.LinearFilter,magFilter:i.LinearFilter,format:i.RGBAFormat},s=e.getSize(new i.Vector2);this._pixelRatio=e.getPixelRatio(),this._width=s.width,this._height=s.height,(t=new i.WebGLRenderTarget(this._width*this._pixelRatio,this._height*this._pixelRatio,r)).texture.name="EffectComposer.rt1"}else this._pixelRatio=1,this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],void 0===a.CopyShader&&console.error("THREE.EffectComposer relies on CopyShader"),void 0===o.ShaderPass&&console.error("THREE.EffectComposer relies on ShaderPass"),this.copyPass=new o.ShaderPass(a.CopyShader),this.clock=new i.Clock}swapBuffers(){let e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){let t=this.passes.indexOf(e);-1!==t&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){void 0===e&&(e=this.clock.getDelta());let t=this.renderer.getRenderTarget(),r=!1;for(let t=0,i=this.passes.length;t<i;t++){let i=this.passes[t];if(!1!==i.enabled){if(i.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(t),i.render(this.renderer,this.writeBuffer,this.readBuffer,e,r),i.needsSwap){if(r){let t=this.renderer.getContext(),r=this.renderer.state.buffers.stencil;r.setFunc(t.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),r.setFunc(t.EQUAL,1,4294967295)}this.swapBuffers()}void 0!==l.MaskPass&&(i instanceof l.MaskPass?r=!0:i instanceof l.ClearMaskPass&&(r=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(void 0===e){let t=this.renderer.getSize(new i.Vector2);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,(e=this.renderTarget1.clone()).setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;let r=this._width*this._pixelRatio,i=this._height*this._pixelRatio;this.renderTarget1.setSize(r,i),this.renderTarget2.setSize(r,i);for(let e=0;e<this.passes.length;e++)this.passes[e].setSize(r,i)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}}new i.OrthographicCamera(-1,1,1,-1,0,1);let h=new i.BufferGeometry;h.setAttribute("position",new i.Float32BufferAttribute([-1,3,0,-1,-1,0,3,-1,0],3)),h.setAttribute("uv",new i.Float32BufferAttribute([0,2,0,0,2,0],2))}),s.register("2wkXx",function(t,r){e(t.exports,"CopyShader",function(){return i});var i={uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;

		}`}}),s.register("gy7bn",function(t,r){e(t.exports,"ShaderPass",function(){return o});var i=s("6OvZu"),a=s("MIC3f");class o extends a.Pass{constructor(e,t){super(),this.textureID=void 0!==t?t:"tDiffuse",e instanceof i.ShaderMaterial?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=(0,i.UniformsUtils).clone(e.uniforms),this.material=new i.ShaderMaterial({defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this.fsQuad=new a.FullScreenQuad(this.material)}render(e,t,r){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=r.texture),this.fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this.fsQuad.render(e))}}}),s.register("MIC3f",function(t,r){e(t.exports,"Pass",function(){return a}),e(t.exports,"FullScreenQuad",function(){return n});var i=s("6OvZu");class a{constructor(){this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}}let o=new i.OrthographicCamera(-1,1,1,-1,0,1),l=new i.BufferGeometry;l.setAttribute("position",new i.Float32BufferAttribute([-1,3,0,-1,-1,0,3,-1,0],3)),l.setAttribute("uv",new i.Float32BufferAttribute([0,2,0,0,2,0],2));class n{constructor(e){this._mesh=new i.Mesh(l,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,o)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}}}),s.register("im5gf",function(t,r){e(t.exports,"MaskPass",function(){return a}),e(t.exports,"ClearMaskPass",function(){return o});var i=s("MIC3f");class a extends i.Pass{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,r){let i,s;let a=e.getContext(),o=e.state;o.buffers.color.setMask(!1),o.buffers.depth.setMask(!1),o.buffers.color.setLocked(!0),o.buffers.depth.setLocked(!0),this.inverse?(i=0,s=1):(i=1,s=0),o.buffers.stencil.setTest(!0),o.buffers.stencil.setOp(a.REPLACE,a.REPLACE,a.REPLACE),o.buffers.stencil.setFunc(a.ALWAYS,i,4294967295),o.buffers.stencil.setClear(s),o.buffers.stencil.setLocked(!0),e.setRenderTarget(r),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),o.buffers.color.setLocked(!1),o.buffers.depth.setLocked(!1),o.buffers.stencil.setLocked(!1),o.buffers.stencil.setFunc(a.EQUAL,1,4294967295),o.buffers.stencil.setOp(a.KEEP,a.KEEP,a.KEEP),o.buffers.stencil.setLocked(!0)}}class o extends i.Pass{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}}}),s.register("8aNI6",function(t,r){e(t.exports,"UnrealBloomPass",function(){return n});var i=s("6OvZu"),a=s("MIC3f"),o=s("2wkXx"),l=s("d7LYa");class n extends a.Pass{constructor(e,t,r,s){super(),this.strength=void 0!==t?t:1,this.radius=r,this.threshold=s,this.resolution=void 0!==e?new i.Vector2(e.x,e.y):new i.Vector2(256,256),this.clearColor=new i.Color(0,0,0);let n={minFilter:i.LinearFilter,magFilter:i.LinearFilter,format:i.RGBAFormat};this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let h=Math.round(this.resolution.x/2),u=Math.round(this.resolution.y/2);this.renderTargetBright=new i.WebGLRenderTarget(h,u,n),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let e=0;e<this.nMips;e++){let t=new i.WebGLRenderTarget(h,u,n);t.texture.name="UnrealBloomPass.h"+e,t.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(t);let r=new i.WebGLRenderTarget(h,u,n);r.texture.name="UnrealBloomPass.v"+e,r.texture.generateMipmaps=!1,this.renderTargetsVertical.push(r),h=Math.round(h/2),u=Math.round(u/2)}void 0===l.LuminosityHighPassShader&&console.error("THREE.UnrealBloomPass relies on LuminosityHighPassShader");let d=l.LuminosityHighPassShader;this.highPassUniforms=(0,i.UniformsUtils).clone(d.uniforms),this.highPassUniforms.luminosityThreshold.value=s,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new i.ShaderMaterial({uniforms:this.highPassUniforms,vertexShader:d.vertexShader,fragmentShader:d.fragmentShader,defines:{}}),this.separableBlurMaterials=[];let f=[3,5,7,9,11];h=Math.round(this.resolution.x/2),u=Math.round(this.resolution.y/2);for(let e=0;e<this.nMips;e++)this.separableBlurMaterials.push(this.getSeperableBlurMaterial(f[e])),this.separableBlurMaterials[e].uniforms.texSize.value=new i.Vector2(h,u),h=Math.round(h/2),u=Math.round(u/2);this.compositeMaterial=this.getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=t,this.compositeMaterial.uniforms.bloomRadius.value=.1,this.compositeMaterial.needsUpdate=!0,this.compositeMaterial.uniforms.bloomFactors.value=[1,.8,.6,.4,.2],this.bloomTintColors=[new i.Vector3(1,1,1),new i.Vector3(1,1,1),new i.Vector3(1,1,1),new i.Vector3(1,1,1),new i.Vector3(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,void 0===o.CopyShader&&console.error("THREE.UnrealBloomPass relies on CopyShader");let c=o.CopyShader;this.copyUniforms=(0,i.UniformsUtils).clone(c.uniforms),this.copyUniforms.opacity.value=1,this.materialCopy=new i.ShaderMaterial({uniforms:this.copyUniforms,vertexShader:c.vertexShader,fragmentShader:c.fragmentShader,blending:i.AdditiveBlending,depthTest:!1,depthWrite:!1,transparent:!0}),this.enabled=!0,this.needsSwap=!1,this._oldClearColor=new i.Color,this.oldClearAlpha=1,this.basic=new i.MeshBasicMaterial,this.fsQuad=new a.FullScreenQuad(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose()}setSize(e,t){let r=Math.round(e/2),s=Math.round(t/2);this.renderTargetBright.setSize(r,s);for(let e=0;e<this.nMips;e++)this.renderTargetsHorizontal[e].setSize(r,s),this.renderTargetsVertical[e].setSize(r,s),this.separableBlurMaterials[e].uniforms.texSize.value=new i.Vector2(r,s),r=Math.round(r/2),s=Math.round(s/2)}render(e,t,r,i,s){e.getClearColor(this._oldClearColor),this.oldClearAlpha=e.getClearAlpha();let a=e.autoClear;e.autoClear=!1,e.setClearColor(this.clearColor,0),s&&e.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this.fsQuad.material=this.basic,this.basic.map=r.texture,e.setRenderTarget(null),e.clear(),this.fsQuad.render(e)),this.highPassUniforms.tDiffuse.value=r.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this.fsQuad.material=this.materialHighPassFilter,e.setRenderTarget(this.renderTargetBright),e.clear(),this.fsQuad.render(e);let o=this.renderTargetBright;for(let t=0;t<this.nMips;t++)this.fsQuad.material=this.separableBlurMaterials[t],this.separableBlurMaterials[t].uniforms.colorTexture.value=o.texture,this.separableBlurMaterials[t].uniforms.direction.value=n.BlurDirectionX,e.setRenderTarget(this.renderTargetsHorizontal[t]),e.clear(),this.fsQuad.render(e),this.separableBlurMaterials[t].uniforms.colorTexture.value=this.renderTargetsHorizontal[t].texture,this.separableBlurMaterials[t].uniforms.direction.value=n.BlurDirectionY,e.setRenderTarget(this.renderTargetsVertical[t]),e.clear(),this.fsQuad.render(e),o=this.renderTargetsVertical[t];this.fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,e.setRenderTarget(this.renderTargetsHorizontal[0]),e.clear(),this.fsQuad.render(e),this.fsQuad.material=this.materialCopy,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,s&&e.state.buffers.stencil.setTest(!0),this.renderToScreen?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(r),this.fsQuad.render(e)),e.setClearColor(this._oldClearColor,this.oldClearAlpha),e.autoClear=a}getSeperableBlurMaterial(e){return new i.ShaderMaterial({defines:{KERNEL_RADIUS:e,SIGMA:e},uniforms:{colorTexture:{value:null},texSize:{value:new i.Vector2(.5,.5)},direction:{value:new i.Vector2(.5,.5)}},vertexShader:`varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,fragmentShader:`#include <common>
				varying vec2 vUv;
				uniform sampler2D colorTexture;
				uniform vec2 texSize;
				uniform vec2 direction;

				float gaussianPdf(in float x, in float sigma) {
					return 0.39894 * exp( -0.5 * x * x/( sigma * sigma))/sigma;
				}
				void main() {
					vec2 invSize = 1.0 / texSize;
					float fSigma = float(SIGMA);
					float weightSum = gaussianPdf(0.0, fSigma);
					vec3 diffuseSum = texture2D( colorTexture, vUv).rgb * weightSum;
					for( int i = 1; i < KERNEL_RADIUS; i ++ ) {
						float x = float(i);
						float w = gaussianPdf(x, fSigma);
						vec2 uvOffset = direction * invSize * x;
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset).rgb;
						diffuseSum += (sample1 + sample2) * w;
						weightSum += 2.0 * w;
					}
					gl_FragColor = vec4(diffuseSum/weightSum, 1.0);
				}`})}getCompositeMaterial(e){return new i.ShaderMaterial({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},dirtTexture:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,fragmentShader:`varying vec2 vUv;
				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform sampler2D dirtTexture;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor(const in float factor) {
					float mirrorFactor = 1.2 - factor;
					return mix(factor, mirrorFactor, bloomRadius);
				}

				void main() {
					gl_FragColor = bloomStrength * ( lerpBloomFactor(bloomFactors[0]) * vec4(bloomTintColors[0], 1.0) * texture2D(blurTexture1, vUv) +
						lerpBloomFactor(bloomFactors[1]) * vec4(bloomTintColors[1], 1.0) * texture2D(blurTexture2, vUv) +
						lerpBloomFactor(bloomFactors[2]) * vec4(bloomTintColors[2], 1.0) * texture2D(blurTexture3, vUv) +
						lerpBloomFactor(bloomFactors[3]) * vec4(bloomTintColors[3], 1.0) * texture2D(blurTexture4, vUv) +
						lerpBloomFactor(bloomFactors[4]) * vec4(bloomTintColors[4], 1.0) * texture2D(blurTexture5, vUv) );
				}`})}}n.BlurDirectionX=new i.Vector2(1,0),n.BlurDirectionY=new i.Vector2(0,1)}),s.register("d7LYa",function(t,r){e(t.exports,"LuminosityHighPassShader",function(){return a});var i=s("6OvZu");let a={shaderID:"luminosityHighPass",uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new i.Color(0)},defaultOpacity:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			vec3 luma = vec3( 0.299, 0.587, 0.114 );

			float v = dot( texel.xyz, luma );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}`}}),s.register("8uPQJ",function(t,r){e(t.exports,"RenderPass",function(){return o});var i=s("6OvZu"),a=s("MIC3f");class o extends a.Pass{constructor(e,t,r,s,a){super(),this.scene=e,this.camera=t,this.overrideMaterial=r,this.clearColor=s,this.clearAlpha=void 0!==a?a:0,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new i.Color}render(e,t,r){let i,s;let a=e.autoClear;e.autoClear=!1,void 0!==this.overrideMaterial&&(s=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor&&(e.getClearColor(this._oldClearColor),i=e.getClearAlpha(),e.setClearColor(this.clearColor,this.clearAlpha)),this.clearDepth&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:r),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor&&e.setClearColor(this._oldClearColor,i),void 0!==this.overrideMaterial&&(this.scene.overrideMaterial=s),e.autoClear=a}}})}();
//# sourceMappingURL=confetti-text-glow.143b3e40.js.map