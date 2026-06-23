(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,270904,e=>{"use strict";let t=(0,e.i(456420).default)("wallet",[["path",{d:"M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1",key:"18etb6"}],["path",{d:"M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4",key:"xoc0q4"}]]);e.s(["Wallet",0,t],270904)},195057,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0});var a={formatUrl:function(){return s},formatWithValidation:function(){return p},urlObjectKeys:function(){return l}};for(var i in a)Object.defineProperty(r,i,{enumerable:!0,get:a[i]});let n=e.r(190809)._(e.r(998183)),o=/https?|ftp|gopher|file/;function s(e){let{auth:t,hostname:r}=e,a=e.protocol||"",i=e.pathname||"",s=e.hash||"",l=e.query||"",p=!1;t=t?encodeURIComponent(t).replace(/%3A/i,":")+"@":"",e.host?p=t+e.host:r&&(p=t+(~r.indexOf(":")?`[${r}]`:r),e.port&&(p+=":"+e.port)),l&&"object"==typeof l&&(l=String(n.urlQueryToSearchParams(l)));let d=e.search||l&&`?${l}`||"";return a&&!a.endsWith(":")&&(a+=":"),e.slashes||(!a||o.test(a))&&!1!==p?(p="//"+(p||""),i&&"/"!==i[0]&&(i="/"+i)):p||(p=""),s&&"#"!==s[0]&&(s="#"+s),d&&"?"!==d[0]&&(d="?"+d),i=i.replace(/[?#]/g,encodeURIComponent),d=d.replace("#","%23"),`${a}${p}${i}${d}${s}`}let l=["auth","hash","host","hostname","href","path","pathname","port","protocol","query","search","slashes"];function p(e){return s(e)}},573668,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"isLocalURL",{enumerable:!0,get:function(){return n}});let a=e.r(718967),i=e.r(652817);function n(e){if(!(0,a.isAbsoluteUrl)(e))return!0;try{let t=(0,a.getLocationOrigin)(),r=new URL(e,t);return r.origin===t&&(0,i.hasBasePath)(r.pathname)}catch(e){return!1}}},284508,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"errorOnce",{enumerable:!0,get:function(){return a}});let a=e=>{}},522016,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0});var a={default:function(){return x},useLinkStatus:function(){return b}};for(var i in a)Object.defineProperty(r,i,{enumerable:!0,get:a[i]});let n=e.r(190809),o=e.r(843476),s=n._(e.r(271645)),l=e.r(195057),p=e.r(8372),d=e.r(818581),c=e.r(718967),m=e.r(405550);e.r(233525);let u=e.r(388540),f=e.r(91949),h=e.r(573668),g=e.r(509396);function x(t){var r,a;let i,n,x,[b,v]=(0,s.useOptimistic)(f.IDLE_LINK_STATUS),w=(0,s.useRef)(null),{href:k,as:j,children:$,prefetch:z=null,passHref:C,replace:E,shallow:M,scroll:N,onClick:O,onMouseEnter:_,onTouchStart:A,legacyBehavior:T=!1,onNavigate:P,transitionTypes:S,ref:R,unstable_dynamicOnHover:L,...D}=t;i=$,T&&("string"==typeof i||"number"==typeof i)&&(i=(0,o.jsx)("a",{children:i}));let I=s.default.useContext(p.AppRouterContext),H=!1!==z,U=!1!==z?null===(a=z)||"auto"===a?g.FetchStrategy.PPR:g.FetchStrategy.Full:g.FetchStrategy.PPR,B="string"==typeof(r=j||k)?r:(0,l.formatUrl)(r);if(T){if(i?.$$typeof===Symbol.for("react.lazy"))throw Object.defineProperty(Error("`<Link legacyBehavior>` received a direct child that is either a Server Component, or JSX that was loaded with React.lazy(). This is not supported. Either remove legacyBehavior, or make the direct child a Client Component that renders the Link's `<a>` tag."),"__NEXT_ERROR_CODE",{value:"E863",enumerable:!1,configurable:!0});n=s.default.Children.only(i)}let F=T?n&&"object"==typeof n&&n.ref:R,q=s.default.useCallback(e=>(null!==I&&(w.current=(0,f.mountLinkInstance)(e,B,I,U,H,v)),()=>{w.current&&((0,f.unmountLinkForCurrentNavigation)(w.current),w.current=null),(0,f.unmountPrefetchableInstance)(e)}),[H,B,I,U,v]),V={ref:(0,d.useMergedRef)(q,F),onClick(t){T||"function"!=typeof O||O(t),T&&n.props&&"function"==typeof n.props.onClick&&n.props.onClick(t),!I||t.defaultPrevented||function(t,r,a,i,n,o,l){if("u">typeof window){let p,{nodeName:d}=t.currentTarget;if("A"===d.toUpperCase()&&((p=t.currentTarget.getAttribute("target"))&&"_self"!==p||t.metaKey||t.ctrlKey||t.shiftKey||t.altKey||t.nativeEvent&&2===t.nativeEvent.which)||t.currentTarget.hasAttribute("download"))return;if(!(0,h.isLocalURL)(r)){i&&(t.preventDefault(),location.replace(r));return}if(t.preventDefault(),o){let e=!1;if(o({preventDefault:()=>{e=!0}}),e)return}let{dispatchNavigateAction:c}=e.r(699781);s.default.startTransition(()=>{c(r,i?"replace":"push",!1===n?u.ScrollBehavior.NoScroll:u.ScrollBehavior.Default,a.current,l)})}}(t,B,w,E,N,P,S)},onMouseEnter(e){T||"function"!=typeof _||_(e),T&&n.props&&"function"==typeof n.props.onMouseEnter&&n.props.onMouseEnter(e),I&&H&&(0,f.onNavigationIntent)(e.currentTarget,!0===L)},onTouchStart:function(e){T||"function"!=typeof A||A(e),T&&n.props&&"function"==typeof n.props.onTouchStart&&n.props.onTouchStart(e),I&&H&&(0,f.onNavigationIntent)(e.currentTarget,!0===L)}};return(0,c.isAbsoluteUrl)(B)?V.href=B:T&&!C&&("a"!==n.type||"href"in n.props)||(V.href=(0,m.addBasePath)(B)),x=T?s.default.cloneElement(n,V):(0,o.jsx)("a",{...D,...V,children:i}),(0,o.jsx)(y.Provider,{value:b,children:x})}e.r(284508);let y=(0,s.createContext)(f.IDLE_LINK_STATUS),b=()=>(0,s.useContext)(y);("function"==typeof r.default||"object"==typeof r.default&&null!==r.default)&&void 0===r.default.__esModule&&(Object.defineProperty(r.default,"__esModule",{value:!0}),Object.assign(r.default,r),t.exports=r.default)},396661,505014,e=>{"use strict";let t=(...e)=>e.filter((e,t,r)=>!!e&&""!==e.trim()&&r.indexOf(e)===t).join(" ").trim();e.s(["mergeClasses",0,t],396661);var r=e.i(271645),a={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};let i=(0,r.createContext)({}),n=(0,r.forwardRef)(({color:e,size:n,strokeWidth:o,absoluteStrokeWidth:s,className:l="",children:p,iconNode:d,...c},m)=>{let{size:u=24,strokeWidth:f=2,absoluteStrokeWidth:h=!1,color:g="currentColor",className:x=""}=(0,r.useContext)(i)??{},y=s??h?24*Number(o??f)/Number(n??u):o??f;return(0,r.createElement)("svg",{ref:m,...a,width:n??u??a.width,height:n??u??a.height,stroke:e??g,strokeWidth:y,className:t("lucide",x,l),...!p&&!(e=>{for(let t in e)if(t.startsWith("aria-")||"role"===t||"title"===t)return!0;return!1})(c)&&{"aria-hidden":"true"},...c},[...d.map(([e,t])=>(0,r.createElement)(e,t)),...Array.isArray(p)?p:[p]])});e.s(["default",0,n],505014)},618566,(e,t,r)=>{t.exports=e.r(976562)},146387,456420,e=>{"use strict";var t=e.i(271645),r=e.i(396661);let a=e=>{let t=e.replace(/^([A-Z])|[\s-_]+(\w)/g,(e,t,r)=>r?r.toUpperCase():t.toLowerCase());return t.charAt(0).toUpperCase()+t.slice(1)};var i=e.i(505014);let n=(e,n)=>{let o=(0,t.forwardRef)(({className:o,...s},l)=>(0,t.createElement)(i.default,{ref:l,iconNode:n,className:(0,r.mergeClasses)(`lucide-${a(e).replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase()}`,`lucide-${e}`,o),...s}));return o.displayName=a(e),o};e.s(["default",0,n],456420);let o=n("building-2",[["path",{d:"M10 12h4",key:"a56b0p"}],["path",{d:"M10 8h4",key:"1sr2af"}],["path",{d:"M14 21v-3a2 2 0 0 0-4 0v3",key:"1rgiei"}],["path",{d:"M6 10H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2",key:"secmi2"}],["path",{d:"M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16",key:"16ra0t"}]]);e.s(["Building2",0,o],146387)},818581,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"useMergedRef",{enumerable:!0,get:function(){return i}});let a=e.r(271645);function i(e,t){let r=(0,a.useRef)(null),i=(0,a.useRef)(null);return(0,a.useCallback)(a=>{if(null===a){let e=r.current;e&&(r.current=null,e());let t=i.current;t&&(i.current=null,t())}else e&&(r.current=n(e,a)),t&&(i.current=n(t,a))},[e,t])}function n(e,t){if("function"!=typeof e)return e.current=t,()=>{e.current=null};{let r=e(t);return"function"==typeof r?r:()=>e(null)}}("function"==typeof r.default||"object"==typeof r.default&&null!==r.default)&&void 0===r.default.__esModule&&(Object.defineProperty(r.default,"__esModule",{value:!0}),Object.assign(r.default,r),t.exports=r.default)},823482,e=>{"use strict";let t=(0,e.i(456420).default)("graduation-cap",[["path",{d:"M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z",key:"j76jl0"}],["path",{d:"M22 10v6",key:"1lu8f3"}],["path",{d:"M6 12.5V16a6 3 0 0 0 12 0v-3.5",key:"1r8lef"}]]);e.s(["GraduationCap",0,t],823482)},370812,e=>{"use strict";let t=(0,e.i(456420).default)("bell",[["path",{d:"M10.268 21a2 2 0 0 0 3.464 0",key:"vwvbt9"}],["path",{d:"M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326",key:"11g9vi"}]]);e.s(["Bell",0,t],370812)},716327,867927,e=>{"use strict";var t=e.i(456420);let r=(0,t.default)("chevron-down",[["path",{d:"m6 9 6 6 6-6",key:"qrunsl"}]]);e.s(["ChevronDown",0,r],716327);let a=(0,t.default)("chevron-right",[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]]);e.s(["ChevronRight",0,a],867927)},55677,e=>{"use strict";let t=(0,e.i(456420).default)("clipboard-list",[["rect",{width:"8",height:"4",x:"8",y:"2",rx:"1",ry:"1",key:"tgr4d6"}],["path",{d:"M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",key:"116196"}],["path",{d:"M12 11h4",key:"1jrz19"}],["path",{d:"M12 16h4",key:"n85exb"}],["path",{d:"M8 11h.01",key:"1dfujw"}],["path",{d:"M8 16h.01",key:"18s6g9"}]]);e.s(["ClipboardList",0,t],55677)},166794,e=>{"use strict";let t=(0,e.i(456420).default)("settings",[["path",{d:"M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915",key:"1i5ecw"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);e.s(["Settings",0,t],166794)},584026,e=>{"use strict";let t=(0,e.i(456420).default)("shield-check",[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]]);e.s(["ShieldCheck",0,t],584026)},779432,e=>{"use strict";let t=(0,e.i(456420).default)("activity",[["path",{d:"M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2",key:"169zse"}]]);e.s(["Activity",0,t],779432)},367784,593583,e=>{"use strict";var t=e.i(456420);let r=(0,t.default)("log-out",[["path",{d:"m16 17 5-5-5-5",key:"1bji2h"}],["path",{d:"M21 12H9",key:"dn1m92"}],["path",{d:"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",key:"1uf3rs"}]]);e.s(["LogOut",0,r],367784);let a=(0,t.default)("menu",[["path",{d:"M4 5h16",key:"1tepv9"}],["path",{d:"M4 12h16",key:"1lakjw"}],["path",{d:"M4 19h16",key:"1djgab"}]]);e.s(["Menu",0,a],593583)},749803,e=>{"use strict";let t=(0,e.i(456420).default)("chart-column",[["path",{d:"M3 3v16a2 2 0 0 0 2 2h16",key:"c24i48"}],["path",{d:"M18 17V9",key:"2bz60n"}],["path",{d:"M13 17V5",key:"1frdt8"}],["path",{d:"M8 17v-3",key:"17ska0"}]]);e.s(["BarChart3",0,t],749803)},566595,e=>{"use strict";let t=(0,e.i(456420).default)("search",[["path",{d:"m21 21-4.34-4.34",key:"14j7rj"}],["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}]]);e.s(["Search",0,t],566595)},263676,e=>{"use strict";let t=(0,e.i(456420).default)("x",[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]]);e.s(["X",0,t],263676)},705766,e=>{"use strict";let t,r;var a,i=e.i(271645);let n={data:""},o=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,s=/\/\*[^]*?\*\/|  +/g,l=/\n+/g,p=(e,t)=>{let r="",a="",i="";for(let n in e){let o=e[n];"@"==n[0]?"i"==n[1]?r=n+" "+o+";":a+="f"==n[1]?p(o,n):n+"{"+p(o,"k"==n[1]?"":t)+"}":"object"==typeof o?a+=p(o,t?t.replace(/([^,])+/g,e=>n.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,t=>/&/.test(t)?t.replace(/&/g,e):e?e+" "+t:t)):n):null!=o&&(n="-"==n[1]?n:n.replace(/[A-Z]/g,"-$&").toLowerCase(),i+=p.p?p.p(n,o):n+":"+o+";")}return r+(t&&i?t+"{"+i+"}":i)+a},d={},c=e=>{if("object"==typeof e){let t="";for(let r in e)t+=r+c(e[r]);return t}return e};function m(e){let t,r,a=this||{},i=e.call?e(a.p):e;return((e,t,r,a,i)=>{var n;let m=c(e),u=d[m]||(d[m]=(e=>{let t=0,r=11;for(;t<e.length;)r=101*r+e.charCodeAt(t++)>>>0;return"go"+r})(m));if(!d[u]){let t=m!==e?e:(e=>{let t,r,a=[{}];for(;t=o.exec(e.replace(s,""));)t[4]?a.shift():t[3]?(r=t[3].replace(l," ").trim(),a.unshift(a[0][r]=a[0][r]||{})):a[0][t[1]]=t[2].replace(l," ").trim();return a[0]})(e);d[u]=p(i?{["@keyframes "+u]:t}:t,r?"":"."+u)}let f=r&&d.g;return r&&(d.g=d[u]),n=d[u],f?t.data=t.data.replace(f,n):-1===t.data.indexOf(n)&&(t.data=a?n+t.data:t.data+n),u})(i.unshift?i.raw?(t=[].slice.call(arguments,1),r=a.p,i.reduce((e,a,i)=>{let n=t[i];if(n&&n.call){let e=n(r),t=e&&e.props&&e.props.className||/^go/.test(e)&&e;n=t?"."+t:e&&"object"==typeof e?e.props?"":p(e,""):!1===e?"":e}return e+a+(null==n?"":n)},"")):i.reduce((e,t)=>Object.assign(e,t&&t.call?t(a.p):t),{}):i,(e=>{if("object"==typeof window){let t=(e?e.querySelector("#_goober"):window._goober)||Object.assign(document.createElement("style"),{innerHTML:" ",id:"_goober"});return t.nonce=window.__nonce__,t.parentNode||(e||document.head).appendChild(t),t.firstChild}return e||n})(a.target),a.g,a.o,a.k)}m.bind({g:1});let u,f,h,g=m.bind({k:1});function x(e,t){let r=this||{};return function(){let a=arguments;function i(n,o){let s=Object.assign({},n),l=s.className||i.className;r.p=Object.assign({theme:f&&f()},s),r.o=/go\d/.test(l),s.className=m.apply(r,a)+(l?" "+l:""),t&&(s.ref=o);let p=e;return e[0]&&(p=s.as||e,delete s.as),h&&p[0]&&h(s),u(p,s)}return t?t(i):i}}var y=(e,t)=>"function"==typeof e?e(t):e,b=(t=0,()=>(++t).toString()),v=()=>{if(void 0===r&&"u">typeof window){let e=matchMedia("(prefers-reduced-motion: reduce)");r=!e||e.matches}return r},w="default",k=(e,t)=>{let{toastLimit:r}=e.settings;switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,r)};case 1:return{...e,toasts:e.toasts.map(e=>e.id===t.toast.id?{...e,...t.toast}:e)};case 2:let{toast:a}=t;return k(e,{type:+!!e.toasts.find(e=>e.id===a.id),toast:a});case 3:let{toastId:i}=t;return{...e,toasts:e.toasts.map(e=>e.id===i||void 0===i?{...e,dismissed:!0,visible:!1}:e)};case 4:return void 0===t.toastId?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(e=>e.id!==t.toastId)};case 5:return{...e,pausedAt:t.time};case 6:let n=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(e=>({...e,pauseDuration:e.pauseDuration+n}))}}},j=[],$={toasts:[],pausedAt:void 0,settings:{toastLimit:20}},z={},C=(e,t=w)=>{z[t]=k(z[t]||$,e),j.forEach(([e,r])=>{e===t&&r(z[t])})},E=e=>Object.keys(z).forEach(t=>C(e,t)),M=(e=w)=>t=>{C(t,e)},N={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},O=e=>(t,r)=>{let a,i=((e,t="blank",r)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:t,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...r,id:(null==r?void 0:r.id)||b()}))(t,e,r);return M(i.toasterId||(a=i.id,Object.keys(z).find(e=>z[e].toasts.some(e=>e.id===a))))({type:2,toast:i}),i.id},_=(e,t)=>O("blank")(e,t);_.error=O("error"),_.success=O("success"),_.loading=O("loading"),_.custom=O("custom"),_.dismiss=(e,t)=>{let r={type:3,toastId:e};t?M(t)(r):E(r)},_.dismissAll=e=>_.dismiss(void 0,e),_.remove=(e,t)=>{let r={type:4,toastId:e};t?M(t)(r):E(r)},_.removeAll=e=>_.remove(void 0,e),_.promise=(e,t,r)=>{let a=_.loading(t.loading,{...r,...null==r?void 0:r.loading});return"function"==typeof e&&(e=e()),e.then(e=>{let i=t.success?y(t.success,e):void 0;return i?_.success(i,{id:a,...r,...null==r?void 0:r.success}):_.dismiss(a),e}).catch(e=>{let i=t.error?y(t.error,e):void 0;i?_.error(i,{id:a,...r,...null==r?void 0:r.error}):_.dismiss(a)}),e};var A=1e3,T=g`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,P=g`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,S=g`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,R=x("div")`
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
    animation: ${S} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,L=g`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,D=x("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||"#e0e0e0"};
  border-right-color: ${e=>e.primary||"#616161"};
  animation: ${L} 1s linear infinite;
`,I=g`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,H=g`
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
    animation: ${H} 0.2s ease-out forwards;
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
`,F=x("div")`
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
`,K=({toast:e})=>{let{icon:t,type:r,iconTheme:a}=e;return void 0!==t?"string"==typeof t?i.createElement(V,null,t):t:"blank"===r?null:i.createElement(F,null,i.createElement(D,{...a}),"loading"!==r&&i.createElement(B,null,"error"===r?i.createElement(R,{...a}):i.createElement(U,{...a})))},W=x("div")`
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
`,J=i.memo(({toast:e,position:t,style:r,children:a})=>{let n=e.height?((e,t)=>{let r=e.includes("top")?1:-1,[a,i]=v()?["0%{opacity:0;} 100%{opacity:1;}","0%{opacity:1;} 100%{opacity:0;}"]:[`
0% {transform: translate3d(0,${-200*r}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${-150*r}%,-1px) scale(.6); opacity:0;}
`];return{animation:t?`${g(a)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${g(i)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}})(e.position||t||"top-center",e.visible):{opacity:0},o=i.createElement(K,{toast:e}),s=i.createElement(G,{...e.ariaProps},y(e.message,e));return i.createElement(W,{className:e.className,style:{...n,...r,...e.style}},"function"==typeof a?a({icon:o,message:s}):i.createElement(i.Fragment,null,o,s))});a=i.createElement,p.p=void 0,u=a,f=void 0,h=void 0;var X=({id:e,className:t,style:r,onHeightUpdate:a,children:n})=>{let o=i.useCallback(t=>{if(t){let r=()=>{a(e,t.getBoundingClientRect().height)};r(),new MutationObserver(r).observe(t,{subtree:!0,childList:!0,characterData:!0})}},[e,a]);return i.createElement("div",{ref:o,className:t,style:r},n)},Y=m`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`;e.s(["Toaster",0,({reverseOrder:e,position:t="top-center",toastOptions:r,gutter:a,children:n,toasterId:o,containerStyle:s,containerClassName:l})=>{let{toasts:p,handlers:d}=((e,t="default")=>{let{toasts:r,pausedAt:a}=((e={},t=w)=>{let[r,a]=(0,i.useState)(z[t]||$),n=(0,i.useRef)(z[t]);(0,i.useEffect)(()=>(n.current!==z[t]&&a(z[t]),j.push([t,a]),()=>{let e=j.findIndex(([e])=>e===t);e>-1&&j.splice(e,1)}),[t]);let o=r.toasts.map(t=>{var r,a,i;return{...e,...e[t.type],...t,removeDelay:t.removeDelay||(null==(r=e[t.type])?void 0:r.removeDelay)||(null==e?void 0:e.removeDelay),duration:t.duration||(null==(a=e[t.type])?void 0:a.duration)||(null==e?void 0:e.duration)||N[t.type],style:{...e.style,...null==(i=e[t.type])?void 0:i.style,...t.style}}});return{...r,toasts:o}})(e,t),n=(0,i.useRef)(new Map).current,o=(0,i.useCallback)((e,t=A)=>{if(n.has(e))return;let r=setTimeout(()=>{n.delete(e),s({type:4,toastId:e})},t);n.set(e,r)},[]);(0,i.useEffect)(()=>{if(a)return;let e=Date.now(),i=r.map(r=>{if(r.duration===1/0)return;let a=(r.duration||0)+r.pauseDuration-(e-r.createdAt);if(a<0){r.visible&&_.dismiss(r.id);return}return setTimeout(()=>_.dismiss(r.id,t),a)});return()=>{i.forEach(e=>e&&clearTimeout(e))}},[r,a,t]);let s=(0,i.useCallback)(M(t),[t]),l=(0,i.useCallback)(()=>{s({type:5,time:Date.now()})},[s]),p=(0,i.useCallback)((e,t)=>{s({type:1,toast:{id:e,height:t}})},[s]),d=(0,i.useCallback)(()=>{a&&s({type:6,time:Date.now()})},[a,s]),c=(0,i.useCallback)((e,t)=>{let{reverseOrder:a=!1,gutter:i=8,defaultPosition:n}=t||{},o=r.filter(t=>(t.position||n)===(e.position||n)&&t.height),s=o.findIndex(t=>t.id===e.id),l=o.filter((e,t)=>t<s&&e.visible).length;return o.filter(e=>e.visible).slice(...a?[l+1]:[0,l]).reduce((e,t)=>e+(t.height||0)+i,0)},[r]);return(0,i.useEffect)(()=>{r.forEach(e=>{if(e.dismissed)o(e.id,e.removeDelay);else{let t=n.get(e.id);t&&(clearTimeout(t),n.delete(e.id))}})},[r,o]),{toasts:r,handlers:{updateHeight:p,startPause:l,endPause:d,calculateOffset:c}}})(r,o);return i.createElement("div",{"data-rht-toaster":o||"",style:{position:"fixed",zIndex:9999,top:16,left:16,right:16,bottom:16,pointerEvents:"none",...s},className:l,onMouseEnter:d.startPause,onMouseLeave:d.endPause},p.map(r=>{let o,s,l=r.position||t,p=d.calculateOffset(r,{reverseOrder:e,gutter:a,defaultPosition:t}),c=(o=l.includes("top"),s=l.includes("center")?{justifyContent:"center"}:l.includes("right")?{justifyContent:"flex-end"}:{},{left:0,right:0,display:"flex",position:"absolute",transition:v()?void 0:"all 230ms cubic-bezier(.21,1.02,.73,1)",transform:`translateY(${p*(o?1:-1)}px)`,...o?{top:0}:{bottom:0},...s});return i.createElement(X,{id:r.id,key:r.id,onHeightUpdate:d.updateHeight,className:r.visible?Y:"",style:c},"custom"===r.type?y(r.message,r):n?n(r):i.createElement(J,{toast:r,position:l}))}))},"default",0,_,"toast",0,_],705766)},920476,e=>{"use strict";async function t(e,t){let r=await fetch(e,t),a=await r.json().catch(()=>null);if(!r.ok)throw Error(a?.error||a?.message||`Request failed with ${r.status}`);return a}e.s(["apiJson",0,t,"errorMessage",0,function(e,t="Something went wrong"){return e instanceof Error?e.message:t}])},856423,e=>{"use strict";let t=(0,e.i(456420).default)("book-open",[["path",{d:"M12 7v14",key:"1akyts"}],["path",{d:"M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z",key:"ruj8y"}]]);e.s(["BookOpen",0,t],856423)},730274,e=>{"use strict";let t=(0,e.i(456420).default)("send",[["path",{d:"M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",key:"1ffxy3"}],["path",{d:"m21.854 2.147-10.94 10.939",key:"12cjpa"}]]);e.s(["Send",0,t],730274)},462047,e=>{"use strict";var t=e.i(705766);e.s(["notify",0,{success:e=>t.default.success(e),error:e=>t.default.error(e),warning:e=>(0,t.default)(e,{icon:"⚠️"}),info:e=>(0,t.default)(e,{icon:"ℹ️"})}])},77043,e=>{"use strict";let t=(0,e.i(456420).default)("printer",[["path",{d:"M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2",key:"143wyd"}],["path",{d:"M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6",key:"1itne7"}],["rect",{x:"6",y:"14",width:"12",height:"8",rx:"1",key:"1ue0tg"}]]);e.s(["Printer",0,t],77043)},647629,e=>{"use strict";var t=e.i(462047);async function r({title:e,subtitle:o,documentLabel:s,metaHtml:l,bodyHtml:p,footerHtml:d,popupError:c="Allow popups to print this document.",pageSize:m="full",verificationUrl:u,barcodeValue:f}){var h;let g=window.open("","_blank","half"===m?"width=760,height=620":"width=980,height=760");if(!g)return void t.notify.error(c);g.document.open(),g.document.write((h=e,`
    <html>
      <head>
        <title>${a(h)}</title>
        <style>
          body{font-family:Arial,sans-serif;display:grid;min-height:100vh;place-items:center;color:#04142E}
          div{border:1px solid #e5e7eb;border-radius:16px;padding:24px 28px;box-shadow:0 20px 60px rgba(15,23,42,.12)}
          strong{display:block;font-size:18px}
          span{display:block;margin-top:6px;color:#64748b}
        </style>
      </head>
      <body>
        <div>
          <strong>Preparing ${a(h)}</strong>
          <span>Loading school branding...</span>
        </div>
      </body>
    </html>
  `)),g.document.close();let x=await i(),y=u?await n(u):null;g.document.open(),g.document.write(function({branding:e,title:t,subtitle:r,documentLabel:i,metaHtml:n,bodyHtml:o,footerHtml:s,pageSize:l="full",verificationUrl:p,barcodeValue:d,qrDataUrl:c}){let m=e.schoolName||e.product||"TOTTECH ONE",u=e.schoolCode||e.tagline||"Gateway To Learning",f=e.logoUrl||"/images/logo.png",h=e.primaryColor||"#04142E",g=e.secondaryColor||"#D4AF37",x=[e.address,e.phone,e.email].filter(Boolean).join(" | ");return"half"===l?function({title:e,subtitle:t,documentLabel:r,metaHtml:i,bodyHtml:n,footerHtml:o,schoolName:s,schoolCode:l,logoUrl:p,contact:d,verificationUrl:c,barcodeValue:m,qrDataUrl:u}){let f=f=>`
    <section class="copy">
      <header class="copy-header">
        <img class="copy-logo" src="${a(p)}" alt="${a(s)} logo" />
        <div class="copy-school">
          <h1>${a(s)}</h1>
          <p>${a(l)}</p>
          ${d?`<span>${a(d)}</span>`:""}
        </div>
        <div class="copy-title">
          <strong>${a(r||e)}</strong>
          <span>${a(f)}</span>
        </div>
      </header>
      <div class="copy-main">
        <div class="copy-intro">
          <h2>${a(e)}</h2>
          ${t?`<p>${a(t)}</p>`:""}
        </div>
        ${i||""}
        <div class="print-body">${n}</div>
        ${c||u?`<div class="verify-row">
                ${u?`<img class="qr" src="${a(u)}" alt="QR verification" />`:""}
                <div>
                  <div class="barcode">${(m||e||"TOTTECH").slice(0,42).split("").map((e,t)=>{let r=e.charCodeAt(0);return Array.from({length:5}).map((e,a)=>{let i=(r>>a&1)==1||(t+a)%4==0;return`<span style="display:inline-block;width:${i?2:1}px;height:18px;background:${i?"#111":"transparent"};margin-right:1px"></span>`}).join("")}).join("")}</div>
                  <p>${a(c||"")}</p>
                </div>
              </div>`:""}
      </div>
      <footer class="copy-footer">
        <span>${a(f)}</span>
        <span>Generated by TOTTECH ONE</span>
      </footer>
      ${o||""}
    </section>
  `;return`
    <html>
      <head>
        <title>${a(e)}</title>
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
  `}({title:t,subtitle:r,documentLabel:i,metaHtml:n,bodyHtml:o,footerHtml:s,schoolName:m,schoolCode:u,logoUrl:f,contact:x,verificationUrl:p,barcodeValue:d,qrDataUrl:c}):`
    <html>
      <head>
        <title>${a(t)}</title>
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
              <img class="print-logo" src="${a(f)}" alt="${a(m)} logo" />
              <div class="print-school">
                <h1>${a(m)}</h1>
                <p>${a(u)}</p>
              </div>
            </div>
            <div class="print-document-badge">
              <span>${a(i||"School Document")}</span>
              <strong>${a(new Date().toLocaleDateString())}</strong>
            </div>
          </header>
          <section class="print-title">
            <p class="eyebrow">${a(i||"Official Print")}</p>
            <h2>${a(t)}</h2>
            ${r?`<p>${a(r)}</p>`:""}
          </section>
          ${n||""}
          <section class="print-body">${o}</section>
          <footer class="print-footer">
            <span>${a(x||"Generated from TOTTECH ONE")}</span>
            <span>Powered by TOTTECH ONE</span>
          </footer>
          ${s||""}
        </main>
      </body>
    </html>
  `}({branding:x,title:e,subtitle:o,documentLabel:s,metaHtml:l,bodyHtml:p,footerHtml:d,pageSize:m,verificationUrl:u,barcodeValue:f,qrDataUrl:y})),g.document.close(),g.focus(),window.setTimeout(()=>{g.print()},250)}function a(e){return e.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;")}async function i(){try{let e=await fetch("/api/my-school-branding",{cache:"no-store"});if(!e.ok)throw Error("Branding unavailable");return await e.json()}catch{return{schoolName:"TOTTECH ONE",schoolCode:"Gateway To Learning",logoUrl:"/images/logo.png",primaryColor:"#04142E",secondaryColor:"#D4AF37"}}}async function n(t){try{return(await e.A(673378)).toDataURL(t,{errorCorrectionLevel:"M",margin:1,width:120,color:{dark:"#111111",light:"#FFFFFF"}})}catch{return null}}e.s(["printBrandedDocument",0,r,"printMetaGrid",0,function(e){return`<div class="print-meta-grid">${e.map(e=>`
        <div class="print-meta-card">
          <span>${a(e.label)}</span>
          <strong>${a(String(e.value??"-"))}</strong>
        </div>
      `).join("")}</div>`}])},108320,e=>{"use strict";var t=e.i(843476),r=e.i(77043),a=e.i(271645),i=e.i(859015),n=e.i(920476),o=e.i(647629),s=e.i(462047);async function l(e){let t=e.receipt_number||`Receipt ${e.id}`,r=`${window.location.origin}/verify/receipt/${encodeURIComponent(String(t))}`;await (0,o.printBrandedDocument)({title:"Fee Payment Receipt",subtitle:"Official payment acknowledgement generated from TOTTECH ONE.",documentLabel:"Paid Receipt",pageSize:"half",metaHtml:(0,o.printMetaGrid)([{label:"Receipt",value:t},{label:"Invoice",value:e.invoice_number||"-"},{label:"Student",value:e.student_name||"-"},{label:"Class / Section",value:[e.class_name,e.section_name].filter(Boolean).join(" ")||"-"},{label:"Amount Paid",value:`Rs. ${Number(e.amount||0)}`},{label:"Payment Method",value:e.payment_method||"-"},{label:"Reference",value:e.reference_number||"-"},{label:"Date",value:p(e.payment_date||e.created_at)}]),bodyHtml:`
      <div class="print-panel">
        <h3 class="print-section-title">Receipt Confirmation</h3>
        <p>This receipt confirms that the above amount has been collected against the linked school invoice.</p>
      </div>
	      <p class="sign">Authorized Signature</p>
	    `,verificationUrl:r,barcodeValue:String(t),popupError:"Allow popups to print this receipt."})}function p(e){return e?new Date(e).toLocaleDateString():"-"}e.s(["default",0,function(){let[e,o]=(0,a.useState)([]),[d,c]=(0,a.useState)(!0);return(0,a.useEffect)(()=>{(async()=>{try{let e=await (0,n.apiJson)("/api/finance/payments");o(e.payments||[])}catch(e){s.notify.error((0,n.errorMessage)(e,"Failed to load receipts"))}finally{c(!1)}})()},[]),(0,t.jsx)(i.default,{children:(0,t.jsxs)("div",{className:"space-y-6",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("h1",{className:"text-3xl font-black md:text-4xl",children:"Paid Receipts"}),(0,t.jsx)("p",{className:"mt-1 text-sm text-slate-600",children:"Print payment receipts from real fee collection records."})]}),(0,t.jsx)("section",{className:"tt-card tt-card-pad",children:d?(0,t.jsx)("p",{className:"text-sm font-semibold text-slate-600",children:"Loading receipts..."}):0===e.length?(0,t.jsx)("p",{className:"text-sm font-semibold text-slate-600",children:"No paid receipts found for the selected school and academic year."}):(0,t.jsx)("div",{className:"overflow-x-auto",children:(0,t.jsxs)("table",{className:"min-w-full text-left text-sm",children:[(0,t.jsx)("thead",{children:(0,t.jsxs)("tr",{className:"border-b border-slate-200 text-xs uppercase text-slate-500",children:[(0,t.jsx)("th",{className:"py-3 pr-4",children:"Receipt"}),(0,t.jsx)("th",{className:"py-3 pr-4",children:"Invoice"}),(0,t.jsx)("th",{className:"py-3 pr-4",children:"Student"}),(0,t.jsx)("th",{className:"py-3 pr-4",children:"Amount"}),(0,t.jsx)("th",{className:"py-3 pr-4",children:"Method"}),(0,t.jsx)("th",{className:"py-3 pr-4",children:"Date"}),(0,t.jsx)("th",{className:"py-3 pr-4",children:"Action"})]})}),(0,t.jsx)("tbody",{children:e.map(e=>(0,t.jsxs)("tr",{className:"border-b border-slate-100",children:[(0,t.jsx)("td",{className:"py-3 pr-4 font-black text-slate-950",children:e.receipt_number||`Receipt ${e.id}`}),(0,t.jsx)("td",{className:"py-3 pr-4",children:e.invoice_number||"-"}),(0,t.jsxs)("td",{className:"py-3 pr-4",children:[(0,t.jsx)("div",{className:"font-bold text-slate-950",children:e.student_name||"-"}),(0,t.jsx)("div",{className:"text-xs text-slate-500",children:[e.class_name,e.section_name].filter(Boolean).join(" ")||"-"})]}),(0,t.jsxs)("td",{className:"py-3 pr-4 font-black",children:["Rs."," ",Number(e.amount||0)]}),(0,t.jsx)("td",{className:"py-3 pr-4",children:e.payment_method||"-"}),(0,t.jsx)("td",{className:"py-3 pr-4",children:p(e.payment_date||e.created_at)}),(0,t.jsx)("td",{className:"py-3 pr-4",children:(0,t.jsxs)("button",{onClick:()=>l(e),className:"inline-flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-black text-amber-900",children:[(0,t.jsx)(r.Printer,{size:15}),"Print"]})})]},e.id))})]})})})]})})}])},673378,e=>{e.v(t=>Promise.all(["static/chunks/0kauo_1p4s347.js"].map(t=>e.l(t))).then(()=>t(973134)))}]);