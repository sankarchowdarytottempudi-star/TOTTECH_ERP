(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,270904,e=>{"use strict";let t=(0,e.i(456420).default)("wallet",[["path",{d:"M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1",key:"18etb6"}],["path",{d:"M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4",key:"xoc0q4"}]]);e.s(["Wallet",0,t],270904)},195057,(e,t,a)=>{"use strict";Object.defineProperty(a,"__esModule",{value:!0});var r={formatUrl:function(){return l},formatWithValidation:function(){return c},urlObjectKeys:function(){return i}};for(var o in r)Object.defineProperty(a,o,{enumerable:!0,get:r[o]});let n=e.r(190809)._(e.r(998183)),s=/https?|ftp|gopher|file/;function l(e){let{auth:t,hostname:a}=e,r=e.protocol||"",o=e.pathname||"",l=e.hash||"",i=e.query||"",c=!1;t=t?encodeURIComponent(t).replace(/%3A/i,":")+"@":"",e.host?c=t+e.host:a&&(c=t+(~a.indexOf(":")?`[${a}]`:a),e.port&&(c+=":"+e.port)),i&&"object"==typeof i&&(i=String(n.urlQueryToSearchParams(i)));let d=e.search||i&&`?${i}`||"";return r&&!r.endsWith(":")&&(r+=":"),e.slashes||(!r||s.test(r))&&!1!==c?(c="//"+(c||""),o&&"/"!==o[0]&&(o="/"+o)):c||(c=""),l&&"#"!==l[0]&&(l="#"+l),d&&"?"!==d[0]&&(d="?"+d),o=o.replace(/[?#]/g,encodeURIComponent),d=d.replace("#","%23"),`${r}${c}${o}${d}${l}`}let i=["auth","hash","host","hostname","href","path","pathname","port","protocol","query","search","slashes"];function c(e){return l(e)}},573668,(e,t,a)=>{"use strict";Object.defineProperty(a,"__esModule",{value:!0}),Object.defineProperty(a,"isLocalURL",{enumerable:!0,get:function(){return n}});let r=e.r(718967),o=e.r(652817);function n(e){if(!(0,r.isAbsoluteUrl)(e))return!0;try{let t=(0,r.getLocationOrigin)(),a=new URL(e,t);return a.origin===t&&(0,o.hasBasePath)(a.pathname)}catch(e){return!1}}},284508,(e,t,a)=>{"use strict";Object.defineProperty(a,"__esModule",{value:!0}),Object.defineProperty(a,"errorOnce",{enumerable:!0,get:function(){return r}});let r=e=>{}},522016,(e,t,a)=>{"use strict";Object.defineProperty(a,"__esModule",{value:!0});var r={default:function(){return g},useLinkStatus:function(){return b}};for(var o in r)Object.defineProperty(a,o,{enumerable:!0,get:r[o]});let n=e.r(190809),s=e.r(843476),l=n._(e.r(271645)),i=e.r(195057),c=e.r(8372),d=e.r(818581),u=e.r(718967),p=e.r(405550);e.r(233525);let h=e.r(388540),f=e.r(91949),m=e.r(573668),y=e.r(509396);function g(t){var a,r;let o,n,g,[b,x]=(0,l.useOptimistic)(f.IDLE_LINK_STATUS),_=(0,l.useRef)(null),{href:w,as:k,children:C,prefetch:j=null,passHref:N,replace:M,shallow:E,scroll:S,onClick:O,onMouseEnter:A,onTouchStart:P,legacyBehavior:L=!1,onNavigate:$,transitionTypes:T,ref:R,unstable_dynamicOnHover:I,...D}=t;o=C,L&&("string"==typeof o||"number"==typeof o)&&(o=(0,s.jsx)("a",{children:o}));let z=l.default.useContext(c.AppRouterContext),U=!1!==j,B=!1!==j?null===(r=j)||"auto"===r?y.FetchStrategy.PPR:y.FetchStrategy.Full:y.FetchStrategy.PPR,F="string"==typeof(a=k||w)?a:(0,i.formatUrl)(a);if(L){if(o?.$$typeof===Symbol.for("react.lazy"))throw Object.defineProperty(Error("`<Link legacyBehavior>` received a direct child that is either a Server Component, or JSX that was loaded with React.lazy(). This is not supported. Either remove legacyBehavior, or make the direct child a Client Component that renders the Link's `<a>` tag."),"__NEXT_ERROR_CODE",{value:"E863",enumerable:!1,configurable:!0});n=l.default.Children.only(o)}let V=L?n&&"object"==typeof n&&n.ref:R,H=l.default.useCallback(e=>(null!==z&&(_.current=(0,f.mountLinkInstance)(e,F,z,B,U,x)),()=>{_.current&&((0,f.unmountLinkForCurrentNavigation)(_.current),_.current=null),(0,f.unmountPrefetchableInstance)(e)}),[U,F,z,B,x]),K={ref:(0,d.useMergedRef)(H,V),onClick(t){L||"function"!=typeof O||O(t),L&&n.props&&"function"==typeof n.props.onClick&&n.props.onClick(t),!z||t.defaultPrevented||function(t,a,r,o,n,s,i){if("u">typeof window){let c,{nodeName:d}=t.currentTarget;if("A"===d.toUpperCase()&&((c=t.currentTarget.getAttribute("target"))&&"_self"!==c||t.metaKey||t.ctrlKey||t.shiftKey||t.altKey||t.nativeEvent&&2===t.nativeEvent.which)||t.currentTarget.hasAttribute("download"))return;if(!(0,m.isLocalURL)(a)){o&&(t.preventDefault(),location.replace(a));return}if(t.preventDefault(),s){let e=!1;if(s({preventDefault:()=>{e=!0}}),e)return}let{dispatchNavigateAction:u}=e.r(699781);l.default.startTransition(()=>{u(a,o?"replace":"push",!1===n?h.ScrollBehavior.NoScroll:h.ScrollBehavior.Default,r.current,i)})}}(t,F,_,M,S,$,T)},onMouseEnter(e){L||"function"!=typeof A||A(e),L&&n.props&&"function"==typeof n.props.onMouseEnter&&n.props.onMouseEnter(e),z&&U&&(0,f.onNavigationIntent)(e.currentTarget,!0===I)},onTouchStart:function(e){L||"function"!=typeof P||P(e),L&&n.props&&"function"==typeof n.props.onTouchStart&&n.props.onTouchStart(e),z&&U&&(0,f.onNavigationIntent)(e.currentTarget,!0===I)}};return(0,u.isAbsoluteUrl)(F)?K.href=F:L&&!N&&("a"!==n.type||"href"in n.props)||(K.href=(0,p.addBasePath)(F)),g=L?l.default.cloneElement(n,K):(0,s.jsx)("a",{...D,...K,children:o}),(0,s.jsx)(v.Provider,{value:b,children:g})}e.r(284508);let v=(0,l.createContext)(f.IDLE_LINK_STATUS),b=()=>(0,l.useContext)(v);("function"==typeof a.default||"object"==typeof a.default&&null!==a.default)&&void 0===a.default.__esModule&&(Object.defineProperty(a.default,"__esModule",{value:!0}),Object.assign(a.default,a),t.exports=a.default)},618566,(e,t,a)=>{t.exports=e.r(976562)},396661,505014,e=>{"use strict";let t=(...e)=>e.filter((e,t,a)=>!!e&&""!==e.trim()&&a.indexOf(e)===t).join(" ").trim();e.s(["mergeClasses",0,t],396661);var a=e.i(271645),r={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};let o=(0,a.createContext)({}),n=(0,a.forwardRef)(({color:e,size:n,strokeWidth:s,absoluteStrokeWidth:l,className:i="",children:c,iconNode:d,...u},p)=>{let{size:h=24,strokeWidth:f=2,absoluteStrokeWidth:m=!1,color:y="currentColor",className:g=""}=(0,a.useContext)(o)??{},v=l??m?24*Number(s??f)/Number(n??h):s??f;return(0,a.createElement)("svg",{ref:p,...r,width:n??h??r.width,height:n??h??r.height,stroke:e??y,strokeWidth:v,className:t("lucide",g,i),...!c&&!(e=>{for(let t in e)if(t.startsWith("aria-")||"role"===t||"title"===t)return!0;return!1})(u)&&{"aria-hidden":"true"},...u},[...d.map(([e,t])=>(0,a.createElement)(e,t)),...Array.isArray(c)?c:[c]])});e.s(["default",0,n],505014)},146387,456420,e=>{"use strict";var t=e.i(271645),a=e.i(396661);let r=e=>{let t=e.replace(/^([A-Z])|[\s-_]+(\w)/g,(e,t,a)=>a?a.toUpperCase():t.toLowerCase());return t.charAt(0).toUpperCase()+t.slice(1)};var o=e.i(505014);let n=(e,n)=>{let s=(0,t.forwardRef)(({className:s,...l},i)=>(0,t.createElement)(o.default,{ref:i,iconNode:n,className:(0,a.mergeClasses)(`lucide-${r(e).replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase()}`,`lucide-${e}`,s),...l}));return s.displayName=r(e),s};e.s(["default",0,n],456420);let s=n("building-2",[["path",{d:"M10 12h4",key:"a56b0p"}],["path",{d:"M10 8h4",key:"1sr2af"}],["path",{d:"M14 21v-3a2 2 0 0 0-4 0v3",key:"1rgiei"}],["path",{d:"M6 10H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2",key:"secmi2"}],["path",{d:"M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16",key:"16ra0t"}]]);e.s(["Building2",0,s],146387)},818581,(e,t,a)=>{"use strict";Object.defineProperty(a,"__esModule",{value:!0}),Object.defineProperty(a,"useMergedRef",{enumerable:!0,get:function(){return o}});let r=e.r(271645);function o(e,t){let a=(0,r.useRef)(null),o=(0,r.useRef)(null);return(0,r.useCallback)(r=>{if(null===r){let e=a.current;e&&(a.current=null,e());let t=o.current;t&&(o.current=null,t())}else e&&(a.current=n(e,r)),t&&(o.current=n(t,r))},[e,t])}function n(e,t){if("function"!=typeof e)return e.current=t,()=>{e.current=null};{let a=e(t);return"function"==typeof a?a:()=>e(null)}}("function"==typeof a.default||"object"==typeof a.default&&null!==a.default)&&void 0===a.default.__esModule&&(Object.defineProperty(a.default,"__esModule",{value:!0}),Object.assign(a.default,a),t.exports=a.default)},823482,e=>{"use strict";let t=(0,e.i(456420).default)("graduation-cap",[["path",{d:"M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z",key:"j76jl0"}],["path",{d:"M22 10v6",key:"1lu8f3"}],["path",{d:"M6 12.5V16a6 3 0 0 0 12 0v-3.5",key:"1r8lef"}]]);e.s(["GraduationCap",0,t],823482)},370812,e=>{"use strict";let t=(0,e.i(456420).default)("bell",[["path",{d:"M10.268 21a2 2 0 0 0 3.464 0",key:"vwvbt9"}],["path",{d:"M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326",key:"11g9vi"}]]);e.s(["Bell",0,t],370812)},716327,867927,e=>{"use strict";var t=e.i(456420);let a=(0,t.default)("chevron-down",[["path",{d:"m6 9 6 6 6-6",key:"qrunsl"}]]);e.s(["ChevronDown",0,a],716327);let r=(0,t.default)("chevron-right",[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]]);e.s(["ChevronRight",0,r],867927)},55677,e=>{"use strict";let t=(0,e.i(456420).default)("clipboard-list",[["rect",{width:"8",height:"4",x:"8",y:"2",rx:"1",ry:"1",key:"tgr4d6"}],["path",{d:"M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",key:"116196"}],["path",{d:"M12 11h4",key:"1jrz19"}],["path",{d:"M12 16h4",key:"n85exb"}],["path",{d:"M8 11h.01",key:"1dfujw"}],["path",{d:"M8 16h.01",key:"18s6g9"}]]);e.s(["ClipboardList",0,t],55677)},166794,e=>{"use strict";let t=(0,e.i(456420).default)("settings",[["path",{d:"M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915",key:"1i5ecw"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);e.s(["Settings",0,t],166794)},584026,e=>{"use strict";let t=(0,e.i(456420).default)("shield-check",[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]]);e.s(["ShieldCheck",0,t],584026)},779432,e=>{"use strict";let t=(0,e.i(456420).default)("activity",[["path",{d:"M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2",key:"169zse"}]]);e.s(["Activity",0,t],779432)},367784,593583,e=>{"use strict";var t=e.i(456420);let a=(0,t.default)("log-out",[["path",{d:"m16 17 5-5-5-5",key:"1bji2h"}],["path",{d:"M21 12H9",key:"dn1m92"}],["path",{d:"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",key:"1uf3rs"}]]);e.s(["LogOut",0,a],367784);let r=(0,t.default)("menu",[["path",{d:"M4 5h16",key:"1tepv9"}],["path",{d:"M4 12h16",key:"1lakjw"}],["path",{d:"M4 19h16",key:"1djgab"}]]);e.s(["Menu",0,r],593583)},749803,e=>{"use strict";let t=(0,e.i(456420).default)("chart-column",[["path",{d:"M3 3v16a2 2 0 0 0 2 2h16",key:"c24i48"}],["path",{d:"M18 17V9",key:"2bz60n"}],["path",{d:"M13 17V5",key:"1frdt8"}],["path",{d:"M8 17v-3",key:"17ska0"}]]);e.s(["BarChart3",0,t],749803)},566595,e=>{"use strict";let t=(0,e.i(456420).default)("search",[["path",{d:"m21 21-4.34-4.34",key:"14j7rj"}],["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}]]);e.s(["Search",0,t],566595)},263676,e=>{"use strict";let t=(0,e.i(456420).default)("x",[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]]);e.s(["X",0,t],263676)},705766,e=>{"use strict";let t,a;var r,o=e.i(271645);let n={data:""},s=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,l=/\/\*[^]*?\*\/|  +/g,i=/\n+/g,c=(e,t)=>{let a="",r="",o="";for(let n in e){let s=e[n];"@"==n[0]?"i"==n[1]?a=n+" "+s+";":r+="f"==n[1]?c(s,n):n+"{"+c(s,"k"==n[1]?"":t)+"}":"object"==typeof s?r+=c(s,t?t.replace(/([^,])+/g,e=>n.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,t=>/&/.test(t)?t.replace(/&/g,e):e?e+" "+t:t)):n):null!=s&&(n="-"==n[1]?n:n.replace(/[A-Z]/g,"-$&").toLowerCase(),o+=c.p?c.p(n,s):n+":"+s+";")}return a+(t&&o?t+"{"+o+"}":o)+r},d={},u=e=>{if("object"==typeof e){let t="";for(let a in e)t+=a+u(e[a]);return t}return e};function p(e){let t,a,r=this||{},o=e.call?e(r.p):e;return((e,t,a,r,o)=>{var n;let p=u(e),h=d[p]||(d[p]=(e=>{let t=0,a=11;for(;t<e.length;)a=101*a+e.charCodeAt(t++)>>>0;return"go"+a})(p));if(!d[h]){let t=p!==e?e:(e=>{let t,a,r=[{}];for(;t=s.exec(e.replace(l,""));)t[4]?r.shift():t[3]?(a=t[3].replace(i," ").trim(),r.unshift(r[0][a]=r[0][a]||{})):r[0][t[1]]=t[2].replace(i," ").trim();return r[0]})(e);d[h]=c(o?{["@keyframes "+h]:t}:t,a?"":"."+h)}let f=a&&d.g;return a&&(d.g=d[h]),n=d[h],f?t.data=t.data.replace(f,n):-1===t.data.indexOf(n)&&(t.data=r?n+t.data:t.data+n),h})(o.unshift?o.raw?(t=[].slice.call(arguments,1),a=r.p,o.reduce((e,r,o)=>{let n=t[o];if(n&&n.call){let e=n(a),t=e&&e.props&&e.props.className||/^go/.test(e)&&e;n=t?"."+t:e&&"object"==typeof e?e.props?"":c(e,""):!1===e?"":e}return e+r+(null==n?"":n)},"")):o.reduce((e,t)=>Object.assign(e,t&&t.call?t(r.p):t),{}):o,(e=>{if("object"==typeof window){let t=(e?e.querySelector("#_goober"):window._goober)||Object.assign(document.createElement("style"),{innerHTML:" ",id:"_goober"});return t.nonce=window.__nonce__,t.parentNode||(e||document.head).appendChild(t),t.firstChild}return e||n})(r.target),r.g,r.o,r.k)}p.bind({g:1});let h,f,m,y=p.bind({k:1});function g(e,t){let a=this||{};return function(){let r=arguments;function o(n,s){let l=Object.assign({},n),i=l.className||o.className;a.p=Object.assign({theme:f&&f()},l),a.o=/go\d/.test(i),l.className=p.apply(a,r)+(i?" "+i:""),t&&(l.ref=s);let c=e;return e[0]&&(c=l.as||e,delete l.as),m&&c[0]&&m(l),h(c,l)}return t?t(o):o}}var v=(e,t)=>"function"==typeof e?e(t):e,b=(t=0,()=>(++t).toString()),x=()=>{if(void 0===a&&"u">typeof window){let e=matchMedia("(prefers-reduced-motion: reduce)");a=!e||e.matches}return a},_="default",w=(e,t)=>{let{toastLimit:a}=e.settings;switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,a)};case 1:return{...e,toasts:e.toasts.map(e=>e.id===t.toast.id?{...e,...t.toast}:e)};case 2:let{toast:r}=t;return w(e,{type:+!!e.toasts.find(e=>e.id===r.id),toast:r});case 3:let{toastId:o}=t;return{...e,toasts:e.toasts.map(e=>e.id===o||void 0===o?{...e,dismissed:!0,visible:!1}:e)};case 4:return void 0===t.toastId?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(e=>e.id!==t.toastId)};case 5:return{...e,pausedAt:t.time};case 6:let n=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(e=>({...e,pauseDuration:e.pauseDuration+n}))}}},k=[],C={toasts:[],pausedAt:void 0,settings:{toastLimit:20}},j={},N=(e,t=_)=>{j[t]=w(j[t]||C,e),k.forEach(([e,a])=>{e===t&&a(j[t])})},M=e=>Object.keys(j).forEach(t=>N(e,t)),E=(e=_)=>t=>{N(t,e)},S={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},O=e=>(t,a)=>{let r,o=((e,t="blank",a)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:t,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...a,id:(null==a?void 0:a.id)||b()}))(t,e,a);return E(o.toasterId||(r=o.id,Object.keys(j).find(e=>j[e].toasts.some(e=>e.id===r))))({type:2,toast:o}),o.id},A=(e,t)=>O("blank")(e,t);A.error=O("error"),A.success=O("success"),A.loading=O("loading"),A.custom=O("custom"),A.dismiss=(e,t)=>{let a={type:3,toastId:e};t?E(t)(a):M(a)},A.dismissAll=e=>A.dismiss(void 0,e),A.remove=(e,t)=>{let a={type:4,toastId:e};t?E(t)(a):M(a)},A.removeAll=e=>A.remove(void 0,e),A.promise=(e,t,a)=>{let r=A.loading(t.loading,{...a,...null==a?void 0:a.loading});return"function"==typeof e&&(e=e()),e.then(e=>{let o=t.success?v(t.success,e):void 0;return o?A.success(o,{id:r,...a,...null==a?void 0:a.success}):A.dismiss(r),e}).catch(e=>{let o=t.error?v(t.error,e):void 0;o?A.error(o,{id:r,...a,...null==a?void 0:a.error}):A.dismiss(r)}),e};var P=1e3,L=y`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,$=y`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,T=y`
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

  animation: ${L} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${$} 0.15s ease-out forwards;
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
    animation: ${T} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,I=y`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,D=g("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||"#e0e0e0"};
  border-right-color: ${e=>e.primary||"#616161"};
  animation: ${I} 1s linear infinite;
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
}`,B=g("div")`
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
`,F=g("div")`
  position: absolute;
`,V=g("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,H=y`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,K=g("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${H} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,W=({toast:e})=>{let{icon:t,type:a,iconTheme:r}=e;return void 0!==t?"string"==typeof t?o.createElement(K,null,t):t:"blank"===a?null:o.createElement(V,null,o.createElement(D,{...r}),"loading"!==a&&o.createElement(F,null,"error"===a?o.createElement(R,{...r}):o.createElement(B,{...r})))},q=g("div")`
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
`,J=g("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,X=o.memo(({toast:e,position:t,style:a,children:r})=>{let n=e.height?((e,t)=>{let a=e.includes("top")?1:-1,[r,o]=x()?["0%{opacity:0;} 100%{opacity:1;}","0%{opacity:1;} 100%{opacity:0;}"]:[`
0% {transform: translate3d(0,${-200*a}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${-150*a}%,-1px) scale(.6); opacity:0;}
`];return{animation:t?`${y(r)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${y(o)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}})(e.position||t||"top-center",e.visible):{opacity:0},s=o.createElement(W,{toast:e}),l=o.createElement(J,{...e.ariaProps},v(e.message,e));return o.createElement(q,{className:e.className,style:{...n,...a,...e.style}},"function"==typeof r?r({icon:s,message:l}):o.createElement(o.Fragment,null,s,l))});r=o.createElement,c.p=void 0,h=r,f=void 0,m=void 0;var Z=({id:e,className:t,style:a,onHeightUpdate:r,children:n})=>{let s=o.useCallback(t=>{if(t){let a=()=>{r(e,t.getBoundingClientRect().height)};a(),new MutationObserver(a).observe(t,{subtree:!0,childList:!0,characterData:!0})}},[e,r]);return o.createElement("div",{ref:s,className:t,style:a},n)},Y=p`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`;e.s(["Toaster",0,({reverseOrder:e,position:t="top-center",toastOptions:a,gutter:r,children:n,toasterId:s,containerStyle:l,containerClassName:i})=>{let{toasts:c,handlers:d}=((e,t="default")=>{let{toasts:a,pausedAt:r}=((e={},t=_)=>{let[a,r]=(0,o.useState)(j[t]||C),n=(0,o.useRef)(j[t]);(0,o.useEffect)(()=>(n.current!==j[t]&&r(j[t]),k.push([t,r]),()=>{let e=k.findIndex(([e])=>e===t);e>-1&&k.splice(e,1)}),[t]);let s=a.toasts.map(t=>{var a,r,o;return{...e,...e[t.type],...t,removeDelay:t.removeDelay||(null==(a=e[t.type])?void 0:a.removeDelay)||(null==e?void 0:e.removeDelay),duration:t.duration||(null==(r=e[t.type])?void 0:r.duration)||(null==e?void 0:e.duration)||S[t.type],style:{...e.style,...null==(o=e[t.type])?void 0:o.style,...t.style}}});return{...a,toasts:s}})(e,t),n=(0,o.useRef)(new Map).current,s=(0,o.useCallback)((e,t=P)=>{if(n.has(e))return;let a=setTimeout(()=>{n.delete(e),l({type:4,toastId:e})},t);n.set(e,a)},[]);(0,o.useEffect)(()=>{if(r)return;let e=Date.now(),o=a.map(a=>{if(a.duration===1/0)return;let r=(a.duration||0)+a.pauseDuration-(e-a.createdAt);if(r<0){a.visible&&A.dismiss(a.id);return}return setTimeout(()=>A.dismiss(a.id,t),r)});return()=>{o.forEach(e=>e&&clearTimeout(e))}},[a,r,t]);let l=(0,o.useCallback)(E(t),[t]),i=(0,o.useCallback)(()=>{l({type:5,time:Date.now()})},[l]),c=(0,o.useCallback)((e,t)=>{l({type:1,toast:{id:e,height:t}})},[l]),d=(0,o.useCallback)(()=>{r&&l({type:6,time:Date.now()})},[r,l]),u=(0,o.useCallback)((e,t)=>{let{reverseOrder:r=!1,gutter:o=8,defaultPosition:n}=t||{},s=a.filter(t=>(t.position||n)===(e.position||n)&&t.height),l=s.findIndex(t=>t.id===e.id),i=s.filter((e,t)=>t<l&&e.visible).length;return s.filter(e=>e.visible).slice(...r?[i+1]:[0,i]).reduce((e,t)=>e+(t.height||0)+o,0)},[a]);return(0,o.useEffect)(()=>{a.forEach(e=>{if(e.dismissed)s(e.id,e.removeDelay);else{let t=n.get(e.id);t&&(clearTimeout(t),n.delete(e.id))}})},[a,s]),{toasts:a,handlers:{updateHeight:c,startPause:i,endPause:d,calculateOffset:u}}})(a,s);return o.createElement("div",{"data-rht-toaster":s||"",style:{position:"fixed",zIndex:9999,top:16,left:16,right:16,bottom:16,pointerEvents:"none",...l},className:i,onMouseEnter:d.startPause,onMouseLeave:d.endPause},c.map(a=>{let s,l,i=a.position||t,c=d.calculateOffset(a,{reverseOrder:e,gutter:r,defaultPosition:t}),u=(s=i.includes("top"),l=i.includes("center")?{justifyContent:"center"}:i.includes("right")?{justifyContent:"flex-end"}:{},{left:0,right:0,display:"flex",position:"absolute",transition:x()?void 0:"all 230ms cubic-bezier(.21,1.02,.73,1)",transform:`translateY(${c*(s?1:-1)}px)`,...s?{top:0}:{bottom:0},...l});return o.createElement(Z,{id:a.id,key:a.id,onHeightUpdate:d.updateHeight,className:a.visible?Y:"",style:u},"custom"===a.type?v(a.message,a):n?n(a):o.createElement(X,{toast:a,position:i}))}))},"default",0,A,"toast",0,A],705766)},920476,e=>{"use strict";async function t(e,t){let a=await fetch(e,t),r=await a.json().catch(()=>null);if(!a.ok)throw Error(r?.error||r?.message||`Request failed with ${a.status}`);return r}e.s(["apiJson",0,t,"errorMessage",0,function(e,t="Something went wrong"){return e instanceof Error?e.message:t}])},730274,e=>{"use strict";let t=(0,e.i(456420).default)("send",[["path",{d:"M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",key:"1ffxy3"}],["path",{d:"m21.854 2.147-10.94 10.939",key:"12cjpa"}]]);e.s(["Send",0,t],730274)},856423,e=>{"use strict";let t=(0,e.i(456420).default)("book-open",[["path",{d:"M12 7v14",key:"1akyts"}],["path",{d:"M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z",key:"ruj8y"}]]);e.s(["BookOpen",0,t],856423)},715192,e=>{"use strict";var t=e.i(843476),a=e.i(705766),r=e.i(271645),o=e.i(859015);e.s(["default",0,function(){let[e,n]=(0,r.useState)(!1),[s,l]=(0,r.useState)({school_name:"",school_code:"",principal_name:"",academic_year:"",email:"",phone:"",website:"",address:"",city:"",state:"",country:"",postal_code:"",logo_url:"",favicon_url:"",primary_color:"#04142E",secondary_color:"#D4AF37",principal_contact:"",owner_name:"",owner_contact:"",subscription_plan:"BASIC",subscription_status:"ACTIVE",ai_branding_name:""});(0,r.useEffect)(()=>{i()},[]);let i=async()=>{try{let e=await fetch("/api/settings/school-profile"),t=await e.json();t&&l({school_name:t.school_name||"",school_code:t.school_code||"",principal_name:t.principal_name||"",academic_year:t.academic_year||"",email:t.email||"",phone:t.phone||"",website:t.website||"",address:t.address||"",city:t.city||"",state:t.state||"",country:t.country||"",postal_code:t.postal_code||"",logo_url:t.school_logo||t.logo_url||"",favicon_url:t.school_favicon||t.favicon_url||"",primary_color:t.primary_color||"#04142E",secondary_color:t.secondary_color||"#D4AF37",principal_contact:t.principal_contact||"",owner_name:t.owner_name||"",owner_contact:t.owner_contact||"",subscription_plan:t.subscription_plan||"BASIC",subscription_status:t.subscription_status||"ACTIVE",ai_branding_name:t.ai_branding_name||""})}catch(e){console.error(e)}},c=async()=>{try{n(!0);let e=await fetch("/api/settings/school-profile",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(s)});if(!e.ok){let t=await e.json().catch(()=>({}));throw Error(t.error||"Failed to save school branding.")}a.default.success("School branding saved successfully")}catch(e){console.error(e),a.default.error(e instanceof Error?e.message:"Failed to save school branding.")}finally{n(!1)}};return(0,t.jsx)(o.default,{children:(0,t.jsxs)("div",{className:"space-y-6",children:[(0,t.jsxs)("div",{className:"bg-white p-8 rounded-3xl shadow",children:[(0,t.jsx)("h1",{className:"text-4xl font-bold",children:"School Branding"}),(0,t.jsx)("p",{className:"text-gray-500 mt-2",children:"Manage the school identity shown after login"})]}),(0,t.jsxs)("div",{className:"bg-white p-8 rounded-3xl shadow",children:[(0,t.jsxs)("div",{className:"grid md:grid-cols-2 gap-5",children:[(0,t.jsx)("input",{type:"text",placeholder:"School Name",value:s.school_name,onChange:e=>l({...s,school_name:e.target.value}),className:"border rounded-xl p-4"}),(0,t.jsx)("input",{type:"text",placeholder:"School Code",value:s.school_code,onChange:e=>l({...s,school_code:e.target.value}),className:"border rounded-xl p-4"}),(0,t.jsx)("input",{type:"text",placeholder:"Principal Name",value:s.principal_name,onChange:e=>l({...s,principal_name:e.target.value}),className:"border rounded-xl p-4"}),(0,t.jsx)("input",{type:"text",placeholder:"Academic Year",value:s.academic_year,onChange:e=>l({...s,academic_year:e.target.value}),className:"border rounded-xl p-4"}),(0,t.jsx)("input",{type:"email",placeholder:"Email",value:s.email,onChange:e=>l({...s,email:e.target.value}),className:"border rounded-xl p-4"}),(0,t.jsx)("input",{type:"text",placeholder:"Phone",value:s.phone,onChange:e=>l({...s,phone:e.target.value}),className:"border rounded-xl p-4"}),(0,t.jsx)("input",{type:"text",placeholder:"Website",value:s.website,onChange:e=>l({...s,website:e.target.value}),className:"border rounded-xl p-4"}),(0,t.jsx)("input",{type:"text",placeholder:"School Logo URL",value:s.logo_url,onChange:e=>l({...s,logo_url:e.target.value}),className:"border rounded-xl p-4"}),(0,t.jsx)("input",{type:"text",placeholder:"Favicon URL",value:s.favicon_url,onChange:e=>l({...s,favicon_url:e.target.value}),className:"border rounded-xl p-4"}),(0,t.jsx)("input",{type:"text",placeholder:"Primary Color",value:s.primary_color,onChange:e=>l({...s,primary_color:e.target.value}),className:"border rounded-xl p-4"}),(0,t.jsx)("input",{type:"text",placeholder:"Secondary Color",value:s.secondary_color,onChange:e=>l({...s,secondary_color:e.target.value}),className:"border rounded-xl p-4"}),(0,t.jsx)("input",{type:"text",placeholder:"City",value:s.city,onChange:e=>l({...s,city:e.target.value}),className:"border rounded-xl p-4"}),(0,t.jsx)("input",{type:"text",placeholder:"State",value:s.state,onChange:e=>l({...s,state:e.target.value}),className:"border rounded-xl p-4"}),(0,t.jsx)("input",{type:"text",placeholder:"Country",value:s.country,onChange:e=>l({...s,country:e.target.value}),className:"border rounded-xl p-4"}),(0,t.jsx)("input",{type:"text",placeholder:"Postal Code",value:s.postal_code,onChange:e=>l({...s,postal_code:e.target.value}),className:"border rounded-xl p-4"}),(0,t.jsx)("input",{type:"text",placeholder:"Principal Contact",value:s.principal_contact,onChange:e=>l({...s,principal_contact:e.target.value}),className:"border rounded-xl p-4"}),(0,t.jsx)("input",{type:"text",placeholder:"Owner Name",value:s.owner_name,onChange:e=>l({...s,owner_name:e.target.value}),className:"border rounded-xl p-4"}),(0,t.jsx)("input",{type:"text",placeholder:"Owner Contact",value:s.owner_contact,onChange:e=>l({...s,owner_contact:e.target.value}),className:"border rounded-xl p-4"}),(0,t.jsx)("input",{type:"text",placeholder:"School Assistant Name",value:s.ai_branding_name,onChange:e=>l({...s,ai_branding_name:e.target.value}),className:"border rounded-xl p-4"})]}),(0,t.jsx)("textarea",{placeholder:"School Address",value:s.address,onChange:e=>l({...s,address:e.target.value}),className:" border rounded-xl p-4 w-full mt-5 h-32 "}),(0,t.jsxs)("div",{className:"flex gap-4 mt-8",children:[(0,t.jsx)("button",{onClick:c,disabled:e,className:" bg-blue-600 text-white px-8 py-3 rounded-xl ",children:e?"Saving...":"Save Profile"}),(0,t.jsx)("button",{onClick:()=>window.location.reload(),className:" bg-gray-200 px-8 py-3 rounded-xl ",children:"Reset"})]})]})]})})}])}]);