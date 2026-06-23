(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,270904,e=>{"use strict";let t=(0,e.i(456420).default)("wallet",[["path",{d:"M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1",key:"18etb6"}],["path",{d:"M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4",key:"xoc0q4"}]]);e.s(["Wallet",0,t],270904)},195057,(e,t,a)=>{"use strict";Object.defineProperty(a,"__esModule",{value:!0});var r={formatUrl:function(){return l},formatWithValidation:function(){return d},urlObjectKeys:function(){return n}};for(var s in r)Object.defineProperty(a,s,{enumerable:!0,get:r[s]});let i=e.r(190809)._(e.r(998183)),o=/https?|ftp|gopher|file/;function l(e){let{auth:t,hostname:a}=e,r=e.protocol||"",s=e.pathname||"",l=e.hash||"",n=e.query||"",d=!1;t=t?encodeURIComponent(t).replace(/%3A/i,":")+"@":"",e.host?d=t+e.host:a&&(d=t+(~a.indexOf(":")?`[${a}]`:a),e.port&&(d+=":"+e.port)),n&&"object"==typeof n&&(n=String(i.urlQueryToSearchParams(n)));let c=e.search||n&&`?${n}`||"";return r&&!r.endsWith(":")&&(r+=":"),e.slashes||(!r||o.test(r))&&!1!==d?(d="//"+(d||""),s&&"/"!==s[0]&&(s="/"+s)):d||(d=""),l&&"#"!==l[0]&&(l="#"+l),c&&"?"!==c[0]&&(c="?"+c),s=s.replace(/[?#]/g,encodeURIComponent),c=c.replace("#","%23"),`${r}${d}${s}${c}${l}`}let n=["auth","hash","host","hostname","href","path","pathname","port","protocol","query","search","slashes"];function d(e){return l(e)}},573668,(e,t,a)=>{"use strict";Object.defineProperty(a,"__esModule",{value:!0}),Object.defineProperty(a,"isLocalURL",{enumerable:!0,get:function(){return i}});let r=e.r(718967),s=e.r(652817);function i(e){if(!(0,r.isAbsoluteUrl)(e))return!0;try{let t=(0,r.getLocationOrigin)(),a=new URL(e,t);return a.origin===t&&(0,s.hasBasePath)(a.pathname)}catch(e){return!1}}},284508,(e,t,a)=>{"use strict";Object.defineProperty(a,"__esModule",{value:!0}),Object.defineProperty(a,"errorOnce",{enumerable:!0,get:function(){return r}});let r=e=>{}},522016,(e,t,a)=>{"use strict";Object.defineProperty(a,"__esModule",{value:!0});var r={default:function(){return x},useLinkStatus:function(){return g}};for(var s in r)Object.defineProperty(a,s,{enumerable:!0,get:r[s]});let i=e.r(190809),o=e.r(843476),l=i._(e.r(271645)),n=e.r(195057),d=e.r(8372),c=e.r(818581),u=e.r(718967),p=e.r(405550);e.r(233525);let f=e.r(388540),m=e.r(91949),h=e.r(573668),b=e.r(509396);function x(t){var a,r;let s,i,x,[g,v]=(0,l.useOptimistic)(m.IDLE_LINK_STATUS),k=(0,l.useRef)(null),{href:w,as:j,children:N,prefetch:C=null,passHref:_,replace:E,shallow:M,scroll:S,onClick:A,onMouseEnter:O,onTouchStart:P,legacyBehavior:T=!1,onNavigate:R,transitionTypes:$,ref:L,unstable_dynamicOnHover:D,...z}=t;s=N,T&&("string"==typeof s||"number"==typeof s)&&(s=(0,o.jsx)("a",{children:s}));let I=l.default.useContext(d.AppRouterContext),U=!1!==C,B=!1!==C?null===(r=C)||"auto"===r?b.FetchStrategy.PPR:b.FetchStrategy.Full:b.FetchStrategy.PPR,W="string"==typeof(a=j||w)?a:(0,n.formatUrl)(a);if(T){if(s?.$$typeof===Symbol.for("react.lazy"))throw Object.defineProperty(Error("`<Link legacyBehavior>` received a direct child that is either a Server Component, or JSX that was loaded with React.lazy(). This is not supported. Either remove legacyBehavior, or make the direct child a Client Component that renders the Link's `<a>` tag."),"__NEXT_ERROR_CODE",{value:"E863",enumerable:!1,configurable:!0});i=l.default.Children.only(s)}let F=T?i&&"object"==typeof i&&i.ref:L,q=l.default.useCallback(e=>(null!==I&&(k.current=(0,m.mountLinkInstance)(e,W,I,B,U,v)),()=>{k.current&&((0,m.unmountLinkForCurrentNavigation)(k.current),k.current=null),(0,m.unmountPrefetchableInstance)(e)}),[U,W,I,B,v]),K={ref:(0,c.useMergedRef)(q,F),onClick(t){T||"function"!=typeof A||A(t),T&&i.props&&"function"==typeof i.props.onClick&&i.props.onClick(t),!I||t.defaultPrevented||function(t,a,r,s,i,o,n){if("u">typeof window){let d,{nodeName:c}=t.currentTarget;if("A"===c.toUpperCase()&&((d=t.currentTarget.getAttribute("target"))&&"_self"!==d||t.metaKey||t.ctrlKey||t.shiftKey||t.altKey||t.nativeEvent&&2===t.nativeEvent.which)||t.currentTarget.hasAttribute("download"))return;if(!(0,h.isLocalURL)(a)){s&&(t.preventDefault(),location.replace(a));return}if(t.preventDefault(),o){let e=!1;if(o({preventDefault:()=>{e=!0}}),e)return}let{dispatchNavigateAction:u}=e.r(699781);l.default.startTransition(()=>{u(a,s?"replace":"push",!1===i?f.ScrollBehavior.NoScroll:f.ScrollBehavior.Default,r.current,n)})}}(t,W,k,E,S,R,$)},onMouseEnter(e){T||"function"!=typeof O||O(e),T&&i.props&&"function"==typeof i.props.onMouseEnter&&i.props.onMouseEnter(e),I&&U&&(0,m.onNavigationIntent)(e.currentTarget,!0===D)},onTouchStart:function(e){T||"function"!=typeof P||P(e),T&&i.props&&"function"==typeof i.props.onTouchStart&&i.props.onTouchStart(e),I&&U&&(0,m.onNavigationIntent)(e.currentTarget,!0===D)}};return(0,u.isAbsoluteUrl)(W)?K.href=W:T&&!_&&("a"!==i.type||"href"in i.props)||(K.href=(0,p.addBasePath)(W)),x=T?l.default.cloneElement(i,K):(0,o.jsx)("a",{...z,...K,children:s}),(0,o.jsx)(y.Provider,{value:g,children:x})}e.r(284508);let y=(0,l.createContext)(m.IDLE_LINK_STATUS),g=()=>(0,l.useContext)(y);("function"==typeof a.default||"object"==typeof a.default&&null!==a.default)&&void 0===a.default.__esModule&&(Object.defineProperty(a.default,"__esModule",{value:!0}),Object.assign(a.default,a),t.exports=a.default)},618566,(e,t,a)=>{t.exports=e.r(976562)},396661,505014,e=>{"use strict";let t=(...e)=>e.filter((e,t,a)=>!!e&&""!==e.trim()&&a.indexOf(e)===t).join(" ").trim();e.s(["mergeClasses",0,t],396661);var a=e.i(271645),r={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};let s=(0,a.createContext)({}),i=(0,a.forwardRef)(({color:e,size:i,strokeWidth:o,absoluteStrokeWidth:l,className:n="",children:d,iconNode:c,...u},p)=>{let{size:f=24,strokeWidth:m=2,absoluteStrokeWidth:h=!1,color:b="currentColor",className:x=""}=(0,a.useContext)(s)??{},y=l??h?24*Number(o??m)/Number(i??f):o??m;return(0,a.createElement)("svg",{ref:p,...r,width:i??f??r.width,height:i??f??r.height,stroke:e??b,strokeWidth:y,className:t("lucide",x,n),...!d&&!(e=>{for(let t in e)if(t.startsWith("aria-")||"role"===t||"title"===t)return!0;return!1})(u)&&{"aria-hidden":"true"},...u},[...c.map(([e,t])=>(0,a.createElement)(e,t)),...Array.isArray(d)?d:[d]])});e.s(["default",0,i],505014)},146387,456420,e=>{"use strict";var t=e.i(271645),a=e.i(396661);let r=e=>{let t=e.replace(/^([A-Z])|[\s-_]+(\w)/g,(e,t,a)=>a?a.toUpperCase():t.toLowerCase());return t.charAt(0).toUpperCase()+t.slice(1)};var s=e.i(505014);let i=(e,i)=>{let o=(0,t.forwardRef)(({className:o,...l},n)=>(0,t.createElement)(s.default,{ref:n,iconNode:i,className:(0,a.mergeClasses)(`lucide-${r(e).replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase()}`,`lucide-${e}`,o),...l}));return o.displayName=r(e),o};e.s(["default",0,i],456420);let o=i("building-2",[["path",{d:"M10 12h4",key:"a56b0p"}],["path",{d:"M10 8h4",key:"1sr2af"}],["path",{d:"M14 21v-3a2 2 0 0 0-4 0v3",key:"1rgiei"}],["path",{d:"M6 10H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2",key:"secmi2"}],["path",{d:"M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16",key:"16ra0t"}]]);e.s(["Building2",0,o],146387)},818581,(e,t,a)=>{"use strict";Object.defineProperty(a,"__esModule",{value:!0}),Object.defineProperty(a,"useMergedRef",{enumerable:!0,get:function(){return s}});let r=e.r(271645);function s(e,t){let a=(0,r.useRef)(null),s=(0,r.useRef)(null);return(0,r.useCallback)(r=>{if(null===r){let e=a.current;e&&(a.current=null,e());let t=s.current;t&&(s.current=null,t())}else e&&(a.current=i(e,r)),t&&(s.current=i(t,r))},[e,t])}function i(e,t){if("function"!=typeof e)return e.current=t,()=>{e.current=null};{let a=e(t);return"function"==typeof a?a:()=>e(null)}}("function"==typeof a.default||"object"==typeof a.default&&null!==a.default)&&void 0===a.default.__esModule&&(Object.defineProperty(a.default,"__esModule",{value:!0}),Object.assign(a.default,a),t.exports=a.default)},823482,e=>{"use strict";let t=(0,e.i(456420).default)("graduation-cap",[["path",{d:"M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z",key:"j76jl0"}],["path",{d:"M22 10v6",key:"1lu8f3"}],["path",{d:"M6 12.5V16a6 3 0 0 0 12 0v-3.5",key:"1r8lef"}]]);e.s(["GraduationCap",0,t],823482)},370812,e=>{"use strict";let t=(0,e.i(456420).default)("bell",[["path",{d:"M10.268 21a2 2 0 0 0 3.464 0",key:"vwvbt9"}],["path",{d:"M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326",key:"11g9vi"}]]);e.s(["Bell",0,t],370812)},716327,867927,e=>{"use strict";var t=e.i(456420);let a=(0,t.default)("chevron-down",[["path",{d:"m6 9 6 6 6-6",key:"qrunsl"}]]);e.s(["ChevronDown",0,a],716327);let r=(0,t.default)("chevron-right",[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]]);e.s(["ChevronRight",0,r],867927)},55677,e=>{"use strict";let t=(0,e.i(456420).default)("clipboard-list",[["rect",{width:"8",height:"4",x:"8",y:"2",rx:"1",ry:"1",key:"tgr4d6"}],["path",{d:"M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",key:"116196"}],["path",{d:"M12 11h4",key:"1jrz19"}],["path",{d:"M12 16h4",key:"n85exb"}],["path",{d:"M8 11h.01",key:"1dfujw"}],["path",{d:"M8 16h.01",key:"18s6g9"}]]);e.s(["ClipboardList",0,t],55677)},166794,e=>{"use strict";let t=(0,e.i(456420).default)("settings",[["path",{d:"M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915",key:"1i5ecw"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);e.s(["Settings",0,t],166794)},584026,e=>{"use strict";let t=(0,e.i(456420).default)("shield-check",[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]]);e.s(["ShieldCheck",0,t],584026)},779432,e=>{"use strict";let t=(0,e.i(456420).default)("activity",[["path",{d:"M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2",key:"169zse"}]]);e.s(["Activity",0,t],779432)},367784,593583,e=>{"use strict";var t=e.i(456420);let a=(0,t.default)("log-out",[["path",{d:"m16 17 5-5-5-5",key:"1bji2h"}],["path",{d:"M21 12H9",key:"dn1m92"}],["path",{d:"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",key:"1uf3rs"}]]);e.s(["LogOut",0,a],367784);let r=(0,t.default)("menu",[["path",{d:"M4 5h16",key:"1tepv9"}],["path",{d:"M4 12h16",key:"1lakjw"}],["path",{d:"M4 19h16",key:"1djgab"}]]);e.s(["Menu",0,r],593583)},749803,e=>{"use strict";let t=(0,e.i(456420).default)("chart-column",[["path",{d:"M3 3v16a2 2 0 0 0 2 2h16",key:"c24i48"}],["path",{d:"M18 17V9",key:"2bz60n"}],["path",{d:"M13 17V5",key:"1frdt8"}],["path",{d:"M8 17v-3",key:"17ska0"}]]);e.s(["BarChart3",0,t],749803)},566595,e=>{"use strict";let t=(0,e.i(456420).default)("search",[["path",{d:"m21 21-4.34-4.34",key:"14j7rj"}],["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}]]);e.s(["Search",0,t],566595)},263676,e=>{"use strict";let t=(0,e.i(456420).default)("x",[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]]);e.s(["X",0,t],263676)},705766,e=>{"use strict";let t,a;var r,s=e.i(271645);let i={data:""},o=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,l=/\/\*[^]*?\*\/|  +/g,n=/\n+/g,d=(e,t)=>{let a="",r="",s="";for(let i in e){let o=e[i];"@"==i[0]?"i"==i[1]?a=i+" "+o+";":r+="f"==i[1]?d(o,i):i+"{"+d(o,"k"==i[1]?"":t)+"}":"object"==typeof o?r+=d(o,t?t.replace(/([^,])+/g,e=>i.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,t=>/&/.test(t)?t.replace(/&/g,e):e?e+" "+t:t)):i):null!=o&&(i="-"==i[1]?i:i.replace(/[A-Z]/g,"-$&").toLowerCase(),s+=d.p?d.p(i,o):i+":"+o+";")}return a+(t&&s?t+"{"+s+"}":s)+r},c={},u=e=>{if("object"==typeof e){let t="";for(let a in e)t+=a+u(e[a]);return t}return e};function p(e){let t,a,r=this||{},s=e.call?e(r.p):e;return((e,t,a,r,s)=>{var i;let p=u(e),f=c[p]||(c[p]=(e=>{let t=0,a=11;for(;t<e.length;)a=101*a+e.charCodeAt(t++)>>>0;return"go"+a})(p));if(!c[f]){let t=p!==e?e:(e=>{let t,a,r=[{}];for(;t=o.exec(e.replace(l,""));)t[4]?r.shift():t[3]?(a=t[3].replace(n," ").trim(),r.unshift(r[0][a]=r[0][a]||{})):r[0][t[1]]=t[2].replace(n," ").trim();return r[0]})(e);c[f]=d(s?{["@keyframes "+f]:t}:t,a?"":"."+f)}let m=a&&c.g;return a&&(c.g=c[f]),i=c[f],m?t.data=t.data.replace(m,i):-1===t.data.indexOf(i)&&(t.data=r?i+t.data:t.data+i),f})(s.unshift?s.raw?(t=[].slice.call(arguments,1),a=r.p,s.reduce((e,r,s)=>{let i=t[s];if(i&&i.call){let e=i(a),t=e&&e.props&&e.props.className||/^go/.test(e)&&e;i=t?"."+t:e&&"object"==typeof e?e.props?"":d(e,""):!1===e?"":e}return e+r+(null==i?"":i)},"")):s.reduce((e,t)=>Object.assign(e,t&&t.call?t(r.p):t),{}):s,(e=>{if("object"==typeof window){let t=(e?e.querySelector("#_goober"):window._goober)||Object.assign(document.createElement("style"),{innerHTML:" ",id:"_goober"});return t.nonce=window.__nonce__,t.parentNode||(e||document.head).appendChild(t),t.firstChild}return e||i})(r.target),r.g,r.o,r.k)}p.bind({g:1});let f,m,h,b=p.bind({k:1});function x(e,t){let a=this||{};return function(){let r=arguments;function s(i,o){let l=Object.assign({},i),n=l.className||s.className;a.p=Object.assign({theme:m&&m()},l),a.o=/go\d/.test(n),l.className=p.apply(a,r)+(n?" "+n:""),t&&(l.ref=o);let d=e;return e[0]&&(d=l.as||e,delete l.as),h&&d[0]&&h(l),f(d,l)}return t?t(s):s}}var y=(e,t)=>"function"==typeof e?e(t):e,g=(t=0,()=>(++t).toString()),v=()=>{if(void 0===a&&"u">typeof window){let e=matchMedia("(prefers-reduced-motion: reduce)");a=!e||e.matches}return a},k="default",w=(e,t)=>{let{toastLimit:a}=e.settings;switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,a)};case 1:return{...e,toasts:e.toasts.map(e=>e.id===t.toast.id?{...e,...t.toast}:e)};case 2:let{toast:r}=t;return w(e,{type:+!!e.toasts.find(e=>e.id===r.id),toast:r});case 3:let{toastId:s}=t;return{...e,toasts:e.toasts.map(e=>e.id===s||void 0===s?{...e,dismissed:!0,visible:!1}:e)};case 4:return void 0===t.toastId?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(e=>e.id!==t.toastId)};case 5:return{...e,pausedAt:t.time};case 6:let i=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(e=>({...e,pauseDuration:e.pauseDuration+i}))}}},j=[],N={toasts:[],pausedAt:void 0,settings:{toastLimit:20}},C={},_=(e,t=k)=>{C[t]=w(C[t]||N,e),j.forEach(([e,a])=>{e===t&&a(C[t])})},E=e=>Object.keys(C).forEach(t=>_(e,t)),M=(e=k)=>t=>{_(t,e)},S={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},A=e=>(t,a)=>{let r,s=((e,t="blank",a)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:t,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...a,id:(null==a?void 0:a.id)||g()}))(t,e,a);return M(s.toasterId||(r=s.id,Object.keys(C).find(e=>C[e].toasts.some(e=>e.id===r))))({type:2,toast:s}),s.id},O=(e,t)=>A("blank")(e,t);O.error=A("error"),O.success=A("success"),O.loading=A("loading"),O.custom=A("custom"),O.dismiss=(e,t)=>{let a={type:3,toastId:e};t?M(t)(a):E(a)},O.dismissAll=e=>O.dismiss(void 0,e),O.remove=(e,t)=>{let a={type:4,toastId:e};t?M(t)(a):E(a)},O.removeAll=e=>O.remove(void 0,e),O.promise=(e,t,a)=>{let r=O.loading(t.loading,{...a,...null==a?void 0:a.loading});return"function"==typeof e&&(e=e()),e.then(e=>{let s=t.success?y(t.success,e):void 0;return s?O.success(s,{id:r,...a,...null==a?void 0:a.success}):O.dismiss(r),e}).catch(e=>{let s=t.error?y(t.error,e):void 0;s?O.error(s,{id:r,...a,...null==a?void 0:a.error}):O.dismiss(r)}),e};var P=1e3,T=b`
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
}`,$=b`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,L=x("div")`
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
    animation: ${$} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,D=b`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,z=x("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||"#e0e0e0"};
  border-right-color: ${e=>e.primary||"#616161"};
  animation: ${D} 1s linear infinite;
`,I=b`
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
}`,B=x("div")`
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
`,W=x("div")`
  position: absolute;
`,F=x("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,q=b`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,K=x("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${q} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,V=({toast:e})=>{let{icon:t,type:a,iconTheme:r}=e;return void 0!==t?"string"==typeof t?s.createElement(K,null,t):t:"blank"===a?null:s.createElement(F,null,s.createElement(z,{...r}),"loading"!==a&&s.createElement(W,null,"error"===a?s.createElement(L,{...r}):s.createElement(B,{...r})))},H=x("div")`
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
`,Q=x("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,J=s.memo(({toast:e,position:t,style:a,children:r})=>{let i=e.height?((e,t)=>{let a=e.includes("top")?1:-1,[r,s]=v()?["0%{opacity:0;} 100%{opacity:1;}","0%{opacity:1;} 100%{opacity:0;}"]:[`
0% {transform: translate3d(0,${-200*a}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${-150*a}%,-1px) scale(.6); opacity:0;}
`];return{animation:t?`${b(r)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${b(s)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}})(e.position||t||"top-center",e.visible):{opacity:0},o=s.createElement(V,{toast:e}),l=s.createElement(Q,{...e.ariaProps},y(e.message,e));return s.createElement(H,{className:e.className,style:{...i,...a,...e.style}},"function"==typeof r?r({icon:o,message:l}):s.createElement(s.Fragment,null,o,l))});r=s.createElement,d.p=void 0,f=r,m=void 0,h=void 0;var X=({id:e,className:t,style:a,onHeightUpdate:r,children:i})=>{let o=s.useCallback(t=>{if(t){let a=()=>{r(e,t.getBoundingClientRect().height)};a(),new MutationObserver(a).observe(t,{subtree:!0,childList:!0,characterData:!0})}},[e,r]);return s.createElement("div",{ref:o,className:t,style:a},i)},Z=p`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`;e.s(["Toaster",0,({reverseOrder:e,position:t="top-center",toastOptions:a,gutter:r,children:i,toasterId:o,containerStyle:l,containerClassName:n})=>{let{toasts:d,handlers:c}=((e,t="default")=>{let{toasts:a,pausedAt:r}=((e={},t=k)=>{let[a,r]=(0,s.useState)(C[t]||N),i=(0,s.useRef)(C[t]);(0,s.useEffect)(()=>(i.current!==C[t]&&r(C[t]),j.push([t,r]),()=>{let e=j.findIndex(([e])=>e===t);e>-1&&j.splice(e,1)}),[t]);let o=a.toasts.map(t=>{var a,r,s;return{...e,...e[t.type],...t,removeDelay:t.removeDelay||(null==(a=e[t.type])?void 0:a.removeDelay)||(null==e?void 0:e.removeDelay),duration:t.duration||(null==(r=e[t.type])?void 0:r.duration)||(null==e?void 0:e.duration)||S[t.type],style:{...e.style,...null==(s=e[t.type])?void 0:s.style,...t.style}}});return{...a,toasts:o}})(e,t),i=(0,s.useRef)(new Map).current,o=(0,s.useCallback)((e,t=P)=>{if(i.has(e))return;let a=setTimeout(()=>{i.delete(e),l({type:4,toastId:e})},t);i.set(e,a)},[]);(0,s.useEffect)(()=>{if(r)return;let e=Date.now(),s=a.map(a=>{if(a.duration===1/0)return;let r=(a.duration||0)+a.pauseDuration-(e-a.createdAt);if(r<0){a.visible&&O.dismiss(a.id);return}return setTimeout(()=>O.dismiss(a.id,t),r)});return()=>{s.forEach(e=>e&&clearTimeout(e))}},[a,r,t]);let l=(0,s.useCallback)(M(t),[t]),n=(0,s.useCallback)(()=>{l({type:5,time:Date.now()})},[l]),d=(0,s.useCallback)((e,t)=>{l({type:1,toast:{id:e,height:t}})},[l]),c=(0,s.useCallback)(()=>{r&&l({type:6,time:Date.now()})},[r,l]),u=(0,s.useCallback)((e,t)=>{let{reverseOrder:r=!1,gutter:s=8,defaultPosition:i}=t||{},o=a.filter(t=>(t.position||i)===(e.position||i)&&t.height),l=o.findIndex(t=>t.id===e.id),n=o.filter((e,t)=>t<l&&e.visible).length;return o.filter(e=>e.visible).slice(...r?[n+1]:[0,n]).reduce((e,t)=>e+(t.height||0)+s,0)},[a]);return(0,s.useEffect)(()=>{a.forEach(e=>{if(e.dismissed)o(e.id,e.removeDelay);else{let t=i.get(e.id);t&&(clearTimeout(t),i.delete(e.id))}})},[a,o]),{toasts:a,handlers:{updateHeight:d,startPause:n,endPause:c,calculateOffset:u}}})(a,o);return s.createElement("div",{"data-rht-toaster":o||"",style:{position:"fixed",zIndex:9999,top:16,left:16,right:16,bottom:16,pointerEvents:"none",...l},className:n,onMouseEnter:c.startPause,onMouseLeave:c.endPause},d.map(a=>{let o,l,n=a.position||t,d=c.calculateOffset(a,{reverseOrder:e,gutter:r,defaultPosition:t}),u=(o=n.includes("top"),l=n.includes("center")?{justifyContent:"center"}:n.includes("right")?{justifyContent:"flex-end"}:{},{left:0,right:0,display:"flex",position:"absolute",transition:v()?void 0:"all 230ms cubic-bezier(.21,1.02,.73,1)",transform:`translateY(${d*(o?1:-1)}px)`,...o?{top:0}:{bottom:0},...l});return s.createElement(X,{id:a.id,key:a.id,onHeightUpdate:c.updateHeight,className:a.visible?Z:"",style:u},"custom"===a.type?y(a.message,a):i?i(a):s.createElement(J,{toast:a,position:n}))}))},"default",0,O,"toast",0,O],705766)},920476,e=>{"use strict";async function t(e,t){let a=await fetch(e,t),r=await a.json().catch(()=>null);if(!a.ok)throw Error(r?.error||r?.message||`Request failed with ${a.status}`);return r}e.s(["apiJson",0,t,"errorMessage",0,function(e,t="Something went wrong"){return e instanceof Error?e.message:t}])},856423,e=>{"use strict";let t=(0,e.i(456420).default)("book-open",[["path",{d:"M12 7v14",key:"1akyts"}],["path",{d:"M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z",key:"ruj8y"}]]);e.s(["BookOpen",0,t],856423)},730274,e=>{"use strict";let t=(0,e.i(456420).default)("send",[["path",{d:"M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",key:"1ffxy3"}],["path",{d:"m21.854 2.147-10.94 10.939",key:"12cjpa"}]]);e.s(["Send",0,t],730274)},462047,e=>{"use strict";var t=e.i(705766);e.s(["notify",0,{success:e=>t.default.success(e),error:e=>t.default.error(e),warning:e=>(0,t.default)(e,{icon:"⚠️"}),info:e=>(0,t.default)(e,{icon:"ℹ️"})}])},425453,e=>{"use strict";var t=e.i(843476),a=e.i(271645),r=e.i(859015),s=e.i(462047);function i({title:e,rows:a}){return(0,t.jsxs)("div",{className:"rounded-[8px] border border-slate-200 bg-white p-6 shadow",children:[(0,t.jsx)("h2",{className:"text-2xl font-black text-slate-950",children:e}),(0,t.jsx)("div",{className:"mt-4 space-y-3",children:a.length?a.map(e=>(0,t.jsxs)("div",{className:"rounded-[8px] border border-slate-200 p-4",children:[(0,t.jsxs)("div",{className:"flex flex-wrap items-center justify-between gap-2",children:[(0,t.jsxs)("p",{className:"font-black text-slate-950",children:["#",e.id," ",e.template_name]}),(0,t.jsx)("span",{className:"rounded-[8px] bg-amber-50 px-3 py-1 text-xs font-black text-amber-800",children:e.delivery_status||e.status})]}),(0,t.jsxs)("p",{className:"mt-2 text-sm font-semibold text-slate-700",children:["Recipient:"," ",e.recipient_masked||"-"]}),e.last_error?(0,t.jsx)("p",{className:"mt-2 break-words text-sm font-semibold text-red-700",children:e.last_error}):null]},e.id)):(0,t.jsx)("p",{className:"rounded-[8px] border border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-600",children:"No records found."})})]})}e.s(["default",0,function(){let[e,o]=(0,a.useState)(null),[l,n]=(0,a.useState)(!0),[d,c]=(0,a.useState)(!1),[u,p]=(0,a.useState)(""),f=e?.provider||{},m=e?.stats||{},h=e?.templates||[],b=f.envEnabled?f.databaseEnabled?f.hasApiKey?f.hasBaseUrl?f.configured?"Ready":"Configuration required":"Base URL missing":"API key missing":"Disabled in settings":"Disabled by environment",x=async()=>{n(!0);try{let e=await fetch("/api/settings/whatsapp"),t=await e.json();if(!e.ok)throw Error(t.error||"Failed to load WhatsApp settings");o(t)}catch(e){s.notify.error(e instanceof Error?e.message:"Failed to load WhatsApp settings")}finally{n(!1)}};(0,a.useEffect)(()=>{let e=window.setTimeout(()=>{x()},0);return()=>window.clearTimeout(e)},[]);let y=async(e,t)=>{c(!0);try{let a=await fetch("/api/settings/whatsapp",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)}),r=await a.json();if(!a.ok)throw Error(r.error||"WhatsApp action failed");o(r.dashboard),s.notify.success(t)}catch(e){s.notify.error(e instanceof Error?e.message:"WhatsApp action failed")}finally{c(!1)}};return(0,t.jsx)(r.default,{children:(0,t.jsxs)("div",{className:"space-y-6",children:[(0,t.jsxs)("section",{className:"rounded-[8px] border border-amber-300 bg-slate-950 p-8 text-white shadow-xl",children:[(0,t.jsx)("p",{className:"text-xs font-black uppercase tracking-[0.14em] text-amber-300",children:"Notification Service"}),(0,t.jsxs)("div",{className:"mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("h1",{className:"text-4xl font-black tracking-normal",children:"WhatsApp Enterprise"}),(0,t.jsx)("p",{className:"mt-2 max-w-3xl text-sm font-semibold leading-6 text-slate-200",children:"Workflow-triggered messages for admissions, invoices, payments, homework, exam schedules, attendance reports, and fee due reminders."})]}),(0,t.jsxs)("div",{className:"rounded-[8px] border border-amber-400 bg-white px-5 py-4 text-slate-950",children:[(0,t.jsx)("p",{className:"text-xs font-black uppercase text-amber-700",children:"Provider Status"}),(0,t.jsx)("p",{className:"mt-1 text-2xl font-black",children:b})]})]})]}),(0,t.jsx)("section",{className:"grid gap-4 md:grid-cols-2 xl:grid-cols-5",children:[["Total","total_messages"],["Sent","sent_messages"],["Queued","queued_messages"],["Failed","failed_messages"],["Needs Config","config_required_messages"]].map(([e,a])=>(0,t.jsxs)("div",{className:"rounded-[8px] border border-slate-200 bg-white p-5 shadow",children:[(0,t.jsx)("p",{className:"text-xs font-black uppercase text-slate-500",children:e}),(0,t.jsx)("p",{className:"mt-3 text-4xl font-black text-slate-950",children:Number(m?.[a]||0)})]},a))}),(0,t.jsxs)("section",{className:"grid gap-6 xl:grid-cols-[1fr_1.2fr]",children:[(0,t.jsxs)("div",{className:"rounded-[8px] border border-slate-200 bg-white p-6 shadow",children:[(0,t.jsxs)("div",{className:"flex items-start justify-between gap-4",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("h2",{className:"text-2xl font-black text-slate-950",children:"Provider Controls"}),(0,t.jsx)("p",{className:"mt-1 text-sm font-semibold text-slate-600",children:"Secrets are loaded from environment variables only."})]}),(0,t.jsx)("button",{className:"rounded-[8px] border border-slate-300 px-4 py-2 text-sm font-black text-slate-950",disabled:l,onClick:x,children:"Refresh"})]}),(0,t.jsx)("div",{className:"mt-5 grid gap-3 sm:grid-cols-2",children:[["Environment Enabled",f.envEnabled],["Settings Enabled",f.databaseEnabled],["API Key Present",f.hasApiKey],["Base URL Present",f.hasBaseUrl]].map(([e,a])=>(0,t.jsxs)("div",{className:`rounded-[8px] border p-4 ${a?"border-amber-300 bg-amber-50 text-slate-950":"border-slate-200 bg-white text-slate-600"}`,children:[(0,t.jsx)("p",{className:"text-xs font-black uppercase",children:String(e)}),(0,t.jsx)("p",{className:"mt-1 text-xl font-black",children:a?"Yes":"No"})]},String(e)))}),(0,t.jsxs)("div",{className:"mt-5 flex flex-wrap gap-3",children:[(0,t.jsx)("button",{className:"rounded-[8px] bg-slate-950 px-5 py-3 text-sm font-black text-white disabled:opacity-50",disabled:d,onClick:()=>y({action:"set_enabled",enabled:!0},"WhatsApp enabled"),children:"Enable"}),(0,t.jsx)("button",{className:"rounded-[8px] border border-amber-300 bg-amber-50 px-5 py-3 text-sm font-black text-slate-950 disabled:opacity-50",disabled:d,onClick:()=>y({action:"set_enabled",enabled:!1},"WhatsApp disabled"),children:"Disable"}),(0,t.jsx)("button",{className:"rounded-[8px] border border-slate-300 px-5 py-3 text-sm font-black text-slate-950 disabled:opacity-50",disabled:d,onClick:()=>y({action:"retry",limit:25},"Retry queue processed"),children:"Process Retry Queue"})]})]}),(0,t.jsxs)("div",{className:"rounded-[8px] border border-slate-200 bg-white p-6 shadow",children:[(0,t.jsx)("h2",{className:"text-2xl font-black text-slate-950",children:"Test Message"}),(0,t.jsx)("p",{className:"mt-1 text-sm font-semibold text-slate-600",children:"Sends through the same queue and audit trail as production workflow messages."}),(0,t.jsxs)("div",{className:"mt-5 flex flex-col gap-3 lg:flex-row",children:[(0,t.jsx)("input",{className:"min-w-0 flex-1 rounded-[8px] border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-950 outline-none focus:border-amber-500",placeholder:"Recipient phone number",value:u,onChange:e=>p(e.target.value)}),(0,t.jsx)("button",{className:"rounded-[8px] bg-slate-950 px-5 py-3 text-sm font-black text-white disabled:opacity-50",disabled:d||!u.trim(),onClick:()=>y({action:"test",recipient:u,template_name:"student_created"},"Test message queued"),children:"Send Test"})]})]})]}),(0,t.jsxs)("section",{className:"rounded-[8px] border border-slate-200 bg-white p-6 shadow",children:[(0,t.jsx)("div",{className:"flex items-center justify-between gap-4",children:(0,t.jsxs)("div",{children:[(0,t.jsx)("h2",{className:"text-2xl font-black text-slate-950",children:"Template Registry"}),(0,t.jsx)("p",{className:"mt-1 text-sm font-semibold text-slate-600",children:"Database-backed templates mapped to ERP workflow triggers."})]})}),(0,t.jsx)("div",{className:"mt-5 grid gap-4 lg:grid-cols-2",children:h.map(e=>(0,t.jsxs)("div",{className:"rounded-[8px] border border-slate-200 p-4",children:[(0,t.jsxs)("div",{className:"flex items-start justify-between gap-3",children:[(0,t.jsxs)("div",{className:"min-w-0",children:[(0,t.jsx)("p",{className:"break-words text-lg font-black text-slate-950",children:e.template_name}),(0,t.jsx)("p",{className:"mt-1 text-xs font-black uppercase text-amber-700",children:e.trigger_event})]}),(0,t.jsx)("button",{className:"shrink-0 rounded-[8px] border border-amber-300 bg-amber-50 px-3 py-2 text-xs font-black text-slate-950 disabled:opacity-50",disabled:d,onClick:()=>y({action:"toggle_template",template_name:e.template_name,enabled:!e.is_enabled},"Template updated"),children:e.is_enabled?"Enabled":"Disabled"})]}),(0,t.jsx)("p",{className:"mt-3 text-sm font-semibold leading-6 text-slate-700",children:e.description}),(0,t.jsxs)("p",{className:"mt-3 break-words text-xs font-bold text-slate-500",children:["Variables:"," ",Array.isArray(e.variables)?e.variables.join(", "):"-"]})]},e.template_name))})]}),(0,t.jsxs)("section",{className:"grid gap-6 xl:grid-cols-2",children:[(0,t.jsx)(i,{title:"Failed Messages",rows:e?.failedMessages||[]}),(0,t.jsx)(i,{title:"Retry Queue",rows:e?.retryQueue||[]})]})]})})}])}]);