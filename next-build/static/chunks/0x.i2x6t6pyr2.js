(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,270904,e=>{"use strict";let t=(0,e.i(456420).default)("wallet",[["path",{d:"M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1",key:"18etb6"}],["path",{d:"M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4",key:"xoc0q4"}]]);e.s(["Wallet",0,t],270904)},195057,(e,t,a)=>{"use strict";Object.defineProperty(a,"__esModule",{value:!0});var r={formatUrl:function(){return n},formatWithValidation:function(){return c},urlObjectKeys:function(){return o}};for(var s in r)Object.defineProperty(a,s,{enumerable:!0,get:r[s]});let l=e.r(190809)._(e.r(998183)),i=/https?|ftp|gopher|file/;function n(e){let{auth:t,hostname:a}=e,r=e.protocol||"",s=e.pathname||"",n=e.hash||"",o=e.query||"",c=!1;t=t?encodeURIComponent(t).replace(/%3A/i,":")+"@":"",e.host?c=t+e.host:a&&(c=t+(~a.indexOf(":")?`[${a}]`:a),e.port&&(c+=":"+e.port)),o&&"object"==typeof o&&(o=String(l.urlQueryToSearchParams(o)));let d=e.search||o&&`?${o}`||"";return r&&!r.endsWith(":")&&(r+=":"),e.slashes||(!r||i.test(r))&&!1!==c?(c="//"+(c||""),s&&"/"!==s[0]&&(s="/"+s)):c||(c=""),n&&"#"!==n[0]&&(n="#"+n),d&&"?"!==d[0]&&(d="?"+d),s=s.replace(/[?#]/g,encodeURIComponent),d=d.replace("#","%23"),`${r}${c}${s}${d}${n}`}let o=["auth","hash","host","hostname","href","path","pathname","port","protocol","query","search","slashes"];function c(e){return n(e)}},573668,(e,t,a)=>{"use strict";Object.defineProperty(a,"__esModule",{value:!0}),Object.defineProperty(a,"isLocalURL",{enumerable:!0,get:function(){return l}});let r=e.r(718967),s=e.r(652817);function l(e){if(!(0,r.isAbsoluteUrl)(e))return!0;try{let t=(0,r.getLocationOrigin)(),a=new URL(e,t);return a.origin===t&&(0,s.hasBasePath)(a.pathname)}catch(e){return!1}}},284508,(e,t,a)=>{"use strict";Object.defineProperty(a,"__esModule",{value:!0}),Object.defineProperty(a,"errorOnce",{enumerable:!0,get:function(){return r}});let r=e=>{}},522016,(e,t,a)=>{"use strict";Object.defineProperty(a,"__esModule",{value:!0});var r={default:function(){return x},useLinkStatus:function(){return g}};for(var s in r)Object.defineProperty(a,s,{enumerable:!0,get:r[s]});let l=e.r(190809),i=e.r(843476),n=l._(e.r(271645)),o=e.r(195057),c=e.r(8372),d=e.r(818581),u=e.r(718967),p=e.r(405550);e.r(233525);let f=e.r(388540),h=e.r(91949),m=e.r(573668),b=e.r(509396);function x(t){var a,r;let s,l,x,[g,v]=(0,n.useOptimistic)(h.IDLE_LINK_STATUS),j=(0,n.useRef)(null),{href:k,as:w,children:N,prefetch:C=null,passHref:M,replace:E,shallow:A,scroll:S,onClick:O,onMouseEnter:_,onTouchStart:P,legacyBehavior:$=!1,onNavigate:R,transitionTypes:L,ref:T,unstable_dynamicOnHover:I,...D}=t;s=N,$&&("string"==typeof s||"number"==typeof s)&&(s=(0,i.jsx)("a",{children:s}));let z=n.default.useContext(c.AppRouterContext),U=!1!==C,F=!1!==C?null===(r=C)||"auto"===r?b.FetchStrategy.PPR:b.FetchStrategy.Full:b.FetchStrategy.PPR,H="string"==typeof(a=w||k)?a:(0,o.formatUrl)(a);if($){if(s?.$$typeof===Symbol.for("react.lazy"))throw Object.defineProperty(Error("`<Link legacyBehavior>` received a direct child that is either a Server Component, or JSX that was loaded with React.lazy(). This is not supported. Either remove legacyBehavior, or make the direct child a Client Component that renders the Link's `<a>` tag."),"__NEXT_ERROR_CODE",{value:"E863",enumerable:!1,configurable:!0});l=n.default.Children.only(s)}let B=$?l&&"object"==typeof l&&l.ref:T,W=n.default.useCallback(e=>(null!==z&&(j.current=(0,h.mountLinkInstance)(e,H,z,F,U,v)),()=>{j.current&&((0,h.unmountLinkForCurrentNavigation)(j.current),j.current=null),(0,h.unmountPrefetchableInstance)(e)}),[U,H,z,F,v]),V={ref:(0,d.useMergedRef)(W,B),onClick(t){$||"function"!=typeof O||O(t),$&&l.props&&"function"==typeof l.props.onClick&&l.props.onClick(t),!z||t.defaultPrevented||function(t,a,r,s,l,i,o){if("u">typeof window){let c,{nodeName:d}=t.currentTarget;if("A"===d.toUpperCase()&&((c=t.currentTarget.getAttribute("target"))&&"_self"!==c||t.metaKey||t.ctrlKey||t.shiftKey||t.altKey||t.nativeEvent&&2===t.nativeEvent.which)||t.currentTarget.hasAttribute("download"))return;if(!(0,m.isLocalURL)(a)){s&&(t.preventDefault(),location.replace(a));return}if(t.preventDefault(),i){let e=!1;if(i({preventDefault:()=>{e=!0}}),e)return}let{dispatchNavigateAction:u}=e.r(699781);n.default.startTransition(()=>{u(a,s?"replace":"push",!1===l?f.ScrollBehavior.NoScroll:f.ScrollBehavior.Default,r.current,o)})}}(t,H,j,E,S,R,L)},onMouseEnter(e){$||"function"!=typeof _||_(e),$&&l.props&&"function"==typeof l.props.onMouseEnter&&l.props.onMouseEnter(e),z&&U&&(0,h.onNavigationIntent)(e.currentTarget,!0===I)},onTouchStart:function(e){$||"function"!=typeof P||P(e),$&&l.props&&"function"==typeof l.props.onTouchStart&&l.props.onTouchStart(e),z&&U&&(0,h.onNavigationIntent)(e.currentTarget,!0===I)}};return(0,u.isAbsoluteUrl)(H)?V.href=H:$&&!M&&("a"!==l.type||"href"in l.props)||(V.href=(0,p.addBasePath)(H)),x=$?n.default.cloneElement(l,V):(0,i.jsx)("a",{...D,...V,children:s}),(0,i.jsx)(y.Provider,{value:g,children:x})}e.r(284508);let y=(0,n.createContext)(h.IDLE_LINK_STATUS),g=()=>(0,n.useContext)(y);("function"==typeof a.default||"object"==typeof a.default&&null!==a.default)&&void 0===a.default.__esModule&&(Object.defineProperty(a.default,"__esModule",{value:!0}),Object.assign(a.default,a),t.exports=a.default)},618566,(e,t,a)=>{t.exports=e.r(976562)},396661,505014,e=>{"use strict";let t=(...e)=>e.filter((e,t,a)=>!!e&&""!==e.trim()&&a.indexOf(e)===t).join(" ").trim();e.s(["mergeClasses",0,t],396661);var a=e.i(271645),r={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};let s=(0,a.createContext)({}),l=(0,a.forwardRef)(({color:e,size:l,strokeWidth:i,absoluteStrokeWidth:n,className:o="",children:c,iconNode:d,...u},p)=>{let{size:f=24,strokeWidth:h=2,absoluteStrokeWidth:m=!1,color:b="currentColor",className:x=""}=(0,a.useContext)(s)??{},y=n??m?24*Number(i??h)/Number(l??f):i??h;return(0,a.createElement)("svg",{ref:p,...r,width:l??f??r.width,height:l??f??r.height,stroke:e??b,strokeWidth:y,className:t("lucide",x,o),...!c&&!(e=>{for(let t in e)if(t.startsWith("aria-")||"role"===t||"title"===t)return!0;return!1})(u)&&{"aria-hidden":"true"},...u},[...d.map(([e,t])=>(0,a.createElement)(e,t)),...Array.isArray(c)?c:[c]])});e.s(["default",0,l],505014)},146387,456420,e=>{"use strict";var t=e.i(271645),a=e.i(396661);let r=e=>{let t=e.replace(/^([A-Z])|[\s-_]+(\w)/g,(e,t,a)=>a?a.toUpperCase():t.toLowerCase());return t.charAt(0).toUpperCase()+t.slice(1)};var s=e.i(505014);let l=(e,l)=>{let i=(0,t.forwardRef)(({className:i,...n},o)=>(0,t.createElement)(s.default,{ref:o,iconNode:l,className:(0,a.mergeClasses)(`lucide-${r(e).replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase()}`,`lucide-${e}`,i),...n}));return i.displayName=r(e),i};e.s(["default",0,l],456420);let i=l("building-2",[["path",{d:"M10 12h4",key:"a56b0p"}],["path",{d:"M10 8h4",key:"1sr2af"}],["path",{d:"M14 21v-3a2 2 0 0 0-4 0v3",key:"1rgiei"}],["path",{d:"M6 10H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2",key:"secmi2"}],["path",{d:"M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16",key:"16ra0t"}]]);e.s(["Building2",0,i],146387)},818581,(e,t,a)=>{"use strict";Object.defineProperty(a,"__esModule",{value:!0}),Object.defineProperty(a,"useMergedRef",{enumerable:!0,get:function(){return s}});let r=e.r(271645);function s(e,t){let a=(0,r.useRef)(null),s=(0,r.useRef)(null);return(0,r.useCallback)(r=>{if(null===r){let e=a.current;e&&(a.current=null,e());let t=s.current;t&&(s.current=null,t())}else e&&(a.current=l(e,r)),t&&(s.current=l(t,r))},[e,t])}function l(e,t){if("function"!=typeof e)return e.current=t,()=>{e.current=null};{let a=e(t);return"function"==typeof a?a:()=>e(null)}}("function"==typeof a.default||"object"==typeof a.default&&null!==a.default)&&void 0===a.default.__esModule&&(Object.defineProperty(a.default,"__esModule",{value:!0}),Object.assign(a.default,a),t.exports=a.default)},823482,e=>{"use strict";let t=(0,e.i(456420).default)("graduation-cap",[["path",{d:"M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z",key:"j76jl0"}],["path",{d:"M22 10v6",key:"1lu8f3"}],["path",{d:"M6 12.5V16a6 3 0 0 0 12 0v-3.5",key:"1r8lef"}]]);e.s(["GraduationCap",0,t],823482)},370812,e=>{"use strict";let t=(0,e.i(456420).default)("bell",[["path",{d:"M10.268 21a2 2 0 0 0 3.464 0",key:"vwvbt9"}],["path",{d:"M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326",key:"11g9vi"}]]);e.s(["Bell",0,t],370812)},716327,867927,e=>{"use strict";var t=e.i(456420);let a=(0,t.default)("chevron-down",[["path",{d:"m6 9 6 6 6-6",key:"qrunsl"}]]);e.s(["ChevronDown",0,a],716327);let r=(0,t.default)("chevron-right",[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]]);e.s(["ChevronRight",0,r],867927)},55677,e=>{"use strict";let t=(0,e.i(456420).default)("clipboard-list",[["rect",{width:"8",height:"4",x:"8",y:"2",rx:"1",ry:"1",key:"tgr4d6"}],["path",{d:"M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",key:"116196"}],["path",{d:"M12 11h4",key:"1jrz19"}],["path",{d:"M12 16h4",key:"n85exb"}],["path",{d:"M8 11h.01",key:"1dfujw"}],["path",{d:"M8 16h.01",key:"18s6g9"}]]);e.s(["ClipboardList",0,t],55677)},166794,e=>{"use strict";let t=(0,e.i(456420).default)("settings",[["path",{d:"M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915",key:"1i5ecw"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);e.s(["Settings",0,t],166794)},584026,e=>{"use strict";let t=(0,e.i(456420).default)("shield-check",[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]]);e.s(["ShieldCheck",0,t],584026)},779432,e=>{"use strict";let t=(0,e.i(456420).default)("activity",[["path",{d:"M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2",key:"169zse"}]]);e.s(["Activity",0,t],779432)},367784,593583,e=>{"use strict";var t=e.i(456420);let a=(0,t.default)("log-out",[["path",{d:"m16 17 5-5-5-5",key:"1bji2h"}],["path",{d:"M21 12H9",key:"dn1m92"}],["path",{d:"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",key:"1uf3rs"}]]);e.s(["LogOut",0,a],367784);let r=(0,t.default)("menu",[["path",{d:"M4 5h16",key:"1tepv9"}],["path",{d:"M4 12h16",key:"1lakjw"}],["path",{d:"M4 19h16",key:"1djgab"}]]);e.s(["Menu",0,r],593583)},749803,e=>{"use strict";let t=(0,e.i(456420).default)("chart-column",[["path",{d:"M3 3v16a2 2 0 0 0 2 2h16",key:"c24i48"}],["path",{d:"M18 17V9",key:"2bz60n"}],["path",{d:"M13 17V5",key:"1frdt8"}],["path",{d:"M8 17v-3",key:"17ska0"}]]);e.s(["BarChart3",0,t],749803)},566595,e=>{"use strict";let t=(0,e.i(456420).default)("search",[["path",{d:"m21 21-4.34-4.34",key:"14j7rj"}],["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}]]);e.s(["Search",0,t],566595)},263676,e=>{"use strict";let t=(0,e.i(456420).default)("x",[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]]);e.s(["X",0,t],263676)},705766,e=>{"use strict";let t,a;var r,s=e.i(271645);let l={data:""},i=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,n=/\/\*[^]*?\*\/|  +/g,o=/\n+/g,c=(e,t)=>{let a="",r="",s="";for(let l in e){let i=e[l];"@"==l[0]?"i"==l[1]?a=l+" "+i+";":r+="f"==l[1]?c(i,l):l+"{"+c(i,"k"==l[1]?"":t)+"}":"object"==typeof i?r+=c(i,t?t.replace(/([^,])+/g,e=>l.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,t=>/&/.test(t)?t.replace(/&/g,e):e?e+" "+t:t)):l):null!=i&&(l="-"==l[1]?l:l.replace(/[A-Z]/g,"-$&").toLowerCase(),s+=c.p?c.p(l,i):l+":"+i+";")}return a+(t&&s?t+"{"+s+"}":s)+r},d={},u=e=>{if("object"==typeof e){let t="";for(let a in e)t+=a+u(e[a]);return t}return e};function p(e){let t,a,r=this||{},s=e.call?e(r.p):e;return((e,t,a,r,s)=>{var l;let p=u(e),f=d[p]||(d[p]=(e=>{let t=0,a=11;for(;t<e.length;)a=101*a+e.charCodeAt(t++)>>>0;return"go"+a})(p));if(!d[f]){let t=p!==e?e:(e=>{let t,a,r=[{}];for(;t=i.exec(e.replace(n,""));)t[4]?r.shift():t[3]?(a=t[3].replace(o," ").trim(),r.unshift(r[0][a]=r[0][a]||{})):r[0][t[1]]=t[2].replace(o," ").trim();return r[0]})(e);d[f]=c(s?{["@keyframes "+f]:t}:t,a?"":"."+f)}let h=a&&d.g;return a&&(d.g=d[f]),l=d[f],h?t.data=t.data.replace(h,l):-1===t.data.indexOf(l)&&(t.data=r?l+t.data:t.data+l),f})(s.unshift?s.raw?(t=[].slice.call(arguments,1),a=r.p,s.reduce((e,r,s)=>{let l=t[s];if(l&&l.call){let e=l(a),t=e&&e.props&&e.props.className||/^go/.test(e)&&e;l=t?"."+t:e&&"object"==typeof e?e.props?"":c(e,""):!1===e?"":e}return e+r+(null==l?"":l)},"")):s.reduce((e,t)=>Object.assign(e,t&&t.call?t(r.p):t),{}):s,(e=>{if("object"==typeof window){let t=(e?e.querySelector("#_goober"):window._goober)||Object.assign(document.createElement("style"),{innerHTML:" ",id:"_goober"});return t.nonce=window.__nonce__,t.parentNode||(e||document.head).appendChild(t),t.firstChild}return e||l})(r.target),r.g,r.o,r.k)}p.bind({g:1});let f,h,m,b=p.bind({k:1});function x(e,t){let a=this||{};return function(){let r=arguments;function s(l,i){let n=Object.assign({},l),o=n.className||s.className;a.p=Object.assign({theme:h&&h()},n),a.o=/go\d/.test(o),n.className=p.apply(a,r)+(o?" "+o:""),t&&(n.ref=i);let c=e;return e[0]&&(c=n.as||e,delete n.as),m&&c[0]&&m(n),f(c,n)}return t?t(s):s}}var y=(e,t)=>"function"==typeof e?e(t):e,g=(t=0,()=>(++t).toString()),v=()=>{if(void 0===a&&"u">typeof window){let e=matchMedia("(prefers-reduced-motion: reduce)");a=!e||e.matches}return a},j="default",k=(e,t)=>{let{toastLimit:a}=e.settings;switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,a)};case 1:return{...e,toasts:e.toasts.map(e=>e.id===t.toast.id?{...e,...t.toast}:e)};case 2:let{toast:r}=t;return k(e,{type:+!!e.toasts.find(e=>e.id===r.id),toast:r});case 3:let{toastId:s}=t;return{...e,toasts:e.toasts.map(e=>e.id===s||void 0===s?{...e,dismissed:!0,visible:!1}:e)};case 4:return void 0===t.toastId?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(e=>e.id!==t.toastId)};case 5:return{...e,pausedAt:t.time};case 6:let l=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(e=>({...e,pauseDuration:e.pauseDuration+l}))}}},w=[],N={toasts:[],pausedAt:void 0,settings:{toastLimit:20}},C={},M=(e,t=j)=>{C[t]=k(C[t]||N,e),w.forEach(([e,a])=>{e===t&&a(C[t])})},E=e=>Object.keys(C).forEach(t=>M(e,t)),A=(e=j)=>t=>{M(t,e)},S={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},O=e=>(t,a)=>{let r,s=((e,t="blank",a)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:t,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...a,id:(null==a?void 0:a.id)||g()}))(t,e,a);return A(s.toasterId||(r=s.id,Object.keys(C).find(e=>C[e].toasts.some(e=>e.id===r))))({type:2,toast:s}),s.id},_=(e,t)=>O("blank")(e,t);_.error=O("error"),_.success=O("success"),_.loading=O("loading"),_.custom=O("custom"),_.dismiss=(e,t)=>{let a={type:3,toastId:e};t?A(t)(a):E(a)},_.dismissAll=e=>_.dismiss(void 0,e),_.remove=(e,t)=>{let a={type:4,toastId:e};t?A(t)(a):E(a)},_.removeAll=e=>_.remove(void 0,e),_.promise=(e,t,a)=>{let r=_.loading(t.loading,{...a,...null==a?void 0:a.loading});return"function"==typeof e&&(e=e()),e.then(e=>{let s=t.success?y(t.success,e):void 0;return s?_.success(s,{id:r,...a,...null==a?void 0:a.success}):_.dismiss(r),e}).catch(e=>{let s=t.error?y(t.error,e):void 0;s?_.error(s,{id:r,...a,...null==a?void 0:a.error}):_.dismiss(r)}),e};var P=1e3,$=b`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,R=b`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,L=b`
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

  animation: ${$} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${R} 0.15s ease-out forwards;
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
    animation: ${L} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,I=b`
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
  animation: ${I} 1s linear infinite;
`,z=b`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,U=b`
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
}`,F=x("div")`
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
`,H=x("div")`
  position: absolute;
`,B=x("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,W=b`
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
  animation: ${W} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,K=({toast:e})=>{let{icon:t,type:a,iconTheme:r}=e;return void 0!==t?"string"==typeof t?s.createElement(V,null,t):t:"blank"===a?null:s.createElement(B,null,s.createElement(D,{...r}),"loading"!==a&&s.createElement(H,null,"error"===a?s.createElement(T,{...r}):s.createElement(F,{...r})))},Y=x("div")`
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
`,q=x("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,J=s.memo(({toast:e,position:t,style:a,children:r})=>{let l=e.height?((e,t)=>{let a=e.includes("top")?1:-1,[r,s]=v()?["0%{opacity:0;} 100%{opacity:1;}","0%{opacity:1;} 100%{opacity:0;}"]:[`
0% {transform: translate3d(0,${-200*a}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${-150*a}%,-1px) scale(.6); opacity:0;}
`];return{animation:t?`${b(r)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${b(s)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}})(e.position||t||"top-center",e.visible):{opacity:0},i=s.createElement(K,{toast:e}),n=s.createElement(q,{...e.ariaProps},y(e.message,e));return s.createElement(Y,{className:e.className,style:{...l,...a,...e.style}},"function"==typeof r?r({icon:i,message:n}):s.createElement(s.Fragment,null,i,n))});r=s.createElement,c.p=void 0,f=r,h=void 0,m=void 0;var X=({id:e,className:t,style:a,onHeightUpdate:r,children:l})=>{let i=s.useCallback(t=>{if(t){let a=()=>{r(e,t.getBoundingClientRect().height)};a(),new MutationObserver(a).observe(t,{subtree:!0,childList:!0,characterData:!0})}},[e,r]);return s.createElement("div",{ref:i,className:t,style:a},l)},Z=p`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`;e.s(["Toaster",0,({reverseOrder:e,position:t="top-center",toastOptions:a,gutter:r,children:l,toasterId:i,containerStyle:n,containerClassName:o})=>{let{toasts:c,handlers:d}=((e,t="default")=>{let{toasts:a,pausedAt:r}=((e={},t=j)=>{let[a,r]=(0,s.useState)(C[t]||N),l=(0,s.useRef)(C[t]);(0,s.useEffect)(()=>(l.current!==C[t]&&r(C[t]),w.push([t,r]),()=>{let e=w.findIndex(([e])=>e===t);e>-1&&w.splice(e,1)}),[t]);let i=a.toasts.map(t=>{var a,r,s;return{...e,...e[t.type],...t,removeDelay:t.removeDelay||(null==(a=e[t.type])?void 0:a.removeDelay)||(null==e?void 0:e.removeDelay),duration:t.duration||(null==(r=e[t.type])?void 0:r.duration)||(null==e?void 0:e.duration)||S[t.type],style:{...e.style,...null==(s=e[t.type])?void 0:s.style,...t.style}}});return{...a,toasts:i}})(e,t),l=(0,s.useRef)(new Map).current,i=(0,s.useCallback)((e,t=P)=>{if(l.has(e))return;let a=setTimeout(()=>{l.delete(e),n({type:4,toastId:e})},t);l.set(e,a)},[]);(0,s.useEffect)(()=>{if(r)return;let e=Date.now(),s=a.map(a=>{if(a.duration===1/0)return;let r=(a.duration||0)+a.pauseDuration-(e-a.createdAt);if(r<0){a.visible&&_.dismiss(a.id);return}return setTimeout(()=>_.dismiss(a.id,t),r)});return()=>{s.forEach(e=>e&&clearTimeout(e))}},[a,r,t]);let n=(0,s.useCallback)(A(t),[t]),o=(0,s.useCallback)(()=>{n({type:5,time:Date.now()})},[n]),c=(0,s.useCallback)((e,t)=>{n({type:1,toast:{id:e,height:t}})},[n]),d=(0,s.useCallback)(()=>{r&&n({type:6,time:Date.now()})},[r,n]),u=(0,s.useCallback)((e,t)=>{let{reverseOrder:r=!1,gutter:s=8,defaultPosition:l}=t||{},i=a.filter(t=>(t.position||l)===(e.position||l)&&t.height),n=i.findIndex(t=>t.id===e.id),o=i.filter((e,t)=>t<n&&e.visible).length;return i.filter(e=>e.visible).slice(...r?[o+1]:[0,o]).reduce((e,t)=>e+(t.height||0)+s,0)},[a]);return(0,s.useEffect)(()=>{a.forEach(e=>{if(e.dismissed)i(e.id,e.removeDelay);else{let t=l.get(e.id);t&&(clearTimeout(t),l.delete(e.id))}})},[a,i]),{toasts:a,handlers:{updateHeight:c,startPause:o,endPause:d,calculateOffset:u}}})(a,i);return s.createElement("div",{"data-rht-toaster":i||"",style:{position:"fixed",zIndex:9999,top:16,left:16,right:16,bottom:16,pointerEvents:"none",...n},className:o,onMouseEnter:d.startPause,onMouseLeave:d.endPause},c.map(a=>{let i,n,o=a.position||t,c=d.calculateOffset(a,{reverseOrder:e,gutter:r,defaultPosition:t}),u=(i=o.includes("top"),n=o.includes("center")?{justifyContent:"center"}:o.includes("right")?{justifyContent:"flex-end"}:{},{left:0,right:0,display:"flex",position:"absolute",transition:v()?void 0:"all 230ms cubic-bezier(.21,1.02,.73,1)",transform:`translateY(${c*(i?1:-1)}px)`,...i?{top:0}:{bottom:0},...n});return s.createElement(X,{id:a.id,key:a.id,onHeightUpdate:d.updateHeight,className:a.visible?Z:"",style:u},"custom"===a.type?y(a.message,a):l?l(a):s.createElement(J,{toast:a,position:o}))}))},"default",0,_,"toast",0,_],705766)},920476,e=>{"use strict";async function t(e,t){let a=await fetch(e,t),r=await a.json().catch(()=>null);if(!a.ok)throw Error(r?.error||r?.message||`Request failed with ${a.status}`);return r}e.s(["apiJson",0,t,"errorMessage",0,function(e,t="Something went wrong"){return e instanceof Error?e.message:t}])},730274,e=>{"use strict";let t=(0,e.i(456420).default)("send",[["path",{d:"M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",key:"1ffxy3"}],["path",{d:"m21.854 2.147-10.94 10.939",key:"12cjpa"}]]);e.s(["Send",0,t],730274)},856423,e=>{"use strict";let t=(0,e.i(456420).default)("book-open",[["path",{d:"M12 7v14",key:"1akyts"}],["path",{d:"M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z",key:"ruj8y"}]]);e.s(["BookOpen",0,t],856423)},277776,e=>{"use strict";var t=e.i(843476),a=e.i(271645),r=e.i(859015),s=e.i(920476);let l=()=>({data:null,error:null});async function i(e){try{return{data:await (0,s.apiJson)(e),error:null}}catch(e){return{data:null,error:(0,s.errorMessage)(e)}}}function n(e){return new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:0}).format(Number(e||0))}function o(e){return`${Math.max(0,Math.min(100,Math.round(e)))}%`}function c({label:e,value:a,detail:r}){return(0,t.jsxs)("div",{className:"tt-card tt-card-pad",children:[(0,t.jsx)("p",{className:"text-xs font-black uppercase text-slate-500",children:e}),(0,t.jsx)("p",{className:"mt-2 text-3xl font-black",children:a??0}),(0,t.jsx)("p",{className:"mt-1 text-sm font-semibold text-slate-600",children:r})]})}function d({label:e,value:a}){return(0,t.jsxs)("div",{className:"rounded-lg border border-slate-200 bg-slate-50 p-4",children:[(0,t.jsx)("p",{className:"text-xs font-black uppercase text-slate-500",children:e}),(0,t.jsx)("p",{className:"mt-1 break-words text-lg font-black",children:a??0})]})}function u({title:e,status:a,detail:r}){return(0,t.jsxs)("div",{className:"mt-5 rounded-lg border border-amber-200 bg-amber-50 p-4",children:[(0,t.jsxs)("div",{className:"flex flex-col gap-2 md:flex-row md:items-center md:justify-between",children:[(0,t.jsx)("p",{className:"font-black",children:e}),(0,t.jsx)("span",{className:"w-fit rounded-full bg-white px-3 py-1 text-xs font-black text-amber-800",children:a})]}),(0,t.jsx)("p",{className:"mt-2 text-sm font-semibold text-slate-700",children:r})]})}e.s(["default",0,function(){let[e,s]=(0,a.useState)(!0),[p,f]=(0,a.useState)(l),[h,m]=(0,a.useState)(l),[b,x]=(0,a.useState)(l),[y,g]=(0,a.useState)(l),[v,j]=(0,a.useState)(l);(0,a.useEffect)(()=>{let e=!0;return Promise.all([i("/api/dashboard"),i("/api/finance"),i("/api/reports"),i("/api/operations/health"),i("/api/operations/data-integrity")]).then(([t,a,r,l,i])=>{e&&(f(t),m(a),x(r),g(l),j(i),s(!1))}),()=>{e=!1}},[]);let k=(0,a.useMemo)(()=>{let e=h.data?.totalFees||0,t=h.data?.totalCollected||0;return e?t/e*100:0},[h.data]),w=[{label:"Pending Fee Exposure",value:n(h.data?.pending),tone:(h.data?.pending||0)>0?"Review":"Healthy"},{label:"Academic Year Gaps",value:String((v.data?.checks?.studentsWithoutYear||0)+(v.data?.checks?.teachersWithoutYear||0)),tone:v.data?.status||"Unknown"},{label:"Event Ledger Records",value:String(y.data?.counts?.events||0),tone:y.data?.status||"Unknown"}];return(0,t.jsx)(r.default,{children:(0,t.jsxs)("div",{className:"space-y-6",children:[(0,t.jsx)("section",{className:"tt-dark-hero rounded-2xl border border-amber-200 bg-slate-950 p-6 shadow-xl",children:(0,t.jsxs)("div",{className:"flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between",children:[(0,t.jsxs)("div",{className:"min-w-0",children:[(0,t.jsx)("p",{className:"tt-dark-accent text-xs font-black uppercase tracking-wide",children:"Executive Workspace"}),(0,t.jsx)("h1",{className:"tt-dark-title mt-2 break-words text-3xl font-black md:text-4xl",children:"Principal Analytics"}),(0,t.jsx)("p",{className:"tt-dark-copy mt-2 max-w-3xl text-sm font-semibold leading-6",children:"School health, academics, finance, attendance and operational evidence in one principal view."})]}),(0,t.jsxs)("div",{className:"rounded-xl border border-amber-300/40 bg-white/10 px-4 py-3",children:[(0,t.jsx)("p",{className:"tt-dark-accent text-xs font-black uppercase",children:"Campus Health"}),(0,t.jsx)("p",{className:"tt-dark-kpi mt-1 text-3xl font-black",children:e?"...":o(p.data?.campusHealth||0)})]})]})}),(0,t.jsxs)("div",{className:"grid gap-4 md:grid-cols-2 xl:grid-cols-4",children:[(0,t.jsx)(c,{label:"Students",value:p.data?.students,detail:"Active student records"}),(0,t.jsx)(c,{label:"Teachers",value:p.data?.teachers,detail:"Faculty records"}),(0,t.jsx)(c,{label:"Attendance",value:p.data?.attendance,detail:"Attendance records"}),(0,t.jsx)(c,{label:"Marks Entries",value:p.data?.marksEntries,detail:"Exam scoring evidence"})]}),(0,t.jsxs)("div",{className:"grid gap-5 xl:grid-cols-[1.2fr_0.8fr]",children:[(0,t.jsxs)("section",{className:"tt-card tt-card-pad",children:[(0,t.jsxs)("div",{className:"mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("h2",{className:"text-xl font-black",children:"Academic Intelligence"}),(0,t.jsx)("p",{className:"text-sm font-semibold text-slate-600",children:"Class, section, subject and assessment readiness."})]}),(0,t.jsx)("a",{className:"tt-button-secondary text-center",href:"/academics",children:"Open Academics"})]}),(0,t.jsxs)("div",{className:"grid gap-3 md:grid-cols-3",children:[(0,t.jsx)(d,{label:"Classes",value:p.data?.classes}),(0,t.jsx)(d,{label:"Sections",value:p.data?.sections}),(0,t.jsx)(d,{label:"Subjects",value:p.data?.subjects})]}),(0,t.jsx)(u,{title:"Academic Year Integrity",status:v.data?.status||(v.error?"Unavailable":"Checking"),detail:v.error||`${v.data?.checks?.studentsWithoutYear||0} students and ${v.data?.checks?.teachersWithoutYear||0} teachers missing academic-year context.`})]}),(0,t.jsxs)("section",{className:"tt-card tt-card-pad",children:[(0,t.jsx)("h2",{className:"text-xl font-black",children:"What Needs Attention"}),(0,t.jsx)("div",{className:"mt-4 space-y-3",children:w.map(e=>(0,t.jsxs)("div",{className:"rounded-lg border border-slate-200 bg-slate-50 p-4",children:[(0,t.jsx)("p",{className:"text-xs font-black uppercase text-slate-500",children:e.label}),(0,t.jsxs)("div",{className:"mt-1 flex items-center justify-between gap-3",children:[(0,t.jsx)("p",{className:"break-words text-lg font-black",children:e.value}),(0,t.jsx)("span",{className:"rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-800",children:e.tone})]})]},e.label))})]})]}),(0,t.jsxs)("div",{className:"grid gap-5 xl:grid-cols-2",children:[(0,t.jsxs)("section",{className:"tt-card tt-card-pad",children:[(0,t.jsx)("h2",{className:"text-xl font-black",children:"Finance Intelligence"}),(0,t.jsxs)("div",{className:"mt-4 grid gap-3 md:grid-cols-3",children:[(0,t.jsx)(d,{label:"Total Fees",value:n(h.data?.totalFees)}),(0,t.jsx)(d,{label:"Collected",value:n(h.data?.totalCollected)}),(0,t.jsx)(d,{label:"Pending",value:n(h.data?.pending)})]}),(0,t.jsxs)("div",{className:"mt-5",children:[(0,t.jsxs)("div",{className:"mb-2 flex items-center justify-between text-sm font-black",children:[(0,t.jsx)("span",{children:"Collection Health"}),(0,t.jsx)("span",{children:o(k)})]}),(0,t.jsx)("div",{className:"h-3 overflow-hidden rounded-full bg-slate-100",children:(0,t.jsx)("div",{className:"h-full rounded-full bg-amber-500",style:{width:o(k)}})})]}),h.error?(0,t.jsx)("p",{className:"mt-4 text-sm font-semibold text-red-700",children:h.error}):null]}),(0,t.jsxs)("section",{className:"tt-card tt-card-pad",children:[(0,t.jsx)("h2",{className:"text-xl font-black",children:"Reports And Evidence"}),(0,t.jsxs)("div",{className:"mt-4 grid gap-3 md:grid-cols-3",children:[(0,t.jsx)(d,{label:"Reports",value:b.data?.exports?.length||0}),(0,t.jsx)(d,{label:"Report Attendance",value:b.data?.summary?.attendance||0}),(0,t.jsx)(d,{label:"Ledger Events",value:y.data?.counts?.events||0})]}),(0,t.jsxs)("div",{className:"mt-5 space-y-3",children:[(b.data?.exports||[]).slice(0,5).map(e=>(0,t.jsxs)("div",{className:"rounded-lg border border-slate-200 bg-white p-3",children:[(0,t.jsx)("p",{className:"font-black",children:e.report_key||`Report ${e.id}`}),(0,t.jsxs)("p",{className:"text-sm font-semibold text-slate-600",children:[e.status||"READY"," /"," ",e.format||"json"]})]},e.id)),b.data?.exports?.length?null:(0,t.jsx)("p",{className:"rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 text-sm font-semibold text-slate-600",children:"No report exports have been generated yet. Use Reports Center to create principal, attendance, finance and operations reports."})]})]})]})]})})}])}]);