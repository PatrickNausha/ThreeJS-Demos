function e(e){return e&&e.__esModule?e.default:e}var n="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{},t={},o={},i=n.parcelRequire1287;null==i&&((i=function(e){if(e in t)return t[e].exports;if(e in o){var n=o[e];delete o[e];var i={id:e,exports:{}};return t[e]=i,n.call(i.exports,i,i.exports),i.exports}var r=new Error("Cannot find module '"+e+"'");throw r.code="MODULE_NOT_FOUND",r}).register=function(e,n){o[e]=n},n.parcelRequire1287=i);var r,a=i("eq1Fs"),l=i("dJCPM"),d=i("eOHOW");r=function(){var e=0,n=document.createElement("div");function t(e){return n.appendChild(e.dom),e}function o(t){for(var o=0;o<n.children.length;o++)n.children[o].style.display=o===t?"block":"none";e=t}n.style.cssText="position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000",n.addEventListener("click",(function(t){t.preventDefault(),o(++e%n.children.length)}),!1);var i=(performance||Date).now(),a=i,l=0,d=t(new r.Panel("FPS","#0ff","#002")),s=t(new r.Panel("MS","#0f0","#020"));if(self.performance&&self.performance.memory)var c=t(new r.Panel("MB","#f08","#201"));return o(0),{REVISION:16,dom:n,addPanel:t,showPanel:o,begin:function(){i=(performance||Date).now()},end:function(){l++;var e=(performance||Date).now();if(s.update(e-i,200),a+1e3<=e&&(d.update(1e3*l/(e-a),100),a=e,l=0,c)){var n=performance.memory;c.update(n.usedJSHeapSize/1048576,n.jsHeapSizeLimit/1048576)}return e},update:function(){i=this.end()},domElement:n,setMode:o}},r.Panel=function(e,n,t){var o=1/0,i=0,r=Math.round,a=r(window.devicePixelRatio||1),l=80*a,d=48*a,s=3*a,c=2*a,f=3*a,p=15*a,u=74*a,h=30*a,w=document.createElement("canvas");w.width=l,w.height=d,w.style.cssText="width:80px;height:48px";var m=w.getContext("2d");return m.font="bold "+9*a+"px Helvetica,Arial,sans-serif",m.textBaseline="top",m.fillStyle=t,m.fillRect(0,0,l,d),m.fillStyle=n,m.fillText(e,s,c),m.fillRect(f,p,u,h),m.fillStyle=t,m.globalAlpha=.9,m.fillRect(f,p,u,h),{dom:w,update:function(d,y){o=Math.min(o,d),i=Math.max(i,d),m.fillStyle=t,m.globalAlpha=1,m.fillRect(0,0,l,p),m.fillStyle=n,m.fillText(r(d)+" "+e+" ("+r(o)+"-"+r(i)+")",s,c),m.drawImage(w,f+a,p,u-a,h,f,p,u-a,h),m.fillRect(f+u-a,p,a,h),m.fillStyle=t,m.globalAlpha=.9,m.fillRect(f+u-a,p,a,r((1-d/y)*h))}}};const s=new(e(r));s.showPanel(0);let c=!1;const f=new a.WebGLRenderer,p=window.devicePixelRatio||1,u=new a.Color(.07,.07,.15);f.setPixelRatio(p),f.setClearColor(u),f.setSize(window.innerWidth,window.innerHeight),document.body.appendChild(f.domElement);const h=new a.Scene,w=new a.PerspectiveCamera(50,window.innerWidth/window.innerHeight,.1,1e3);w.position.x=0,w.position.y=2,w.position.z=10,new d.OrbitControls(w,f.domElement);const m=new a.MeshStandardMaterial,y=[new a.Mesh(new a.TorusKnotGeometry(1,.34,128,16),m),new a.Mesh(new a.TorusKnotGeometry(1,.34,128,16),m),new a.Mesh(new a.TorusKnotGeometry(1,.34,128,16),m)];for(const e of y)h.add(e);function g(e=2){let n=Math.floor(y.length/2)*e;for(const t of y)t.position.z=n,n-=e}g();const v=new a.HemisphereLight(13421823,13408665,1);h.add(v),c=!c,c?document.body.appendChild(s.dom):s.dom.remove();const x=new l.GUI,b={Opacity:1,Transparent:!1,"Depth test":!0,Distance:2,"Sort objects":f.sortObjects};x.add(b,"Opacity",0,1).onChange((e=>{m.opacity=e})),x.add(b,"Transparent").onChange((e=>{m.transparent=e})),x.add(b,"Depth test").onChange((e=>{m.depthTest=e})),x.add(b,"Distance",-10,10).onChange((e=>{g(e)})),x.add(b,"Sort objects").onChange((e=>{f.sortObjects=e})),function e(){requestAnimationFrame(e),f.render(h,w),s.update()}();
//# sourceMappingURL=fun-with-sorting-demo.d648725c.js.map