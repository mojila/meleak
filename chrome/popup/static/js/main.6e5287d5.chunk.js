(this.webpackJsonppopup=this.webpackJsonppopup||[]).push([[0],{34:function(e,t,n){e.exports=n(46)},45:function(e,t,n){},46:function(e,t,n){"use strict";n.r(t);var a=n(0),r=n.n(a),c=n(12),o=n.n(c),i=n(61),u=n(6),s=n.n(u),p=n(16),l=n(28),f=n(59),d=n(60),m=n(62),h=n(63),v=Object(f.a)((function(e){return{paper:{padding:8}}})),b=function(){var e=Object(a.useState)(!1),t=Object(l.a)(e,2),n=t[0],c=t[1],o=v(),i=function(){var e=Object(p.a)(s.a.mark((function e(t){return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,chrome.runtime.sendMessage({action:"attach_debugger",payload:{tabId:t[0].id}});case 2:c(!0);case 3:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),u=function(){var e=Object(p.a)(s.a.mark((function e(t){return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,chrome.runtime.sendMessage({action:"detach_debugger",payload:{tabId:t[0].id}});case 2:c(!1);case 3:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),f=function(){var e=Object(p.a)(s.a.mark((function e(){return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,chrome.tabs.query({active:!0},u);case 2:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),b=function(){var e=Object(p.a)(s.a.mark((function e(){return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,chrome.tabs.query({active:!0},i);case 2:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),w=function(){var e=Object(p.a)(s.a.mark((function e(){return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:chrome.runtime.sendMessage({action:"is_attached_debugger"},(function(e){c(e)}));case 1:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();return Object(a.useEffect)((function(){w()}),[]),r.a.createElement(d.a,{className:o.paper},r.a.createElement(m.a,{display:"flex",justifyContent:"flex-end"},n?r.a.createElement(h.a,{size:"small",variant:"outlined",onClick:f},"Stop"):r.a.createElement(h.a,{size:"small",variant:"outlined",onClick:b},"Start")))};var w=function(){return r.a.createElement(i.a,{container:!0,spacing:"1"},r.a.createElement(i.a,{item:!0,xs:"12"},r.a.createElement(b,null)))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));n(44),n(45);o.a.render(r.a.createElement(r.a.StrictMode,null,r.a.createElement(w,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[34,1,2]]]);
//# sourceMappingURL=main.6e5287d5.chunk.js.map