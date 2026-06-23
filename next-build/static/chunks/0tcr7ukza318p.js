(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,270904,e=>{"use strict";let t=(0,e.i(456420).default)("wallet",[["path",{d:"M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1",key:"18etb6"}],["path",{d:"M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4",key:"xoc0q4"}]]);e.s(["Wallet",0,t],270904)},195057,(e,t,a)=>{"use strict";Object.defineProperty(a,"__esModule",{value:!0});var r={formatUrl:function(){return o},formatWithValidation:function(){return d},urlObjectKeys:function(){return l}};for(var i in r)Object.defineProperty(a,i,{enumerable:!0,get:r[i]});let n=e.r(190809)._(e.r(998183)),s=/https?|ftp|gopher|file/;function o(e){let{auth:t,hostname:a}=e,r=e.protocol||"",i=e.pathname||"",o=e.hash||"",l=e.query||"",d=!1;t=t?encodeURIComponent(t).replace(/%3A/i,":")+"@":"",e.host?d=t+e.host:a&&(d=t+(~a.indexOf(":")?`[${a}]`:a),e.port&&(d+=":"+e.port)),l&&"object"==typeof l&&(l=String(n.urlQueryToSearchParams(l)));let p=e.search||l&&`?${l}`||"";return r&&!r.endsWith(":")&&(r+=":"),e.slashes||(!r||s.test(r))&&!1!==d?(d="//"+(d||""),i&&"/"!==i[0]&&(i="/"+i)):d||(d=""),o&&"#"!==o[0]&&(o="#"+o),p&&"?"!==p[0]&&(p="?"+p),i=i.replace(/[?#]/g,encodeURIComponent),p=p.replace("#","%23"),`${r}${d}${i}${p}${o}`}let l=["auth","hash","host","hostname","href","path","pathname","port","protocol","query","search","slashes"];function d(e){return o(e)}},573668,(e,t,a)=>{"use strict";Object.defineProperty(a,"__esModule",{value:!0}),Object.defineProperty(a,"isLocalURL",{enumerable:!0,get:function(){return n}});let r=e.r(718967),i=e.r(652817);function n(e){if(!(0,r.isAbsoluteUrl)(e))return!0;try{let t=(0,r.getLocationOrigin)(),a=new URL(e,t);return a.origin===t&&(0,i.hasBasePath)(a.pathname)}catch(e){return!1}}},284508,(e,t,a)=>{"use strict";Object.defineProperty(a,"__esModule",{value:!0}),Object.defineProperty(a,"errorOnce",{enumerable:!0,get:function(){return r}});let r=e=>{}},522016,(e,t,a)=>{"use strict";Object.defineProperty(a,"__esModule",{value:!0});var r={default:function(){return x},useLinkStatus:function(){return y}};for(var i in r)Object.defineProperty(a,i,{enumerable:!0,get:r[i]});let n=e.r(190809),s=e.r(843476),o=n._(e.r(271645)),l=e.r(195057),d=e.r(8372),p=e.r(818581),c=e.r(718967),u=e.r(405550);e.r(233525);let m=e.r(388540),f=e.r(91949),h=e.r(573668),g=e.r(509396);function x(t){var a,r;let i,n,x,[y,v]=(0,o.useOptimistic)(f.IDLE_LINK_STATUS),w=(0,o.useRef)(null),{href:j,as:_,children:k,prefetch:C=null,passHref:S,replace:N,shallow:E,scroll:P,onClick:O,onMouseEnter:z,onTouchStart:$,legacyBehavior:M=!1,onNavigate:A,transitionTypes:R,ref:T,unstable_dynamicOnHover:D,...q}=t;i=k,M&&("string"==typeof i||"number"==typeof i)&&(i=(0,s.jsx)("a",{children:i}));let I=o.default.useContext(d.AppRouterContext),L=!1!==C,U=!1!==C?null===(r=C)||"auto"===r?g.FetchStrategy.PPR:g.FetchStrategy.Full:g.FetchStrategy.PPR,F="string"==typeof(a=_||j)?a:(0,l.formatUrl)(a);if(M){if(i?.$$typeof===Symbol.for("react.lazy"))throw Object.defineProperty(Error("`<Link legacyBehavior>` received a direct child that is either a Server Component, or JSX that was loaded with React.lazy(). This is not supported. Either remove legacyBehavior, or make the direct child a Client Component that renders the Link's `<a>` tag."),"__NEXT_ERROR_CODE",{value:"E863",enumerable:!1,configurable:!0});n=o.default.Children.only(i)}let B=M?n&&"object"==typeof n&&n.ref:T,H=o.default.useCallback(e=>(null!==I&&(w.current=(0,f.mountLinkInstance)(e,F,I,U,L,v)),()=>{w.current&&((0,f.unmountLinkForCurrentNavigation)(w.current),w.current=null),(0,f.unmountPrefetchableInstance)(e)}),[L,F,I,U,v]),Q={ref:(0,p.useMergedRef)(H,B),onClick(t){M||"function"!=typeof O||O(t),M&&n.props&&"function"==typeof n.props.onClick&&n.props.onClick(t),!I||t.defaultPrevented||function(t,a,r,i,n,s,l){if("u">typeof window){let d,{nodeName:p}=t.currentTarget;if("A"===p.toUpperCase()&&((d=t.currentTarget.getAttribute("target"))&&"_self"!==d||t.metaKey||t.ctrlKey||t.shiftKey||t.altKey||t.nativeEvent&&2===t.nativeEvent.which)||t.currentTarget.hasAttribute("download"))return;if(!(0,h.isLocalURL)(a)){i&&(t.preventDefault(),location.replace(a));return}if(t.preventDefault(),s){let e=!1;if(s({preventDefault:()=>{e=!0}}),e)return}let{dispatchNavigateAction:c}=e.r(699781);o.default.startTransition(()=>{c(a,i?"replace":"push",!1===n?m.ScrollBehavior.NoScroll:m.ScrollBehavior.Default,r.current,l)})}}(t,F,w,N,P,A,R)},onMouseEnter(e){M||"function"!=typeof z||z(e),M&&n.props&&"function"==typeof n.props.onMouseEnter&&n.props.onMouseEnter(e),I&&L&&(0,f.onNavigationIntent)(e.currentTarget,!0===D)},onTouchStart:function(e){M||"function"!=typeof $||$(e),M&&n.props&&"function"==typeof n.props.onTouchStart&&n.props.onTouchStart(e),I&&L&&(0,f.onNavigationIntent)(e.currentTarget,!0===D)}};return(0,c.isAbsoluteUrl)(F)?Q.href=F:M&&!S&&("a"!==n.type||"href"in n.props)||(Q.href=(0,u.addBasePath)(F)),x=M?o.default.cloneElement(n,Q):(0,s.jsx)("a",{...q,...Q,children:i}),(0,s.jsx)(b.Provider,{value:y,children:x})}e.r(284508);let b=(0,o.createContext)(f.IDLE_LINK_STATUS),y=()=>(0,o.useContext)(b);("function"==typeof a.default||"object"==typeof a.default&&null!==a.default)&&void 0===a.default.__esModule&&(Object.defineProperty(a.default,"__esModule",{value:!0}),Object.assign(a.default,a),t.exports=a.default)},396661,505014,e=>{"use strict";let t=(...e)=>e.filter((e,t,a)=>!!e&&""!==e.trim()&&a.indexOf(e)===t).join(" ").trim();e.s(["mergeClasses",0,t],396661);var a=e.i(271645),r={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};let i=(0,a.createContext)({}),n=(0,a.forwardRef)(({color:e,size:n,strokeWidth:s,absoluteStrokeWidth:o,className:l="",children:d,iconNode:p,...c},u)=>{let{size:m=24,strokeWidth:f=2,absoluteStrokeWidth:h=!1,color:g="currentColor",className:x=""}=(0,a.useContext)(i)??{},b=o??h?24*Number(s??f)/Number(n??m):s??f;return(0,a.createElement)("svg",{ref:u,...r,width:n??m??r.width,height:n??m??r.height,stroke:e??g,strokeWidth:b,className:t("lucide",x,l),...!d&&!(e=>{for(let t in e)if(t.startsWith("aria-")||"role"===t||"title"===t)return!0;return!1})(c)&&{"aria-hidden":"true"},...c},[...p.map(([e,t])=>(0,a.createElement)(e,t)),...Array.isArray(d)?d:[d]])});e.s(["default",0,n],505014)},618566,(e,t,a)=>{t.exports=e.r(976562)},146387,456420,e=>{"use strict";var t=e.i(271645),a=e.i(396661);let r=e=>{let t=e.replace(/^([A-Z])|[\s-_]+(\w)/g,(e,t,a)=>a?a.toUpperCase():t.toLowerCase());return t.charAt(0).toUpperCase()+t.slice(1)};var i=e.i(505014);let n=(e,n)=>{let s=(0,t.forwardRef)(({className:s,...o},l)=>(0,t.createElement)(i.default,{ref:l,iconNode:n,className:(0,a.mergeClasses)(`lucide-${r(e).replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase()}`,`lucide-${e}`,s),...o}));return s.displayName=r(e),s};e.s(["default",0,n],456420);let s=n("building-2",[["path",{d:"M10 12h4",key:"a56b0p"}],["path",{d:"M10 8h4",key:"1sr2af"}],["path",{d:"M14 21v-3a2 2 0 0 0-4 0v3",key:"1rgiei"}],["path",{d:"M6 10H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2",key:"secmi2"}],["path",{d:"M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16",key:"16ra0t"}]]);e.s(["Building2",0,s],146387)},818581,(e,t,a)=>{"use strict";Object.defineProperty(a,"__esModule",{value:!0}),Object.defineProperty(a,"useMergedRef",{enumerable:!0,get:function(){return i}});let r=e.r(271645);function i(e,t){let a=(0,r.useRef)(null),i=(0,r.useRef)(null);return(0,r.useCallback)(r=>{if(null===r){let e=a.current;e&&(a.current=null,e());let t=i.current;t&&(i.current=null,t())}else e&&(a.current=n(e,r)),t&&(i.current=n(t,r))},[e,t])}function n(e,t){if("function"!=typeof e)return e.current=t,()=>{e.current=null};{let a=e(t);return"function"==typeof a?a:()=>e(null)}}("function"==typeof a.default||"object"==typeof a.default&&null!==a.default)&&void 0===a.default.__esModule&&(Object.defineProperty(a.default,"__esModule",{value:!0}),Object.assign(a.default,a),t.exports=a.default)},823482,e=>{"use strict";let t=(0,e.i(456420).default)("graduation-cap",[["path",{d:"M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z",key:"j76jl0"}],["path",{d:"M22 10v6",key:"1lu8f3"}],["path",{d:"M6 12.5V16a6 3 0 0 0 12 0v-3.5",key:"1r8lef"}]]);e.s(["GraduationCap",0,t],823482)},263676,e=>{"use strict";let t=(0,e.i(456420).default)("x",[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]]);e.s(["X",0,t],263676)},370812,e=>{"use strict";let t=(0,e.i(456420).default)("bell",[["path",{d:"M10.268 21a2 2 0 0 0 3.464 0",key:"vwvbt9"}],["path",{d:"M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326",key:"11g9vi"}]]);e.s(["Bell",0,t],370812)},716327,867927,e=>{"use strict";var t=e.i(456420);let a=(0,t.default)("chevron-down",[["path",{d:"m6 9 6 6 6-6",key:"qrunsl"}]]);e.s(["ChevronDown",0,a],716327);let r=(0,t.default)("chevron-right",[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]]);e.s(["ChevronRight",0,r],867927)},55677,e=>{"use strict";let t=(0,e.i(456420).default)("clipboard-list",[["rect",{width:"8",height:"4",x:"8",y:"2",rx:"1",ry:"1",key:"tgr4d6"}],["path",{d:"M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",key:"116196"}],["path",{d:"M12 11h4",key:"1jrz19"}],["path",{d:"M12 16h4",key:"n85exb"}],["path",{d:"M8 11h.01",key:"1dfujw"}],["path",{d:"M8 16h.01",key:"18s6g9"}]]);e.s(["ClipboardList",0,t],55677)},166794,e=>{"use strict";let t=(0,e.i(456420).default)("settings",[["path",{d:"M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915",key:"1i5ecw"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);e.s(["Settings",0,t],166794)},584026,e=>{"use strict";let t=(0,e.i(456420).default)("shield-check",[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]]);e.s(["ShieldCheck",0,t],584026)},779432,e=>{"use strict";let t=(0,e.i(456420).default)("activity",[["path",{d:"M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2",key:"169zse"}]]);e.s(["Activity",0,t],779432)},367784,593583,e=>{"use strict";var t=e.i(456420);let a=(0,t.default)("log-out",[["path",{d:"m16 17 5-5-5-5",key:"1bji2h"}],["path",{d:"M21 12H9",key:"dn1m92"}],["path",{d:"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",key:"1uf3rs"}]]);e.s(["LogOut",0,a],367784);let r=(0,t.default)("menu",[["path",{d:"M4 5h16",key:"1tepv9"}],["path",{d:"M4 12h16",key:"1lakjw"}],["path",{d:"M4 19h16",key:"1djgab"}]]);e.s(["Menu",0,r],593583)},749803,e=>{"use strict";let t=(0,e.i(456420).default)("chart-column",[["path",{d:"M3 3v16a2 2 0 0 0 2 2h16",key:"c24i48"}],["path",{d:"M18 17V9",key:"2bz60n"}],["path",{d:"M13 17V5",key:"1frdt8"}],["path",{d:"M8 17v-3",key:"17ska0"}]]);e.s(["BarChart3",0,t],749803)},566595,e=>{"use strict";let t=(0,e.i(456420).default)("search",[["path",{d:"m21 21-4.34-4.34",key:"14j7rj"}],["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}]]);e.s(["Search",0,t],566595)},705766,e=>{"use strict";let t,a;var r,i=e.i(271645);let n={data:""},s=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,o=/\/\*[^]*?\*\/|  +/g,l=/\n+/g,d=(e,t)=>{let a="",r="",i="";for(let n in e){let s=e[n];"@"==n[0]?"i"==n[1]?a=n+" "+s+";":r+="f"==n[1]?d(s,n):n+"{"+d(s,"k"==n[1]?"":t)+"}":"object"==typeof s?r+=d(s,t?t.replace(/([^,])+/g,e=>n.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,t=>/&/.test(t)?t.replace(/&/g,e):e?e+" "+t:t)):n):null!=s&&(n="-"==n[1]?n:n.replace(/[A-Z]/g,"-$&").toLowerCase(),i+=d.p?d.p(n,s):n+":"+s+";")}return a+(t&&i?t+"{"+i+"}":i)+r},p={},c=e=>{if("object"==typeof e){let t="";for(let a in e)t+=a+c(e[a]);return t}return e};function u(e){let t,a,r=this||{},i=e.call?e(r.p):e;return((e,t,a,r,i)=>{var n;let u=c(e),m=p[u]||(p[u]=(e=>{let t=0,a=11;for(;t<e.length;)a=101*a+e.charCodeAt(t++)>>>0;return"go"+a})(u));if(!p[m]){let t=u!==e?e:(e=>{let t,a,r=[{}];for(;t=s.exec(e.replace(o,""));)t[4]?r.shift():t[3]?(a=t[3].replace(l," ").trim(),r.unshift(r[0][a]=r[0][a]||{})):r[0][t[1]]=t[2].replace(l," ").trim();return r[0]})(e);p[m]=d(i?{["@keyframes "+m]:t}:t,a?"":"."+m)}let f=a&&p.g;return a&&(p.g=p[m]),n=p[m],f?t.data=t.data.replace(f,n):-1===t.data.indexOf(n)&&(t.data=r?n+t.data:t.data+n),m})(i.unshift?i.raw?(t=[].slice.call(arguments,1),a=r.p,i.reduce((e,r,i)=>{let n=t[i];if(n&&n.call){let e=n(a),t=e&&e.props&&e.props.className||/^go/.test(e)&&e;n=t?"."+t:e&&"object"==typeof e?e.props?"":d(e,""):!1===e?"":e}return e+r+(null==n?"":n)},"")):i.reduce((e,t)=>Object.assign(e,t&&t.call?t(r.p):t),{}):i,(e=>{if("object"==typeof window){let t=(e?e.querySelector("#_goober"):window._goober)||Object.assign(document.createElement("style"),{innerHTML:" ",id:"_goober"});return t.nonce=window.__nonce__,t.parentNode||(e||document.head).appendChild(t),t.firstChild}return e||n})(r.target),r.g,r.o,r.k)}u.bind({g:1});let m,f,h,g=u.bind({k:1});function x(e,t){let a=this||{};return function(){let r=arguments;function i(n,s){let o=Object.assign({},n),l=o.className||i.className;a.p=Object.assign({theme:f&&f()},o),a.o=/go\d/.test(l),o.className=u.apply(a,r)+(l?" "+l:""),t&&(o.ref=s);let d=e;return e[0]&&(d=o.as||e,delete o.as),h&&d[0]&&h(o),m(d,o)}return t?t(i):i}}var b=(e,t)=>"function"==typeof e?e(t):e,y=(t=0,()=>(++t).toString()),v=()=>{if(void 0===a&&"u">typeof window){let e=matchMedia("(prefers-reduced-motion: reduce)");a=!e||e.matches}return a},w="default",j=(e,t)=>{let{toastLimit:a}=e.settings;switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,a)};case 1:return{...e,toasts:e.toasts.map(e=>e.id===t.toast.id?{...e,...t.toast}:e)};case 2:let{toast:r}=t;return j(e,{type:+!!e.toasts.find(e=>e.id===r.id),toast:r});case 3:let{toastId:i}=t;return{...e,toasts:e.toasts.map(e=>e.id===i||void 0===i?{...e,dismissed:!0,visible:!1}:e)};case 4:return void 0===t.toastId?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(e=>e.id!==t.toastId)};case 5:return{...e,pausedAt:t.time};case 6:let n=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(e=>({...e,pauseDuration:e.pauseDuration+n}))}}},_=[],k={toasts:[],pausedAt:void 0,settings:{toastLimit:20}},C={},S=(e,t=w)=>{C[t]=j(C[t]||k,e),_.forEach(([e,a])=>{e===t&&a(C[t])})},N=e=>Object.keys(C).forEach(t=>S(e,t)),E=(e=w)=>t=>{S(t,e)},P={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},O=e=>(t,a)=>{let r,i=((e,t="blank",a)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:t,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...a,id:(null==a?void 0:a.id)||y()}))(t,e,a);return E(i.toasterId||(r=i.id,Object.keys(C).find(e=>C[e].toasts.some(e=>e.id===r))))({type:2,toast:i}),i.id},z=(e,t)=>O("blank")(e,t);z.error=O("error"),z.success=O("success"),z.loading=O("loading"),z.custom=O("custom"),z.dismiss=(e,t)=>{let a={type:3,toastId:e};t?E(t)(a):N(a)},z.dismissAll=e=>z.dismiss(void 0,e),z.remove=(e,t)=>{let a={type:4,toastId:e};t?E(t)(a):N(a)},z.removeAll=e=>z.remove(void 0,e),z.promise=(e,t,a)=>{let r=z.loading(t.loading,{...a,...null==a?void 0:a.loading});return"function"==typeof e&&(e=e()),e.then(e=>{let i=t.success?b(t.success,e):void 0;return i?z.success(i,{id:r,...a,...null==a?void 0:a.success}):z.dismiss(r),e}).catch(e=>{let i=t.error?b(t.error,e):void 0;i?z.error(i,{id:r,...a,...null==a?void 0:a.error}):z.dismiss(r)}),e};var $=1e3,M=g`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,A=g`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,R=g`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,T=x("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${M} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${A} 0.15s ease-out forwards;
    animation-delay: 150ms;
    position: absolute;
    border-radius: 3px;
    opacity: 0;
    background: ${e=>e.secondary||"#fff"};
    bottom: 9px;
    left: 4px;
    height: 2px;
    width: 12px;
  }

  &:before {
    animation: ${R} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,D=g`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,q=x("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||"#e0e0e0"};
  border-right-color: ${e=>e.primary||"#616161"};
  animation: ${D} 1s linear infinite;
`,I=g`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,L=g`
0% {
	height: 0;
	width: 0;
	opacity: 0;
}
40% {
  height: 0;
	width: 6px;
	opacity: 1;
}
100% {
  opacity: 1;
  height: 10px;
}`,U=x("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${I} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${L} 0.2s ease-out forwards;
    opacity: 0;
    animation-delay: 200ms;
    position: absolute;
    border-right: 2px solid;
    border-bottom: 2px solid;
    border-color: ${e=>e.secondary||"#fff"};
    bottom: 6px;
    left: 6px;
    height: 10px;
    width: 6px;
  }
`,F=x("div")`
  position: absolute;
`,B=x("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,H=g`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,Q=x("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${H} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,W=({toast:e})=>{let{icon:t,type:a,iconTheme:r}=e;return void 0!==t?"string"==typeof t?i.createElement(Q,null,t):t:"blank"===a?null:i.createElement(B,null,i.createElement(q,{...r}),"loading"!==a&&i.createElement(F,null,"error"===a?i.createElement(T,{...r}):i.createElement(U,{...r})))},V=x("div")`
  display: flex;
  align-items: center;
  background: #fff;
  color: #363636;
  line-height: 1.3;
  will-change: transform;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);
  max-width: 350px;
  pointer-events: auto;
  padding: 8px 10px;
  border-radius: 8px;
`,G=x("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,J=i.memo(({toast:e,position:t,style:a,children:r})=>{let n=e.height?((e,t)=>{let a=e.includes("top")?1:-1,[r,i]=v()?["0%{opacity:0;} 100%{opacity:1;}","0%{opacity:1;} 100%{opacity:0;}"]:[`
0% {transform: translate3d(0,${-200*a}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${-150*a}%,-1px) scale(.6); opacity:0;}
`];return{animation:t?`${g(r)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${g(i)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}})(e.position||t||"top-center",e.visible):{opacity:0},s=i.createElement(W,{toast:e}),o=i.createElement(G,{...e.ariaProps},b(e.message,e));return i.createElement(V,{className:e.className,style:{...n,...a,...e.style}},"function"==typeof r?r({icon:s,message:o}):i.createElement(i.Fragment,null,s,o))});r=i.createElement,d.p=void 0,m=r,f=void 0,h=void 0;var X=({id:e,className:t,style:a,onHeightUpdate:r,children:n})=>{let s=i.useCallback(t=>{if(t){let a=()=>{r(e,t.getBoundingClientRect().height)};a(),new MutationObserver(a).observe(t,{subtree:!0,childList:!0,characterData:!0})}},[e,r]);return i.createElement("div",{ref:s,className:t,style:a},n)},K=u`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`;e.s(["Toaster",0,({reverseOrder:e,position:t="top-center",toastOptions:a,gutter:r,children:n,toasterId:s,containerStyle:o,containerClassName:l})=>{let{toasts:d,handlers:p}=((e,t="default")=>{let{toasts:a,pausedAt:r}=((e={},t=w)=>{let[a,r]=(0,i.useState)(C[t]||k),n=(0,i.useRef)(C[t]);(0,i.useEffect)(()=>(n.current!==C[t]&&r(C[t]),_.push([t,r]),()=>{let e=_.findIndex(([e])=>e===t);e>-1&&_.splice(e,1)}),[t]);let s=a.toasts.map(t=>{var a,r,i;return{...e,...e[t.type],...t,removeDelay:t.removeDelay||(null==(a=e[t.type])?void 0:a.removeDelay)||(null==e?void 0:e.removeDelay),duration:t.duration||(null==(r=e[t.type])?void 0:r.duration)||(null==e?void 0:e.duration)||P[t.type],style:{...e.style,...null==(i=e[t.type])?void 0:i.style,...t.style}}});return{...a,toasts:s}})(e,t),n=(0,i.useRef)(new Map).current,s=(0,i.useCallback)((e,t=$)=>{if(n.has(e))return;let a=setTimeout(()=>{n.delete(e),o({type:4,toastId:e})},t);n.set(e,a)},[]);(0,i.useEffect)(()=>{if(r)return;let e=Date.now(),i=a.map(a=>{if(a.duration===1/0)return;let r=(a.duration||0)+a.pauseDuration-(e-a.createdAt);if(r<0){a.visible&&z.dismiss(a.id);return}return setTimeout(()=>z.dismiss(a.id,t),r)});return()=>{i.forEach(e=>e&&clearTimeout(e))}},[a,r,t]);let o=(0,i.useCallback)(E(t),[t]),l=(0,i.useCallback)(()=>{o({type:5,time:Date.now()})},[o]),d=(0,i.useCallback)((e,t)=>{o({type:1,toast:{id:e,height:t}})},[o]),p=(0,i.useCallback)(()=>{r&&o({type:6,time:Date.now()})},[r,o]),c=(0,i.useCallback)((e,t)=>{let{reverseOrder:r=!1,gutter:i=8,defaultPosition:n}=t||{},s=a.filter(t=>(t.position||n)===(e.position||n)&&t.height),o=s.findIndex(t=>t.id===e.id),l=s.filter((e,t)=>t<o&&e.visible).length;return s.filter(e=>e.visible).slice(...r?[l+1]:[0,l]).reduce((e,t)=>e+(t.height||0)+i,0)},[a]);return(0,i.useEffect)(()=>{a.forEach(e=>{if(e.dismissed)s(e.id,e.removeDelay);else{let t=n.get(e.id);t&&(clearTimeout(t),n.delete(e.id))}})},[a,s]),{toasts:a,handlers:{updateHeight:d,startPause:l,endPause:p,calculateOffset:c}}})(a,s);return i.createElement("div",{"data-rht-toaster":s||"",style:{position:"fixed",zIndex:9999,top:16,left:16,right:16,bottom:16,pointerEvents:"none",...o},className:l,onMouseEnter:p.startPause,onMouseLeave:p.endPause},d.map(a=>{let s,o,l=a.position||t,d=p.calculateOffset(a,{reverseOrder:e,gutter:r,defaultPosition:t}),c=(s=l.includes("top"),o=l.includes("center")?{justifyContent:"center"}:l.includes("right")?{justifyContent:"flex-end"}:{},{left:0,right:0,display:"flex",position:"absolute",transition:v()?void 0:"all 230ms cubic-bezier(.21,1.02,.73,1)",transform:`translateY(${d*(s?1:-1)}px)`,...s?{top:0}:{bottom:0},...o});return i.createElement(X,{id:a.id,key:a.id,onHeightUpdate:p.updateHeight,className:a.visible?K:"",style:c},"custom"===a.type?b(a.message,a):n?n(a):i.createElement(J,{toast:a,position:l}))}))},"default",0,z,"toast",0,z],705766)},920476,e=>{"use strict";async function t(e,t){let a=await fetch(e,t),r=await a.json().catch(()=>null);if(!a.ok)throw Error(r?.error||r?.message||`Request failed with ${a.status}`);return r}e.s(["apiJson",0,t,"errorMessage",0,function(e,t="Something went wrong"){return e instanceof Error?e.message:t}])},730274,e=>{"use strict";let t=(0,e.i(456420).default)("send",[["path",{d:"M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",key:"1ffxy3"}],["path",{d:"m21.854 2.147-10.94 10.939",key:"12cjpa"}]]);e.s(["Send",0,t],730274)},856423,e=>{"use strict";let t=(0,e.i(456420).default)("book-open",[["path",{d:"M12 7v14",key:"1akyts"}],["path",{d:"M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z",key:"ruj8y"}]]);e.s(["BookOpen",0,t],856423)},772382,e=>{"use strict";let t=(0,e.i(456420).default)("eye",[["path",{d:"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",key:"1nclc0"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);e.s(["Eye",0,t],772382)},462047,e=>{"use strict";var t=e.i(705766);e.s(["notify",0,{success:e=>t.default.success(e),error:e=>t.default.error(e),warning:e=>(0,t.default)(e,{icon:"⚠️"}),info:e=>(0,t.default)(e,{icon:"ℹ️"})}])},77071,e=>{"use strict";let t=(0,e.i(456420).default)("plus",[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"M12 5v14",key:"s699le"}]]);e.s(["Plus",0,t],77071)},77043,e=>{"use strict";let t=(0,e.i(456420).default)("printer",[["path",{d:"M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2",key:"143wyd"}],["path",{d:"M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6",key:"1itne7"}],["rect",{x:"6",y:"14",width:"12",height:"8",rx:"1",key:"1ue0tg"}]]);e.s(["Printer",0,t],77043)},573474,e=>{"use strict";let t=(0,e.i(456420).default)("trash-2",[["path",{d:"M10 11v6",key:"nco0om"}],["path",{d:"M14 11v6",key:"outv1u"}],["path",{d:"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6",key:"miytrc"}],["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",key:"e791ji"}]]);e.s(["Trash2",0,t],573474)},647629,e=>{"use strict";var t=e.i(462047);async function a({title:e,subtitle:s,documentLabel:o,metaHtml:l,bodyHtml:d,footerHtml:p,popupError:c="Allow popups to print this document.",pageSize:u="full",verificationUrl:m,barcodeValue:f}){var h;let g=window.open("","_blank","half"===u?"width=760,height=620":"width=980,height=760");if(!g)return void t.notify.error(c);g.document.open(),g.document.write((h=e,`
    <html>
      <head>
        <title>${r(h)}</title>
        <style>
          body{font-family:Arial,sans-serif;display:grid;min-height:100vh;place-items:center;color:#04142E}
          div{border:1px solid #e5e7eb;border-radius:16px;padding:24px 28px;box-shadow:0 20px 60px rgba(15,23,42,.12)}
          strong{display:block;font-size:18px}
          span{display:block;margin-top:6px;color:#64748b}
        </style>
      </head>
      <body>
        <div>
          <strong>Preparing ${r(h)}</strong>
          <span>Loading school branding...</span>
        </div>
      </body>
    </html>
  `)),g.document.close();let x=await i(),b=m?await n(m):null;g.document.open(),g.document.write(function({branding:e,title:t,subtitle:a,documentLabel:i,metaHtml:n,bodyHtml:s,footerHtml:o,pageSize:l="full",verificationUrl:d,barcodeValue:p,qrDataUrl:c}){let u=e.schoolName||e.product||"TOTTECH ONE",m=e.schoolCode||e.tagline||"Gateway To Learning",f=e.logoUrl||"/images/logo.png",h=e.primaryColor||"#04142E",g=e.secondaryColor||"#D4AF37",x=[e.address,e.phone,e.email].filter(Boolean).join(" | ");return"half"===l?function({title:e,subtitle:t,documentLabel:a,metaHtml:i,bodyHtml:n,footerHtml:s,schoolName:o,schoolCode:l,logoUrl:d,contact:p,verificationUrl:c,barcodeValue:u,qrDataUrl:m}){let f=f=>`
    <section class="copy">
      <header class="copy-header">
        <img class="copy-logo" src="${r(d)}" alt="${r(o)} logo" />
        <div class="copy-school">
          <h1>${r(o)}</h1>
          <p>${r(l)}</p>
          ${p?`<span>${r(p)}</span>`:""}
        </div>
        <div class="copy-title">
          <strong>${r(a||e)}</strong>
          <span>${r(f)}</span>
        </div>
      </header>
      <div class="copy-main">
        <div class="copy-intro">
          <h2>${r(e)}</h2>
          ${t?`<p>${r(t)}</p>`:""}
        </div>
        ${i||""}
        <div class="print-body">${n}</div>
        ${c||m?`<div class="verify-row">
                ${m?`<img class="qr" src="${r(m)}" alt="QR verification" />`:""}
                <div>
                  <div class="barcode">${(u||e||"TOTTECH").slice(0,42).split("").map((e,t)=>{let a=e.charCodeAt(0);return Array.from({length:5}).map((e,r)=>{let i=(a>>r&1)==1||(t+r)%4==0;return`<span style="display:inline-block;width:${i?2:1}px;height:18px;background:${i?"#111":"transparent"};margin-right:1px"></span>`}).join("")}).join("")}</div>
                  <p>${r(c||"")}</p>
                </div>
              </div>`:""}
      </div>
      <footer class="copy-footer">
        <span>${r(f)}</span>
        <span>Generated by TOTTECH ONE</span>
      </footer>
      ${s||""}
    </section>
  `;return`
    <html>
      <head>
        <title>${r(e)}</title>
        <style>
          *{box-sizing:border-box}
          body{margin:0;background:#fff;color:#111;font-family:Arial,Helvetica,sans-serif}
          .sheet{width:210mm;height:297mm;margin:0 auto;padding:8mm;background:#fff}
          .copy{height:136mm;border:1px solid #111;padding:5mm;display:flex;flex-direction:column;overflow:hidden;break-inside:avoid}
          .cut-line{height:9mm;display:flex;align-items:center;justify-content:center;color:#111;font-size:9px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;position:relative}
          .cut-line:before{content:"";position:absolute;left:0;right:0;top:50%;border-top:1px dashed #111}
          .cut-line span{position:relative;background:#fff;padding:0 8px}
          .copy-header{display:grid;grid-template-columns:16mm 1fr 38mm;gap:4mm;align-items:center;border-bottom:1px solid #111;padding-bottom:3mm}
          .copy-logo{width:16mm;height:16mm;object-fit:contain;filter:grayscale(1);border:1px solid #999;padding:1mm}
          .copy-school h1{margin:0;font-size:15px;line-height:1.1;font-weight:900;text-transform:uppercase}
          .copy-school p{margin:1mm 0 0;font-size:8px;font-weight:800;letter-spacing:.14em;text-transform:uppercase}
          .copy-school span{display:block;margin-top:1mm;font-size:7.5px;color:#333;line-height:1.2}
          .copy-title{text-align:right;border:1px solid #111;padding:2mm}
          .copy-title strong{display:block;font-size:10px;text-transform:uppercase}
          .copy-title span{display:block;margin-top:2mm;font-size:8px;font-weight:900;letter-spacing:.12em}
          .copy-main{flex:1;min-height:0}
          .copy-intro{display:flex;align-items:flex-start;justify-content:space-between;gap:6mm;margin:3mm 0 1mm}
          .copy-intro h2{margin:0;font-size:14px;line-height:1.1}
          .copy-intro p{margin:0;max-width:76mm;font-size:8px;color:#333;text-align:right}
          .print-meta-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:2mm;margin:2mm 0}
          .print-meta-card{border:1px solid #999;padding:1.6mm;min-width:0}
          .print-meta-card span{display:block;font-size:6.5px;font-weight:900;text-transform:uppercase;color:#444}
          .print-meta-card strong{display:block;margin-top:1mm;font-size:8px;line-height:1.15;word-break:break-word}
          .print-body{font-size:8px;line-height:1.22}
          .verify-row{display:flex;align-items:center;gap:3mm;margin-top:2mm;border-top:1px solid #999;padding-top:2mm}
          .qr{width:16mm;height:16mm;object-fit:contain}
          .barcode{height:18px;white-space:nowrap;overflow:hidden}
          .verify-row p{margin:1mm 0 0;font-size:6px;color:#333;word-break:break-all}
          .print-panel{border:1px solid #999;padding:2mm;margin-top:2mm}
          .print-section-title{font-size:9px;margin:2.5mm 0 1.5mm;font-weight:900}
          table{width:100%;border-collapse:collapse;margin:1.5mm 0 2.5mm}
          th,td{border:1px solid #999;padding:1.5mm;text-align:left;font-size:7.5px;line-height:1.16}
          th{font-size:6.5px;font-weight:900;text-transform:uppercase;background:#eee}
          .right{text-align:right}
          .summary,.print-summary{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:2mm;margin:2mm 0}
          .summary div,.print-summary div{border:1px solid #999;padding:1.5mm;font-size:6.5px;font-weight:900;text-transform:uppercase}
          .summary strong,.print-summary strong{display:block;margin-top:1mm;font-size:9px;text-transform:none}
          .sign,.print-signature{margin-top:9mm;text-align:right;font-weight:900}
          .copy-footer{display:flex;justify-content:space-between;border-top:1px solid #111;padding-top:2mm;font-size:7px;font-weight:800;text-transform:uppercase}
          @page{size:A4 portrait;margin:0}
          @media print{
            body{margin:0}
            .sheet{width:210mm;height:297mm;margin:0;padding:8mm}
          }
        </style>
      </head>
      <body>
        <main class="sheet">
          ${f("PARENT COPY")}
          <div class="cut-line"><span>Cut Here</span></div>
          ${f("SCHOOL RECORD COPY")}
        </main>
      </body>
    </html>
  `}({title:t,subtitle:a,documentLabel:i,metaHtml:n,bodyHtml:s,footerHtml:o,schoolName:u,schoolCode:m,logoUrl:f,contact:x,verificationUrl:d,barcodeValue:p,qrDataUrl:c}):`
    <html>
      <head>
        <title>${r(t)}</title>
        <style>
          :root{--print-primary:${h};--print-gold:${g};--print-ink:#071426;--print-muted:#64748b;--print-line:#d8dee8;--print-soft:#f8fafc}
          *{box-sizing:border-box}
          body{margin:0;background:#f3f6fb;color:var(--print-ink);font-family:Inter,Arial,sans-serif;-webkit-print-color-adjust:exact;print-color-adjust:exact}
          .print-page{width:min(1080px,calc(100% - 32px));margin:24px auto;background:#fff;border:1px solid var(--print-line);border-radius:24px;overflow:hidden;box-shadow:0 24px 80px rgba(15,23,42,.14)}
          .print-page.half-page{width:min(720px,calc(100% - 24px));margin:14px auto;border-radius:18px}
          .print-brand{display:flex;align-items:center;justify-content:space-between;gap:24px;padding:26px 30px;background:linear-gradient(135deg,var(--print-primary),#071426 62%,#2c2413);color:#fff}
          .half-page .print-brand{gap:14px;padding:14px 18px}
          .print-brand-left{display:flex;align-items:center;gap:18px;min-width:0}
          .half-page .print-brand-left{gap:12px}
          .print-logo{width:74px;height:74px;object-fit:contain;border-radius:18px;background:#fff;padding:8px;box-shadow:0 12px 28px rgba(0,0,0,.28)}
          .half-page .print-logo{width:48px;height:48px;border-radius:12px;padding:5px}
          .print-school{min-width:0}
          .print-school h1{margin:0;color:#fff;font-size:28px;line-height:1.05;font-weight:900;letter-spacing:.01em}
          .half-page .print-school h1{font-size:18px}
          .print-school p{margin:7px 0 0;color:rgba(255,255,255,.82);font-size:12px;font-weight:900;letter-spacing:.18em;text-transform:uppercase}
          .half-page .print-school p{margin-top:4px;font-size:8px;letter-spacing:.12em}
          .print-document-badge{border:1px solid rgba(212,175,55,.7);background:rgba(212,175,55,.13);border-radius:18px;padding:12px 16px;text-align:right;min-width:180px}
          .half-page .print-document-badge{min-width:118px;border-radius:12px;padding:8px 10px}
          .print-document-badge span{display:block;color:var(--print-gold);font-size:11px;font-weight:900;letter-spacing:.18em;text-transform:uppercase}
          .half-page .print-document-badge span{font-size:7px;letter-spacing:.12em}
          .print-document-badge strong{display:block;margin-top:4px;color:#fff;font-size:13px}
          .half-page .print-document-badge strong{font-size:9px}
          .print-title{padding:26px 30px 10px}
          .half-page .print-title{padding:14px 18px 4px}
          .print-title .eyebrow{margin:0 0 8px;color:var(--print-gold);font-size:12px;font-weight:900;letter-spacing:.16em;text-transform:uppercase}
          .half-page .print-title .eyebrow{margin-bottom:4px;font-size:8px}
          .print-title h2{margin:0;color:var(--print-ink);font-size:30px;line-height:1.12;font-weight:950}
          .half-page .print-title h2{font-size:18px}
          .print-title p{margin:8px 0 0;color:var(--print-muted);font-size:14px;font-weight:700}
          .half-page .print-title p{margin-top:4px;font-size:10px}
          .print-meta-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;padding:16px 30px 4px}
          .half-page .print-meta-grid{grid-template-columns:repeat(4,minmax(0,1fr));gap:6px;padding:8px 18px 2px}
          .print-meta-card{border:1px solid var(--print-line);border-radius:14px;background:linear-gradient(180deg,#fff,#f8fafc);padding:12px 14px;min-width:0}
          .half-page .print-meta-card{border-radius:9px;padding:6px 7px}
          .print-meta-card span{display:block;color:var(--print-muted);font-size:10px;font-weight:900;letter-spacing:.12em;text-transform:uppercase}
          .half-page .print-meta-card span{font-size:7px;letter-spacing:.08em}
          .print-meta-card strong{display:block;margin-top:6px;color:var(--print-ink);font-size:14px;line-height:1.25;word-break:break-word}
          .half-page .print-meta-card strong{margin-top:3px;font-size:9px;line-height:1.15}
          .print-body{padding:22px 30px 30px}
          .half-page .print-body{padding:10px 18px 18px}
          .print-section{margin-top:18px}
          .half-page .print-section{margin-top:8px}
          .print-section:first-child{margin-top:0}
          .print-section-title{margin:0 0 10px;color:var(--print-ink);font-size:17px;font-weight:950}
          .half-page .print-section-title{margin-bottom:5px;font-size:11px}
          .print-panel{border:1px solid var(--print-line);border-radius:16px;background:#fff;padding:16px}
          .half-page .print-panel{border-radius:10px;padding:8px}
          .print-notice{border:1px solid rgba(212,175,55,.55);background:#fff8e6;border-radius:14px;padding:13px 15px;color:#4d3710;font-weight:800}
          .half-page .print-notice{border-radius:9px;padding:7px 8px;font-size:9px}
          table{width:100%;border-collapse:separate;border-spacing:0;margin:10px 0 22px;border:1px solid var(--print-line);border-radius:14px;overflow:hidden}
          .half-page table{margin:5px 0 10px;border-radius:9px}
          th,td{padding:12px 13px;text-align:left;vertical-align:top;border-bottom:1px solid var(--print-line);font-size:13px;line-height:1.35}
          .half-page th,.half-page td{padding:5px 6px;font-size:8.5px;line-height:1.18}
          th{background:#f3f6fb;color:#334155;font-size:10px;font-weight:950;letter-spacing:.12em;text-transform:uppercase}
          .half-page th{font-size:7px;letter-spacing:.08em}
          tr:last-child td{border-bottom:0}
          .right{text-align:right}
          .summary,.print-summary{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin-top:18px}
          .half-page .summary,.half-page .print-summary{gap:6px;margin-top:8px}
          .summary div,.print-summary div{border:1px solid var(--print-line);border-radius:14px;background:#fff;padding:13px 14px;color:var(--print-muted);font-size:11px;font-weight:900;text-transform:uppercase}
          .half-page .summary div,.half-page .print-summary div{border-radius:9px;padding:7px 8px;font-size:7px}
          .summary strong,.print-summary strong{display:block;margin-top:6px;color:var(--print-ink);font-size:18px;text-transform:none}
          .half-page .summary strong,.half-page .print-summary strong{margin-top:3px;font-size:11px}
          .sign,.print-signature{margin-top:72px;text-align:right;font-weight:950;color:var(--print-ink)}
          .half-page .sign,.half-page .print-signature{margin-top:26px;font-size:9px}
          .print-footer{border-top:1px solid var(--print-line);padding:14px 30px;color:var(--print-muted);font-size:11px;display:flex;justify-content:space-between;gap:16px}
          .half-page .print-footer{padding:8px 18px;font-size:7.5px}
          .question{break-inside:avoid;border:1px solid var(--print-line);border-radius:16px;padding:16px;margin:14px 0;background:#fff}
          .q-head{display:flex;justify-content:space-between;gap:16px;font-size:14px;color:var(--print-ink)}
          .q-text{white-space:pre-wrap;font-size:15px;line-height:1.58}
          .formula{white-space:pre-wrap;color:#475569}
          .scribble{max-width:100%;max-height:280px;border:1px solid var(--print-line);border-radius:12px;margin-top:10px}
          @page{margin:14mm}
          @media print{
            body{background:#fff}
            .print-page{width:100%;margin:0;border:0;border-radius:0;box-shadow:none}
            .print-brand{border-radius:0}
            .print-meta-grid{grid-template-columns:repeat(2,minmax(0,1fr))}
            .summary,.print-summary{grid-template-columns:repeat(2,minmax(0,1fr))}
            .print-footer{position:fixed;bottom:0;left:0;right:0;background:#fff}
            .question,.print-panel,tr{page-break-inside:avoid}
          }
          @media print{
            @page{size:A4 portrait;margin:8mm}
            .print-page.half-page{width:148mm;min-height:auto;margin:0 auto;border:1px solid var(--print-line);border-radius:0;box-shadow:none}
            .half-page .print-meta-grid{grid-template-columns:repeat(4,minmax(0,1fr))}
            .half-page .summary,.half-page .print-summary{grid-template-columns:repeat(4,minmax(0,1fr))}
            .half-page .print-footer{position:static}
          }
        </style>
      </head>
      <body>
        <main class="print-page">
          <header class="print-brand">
            <div class="print-brand-left">
              <img class="print-logo" src="${r(f)}" alt="${r(u)} logo" />
              <div class="print-school">
                <h1>${r(u)}</h1>
                <p>${r(m)}</p>
              </div>
            </div>
            <div class="print-document-badge">
              <span>${r(i||"School Document")}</span>
              <strong>${r(new Date().toLocaleDateString())}</strong>
            </div>
          </header>
          <section class="print-title">
            <p class="eyebrow">${r(i||"Official Print")}</p>
            <h2>${r(t)}</h2>
            ${a?`<p>${r(a)}</p>`:""}
          </section>
          ${n||""}
          <section class="print-body">${s}</section>
          <footer class="print-footer">
            <span>${r(x||"Generated from TOTTECH ONE")}</span>
            <span>Powered by TOTTECH ONE</span>
          </footer>
          ${o||""}
        </main>
      </body>
    </html>
  `}({branding:x,title:e,subtitle:s,documentLabel:o,metaHtml:l,bodyHtml:d,footerHtml:p,pageSize:u,verificationUrl:m,barcodeValue:f,qrDataUrl:b})),g.document.close(),g.focus(),window.setTimeout(()=>{g.print()},250)}function r(e){return e.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;")}async function i(){try{let e=await fetch("/api/my-school-branding",{cache:"no-store"});if(!e.ok)throw Error("Branding unavailable");return await e.json()}catch{return{schoolName:"TOTTECH ONE",schoolCode:"Gateway To Learning",logoUrl:"/images/logo.png",primaryColor:"#04142E",secondaryColor:"#D4AF37"}}}async function n(t){try{return(await e.A(673378)).toDataURL(t,{errorCorrectionLevel:"M",margin:1,width:120,color:{dark:"#111111",light:"#FFFFFF"}})}catch{return null}}e.s(["printBrandedDocument",0,a,"printMetaGrid",0,function(e){return`<div class="print-meta-grid">${e.map(e=>`
        <div class="print-meta-card">
          <span>${r(e.label)}</span>
          <strong>${r(String(e.value??"-"))}</strong>
        </div>
      `).join("")}</div>`}])},498441,e=>{"use strict";let t=(0,e.i(456420).default)("file-question-mark",[["path",{d:"M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z",key:"1oefj6"}],["path",{d:"M12 17h.01",key:"p32p05"}],["path",{d:"M9.1 9a3 3 0 0 1 5.82 1c0 2-3 3-3 3",key:"mhlwft"}]]);e.s(["FileQuestion",0,t],498441)},488143,(e,t,a)=>{"use strict";function r({widthInt:e,heightInt:t,blurWidth:a,blurHeight:i,blurDataURL:n,objectFit:s}){let o=a?40*a:e,l=i?40*i:t,d=o&&l?`viewBox='0 0 ${o} ${l}'`:"";return`%3Csvg xmlns='http://www.w3.org/2000/svg' ${d}%3E%3Cfilter id='b' color-interpolation-filters='sRGB'%3E%3CfeGaussianBlur stdDeviation='20'/%3E%3CfeColorMatrix values='1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 100 -1' result='s'/%3E%3CfeFlood x='0' y='0' width='100%25' height='100%25'/%3E%3CfeComposite operator='out' in='s'/%3E%3CfeComposite in2='SourceGraphic'/%3E%3CfeGaussianBlur stdDeviation='20'/%3E%3C/filter%3E%3Cimage width='100%25' height='100%25' x='0' y='0' preserveAspectRatio='${d?"none":"contain"===s?"xMidYMid":"cover"===s?"xMidYMid slice":"none"}' style='filter: url(%23b);' href='${n}'/%3E%3C/svg%3E`}Object.defineProperty(a,"__esModule",{value:!0}),Object.defineProperty(a,"getImageBlurSvg",{enumerable:!0,get:function(){return r}})},987690,(e,t,a)=>{"use strict";Object.defineProperty(a,"__esModule",{value:!0});var r={VALID_LOADERS:function(){return n},imageConfigDefault:function(){return s}};for(var i in r)Object.defineProperty(a,i,{enumerable:!0,get:r[i]});let n=["default","imgix","cloudinary","akamai","custom"],s={deviceSizes:[640,750,828,1080,1200,1920,2048,3840],imageSizes:[32,48,64,96,128,256,384],path:"/_next/image",loader:"default",loaderFile:"",domains:[],disableStaticImages:!1,minimumCacheTTL:14400,formats:["image/webp"],maximumDiskCacheSize:void 0,maximumRedirects:3,maximumResponseBody:5e7,dangerouslyAllowLocalIP:!1,dangerouslyAllowSVG:!1,contentSecurityPolicy:"script-src 'none'; frame-src 'none'; sandbox;",contentDispositionType:"attachment",localPatterns:void 0,remotePatterns:[],qualities:[75],unoptimized:!1,customCacheHandler:!1}},908927,(e,t,a)=>{"use strict";Object.defineProperty(a,"__esModule",{value:!0}),Object.defineProperty(a,"getImgProps",{enumerable:!0,get:function(){return d}}),e.r(233525);let r=e.r(543369),i=e.r(488143),n=e.r(987690),s=["-moz-initial","fill","none","scale-down",void 0];function o(e){return void 0!==e.default}function l(e){return void 0===e?e:"number"==typeof e?Number.isFinite(e)?e:NaN:"string"==typeof e&&/^[0-9]+$/.test(e)?parseInt(e,10):NaN}function d({src:e,sizes:t,unoptimized:a=!1,priority:p=!1,preload:c=!1,loading:u,className:m,quality:f,width:h,height:g,fill:x=!1,style:b,overrideSrc:y,onLoad:v,onLoadingComplete:w,placeholder:j="empty",blurDataURL:_,fetchPriority:k,decoding:C="async",layout:S,objectFit:N,objectPosition:E,lazyBoundary:P,lazyRoot:O,...z},$){var M;let A,R,T,{imgConf:D,showAltText:q,blurComplete:I,defaultLoader:L}=$,U=D||n.imageConfigDefault;if("allSizes"in U)A=U;else{let e=[...U.deviceSizes,...U.imageSizes].sort((e,t)=>e-t),t=U.deviceSizes.sort((e,t)=>e-t),a=U.qualities?.sort((e,t)=>e-t);A={...U,allSizes:e,deviceSizes:t,qualities:a}}if(void 0===L)throw Object.defineProperty(Error("images.loaderFile detected but the file is missing default export.\nRead more: https://nextjs.org/docs/messages/invalid-images-config"),"__NEXT_ERROR_CODE",{value:"E163",enumerable:!1,configurable:!0});let F=z.loader||L;delete z.loader,delete z.srcSet;let B="__next_img_default"in F;if(B){if("custom"===A.loader)throw Object.defineProperty(Error(`Image with src "${e}" is missing "loader" prop.
Read more: https://nextjs.org/docs/messages/next-image-missing-loader`),"__NEXT_ERROR_CODE",{value:"E252",enumerable:!1,configurable:!0})}else{let e=F;F=t=>{let{config:a,...r}=t;return e(r)}}if(S){"fill"===S&&(x=!0);let e={intrinsic:{maxWidth:"100%",height:"auto"},responsive:{width:"100%",height:"auto"}}[S];e&&(b={...b,...e});let a={responsive:"100vw",fill:"100vw"}[S];a&&!t&&(t=a)}let H="",Q=l(h),W=l(g);if((M=e)&&"object"==typeof M&&(o(M)||void 0!==M.src)){let t=o(e)?e.default:e;if(!t.src)throw Object.defineProperty(Error(`An object should only be passed to the image component src parameter if it comes from a static image import. It must include src. Received ${JSON.stringify(t)}`),"__NEXT_ERROR_CODE",{value:"E460",enumerable:!1,configurable:!0});if(!t.height||!t.width)throw Object.defineProperty(Error(`An object should only be passed to the image component src parameter if it comes from a static image import. It must include height and width. Received ${JSON.stringify(t)}`),"__NEXT_ERROR_CODE",{value:"E48",enumerable:!1,configurable:!0});if(R=t.blurWidth,T=t.blurHeight,_=_||t.blurDataURL,H=t.src,!x)if(Q||W){if(Q&&!W){let e=Q/t.width;W=Math.round(t.height*e)}else if(!Q&&W){let e=W/t.height;Q=Math.round(t.width*e)}}else Q=t.width,W=t.height}let V=!p&&!c&&("lazy"===u||void 0===u);(!(e="string"==typeof e?e:H)||e.startsWith("data:")||e.startsWith("blob:"))&&(a=!0,V=!1),A.unoptimized&&(a=!0),B&&!A.dangerouslyAllowSVG&&e.split("?",1)[0].endsWith(".svg")&&(a=!0);let G=l(f),J=Object.assign(x?{position:"absolute",height:"100%",width:"100%",left:0,top:0,right:0,bottom:0,objectFit:N,objectPosition:E}:{},q?{}:{color:"transparent"},b),X=I||"empty"===j?null:"blur"===j?`url("data:image/svg+xml;charset=utf-8,${(0,i.getImageBlurSvg)({widthInt:Q,heightInt:W,blurWidth:R,blurHeight:T,blurDataURL:_||"",objectFit:J.objectFit})}")`:`url("${j}")`,K=s.includes(J.objectFit)?"fill"===J.objectFit?"100% 100%":"cover":J.objectFit,Y=X?{backgroundSize:K,backgroundPosition:J.objectPosition||"50% 50%",backgroundRepeat:"no-repeat",backgroundImage:X}:{},Z=function({config:e,src:t,unoptimized:a,width:i,quality:n,sizes:s,loader:o}){if(a){if(t.startsWith("/")&&!t.startsWith("//")){let e=(0,r.getDeploymentId)();if(e){let a=t.indexOf("?");if(-1!==a){let r=new URLSearchParams(t.slice(a+1));r.get("dpl")||(r.append("dpl",e),t=t.slice(0,a)+"?"+r.toString())}else t+=`?dpl=${e}`}}return{src:t,srcSet:void 0,sizes:void 0}}let{widths:l,kind:d}=function({deviceSizes:e,allSizes:t},a,r){if(r){let a=/(^|\s)(1?\d?\d)vw/g,i=[];for(let e;e=a.exec(r);)i.push(parseInt(e[2]));if(i.length){let a=.01*Math.min(...i);return{widths:t.filter(t=>t>=e[0]*a),kind:"w"}}return{widths:t,kind:"w"}}return"number"!=typeof a?{widths:e,kind:"w"}:{widths:[...new Set([a,2*a].map(e=>t.find(t=>t>=e)||t[t.length-1]))],kind:"x"}}(e,i,s),p=l.length-1;return{sizes:s||"w"!==d?s:"100vw",srcSet:l.map((a,r)=>`${o({config:e,src:t,quality:n,width:a})} ${"w"===d?a:r+1}${d}`).join(", "),src:o({config:e,src:t,quality:n,width:l[p]})}}({config:A,src:e,unoptimized:a,width:Q,quality:G,sizes:t,loader:F}),ee=V?"lazy":u;return{props:{...z,loading:ee,fetchPriority:k,width:Q,height:W,decoding:C,className:m,style:{...J,...Y},sizes:Z.sizes,srcSet:Z.srcSet,src:y||Z.src},meta:{unoptimized:a,preload:c||p,placeholder:j,fill:x}}}},898879,(e,t,a)=>{"use strict";Object.defineProperty(a,"__esModule",{value:!0}),Object.defineProperty(a,"default",{enumerable:!0,get:function(){return o}});let r=e.r(271645),i="u"<typeof window,n=i?()=>{}:r.useLayoutEffect,s=i?()=>{}:r.useEffect;function o(e){let{headManager:t,reduceComponentsToState:a}=e;function o(){if(t&&t.mountedInstances){let e=r.Children.toArray(Array.from(t.mountedInstances).filter(Boolean));t.updateHead(a(e))}}return i&&(t?.mountedInstances?.add(e.children),o()),n(()=>(t?.mountedInstances?.add(e.children),()=>{t?.mountedInstances?.delete(e.children)})),n(()=>(t&&(t._pendingUpdate=o),()=>{t&&(t._pendingUpdate=o)})),s(()=>(t&&t._pendingUpdate&&(t._pendingUpdate(),t._pendingUpdate=null),()=>{t&&t._pendingUpdate&&(t._pendingUpdate(),t._pendingUpdate=null)})),null}},325633,(e,t,a)=>{"use strict";Object.defineProperty(a,"__esModule",{value:!0});var r={default:function(){return h},defaultHead:function(){return c}};for(var i in r)Object.defineProperty(a,i,{enumerable:!0,get:r[i]});let n=e.r(555682),s=e.r(190809),o=e.r(843476),l=s._(e.r(271645)),d=n._(e.r(898879)),p=e.r(742732);function c(){return[(0,o.jsx)("meta",{charSet:"utf-8"},"charset"),(0,o.jsx)("meta",{name:"viewport",content:"width=device-width"},"viewport")]}function u(e,t){return"string"==typeof t||"number"==typeof t?e:t.type===l.default.Fragment?e.concat(l.default.Children.toArray(t.props.children).reduce((e,t)=>"string"==typeof t||"number"==typeof t?e:e.concat(t),[])):e.concat(t)}e.r(233525);let m=["name","httpEquiv","charSet","itemProp"];function f(e){let t,a,r,i;return e.reduce(u,[]).reverse().concat(c().reverse()).filter((t=new Set,a=new Set,r=new Set,i={},e=>{let n=!0,s=!1;if(e.key&&"number"!=typeof e.key&&e.key.indexOf("$")>0){s=!0;let a=e.key.slice(e.key.indexOf("$")+1);t.has(a)?n=!1:t.add(a)}switch(e.type){case"title":case"base":a.has(e.type)?n=!1:a.add(e.type);break;case"meta":for(let t=0,a=m.length;t<a;t++){let a=m[t];if(e.props.hasOwnProperty(a))if("charSet"===a)r.has(a)?n=!1:r.add(a);else{let t=e.props[a],r=i[a]||new Set;("name"!==a||!s)&&r.has(t)?n=!1:(r.add(t),i[a]=r)}}}return n})).reverse().map((e,t)=>{let a=e.key||t;return l.default.cloneElement(e,{key:a})})}let h=function({children:e}){let t=(0,l.useContext)(p.HeadManagerContext);return(0,o.jsx)(d.default,{reduceComponentsToState:f,headManager:t,children:e})};("function"==typeof a.default||"object"==typeof a.default&&null!==a.default)&&void 0===a.default.__esModule&&(Object.defineProperty(a.default,"__esModule",{value:!0}),Object.assign(a.default,a),t.exports=a.default)},918556,(e,t,a)=>{"use strict";Object.defineProperty(a,"__esModule",{value:!0}),Object.defineProperty(a,"ImageConfigContext",{enumerable:!0,get:function(){return n}});let r=e.r(555682)._(e.r(271645)),i=e.r(987690),n=r.default.createContext(i.imageConfigDefault)},65856,(e,t,a)=>{"use strict";Object.defineProperty(a,"__esModule",{value:!0}),Object.defineProperty(a,"RouterContext",{enumerable:!0,get:function(){return r}});let r=e.r(555682)._(e.r(271645)).default.createContext(null)},670965,(e,t,a)=>{"use strict";function r(e,t){let a=e||75;return t?.qualities?.length?t.qualities.reduce((e,t)=>Math.abs(t-a)<Math.abs(e-a)?t:e,t.qualities[0]):a}Object.defineProperty(a,"__esModule",{value:!0}),Object.defineProperty(a,"findClosestQuality",{enumerable:!0,get:function(){return r}})},1948,(e,t,a)=>{"use strict";Object.defineProperty(a,"__esModule",{value:!0}),Object.defineProperty(a,"default",{enumerable:!0,get:function(){return s}});let r=e.r(670965),i=e.r(543369);function n({config:e,src:t,width:a,quality:s}){let o=(0,i.getDeploymentId)();if(t.startsWith("/")&&!t.startsWith("//")){let e=t.indexOf("?");if(-1!==e){let a=new URLSearchParams(t.slice(e+1)),r=a.get("dpl");if(r){o=r,a.delete("dpl");let i=a.toString();t=t.slice(0,e)+(i?"?"+i:"")}}}if(t.startsWith("/")&&t.includes("?")&&e.localPatterns?.length===1&&"**"===e.localPatterns[0].pathname&&""===e.localPatterns[0].search)throw Object.defineProperty(Error(`Image with src "${t}" is using a query string which is not configured in images.localPatterns.
Read more: https://nextjs.org/docs/messages/next-image-unconfigured-localpatterns`),"__NEXT_ERROR_CODE",{value:"E871",enumerable:!1,configurable:!0});let l=(0,r.findClosestQuality)(s,e);return`${e.path}?url=${encodeURIComponent(t)}&w=${a}&q=${l}${t.startsWith("/")&&o?`&dpl=${o}`:""}`}n.__next_img_default=!0;let s=n},605500,(e,t,a)=>{"use strict";Object.defineProperty(a,"__esModule",{value:!0}),Object.defineProperty(a,"Image",{enumerable:!0,get:function(){return v}});let r=e.r(555682),i=e.r(190809),n=e.r(843476),s=i._(e.r(271645)),o=r._(e.r(174080)),l=r._(e.r(325633)),d=e.r(908927),p=e.r(987690),c=e.r(918556);e.r(233525);let u=e.r(65856),m=r._(e.r(1948)),f=e.r(818581),h={deviceSizes:[640,750,828,1080,1200,1920,2048,3840],imageSizes:[32,48,64,96,128,256,384],qualities:[75],path:"/_next/image",loader:"default",dangerouslyAllowSVG:!1,unoptimized:!1};function g(e,t,a,r,i,n,s){let o=e?.src;e&&e["data-loaded-src"]!==o&&(e["data-loaded-src"]=o,("decode"in e?e.decode():Promise.resolve()).catch(()=>{}).then(()=>{if(e.parentElement&&e.isConnected){if("empty"!==t&&i(!0),a?.current){let t=new Event("load");Object.defineProperty(t,"target",{writable:!1,value:e});let r=!1,i=!1;a.current({...t,nativeEvent:t,currentTarget:e,target:e,isDefaultPrevented:()=>r,isPropagationStopped:()=>i,persist:()=>{},preventDefault:()=>{r=!0,t.preventDefault()},stopPropagation:()=>{i=!0,t.stopPropagation()}})}r?.current&&r.current(e)}}))}function x(e){return s.use?{fetchPriority:e}:{fetchpriority:e}}"u"<typeof window&&(globalThis.__NEXT_IMAGE_IMPORTED=!0);let b=(0,s.forwardRef)(({src:e,srcSet:t,sizes:a,height:r,width:i,decoding:o,className:l,style:d,fetchPriority:p,placeholder:c,loading:u,unoptimized:m,fill:h,onLoadRef:b,onLoadingCompleteRef:y,setBlurComplete:v,setShowAltText:w,sizesInput:j,onLoad:_,onError:k,...C},S)=>{let N=(0,s.useCallback)(e=>{e&&(k&&(e.src=e.src),e.complete&&g(e,c,b,y,v,m,j))},[e,c,b,y,v,k,m,j]),E=(0,f.useMergedRef)(S,N);return(0,n.jsx)("img",{...C,...x(p),loading:u,width:i,height:r,decoding:o,"data-nimg":h?"fill":"1",className:l,style:d,sizes:a,srcSet:t,src:e,ref:E,onLoad:e=>{g(e.currentTarget,c,b,y,v,m,j)},onError:e=>{w(!0),"empty"!==c&&v(!0),k&&k(e)}})});function y({isAppRouter:e,imgAttributes:t}){let a={as:"image",imageSrcSet:t.srcSet,imageSizes:t.sizes,crossOrigin:t.crossOrigin,referrerPolicy:t.referrerPolicy,...x(t.fetchPriority)};return e&&o.default.preload?(o.default.preload(t.src,a),null):(0,n.jsx)(l.default,{children:(0,n.jsx)("link",{rel:"preload",href:t.srcSet?void 0:t.src,...a},"__nimg-"+t.src+t.srcSet+t.sizes)})}let v=(0,s.forwardRef)((e,t)=>{let a=(0,s.useContext)(u.RouterContext),r=(0,s.useContext)(c.ImageConfigContext),i=(0,s.useMemo)(()=>{let e=h||r||p.imageConfigDefault,t=[...e.deviceSizes,...e.imageSizes].sort((e,t)=>e-t),a=e.deviceSizes.sort((e,t)=>e-t),i=e.qualities?.sort((e,t)=>e-t);return{...e,allSizes:t,deviceSizes:a,qualities:i,localPatterns:"u"<typeof window?r?.localPatterns:e.localPatterns}},[r]),{onLoad:o,onLoadingComplete:l}=e,f=(0,s.useRef)(o);(0,s.useEffect)(()=>{f.current=o},[o]);let g=(0,s.useRef)(l);(0,s.useEffect)(()=>{g.current=l},[l]);let[x,v]=(0,s.useState)(!1),[w,j]=(0,s.useState)(!1),{props:_,meta:k}=(0,d.getImgProps)(e,{defaultLoader:m.default,imgConf:i,blurComplete:x,showAltText:w});return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(b,{..._,unoptimized:k.unoptimized,placeholder:k.placeholder,fill:k.fill,onLoadRef:f,onLoadingCompleteRef:g,setBlurComplete:v,setShowAltText:j,sizesInput:e.sizes,ref:t}),k.preload?(0,n.jsx)(y,{isAppRouter:!a,imgAttributes:_}):null]})});("function"==typeof a.default||"object"==typeof a.default&&null!==a.default)&&void 0===a.default.__esModule&&(Object.defineProperty(a.default,"__esModule",{value:!0}),Object.assign(a.default,a),t.exports=a.default)},794909,(e,t,a)=>{"use strict";Object.defineProperty(a,"__esModule",{value:!0});var r={default:function(){return p},getImageProps:function(){return d}};for(var i in r)Object.defineProperty(a,i,{enumerable:!0,get:r[i]});let n=e.r(555682),s=e.r(908927),o=e.r(605500),l=n._(e.r(1948));function d(e){let{props:t}=(0,s.getImgProps)(e,{defaultLoader:l.default,imgConf:{deviceSizes:[640,750,828,1080,1200,1920,2048,3840],imageSizes:[32,48,64,96,128,256,384],qualities:[75],path:"/_next/image",loader:"default",dangerouslyAllowSVG:!1,unoptimized:!1}});for(let[e,a]of Object.entries(t))void 0===a&&delete t[e];return{props:t}}let p=o.Image},657688,(e,t,a)=>{t.exports=e.r(794909)},892420,e=>{"use strict";var t=e.i(843476),a=e.i(772382),r=e.i(498441),i=e.i(77071),n=e.i(77043),s=e.i(573474),o=e.i(263676),l=e.i(657688),d=e.i(271645),p=e.i(859015),c=e.i(920476),u=e.i(647629),m=e.i(462047);let f={paper_name:"",exam_id:"",exam_type_id:"",class_id:"",section_id:"",subject_id:"",exam_date:"",duration_minutes:"180",instructions:""},h={section_name:"A",question_type:"SHORT_ANSWER",difficulty_level:"MEDIUM",bloom_level:"",chapter_name:"",topic_name:"",learning_outcome:"",question_text:"",answer_text:"",formula_text:"",scribble_data:"",question_marks:"5",is_optional:!1};function g({detail:e,onClose:a}){let r=e.paper,i=e.questions||[];if(!r)return null;let s=async()=>{let e=i.map((e,t)=>`
          <section class="question">
            <div class="q-head">
              <strong>Question ${e.display_order||t+1}</strong>
              <span>${e.section_name||"-"} | ${e.question_marks??e.max_marks??0} marks</span>
            </div>
            <p class="q-text">${x(e.question_text||"Question text missing")}</p>
            ${e.formula_text?`<p class="formula"><strong>Formula/Notes:</strong> ${x(e.formula_text)}</p>`:""}
            ${e.scribble_data?`<img src="${e.scribble_data}" class="scribble" alt="Question diagram" />`:""}
          </section>
        `).join("");await (0,u.printBrandedDocument)({title:r.paper_name||"Question Paper",subtitle:[r.exam_name||r.exam_type_name,r.class_name,r.section_name,r.subject_name].filter(Boolean).join(" / ")||"-",documentLabel:"Question Paper",metaHtml:(0,u.printMetaGrid)([{label:"Questions",value:i.length},{label:"Total Marks",value:r.total_marks||0},{label:"Duration",value:r.duration_minutes?`${r.duration_minutes} min`:"-"},{label:"Exam Date",value:r.exam_date?new Date(r.exam_date).toLocaleDateString():"-"}]),bodyHtml:`
        ${r.instructions?`<div class="print-notice">${x(r.instructions)}</div>`:""}
        ${e||"<p>No questions are attached.</p>"}
      `,popupError:"Allow popups to print this document."})};return(0,t.jsxs)("section",{className:"tt-card tt-card-pad",children:[(0,t.jsxs)("div",{className:"mb-5 flex flex-col gap-3 md:flex-row md:items-start md:justify-between",children:[(0,t.jsxs)("div",{className:"min-w-0",children:[(0,t.jsx)("p",{className:"text-xs font-black uppercase tracking-wide text-amber-700",children:"Created Question Paper"}),(0,t.jsx)("h2",{className:"mt-1 break-words text-2xl font-black text-slate-950",children:r.paper_name||"Question Paper"}),(0,t.jsx)("p",{className:"mt-1 break-words text-sm font-semibold text-slate-600",children:[r.exam_name||r.exam_type_name,r.class_name,r.section_name,r.subject_name].filter(Boolean).join(" / ")||"-"})]}),(0,t.jsxs)("div",{className:"flex shrink-0 gap-2",children:[(0,t.jsxs)("button",{onClick:s,className:"inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 text-sm font-black text-amber-900 shadow-sm",children:[(0,t.jsx)(n.Printer,{size:17}),"Print"]}),(0,t.jsx)("button",{onClick:a,className:"inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm","aria-label":"Close question paper preview",children:(0,t.jsx)(o.X,{size:18})})]})]}),(0,t.jsxs)("div",{className:"grid gap-3 text-sm md:grid-cols-4",children:[(0,t.jsx)(_,{label:"Questions",value:String(i.length)}),(0,t.jsx)(_,{label:"Total Marks",value:String(r.total_marks||0)}),(0,t.jsx)(_,{label:"Duration",value:r.duration_minutes?`${r.duration_minutes} min`:"-"}),(0,t.jsx)(_,{label:"Exam Date",value:r.exam_date?new Date(r.exam_date).toLocaleDateString():"-"})]}),r.instructions?(0,t.jsxs)("div",{className:"mt-5 rounded-lg border border-amber-200 bg-amber-50 p-4",children:[(0,t.jsx)("p",{className:"text-xs font-black uppercase text-amber-800",children:"Instructions"}),(0,t.jsx)("p",{className:"mt-1 whitespace-pre-wrap break-words text-sm text-slate-800",children:r.instructions})]}):null,(0,t.jsx)("div",{className:"mt-6 space-y-4",children:i.length?i.map((e,a)=>(0,t.jsxs)("article",{className:"rounded-lg border border-slate-200 bg-white p-4 shadow-sm",children:[(0,t.jsxs)("div",{className:"mb-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between",children:[(0,t.jsxs)("h3",{className:"break-words text-lg font-black text-slate-950",children:["Question"," ",e.display_order||a+1]}),(0,t.jsxs)("div",{className:"flex flex-wrap gap-2 text-xs font-black uppercase",children:[(0,t.jsxs)("span",{className:"rounded-full bg-slate-100 px-3 py-1 text-slate-700",children:["Section"," ",e.section_name||"-"]}),(0,t.jsxs)("span",{className:"rounded-full bg-amber-100 px-3 py-1 text-amber-800",children:[String(e.question_marks??e.max_marks??0)," ","marks"]})]})]}),(0,t.jsxs)("div",{className:"grid gap-4 lg:grid-cols-2",children:[(0,t.jsx)(b,{label:"Question",value:e.question_text}),(0,t.jsx)(b,{label:"Answer / Evaluation Notes",value:e.answer_text}),(0,t.jsx)(b,{label:"Formula / Equation Notes",value:e.formula_text}),(0,t.jsx)(b,{label:"Topic",value:[e.chapter_name,e.topic_name,e.learning_outcome].filter(Boolean).join(" / ")})]}),e.scribble_data?(0,t.jsxs)("div",{className:"mt-4",children:[(0,t.jsx)("p",{className:"mb-2 text-sm font-black text-slate-700",children:"Scribble / Diagram"}),(0,t.jsx)("div",{className:"overflow-hidden rounded-lg border border-slate-200 bg-white p-2",children:(0,t.jsx)(l.default,{src:e.scribble_data,alt:"Saved question scribble or diagram",width:720,height:260,unoptimized:!0,className:"h-auto max-h-[320px] w-full object-contain"})})]}):null]},e.id||e.question_id||a)):(0,t.jsx)("div",{className:"rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-600",children:"No questions are attached to this paper."})})]})}function x(e){return e.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;")}function b({label:e,value:a}){return(0,t.jsxs)("div",{className:"min-w-0 rounded-lg bg-slate-50 p-3",children:[(0,t.jsx)("p",{className:"text-xs font-black uppercase text-slate-500",children:e}),(0,t.jsx)("p",{className:"mt-1 whitespace-pre-wrap break-words text-sm font-semibold text-slate-900",children:a||"-"})]})}function y({label:e,value:a,onChange:r}){let i=(0,d.useRef)(null),n=(0,d.useRef)(!1);(0,d.useEffect)(()=>{let e=i.current;if(!e)return;let t=e.getContext("2d");if(!t||(t.clearRect(0,0,e.width,e.height),t.fillStyle="#ffffff",t.fillRect(0,0,e.width,e.height),!a))return;let r=new window.Image;r.onload=()=>{t.drawImage(r,0,0,e.width,e.height)},r.src=a},[a]);let s=e=>{let t=e.currentTarget,a=t.getBoundingClientRect();return{x:(e.clientX-a.left)/a.width*t.width,y:(e.clientY-a.top)/a.height*t.height}},o=e=>{if(!n.current)return;let t=e.currentTarget;n.current=!1,r(t.toDataURL("image/png")),t.hasPointerCapture(e.pointerId)&&t.releasePointerCapture(e.pointerId)};return(0,t.jsxs)("div",{className:"min-w-0",children:[(0,t.jsxs)("div",{className:"mb-1 flex items-center justify-between gap-3",children:[(0,t.jsx)("span",{className:"text-sm font-bold text-slate-700",children:e}),(0,t.jsx)("button",{type:"button",onClick:()=>{let e=i.current,t=e?.getContext("2d");e&&t&&(t.clearRect(0,0,e.width,e.height),t.fillStyle="#ffffff",t.fillRect(0,0,e.width,e.height),r(""))},className:"rounded-lg border border-slate-200 bg-white px-3 py-1 text-xs font-black text-slate-700",children:"Clear"})]}),(0,t.jsx)("canvas",{ref:i,width:720,height:260,onPointerDown:e=>{let t=e.currentTarget,a=t.getContext("2d");if(!a)return;let r=s(e);n.current=!0,a.lineWidth=4,a.lineCap="round",a.lineJoin="round",a.strokeStyle="#07162d",a.beginPath(),a.moveTo(r.x,r.y),t.setPointerCapture(e.pointerId)},onPointerMove:e=>{if(!n.current)return;let t=e.currentTarget.getContext("2d");if(!t)return;let a=s(e);t.lineTo(a.x,a.y),t.stroke()},onPointerUp:o,onPointerCancel:o,className:"h-[220px] w-full touch-none rounded-lg border border-slate-300 bg-white shadow-inner"}),(0,t.jsx)("p",{className:"mt-1 text-xs font-semibold text-slate-500",children:"Use touch, mouse, or stylus for diagrams, formulas, maps, and working notes."})]})}function v({label:e,value:a,onChange:r,type:i="text"}){return(0,t.jsxs)("label",{className:"min-w-0",children:[(0,t.jsx)("span",{className:"mb-1 block text-sm font-bold text-slate-700",children:e}),(0,t.jsx)("input",{type:i,className:"input",value:a,onChange:e=>r(e.target.value)})]})}function w({label:e,value:a,onChange:r}){return(0,t.jsxs)("label",{className:"min-w-0",children:[(0,t.jsx)("span",{className:"mb-1 block text-sm font-bold text-slate-700",children:e}),(0,t.jsx)("textarea",{rows:4,className:"input min-h-[110px]",value:a,onChange:e=>r(e.target.value)})]})}function j({label:e,value:a,onChange:r,children:i,disabled:n=!1}){return(0,t.jsxs)("label",{className:"min-w-0",children:[(0,t.jsx)("span",{className:"mb-1 block text-sm font-bold text-slate-700",children:e}),(0,t.jsx)("select",{className:"input",value:a,disabled:n,onChange:e=>r(e.target.value),children:i})]})}function _({label:e,value:a}){return(0,t.jsxs)("div",{className:"min-w-0",children:[(0,t.jsx)("p",{className:"text-xs font-bold uppercase text-slate-500",children:e}),(0,t.jsx)("p",{className:"truncate font-semibold text-slate-950",children:a})]})}e.s(["default",0,function(){let[e,n]=(0,d.useState)(f),[o,l]=(0,d.useState)([h]),[u,x]=(0,d.useState)([]),[b,k]=(0,d.useState)(null),[C,S]=(0,d.useState)(null),[N,E]=(0,d.useState)([]),[P,O]=(0,d.useState)([]),[z,$]=(0,d.useState)([]),[M,A]=(0,d.useState)([]),[R,T]=(0,d.useState)([]),[D,q]=(0,d.useState)(!1),I=async()=>{try{let[e,t,a,r,i]=await Promise.all([(0,c.apiJson)("/api/question-papers"),(0,c.apiJson)("/api/exams"),(0,c.apiJson)("/api/exam-types"),(0,c.apiJson)("/api/roster"),(0,c.apiJson)("/api/subjects")]);x(Array.isArray(e)?e:[]),E(t.exams||[]),O(Array.isArray(a)?a:[]),$(Array.isArray(r.classes)?r.classes:[]),A(Array.isArray(r.sections)?r.sections:[]),T(Array.isArray(i)?i:[])}catch(e){m.notify.error((0,c.errorMessage)(e,"Failed to load question papers"))}};(0,d.useEffect)(()=>{Promise.resolve().then(I)},[]);let L=M.filter(t=>!e.class_id||Number(t.class_id)===Number(e.class_id)),U=(0,d.useMemo)(()=>o.reduce((e,t)=>e+Number(t.question_marks||0),0),[o]),F=(e,t,a)=>{l(r=>r.map((r,i)=>i===e?{...r,[t]:a}:r))},B=async()=>{try{q(!0);let t=await (0,c.apiJson)("/api/question-papers",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({...e,total_marks:U,questions:o})});m.notify.success("Question paper created"),n(f),l([h]),await I(),t?.id&&await H(t.id)}catch(e){m.notify.error((0,c.errorMessage)(e,"Failed to create question paper"))}finally{q(!1)}},H=async e=>{try{S(e);let t=await (0,c.apiJson)(`/api/question-papers/${e}`);k(t)}catch(e){m.notify.error((0,c.errorMessage)(e,"Failed to open question paper"))}finally{S(null)}};return(0,t.jsx)(p.default,{children:(0,t.jsxs)("div",{className:"space-y-6",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("h1",{className:"text-3xl font-black md:text-4xl",children:"Question Paper Builder"}),(0,t.jsx)("p",{className:"mt-1 text-sm text-slate-600",children:"Build papers question by question, then use them in exam schedules and marks entry."})]}),(0,t.jsxs)("section",{className:"tt-card tt-card-pad",children:[(0,t.jsx)("h2",{className:"mb-4 text-xl font-black",children:"Paper Details"}),(0,t.jsxs)("div",{className:"grid gap-4 md:grid-cols-2 xl:grid-cols-4",children:[(0,t.jsx)(v,{label:"Paper Name",value:e.paper_name,onChange:t=>n({...e,paper_name:t})}),(0,t.jsxs)(j,{label:"Exam",value:e.exam_id,onChange:t=>n({...e,exam_id:t}),children:[(0,t.jsx)("option",{value:"",children:"Optional"}),N.map(e=>(0,t.jsx)("option",{value:e.id,children:e.exam_name},e.id))]}),(0,t.jsxs)(j,{label:"Exam Type",value:e.exam_type_id,onChange:t=>n({...e,exam_type_id:t}),children:[(0,t.jsx)("option",{value:"",children:"Optional"}),P.map(e=>(0,t.jsx)("option",{value:e.id,children:e.exam_name},e.id))]}),(0,t.jsx)(v,{label:"Exam Date",type:"date",value:e.exam_date,onChange:t=>n({...e,exam_date:t})}),(0,t.jsxs)(j,{label:"Class",value:e.class_id,onChange:t=>n({...e,class_id:t,section_id:""}),children:[(0,t.jsx)("option",{value:"",children:"Select Class"}),z.map(e=>(0,t.jsx)("option",{value:e.id,children:e.class_name},e.id))]}),(0,t.jsxs)(j,{label:"Section",value:e.section_id,onChange:t=>n({...e,section_id:t}),disabled:!e.class_id,children:[(0,t.jsx)("option",{value:"",children:"Select Section"}),L.map(e=>(0,t.jsx)("option",{value:e.id,children:e.section_name},e.id))]}),(0,t.jsxs)(j,{label:"Subject",value:e.subject_id,onChange:t=>n({...e,subject_id:t}),children:[(0,t.jsx)("option",{value:"",children:"Select Subject"}),R.map(e=>(0,t.jsx)("option",{value:e.id,children:e.subject_name},e.id))]}),(0,t.jsx)(v,{label:"Duration Minutes",value:e.duration_minutes,onChange:t=>n({...e,duration_minutes:t})})]}),(0,t.jsx)("div",{className:"mt-4",children:(0,t.jsx)(w,{label:"Instructions",value:e.instructions,onChange:t=>n({...e,instructions:t})})})]}),(0,t.jsxs)("section",{className:"tt-card tt-card-pad",children:[(0,t.jsxs)("div",{className:"mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("h2",{className:"text-xl font-black",children:"Questions"}),(0,t.jsxs)("p",{className:"text-sm text-slate-600",children:["Total marks: ",U]})]}),(0,t.jsxs)("button",{onClick:()=>{l(e=>[...e,{...h,section_name:e.at(-1)?.section_name||"A"}])},className:"tt-button-secondary inline-flex items-center justify-center gap-2",children:[(0,t.jsx)(i.Plus,{size:16}),"Add Question"]})]}),(0,t.jsx)("div",{className:"space-y-4",children:o.map((e,a)=>(0,t.jsxs)("article",{className:"rounded-lg border border-slate-200 bg-slate-50 p-4",children:[(0,t.jsxs)("div",{className:"mb-3 flex items-center justify-between gap-3",children:[(0,t.jsxs)("h3",{className:"font-black",children:["Question ",a+1]}),(0,t.jsx)("button",{onClick:()=>{l(e=>1===e.length?e:e.filter((e,t)=>t!==a))},className:"rounded-lg border border-red-200 bg-red-50 p-2 text-red-700","aria-label":"Remove question",children:(0,t.jsx)(s.Trash2,{size:16})})]}),(0,t.jsxs)("div",{className:"grid gap-4 md:grid-cols-2 xl:grid-cols-5",children:[(0,t.jsx)(v,{label:"Section",value:e.section_name,onChange:e=>F(a,"section_name",e)}),(0,t.jsxs)(j,{label:"Type",value:e.question_type,onChange:e=>F(a,"question_type",e),children:[(0,t.jsx)("option",{value:"SHORT_ANSWER",children:"Short Answer"}),(0,t.jsx)("option",{value:"LONG_ANSWER",children:"Long Answer"}),(0,t.jsx)("option",{value:"OBJECTIVE",children:"Objective"}),(0,t.jsx)("option",{value:"ESSAY",children:"Essay"})]}),(0,t.jsxs)(j,{label:"Difficulty",value:e.difficulty_level,onChange:e=>F(a,"difficulty_level",e),children:[(0,t.jsx)("option",{value:"EASY",children:"Easy"}),(0,t.jsx)("option",{value:"MEDIUM",children:"Medium"}),(0,t.jsx)("option",{value:"HARD",children:"Hard"})]}),(0,t.jsx)(v,{label:"Marks",value:e.question_marks,onChange:e=>F(a,"question_marks",e)}),(0,t.jsx)(v,{label:"Topic",value:e.topic_name,onChange:e=>F(a,"topic_name",e)})]}),(0,t.jsxs)("div",{className:"mt-4 grid gap-4 md:grid-cols-2",children:[(0,t.jsx)(w,{label:"Question",value:e.question_text,onChange:e=>F(a,"question_text",e)}),(0,t.jsx)(w,{label:"Answer / Evaluation Notes",value:e.answer_text,onChange:e=>F(a,"answer_text",e)})]}),(0,t.jsxs)("div",{className:"mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]",children:[(0,t.jsx)(w,{label:"Formula / Equation Notes",value:e.formula_text,onChange:e=>F(a,"formula_text",e)}),(0,t.jsx)(y,{label:"Scribble / Diagram Pad",value:e.scribble_data,onChange:e=>F(a,"scribble_data",e)})]})]},a))}),(0,t.jsxs)("button",{onClick:B,disabled:D,className:"tt-button mt-5 inline-flex items-center gap-2",children:[(0,t.jsx)(r.FileQuestion,{size:17}),D?"Saving...":"Create Question Paper"]})]}),0===u.length?(0,t.jsx)("div",{className:"tt-card tt-card-pad",children:"No question papers found for the selected school and academic year yet."}):(0,t.jsx)("div",{className:"grid gap-4 md:grid-cols-2 xl:grid-cols-3",children:u.map(e=>(0,t.jsxs)("article",{className:"tt-card tt-card-pad",children:[(0,t.jsx)("h2",{className:"truncate text-lg font-black",children:e.paper_name}),(0,t.jsxs)("p",{className:"truncate text-sm font-semibold text-amber-700",children:[e.class_name||"-",e.section_name?` ${e.section_name}`:""," ","· ",e.subject_name||"-"]}),(0,t.jsxs)("div",{className:"mt-5 grid grid-cols-3 gap-3 text-sm",children:[(0,t.jsx)(_,{label:"Questions",value:String(e.question_count||0)}),(0,t.jsx)(_,{label:"Marks",value:String(e.total_marks||0)}),(0,t.jsx)(_,{label:"Date",value:e.exam_date?new Date(e.exam_date).toLocaleDateString():"-"})]}),(0,t.jsxs)("button",{onClick:()=>H(e.id),disabled:String(C)===String(e.id),className:"tt-button-secondary mt-5 inline-flex w-full items-center justify-center gap-2",children:[(0,t.jsx)(a.Eye,{size:16}),String(C)===String(e.id)?"Opening...":"View Paper"]})]},e.id))}),b?(0,t.jsx)(g,{detail:b,onClose:()=>k(null)}):null]})})}])},673378,e=>{e.v(t=>Promise.all(["static/chunks/0kauo_1p4s347.js"].map(t=>e.l(t))).then(()=>t(973134)))}]);