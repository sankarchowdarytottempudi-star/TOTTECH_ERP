(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,270904,e=>{"use strict";let t=(0,e.i(456420).default)("wallet",[["path",{d:"M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1",key:"18etb6"}],["path",{d:"M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4",key:"xoc0q4"}]]);e.s(["Wallet",0,t],270904)},195057,(e,t,a)=>{"use strict";Object.defineProperty(a,"__esModule",{value:!0});var r={formatUrl:function(){return o},formatWithValidation:function(){return c},urlObjectKeys:function(){return l}};for(var s in r)Object.defineProperty(a,s,{enumerable:!0,get:r[s]});let i=e.r(190809)._(e.r(998183)),n=/https?|ftp|gopher|file/;function o(e){let{auth:t,hostname:a}=e,r=e.protocol||"",s=e.pathname||"",o=e.hash||"",l=e.query||"",c=!1;t=t?encodeURIComponent(t).replace(/%3A/i,":")+"@":"",e.host?c=t+e.host:a&&(c=t+(~a.indexOf(":")?`[${a}]`:a),e.port&&(c+=":"+e.port)),l&&"object"==typeof l&&(l=String(i.urlQueryToSearchParams(l)));let d=e.search||l&&`?${l}`||"";return r&&!r.endsWith(":")&&(r+=":"),e.slashes||(!r||n.test(r))&&!1!==c?(c="//"+(c||""),s&&"/"!==s[0]&&(s="/"+s)):c||(c=""),o&&"#"!==o[0]&&(o="#"+o),d&&"?"!==d[0]&&(d="?"+d),s=s.replace(/[?#]/g,encodeURIComponent),d=d.replace("#","%23"),`${r}${c}${s}${d}${o}`}let l=["auth","hash","host","hostname","href","path","pathname","port","protocol","query","search","slashes"];function c(e){return o(e)}},573668,(e,t,a)=>{"use strict";Object.defineProperty(a,"__esModule",{value:!0}),Object.defineProperty(a,"isLocalURL",{enumerable:!0,get:function(){return i}});let r=e.r(718967),s=e.r(652817);function i(e){if(!(0,r.isAbsoluteUrl)(e))return!0;try{let t=(0,r.getLocationOrigin)(),a=new URL(e,t);return a.origin===t&&(0,s.hasBasePath)(a.pathname)}catch(e){return!1}}},284508,(e,t,a)=>{"use strict";Object.defineProperty(a,"__esModule",{value:!0}),Object.defineProperty(a,"errorOnce",{enumerable:!0,get:function(){return r}});let r=e=>{}},522016,(e,t,a)=>{"use strict";Object.defineProperty(a,"__esModule",{value:!0});var r={default:function(){return g},useLinkStatus:function(){return v}};for(var s in r)Object.defineProperty(a,s,{enumerable:!0,get:r[s]});let i=e.r(190809),n=e.r(843476),o=i._(e.r(271645)),l=e.r(195057),c=e.r(8372),d=e.r(818581),u=e.r(718967),p=e.r(405550);e.r(233525);let f=e.r(388540),h=e.r(91949),m=e.r(573668),y=e.r(509396);function g(t){var a,r;let s,i,g,[v,x]=(0,o.useOptimistic)(h.IDLE_LINK_STATUS),j=(0,o.useRef)(null),{href:k,as:_,children:w,prefetch:C=null,passHref:N,replace:M,shallow:S,scroll:E,onClick:O,onMouseEnter:A,onTouchStart:$,legacyBehavior:P=!1,onNavigate:R,transitionTypes:L,ref:T,unstable_dynamicOnHover:D,...I}=t;s=w,P&&("string"==typeof s||"number"==typeof s)&&(s=(0,n.jsx)("a",{children:s}));let z=o.default.useContext(c.AppRouterContext),q=!1!==C,U=!1!==C?null===(r=C)||"auto"===r?y.FetchStrategy.PPR:y.FetchStrategy.Full:y.FetchStrategy.PPR,B="string"==typeof(a=_||k)?a:(0,l.formatUrl)(a);if(P){if(s?.$$typeof===Symbol.for("react.lazy"))throw Object.defineProperty(Error("`<Link legacyBehavior>` received a direct child that is either a Server Component, or JSX that was loaded with React.lazy(). This is not supported. Either remove legacyBehavior, or make the direct child a Client Component that renders the Link's `<a>` tag."),"__NEXT_ERROR_CODE",{value:"E863",enumerable:!1,configurable:!0});i=o.default.Children.only(s)}let F=P?i&&"object"==typeof i&&i.ref:T,V=o.default.useCallback(e=>(null!==z&&(j.current=(0,h.mountLinkInstance)(e,B,z,U,q,x)),()=>{j.current&&((0,h.unmountLinkForCurrentNavigation)(j.current),j.current=null),(0,h.unmountPrefetchableInstance)(e)}),[q,B,z,U,x]),H={ref:(0,d.useMergedRef)(V,F),onClick(t){P||"function"!=typeof O||O(t),P&&i.props&&"function"==typeof i.props.onClick&&i.props.onClick(t),!z||t.defaultPrevented||function(t,a,r,s,i,n,l){if("u">typeof window){let c,{nodeName:d}=t.currentTarget;if("A"===d.toUpperCase()&&((c=t.currentTarget.getAttribute("target"))&&"_self"!==c||t.metaKey||t.ctrlKey||t.shiftKey||t.altKey||t.nativeEvent&&2===t.nativeEvent.which)||t.currentTarget.hasAttribute("download"))return;if(!(0,m.isLocalURL)(a)){s&&(t.preventDefault(),location.replace(a));return}if(t.preventDefault(),n){let e=!1;if(n({preventDefault:()=>{e=!0}}),e)return}let{dispatchNavigateAction:u}=e.r(699781);o.default.startTransition(()=>{u(a,s?"replace":"push",!1===i?f.ScrollBehavior.NoScroll:f.ScrollBehavior.Default,r.current,l)})}}(t,B,j,M,E,R,L)},onMouseEnter(e){P||"function"!=typeof A||A(e),P&&i.props&&"function"==typeof i.props.onMouseEnter&&i.props.onMouseEnter(e),z&&q&&(0,h.onNavigationIntent)(e.currentTarget,!0===D)},onTouchStart:function(e){P||"function"!=typeof $||$(e),P&&i.props&&"function"==typeof i.props.onTouchStart&&i.props.onTouchStart(e),z&&q&&(0,h.onNavigationIntent)(e.currentTarget,!0===D)}};return(0,u.isAbsoluteUrl)(B)?H.href=B:P&&!N&&("a"!==i.type||"href"in i.props)||(H.href=(0,p.addBasePath)(B)),g=P?o.default.cloneElement(i,H):(0,n.jsx)("a",{...I,...H,children:s}),(0,n.jsx)(b.Provider,{value:v,children:g})}e.r(284508);let b=(0,o.createContext)(h.IDLE_LINK_STATUS),v=()=>(0,o.useContext)(b);("function"==typeof a.default||"object"==typeof a.default&&null!==a.default)&&void 0===a.default.__esModule&&(Object.defineProperty(a.default,"__esModule",{value:!0}),Object.assign(a.default,a),t.exports=a.default)},396661,505014,e=>{"use strict";let t=(...e)=>e.filter((e,t,a)=>!!e&&""!==e.trim()&&a.indexOf(e)===t).join(" ").trim();e.s(["mergeClasses",0,t],396661);var a=e.i(271645),r={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};let s=(0,a.createContext)({}),i=(0,a.forwardRef)(({color:e,size:i,strokeWidth:n,absoluteStrokeWidth:o,className:l="",children:c,iconNode:d,...u},p)=>{let{size:f=24,strokeWidth:h=2,absoluteStrokeWidth:m=!1,color:y="currentColor",className:g=""}=(0,a.useContext)(s)??{},b=o??m?24*Number(n??h)/Number(i??f):n??h;return(0,a.createElement)("svg",{ref:p,...r,width:i??f??r.width,height:i??f??r.height,stroke:e??y,strokeWidth:b,className:t("lucide",g,l),...!c&&!(e=>{for(let t in e)if(t.startsWith("aria-")||"role"===t||"title"===t)return!0;return!1})(u)&&{"aria-hidden":"true"},...u},[...d.map(([e,t])=>(0,a.createElement)(e,t)),...Array.isArray(c)?c:[c]])});e.s(["default",0,i],505014)},618566,(e,t,a)=>{t.exports=e.r(976562)},146387,456420,e=>{"use strict";var t=e.i(271645),a=e.i(396661);let r=e=>{let t=e.replace(/^([A-Z])|[\s-_]+(\w)/g,(e,t,a)=>a?a.toUpperCase():t.toLowerCase());return t.charAt(0).toUpperCase()+t.slice(1)};var s=e.i(505014);let i=(e,i)=>{let n=(0,t.forwardRef)(({className:n,...o},l)=>(0,t.createElement)(s.default,{ref:l,iconNode:i,className:(0,a.mergeClasses)(`lucide-${r(e).replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase()}`,`lucide-${e}`,n),...o}));return n.displayName=r(e),n};e.s(["default",0,i],456420);let n=i("building-2",[["path",{d:"M10 12h4",key:"a56b0p"}],["path",{d:"M10 8h4",key:"1sr2af"}],["path",{d:"M14 21v-3a2 2 0 0 0-4 0v3",key:"1rgiei"}],["path",{d:"M6 10H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2",key:"secmi2"}],["path",{d:"M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16",key:"16ra0t"}]]);e.s(["Building2",0,n],146387)},818581,(e,t,a)=>{"use strict";Object.defineProperty(a,"__esModule",{value:!0}),Object.defineProperty(a,"useMergedRef",{enumerable:!0,get:function(){return s}});let r=e.r(271645);function s(e,t){let a=(0,r.useRef)(null),s=(0,r.useRef)(null);return(0,r.useCallback)(r=>{if(null===r){let e=a.current;e&&(a.current=null,e());let t=s.current;t&&(s.current=null,t())}else e&&(a.current=i(e,r)),t&&(s.current=i(t,r))},[e,t])}function i(e,t){if("function"!=typeof e)return e.current=t,()=>{e.current=null};{let a=e(t);return"function"==typeof a?a:()=>e(null)}}("function"==typeof a.default||"object"==typeof a.default&&null!==a.default)&&void 0===a.default.__esModule&&(Object.defineProperty(a.default,"__esModule",{value:!0}),Object.assign(a.default,a),t.exports=a.default)},823482,e=>{"use strict";let t=(0,e.i(456420).default)("graduation-cap",[["path",{d:"M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z",key:"j76jl0"}],["path",{d:"M22 10v6",key:"1lu8f3"}],["path",{d:"M6 12.5V16a6 3 0 0 0 12 0v-3.5",key:"1r8lef"}]]);e.s(["GraduationCap",0,t],823482)},263676,e=>{"use strict";let t=(0,e.i(456420).default)("x",[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]]);e.s(["X",0,t],263676)},370812,e=>{"use strict";let t=(0,e.i(456420).default)("bell",[["path",{d:"M10.268 21a2 2 0 0 0 3.464 0",key:"vwvbt9"}],["path",{d:"M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326",key:"11g9vi"}]]);e.s(["Bell",0,t],370812)},716327,867927,e=>{"use strict";var t=e.i(456420);let a=(0,t.default)("chevron-down",[["path",{d:"m6 9 6 6 6-6",key:"qrunsl"}]]);e.s(["ChevronDown",0,a],716327);let r=(0,t.default)("chevron-right",[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]]);e.s(["ChevronRight",0,r],867927)},55677,e=>{"use strict";let t=(0,e.i(456420).default)("clipboard-list",[["rect",{width:"8",height:"4",x:"8",y:"2",rx:"1",ry:"1",key:"tgr4d6"}],["path",{d:"M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",key:"116196"}],["path",{d:"M12 11h4",key:"1jrz19"}],["path",{d:"M12 16h4",key:"n85exb"}],["path",{d:"M8 11h.01",key:"1dfujw"}],["path",{d:"M8 16h.01",key:"18s6g9"}]]);e.s(["ClipboardList",0,t],55677)},166794,e=>{"use strict";let t=(0,e.i(456420).default)("settings",[["path",{d:"M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915",key:"1i5ecw"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);e.s(["Settings",0,t],166794)},584026,e=>{"use strict";let t=(0,e.i(456420).default)("shield-check",[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]]);e.s(["ShieldCheck",0,t],584026)},779432,e=>{"use strict";let t=(0,e.i(456420).default)("activity",[["path",{d:"M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2",key:"169zse"}]]);e.s(["Activity",0,t],779432)},367784,593583,e=>{"use strict";var t=e.i(456420);let a=(0,t.default)("log-out",[["path",{d:"m16 17 5-5-5-5",key:"1bji2h"}],["path",{d:"M21 12H9",key:"dn1m92"}],["path",{d:"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",key:"1uf3rs"}]]);e.s(["LogOut",0,a],367784);let r=(0,t.default)("menu",[["path",{d:"M4 5h16",key:"1tepv9"}],["path",{d:"M4 12h16",key:"1lakjw"}],["path",{d:"M4 19h16",key:"1djgab"}]]);e.s(["Menu",0,r],593583)},749803,e=>{"use strict";let t=(0,e.i(456420).default)("chart-column",[["path",{d:"M3 3v16a2 2 0 0 0 2 2h16",key:"c24i48"}],["path",{d:"M18 17V9",key:"2bz60n"}],["path",{d:"M13 17V5",key:"1frdt8"}],["path",{d:"M8 17v-3",key:"17ska0"}]]);e.s(["BarChart3",0,t],749803)},566595,e=>{"use strict";let t=(0,e.i(456420).default)("search",[["path",{d:"m21 21-4.34-4.34",key:"14j7rj"}],["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}]]);e.s(["Search",0,t],566595)},705766,e=>{"use strict";let t,a;var r,s=e.i(271645);let i={data:""},n=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,o=/\/\*[^]*?\*\/|  +/g,l=/\n+/g,c=(e,t)=>{let a="",r="",s="";for(let i in e){let n=e[i];"@"==i[0]?"i"==i[1]?a=i+" "+n+";":r+="f"==i[1]?c(n,i):i+"{"+c(n,"k"==i[1]?"":t)+"}":"object"==typeof n?r+=c(n,t?t.replace(/([^,])+/g,e=>i.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,t=>/&/.test(t)?t.replace(/&/g,e):e?e+" "+t:t)):i):null!=n&&(i="-"==i[1]?i:i.replace(/[A-Z]/g,"-$&").toLowerCase(),s+=c.p?c.p(i,n):i+":"+n+";")}return a+(t&&s?t+"{"+s+"}":s)+r},d={},u=e=>{if("object"==typeof e){let t="";for(let a in e)t+=a+u(e[a]);return t}return e};function p(e){let t,a,r=this||{},s=e.call?e(r.p):e;return((e,t,a,r,s)=>{var i;let p=u(e),f=d[p]||(d[p]=(e=>{let t=0,a=11;for(;t<e.length;)a=101*a+e.charCodeAt(t++)>>>0;return"go"+a})(p));if(!d[f]){let t=p!==e?e:(e=>{let t,a,r=[{}];for(;t=n.exec(e.replace(o,""));)t[4]?r.shift():t[3]?(a=t[3].replace(l," ").trim(),r.unshift(r[0][a]=r[0][a]||{})):r[0][t[1]]=t[2].replace(l," ").trim();return r[0]})(e);d[f]=c(s?{["@keyframes "+f]:t}:t,a?"":"."+f)}let h=a&&d.g;return a&&(d.g=d[f]),i=d[f],h?t.data=t.data.replace(h,i):-1===t.data.indexOf(i)&&(t.data=r?i+t.data:t.data+i),f})(s.unshift?s.raw?(t=[].slice.call(arguments,1),a=r.p,s.reduce((e,r,s)=>{let i=t[s];if(i&&i.call){let e=i(a),t=e&&e.props&&e.props.className||/^go/.test(e)&&e;i=t?"."+t:e&&"object"==typeof e?e.props?"":c(e,""):!1===e?"":e}return e+r+(null==i?"":i)},"")):s.reduce((e,t)=>Object.assign(e,t&&t.call?t(r.p):t),{}):s,(e=>{if("object"==typeof window){let t=(e?e.querySelector("#_goober"):window._goober)||Object.assign(document.createElement("style"),{innerHTML:" ",id:"_goober"});return t.nonce=window.__nonce__,t.parentNode||(e||document.head).appendChild(t),t.firstChild}return e||i})(r.target),r.g,r.o,r.k)}p.bind({g:1});let f,h,m,y=p.bind({k:1});function g(e,t){let a=this||{};return function(){let r=arguments;function s(i,n){let o=Object.assign({},i),l=o.className||s.className;a.p=Object.assign({theme:h&&h()},o),a.o=/go\d/.test(l),o.className=p.apply(a,r)+(l?" "+l:""),t&&(o.ref=n);let c=e;return e[0]&&(c=o.as||e,delete o.as),m&&c[0]&&m(o),f(c,o)}return t?t(s):s}}var b=(e,t)=>"function"==typeof e?e(t):e,v=(t=0,()=>(++t).toString()),x=()=>{if(void 0===a&&"u">typeof window){let e=matchMedia("(prefers-reduced-motion: reduce)");a=!e||e.matches}return a},j="default",k=(e,t)=>{let{toastLimit:a}=e.settings;switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,a)};case 1:return{...e,toasts:e.toasts.map(e=>e.id===t.toast.id?{...e,...t.toast}:e)};case 2:let{toast:r}=t;return k(e,{type:+!!e.toasts.find(e=>e.id===r.id),toast:r});case 3:let{toastId:s}=t;return{...e,toasts:e.toasts.map(e=>e.id===s||void 0===s?{...e,dismissed:!0,visible:!1}:e)};case 4:return void 0===t.toastId?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(e=>e.id!==t.toastId)};case 5:return{...e,pausedAt:t.time};case 6:let i=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(e=>({...e,pauseDuration:e.pauseDuration+i}))}}},_=[],w={toasts:[],pausedAt:void 0,settings:{toastLimit:20}},C={},N=(e,t=j)=>{C[t]=k(C[t]||w,e),_.forEach(([e,a])=>{e===t&&a(C[t])})},M=e=>Object.keys(C).forEach(t=>N(e,t)),S=(e=j)=>t=>{N(t,e)},E={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},O=e=>(t,a)=>{let r,s=((e,t="blank",a)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:t,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...a,id:(null==a?void 0:a.id)||v()}))(t,e,a);return S(s.toasterId||(r=s.id,Object.keys(C).find(e=>C[e].toasts.some(e=>e.id===r))))({type:2,toast:s}),s.id},A=(e,t)=>O("blank")(e,t);A.error=O("error"),A.success=O("success"),A.loading=O("loading"),A.custom=O("custom"),A.dismiss=(e,t)=>{let a={type:3,toastId:e};t?S(t)(a):M(a)},A.dismissAll=e=>A.dismiss(void 0,e),A.remove=(e,t)=>{let a={type:4,toastId:e};t?S(t)(a):M(a)},A.removeAll=e=>A.remove(void 0,e),A.promise=(e,t,a)=>{let r=A.loading(t.loading,{...a,...null==a?void 0:a.loading});return"function"==typeof e&&(e=e()),e.then(e=>{let s=t.success?b(t.success,e):void 0;return s?A.success(s,{id:r,...a,...null==a?void 0:a.success}):A.dismiss(r),e}).catch(e=>{let s=t.error?b(t.error,e):void 0;s?A.error(s,{id:r,...a,...null==a?void 0:a.error}):A.dismiss(r)}),e};var $=1e3,P=y`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,R=y`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,L=y`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,T=g("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${P} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
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
}`,q=y`
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
}`,U=g("div")`
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
    animation: ${q} 0.2s ease-out forwards;
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
`,F=g("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,V=y`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,H=g("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${V} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,J=({toast:e})=>{let{icon:t,type:a,iconTheme:r}=e;return void 0!==t?"string"==typeof t?s.createElement(H,null,t):t:"blank"===a?null:s.createElement(F,null,s.createElement(I,{...r}),"loading"!==a&&s.createElement(B,null,"error"===a?s.createElement(T,{...r}):s.createElement(U,{...r})))},K=g("div")`
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
`,X=s.memo(({toast:e,position:t,style:a,children:r})=>{let i=e.height?((e,t)=>{let a=e.includes("top")?1:-1,[r,s]=x()?["0%{opacity:0;} 100%{opacity:1;}","0%{opacity:1;} 100%{opacity:0;}"]:[`
0% {transform: translate3d(0,${-200*a}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${-150*a}%,-1px) scale(.6); opacity:0;}
`];return{animation:t?`${y(r)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${y(s)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}})(e.position||t||"top-center",e.visible):{opacity:0},n=s.createElement(J,{toast:e}),o=s.createElement(W,{...e.ariaProps},b(e.message,e));return s.createElement(K,{className:e.className,style:{...i,...a,...e.style}},"function"==typeof r?r({icon:n,message:o}):s.createElement(s.Fragment,null,n,o))});r=s.createElement,c.p=void 0,f=r,h=void 0,m=void 0;var G=({id:e,className:t,style:a,onHeightUpdate:r,children:i})=>{let n=s.useCallback(t=>{if(t){let a=()=>{r(e,t.getBoundingClientRect().height)};a(),new MutationObserver(a).observe(t,{subtree:!0,childList:!0,characterData:!0})}},[e,r]);return s.createElement("div",{ref:n,className:t,style:a},i)},Z=p`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`;e.s(["Toaster",0,({reverseOrder:e,position:t="top-center",toastOptions:a,gutter:r,children:i,toasterId:n,containerStyle:o,containerClassName:l})=>{let{toasts:c,handlers:d}=((e,t="default")=>{let{toasts:a,pausedAt:r}=((e={},t=j)=>{let[a,r]=(0,s.useState)(C[t]||w),i=(0,s.useRef)(C[t]);(0,s.useEffect)(()=>(i.current!==C[t]&&r(C[t]),_.push([t,r]),()=>{let e=_.findIndex(([e])=>e===t);e>-1&&_.splice(e,1)}),[t]);let n=a.toasts.map(t=>{var a,r,s;return{...e,...e[t.type],...t,removeDelay:t.removeDelay||(null==(a=e[t.type])?void 0:a.removeDelay)||(null==e?void 0:e.removeDelay),duration:t.duration||(null==(r=e[t.type])?void 0:r.duration)||(null==e?void 0:e.duration)||E[t.type],style:{...e.style,...null==(s=e[t.type])?void 0:s.style,...t.style}}});return{...a,toasts:n}})(e,t),i=(0,s.useRef)(new Map).current,n=(0,s.useCallback)((e,t=$)=>{if(i.has(e))return;let a=setTimeout(()=>{i.delete(e),o({type:4,toastId:e})},t);i.set(e,a)},[]);(0,s.useEffect)(()=>{if(r)return;let e=Date.now(),s=a.map(a=>{if(a.duration===1/0)return;let r=(a.duration||0)+a.pauseDuration-(e-a.createdAt);if(r<0){a.visible&&A.dismiss(a.id);return}return setTimeout(()=>A.dismiss(a.id,t),r)});return()=>{s.forEach(e=>e&&clearTimeout(e))}},[a,r,t]);let o=(0,s.useCallback)(S(t),[t]),l=(0,s.useCallback)(()=>{o({type:5,time:Date.now()})},[o]),c=(0,s.useCallback)((e,t)=>{o({type:1,toast:{id:e,height:t}})},[o]),d=(0,s.useCallback)(()=>{r&&o({type:6,time:Date.now()})},[r,o]),u=(0,s.useCallback)((e,t)=>{let{reverseOrder:r=!1,gutter:s=8,defaultPosition:i}=t||{},n=a.filter(t=>(t.position||i)===(e.position||i)&&t.height),o=n.findIndex(t=>t.id===e.id),l=n.filter((e,t)=>t<o&&e.visible).length;return n.filter(e=>e.visible).slice(...r?[l+1]:[0,l]).reduce((e,t)=>e+(t.height||0)+s,0)},[a]);return(0,s.useEffect)(()=>{a.forEach(e=>{if(e.dismissed)n(e.id,e.removeDelay);else{let t=i.get(e.id);t&&(clearTimeout(t),i.delete(e.id))}})},[a,n]),{toasts:a,handlers:{updateHeight:c,startPause:l,endPause:d,calculateOffset:u}}})(a,n);return s.createElement("div",{"data-rht-toaster":n||"",style:{position:"fixed",zIndex:9999,top:16,left:16,right:16,bottom:16,pointerEvents:"none",...o},className:l,onMouseEnter:d.startPause,onMouseLeave:d.endPause},c.map(a=>{let n,o,l=a.position||t,c=d.calculateOffset(a,{reverseOrder:e,gutter:r,defaultPosition:t}),u=(n=l.includes("top"),o=l.includes("center")?{justifyContent:"center"}:l.includes("right")?{justifyContent:"flex-end"}:{},{left:0,right:0,display:"flex",position:"absolute",transition:x()?void 0:"all 230ms cubic-bezier(.21,1.02,.73,1)",transform:`translateY(${c*(n?1:-1)}px)`,...n?{top:0}:{bottom:0},...o});return s.createElement(G,{id:a.id,key:a.id,onHeightUpdate:d.updateHeight,className:a.visible?Z:"",style:u},"custom"===a.type?b(a.message,a):i?i(a):s.createElement(X,{toast:a,position:l}))}))},"default",0,A,"toast",0,A],705766)},920476,e=>{"use strict";async function t(e,t){let a=await fetch(e,t),r=await a.json().catch(()=>null);if(!a.ok)throw Error(r?.error||r?.message||`Request failed with ${a.status}`);return r}e.s(["apiJson",0,t,"errorMessage",0,function(e,t="Something went wrong"){return e instanceof Error?e.message:t}])},856423,e=>{"use strict";let t=(0,e.i(456420).default)("book-open",[["path",{d:"M12 7v14",key:"1akyts"}],["path",{d:"M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z",key:"ruj8y"}]]);e.s(["BookOpen",0,t],856423)},730274,e=>{"use strict";let t=(0,e.i(456420).default)("send",[["path",{d:"M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",key:"1ffxy3"}],["path",{d:"m21.854 2.147-10.94 10.939",key:"12cjpa"}]]);e.s(["Send",0,t],730274)},462047,e=>{"use strict";var t=e.i(705766);e.s(["notify",0,{success:e=>t.default.success(e),error:e=>t.default.error(e),warning:e=>(0,t.default)(e,{icon:"⚠️"}),info:e=>(0,t.default)(e,{icon:"ℹ️"})}])},976226,e=>{"use strict";let t=(0,e.i(456420).default)("indian-rupee",[["path",{d:"M6 3h12",key:"ggurg9"}],["path",{d:"M6 8h12",key:"6g4wlu"}],["path",{d:"m6 13 8.5 8",key:"u1kupk"}],["path",{d:"M6 13h3",key:"wdp6ag"}],["path",{d:"M9 13c6.667 0 6.667-10 0-10",key:"1nkvk2"}]]);e.s(["IndianRupee",0,t],976226)},179053,e=>{"use strict";var t=e.i(843476);let a=(0,e.i(456420).default)("check",[["path",{d:"M20 6 9 17l-5-5",key:"1gmf2c"}]]);var r=e.i(976226),s=e.i(263676),i=e.i(271645),n=e.i(859015),o=e.i(920476),l=e.i(462047);let c={class_id:"",section_id:"",student_id:"",invoice_id:"",fee_category_id:"",requested_amount:"",reason:""};function d({label:e,value:a,onChange:r}){return(0,t.jsxs)("label",{className:"min-w-0",children:[(0,t.jsx)("span",{className:"mb-1 block text-sm font-bold text-slate-700",children:e}),(0,t.jsx)("input",{className:"input",value:a,onChange:e=>r(e.target.value)})]})}function u({label:e,value:a,onChange:r,children:s}){return(0,t.jsxs)("label",{className:"min-w-0",children:[(0,t.jsx)("span",{className:"mb-1 block text-sm font-bold text-slate-700",children:e}),(0,t.jsx)("select",{className:"input",value:a,onChange:e=>r(e.target.value),children:s})]})}function p({label:e,value:a}){return(0,t.jsxs)("div",{className:"min-w-0",children:[(0,t.jsx)("p",{className:"text-xs font-bold uppercase text-slate-500",children:e}),(0,t.jsx)("p",{className:"truncate font-semibold text-slate-950",children:a})]})}e.s(["default",0,function(){let[e,f]=(0,i.useState)([]),[h,m]=(0,i.useState)([]),[y,g]=(0,i.useState)([]),[b,v]=(0,i.useState)([]),[x,j]=(0,i.useState)([]),[k,_]=(0,i.useState)([]),[w,C]=(0,i.useState)(c),[N,M]=(0,i.useState)(""),[S,E]=(0,i.useState)(!1);(0,i.useEffect)(()=>{O()},[]);let O=async()=>{try{let[e,t,a,r]=await Promise.all([(0,o.apiJson)("/api/concessions"),(0,o.apiJson)("/api/roster"),(0,o.apiJson)("/api/finance/invoices"),(0,o.apiJson)("/api/fee-categories")]);f(e.concessions||[]),m(Array.isArray(t.students)?t.students:[]),g(Array.isArray(t.classes)?t.classes:[]),v(Array.isArray(t.sections)?t.sections:[]),j(a.invoices||[]),_(Array.isArray(r)?r:[])}catch(e){l.notify.error((0,o.errorMessage)(e,"Failed to load concessions"))}},A=async()=>{try{E(!0),await (0,o.apiJson)("/api/concessions",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(w)}),l.notify.success("Concession request created"),C(c),O()}catch(e){l.notify.error((0,o.errorMessage)(e,"Failed to create concession"))}finally{E(!1)}},$=async(e,t)=>{try{await (0,o.apiJson)(`/api/concessions/${e.id}/approval`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({status:t,approved_amount:"APPROVED"===t?e.requested_amount:0,comments:t.toLowerCase()})}),l.notify.success(`Concession ${t.toLowerCase()}`),O()}catch(e){l.notify.error((0,o.errorMessage)(e,"Failed to update concession"))}},P=e=>{let t=h.find(t=>t.id===e);return[t?.first_name,t?.last_name].filter(Boolean).join(" ")||`Student ${e||"-"}`},R=b.filter(e=>!w.class_id||Number(e.class_id)===Number(w.class_id)),L=h.filter(e=>{let t=!w.class_id||Number(e.class_id)===Number(w.class_id),a=!w.section_id||Number(e.section_id)===Number(w.section_id),r=`
        ${P(e.id)}
        ${e.admission_number||""}
        ${e.phone||""}
      `.toLowerCase();return t&&a&&r.includes(N.toLowerCase())}),T=x.filter(e=>!w.student_id||Number(e.student_id)===Number(w.student_id));return(0,t.jsx)(n.default,{children:(0,t.jsxs)("div",{className:"space-y-6",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("h1",{className:"text-3xl font-black md:text-4xl",children:"Fee Concessions"}),(0,t.jsx)("p",{className:"mt-1 text-sm text-slate-600",children:"Create, approve, reject, and audit concession requests."})]}),(0,t.jsxs)("div",{className:"tt-card tt-card-pad",children:[(0,t.jsx)("h2",{className:"mb-4 text-xl font-black",children:"Create Concession Request"}),(0,t.jsxs)("div",{className:" grid gap-4 md:grid-cols-2 xl:grid-cols-5 ",children:[(0,t.jsxs)(u,{label:"Class",value:w.class_id,onChange:e=>C({...w,class_id:e,section_id:"",student_id:"",invoice_id:""}),children:[(0,t.jsx)("option",{value:"",children:"Select Class"}),y.map(e=>(0,t.jsx)("option",{value:e.id,children:e.class_name},e.id))]}),(0,t.jsxs)(u,{label:"Section",value:w.section_id,onChange:e=>C({...w,section_id:e,student_id:"",invoice_id:""}),children:[(0,t.jsx)("option",{value:"",children:"All Sections"}),R.map(e=>(0,t.jsx)("option",{value:e.id,children:e.section_name},e.id))]}),(0,t.jsx)(d,{label:"Search Student",value:N,onChange:M}),(0,t.jsxs)(u,{label:"Student",value:w.student_id,onChange:e=>C({...w,student_id:e,invoice_id:""}),children:[(0,t.jsx)("option",{value:"",children:"Select Student"}),L.map(e=>(0,t.jsxs)("option",{value:e.id,children:[P(e.id),e.admission_number?` - ${e.admission_number}`:""]},e.id))]}),(0,t.jsxs)(u,{label:"Invoice",value:w.invoice_id,onChange:e=>C({...w,invoice_id:e}),children:[(0,t.jsx)("option",{value:"",children:"Optional"}),T.map(e=>(0,t.jsx)("option",{value:e.id,children:e.invoice_number||`Invoice ${e.id}`},e.id))]}),(0,t.jsxs)(u,{label:"Fee Category",value:w.fee_category_id,onChange:e=>C({...w,fee_category_id:e}),children:[(0,t.jsx)("option",{value:"",children:"Optional"}),k.map(e=>(0,t.jsx)("option",{value:e.id,children:e.fee_name},e.id))]}),(0,t.jsx)(d,{label:"Amount",value:w.requested_amount,onChange:e=>C({...w,requested_amount:e})}),(0,t.jsx)(d,{label:"Reason",value:w.reason,onChange:e=>C({...w,reason:e})})]}),(0,t.jsxs)("button",{onClick:A,disabled:S,className:"tt-button mt-5 inline-flex items-center gap-2",children:[(0,t.jsx)(r.IndianRupee,{size:17}),S?"Creating...":"Create Request"]})]}),(0,t.jsx)("div",{className:" grid gap-4 md:grid-cols-2 xl:grid-cols-3 ",children:e.map(e=>(0,t.jsxs)("article",{className:"tt-card tt-card-pad",children:[(0,t.jsxs)("div",{className:"flex items-start justify-between gap-3",children:[(0,t.jsxs)("div",{className:"min-w-0",children:[(0,t.jsx)("h2",{className:"truncate text-lg font-black",children:e.student_name||P(e.student_id)}),(0,t.jsxs)("p",{className:"text-sm font-semibold text-amber-700",children:[e.class_name||"-",e.section_name?` ${e.section_name}`:""," ","· Request #",e.id]})]}),(0,t.jsx)("span",{className:"tt-badge",children:e.status||"PENDING"})]}),(0,t.jsxs)("div",{className:"mt-4 grid grid-cols-2 gap-3 text-sm",children:[(0,t.jsx)(p,{label:"Requested",value:`₹${Number(e.requested_amount||0)}`}),(0,t.jsx)(p,{label:"Approved",value:`₹${Number(e.approved_amount||0)}`})]}),(0,t.jsx)("p",{className:"mt-4 min-h-10 text-sm text-slate-600",children:e.reason||"No reason recorded"}),"PENDING"===e.status&&(0,t.jsxs)("div",{className:"mt-5 grid grid-cols-2 gap-2",children:[(0,t.jsxs)("button",{onClick:()=>$(e,"APPROVED"),className:"tt-button inline-flex items-center justify-center gap-2",children:[(0,t.jsx)(a,{size:15}),"Approve"]}),(0,t.jsxs)("button",{onClick:()=>$(e,"REJECTED"),className:" inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-bold text-red-700 ",children:[(0,t.jsx)(s.X,{size:15}),"Reject"]})]})]},e.id))})]})})}],179053)}]);