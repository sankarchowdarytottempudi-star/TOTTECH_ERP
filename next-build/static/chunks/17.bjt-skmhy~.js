(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,270904,e=>{"use strict";let t=(0,e.i(456420).default)("wallet",[["path",{d:"M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1",key:"18etb6"}],["path",{d:"M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4",key:"xoc0q4"}]]);e.s(["Wallet",0,t],270904)},195057,(e,t,a)=>{"use strict";Object.defineProperty(a,"__esModule",{value:!0});var r={formatUrl:function(){return l},formatWithValidation:function(){return c},urlObjectKeys:function(){return n}};for(var s in r)Object.defineProperty(a,s,{enumerable:!0,get:r[s]});let i=e.r(190809)._(e.r(998183)),o=/https?|ftp|gopher|file/;function l(e){let{auth:t,hostname:a}=e,r=e.protocol||"",s=e.pathname||"",l=e.hash||"",n=e.query||"",c=!1;t=t?encodeURIComponent(t).replace(/%3A/i,":")+"@":"",e.host?c=t+e.host:a&&(c=t+(~a.indexOf(":")?`[${a}]`:a),e.port&&(c+=":"+e.port)),n&&"object"==typeof n&&(n=String(i.urlQueryToSearchParams(n)));let d=e.search||n&&`?${n}`||"";return r&&!r.endsWith(":")&&(r+=":"),e.slashes||(!r||o.test(r))&&!1!==c?(c="//"+(c||""),s&&"/"!==s[0]&&(s="/"+s)):c||(c=""),l&&"#"!==l[0]&&(l="#"+l),d&&"?"!==d[0]&&(d="?"+d),s=s.replace(/[?#]/g,encodeURIComponent),d=d.replace("#","%23"),`${r}${c}${s}${d}${l}`}let n=["auth","hash","host","hostname","href","path","pathname","port","protocol","query","search","slashes"];function c(e){return l(e)}},573668,(e,t,a)=>{"use strict";Object.defineProperty(a,"__esModule",{value:!0}),Object.defineProperty(a,"isLocalURL",{enumerable:!0,get:function(){return i}});let r=e.r(718967),s=e.r(652817);function i(e){if(!(0,r.isAbsoluteUrl)(e))return!0;try{let t=(0,r.getLocationOrigin)(),a=new URL(e,t);return a.origin===t&&(0,s.hasBasePath)(a.pathname)}catch(e){return!1}}},284508,(e,t,a)=>{"use strict";Object.defineProperty(a,"__esModule",{value:!0}),Object.defineProperty(a,"errorOnce",{enumerable:!0,get:function(){return r}});let r=e=>{}},522016,(e,t,a)=>{"use strict";Object.defineProperty(a,"__esModule",{value:!0});var r={default:function(){return b},useLinkStatus:function(){return x}};for(var s in r)Object.defineProperty(a,s,{enumerable:!0,get:r[s]});let i=e.r(190809),o=e.r(843476),l=i._(e.r(271645)),n=e.r(195057),c=e.r(8372),d=e.r(818581),u=e.r(718967),p=e.r(405550);e.r(233525);let f=e.r(388540),h=e.r(91949),m=e.r(573668),y=e.r(509396);function b(t){var a,r;let s,i,b,[x,v]=(0,l.useOptimistic)(h.IDLE_LINK_STATUS),k=(0,l.useRef)(null),{href:w,as:j,children:C,prefetch:M=null,passHref:N,replace:E,shallow:S,scroll:_,onClick:A,onMouseEnter:O,onTouchStart:T,legacyBehavior:R=!1,onNavigate:P,transitionTypes:$,ref:L,unstable_dynamicOnHover:I,...z}=t;s=C,R&&("string"==typeof s||"number"==typeof s)&&(s=(0,o.jsx)("a",{children:s}));let D=l.default.useContext(c.AppRouterContext),U=!1!==M,H=!1!==M?null===(r=M)||"auto"===r?y.FetchStrategy.PPR:y.FetchStrategy.Full:y.FetchStrategy.PPR,B="string"==typeof(a=j||w)?a:(0,n.formatUrl)(a);if(R){if(s?.$$typeof===Symbol.for("react.lazy"))throw Object.defineProperty(Error("`<Link legacyBehavior>` received a direct child that is either a Server Component, or JSX that was loaded with React.lazy(). This is not supported. Either remove legacyBehavior, or make the direct child a Client Component that renders the Link's `<a>` tag."),"__NEXT_ERROR_CODE",{value:"E863",enumerable:!1,configurable:!0});i=l.default.Children.only(s)}let F=R?i&&"object"==typeof i&&i.ref:L,V=l.default.useCallback(e=>(null!==D&&(k.current=(0,h.mountLinkInstance)(e,B,D,H,U,v)),()=>{k.current&&((0,h.unmountLinkForCurrentNavigation)(k.current),k.current=null),(0,h.unmountPrefetchableInstance)(e)}),[U,B,D,H,v]),K={ref:(0,d.useMergedRef)(V,F),onClick(t){R||"function"!=typeof A||A(t),R&&i.props&&"function"==typeof i.props.onClick&&i.props.onClick(t),!D||t.defaultPrevented||function(t,a,r,s,i,o,n){if("u">typeof window){let c,{nodeName:d}=t.currentTarget;if("A"===d.toUpperCase()&&((c=t.currentTarget.getAttribute("target"))&&"_self"!==c||t.metaKey||t.ctrlKey||t.shiftKey||t.altKey||t.nativeEvent&&2===t.nativeEvent.which)||t.currentTarget.hasAttribute("download"))return;if(!(0,m.isLocalURL)(a)){s&&(t.preventDefault(),location.replace(a));return}if(t.preventDefault(),o){let e=!1;if(o({preventDefault:()=>{e=!0}}),e)return}let{dispatchNavigateAction:u}=e.r(699781);l.default.startTransition(()=>{u(a,s?"replace":"push",!1===i?f.ScrollBehavior.NoScroll:f.ScrollBehavior.Default,r.current,n)})}}(t,B,k,E,_,P,$)},onMouseEnter(e){R||"function"!=typeof O||O(e),R&&i.props&&"function"==typeof i.props.onMouseEnter&&i.props.onMouseEnter(e),D&&U&&(0,h.onNavigationIntent)(e.currentTarget,!0===I)},onTouchStart:function(e){R||"function"!=typeof T||T(e),R&&i.props&&"function"==typeof i.props.onTouchStart&&i.props.onTouchStart(e),D&&U&&(0,h.onNavigationIntent)(e.currentTarget,!0===I)}};return(0,u.isAbsoluteUrl)(B)?K.href=B:R&&!N&&("a"!==i.type||"href"in i.props)||(K.href=(0,p.addBasePath)(B)),b=R?l.default.cloneElement(i,K):(0,o.jsx)("a",{...z,...K,children:s}),(0,o.jsx)(g.Provider,{value:x,children:b})}e.r(284508);let g=(0,l.createContext)(h.IDLE_LINK_STATUS),x=()=>(0,l.useContext)(g);("function"==typeof a.default||"object"==typeof a.default&&null!==a.default)&&void 0===a.default.__esModule&&(Object.defineProperty(a.default,"__esModule",{value:!0}),Object.assign(a.default,a),t.exports=a.default)},396661,505014,e=>{"use strict";let t=(...e)=>e.filter((e,t,a)=>!!e&&""!==e.trim()&&a.indexOf(e)===t).join(" ").trim();e.s(["mergeClasses",0,t],396661);var a=e.i(271645),r={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};let s=(0,a.createContext)({}),i=(0,a.forwardRef)(({color:e,size:i,strokeWidth:o,absoluteStrokeWidth:l,className:n="",children:c,iconNode:d,...u},p)=>{let{size:f=24,strokeWidth:h=2,absoluteStrokeWidth:m=!1,color:y="currentColor",className:b=""}=(0,a.useContext)(s)??{},g=l??m?24*Number(o??h)/Number(i??f):o??h;return(0,a.createElement)("svg",{ref:p,...r,width:i??f??r.width,height:i??f??r.height,stroke:e??y,strokeWidth:g,className:t("lucide",b,n),...!c&&!(e=>{for(let t in e)if(t.startsWith("aria-")||"role"===t||"title"===t)return!0;return!1})(u)&&{"aria-hidden":"true"},...u},[...d.map(([e,t])=>(0,a.createElement)(e,t)),...Array.isArray(c)?c:[c]])});e.s(["default",0,i],505014)},618566,(e,t,a)=>{t.exports=e.r(976562)},146387,456420,e=>{"use strict";var t=e.i(271645),a=e.i(396661);let r=e=>{let t=e.replace(/^([A-Z])|[\s-_]+(\w)/g,(e,t,a)=>a?a.toUpperCase():t.toLowerCase());return t.charAt(0).toUpperCase()+t.slice(1)};var s=e.i(505014);let i=(e,i)=>{let o=(0,t.forwardRef)(({className:o,...l},n)=>(0,t.createElement)(s.default,{ref:n,iconNode:i,className:(0,a.mergeClasses)(`lucide-${r(e).replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase()}`,`lucide-${e}`,o),...l}));return o.displayName=r(e),o};e.s(["default",0,i],456420);let o=i("building-2",[["path",{d:"M10 12h4",key:"a56b0p"}],["path",{d:"M10 8h4",key:"1sr2af"}],["path",{d:"M14 21v-3a2 2 0 0 0-4 0v3",key:"1rgiei"}],["path",{d:"M6 10H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2",key:"secmi2"}],["path",{d:"M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16",key:"16ra0t"}]]);e.s(["Building2",0,o],146387)},818581,(e,t,a)=>{"use strict";Object.defineProperty(a,"__esModule",{value:!0}),Object.defineProperty(a,"useMergedRef",{enumerable:!0,get:function(){return s}});let r=e.r(271645);function s(e,t){let a=(0,r.useRef)(null),s=(0,r.useRef)(null);return(0,r.useCallback)(r=>{if(null===r){let e=a.current;e&&(a.current=null,e());let t=s.current;t&&(s.current=null,t())}else e&&(a.current=i(e,r)),t&&(s.current=i(t,r))},[e,t])}function i(e,t){if("function"!=typeof e)return e.current=t,()=>{e.current=null};{let a=e(t);return"function"==typeof a?a:()=>e(null)}}("function"==typeof a.default||"object"==typeof a.default&&null!==a.default)&&void 0===a.default.__esModule&&(Object.defineProperty(a.default,"__esModule",{value:!0}),Object.assign(a.default,a),t.exports=a.default)},823482,e=>{"use strict";let t=(0,e.i(456420).default)("graduation-cap",[["path",{d:"M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z",key:"j76jl0"}],["path",{d:"M22 10v6",key:"1lu8f3"}],["path",{d:"M6 12.5V16a6 3 0 0 0 12 0v-3.5",key:"1r8lef"}]]);e.s(["GraduationCap",0,t],823482)},584026,e=>{"use strict";let t=(0,e.i(456420).default)("shield-check",[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]]);e.s(["ShieldCheck",0,t],584026)},370812,e=>{"use strict";let t=(0,e.i(456420).default)("bell",[["path",{d:"M10.268 21a2 2 0 0 0 3.464 0",key:"vwvbt9"}],["path",{d:"M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326",key:"11g9vi"}]]);e.s(["Bell",0,t],370812)},716327,867927,e=>{"use strict";var t=e.i(456420);let a=(0,t.default)("chevron-down",[["path",{d:"m6 9 6 6 6-6",key:"qrunsl"}]]);e.s(["ChevronDown",0,a],716327);let r=(0,t.default)("chevron-right",[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]]);e.s(["ChevronRight",0,r],867927)},55677,e=>{"use strict";let t=(0,e.i(456420).default)("clipboard-list",[["rect",{width:"8",height:"4",x:"8",y:"2",rx:"1",ry:"1",key:"tgr4d6"}],["path",{d:"M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",key:"116196"}],["path",{d:"M12 11h4",key:"1jrz19"}],["path",{d:"M12 16h4",key:"n85exb"}],["path",{d:"M8 11h.01",key:"1dfujw"}],["path",{d:"M8 16h.01",key:"18s6g9"}]]);e.s(["ClipboardList",0,t],55677)},166794,e=>{"use strict";let t=(0,e.i(456420).default)("settings",[["path",{d:"M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915",key:"1i5ecw"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);e.s(["Settings",0,t],166794)},779432,e=>{"use strict";let t=(0,e.i(456420).default)("activity",[["path",{d:"M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2",key:"169zse"}]]);e.s(["Activity",0,t],779432)},367784,593583,e=>{"use strict";var t=e.i(456420);let a=(0,t.default)("log-out",[["path",{d:"m16 17 5-5-5-5",key:"1bji2h"}],["path",{d:"M21 12H9",key:"dn1m92"}],["path",{d:"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",key:"1uf3rs"}]]);e.s(["LogOut",0,a],367784);let r=(0,t.default)("menu",[["path",{d:"M4 5h16",key:"1tepv9"}],["path",{d:"M4 12h16",key:"1lakjw"}],["path",{d:"M4 19h16",key:"1djgab"}]]);e.s(["Menu",0,r],593583)},749803,e=>{"use strict";let t=(0,e.i(456420).default)("chart-column",[["path",{d:"M3 3v16a2 2 0 0 0 2 2h16",key:"c24i48"}],["path",{d:"M18 17V9",key:"2bz60n"}],["path",{d:"M13 17V5",key:"1frdt8"}],["path",{d:"M8 17v-3",key:"17ska0"}]]);e.s(["BarChart3",0,t],749803)},566595,e=>{"use strict";let t=(0,e.i(456420).default)("search",[["path",{d:"m21 21-4.34-4.34",key:"14j7rj"}],["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}]]);e.s(["Search",0,t],566595)},263676,e=>{"use strict";let t=(0,e.i(456420).default)("x",[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]]);e.s(["X",0,t],263676)},705766,e=>{"use strict";let t,a;var r,s=e.i(271645);let i={data:""},o=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,l=/\/\*[^]*?\*\/|  +/g,n=/\n+/g,c=(e,t)=>{let a="",r="",s="";for(let i in e){let o=e[i];"@"==i[0]?"i"==i[1]?a=i+" "+o+";":r+="f"==i[1]?c(o,i):i+"{"+c(o,"k"==i[1]?"":t)+"}":"object"==typeof o?r+=c(o,t?t.replace(/([^,])+/g,e=>i.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,t=>/&/.test(t)?t.replace(/&/g,e):e?e+" "+t:t)):i):null!=o&&(i="-"==i[1]?i:i.replace(/[A-Z]/g,"-$&").toLowerCase(),s+=c.p?c.p(i,o):i+":"+o+";")}return a+(t&&s?t+"{"+s+"}":s)+r},d={},u=e=>{if("object"==typeof e){let t="";for(let a in e)t+=a+u(e[a]);return t}return e};function p(e){let t,a,r=this||{},s=e.call?e(r.p):e;return((e,t,a,r,s)=>{var i;let p=u(e),f=d[p]||(d[p]=(e=>{let t=0,a=11;for(;t<e.length;)a=101*a+e.charCodeAt(t++)>>>0;return"go"+a})(p));if(!d[f]){let t=p!==e?e:(e=>{let t,a,r=[{}];for(;t=o.exec(e.replace(l,""));)t[4]?r.shift():t[3]?(a=t[3].replace(n," ").trim(),r.unshift(r[0][a]=r[0][a]||{})):r[0][t[1]]=t[2].replace(n," ").trim();return r[0]})(e);d[f]=c(s?{["@keyframes "+f]:t}:t,a?"":"."+f)}let h=a&&d.g;return a&&(d.g=d[f]),i=d[f],h?t.data=t.data.replace(h,i):-1===t.data.indexOf(i)&&(t.data=r?i+t.data:t.data+i),f})(s.unshift?s.raw?(t=[].slice.call(arguments,1),a=r.p,s.reduce((e,r,s)=>{let i=t[s];if(i&&i.call){let e=i(a),t=e&&e.props&&e.props.className||/^go/.test(e)&&e;i=t?"."+t:e&&"object"==typeof e?e.props?"":c(e,""):!1===e?"":e}return e+r+(null==i?"":i)},"")):s.reduce((e,t)=>Object.assign(e,t&&t.call?t(r.p):t),{}):s,(e=>{if("object"==typeof window){let t=(e?e.querySelector("#_goober"):window._goober)||Object.assign(document.createElement("style"),{innerHTML:" ",id:"_goober"});return t.nonce=window.__nonce__,t.parentNode||(e||document.head).appendChild(t),t.firstChild}return e||i})(r.target),r.g,r.o,r.k)}p.bind({g:1});let f,h,m,y=p.bind({k:1});function b(e,t){let a=this||{};return function(){let r=arguments;function s(i,o){let l=Object.assign({},i),n=l.className||s.className;a.p=Object.assign({theme:h&&h()},l),a.o=/go\d/.test(n),l.className=p.apply(a,r)+(n?" "+n:""),t&&(l.ref=o);let c=e;return e[0]&&(c=l.as||e,delete l.as),m&&c[0]&&m(l),f(c,l)}return t?t(s):s}}var g=(e,t)=>"function"==typeof e?e(t):e,x=(t=0,()=>(++t).toString()),v=()=>{if(void 0===a&&"u">typeof window){let e=matchMedia("(prefers-reduced-motion: reduce)");a=!e||e.matches}return a},k="default",w=(e,t)=>{let{toastLimit:a}=e.settings;switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,a)};case 1:return{...e,toasts:e.toasts.map(e=>e.id===t.toast.id?{...e,...t.toast}:e)};case 2:let{toast:r}=t;return w(e,{type:+!!e.toasts.find(e=>e.id===r.id),toast:r});case 3:let{toastId:s}=t;return{...e,toasts:e.toasts.map(e=>e.id===s||void 0===s?{...e,dismissed:!0,visible:!1}:e)};case 4:return void 0===t.toastId?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(e=>e.id!==t.toastId)};case 5:return{...e,pausedAt:t.time};case 6:let i=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(e=>({...e,pauseDuration:e.pauseDuration+i}))}}},j=[],C={toasts:[],pausedAt:void 0,settings:{toastLimit:20}},M={},N=(e,t=k)=>{M[t]=w(M[t]||C,e),j.forEach(([e,a])=>{e===t&&a(M[t])})},E=e=>Object.keys(M).forEach(t=>N(e,t)),S=(e=k)=>t=>{N(t,e)},_={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},A=e=>(t,a)=>{let r,s=((e,t="blank",a)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:t,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...a,id:(null==a?void 0:a.id)||x()}))(t,e,a);return S(s.toasterId||(r=s.id,Object.keys(M).find(e=>M[e].toasts.some(e=>e.id===r))))({type:2,toast:s}),s.id},O=(e,t)=>A("blank")(e,t);O.error=A("error"),O.success=A("success"),O.loading=A("loading"),O.custom=A("custom"),O.dismiss=(e,t)=>{let a={type:3,toastId:e};t?S(t)(a):E(a)},O.dismissAll=e=>O.dismiss(void 0,e),O.remove=(e,t)=>{let a={type:4,toastId:e};t?S(t)(a):E(a)},O.removeAll=e=>O.remove(void 0,e),O.promise=(e,t,a)=>{let r=O.loading(t.loading,{...a,...null==a?void 0:a.loading});return"function"==typeof e&&(e=e()),e.then(e=>{let s=t.success?g(t.success,e):void 0;return s?O.success(s,{id:r,...a,...null==a?void 0:a.success}):O.dismiss(r),e}).catch(e=>{let s=t.error?g(t.error,e):void 0;s?O.error(s,{id:r,...a,...null==a?void 0:a.error}):O.dismiss(r)}),e};var T=1e3,R=y`
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
}`,L=b("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${R} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
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
`,I=y`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,z=b("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||"#e0e0e0"};
  border-right-color: ${e=>e.primary||"#616161"};
  animation: ${I} 1s linear infinite;
`,D=y`
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
}`,H=b("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${D} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
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
`,B=b("div")`
  position: absolute;
`,F=b("div")`
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
}`,K=b("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${V} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,q=({toast:e})=>{let{icon:t,type:a,iconTheme:r}=e;return void 0!==t?"string"==typeof t?s.createElement(K,null,t):t:"blank"===a?null:s.createElement(F,null,s.createElement(z,{...r}),"loading"!==a&&s.createElement(B,null,"error"===a?s.createElement(L,{...r}):s.createElement(H,{...r})))},W=b("div")`
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
`,J=b("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,G=s.memo(({toast:e,position:t,style:a,children:r})=>{let i=e.height?((e,t)=>{let a=e.includes("top")?1:-1,[r,s]=v()?["0%{opacity:0;} 100%{opacity:1;}","0%{opacity:1;} 100%{opacity:0;}"]:[`
0% {transform: translate3d(0,${-200*a}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${-150*a}%,-1px) scale(.6); opacity:0;}
`];return{animation:t?`${y(r)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${y(s)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}})(e.position||t||"top-center",e.visible):{opacity:0},o=s.createElement(q,{toast:e}),l=s.createElement(J,{...e.ariaProps},g(e.message,e));return s.createElement(W,{className:e.className,style:{...i,...a,...e.style}},"function"==typeof r?r({icon:o,message:l}):s.createElement(s.Fragment,null,o,l))});r=s.createElement,c.p=void 0,f=r,h=void 0,m=void 0;var X=({id:e,className:t,style:a,onHeightUpdate:r,children:i})=>{let o=s.useCallback(t=>{if(t){let a=()=>{r(e,t.getBoundingClientRect().height)};a(),new MutationObserver(a).observe(t,{subtree:!0,childList:!0,characterData:!0})}},[e,r]);return s.createElement("div",{ref:o,className:t,style:a},i)},Z=p`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`;e.s(["Toaster",0,({reverseOrder:e,position:t="top-center",toastOptions:a,gutter:r,children:i,toasterId:o,containerStyle:l,containerClassName:n})=>{let{toasts:c,handlers:d}=((e,t="default")=>{let{toasts:a,pausedAt:r}=((e={},t=k)=>{let[a,r]=(0,s.useState)(M[t]||C),i=(0,s.useRef)(M[t]);(0,s.useEffect)(()=>(i.current!==M[t]&&r(M[t]),j.push([t,r]),()=>{let e=j.findIndex(([e])=>e===t);e>-1&&j.splice(e,1)}),[t]);let o=a.toasts.map(t=>{var a,r,s;return{...e,...e[t.type],...t,removeDelay:t.removeDelay||(null==(a=e[t.type])?void 0:a.removeDelay)||(null==e?void 0:e.removeDelay),duration:t.duration||(null==(r=e[t.type])?void 0:r.duration)||(null==e?void 0:e.duration)||_[t.type],style:{...e.style,...null==(s=e[t.type])?void 0:s.style,...t.style}}});return{...a,toasts:o}})(e,t),i=(0,s.useRef)(new Map).current,o=(0,s.useCallback)((e,t=T)=>{if(i.has(e))return;let a=setTimeout(()=>{i.delete(e),l({type:4,toastId:e})},t);i.set(e,a)},[]);(0,s.useEffect)(()=>{if(r)return;let e=Date.now(),s=a.map(a=>{if(a.duration===1/0)return;let r=(a.duration||0)+a.pauseDuration-(e-a.createdAt);if(r<0){a.visible&&O.dismiss(a.id);return}return setTimeout(()=>O.dismiss(a.id,t),r)});return()=>{s.forEach(e=>e&&clearTimeout(e))}},[a,r,t]);let l=(0,s.useCallback)(S(t),[t]),n=(0,s.useCallback)(()=>{l({type:5,time:Date.now()})},[l]),c=(0,s.useCallback)((e,t)=>{l({type:1,toast:{id:e,height:t}})},[l]),d=(0,s.useCallback)(()=>{r&&l({type:6,time:Date.now()})},[r,l]),u=(0,s.useCallback)((e,t)=>{let{reverseOrder:r=!1,gutter:s=8,defaultPosition:i}=t||{},o=a.filter(t=>(t.position||i)===(e.position||i)&&t.height),l=o.findIndex(t=>t.id===e.id),n=o.filter((e,t)=>t<l&&e.visible).length;return o.filter(e=>e.visible).slice(...r?[n+1]:[0,n]).reduce((e,t)=>e+(t.height||0)+s,0)},[a]);return(0,s.useEffect)(()=>{a.forEach(e=>{if(e.dismissed)o(e.id,e.removeDelay);else{let t=i.get(e.id);t&&(clearTimeout(t),i.delete(e.id))}})},[a,o]),{toasts:a,handlers:{updateHeight:c,startPause:n,endPause:d,calculateOffset:u}}})(a,o);return s.createElement("div",{"data-rht-toaster":o||"",style:{position:"fixed",zIndex:9999,top:16,left:16,right:16,bottom:16,pointerEvents:"none",...l},className:n,onMouseEnter:d.startPause,onMouseLeave:d.endPause},c.map(a=>{let o,l,n=a.position||t,c=d.calculateOffset(a,{reverseOrder:e,gutter:r,defaultPosition:t}),u=(o=n.includes("top"),l=n.includes("center")?{justifyContent:"center"}:n.includes("right")?{justifyContent:"flex-end"}:{},{left:0,right:0,display:"flex",position:"absolute",transition:v()?void 0:"all 230ms cubic-bezier(.21,1.02,.73,1)",transform:`translateY(${c*(o?1:-1)}px)`,...o?{top:0}:{bottom:0},...l});return s.createElement(X,{id:a.id,key:a.id,onHeightUpdate:d.updateHeight,className:a.visible?Z:"",style:u},"custom"===a.type?g(a.message,a):i?i(a):s.createElement(G,{toast:a,position:n}))}))},"default",0,O,"toast",0,O],705766)},920476,e=>{"use strict";async function t(e,t){let a=await fetch(e,t),r=await a.json().catch(()=>null);if(!a.ok)throw Error(r?.error||r?.message||`Request failed with ${a.status}`);return r}e.s(["apiJson",0,t,"errorMessage",0,function(e,t="Something went wrong"){return e instanceof Error?e.message:t}])},730274,e=>{"use strict";let t=(0,e.i(456420).default)("send",[["path",{d:"M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",key:"1ffxy3"}],["path",{d:"m21.854 2.147-10.94 10.939",key:"12cjpa"}]]);e.s(["Send",0,t],730274)},856423,e=>{"use strict";let t=(0,e.i(456420).default)("book-open",[["path",{d:"M12 7v14",key:"1akyts"}],["path",{d:"M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z",key:"ruj8y"}]]);e.s(["BookOpen",0,t],856423)},462047,e=>{"use strict";var t=e.i(705766);e.s(["notify",0,{success:e=>t.default.success(e),error:e=>t.default.error(e),warning:e=>(0,t.default)(e,{icon:"⚠️"}),info:e=>(0,t.default)(e,{icon:"ℹ️"})}])},741120,e=>{"use strict";let t=(0,e.i(456420).default)("refresh-cw",[["path",{d:"M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8",key:"v9h5vc"}],["path",{d:"M21 3v5h-5",key:"1q7to0"}],["path",{d:"M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16",key:"3uifl3"}],["path",{d:"M8 16H3v5",key:"1cv678"}]]);e.s(["RefreshCw",0,t],741120)},856522,e=>{"use strict";let t=(0,e.i(456420).default)("save",[["path",{d:"M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",key:"1c8476"}],["path",{d:"M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7",key:"1ydtos"}],["path",{d:"M7 3v4a1 1 0 0 0 1 1h7",key:"t51u73"}]]);e.s(["Save",0,t],856522)},551757,e=>{"use strict";let t=(0,e.i(456420).default)("circle-check",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]]);e.s(["CheckCircle2",0,t],551757)},639663,e=>{"use strict";var t=e.i(843476),a=e.i(551757),r=e.i(741120),s=e.i(856522),i=e.i(584026),o=e.i(456420);let l=(0,o.default)("toggle-left",[["circle",{cx:"9",cy:"12",r:"3",key:"u3jwor"}],["rect",{width:"20",height:"14",x:"2",y:"5",rx:"7",key:"g7kal2"}]]),n=(0,o.default)("toggle-right",[["circle",{cx:"15",cy:"12",r:"3",key:"1afu0r"}],["rect",{width:"20",height:"14",x:"2",y:"5",rx:"7",key:"g7kal2"}]]);var c=e.i(271645),d=e.i(859015),u=e.i(920476),p=e.i(462047);let f=["STARTER","PROFESSIONAL","ENTERPRISE","CUSTOM"],h={STUDENTS:"Students",TEACHERS:"Teachers",ACADEMICS:"Academics",FINANCE:"Finance",OPERATIONS:"Operations",DINING:"Dining",TRANSPORT:"Transport",HOSTEL:"Hostel",REPORTS:"Reports",ANALYTICS:"Analytics",AI:"AI",USER_MANAGEMENT:"User Management",PARENT_PORTAL:"Parent Portal",MOBILE_APP:"Mobile App"};e.s(["default",0,function(){let[e,o]=(0,c.useState)(null),[m,y]=(0,c.useState)(""),[b,g]=(0,c.useState)(null),[x,v]=(0,c.useState)({}),k=async()=>{let e=await (0,u.apiJson)("/api/platform/subscriptions");o(e),v(Object.fromEntries(e.schools.map(e=>[e.id,{plan:e.subscription_plan||"STARTER",modules:e.school_module_access.filter(e=>e.enabled).map(e=>e.module_key)}])))};(0,c.useEffect)(()=>{k().catch(e=>p.notify.error((0,u.errorMessage)(e,"Failed to load subscriptions")))},[]);let w=(0,c.useMemo)(()=>{let t=m.toLowerCase();return(e?.schools||[]).filter(e=>`
        ${e.school_name}
        ${e.school_code||""}
        ${e.email||""}
        ${e.phone||""}
        ${e.owner_name||""}
        ${e.owner_contact||""}
      `.toLowerCase().includes(t))},[e,m]),j=async e=>{let t=x[e.id];if(t)try{g(e.id),await (0,u.apiJson)("/api/platform/subscriptions",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({school_id:e.id,plan:t.plan,subscription_status:e.subscription_status||"ACTIVE",enabled_modules:t.modules})}),p.notify.success("Subscription updated"),await k()}catch(e){p.notify.error((0,u.errorMessage)(e,"Failed to update subscription"))}finally{g(null)}};return(0,t.jsx)(d.default,{children:(0,t.jsxs)("div",{className:"space-y-6",children:[(0,t.jsx)("section",{className:"tt-hero p-8 text-white",children:(0,t.jsxs)("div",{className:"flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("p",{className:"text-xs font-black uppercase tracking-[0.2em] text-amber-300",children:"Platform Administration"}),(0,t.jsx)("h1",{className:"mt-2 text-4xl font-black text-white md:text-5xl",children:"School Subscription Management"}),(0,t.jsx)("p",{className:"mt-3 max-w-3xl text-white/85",children:"Control which modules each school can use. Disabled modules are hidden from navigation and blocked by protected APIs."})]}),(0,t.jsxs)("button",{onClick:()=>k().catch(e=>p.notify.error((0,u.errorMessage)(e,"Refresh failed"))),className:"tt-button-secondary inline-flex items-center gap-2 bg-white text-slate-950",children:[(0,t.jsx)(r.RefreshCw,{size:17}),"Refresh"]})]})}),(0,t.jsx)("section",{className:"tt-card tt-card-pad",children:(0,t.jsxs)("div",{className:"flex flex-col gap-3 md:flex-row md:items-center md:justify-between",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("h2",{className:"text-2xl font-black text-slate-950",children:"SaaS Entitlements"}),(0,t.jsx)("p",{className:"text-sm font-semibold text-slate-600",children:"Starter, Professional, Enterprise, or custom module toggles per school."})]}),(0,t.jsx)("input",{value:m,onChange:e=>y(e.target.value),placeholder:"Search school, owner, phone, email...",className:"input max-w-lg"})]})}),(0,t.jsx)("div",{className:"grid gap-5",children:w.map(a=>{let o=x[a.id]||{plan:a.subscription_plan||"STARTER",modules:a.school_module_access.filter(e=>e.enabled).map(e=>e.module_key)};return(0,t.jsxs)("article",{className:"tt-card tt-card-pad",children:[(0,t.jsxs)("div",{className:"flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between",children:[(0,t.jsxs)("div",{className:"min-w-0",children:[(0,t.jsxs)("div",{className:"flex flex-wrap items-center gap-2",children:[(0,t.jsx)("h3",{className:"text-2xl font-black text-slate-950",children:a.school_name}),(0,t.jsx)("span",{className:"rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-800",children:a.subscription_status||"ACTIVE"}),(0,t.jsx)("span",{className:"rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-black text-amber-800",children:o.plan})]}),(0,t.jsxs)("p",{className:"mt-1 text-sm font-semibold text-slate-600",children:[a.school_code||"-"," | ",a.email||"-"," | ",a.phone||"-"]}),(0,t.jsxs)("p",{className:"mt-1 text-sm font-semibold text-slate-500",children:["Owner: ",a.owner_name||"-"," ",a.owner_contact?`| ${a.owner_contact}`:""]})]}),(0,t.jsx)("div",{className:"flex flex-wrap gap-2",children:f.map(r=>(0,t.jsx)("button",{type:"button",onClick:()=>{var t;return t=a.id,void v(a=>{let s="CUSTOM"===r?a[t]?.modules||[]:e?.planDefaults[r]||[];return{...a,[t]:{plan:r,modules:s}}})},className:`rounded-lg border px-3 py-2 text-xs font-black ${o.plan===r?"border-slate-950 bg-slate-950 text-white":"border-slate-200 bg-white text-slate-700"}`,children:r},r))})]}),(0,t.jsx)("div",{className:"mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4",children:(e?.moduleKeys||[]).map(e=>{let r=o.modules.includes(e);return(0,t.jsxs)("button",{type:"button",onClick:()=>{var t;return t=a.id,void v(a=>{let r=a[t]?.modules||[],s=r.includes(e)?r.filter(t=>t!==e):[...r,e];return{...a,[t]:{plan:"CUSTOM",modules:s}}})},className:`flex items-center justify-between gap-3 rounded-xl border p-4 text-left transition ${r?"border-emerald-200 bg-emerald-50 text-emerald-950":"border-slate-200 bg-slate-50 text-slate-600"}`,children:[(0,t.jsxs)("span",{children:[(0,t.jsx)("span",{className:"block text-sm font-black",children:h[e]||e}),(0,t.jsx)("span",{className:"mt-1 block text-xs font-bold opacity-70",children:e})]}),r?(0,t.jsx)(n,{className:"text-emerald-700"}):(0,t.jsx)(l,{})]},e)})}),(0,t.jsxs)("div",{className:"mt-5 flex flex-col gap-3 border-t border-slate-200 pt-5 md:flex-row md:items-center md:justify-between",children:[(0,t.jsxs)("div",{className:"inline-flex items-center gap-2 text-sm font-black text-slate-600",children:[(0,t.jsx)(i.ShieldCheck,{size:17,className:"text-amber-600"}),"Enabled modules: ",o.modules.length]}),(0,t.jsxs)("button",{type:"button",onClick:()=>j(a),disabled:b===a.id,className:"tt-button-primary inline-flex items-center gap-2",children:[b===a.id?(0,t.jsx)(r.RefreshCw,{size:17,className:"animate-spin"}):(0,t.jsx)(s.Save,{size:17}),"Save Entitlements"]})]})]},a.id)})}),w.length?null:(0,t.jsxs)("section",{className:"tt-card tt-card-pad text-center",children:[(0,t.jsx)(a.CheckCircle2,{className:"mx-auto text-slate-400"}),(0,t.jsx)("p",{className:"mt-3 font-bold text-slate-600",children:"No schools match the current search."})]})]})})}],639663)}]);