!function(){function e(e){return e&&e.__esModule?e.default:e}var t="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{},n={},i={},a=t.parcelRequire1287;null==a&&((a=function(e){if(e in n)return n[e].exports;if(e in i){var t=i[e];delete i[e];var a={id:e,exports:{}};return n[e]=a,t.call(a.exports,a,a.exports),a.exports}var r=new Error("Cannot find module '"+e+"'");throw r.code="MODULE_NOT_FOUND",r}).register=function(e,t){i[e]=t},t.parcelRequire1287=a);var r=a("6OvZu"),o=a("3bF5H"),l=new(e(function(){"use strict";var e=function(){var t=0,n=document.createElement("div");function i(e){return n.appendChild(e.dom),e}function a(e){for(var i=0;i<n.children.length;i++)n.children[i].style.display=i===e?"block":"none";t=e}n.style.cssText="position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000",n.addEventListener("click",(function(e){e.preventDefault(),a(++t%n.children.length)}),!1);var r=(performance||Date).now(),o=r,l=0,d=i(new e.Panel("FPS","#0ff","#002")),s=i(new e.Panel("MS","#0f0","#020"));if(self.performance&&self.performance.memory)var f=i(new e.Panel("MB","#f08","#201"));return a(0),{REVISION:16,dom:n,addPanel:i,showPanel:a,begin:function(){r=(performance||Date).now()},end:function(){l++;var e=(performance||Date).now();if(s.update(e-r,200),o+1e3<=e&&(d.update(1e3*l/(e-o),100),o=e,l=0,f)){var t=performance.memory;f.update(t.usedJSHeapSize/1048576,t.jsHeapSizeLimit/1048576)}return e},update:function(){r=this.end()},domElement:n,setMode:a}};return e.Panel=function(e,t,n){var i=1/0,a=0,r=Math.round,o=r(window.devicePixelRatio||1),l=80*o,d=48*o,s=3*o,f=2*o,c=3*o,m=15*o,u=74*o,p=30*o,w=document.createElement("canvas");w.width=l,w.height=d,w.style.cssText="width:80px;height:48px";var h=w.getContext("2d");return h.font="bold "+9*o+"px Helvetica,Arial,sans-serif",h.textBaseline="top",h.fillStyle=n,h.fillRect(0,0,l,d),h.fillStyle=t,h.fillText(e,s,f),h.fillRect(c,m,u,p),h.fillStyle=n,h.globalAlpha=.9,h.fillRect(c,m,u,p),{dom:w,update:function(d,x){i=Math.min(i,d),a=Math.max(a,d),h.fillStyle=n,h.globalAlpha=1,h.fillRect(0,0,l,m),h.fillStyle=t,h.fillText(r(d)+" "+e+" ("+r(i)+"-"+r(a)+")",s,f),h.drawImage(w,c+o,m,u-o,p,c,m,u-o,p),h.fillRect(c+u-o,m,o,p),h.fillStyle=n,h.globalAlpha=.9,h.fillRect(c+u-o,m,o,r((1-d/x)*p))}}},e}()));l.showPanel(0);var d=!1;var s=new r.WebGLRenderer,f=window.devicePixelRatio||1,c=new r.Color(.07,.07,.15);s.setPixelRatio(f),s.setClearColor(c),s.setSize(window.innerWidth,window.innerHeight),document.body.appendChild(s.domElement);var m=new r.Scene,u=new r.PerspectiveCamera(50,window.innerWidth/window.innerHeight,.1,1e3);u.position.x=0,u.position.y=4,u.position.z=20,new o.OrbitControls(u,s.domElement);var p=new r.MeshBasicMaterial({color:16711680,wireframe:!0}),w=new r.Group,h=new r.Mesh(new r.PlaneGeometry(10,10,1,1),p),x=new r.Vector3(0,0,1),v=new r.ArrowHelper(x,new r.Vector3(0,0,0),2,65280),y=new r.Matrix4;w.matrixAutoUpdate=!1,w.matrix=y,w.add(h),w.add(v),m.add(w);var M=new r.MeshBasicMaterial({color:255,wireframe:!0}),g=new r.Mesh(new r.PlaneGeometry(100,100,20,20),M);g.rotateX(Math.PI/2),g.position.y=-5,m.add(g);var P=new r.MeshStandardMaterial,S=new r.Mesh(new r.TorusKnotGeometry(1,.34,128,16),P);m.add(S),S.matrixAutoUpdate=!1;var b=new r.Mesh(new r.TorusKnotGeometry(1,.34,128,16),P);b.matrixAutoUpdate=!1,m.add(b);var R=new r.HemisphereLight(13421823,13408665,1);m.add(R),(d=!d)?document.body.appendChild(l.dom):l.dom.remove(),function e(t){requestAnimationFrame(e);var n=t/1e3;S.matrix.makeRotationY(n),S.matrix.setPosition(Math.sin(n),0,5);var i=S.matrix.clone(),a=(new r.Matrix4).multiply(w.matrix).multiply((new r.Matrix4).makeScale(1,1,-1)).multiply((new r.Matrix4).getInverse(w.matrix)).multiply(i);b.matrix=a,w.matrix.makeRotationY(Math.PI/4*Math.sin(n/3.21)),w.matrix.setPosition(0,0,Math.sin(n)),s.render(m,u),l.update()}()}();
//# sourceMappingURL=fun-with-transformations-demo.347fb36d.js.map