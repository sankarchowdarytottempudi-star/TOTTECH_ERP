(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,270904,e=>{"use strict";let t=(0,e.i(456420).default)("wallet",[["path",{d:"M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1",key:"18etb6"}],["path",{d:"M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4",key:"xoc0q4"}]]);e.s(["Wallet",0,t],270904)},195057,(e,t,a)=>{"use strict";Object.defineProperty(a,"__esModule",{value:!0});var r={formatUrl:function(){return o},formatWithValidation:function(){return d},urlObjectKeys:function(){return l}};for(var i in r)Object.defineProperty(a,i,{enumerable:!0,get:r[i]});let n=e.r(190809)._(e.r(998183)),s=/https?|ftp|gopher|file/;function o(e){let{auth:t,hostname:a}=e,r=e.protocol||"",i=e.pathname||"",o=e.hash||"",l=e.query||"",d=!1;t=t?encodeURIComponent(t).replace(/%3A/i,":")+"@":"",e.host?d=t+e.host:a&&(d=t+(~a.indexOf(":")?`[${a}]`:a),e.port&&(d+=":"+e.port)),l&&"object"==typeof l&&(l=String(n.urlQueryToSearchParams(l)));let p=e.search||l&&`?${l}`||"";return r&&!r.endsWith(":")&&(r+=":"),e.slashes||(!r||s.test(r))&&!1!==d?(d="//"+(d||""),i&&"/"!==i[0]&&(i="/"+i)):d||(d=""),o&&"#"!==o[0]&&(o="#"+o),p&&"?"!==p[0]&&(p="?"+p),i=i.replace(/[?#]/g,encodeURIComponent),p=p.replace("#","%23"),`${r}${d}${i}${p}${o}`}let l=["auth","hash","host","hostname","href","path","pathname","port","protocol","query","search","slashes"];function d(e){return o(e)}},573668,(e,t,a)=>{"use strict";Object.defineProperty(a,"__esModule",{value:!0}),Object.defineProperty(a,"isLocalURL",{enumerable:!0,get:function(){return n}});let r=e.r(718967),i=e.r(652817);function n(e){if(!(0,r.isAbsoluteUrl)(e))return!0;try{let t=(0,r.getLocationOrigin)(),a=new URL(e,t);return a.origin===t&&(0,i.hasBasePath)(a.pathname)}catch(e){return!1}}},284508,(e,t,a)=>{"use strict";Object.defineProperty(a,"__esModule",{value:!0}),Object.defineProperty(a,"errorOnce",{enumerable:!0,get:function(){return r}});let r=e=>{}},522016,(e,t,a)=>{"use strict";Object.defineProperty(a,"__esModule",{value:!0});var r={default:function(){return x},useLinkStatus:function(){return y}};for(var i in r)Object.defineProperty(a,i,{enumerable:!0,get:r[i]});let n=e.r(190809),s=e.r(843476),o=n._(e.r(271645)),l=e.r(195057),d=e.r(8372),p=e.r(818581),c=e.r(718967),m=e.r(405550);e.r(233525);let u=e.r(388540),h=e.r(91949),f=e.r(573668),g=e.r(509396);function x(t){var a,r;let i,n,x,[y,v]=(0,o.useOptimistic)(h.IDLE_LINK_STATUS),w=(0,o.useRef)(null),{href:_,as:k,children:j,prefetch:$=null,passHref:S,replace:C,shallow:N,scroll:z,onClick:A,onMouseEnter:M,onTouchStart:P,legacyBehavior:E=!1,onNavigate:O,transitionTypes:R,ref:T,unstable_dynamicOnHover:D,...L}=t;i=j,E&&("string"==typeof i||"number"==typeof i)&&(i=(0,s.jsx)("a",{children:i}));let I=o.default.useContext(d.AppRouterContext),F=!1!==$,H=!1!==$?null===(r=$)||"auto"===r?g.FetchStrategy.PPR:g.FetchStrategy.Full:g.FetchStrategy.PPR,B="string"==typeof(a=k||_)?a:(0,l.formatUrl)(a);if(E){if(i?.$$typeof===Symbol.for("react.lazy"))throw Object.defineProperty(Error("`<Link legacyBehavior>` received a direct child that is either a Server Component, or JSX that was loaded with React.lazy(). This is not supported. Either remove legacyBehavior, or make the direct child a Client Component that renders the Link's `<a>` tag."),"__NEXT_ERROR_CODE",{value:"E863",enumerable:!1,configurable:!0});n=o.default.Children.only(i)}let U=E?n&&"object"==typeof n&&n.ref:T,q=o.default.useCallback(e=>(null!==I&&(w.current=(0,h.mountLinkInstance)(e,B,I,H,F,v)),()=>{w.current&&((0,h.unmountLinkForCurrentNavigation)(w.current),w.current=null),(0,h.unmountPrefetchableInstance)(e)}),[F,B,I,H,v]),V={ref:(0,p.useMergedRef)(q,U),onClick(t){E||"function"!=typeof A||A(t),E&&n.props&&"function"==typeof n.props.onClick&&n.props.onClick(t),!I||t.defaultPrevented||function(t,a,r,i,n,s,l){if("u">typeof window){let d,{nodeName:p}=t.currentTarget;if("A"===p.toUpperCase()&&((d=t.currentTarget.getAttribute("target"))&&"_self"!==d||t.metaKey||t.ctrlKey||t.shiftKey||t.altKey||t.nativeEvent&&2===t.nativeEvent.which)||t.currentTarget.hasAttribute("download"))return;if(!(0,f.isLocalURL)(a)){i&&(t.preventDefault(),location.replace(a));return}if(t.preventDefault(),s){let e=!1;if(s({preventDefault:()=>{e=!0}}),e)return}let{dispatchNavigateAction:c}=e.r(699781);o.default.startTransition(()=>{c(a,i?"replace":"push",!1===n?u.ScrollBehavior.NoScroll:u.ScrollBehavior.Default,r.current,l)})}}(t,B,w,C,z,O,R)},onMouseEnter(e){E||"function"!=typeof M||M(e),E&&n.props&&"function"==typeof n.props.onMouseEnter&&n.props.onMouseEnter(e),I&&F&&(0,h.onNavigationIntent)(e.currentTarget,!0===D)},onTouchStart:function(e){E||"function"!=typeof P||P(e),E&&n.props&&"function"==typeof n.props.onTouchStart&&n.props.onTouchStart(e),I&&F&&(0,h.onNavigationIntent)(e.currentTarget,!0===D)}};return(0,c.isAbsoluteUrl)(B)?V.href=B:E&&!S&&("a"!==n.type||"href"in n.props)||(V.href=(0,m.addBasePath)(B)),x=E?o.default.cloneElement(n,V):(0,s.jsx)("a",{...L,...V,children:i}),(0,s.jsx)(b.Provider,{value:y,children:x})}e.r(284508);let b=(0,o.createContext)(h.IDLE_LINK_STATUS),y=()=>(0,o.useContext)(b);("function"==typeof a.default||"object"==typeof a.default&&null!==a.default)&&void 0===a.default.__esModule&&(Object.defineProperty(a.default,"__esModule",{value:!0}),Object.assign(a.default,a),t.exports=a.default)},396661,505014,e=>{"use strict";let t=(...e)=>e.filter((e,t,a)=>!!e&&""!==e.trim()&&a.indexOf(e)===t).join(" ").trim();e.s(["mergeClasses",0,t],396661);var a=e.i(271645),r={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};let i=(0,a.createContext)({}),n=(0,a.forwardRef)(({color:e,size:n,strokeWidth:s,absoluteStrokeWidth:o,className:l="",children:d,iconNode:p,...c},m)=>{let{size:u=24,strokeWidth:h=2,absoluteStrokeWidth:f=!1,color:g="currentColor",className:x=""}=(0,a.useContext)(i)??{},b=o??f?24*Number(s??h)/Number(n??u):s??h;return(0,a.createElement)("svg",{ref:m,...r,width:n??u??r.width,height:n??u??r.height,stroke:e??g,strokeWidth:b,className:t("lucide",x,l),...!d&&!(e=>{for(let t in e)if(t.startsWith("aria-")||"role"===t||"title"===t)return!0;return!1})(c)&&{"aria-hidden":"true"},...c},[...p.map(([e,t])=>(0,a.createElement)(e,t)),...Array.isArray(d)?d:[d]])});e.s(["default",0,n],505014)},618566,(e,t,a)=>{t.exports=e.r(976562)},146387,456420,e=>{"use strict";var t=e.i(271645),a=e.i(396661);let r=e=>{let t=e.replace(/^([A-Z])|[\s-_]+(\w)/g,(e,t,a)=>a?a.toUpperCase():t.toLowerCase());return t.charAt(0).toUpperCase()+t.slice(1)};var i=e.i(505014);let n=(e,n)=>{let s=(0,t.forwardRef)(({className:s,...o},l)=>(0,t.createElement)(i.default,{ref:l,iconNode:n,className:(0,a.mergeClasses)(`lucide-${r(e).replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase()}`,`lucide-${e}`,s),...o}));return s.displayName=r(e),s};e.s(["default",0,n],456420);let s=n("building-2",[["path",{d:"M10 12h4",key:"a56b0p"}],["path",{d:"M10 8h4",key:"1sr2af"}],["path",{d:"M14 21v-3a2 2 0 0 0-4 0v3",key:"1rgiei"}],["path",{d:"M6 10H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2",key:"secmi2"}],["path",{d:"M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16",key:"16ra0t"}]]);e.s(["Building2",0,s],146387)},818581,(e,t,a)=>{"use strict";Object.defineProperty(a,"__esModule",{value:!0}),Object.defineProperty(a,"useMergedRef",{enumerable:!0,get:function(){return i}});let r=e.r(271645);function i(e,t){let a=(0,r.useRef)(null),i=(0,r.useRef)(null);return(0,r.useCallback)(r=>{if(null===r){let e=a.current;e&&(a.current=null,e());let t=i.current;t&&(i.current=null,t())}else e&&(a.current=n(e,r)),t&&(i.current=n(t,r))},[e,t])}function n(e,t){if("function"!=typeof e)return e.current=t,()=>{e.current=null};{let a=e(t);return"function"==typeof a?a:()=>e(null)}}("function"==typeof a.default||"object"==typeof a.default&&null!==a.default)&&void 0===a.default.__esModule&&(Object.defineProperty(a.default,"__esModule",{value:!0}),Object.assign(a.default,a),t.exports=a.default)},823482,e=>{"use strict";let t=(0,e.i(456420).default)("graduation-cap",[["path",{d:"M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z",key:"j76jl0"}],["path",{d:"M22 10v6",key:"1lu8f3"}],["path",{d:"M6 12.5V16a6 3 0 0 0 12 0v-3.5",key:"1r8lef"}]]);e.s(["GraduationCap",0,t],823482)},370812,e=>{"use strict";let t=(0,e.i(456420).default)("bell",[["path",{d:"M10.268 21a2 2 0 0 0 3.464 0",key:"vwvbt9"}],["path",{d:"M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326",key:"11g9vi"}]]);e.s(["Bell",0,t],370812)},716327,867927,e=>{"use strict";var t=e.i(456420);let a=(0,t.default)("chevron-down",[["path",{d:"m6 9 6 6 6-6",key:"qrunsl"}]]);e.s(["ChevronDown",0,a],716327);let r=(0,t.default)("chevron-right",[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]]);e.s(["ChevronRight",0,r],867927)},55677,e=>{"use strict";let t=(0,e.i(456420).default)("clipboard-list",[["rect",{width:"8",height:"4",x:"8",y:"2",rx:"1",ry:"1",key:"tgr4d6"}],["path",{d:"M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",key:"116196"}],["path",{d:"M12 11h4",key:"1jrz19"}],["path",{d:"M12 16h4",key:"n85exb"}],["path",{d:"M8 11h.01",key:"1dfujw"}],["path",{d:"M8 16h.01",key:"18s6g9"}]]);e.s(["ClipboardList",0,t],55677)},166794,e=>{"use strict";let t=(0,e.i(456420).default)("settings",[["path",{d:"M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915",key:"1i5ecw"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);e.s(["Settings",0,t],166794)},584026,e=>{"use strict";let t=(0,e.i(456420).default)("shield-check",[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]]);e.s(["ShieldCheck",0,t],584026)},779432,e=>{"use strict";let t=(0,e.i(456420).default)("activity",[["path",{d:"M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2",key:"169zse"}]]);e.s(["Activity",0,t],779432)},367784,593583,e=>{"use strict";var t=e.i(456420);let a=(0,t.default)("log-out",[["path",{d:"m16 17 5-5-5-5",key:"1bji2h"}],["path",{d:"M21 12H9",key:"dn1m92"}],["path",{d:"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",key:"1uf3rs"}]]);e.s(["LogOut",0,a],367784);let r=(0,t.default)("menu",[["path",{d:"M4 5h16",key:"1tepv9"}],["path",{d:"M4 12h16",key:"1lakjw"}],["path",{d:"M4 19h16",key:"1djgab"}]]);e.s(["Menu",0,r],593583)},749803,e=>{"use strict";let t=(0,e.i(456420).default)("chart-column",[["path",{d:"M3 3v16a2 2 0 0 0 2 2h16",key:"c24i48"}],["path",{d:"M18 17V9",key:"2bz60n"}],["path",{d:"M13 17V5",key:"1frdt8"}],["path",{d:"M8 17v-3",key:"17ska0"}]]);e.s(["BarChart3",0,t],749803)},566595,e=>{"use strict";let t=(0,e.i(456420).default)("search",[["path",{d:"m21 21-4.34-4.34",key:"14j7rj"}],["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}]]);e.s(["Search",0,t],566595)},263676,e=>{"use strict";let t=(0,e.i(456420).default)("x",[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]]);e.s(["X",0,t],263676)},705766,e=>{"use strict";let t,a;var r,i=e.i(271645);let n={data:""},s=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,o=/\/\*[^]*?\*\/|  +/g,l=/\n+/g,d=(e,t)=>{let a="",r="",i="";for(let n in e){let s=e[n];"@"==n[0]?"i"==n[1]?a=n+" "+s+";":r+="f"==n[1]?d(s,n):n+"{"+d(s,"k"==n[1]?"":t)+"}":"object"==typeof s?r+=d(s,t?t.replace(/([^,])+/g,e=>n.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,t=>/&/.test(t)?t.replace(/&/g,e):e?e+" "+t:t)):n):null!=s&&(n="-"==n[1]?n:n.replace(/[A-Z]/g,"-$&").toLowerCase(),i+=d.p?d.p(n,s):n+":"+s+";")}return a+(t&&i?t+"{"+i+"}":i)+r},p={},c=e=>{if("object"==typeof e){let t="";for(let a in e)t+=a+c(e[a]);return t}return e};function m(e){let t,a,r=this||{},i=e.call?e(r.p):e;return((e,t,a,r,i)=>{var n;let m=c(e),u=p[m]||(p[m]=(e=>{let t=0,a=11;for(;t<e.length;)a=101*a+e.charCodeAt(t++)>>>0;return"go"+a})(m));if(!p[u]){let t=m!==e?e:(e=>{let t,a,r=[{}];for(;t=s.exec(e.replace(o,""));)t[4]?r.shift():t[3]?(a=t[3].replace(l," ").trim(),r.unshift(r[0][a]=r[0][a]||{})):r[0][t[1]]=t[2].replace(l," ").trim();return r[0]})(e);p[u]=d(i?{["@keyframes "+u]:t}:t,a?"":"."+u)}let h=a&&p.g;return a&&(p.g=p[u]),n=p[u],h?t.data=t.data.replace(h,n):-1===t.data.indexOf(n)&&(t.data=r?n+t.data:t.data+n),u})(i.unshift?i.raw?(t=[].slice.call(arguments,1),a=r.p,i.reduce((e,r,i)=>{let n=t[i];if(n&&n.call){let e=n(a),t=e&&e.props&&e.props.className||/^go/.test(e)&&e;n=t?"."+t:e&&"object"==typeof e?e.props?"":d(e,""):!1===e?"":e}return e+r+(null==n?"":n)},"")):i.reduce((e,t)=>Object.assign(e,t&&t.call?t(r.p):t),{}):i,(e=>{if("object"==typeof window){let t=(e?e.querySelector("#_goober"):window._goober)||Object.assign(document.createElement("style"),{innerHTML:" ",id:"_goober"});return t.nonce=window.__nonce__,t.parentNode||(e||document.head).appendChild(t),t.firstChild}return e||n})(r.target),r.g,r.o,r.k)}m.bind({g:1});let u,h,f,g=m.bind({k:1});function x(e,t){let a=this||{};return function(){let r=arguments;function i(n,s){let o=Object.assign({},n),l=o.className||i.className;a.p=Object.assign({theme:h&&h()},o),a.o=/go\d/.test(l),o.className=m.apply(a,r)+(l?" "+l:""),t&&(o.ref=s);let d=e;return e[0]&&(d=o.as||e,delete o.as),f&&d[0]&&f(o),u(d,o)}return t?t(i):i}}var b=(e,t)=>"function"==typeof e?e(t):e,y=(t=0,()=>(++t).toString()),v=()=>{if(void 0===a&&"u">typeof window){let e=matchMedia("(prefers-reduced-motion: reduce)");a=!e||e.matches}return a},w="default",_=(e,t)=>{let{toastLimit:a}=e.settings;switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,a)};case 1:return{...e,toasts:e.toasts.map(e=>e.id===t.toast.id?{...e,...t.toast}:e)};case 2:let{toast:r}=t;return _(e,{type:+!!e.toasts.find(e=>e.id===r.id),toast:r});case 3:let{toastId:i}=t;return{...e,toasts:e.toasts.map(e=>e.id===i||void 0===i?{...e,dismissed:!0,visible:!1}:e)};case 4:return void 0===t.toastId?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(e=>e.id!==t.toastId)};case 5:return{...e,pausedAt:t.time};case 6:let n=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(e=>({...e,pauseDuration:e.pauseDuration+n}))}}},k=[],j={toasts:[],pausedAt:void 0,settings:{toastLimit:20}},$={},S=(e,t=w)=>{$[t]=_($[t]||j,e),k.forEach(([e,a])=>{e===t&&a($[t])})},C=e=>Object.keys($).forEach(t=>S(e,t)),N=(e=w)=>t=>{S(t,e)},z={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},A=e=>(t,a)=>{let r,i=((e,t="blank",a)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:t,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...a,id:(null==a?void 0:a.id)||y()}))(t,e,a);return N(i.toasterId||(r=i.id,Object.keys($).find(e=>$[e].toasts.some(e=>e.id===r))))({type:2,toast:i}),i.id},M=(e,t)=>A("blank")(e,t);M.error=A("error"),M.success=A("success"),M.loading=A("loading"),M.custom=A("custom"),M.dismiss=(e,t)=>{let a={type:3,toastId:e};t?N(t)(a):C(a)},M.dismissAll=e=>M.dismiss(void 0,e),M.remove=(e,t)=>{let a={type:4,toastId:e};t?N(t)(a):C(a)},M.removeAll=e=>M.remove(void 0,e),M.promise=(e,t,a)=>{let r=M.loading(t.loading,{...a,...null==a?void 0:a.loading});return"function"==typeof e&&(e=e()),e.then(e=>{let i=t.success?b(t.success,e):void 0;return i?M.success(i,{id:r,...a,...null==a?void 0:a.success}):M.dismiss(r),e}).catch(e=>{let i=t.error?b(t.error,e):void 0;i?M.error(i,{id:r,...a,...null==a?void 0:a.error}):M.dismiss(r)}),e};var P=1e3,E=g`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,O=g`
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

  animation: ${E} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${O} 0.15s ease-out forwards;
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
`,L=x("div")`
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
}`,F=g`
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
}`,H=x("div")`
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
    animation: ${F} 0.2s ease-out forwards;
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
`,B=x("div")`
  position: absolute;
`,U=x("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,q=g`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,V=x("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${q} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,K=({toast:e})=>{let{icon:t,type:a,iconTheme:r}=e;return void 0!==t?"string"==typeof t?i.createElement(V,null,t):t:"blank"===a?null:i.createElement(U,null,i.createElement(L,{...r}),"loading"!==a&&i.createElement(B,null,"error"===a?i.createElement(T,{...r}):i.createElement(H,{...r})))},J=x("div")`
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
`,W=x("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,G=i.memo(({toast:e,position:t,style:a,children:r})=>{let n=e.height?((e,t)=>{let a=e.includes("top")?1:-1,[r,i]=v()?["0%{opacity:0;} 100%{opacity:1;}","0%{opacity:1;} 100%{opacity:0;}"]:[`
0% {transform: translate3d(0,${-200*a}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${-150*a}%,-1px) scale(.6); opacity:0;}
`];return{animation:t?`${g(r)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${g(i)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}})(e.position||t||"top-center",e.visible):{opacity:0},s=i.createElement(K,{toast:e}),o=i.createElement(W,{...e.ariaProps},b(e.message,e));return i.createElement(J,{className:e.className,style:{...n,...a,...e.style}},"function"==typeof r?r({icon:s,message:o}):i.createElement(i.Fragment,null,s,o))});r=i.createElement,d.p=void 0,u=r,h=void 0,f=void 0;var Y=({id:e,className:t,style:a,onHeightUpdate:r,children:n})=>{let s=i.useCallback(t=>{if(t){let a=()=>{r(e,t.getBoundingClientRect().height)};a(),new MutationObserver(a).observe(t,{subtree:!0,childList:!0,characterData:!0})}},[e,r]);return i.createElement("div",{ref:s,className:t,style:a},n)},Q=m`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`;e.s(["Toaster",0,({reverseOrder:e,position:t="top-center",toastOptions:a,gutter:r,children:n,toasterId:s,containerStyle:o,containerClassName:l})=>{let{toasts:d,handlers:p}=((e,t="default")=>{let{toasts:a,pausedAt:r}=((e={},t=w)=>{let[a,r]=(0,i.useState)($[t]||j),n=(0,i.useRef)($[t]);(0,i.useEffect)(()=>(n.current!==$[t]&&r($[t]),k.push([t,r]),()=>{let e=k.findIndex(([e])=>e===t);e>-1&&k.splice(e,1)}),[t]);let s=a.toasts.map(t=>{var a,r,i;return{...e,...e[t.type],...t,removeDelay:t.removeDelay||(null==(a=e[t.type])?void 0:a.removeDelay)||(null==e?void 0:e.removeDelay),duration:t.duration||(null==(r=e[t.type])?void 0:r.duration)||(null==e?void 0:e.duration)||z[t.type],style:{...e.style,...null==(i=e[t.type])?void 0:i.style,...t.style}}});return{...a,toasts:s}})(e,t),n=(0,i.useRef)(new Map).current,s=(0,i.useCallback)((e,t=P)=>{if(n.has(e))return;let a=setTimeout(()=>{n.delete(e),o({type:4,toastId:e})},t);n.set(e,a)},[]);(0,i.useEffect)(()=>{if(r)return;let e=Date.now(),i=a.map(a=>{if(a.duration===1/0)return;let r=(a.duration||0)+a.pauseDuration-(e-a.createdAt);if(r<0){a.visible&&M.dismiss(a.id);return}return setTimeout(()=>M.dismiss(a.id,t),r)});return()=>{i.forEach(e=>e&&clearTimeout(e))}},[a,r,t]);let o=(0,i.useCallback)(N(t),[t]),l=(0,i.useCallback)(()=>{o({type:5,time:Date.now()})},[o]),d=(0,i.useCallback)((e,t)=>{o({type:1,toast:{id:e,height:t}})},[o]),p=(0,i.useCallback)(()=>{r&&o({type:6,time:Date.now()})},[r,o]),c=(0,i.useCallback)((e,t)=>{let{reverseOrder:r=!1,gutter:i=8,defaultPosition:n}=t||{},s=a.filter(t=>(t.position||n)===(e.position||n)&&t.height),o=s.findIndex(t=>t.id===e.id),l=s.filter((e,t)=>t<o&&e.visible).length;return s.filter(e=>e.visible).slice(...r?[l+1]:[0,l]).reduce((e,t)=>e+(t.height||0)+i,0)},[a]);return(0,i.useEffect)(()=>{a.forEach(e=>{if(e.dismissed)s(e.id,e.removeDelay);else{let t=n.get(e.id);t&&(clearTimeout(t),n.delete(e.id))}})},[a,s]),{toasts:a,handlers:{updateHeight:d,startPause:l,endPause:p,calculateOffset:c}}})(a,s);return i.createElement("div",{"data-rht-toaster":s||"",style:{position:"fixed",zIndex:9999,top:16,left:16,right:16,bottom:16,pointerEvents:"none",...o},className:l,onMouseEnter:p.startPause,onMouseLeave:p.endPause},d.map(a=>{let s,o,l=a.position||t,d=p.calculateOffset(a,{reverseOrder:e,gutter:r,defaultPosition:t}),c=(s=l.includes("top"),o=l.includes("center")?{justifyContent:"center"}:l.includes("right")?{justifyContent:"flex-end"}:{},{left:0,right:0,display:"flex",position:"absolute",transition:v()?void 0:"all 230ms cubic-bezier(.21,1.02,.73,1)",transform:`translateY(${d*(s?1:-1)}px)`,...s?{top:0}:{bottom:0},...o});return i.createElement(Y,{id:a.id,key:a.id,onHeightUpdate:p.updateHeight,className:a.visible?Q:"",style:c},"custom"===a.type?b(a.message,a):n?n(a):i.createElement(G,{toast:a,position:l}))}))},"default",0,M,"toast",0,M],705766)},920476,e=>{"use strict";async function t(e,t){let a=await fetch(e,t),r=await a.json().catch(()=>null);if(!a.ok)throw Error(r?.error||r?.message||`Request failed with ${a.status}`);return r}e.s(["apiJson",0,t,"errorMessage",0,function(e,t="Something went wrong"){return e instanceof Error?e.message:t}])},856423,e=>{"use strict";let t=(0,e.i(456420).default)("book-open",[["path",{d:"M12 7v14",key:"1akyts"}],["path",{d:"M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z",key:"ruj8y"}]]);e.s(["BookOpen",0,t],856423)},730274,e=>{"use strict";let t=(0,e.i(456420).default)("send",[["path",{d:"M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",key:"1ffxy3"}],["path",{d:"m21.854 2.147-10.94 10.939",key:"12cjpa"}]]);e.s(["Send",0,t],730274)},462047,e=>{"use strict";var t=e.i(705766);e.s(["notify",0,{success:e=>t.default.success(e),error:e=>t.default.error(e),warning:e=>(0,t.default)(e,{icon:"⚠️"}),info:e=>(0,t.default)(e,{icon:"ℹ️"})}])},856522,e=>{"use strict";let t=(0,e.i(456420).default)("save",[["path",{d:"M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",key:"1c8476"}],["path",{d:"M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7",key:"1ydtos"}],["path",{d:"M7 3v4a1 1 0 0 0 1 1h7",key:"t51u73"}]]);e.s(["Save",0,t],856522)},77043,e=>{"use strict";let t=(0,e.i(456420).default)("printer",[["path",{d:"M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2",key:"143wyd"}],["path",{d:"M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6",key:"1itne7"}],["rect",{x:"6",y:"14",width:"12",height:"8",rx:"1",key:"1ue0tg"}]]);e.s(["Printer",0,t],77043)},647629,e=>{"use strict";var t=e.i(462047);async function a({title:e,subtitle:s,documentLabel:o,metaHtml:l,bodyHtml:d,footerHtml:p,popupError:c="Allow popups to print this document.",pageSize:m="full",verificationUrl:u,barcodeValue:h}){var f;let g=window.open("","_blank","half"===m?"width=760,height=620":"width=980,height=760");if(!g)return void t.notify.error(c);g.document.open(),g.document.write((f=e,`
    <html>
      <head>
        <title>${r(f)}</title>
        <style>
          body{font-family:Arial,sans-serif;display:grid;min-height:100vh;place-items:center;color:#04142E}
          div{border:1px solid #e5e7eb;border-radius:16px;padding:24px 28px;box-shadow:0 20px 60px rgba(15,23,42,.12)}
          strong{display:block;font-size:18px}
          span{display:block;margin-top:6px;color:#64748b}
        </style>
      </head>
      <body>
        <div>
          <strong>Preparing ${r(f)}</strong>
          <span>Loading school branding...</span>
        </div>
      </body>
    </html>
  `)),g.document.close();let x=await i(),b=u?await n(u):null;g.document.open(),g.document.write(function({branding:e,title:t,subtitle:a,documentLabel:i,metaHtml:n,bodyHtml:s,footerHtml:o,pageSize:l="full",verificationUrl:d,barcodeValue:p,qrDataUrl:c}){let m=e.schoolName||e.product||"TOTTECH ONE",u=e.schoolCode||e.tagline||"Gateway To Learning",h=e.logoUrl||"/images/logo.png",f=e.primaryColor||"#04142E",g=e.secondaryColor||"#D4AF37",x=[e.address,e.phone,e.email].filter(Boolean).join(" | ");return"half"===l?function({title:e,subtitle:t,documentLabel:a,metaHtml:i,bodyHtml:n,footerHtml:s,schoolName:o,schoolCode:l,logoUrl:d,contact:p,verificationUrl:c,barcodeValue:m,qrDataUrl:u}){let h=h=>`
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
          <span>${r(h)}</span>
        </div>
      </header>
      <div class="copy-main">
        <div class="copy-intro">
          <h2>${r(e)}</h2>
          ${t?`<p>${r(t)}</p>`:""}
        </div>
        ${i||""}
        <div class="print-body">${n}</div>
        ${c||u?`<div class="verify-row">
                ${u?`<img class="qr" src="${r(u)}" alt="QR verification" />`:""}
                <div>
                  <div class="barcode">${(m||e||"TOTTECH").slice(0,42).split("").map((e,t)=>{let a=e.charCodeAt(0);return Array.from({length:5}).map((e,r)=>{let i=(a>>r&1)==1||(t+r)%4==0;return`<span style="display:inline-block;width:${i?2:1}px;height:18px;background:${i?"#111":"transparent"};margin-right:1px"></span>`}).join("")}).join("")}</div>
                  <p>${r(c||"")}</p>
                </div>
              </div>`:""}
      </div>
      <footer class="copy-footer">
        <span>${r(h)}</span>
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
          ${h("PARENT COPY")}
          <div class="cut-line"><span>Cut Here</span></div>
          ${h("SCHOOL RECORD COPY")}
        </main>
      </body>
    </html>
  `}({title:t,subtitle:a,documentLabel:i,metaHtml:n,bodyHtml:s,footerHtml:o,schoolName:m,schoolCode:u,logoUrl:h,contact:x,verificationUrl:d,barcodeValue:p,qrDataUrl:c}):`
    <html>
      <head>
        <title>${r(t)}</title>
        <style>
          :root{--print-primary:${f};--print-gold:${g};--print-ink:#071426;--print-muted:#64748b;--print-line:#d8dee8;--print-soft:#f8fafc}
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
              <img class="print-logo" src="${r(h)}" alt="${r(m)} logo" />
              <div class="print-school">
                <h1>${r(m)}</h1>
                <p>${r(u)}</p>
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
  `}({branding:x,title:e,subtitle:s,documentLabel:o,metaHtml:l,bodyHtml:d,footerHtml:p,pageSize:m,verificationUrl:u,barcodeValue:h,qrDataUrl:b})),g.document.close(),g.focus(),window.setTimeout(()=>{g.print()},250)}function r(e){return e.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;")}async function i(){try{let e=await fetch("/api/my-school-branding",{cache:"no-store"});if(!e.ok)throw Error("Branding unavailable");return await e.json()}catch{return{schoolName:"TOTTECH ONE",schoolCode:"Gateway To Learning",logoUrl:"/images/logo.png",primaryColor:"#04142E",secondaryColor:"#D4AF37"}}}async function n(t){try{return(await e.A(673378)).toDataURL(t,{errorCorrectionLevel:"M",margin:1,width:120,color:{dark:"#111111",light:"#FFFFFF"}})}catch{return null}}e.s(["printBrandedDocument",0,a,"printMetaGrid",0,function(e){return`<div class="print-meta-grid">${e.map(e=>`
        <div class="print-meta-card">
          <span>${r(e.label)}</span>
          <strong>${r(String(e.value??"-"))}</strong>
        </div>
      `).join("")}</div>`}])},958142,e=>{"use strict";var t=e.i(843476),a=e.i(77043);let r=(0,e.i(456420).default)("receipt-indian-rupee",[["path",{d:"M4 3a1 1 0 0 1 1-1 1.3 1.3 0 0 1 .7.2l.933.6a1.3 1.3 0 0 0 1.4 0l.934-.6a1.3 1.3 0 0 1 1.4 0l.933.6a1.3 1.3 0 0 0 1.4 0l.933-.6a1.3 1.3 0 0 1 1.4 0l.934.6a1.3 1.3 0 0 0 1.4 0l.933-.6A1.3 1.3 0 0 1 19 2a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1 1.3 1.3 0 0 1-.7-.2l-.933-.6a1.3 1.3 0 0 0-1.4 0l-.934.6a1.3 1.3 0 0 1-1.4 0l-.933-.6a1.3 1.3 0 0 0-1.4 0l-.933.6a1.3 1.3 0 0 1-1.4 0l-.934-.6a1.3 1.3 0 0 0-1.4 0l-.933.6a1.3 1.3 0 0 1-.7.2 1 1 0 0 1-1-1z",key:"ycz6yz"}],["path",{d:"M8 11h8",key:"vwpz6n"}],["path",{d:"M8 7h8",key:"i86dvs"}],["path",{d:"M9 7a4 4 0 0 1 0 8H8l3 2",key:"1xaco0"}]]);var i=e.i(856522),n=e.i(271645),s=e.i(859015),o=e.i(920476),l=e.i(647629),d=e.i(462047);let p={class_id:"",section_id:"",academic_year_id:"",student_id:""};function c(){let e=new Date;return e.setMinutes(e.getMinutes()-e.getTimezoneOffset()),e.toISOString().slice(0,10)}let m={invoice_id:"",installment_id:"",amount:"",payment_method:"CASH",payment_date:c(),reference_number:"",remarks:""};async function u(e,t){let a=Array.isArray(t?.line_items)&&t?.line_items||[],r=Array.isArray(t?.installments)&&t?.installments||[],i=e?.metadata?.installment_id||e?.installment_id,n=r.find(e=>i&&Number(e.id)===Number(i))||null,s=a.map(e=>`
        <tr>
          <td>${h(String(e.fee_name||"Fee"))}</td>
          <td class="right">Rs. ${Number(e.amount||0)}</td>
        </tr>
      `).join(""),o=r.map(e=>`
        <tr>
          <td>${h(String(e.part_label||`Part ${e.part_number||""}`))}</td>
          <td>${f(e.due_date)}</td>
          <td class="right">Rs. ${Number(e.amount||0)}</td>
          <td class="right">Rs. ${Number(e.paid_amount||0)}</td>
          <td class="right">Rs. ${Number(e.balance_amount||0)}</td>
          <td>${h(String(e.status||"-"))}</td>
        </tr>
      `).join(""),d=e?.receipt_number||`Payment ${e?.id||""}`,p=`${window.location.origin}/verify/receipt/${encodeURIComponent(String(d))}`;await (0,l.printBrandedDocument)({title:"Fee Collection Receipt",subtitle:"Paid fee particulars with invoice and installment breakup.",documentLabel:"Fee Receipt",pageSize:"half",metaHtml:(0,l.printMetaGrid)([{label:"Receipt",value:d},{label:"Invoice",value:e?.invoice_number||t?.invoice_number||t?.id||"-"},{label:"Student",value:e?.student_name||t?.student_name||"-"},{label:"Class / Section",value:[e?.class_name||t?.class_name,e?.section_name||t?.section_name].filter(Boolean).join(" ")||"-"},{label:"Payment Date",value:f(e?.payment_date||e?.created_at)},{label:"Method",value:e?.payment_method||"-"},{label:"Reference",value:e?.reference_number||"-"},{label:"Collected Amount",value:`Rs. ${Number(e?.amount||0)}`}]),bodyHtml:`
        ${n?`<div class="print-notice"><strong>Paid Part:</strong> ${h(String(n.part_label||`Part ${n.part_number||""}`))} | Balance after part update: Rs. ${Number(n.balance_amount||0)}</div>`:""}
        <h3 class="print-section-title">Fee Particulars</h3>
        <table>
          <thead><tr><th>Particular</th><th class="right">Amount</th></tr></thead>
          <tbody>${s||"<tr><td colspan='2'>Fee particulars are not attached to this invoice.</td></tr>"}</tbody>
        </table>
        <h3 class="print-section-title">Installment Particulars</h3>
        <table>
          <thead><tr><th>Part</th><th>Due Date</th><th class="right">Amount</th><th class="right">Paid</th><th class="right">Balance</th><th>Status</th></tr></thead>
          <tbody>${o||"<tr><td colspan='6'>No installment parts recorded.</td></tr>"}</tbody>
        </table>
        <div class="summary">
          <div>Total Invoice<br><strong>Rs. ${Number(t?.total_amount||0)}</strong></div>
          <div>Paid Till Now<br><strong>Rs. ${Number(t?.paid_amount||0)}</strong></div>
          <div>Balance<br><strong>Rs. ${Number(t?.balance_amount||0)}</strong></div>
          <div>Status<br><strong>${h(String(t?.status||"-"))}</strong></div>
        </div>
        <p class="sign">Authorized Signature</p>
	    `,verificationUrl:p,barcodeValue:String(d),popupError:"Allow popups to print fee particulars."})}function h(e){return e.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;")}function f(e){if(!e)return"-";let t=new Date(e);return Number.isNaN(t.getTime())?String(e):t.toLocaleDateString()}function g({label:e,value:a,onChange:r,type:i="text",min:n}){return(0,t.jsxs)("label",{className:"min-w-0",children:[(0,t.jsx)("span",{className:"mb-1 block text-sm font-bold text-slate-700",children:e}),(0,t.jsx)("input",{type:i,min:n,className:"input",value:a,onChange:e=>r(e.target.value)})]})}function x({label:e,value:a,onChange:r,children:i,disabled:n=!1}){return(0,t.jsxs)("label",{className:"min-w-0",children:[(0,t.jsx)("span",{className:"mb-1 block text-sm font-bold text-slate-700",children:e}),(0,t.jsx)("select",{className:"input",value:a,disabled:n,onChange:e=>r(e.target.value),children:i})]})}function b({label:e,value:a}){return(0,t.jsxs)("div",{className:"min-w-0",children:[(0,t.jsx)("p",{className:"text-xs font-bold uppercase text-slate-500",children:e}),(0,t.jsx)("p",{className:"truncate font-semibold text-slate-950",children:a})]})}e.s(["default",0,function(){let[e,l]=(0,n.useState)([]),[h,f]=(0,n.useState)([]),[y,v]=(0,n.useState)([]),[w,_]=(0,n.useState)([]),[k,j]=(0,n.useState)([]),[$,S]=(0,n.useState)([]),[C,N]=(0,n.useState)(""),[z,A]=(0,n.useState)(""),[M,P]=(0,n.useState)(""),[E,O]=(0,n.useState)(""),[R,T]=(0,n.useState)(p),[D,L]=(0,n.useState)(m),[I,F]=(0,n.useState)(!1);(0,n.useEffect)(()=>{H()},[]);let H=async()=>{try{let[e,t,a,r]=await Promise.all([(0,o.apiJson)("/api/finance/invoices"),(0,o.apiJson)("/api/finance/payments"),(0,o.apiJson)("/api/roster"),(0,o.apiJson)("/api/academic-years?include_all=true")]);l(e.invoices||[]),f(t.payments||[]),v(a.classes||[]),_(a.sections||[]),j(a.students||[]),S(Array.isArray(r)?r:[])}catch(e){d.notify.error((0,o.errorMessage)(e,"Failed to load payments"))}},B=e.find(e=>String(e.id)===D.invoice_id)||null,U=(Array.isArray(B?.installments)?B.installments:[]).filter(e=>Number(e.balance_amount||0)>0||"PAID"!==String(e.status)),q=(0,n.useMemo)(()=>e.filter(e=>{let t=`
            ${e.invoice_number||""}
            ${e.student_name||""}
            ${e.class_name||""}
            ${e.section_name||""}
            ${e.status||""}
          `.toLowerCase().includes(E.toLowerCase()),a=!C||String(e.class_id)===C,r=!z||String(e.section_id)===z,i=!M||String(e.student_id)===M;return t&&a&&r&&i}),[e,E,C,z,M]),V=w.filter(e=>!C||String(e.class_id)===C),K=k.filter(e=>(!C||String(e.class_id)===C)&&(!z||String(e.section_id)===z)),J=w.filter(e=>!R.class_id||String(e.class_id)===R.class_id),W=k.filter(e=>(!R.class_id||String(e.class_id)===R.class_id)&&(!R.section_id||String(e.section_id)===R.section_id)),G=Object.values(R).filter(Boolean).length,Y=G>=3,Q=(0,n.useMemo)(()=>Y?h.filter(e=>{let t=!R.class_id||String(e.class_id)===R.class_id,a=!R.section_id||String(e.section_id)===R.section_id,r=!R.academic_year_id||"all"===R.academic_year_id||String(e.academic_year_id??"")===R.academic_year_id,i=!R.student_id||String(e.student_id)===R.student_id;return t&&a&&r&&i}):[],[h,R,Y]),X=async()=>{try{F(!0);let e=await (0,o.apiJson)("/api/finance/payments",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(D)});d.notify.success("Payment recorded");let t=e?.payment||null,a=e?.invoice&&B?{...B,...e.invoice}:e?.invoice||B;t&&a&&u(t,a),L(m),O(""),T(p),H()}catch(e){d.notify.error((0,o.errorMessage)(e,"Failed to record payment"))}finally{F(!1)}};return(0,t.jsx)(s.default,{children:(0,t.jsxs)("div",{className:"space-y-6",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("h1",{className:"text-3xl font-black md:text-4xl",children:"Fee Payments"}),(0,t.jsx)("p",{className:"mt-1 text-sm text-slate-600",children:"Record paid invoices, partial payments, and installment collections."})]}),(0,t.jsxs)("div",{className:"tt-card tt-card-pad",children:[(0,t.jsx)("h2",{className:"mb-4 text-xl font-black",children:"Record Payment"}),(0,t.jsxs)("div",{className:"grid gap-4 md:grid-cols-2 xl:grid-cols-4",children:[(0,t.jsxs)(x,{label:"Class",value:C,onChange:e=>{N(e),A(""),P(""),L({...D,invoice_id:"",installment_id:"",amount:""})},children:[(0,t.jsx)("option",{value:"",children:"All Classes"}),y.map(e=>(0,t.jsx)("option",{value:e.id,children:e.class_name||`Class ${e.id}`},e.id))]}),(0,t.jsxs)(x,{label:"Section",value:z,onChange:e=>{A(e),P(""),L({...D,invoice_id:"",installment_id:"",amount:""})},disabled:!C,children:[(0,t.jsx)("option",{value:"",children:"All Sections"}),V.map(e=>(0,t.jsx)("option",{value:e.id,children:e.section_name||`Section ${e.id}`},e.id))]}),(0,t.jsxs)(x,{label:"Student",value:M,onChange:e=>{P(e),L({...D,invoice_id:"",installment_id:"",amount:""})},children:[(0,t.jsx)("option",{value:"",children:"All Students"}),K.map(e=>(0,t.jsxs)("option",{value:e.id,children:[e.name||`${e.first_name||""} ${e.last_name||""}`.trim()||`Student ${e.id}`,e.admission_number?` (${e.admission_number})`:""]},e.id))]}),(0,t.jsx)(g,{label:"Search Invoice to Collect",value:E,onChange:O}),(0,t.jsxs)(x,{label:"Invoice",value:D.invoice_id,onChange:e=>L({...D,invoice_id:e,installment_id:"",amount:""}),children:[(0,t.jsx)("option",{value:"",children:"Select Invoice"}),q.map(e=>(0,t.jsxs)("option",{value:e.id,children:[e.invoice_number||`Invoice ${e.id}`," - ",e.student_name||"Student"," - Rs. ",Number(e.balance_amount||0)]},e.id))]}),(0,t.jsxs)(x,{label:"Installment",value:D.installment_id,onChange:e=>{let t=U.find(t=>String(t.id)===e);L({...D,installment_id:e,amount:t?String(t.balance_amount||t.amount||""):D.amount})},disabled:!D.invoice_id,children:[(0,t.jsx)("option",{value:"",children:"Auto / invoice balance"}),U.map(e=>(0,t.jsxs)("option",{value:e.id,children:[e.part_label||`Part ${e.part_number}`," - due ",e.due_date?new Date(e.due_date).toLocaleDateString():"-"," - Rs. ",Number(e.balance_amount||0)]},e.id))]}),(0,t.jsx)(g,{label:"Amount",value:D.amount,onChange:e=>L({...D,amount:e})}),(0,t.jsx)(g,{label:"Payment Date",type:"date",min:c(),value:D.payment_date,onChange:e=>L({...D,payment_date:e})}),(0,t.jsxs)(x,{label:"Method",value:D.payment_method,onChange:e=>L({...D,payment_method:e}),children:[(0,t.jsx)("option",{value:"CASH",children:"Cash"}),(0,t.jsx)("option",{value:"UPI",children:"UPI"}),(0,t.jsx)("option",{value:"CARD",children:"Card"}),(0,t.jsx)("option",{value:"BANK_TRANSFER",children:"Bank Transfer"}),(0,t.jsx)("option",{value:"CHEQUE",children:"Cheque"})]}),(0,t.jsx)(g,{label:"Reference Number",value:D.reference_number,onChange:e=>L({...D,reference_number:e})}),(0,t.jsx)(g,{label:"Remarks",value:D.remarks,onChange:e=>L({...D,remarks:e})})]}),B&&(0,t.jsxs)("div",{className:"mt-5 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700",children:[(0,t.jsx)("strong",{className:"text-slate-950",children:B.student_name||"Student"})," ","has an invoice balance of"," ",(0,t.jsxs)("strong",{className:"text-slate-950",children:["Rs."," ",Number(B.balance_amount||0)]})," ","for"," ",B.class_name||"-",B.section_name?` ${B.section_name}`:"","."]}),(0,t.jsxs)("button",{onClick:X,disabled:I,className:"tt-button mt-5 inline-flex items-center gap-2",children:[(0,t.jsx)(i.Save,{size:17}),I?"Saving...":"Record Payment"]})]}),(0,t.jsxs)("section",{className:"tt-card tt-card-pad",children:[(0,t.jsxs)("div",{className:"mb-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("h2",{className:"text-xl font-black",children:"Collected Fees"}),(0,t.jsx)("p",{className:"mt-1 text-sm font-semibold text-slate-500",children:"Search receipts by selecting any three fields: class, section, academic year, and student name."})]}),(0,t.jsx)("button",{type:"button",onClick:()=>T(p),className:"rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-700",children:"Clear Filters"})]}),(0,t.jsxs)("div",{className:"mb-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4",children:[(0,t.jsxs)(x,{label:"Class",value:R.class_id,onChange:e=>T(t=>({...t,class_id:e,section_id:"",student_id:""})),children:[(0,t.jsx)("option",{value:"",children:"Select Class"}),y.map(e=>(0,t.jsx)("option",{value:e.id,children:e.class_name||`Class ${e.id}`},e.id))]}),(0,t.jsxs)(x,{label:"Section",value:R.section_id,onChange:e=>T(t=>({...t,section_id:e,student_id:""})),disabled:!R.class_id,children:[(0,t.jsx)("option",{value:"",children:"Select Section"}),J.map(e=>(0,t.jsx)("option",{value:e.id,children:e.section_name||`Section ${e.id}`},e.id))]}),(0,t.jsxs)(x,{label:"Academic Year",value:R.academic_year_id,onChange:e=>T(t=>({...t,academic_year_id:e})),children:[(0,t.jsx)("option",{value:"",children:"Select Academic Year"}),$.map(e=>(0,t.jsx)("option",{value:e.id,children:e.academic_year||`Year ${e.id}`},e.id))]}),(0,t.jsxs)(x,{label:"Student Name",value:R.student_id,onChange:e=>T(t=>({...t,student_id:e})),children:[(0,t.jsx)("option",{value:"",children:"Select Student"}),W.map(e=>(0,t.jsxs)("option",{value:e.id,children:[e.name||`${e.first_name||""} ${e.last_name||""}`.trim()||`Student ${e.id}`,e.admission_number?` (${e.admission_number})`:""]},e.id))]})]}),(0,t.jsx)("div",{className:"rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm font-bold text-slate-700",children:Y?(0,t.jsxs)(t.Fragment,{children:["Showing"," ",(0,t.jsx)("span",{className:"text-slate-950",children:Q.length})," ","of"," ",(0,t.jsx)("span",{className:"text-slate-950",children:h.length})," ","collected fee records"]}):(0,t.jsxs)(t.Fragment,{children:["Select at least"," ",(0,t.jsx)("span",{className:"text-slate-950",children:Math.max(0,3-G)})," ","more filter",3-G==1?"":"s"," ","to search collected fees."]})})]}),(0,t.jsxs)("div",{className:"grid gap-4 md:grid-cols-2 xl:grid-cols-3",children:[Q.map(i=>(0,t.jsxs)("article",{className:"tt-card tt-card-pad",children:[(0,t.jsxs)("div",{className:"flex items-start gap-3",children:[(0,t.jsx)("div",{className:"grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-emerald-50 text-emerald-700",children:(0,t.jsx)(r,{size:20})}),(0,t.jsxs)("div",{className:"min-w-0",children:[(0,t.jsx)("h2",{className:"truncate text-lg font-black",children:i.receipt_number||`Receipt ${i.id}`}),(0,t.jsx)("p",{className:"truncate text-sm font-semibold text-amber-700",children:i.invoice_number||"Invoice"})]})]}),(0,t.jsxs)("div",{className:"mt-5 grid grid-cols-2 gap-3 text-sm",children:[(0,t.jsx)(b,{label:"Student",value:i.student_name||"-"}),(0,t.jsx)(b,{label:"Amount",value:`Rs. ${Number(i.amount||0)}`}),(0,t.jsx)(b,{label:"Method",value:i.payment_method||"-"}),(0,t.jsx)(b,{label:"Date",value:i.payment_date?new Date(i.payment_date).toLocaleDateString():"-"})]}),(0,t.jsxs)("button",{onClick:()=>{let t=e.find(e=>Number(e.id)===Number(i.invoice_id))||null;u(i,t)},className:"mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm font-black text-amber-900",children:[(0,t.jsx)(a.Printer,{size:16}),"Print Fee Particulars"]})]},i.id)),Q.length?null:(0,t.jsx)("div",{className:"tt-card tt-card-pad md:col-span-2 xl:col-span-3",children:(0,t.jsx)("p",{className:"font-bold text-slate-600",children:"No collected fee records match the selected filters."})})]})]})})}],958142)},673378,e=>{e.v(t=>Promise.all(["static/chunks/0kauo_1p4s347.js"].map(t=>e.l(t))).then(()=>t(973134)))}]);