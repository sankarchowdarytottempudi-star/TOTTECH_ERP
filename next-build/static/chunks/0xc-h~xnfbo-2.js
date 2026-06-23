(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,270904,e=>{"use strict";let t=(0,e.i(456420).default)("wallet",[["path",{d:"M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1",key:"18etb6"}],["path",{d:"M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4",key:"xoc0q4"}]]);e.s(["Wallet",0,t],270904)},195057,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0});var a={formatUrl:function(){return n},formatWithValidation:function(){return c},urlObjectKeys:function(){return l}};for(var s in a)Object.defineProperty(r,s,{enumerable:!0,get:a[s]});let o=e.r(190809)._(e.r(998183)),i=/https?|ftp|gopher|file/;function n(e){let{auth:t,hostname:r}=e,a=e.protocol||"",s=e.pathname||"",n=e.hash||"",l=e.query||"",c=!1;t=t?encodeURIComponent(t).replace(/%3A/i,":")+"@":"",e.host?c=t+e.host:r&&(c=t+(~r.indexOf(":")?`[${r}]`:r),e.port&&(c+=":"+e.port)),l&&"object"==typeof l&&(l=String(o.urlQueryToSearchParams(l)));let d=e.search||l&&`?${l}`||"";return a&&!a.endsWith(":")&&(a+=":"),e.slashes||(!a||i.test(a))&&!1!==c?(c="//"+(c||""),s&&"/"!==s[0]&&(s="/"+s)):c||(c=""),n&&"#"!==n[0]&&(n="#"+n),d&&"?"!==d[0]&&(d="?"+d),s=s.replace(/[?#]/g,encodeURIComponent),d=d.replace("#","%23"),`${a}${c}${s}${d}${n}`}let l=["auth","hash","host","hostname","href","path","pathname","port","protocol","query","search","slashes"];function c(e){return n(e)}},573668,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"isLocalURL",{enumerable:!0,get:function(){return o}});let a=e.r(718967),s=e.r(652817);function o(e){if(!(0,a.isAbsoluteUrl)(e))return!0;try{let t=(0,a.getLocationOrigin)(),r=new URL(e,t);return r.origin===t&&(0,s.hasBasePath)(r.pathname)}catch(e){return!1}}},284508,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"errorOnce",{enumerable:!0,get:function(){return a}});let a=e=>{}},522016,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0});var a={default:function(){return g},useLinkStatus:function(){return v}};for(var s in a)Object.defineProperty(r,s,{enumerable:!0,get:a[s]});let o=e.r(190809),i=e.r(843476),n=o._(e.r(271645)),l=e.r(195057),c=e.r(8372),d=e.r(818581),u=e.r(718967),p=e.r(405550);e.r(233525);let f=e.r(388540),h=e.r(91949),m=e.r(573668),y=e.r(509396);function g(t){var r,a;let s,o,g,[v,x]=(0,n.useOptimistic)(h.IDLE_LINK_STATUS),k=(0,n.useRef)(null),{href:j,as:w,children:C,prefetch:N=null,passHref:E,replace:M,shallow:O,scroll:_,onClick:S,onMouseEnter:A,onTouchStart:L,legacyBehavior:T=!1,onNavigate:P,transitionTypes:$,ref:R,unstable_dynamicOnHover:D,...I}=t;s=C,T&&("string"==typeof s||"number"==typeof s)&&(s=(0,i.jsx)("a",{children:s}));let z=n.default.useContext(c.AppRouterContext),U=!1!==N,F=!1!==N?null===(a=N)||"auto"===a?y.FetchStrategy.PPR:y.FetchStrategy.Full:y.FetchStrategy.PPR,B="string"==typeof(r=w||j)?r:(0,l.formatUrl)(r);if(T){if(s?.$$typeof===Symbol.for("react.lazy"))throw Object.defineProperty(Error("`<Link legacyBehavior>` received a direct child that is either a Server Component, or JSX that was loaded with React.lazy(). This is not supported. Either remove legacyBehavior, or make the direct child a Client Component that renders the Link's `<a>` tag."),"__NEXT_ERROR_CODE",{value:"E863",enumerable:!1,configurable:!0});o=n.default.Children.only(s)}let H=T?o&&"object"==typeof o&&o.ref:R,Y=n.default.useCallback(e=>(null!==z&&(k.current=(0,h.mountLinkInstance)(e,B,z,F,U,x)),()=>{k.current&&((0,h.unmountLinkForCurrentNavigation)(k.current),k.current=null),(0,h.unmountPrefetchableInstance)(e)}),[U,B,z,F,x]),V={ref:(0,d.useMergedRef)(Y,H),onClick(t){T||"function"!=typeof S||S(t),T&&o.props&&"function"==typeof o.props.onClick&&o.props.onClick(t),!z||t.defaultPrevented||function(t,r,a,s,o,i,l){if("u">typeof window){let c,{nodeName:d}=t.currentTarget;if("A"===d.toUpperCase()&&((c=t.currentTarget.getAttribute("target"))&&"_self"!==c||t.metaKey||t.ctrlKey||t.shiftKey||t.altKey||t.nativeEvent&&2===t.nativeEvent.which)||t.currentTarget.hasAttribute("download"))return;if(!(0,m.isLocalURL)(r)){s&&(t.preventDefault(),location.replace(r));return}if(t.preventDefault(),i){let e=!1;if(i({preventDefault:()=>{e=!0}}),e)return}let{dispatchNavigateAction:u}=e.r(699781);n.default.startTransition(()=>{u(r,s?"replace":"push",!1===o?f.ScrollBehavior.NoScroll:f.ScrollBehavior.Default,a.current,l)})}}(t,B,k,M,_,P,$)},onMouseEnter(e){T||"function"!=typeof A||A(e),T&&o.props&&"function"==typeof o.props.onMouseEnter&&o.props.onMouseEnter(e),z&&U&&(0,h.onNavigationIntent)(e.currentTarget,!0===D)},onTouchStart:function(e){T||"function"!=typeof L||L(e),T&&o.props&&"function"==typeof o.props.onTouchStart&&o.props.onTouchStart(e),z&&U&&(0,h.onNavigationIntent)(e.currentTarget,!0===D)}};return(0,u.isAbsoluteUrl)(B)?V.href=B:T&&!E&&("a"!==o.type||"href"in o.props)||(V.href=(0,p.addBasePath)(B)),g=T?n.default.cloneElement(o,V):(0,i.jsx)("a",{...I,...V,children:s}),(0,i.jsx)(b.Provider,{value:v,children:g})}e.r(284508);let b=(0,n.createContext)(h.IDLE_LINK_STATUS),v=()=>(0,n.useContext)(b);("function"==typeof r.default||"object"==typeof r.default&&null!==r.default)&&void 0===r.default.__esModule&&(Object.defineProperty(r.default,"__esModule",{value:!0}),Object.assign(r.default,r),t.exports=r.default)},618566,(e,t,r)=>{t.exports=e.r(976562)},396661,505014,e=>{"use strict";let t=(...e)=>e.filter((e,t,r)=>!!e&&""!==e.trim()&&r.indexOf(e)===t).join(" ").trim();e.s(["mergeClasses",0,t],396661);var r=e.i(271645),a={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};let s=(0,r.createContext)({}),o=(0,r.forwardRef)(({color:e,size:o,strokeWidth:i,absoluteStrokeWidth:n,className:l="",children:c,iconNode:d,...u},p)=>{let{size:f=24,strokeWidth:h=2,absoluteStrokeWidth:m=!1,color:y="currentColor",className:g=""}=(0,r.useContext)(s)??{},b=n??m?24*Number(i??h)/Number(o??f):i??h;return(0,r.createElement)("svg",{ref:p,...a,width:o??f??a.width,height:o??f??a.height,stroke:e??y,strokeWidth:b,className:t("lucide",g,l),...!c&&!(e=>{for(let t in e)if(t.startsWith("aria-")||"role"===t||"title"===t)return!0;return!1})(u)&&{"aria-hidden":"true"},...u},[...d.map(([e,t])=>(0,r.createElement)(e,t)),...Array.isArray(c)?c:[c]])});e.s(["default",0,o],505014)},146387,456420,e=>{"use strict";var t=e.i(271645),r=e.i(396661);let a=e=>{let t=e.replace(/^([A-Z])|[\s-_]+(\w)/g,(e,t,r)=>r?r.toUpperCase():t.toLowerCase());return t.charAt(0).toUpperCase()+t.slice(1)};var s=e.i(505014);let o=(e,o)=>{let i=(0,t.forwardRef)(({className:i,...n},l)=>(0,t.createElement)(s.default,{ref:l,iconNode:o,className:(0,r.mergeClasses)(`lucide-${a(e).replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase()}`,`lucide-${e}`,i),...n}));return i.displayName=a(e),i};e.s(["default",0,o],456420);let i=o("building-2",[["path",{d:"M10 12h4",key:"a56b0p"}],["path",{d:"M10 8h4",key:"1sr2af"}],["path",{d:"M14 21v-3a2 2 0 0 0-4 0v3",key:"1rgiei"}],["path",{d:"M6 10H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2",key:"secmi2"}],["path",{d:"M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16",key:"16ra0t"}]]);e.s(["Building2",0,i],146387)},818581,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"useMergedRef",{enumerable:!0,get:function(){return s}});let a=e.r(271645);function s(e,t){let r=(0,a.useRef)(null),s=(0,a.useRef)(null);return(0,a.useCallback)(a=>{if(null===a){let e=r.current;e&&(r.current=null,e());let t=s.current;t&&(s.current=null,t())}else e&&(r.current=o(e,a)),t&&(s.current=o(t,a))},[e,t])}function o(e,t){if("function"!=typeof e)return e.current=t,()=>{e.current=null};{let r=e(t);return"function"==typeof r?r:()=>e(null)}}("function"==typeof r.default||"object"==typeof r.default&&null!==r.default)&&void 0===r.default.__esModule&&(Object.defineProperty(r.default,"__esModule",{value:!0}),Object.assign(r.default,r),t.exports=r.default)},823482,e=>{"use strict";let t=(0,e.i(456420).default)("graduation-cap",[["path",{d:"M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z",key:"j76jl0"}],["path",{d:"M22 10v6",key:"1lu8f3"}],["path",{d:"M6 12.5V16a6 3 0 0 0 12 0v-3.5",key:"1r8lef"}]]);e.s(["GraduationCap",0,t],823482)},370812,e=>{"use strict";let t=(0,e.i(456420).default)("bell",[["path",{d:"M10.268 21a2 2 0 0 0 3.464 0",key:"vwvbt9"}],["path",{d:"M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326",key:"11g9vi"}]]);e.s(["Bell",0,t],370812)},716327,867927,e=>{"use strict";var t=e.i(456420);let r=(0,t.default)("chevron-down",[["path",{d:"m6 9 6 6 6-6",key:"qrunsl"}]]);e.s(["ChevronDown",0,r],716327);let a=(0,t.default)("chevron-right",[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]]);e.s(["ChevronRight",0,a],867927)},55677,e=>{"use strict";let t=(0,e.i(456420).default)("clipboard-list",[["rect",{width:"8",height:"4",x:"8",y:"2",rx:"1",ry:"1",key:"tgr4d6"}],["path",{d:"M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",key:"116196"}],["path",{d:"M12 11h4",key:"1jrz19"}],["path",{d:"M12 16h4",key:"n85exb"}],["path",{d:"M8 11h.01",key:"1dfujw"}],["path",{d:"M8 16h.01",key:"18s6g9"}]]);e.s(["ClipboardList",0,t],55677)},166794,e=>{"use strict";let t=(0,e.i(456420).default)("settings",[["path",{d:"M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915",key:"1i5ecw"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);e.s(["Settings",0,t],166794)},584026,e=>{"use strict";let t=(0,e.i(456420).default)("shield-check",[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]]);e.s(["ShieldCheck",0,t],584026)},779432,e=>{"use strict";let t=(0,e.i(456420).default)("activity",[["path",{d:"M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2",key:"169zse"}]]);e.s(["Activity",0,t],779432)},367784,593583,e=>{"use strict";var t=e.i(456420);let r=(0,t.default)("log-out",[["path",{d:"m16 17 5-5-5-5",key:"1bji2h"}],["path",{d:"M21 12H9",key:"dn1m92"}],["path",{d:"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",key:"1uf3rs"}]]);e.s(["LogOut",0,r],367784);let a=(0,t.default)("menu",[["path",{d:"M4 5h16",key:"1tepv9"}],["path",{d:"M4 12h16",key:"1lakjw"}],["path",{d:"M4 19h16",key:"1djgab"}]]);e.s(["Menu",0,a],593583)},749803,e=>{"use strict";let t=(0,e.i(456420).default)("chart-column",[["path",{d:"M3 3v16a2 2 0 0 0 2 2h16",key:"c24i48"}],["path",{d:"M18 17V9",key:"2bz60n"}],["path",{d:"M13 17V5",key:"1frdt8"}],["path",{d:"M8 17v-3",key:"17ska0"}]]);e.s(["BarChart3",0,t],749803)},566595,e=>{"use strict";let t=(0,e.i(456420).default)("search",[["path",{d:"m21 21-4.34-4.34",key:"14j7rj"}],["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}]]);e.s(["Search",0,t],566595)},263676,e=>{"use strict";let t=(0,e.i(456420).default)("x",[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]]);e.s(["X",0,t],263676)},705766,e=>{"use strict";let t,r;var a,s=e.i(271645);let o={data:""},i=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,n=/\/\*[^]*?\*\/|  +/g,l=/\n+/g,c=(e,t)=>{let r="",a="",s="";for(let o in e){let i=e[o];"@"==o[0]?"i"==o[1]?r=o+" "+i+";":a+="f"==o[1]?c(i,o):o+"{"+c(i,"k"==o[1]?"":t)+"}":"object"==typeof i?a+=c(i,t?t.replace(/([^,])+/g,e=>o.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,t=>/&/.test(t)?t.replace(/&/g,e):e?e+" "+t:t)):o):null!=i&&(o="-"==o[1]?o:o.replace(/[A-Z]/g,"-$&").toLowerCase(),s+=c.p?c.p(o,i):o+":"+i+";")}return r+(t&&s?t+"{"+s+"}":s)+a},d={},u=e=>{if("object"==typeof e){let t="";for(let r in e)t+=r+u(e[r]);return t}return e};function p(e){let t,r,a=this||{},s=e.call?e(a.p):e;return((e,t,r,a,s)=>{var o;let p=u(e),f=d[p]||(d[p]=(e=>{let t=0,r=11;for(;t<e.length;)r=101*r+e.charCodeAt(t++)>>>0;return"go"+r})(p));if(!d[f]){let t=p!==e?e:(e=>{let t,r,a=[{}];for(;t=i.exec(e.replace(n,""));)t[4]?a.shift():t[3]?(r=t[3].replace(l," ").trim(),a.unshift(a[0][r]=a[0][r]||{})):a[0][t[1]]=t[2].replace(l," ").trim();return a[0]})(e);d[f]=c(s?{["@keyframes "+f]:t}:t,r?"":"."+f)}let h=r&&d.g;return r&&(d.g=d[f]),o=d[f],h?t.data=t.data.replace(h,o):-1===t.data.indexOf(o)&&(t.data=a?o+t.data:t.data+o),f})(s.unshift?s.raw?(t=[].slice.call(arguments,1),r=a.p,s.reduce((e,a,s)=>{let o=t[s];if(o&&o.call){let e=o(r),t=e&&e.props&&e.props.className||/^go/.test(e)&&e;o=t?"."+t:e&&"object"==typeof e?e.props?"":c(e,""):!1===e?"":e}return e+a+(null==o?"":o)},"")):s.reduce((e,t)=>Object.assign(e,t&&t.call?t(a.p):t),{}):s,(e=>{if("object"==typeof window){let t=(e?e.querySelector("#_goober"):window._goober)||Object.assign(document.createElement("style"),{innerHTML:" ",id:"_goober"});return t.nonce=window.__nonce__,t.parentNode||(e||document.head).appendChild(t),t.firstChild}return e||o})(a.target),a.g,a.o,a.k)}p.bind({g:1});let f,h,m,y=p.bind({k:1});function g(e,t){let r=this||{};return function(){let a=arguments;function s(o,i){let n=Object.assign({},o),l=n.className||s.className;r.p=Object.assign({theme:h&&h()},n),r.o=/go\d/.test(l),n.className=p.apply(r,a)+(l?" "+l:""),t&&(n.ref=i);let c=e;return e[0]&&(c=n.as||e,delete n.as),m&&c[0]&&m(n),f(c,n)}return t?t(s):s}}var b=(e,t)=>"function"==typeof e?e(t):e,v=(t=0,()=>(++t).toString()),x=()=>{if(void 0===r&&"u">typeof window){let e=matchMedia("(prefers-reduced-motion: reduce)");r=!e||e.matches}return r},k="default",j=(e,t)=>{let{toastLimit:r}=e.settings;switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,r)};case 1:return{...e,toasts:e.toasts.map(e=>e.id===t.toast.id?{...e,...t.toast}:e)};case 2:let{toast:a}=t;return j(e,{type:+!!e.toasts.find(e=>e.id===a.id),toast:a});case 3:let{toastId:s}=t;return{...e,toasts:e.toasts.map(e=>e.id===s||void 0===s?{...e,dismissed:!0,visible:!1}:e)};case 4:return void 0===t.toastId?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(e=>e.id!==t.toastId)};case 5:return{...e,pausedAt:t.time};case 6:let o=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(e=>({...e,pauseDuration:e.pauseDuration+o}))}}},w=[],C={toasts:[],pausedAt:void 0,settings:{toastLimit:20}},N={},E=(e,t=k)=>{N[t]=j(N[t]||C,e),w.forEach(([e,r])=>{e===t&&r(N[t])})},M=e=>Object.keys(N).forEach(t=>E(e,t)),O=(e=k)=>t=>{E(t,e)},_={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},S=e=>(t,r)=>{let a,s=((e,t="blank",r)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:t,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...r,id:(null==r?void 0:r.id)||v()}))(t,e,r);return O(s.toasterId||(a=s.id,Object.keys(N).find(e=>N[e].toasts.some(e=>e.id===a))))({type:2,toast:s}),s.id},A=(e,t)=>S("blank")(e,t);A.error=S("error"),A.success=S("success"),A.loading=S("loading"),A.custom=S("custom"),A.dismiss=(e,t)=>{let r={type:3,toastId:e};t?O(t)(r):M(r)},A.dismissAll=e=>A.dismiss(void 0,e),A.remove=(e,t)=>{let r={type:4,toastId:e};t?O(t)(r):M(r)},A.removeAll=e=>A.remove(void 0,e),A.promise=(e,t,r)=>{let a=A.loading(t.loading,{...r,...null==r?void 0:r.loading});return"function"==typeof e&&(e=e()),e.then(e=>{let s=t.success?b(t.success,e):void 0;return s?A.success(s,{id:a,...r,...null==r?void 0:r.success}):A.dismiss(a),e}).catch(e=>{let s=t.error?b(t.error,e):void 0;s?A.error(s,{id:a,...r,...null==r?void 0:r.error}):A.dismiss(a)}),e};var L=1e3,T=y`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,P=y`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,$=y`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,R=g("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${T} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${P} 0.15s ease-out forwards;
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
    animation: ${$} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,D=y`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,I=g("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||"#e0e0e0"};
  border-right-color: ${e=>e.primary||"#616161"};
  animation: ${D} 1s linear infinite;
`,z=y`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,U=y`
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
}`,F=g("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${z} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${U} 0.2s ease-out forwards;
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
`,B=g("div")`
  position: absolute;
`,H=g("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,Y=y`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,V=g("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${Y} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,q=({toast:e})=>{let{icon:t,type:r,iconTheme:a}=e;return void 0!==t?"string"==typeof t?s.createElement(V,null,t):t:"blank"===r?null:s.createElement(H,null,s.createElement(I,{...a}),"loading"!==r&&s.createElement(B,null,"error"===r?s.createElement(R,{...a}):s.createElement(F,{...a})))},K=g("div")`
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
`,W=g("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,J=s.memo(({toast:e,position:t,style:r,children:a})=>{let o=e.height?((e,t)=>{let r=e.includes("top")?1:-1,[a,s]=x()?["0%{opacity:0;} 100%{opacity:1;}","0%{opacity:1;} 100%{opacity:0;}"]:[`
0% {transform: translate3d(0,${-200*r}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${-150*r}%,-1px) scale(.6); opacity:0;}
`];return{animation:t?`${y(a)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${y(s)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}})(e.position||t||"top-center",e.visible):{opacity:0},i=s.createElement(q,{toast:e}),n=s.createElement(W,{...e.ariaProps},b(e.message,e));return s.createElement(K,{className:e.className,style:{...o,...r,...e.style}},"function"==typeof a?a({icon:i,message:n}):s.createElement(s.Fragment,null,i,n))});a=s.createElement,c.p=void 0,f=a,h=void 0,m=void 0;var X=({id:e,className:t,style:r,onHeightUpdate:a,children:o})=>{let i=s.useCallback(t=>{if(t){let r=()=>{a(e,t.getBoundingClientRect().height)};r(),new MutationObserver(r).observe(t,{subtree:!0,childList:!0,characterData:!0})}},[e,a]);return s.createElement("div",{ref:i,className:t,style:r},o)},Z=p`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`;e.s(["Toaster",0,({reverseOrder:e,position:t="top-center",toastOptions:r,gutter:a,children:o,toasterId:i,containerStyle:n,containerClassName:l})=>{let{toasts:c,handlers:d}=((e,t="default")=>{let{toasts:r,pausedAt:a}=((e={},t=k)=>{let[r,a]=(0,s.useState)(N[t]||C),o=(0,s.useRef)(N[t]);(0,s.useEffect)(()=>(o.current!==N[t]&&a(N[t]),w.push([t,a]),()=>{let e=w.findIndex(([e])=>e===t);e>-1&&w.splice(e,1)}),[t]);let i=r.toasts.map(t=>{var r,a,s;return{...e,...e[t.type],...t,removeDelay:t.removeDelay||(null==(r=e[t.type])?void 0:r.removeDelay)||(null==e?void 0:e.removeDelay),duration:t.duration||(null==(a=e[t.type])?void 0:a.duration)||(null==e?void 0:e.duration)||_[t.type],style:{...e.style,...null==(s=e[t.type])?void 0:s.style,...t.style}}});return{...r,toasts:i}})(e,t),o=(0,s.useRef)(new Map).current,i=(0,s.useCallback)((e,t=L)=>{if(o.has(e))return;let r=setTimeout(()=>{o.delete(e),n({type:4,toastId:e})},t);o.set(e,r)},[]);(0,s.useEffect)(()=>{if(a)return;let e=Date.now(),s=r.map(r=>{if(r.duration===1/0)return;let a=(r.duration||0)+r.pauseDuration-(e-r.createdAt);if(a<0){r.visible&&A.dismiss(r.id);return}return setTimeout(()=>A.dismiss(r.id,t),a)});return()=>{s.forEach(e=>e&&clearTimeout(e))}},[r,a,t]);let n=(0,s.useCallback)(O(t),[t]),l=(0,s.useCallback)(()=>{n({type:5,time:Date.now()})},[n]),c=(0,s.useCallback)((e,t)=>{n({type:1,toast:{id:e,height:t}})},[n]),d=(0,s.useCallback)(()=>{a&&n({type:6,time:Date.now()})},[a,n]),u=(0,s.useCallback)((e,t)=>{let{reverseOrder:a=!1,gutter:s=8,defaultPosition:o}=t||{},i=r.filter(t=>(t.position||o)===(e.position||o)&&t.height),n=i.findIndex(t=>t.id===e.id),l=i.filter((e,t)=>t<n&&e.visible).length;return i.filter(e=>e.visible).slice(...a?[l+1]:[0,l]).reduce((e,t)=>e+(t.height||0)+s,0)},[r]);return(0,s.useEffect)(()=>{r.forEach(e=>{if(e.dismissed)i(e.id,e.removeDelay);else{let t=o.get(e.id);t&&(clearTimeout(t),o.delete(e.id))}})},[r,i]),{toasts:r,handlers:{updateHeight:c,startPause:l,endPause:d,calculateOffset:u}}})(r,i);return s.createElement("div",{"data-rht-toaster":i||"",style:{position:"fixed",zIndex:9999,top:16,left:16,right:16,bottom:16,pointerEvents:"none",...n},className:l,onMouseEnter:d.startPause,onMouseLeave:d.endPause},c.map(r=>{let i,n,l=r.position||t,c=d.calculateOffset(r,{reverseOrder:e,gutter:a,defaultPosition:t}),u=(i=l.includes("top"),n=l.includes("center")?{justifyContent:"center"}:l.includes("right")?{justifyContent:"flex-end"}:{},{left:0,right:0,display:"flex",position:"absolute",transition:x()?void 0:"all 230ms cubic-bezier(.21,1.02,.73,1)",transform:`translateY(${c*(i?1:-1)}px)`,...i?{top:0}:{bottom:0},...n});return s.createElement(X,{id:r.id,key:r.id,onHeightUpdate:d.updateHeight,className:r.visible?Z:"",style:u},"custom"===r.type?b(r.message,r):o?o(r):s.createElement(J,{toast:r,position:l}))}))},"default",0,A,"toast",0,A],705766)},920476,e=>{"use strict";async function t(e,t){let r=await fetch(e,t),a=await r.json().catch(()=>null);if(!r.ok)throw Error(a?.error||a?.message||`Request failed with ${r.status}`);return a}e.s(["apiJson",0,t,"errorMessage",0,function(e,t="Something went wrong"){return e instanceof Error?e.message:t}])},730274,e=>{"use strict";let t=(0,e.i(456420).default)("send",[["path",{d:"M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",key:"1ffxy3"}],["path",{d:"m21.854 2.147-10.94 10.939",key:"12cjpa"}]]);e.s(["Send",0,t],730274)},856423,e=>{"use strict";let t=(0,e.i(456420).default)("book-open",[["path",{d:"M12 7v14",key:"1akyts"}],["path",{d:"M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z",key:"ruj8y"}]]);e.s(["BookOpen",0,t],856423)},150164,e=>{"use strict";var t=e.i(843476),r=e.i(705766),a=e.i(271645),s=e.i(859015);e.s(["default",0,function(){let[e,o]=(0,a.useState)([]),[i,n]=(0,a.useState)(null),[l,c]=(0,a.useState)(""),[d,u]=(0,a.useState)(""),[p,f]=(0,a.useState)(""),[h,m]=(0,a.useState)("YEARLY");(0,a.useEffect)(()=>{y()},[]);let y=async()=>{try{let e=await fetch("/api/fee-categories"),t=await e.json();o(Array.isArray(t)?t:[])}catch(e){console.error(e)}},g=async()=>{try{i?await fetch("/api/fee-categories",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:i,fee_name:l,fee_code:d,amount:p,frequency:h})}):await fetch("/api/fee-categories",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({fee_name:l,fee_code:d,amount:p,frequency:h})}),v(),y()}catch(e){console.error(e),r.default.success("Failed to Save")}},b=async e=>{if(confirm("Delete this category?"))try{await fetch(`/api/fee-categories?id=${e}`,{method:"DELETE"}),y()}catch(e){console.error(e),r.default.success("Delete Failed")}},v=()=>{n(null),c(""),u(""),f(""),m("YEARLY")};return(0,t.jsx)(s.default,{children:(0,t.jsxs)("div",{className:"space-y-10",children:[(0,t.jsxs)("div",{className:"bg-white rounded-3xl p-10 shadow",children:[(0,t.jsx)("h1",{className:"text-4xl font-bold mb-8",children:"Fee Categories"}),(0,t.jsxs)("div",{className:"grid grid-cols-1 md:grid-cols-4 gap-5",children:[(0,t.jsx)("input",{className:"border p-4 rounded-xl",placeholder:"Fee Name",value:l,onChange:e=>c(e.target.value)}),(0,t.jsx)("input",{className:"border p-4 rounded-xl",placeholder:"Fee Code",value:d,onChange:e=>u(e.target.value)}),(0,t.jsx)("input",{className:"border p-4 rounded-xl",placeholder:"Amount",value:p,onChange:e=>f(e.target.value)}),(0,t.jsxs)("select",{className:"border p-4 rounded-xl",value:h,onChange:e=>m(e.target.value),children:[(0,t.jsx)("option",{value:"YEARLY",children:"YEARLY"}),(0,t.jsx)("option",{value:"MONTHLY",children:"MONTHLY"}),(0,t.jsx)("option",{value:"ONE_TIME",children:"ONE_TIME"})]})]}),(0,t.jsxs)("div",{className:"flex gap-3 mt-6",children:[(0,t.jsx)("button",{onClick:g,className:"px-6 py-3 bg-green-600 text-white rounded-xl font-semibold",children:i?"Update Category":"Save Category"}),i&&(0,t.jsx)("button",{onClick:v,className:"px-6 py-3 bg-slate-500 text-white rounded-xl font-semibold",children:"Cancel"})]})]}),(0,t.jsxs)("div",{className:"bg-white rounded-3xl p-10 shadow",children:[(0,t.jsx)("h2",{className:"text-3xl font-bold mb-6",children:"Existing Categories"}),(0,t.jsxs)("table",{className:"w-full",children:[(0,t.jsx)("thead",{children:(0,t.jsxs)("tr",{className:"border-b",children:[(0,t.jsx)("th",{className:"text-left py-3",children:"ID"}),(0,t.jsx)("th",{className:"text-left py-3",children:"Fee Name"}),(0,t.jsx)("th",{className:"text-left py-3",children:"Fee Code"}),(0,t.jsx)("th",{className:"text-left py-3",children:"Amount"}),(0,t.jsx)("th",{className:"text-left py-3",children:"Frequency"}),(0,t.jsx)("th",{className:"text-left py-3",children:"Actions"})]})}),(0,t.jsx)("tbody",{children:e.map(e=>(0,t.jsxs)("tr",{className:"border-b",children:[(0,t.jsx)("td",{className:"py-3",children:e.id}),(0,t.jsx)("td",{className:"py-3",children:e.fee_name}),(0,t.jsx)("td",{className:"py-3",children:e.fee_code}),(0,t.jsx)("td",{className:"py-3",children:e.amount}),(0,t.jsx)("td",{className:"py-3",children:e.frequency}),(0,t.jsxs)("td",{className:"py-3 space-x-2",children:[(0,t.jsx)("button",{onClick:()=>{n(e.id),c(e.fee_name||""),u(e.fee_code||""),f(String(e.amount||"")),m(e.frequency||"YEARLY")},className:"px-3 py-1 bg-blue-600 text-white rounded",children:"Edit"}),(0,t.jsx)("button",{onClick:()=>b(e.id),className:"px-3 py-1 bg-red-600 text-white rounded",children:"Delete"})]})]},e.id))})]})]})]})})}])}]);