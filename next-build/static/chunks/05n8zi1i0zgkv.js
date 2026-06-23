(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,270904,e=>{"use strict";let t=(0,e.i(456420).default)("wallet",[["path",{d:"M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1",key:"18etb6"}],["path",{d:"M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4",key:"xoc0q4"}]]);e.s(["Wallet",0,t],270904)},195057,(e,t,a)=>{"use strict";Object.defineProperty(a,"__esModule",{value:!0});var r={formatUrl:function(){return l},formatWithValidation:function(){return d},urlObjectKeys:function(){return o}};for(var i in r)Object.defineProperty(a,i,{enumerable:!0,get:r[i]});let s=e.r(190809)._(e.r(998183)),n=/https?|ftp|gopher|file/;function l(e){let{auth:t,hostname:a}=e,r=e.protocol||"",i=e.pathname||"",l=e.hash||"",o=e.query||"",d=!1;t=t?encodeURIComponent(t).replace(/%3A/i,":")+"@":"",e.host?d=t+e.host:a&&(d=t+(~a.indexOf(":")?`[${a}]`:a),e.port&&(d+=":"+e.port)),o&&"object"==typeof o&&(o=String(s.urlQueryToSearchParams(o)));let c=e.search||o&&`?${o}`||"";return r&&!r.endsWith(":")&&(r+=":"),e.slashes||(!r||n.test(r))&&!1!==d?(d="//"+(d||""),i&&"/"!==i[0]&&(i="/"+i)):d||(d=""),l&&"#"!==l[0]&&(l="#"+l),c&&"?"!==c[0]&&(c="?"+c),i=i.replace(/[?#]/g,encodeURIComponent),c=c.replace("#","%23"),`${r}${d}${i}${c}${l}`}let o=["auth","hash","host","hostname","href","path","pathname","port","protocol","query","search","slashes"];function d(e){return l(e)}},573668,(e,t,a)=>{"use strict";Object.defineProperty(a,"__esModule",{value:!0}),Object.defineProperty(a,"isLocalURL",{enumerable:!0,get:function(){return s}});let r=e.r(718967),i=e.r(652817);function s(e){if(!(0,r.isAbsoluteUrl)(e))return!0;try{let t=(0,r.getLocationOrigin)(),a=new URL(e,t);return a.origin===t&&(0,i.hasBasePath)(a.pathname)}catch(e){return!1}}},284508,(e,t,a)=>{"use strict";Object.defineProperty(a,"__esModule",{value:!0}),Object.defineProperty(a,"errorOnce",{enumerable:!0,get:function(){return r}});let r=e=>{}},522016,(e,t,a)=>{"use strict";Object.defineProperty(a,"__esModule",{value:!0});var r={default:function(){return g},useLinkStatus:function(){return y}};for(var i in r)Object.defineProperty(a,i,{enumerable:!0,get:r[i]});let s=e.r(190809),n=e.r(843476),l=s._(e.r(271645)),o=e.r(195057),d=e.r(8372),c=e.r(818581),p=e.r(718967),m=e.r(405550);e.r(233525);let u=e.r(388540),h=e.r(91949),x=e.r(573668),f=e.r(509396);function g(t){var a,r;let i,s,g,[y,v]=(0,l.useOptimistic)(h.IDLE_LINK_STATUS),k=(0,l.useRef)(null),{href:j,as:w,children:N,prefetch:_=null,passHref:$,replace:S,shallow:M,scroll:C,onClick:z,onMouseEnter:A,onTouchStart:E,legacyBehavior:O=!1,onNavigate:P,transitionTypes:T,ref:q,unstable_dynamicOnHover:F,...R}=t;i=N,O&&("string"==typeof i||"number"==typeof i)&&(i=(0,n.jsx)("a",{children:i}));let L=l.default.useContext(d.AppRouterContext),D=!1!==_,I=!1!==_?null===(r=_)||"auto"===r?f.FetchStrategy.PPR:f.FetchStrategy.Full:f.FetchStrategy.PPR,B="string"==typeof(a=w||j)?a:(0,o.formatUrl)(a);if(O){if(i?.$$typeof===Symbol.for("react.lazy"))throw Object.defineProperty(Error("`<Link legacyBehavior>` received a direct child that is either a Server Component, or JSX that was loaded with React.lazy(). This is not supported. Either remove legacyBehavior, or make the direct child a Client Component that renders the Link's `<a>` tag."),"__NEXT_ERROR_CODE",{value:"E863",enumerable:!1,configurable:!0});s=l.default.Children.only(i)}let H=O?s&&"object"==typeof s&&s.ref:q,U=l.default.useCallback(e=>(null!==L&&(k.current=(0,h.mountLinkInstance)(e,B,L,I,D,v)),()=>{k.current&&((0,h.unmountLinkForCurrentNavigation)(k.current),k.current=null),(0,h.unmountPrefetchableInstance)(e)}),[D,B,L,I,v]),V={ref:(0,c.useMergedRef)(U,H),onClick(t){O||"function"!=typeof z||z(t),O&&s.props&&"function"==typeof s.props.onClick&&s.props.onClick(t),!L||t.defaultPrevented||function(t,a,r,i,s,n,o){if("u">typeof window){let d,{nodeName:c}=t.currentTarget;if("A"===c.toUpperCase()&&((d=t.currentTarget.getAttribute("target"))&&"_self"!==d||t.metaKey||t.ctrlKey||t.shiftKey||t.altKey||t.nativeEvent&&2===t.nativeEvent.which)||t.currentTarget.hasAttribute("download"))return;if(!(0,x.isLocalURL)(a)){i&&(t.preventDefault(),location.replace(a));return}if(t.preventDefault(),n){let e=!1;if(n({preventDefault:()=>{e=!0}}),e)return}let{dispatchNavigateAction:p}=e.r(699781);l.default.startTransition(()=>{p(a,i?"replace":"push",!1===s?u.ScrollBehavior.NoScroll:u.ScrollBehavior.Default,r.current,o)})}}(t,B,k,S,C,P,T)},onMouseEnter(e){O||"function"!=typeof A||A(e),O&&s.props&&"function"==typeof s.props.onMouseEnter&&s.props.onMouseEnter(e),L&&D&&(0,h.onNavigationIntent)(e.currentTarget,!0===F)},onTouchStart:function(e){O||"function"!=typeof E||E(e),O&&s.props&&"function"==typeof s.props.onTouchStart&&s.props.onTouchStart(e),L&&D&&(0,h.onNavigationIntent)(e.currentTarget,!0===F)}};return(0,p.isAbsoluteUrl)(B)?V.href=B:O&&!$&&("a"!==s.type||"href"in s.props)||(V.href=(0,m.addBasePath)(B)),g=O?l.default.cloneElement(s,V):(0,n.jsx)("a",{...R,...V,children:i}),(0,n.jsx)(b.Provider,{value:y,children:g})}e.r(284508);let b=(0,l.createContext)(h.IDLE_LINK_STATUS),y=()=>(0,l.useContext)(b);("function"==typeof a.default||"object"==typeof a.default&&null!==a.default)&&void 0===a.default.__esModule&&(Object.defineProperty(a.default,"__esModule",{value:!0}),Object.assign(a.default,a),t.exports=a.default)},396661,505014,e=>{"use strict";let t=(...e)=>e.filter((e,t,a)=>!!e&&""!==e.trim()&&a.indexOf(e)===t).join(" ").trim();e.s(["mergeClasses",0,t],396661);var a=e.i(271645),r={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};let i=(0,a.createContext)({}),s=(0,a.forwardRef)(({color:e,size:s,strokeWidth:n,absoluteStrokeWidth:l,className:o="",children:d,iconNode:c,...p},m)=>{let{size:u=24,strokeWidth:h=2,absoluteStrokeWidth:x=!1,color:f="currentColor",className:g=""}=(0,a.useContext)(i)??{},b=l??x?24*Number(n??h)/Number(s??u):n??h;return(0,a.createElement)("svg",{ref:m,...r,width:s??u??r.width,height:s??u??r.height,stroke:e??f,strokeWidth:b,className:t("lucide",g,o),...!d&&!(e=>{for(let t in e)if(t.startsWith("aria-")||"role"===t||"title"===t)return!0;return!1})(p)&&{"aria-hidden":"true"},...p},[...c.map(([e,t])=>(0,a.createElement)(e,t)),...Array.isArray(d)?d:[d]])});e.s(["default",0,s],505014)},618566,(e,t,a)=>{t.exports=e.r(976562)},146387,456420,e=>{"use strict";var t=e.i(271645),a=e.i(396661);let r=e=>{let t=e.replace(/^([A-Z])|[\s-_]+(\w)/g,(e,t,a)=>a?a.toUpperCase():t.toLowerCase());return t.charAt(0).toUpperCase()+t.slice(1)};var i=e.i(505014);let s=(e,s)=>{let n=(0,t.forwardRef)(({className:n,...l},o)=>(0,t.createElement)(i.default,{ref:o,iconNode:s,className:(0,a.mergeClasses)(`lucide-${r(e).replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase()}`,`lucide-${e}`,n),...l}));return n.displayName=r(e),n};e.s(["default",0,s],456420);let n=s("building-2",[["path",{d:"M10 12h4",key:"a56b0p"}],["path",{d:"M10 8h4",key:"1sr2af"}],["path",{d:"M14 21v-3a2 2 0 0 0-4 0v3",key:"1rgiei"}],["path",{d:"M6 10H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2",key:"secmi2"}],["path",{d:"M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16",key:"16ra0t"}]]);e.s(["Building2",0,n],146387)},818581,(e,t,a)=>{"use strict";Object.defineProperty(a,"__esModule",{value:!0}),Object.defineProperty(a,"useMergedRef",{enumerable:!0,get:function(){return i}});let r=e.r(271645);function i(e,t){let a=(0,r.useRef)(null),i=(0,r.useRef)(null);return(0,r.useCallback)(r=>{if(null===r){let e=a.current;e&&(a.current=null,e());let t=i.current;t&&(i.current=null,t())}else e&&(a.current=s(e,r)),t&&(i.current=s(t,r))},[e,t])}function s(e,t){if("function"!=typeof e)return e.current=t,()=>{e.current=null};{let a=e(t);return"function"==typeof a?a:()=>e(null)}}("function"==typeof a.default||"object"==typeof a.default&&null!==a.default)&&void 0===a.default.__esModule&&(Object.defineProperty(a.default,"__esModule",{value:!0}),Object.assign(a.default,a),t.exports=a.default)},823482,e=>{"use strict";let t=(0,e.i(456420).default)("graduation-cap",[["path",{d:"M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z",key:"j76jl0"}],["path",{d:"M22 10v6",key:"1lu8f3"}],["path",{d:"M6 12.5V16a6 3 0 0 0 12 0v-3.5",key:"1r8lef"}]]);e.s(["GraduationCap",0,t],823482)},749803,e=>{"use strict";let t=(0,e.i(456420).default)("chart-column",[["path",{d:"M3 3v16a2 2 0 0 0 2 2h16",key:"c24i48"}],["path",{d:"M18 17V9",key:"2bz60n"}],["path",{d:"M13 17V5",key:"1frdt8"}],["path",{d:"M8 17v-3",key:"17ska0"}]]);e.s(["BarChart3",0,t],749803)},566595,e=>{"use strict";let t=(0,e.i(456420).default)("search",[["path",{d:"m21 21-4.34-4.34",key:"14j7rj"}],["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}]]);e.s(["Search",0,t],566595)},370812,e=>{"use strict";let t=(0,e.i(456420).default)("bell",[["path",{d:"M10.268 21a2 2 0 0 0 3.464 0",key:"vwvbt9"}],["path",{d:"M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326",key:"11g9vi"}]]);e.s(["Bell",0,t],370812)},716327,867927,e=>{"use strict";var t=e.i(456420);let a=(0,t.default)("chevron-down",[["path",{d:"m6 9 6 6 6-6",key:"qrunsl"}]]);e.s(["ChevronDown",0,a],716327);let r=(0,t.default)("chevron-right",[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]]);e.s(["ChevronRight",0,r],867927)},55677,e=>{"use strict";let t=(0,e.i(456420).default)("clipboard-list",[["rect",{width:"8",height:"4",x:"8",y:"2",rx:"1",ry:"1",key:"tgr4d6"}],["path",{d:"M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",key:"116196"}],["path",{d:"M12 11h4",key:"1jrz19"}],["path",{d:"M12 16h4",key:"n85exb"}],["path",{d:"M8 11h.01",key:"1dfujw"}],["path",{d:"M8 16h.01",key:"18s6g9"}]]);e.s(["ClipboardList",0,t],55677)},166794,e=>{"use strict";let t=(0,e.i(456420).default)("settings",[["path",{d:"M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915",key:"1i5ecw"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);e.s(["Settings",0,t],166794)},584026,e=>{"use strict";let t=(0,e.i(456420).default)("shield-check",[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]]);e.s(["ShieldCheck",0,t],584026)},779432,e=>{"use strict";let t=(0,e.i(456420).default)("activity",[["path",{d:"M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2",key:"169zse"}]]);e.s(["Activity",0,t],779432)},367784,593583,e=>{"use strict";var t=e.i(456420);let a=(0,t.default)("log-out",[["path",{d:"m16 17 5-5-5-5",key:"1bji2h"}],["path",{d:"M21 12H9",key:"dn1m92"}],["path",{d:"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",key:"1uf3rs"}]]);e.s(["LogOut",0,a],367784);let r=(0,t.default)("menu",[["path",{d:"M4 5h16",key:"1tepv9"}],["path",{d:"M4 12h16",key:"1lakjw"}],["path",{d:"M4 19h16",key:"1djgab"}]]);e.s(["Menu",0,r],593583)},263676,e=>{"use strict";let t=(0,e.i(456420).default)("x",[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]]);e.s(["X",0,t],263676)},705766,e=>{"use strict";let t,a;var r,i=e.i(271645);let s={data:""},n=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,l=/\/\*[^]*?\*\/|  +/g,o=/\n+/g,d=(e,t)=>{let a="",r="",i="";for(let s in e){let n=e[s];"@"==s[0]?"i"==s[1]?a=s+" "+n+";":r+="f"==s[1]?d(n,s):s+"{"+d(n,"k"==s[1]?"":t)+"}":"object"==typeof n?r+=d(n,t?t.replace(/([^,])+/g,e=>s.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,t=>/&/.test(t)?t.replace(/&/g,e):e?e+" "+t:t)):s):null!=n&&(s="-"==s[1]?s:s.replace(/[A-Z]/g,"-$&").toLowerCase(),i+=d.p?d.p(s,n):s+":"+n+";")}return a+(t&&i?t+"{"+i+"}":i)+r},c={},p=e=>{if("object"==typeof e){let t="";for(let a in e)t+=a+p(e[a]);return t}return e};function m(e){let t,a,r=this||{},i=e.call?e(r.p):e;return((e,t,a,r,i)=>{var s;let m=p(e),u=c[m]||(c[m]=(e=>{let t=0,a=11;for(;t<e.length;)a=101*a+e.charCodeAt(t++)>>>0;return"go"+a})(m));if(!c[u]){let t=m!==e?e:(e=>{let t,a,r=[{}];for(;t=n.exec(e.replace(l,""));)t[4]?r.shift():t[3]?(a=t[3].replace(o," ").trim(),r.unshift(r[0][a]=r[0][a]||{})):r[0][t[1]]=t[2].replace(o," ").trim();return r[0]})(e);c[u]=d(i?{["@keyframes "+u]:t}:t,a?"":"."+u)}let h=a&&c.g;return a&&(c.g=c[u]),s=c[u],h?t.data=t.data.replace(h,s):-1===t.data.indexOf(s)&&(t.data=r?s+t.data:t.data+s),u})(i.unshift?i.raw?(t=[].slice.call(arguments,1),a=r.p,i.reduce((e,r,i)=>{let s=t[i];if(s&&s.call){let e=s(a),t=e&&e.props&&e.props.className||/^go/.test(e)&&e;s=t?"."+t:e&&"object"==typeof e?e.props?"":d(e,""):!1===e?"":e}return e+r+(null==s?"":s)},"")):i.reduce((e,t)=>Object.assign(e,t&&t.call?t(r.p):t),{}):i,(e=>{if("object"==typeof window){let t=(e?e.querySelector("#_goober"):window._goober)||Object.assign(document.createElement("style"),{innerHTML:" ",id:"_goober"});return t.nonce=window.__nonce__,t.parentNode||(e||document.head).appendChild(t),t.firstChild}return e||s})(r.target),r.g,r.o,r.k)}m.bind({g:1});let u,h,x,f=m.bind({k:1});function g(e,t){let a=this||{};return function(){let r=arguments;function i(s,n){let l=Object.assign({},s),o=l.className||i.className;a.p=Object.assign({theme:h&&h()},l),a.o=/go\d/.test(o),l.className=m.apply(a,r)+(o?" "+o:""),t&&(l.ref=n);let d=e;return e[0]&&(d=l.as||e,delete l.as),x&&d[0]&&x(l),u(d,l)}return t?t(i):i}}var b=(e,t)=>"function"==typeof e?e(t):e,y=(t=0,()=>(++t).toString()),v=()=>{if(void 0===a&&"u">typeof window){let e=matchMedia("(prefers-reduced-motion: reduce)");a=!e||e.matches}return a},k="default",j=(e,t)=>{let{toastLimit:a}=e.settings;switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,a)};case 1:return{...e,toasts:e.toasts.map(e=>e.id===t.toast.id?{...e,...t.toast}:e)};case 2:let{toast:r}=t;return j(e,{type:+!!e.toasts.find(e=>e.id===r.id),toast:r});case 3:let{toastId:i}=t;return{...e,toasts:e.toasts.map(e=>e.id===i||void 0===i?{...e,dismissed:!0,visible:!1}:e)};case 4:return void 0===t.toastId?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(e=>e.id!==t.toastId)};case 5:return{...e,pausedAt:t.time};case 6:let s=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(e=>({...e,pauseDuration:e.pauseDuration+s}))}}},w=[],N={toasts:[],pausedAt:void 0,settings:{toastLimit:20}},_={},$=(e,t=k)=>{_[t]=j(_[t]||N,e),w.forEach(([e,a])=>{e===t&&a(_[t])})},S=e=>Object.keys(_).forEach(t=>$(e,t)),M=(e=k)=>t=>{$(t,e)},C={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},z=e=>(t,a)=>{let r,i=((e,t="blank",a)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:t,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...a,id:(null==a?void 0:a.id)||y()}))(t,e,a);return M(i.toasterId||(r=i.id,Object.keys(_).find(e=>_[e].toasts.some(e=>e.id===r))))({type:2,toast:i}),i.id},A=(e,t)=>z("blank")(e,t);A.error=z("error"),A.success=z("success"),A.loading=z("loading"),A.custom=z("custom"),A.dismiss=(e,t)=>{let a={type:3,toastId:e};t?M(t)(a):S(a)},A.dismissAll=e=>A.dismiss(void 0,e),A.remove=(e,t)=>{let a={type:4,toastId:e};t?M(t)(a):S(a)},A.removeAll=e=>A.remove(void 0,e),A.promise=(e,t,a)=>{let r=A.loading(t.loading,{...a,...null==a?void 0:a.loading});return"function"==typeof e&&(e=e()),e.then(e=>{let i=t.success?b(t.success,e):void 0;return i?A.success(i,{id:r,...a,...null==a?void 0:a.success}):A.dismiss(r),e}).catch(e=>{let i=t.error?b(t.error,e):void 0;i?A.error(i,{id:r,...a,...null==a?void 0:a.error}):A.dismiss(r)}),e};var E=1e3,O=f`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,P=f`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,T=f`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,q=g("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${O} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
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
    animation: ${T} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,F=f`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,R=g("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||"#e0e0e0"};
  border-right-color: ${e=>e.primary||"#616161"};
  animation: ${F} 1s linear infinite;
`,L=f`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,D=f`
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
}`,I=g("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${L} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${D} 0.2s ease-out forwards;
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
`,U=f`
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
  animation: ${U} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,G=({toast:e})=>{let{icon:t,type:a,iconTheme:r}=e;return void 0!==t?"string"==typeof t?i.createElement(V,null,t):t:"blank"===a?null:i.createElement(H,null,i.createElement(R,{...r}),"loading"!==a&&i.createElement(B,null,"error"===a?i.createElement(q,{...r}):i.createElement(I,{...r})))},Q=g("div")`
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
`,K=i.memo(({toast:e,position:t,style:a,children:r})=>{let s=e.height?((e,t)=>{let a=e.includes("top")?1:-1,[r,i]=v()?["0%{opacity:0;} 100%{opacity:1;}","0%{opacity:1;} 100%{opacity:0;}"]:[`
0% {transform: translate3d(0,${-200*a}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${-150*a}%,-1px) scale(.6); opacity:0;}
`];return{animation:t?`${f(r)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${f(i)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}})(e.position||t||"top-center",e.visible):{opacity:0},n=i.createElement(G,{toast:e}),l=i.createElement(J,{...e.ariaProps},b(e.message,e));return i.createElement(Q,{className:e.className,style:{...s,...a,...e.style}},"function"==typeof r?r({icon:n,message:l}):i.createElement(i.Fragment,null,n,l))});r=i.createElement,d.p=void 0,u=r,h=void 0,x=void 0;var W=({id:e,className:t,style:a,onHeightUpdate:r,children:s})=>{let n=i.useCallback(t=>{if(t){let a=()=>{r(e,t.getBoundingClientRect().height)};a(),new MutationObserver(a).observe(t,{subtree:!0,childList:!0,characterData:!0})}},[e,r]);return i.createElement("div",{ref:n,className:t,style:a},s)},X=m`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`;e.s(["Toaster",0,({reverseOrder:e,position:t="top-center",toastOptions:a,gutter:r,children:s,toasterId:n,containerStyle:l,containerClassName:o})=>{let{toasts:d,handlers:c}=((e,t="default")=>{let{toasts:a,pausedAt:r}=((e={},t=k)=>{let[a,r]=(0,i.useState)(_[t]||N),s=(0,i.useRef)(_[t]);(0,i.useEffect)(()=>(s.current!==_[t]&&r(_[t]),w.push([t,r]),()=>{let e=w.findIndex(([e])=>e===t);e>-1&&w.splice(e,1)}),[t]);let n=a.toasts.map(t=>{var a,r,i;return{...e,...e[t.type],...t,removeDelay:t.removeDelay||(null==(a=e[t.type])?void 0:a.removeDelay)||(null==e?void 0:e.removeDelay),duration:t.duration||(null==(r=e[t.type])?void 0:r.duration)||(null==e?void 0:e.duration)||C[t.type],style:{...e.style,...null==(i=e[t.type])?void 0:i.style,...t.style}}});return{...a,toasts:n}})(e,t),s=(0,i.useRef)(new Map).current,n=(0,i.useCallback)((e,t=E)=>{if(s.has(e))return;let a=setTimeout(()=>{s.delete(e),l({type:4,toastId:e})},t);s.set(e,a)},[]);(0,i.useEffect)(()=>{if(r)return;let e=Date.now(),i=a.map(a=>{if(a.duration===1/0)return;let r=(a.duration||0)+a.pauseDuration-(e-a.createdAt);if(r<0){a.visible&&A.dismiss(a.id);return}return setTimeout(()=>A.dismiss(a.id,t),r)});return()=>{i.forEach(e=>e&&clearTimeout(e))}},[a,r,t]);let l=(0,i.useCallback)(M(t),[t]),o=(0,i.useCallback)(()=>{l({type:5,time:Date.now()})},[l]),d=(0,i.useCallback)((e,t)=>{l({type:1,toast:{id:e,height:t}})},[l]),c=(0,i.useCallback)(()=>{r&&l({type:6,time:Date.now()})},[r,l]),p=(0,i.useCallback)((e,t)=>{let{reverseOrder:r=!1,gutter:i=8,defaultPosition:s}=t||{},n=a.filter(t=>(t.position||s)===(e.position||s)&&t.height),l=n.findIndex(t=>t.id===e.id),o=n.filter((e,t)=>t<l&&e.visible).length;return n.filter(e=>e.visible).slice(...r?[o+1]:[0,o]).reduce((e,t)=>e+(t.height||0)+i,0)},[a]);return(0,i.useEffect)(()=>{a.forEach(e=>{if(e.dismissed)n(e.id,e.removeDelay);else{let t=s.get(e.id);t&&(clearTimeout(t),s.delete(e.id))}})},[a,n]),{toasts:a,handlers:{updateHeight:d,startPause:o,endPause:c,calculateOffset:p}}})(a,n);return i.createElement("div",{"data-rht-toaster":n||"",style:{position:"fixed",zIndex:9999,top:16,left:16,right:16,bottom:16,pointerEvents:"none",...l},className:o,onMouseEnter:c.startPause,onMouseLeave:c.endPause},d.map(a=>{let n,l,o=a.position||t,d=c.calculateOffset(a,{reverseOrder:e,gutter:r,defaultPosition:t}),p=(n=o.includes("top"),l=o.includes("center")?{justifyContent:"center"}:o.includes("right")?{justifyContent:"flex-end"}:{},{left:0,right:0,display:"flex",position:"absolute",transition:v()?void 0:"all 230ms cubic-bezier(.21,1.02,.73,1)",transform:`translateY(${d*(n?1:-1)}px)`,...n?{top:0}:{bottom:0},...l});return i.createElement(W,{id:a.id,key:a.id,onHeightUpdate:c.updateHeight,className:a.visible?X:"",style:p},"custom"===a.type?b(a.message,a):s?s(a):i.createElement(K,{toast:a,position:o}))}))},"default",0,A,"toast",0,A],705766)},920476,e=>{"use strict";async function t(e,t){let a=await fetch(e,t),r=await a.json().catch(()=>null);if(!a.ok)throw Error(r?.error||r?.message||`Request failed with ${a.status}`);return r}e.s(["apiJson",0,t,"errorMessage",0,function(e,t="Something went wrong"){return e instanceof Error?e.message:t}])},856423,e=>{"use strict";let t=(0,e.i(456420).default)("book-open",[["path",{d:"M12 7v14",key:"1akyts"}],["path",{d:"M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z",key:"ruj8y"}]]);e.s(["BookOpen",0,t],856423)},730274,e=>{"use strict";let t=(0,e.i(456420).default)("send",[["path",{d:"M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",key:"1ffxy3"}],["path",{d:"m21.854 2.147-10.94 10.939",key:"12cjpa"}]]);e.s(["Send",0,t],730274)},462047,e=>{"use strict";var t=e.i(705766);e.s(["notify",0,{success:e=>t.default.success(e),error:e=>t.default.error(e),warning:e=>(0,t.default)(e,{icon:"⚠️"}),info:e=>(0,t.default)(e,{icon:"ℹ️"})}])},235381,e=>{"use strict";let t=(0,e.i(456420).default)("clipboard-check",[["rect",{width:"8",height:"4",x:"8",y:"2",rx:"1",ry:"1",key:"tgr4d6"}],["path",{d:"M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",key:"116196"}],["path",{d:"m9 14 2 2 4-4",key:"df797q"}]]);e.s(["ClipboardCheck",0,t],235381)},856522,e=>{"use strict";let t=(0,e.i(456420).default)("save",[["path",{d:"M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",key:"1c8476"}],["path",{d:"M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7",key:"1ydtos"}],["path",{d:"M7 3v4a1 1 0 0 0 1 1h7",key:"t51u73"}]]);e.s(["Save",0,t],856522)},77043,e=>{"use strict";let t=(0,e.i(456420).default)("printer",[["path",{d:"M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2",key:"143wyd"}],["path",{d:"M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6",key:"1itne7"}],["rect",{x:"6",y:"14",width:"12",height:"8",rx:"1",key:"1ue0tg"}]]);e.s(["Printer",0,t],77043)},647629,e=>{"use strict";var t=e.i(462047);async function a({title:e,subtitle:n,documentLabel:l,metaHtml:o,bodyHtml:d,footerHtml:c,popupError:p="Allow popups to print this document.",pageSize:m="full",verificationUrl:u,barcodeValue:h}){var x;let f=window.open("","_blank","half"===m?"width=760,height=620":"width=980,height=760");if(!f)return void t.notify.error(p);f.document.open(),f.document.write((x=e,`
    <html>
      <head>
        <title>${r(x)}</title>
        <style>
          body{font-family:Arial,sans-serif;display:grid;min-height:100vh;place-items:center;color:#04142E}
          div{border:1px solid #e5e7eb;border-radius:16px;padding:24px 28px;box-shadow:0 20px 60px rgba(15,23,42,.12)}
          strong{display:block;font-size:18px}
          span{display:block;margin-top:6px;color:#64748b}
        </style>
      </head>
      <body>
        <div>
          <strong>Preparing ${r(x)}</strong>
          <span>Loading school branding...</span>
        </div>
      </body>
    </html>
  `)),f.document.close();let g=await i(),b=u?await s(u):null;f.document.open(),f.document.write(function({branding:e,title:t,subtitle:a,documentLabel:i,metaHtml:s,bodyHtml:n,footerHtml:l,pageSize:o="full",verificationUrl:d,barcodeValue:c,qrDataUrl:p}){let m=e.schoolName||e.product||"TOTTECH ONE",u=e.schoolCode||e.tagline||"Gateway To Learning",h=e.logoUrl||"/images/logo.png",x=e.primaryColor||"#04142E",f=e.secondaryColor||"#D4AF37",g=[e.address,e.phone,e.email].filter(Boolean).join(" | ");return"half"===o?function({title:e,subtitle:t,documentLabel:a,metaHtml:i,bodyHtml:s,footerHtml:n,schoolName:l,schoolCode:o,logoUrl:d,contact:c,verificationUrl:p,barcodeValue:m,qrDataUrl:u}){let h=h=>`
    <section class="copy">
      <header class="copy-header">
        <img class="copy-logo" src="${r(d)}" alt="${r(l)} logo" />
        <div class="copy-school">
          <h1>${r(l)}</h1>
          <p>${r(o)}</p>
          ${c?`<span>${r(c)}</span>`:""}
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
        <div class="print-body">${s}</div>
        ${p||u?`<div class="verify-row">
                ${u?`<img class="qr" src="${r(u)}" alt="QR verification" />`:""}
                <div>
                  <div class="barcode">${(m||e||"TOTTECH").slice(0,42).split("").map((e,t)=>{let a=e.charCodeAt(0);return Array.from({length:5}).map((e,r)=>{let i=(a>>r&1)==1||(t+r)%4==0;return`<span style="display:inline-block;width:${i?2:1}px;height:18px;background:${i?"#111":"transparent"};margin-right:1px"></span>`}).join("")}).join("")}</div>
                  <p>${r(p||"")}</p>
                </div>
              </div>`:""}
      </div>
      <footer class="copy-footer">
        <span>${r(h)}</span>
        <span>Generated by TOTTECH ONE</span>
      </footer>
      ${n||""}
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
  `}({title:t,subtitle:a,documentLabel:i,metaHtml:s,bodyHtml:n,footerHtml:l,schoolName:m,schoolCode:u,logoUrl:h,contact:g,verificationUrl:d,barcodeValue:c,qrDataUrl:p}):`
    <html>
      <head>
        <title>${r(t)}</title>
        <style>
          :root{--print-primary:${x};--print-gold:${f};--print-ink:#071426;--print-muted:#64748b;--print-line:#d8dee8;--print-soft:#f8fafc}
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
          ${s||""}
          <section class="print-body">${n}</section>
          <footer class="print-footer">
            <span>${r(g||"Generated from TOTTECH ONE")}</span>
            <span>Powered by TOTTECH ONE</span>
          </footer>
          ${l||""}
        </main>
      </body>
    </html>
  `}({branding:g,title:e,subtitle:n,documentLabel:l,metaHtml:o,bodyHtml:d,footerHtml:c,pageSize:m,verificationUrl:u,barcodeValue:h,qrDataUrl:b})),f.document.close(),f.focus(),window.setTimeout(()=>{f.print()},250)}function r(e){return e.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;")}async function i(){try{let e=await fetch("/api/my-school-branding",{cache:"no-store"});if(!e.ok)throw Error("Branding unavailable");return await e.json()}catch{return{schoolName:"TOTTECH ONE",schoolCode:"Gateway To Learning",logoUrl:"/images/logo.png",primaryColor:"#04142E",secondaryColor:"#D4AF37"}}}async function s(t){try{return(await e.A(673378)).toDataURL(t,{errorCorrectionLevel:"M",margin:1,width:120,color:{dark:"#111111",light:"#FFFFFF"}})}catch{return null}}e.s(["printBrandedDocument",0,a,"printMetaGrid",0,function(e){return`<div class="print-meta-grid">${e.map(e=>`
        <div class="print-meta-card">
          <span>${r(e.label)}</span>
          <strong>${r(String(e.value??"-"))}</strong>
        </div>
      `).join("")}</div>`}])},498441,e=>{"use strict";let t=(0,e.i(456420).default)("file-question-mark",[["path",{d:"M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z",key:"1oefj6"}],["path",{d:"M12 17h.01",key:"p32p05"}],["path",{d:"M9.1 9a3 3 0 0 1 5.82 1c0 2-3 3-3 3",key:"mhlwft"}]]);e.s(["FileQuestion",0,t],498441)},347397,e=>{"use strict";var t=e.i(843476),a=e.i(749803);let r=(0,e.i(456420).default)("calculator",[["rect",{width:"16",height:"20",x:"4",y:"2",rx:"2",key:"1nb95v"}],["line",{x1:"8",x2:"16",y1:"6",y2:"6",key:"x4nwl0"}],["line",{x1:"16",x2:"16",y1:"14",y2:"18",key:"wjye3r"}],["path",{d:"M16 10h.01",key:"1m94wz"}],["path",{d:"M12 10h.01",key:"1nrarc"}],["path",{d:"M8 10h.01",key:"19clt8"}],["path",{d:"M12 14h.01",key:"1etili"}],["path",{d:"M8 14h.01",key:"6423bh"}],["path",{d:"M12 18h.01",key:"mhygvu"}],["path",{d:"M8 18h.01",key:"lrp35t"}]]);var i=e.i(235381),s=e.i(498441),n=e.i(77043),l=e.i(856522),o=e.i(566595),d=e.i(271645),c=e.i(859015),p=e.i(920476),m=e.i(647629),u=e.i(462047);function h({exam:e,analytics:r,showGrid:i,onToggleGrid:s}){let l=r.rows||[],o=r.summary,d=o?.highest,c=o?.lowest;return(0,t.jsxs)("section",{className:"tt-card tt-card-pad",children:[(0,t.jsxs)("div",{className:"mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between",children:[(0,t.jsxs)("div",{className:"flex min-w-0 items-center gap-3",children:[(0,t.jsx)("div",{className:"grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-slate-950 text-white",children:(0,t.jsx)(a.BarChart3,{size:18})}),(0,t.jsxs)("div",{className:"min-w-0",children:[(0,t.jsx)("h2",{className:"text-xl font-black",children:"Marks Dashboard"}),(0,t.jsx)("p",{className:"truncate text-sm text-slate-600",children:[e.exam_name||e.exam_type_name,e.class_name,e.section_name,e.subject_name].filter(Boolean).join(" / ")||"Selected class and section"})]})]}),(0,t.jsxs)("div",{className:"flex flex-wrap gap-2",children:[(0,t.jsxs)("button",{onClick:()=>b(e,l),disabled:0===l.length,className:"tt-button-secondary inline-flex items-center gap-2 disabled:cursor-not-allowed disabled:opacity-50",children:[(0,t.jsx)(n.Printer,{size:16}),"Print Class Report"]}),(0,t.jsx)("button",{onClick:s,className:"tt-button inline-flex items-center gap-2",children:i?"Hide Grid":"Explore More"})]})]}),0===l.length?(0,t.jsx)(j,{children:"No saved marks yet for this class and section. Enter marks to generate analytics."}):(0,t.jsxs)(t.Fragment,{children:[(0,t.jsxs)("div",{className:"grid gap-4 md:grid-cols-4",children:[(0,t.jsx)(x,{label:"Students Evaluated",value:String(o?.student_count||l.length)}),(0,t.jsx)(x,{label:"Class Average",value:`${Number(o?.average_percentage||0).toFixed(2)}%`}),(0,t.jsx)(x,{label:"Highest Marks",value:d?`${d.student_name||"Student"} - ${Number(d.percentage||0).toFixed(2)}%`:"-"}),(0,t.jsx)(x,{label:"Least Marks",value:c?`${c.student_name||"Student"} - ${Number(c.percentage||0).toFixed(2)}%`:"-"})]}),(0,t.jsx)("div",{className:"mt-6 space-y-3",children:l.slice(0,8).map(e=>{let a=Number(e.percentage||0);return(0,t.jsxs)("div",{className:"rounded-lg border border-slate-200 bg-white p-3",children:[(0,t.jsxs)("div",{className:"mb-2 flex items-center justify-between gap-3 text-sm",children:[(0,t.jsx)("span",{className:"truncate font-black text-slate-950",children:e.student_name||`Student ${e.student_id}`}),(0,t.jsxs)("span",{className:"font-black text-amber-700",children:[a.toFixed(2),"%"]})]}),(0,t.jsx)("div",{className:"h-3 overflow-hidden rounded-full bg-slate-100",children:(0,t.jsx)("div",{className:"h-full rounded-full bg-amber-500",style:{width:`${Math.min(100,Math.max(0,a))}%`}})})]},e.student_id)})}),i?(0,t.jsx)("div",{className:"mt-6 overflow-x-auto",children:(0,t.jsxs)("table",{className:"min-w-full text-left text-sm",children:[(0,t.jsx)("thead",{children:(0,t.jsxs)("tr",{className:"border-b border-slate-200 text-xs uppercase text-slate-500",children:[(0,t.jsx)("th",{className:"py-3 pr-4",children:"Student"}),(0,t.jsx)("th",{className:"py-3 pr-4",children:"Admission"}),(0,t.jsx)("th",{className:"py-3 pr-4",children:"Roll"}),(0,t.jsx)("th",{className:"py-3 pr-4",children:"Class"}),(0,t.jsx)("th",{className:"py-3 pr-4",children:"Marks"}),(0,t.jsx)("th",{className:"py-3 pr-4",children:"%"}),(0,t.jsx)("th",{className:"py-3 pr-4",children:"Grade"})]})}),(0,t.jsx)("tbody",{children:l.map(e=>(0,t.jsxs)("tr",{className:"border-b border-slate-100",children:[(0,t.jsx)("td",{className:"py-3 pr-4 font-black text-slate-950",children:e.student_name||`Student ${e.student_id}`}),(0,t.jsx)("td",{className:"py-3 pr-4",children:e.admission_number||"-"}),(0,t.jsx)("td",{className:"py-3 pr-4",children:e.roll_number||"-"}),(0,t.jsx)("td",{className:"py-3 pr-4",children:[e.class_name,e.section_name].filter(Boolean).join(" ")||"-"}),(0,t.jsxs)("td",{className:"py-3 pr-4 font-bold",children:[e.obtained_marks," /"," ",e.max_marks]}),(0,t.jsx)("td",{className:"py-3 pr-4 font-bold",children:Number(e.percentage||0).toFixed(2)}),(0,t.jsx)("td",{className:"py-3 pr-4 font-black text-amber-700",children:e.grade||"-"})]},e.student_id))})]})}):null]})]})}function x({label:e,value:a}){return(0,t.jsxs)("div",{className:"rounded-xl border border-slate-200 bg-slate-50 p-4",children:[(0,t.jsx)("p",{className:"text-xs font-black uppercase text-slate-500",children:e}),(0,t.jsx)("p",{className:"mt-2 break-words text-xl font-black text-slate-950",children:a})]})}function f({label:e,value:a}){return(0,t.jsxs)("div",{className:"rounded-lg bg-slate-50 p-3",children:[(0,t.jsx)("p",{className:"text-[11px] font-black uppercase text-slate-500",children:e}),(0,t.jsx)("p",{className:"mt-1 font-black text-slate-950",children:a})]})}async function g(e,t,a){if(!e||!t||!a.length)return void u.notify.error("Select a student with saved marks before printing.");let r=a.map(e=>`
        <tr>
          <td>${y(e.question_text||`Question ${e.question_id}`)}</td>
          <td>${e.obtained_marks} / ${e.max_marks}</td>
          <td>${y(e.grade||"-")}</td>
          <td>${y(e.remarks||"-")}</td>
        </tr>
      `).join("");await (0,m.printBrandedDocument)({title:"Marks Report",subtitle:"Student-wise marks statement generated from saved exam entries.",documentLabel:"Marks Report",metaHtml:(0,m.printMetaGrid)([{label:"Exam",value:e.exam_name||e.exam_type_name||"-"},{label:"Student",value:v(t)},{label:"Class / Section",value:[e.class_name,e.section_name].filter(Boolean).join(" ")||"-"},{label:"Subject",value:e.subject_name||"-"}]),bodyHtml:`
      <table><thead><tr><th>Question</th><th>Marks</th><th>Grade</th><th>Remarks</th></tr></thead><tbody>${r}</tbody></table>
      <p class="sign">Academic Coordinator Signature</p>
    `,popupError:"Allow popups to print this report."})}async function b(e,t){if(!t.length)return void u.notify.error("No class marks are available to print.");let a=t.map(e=>`
        <tr>
          <td>${y(e.student_name||`Student ${e.student_id}`)}</td>
          <td>${y(e.admission_number||"-")}</td>
          <td>${y(e.roll_number||"-")}</td>
          <td>${e.obtained_marks} / ${e.max_marks}</td>
          <td>${Number(e.percentage||0).toFixed(2)}%</td>
          <td>${y(e.grade||"-")}</td>
        </tr>
      `).join("");await (0,m.printBrandedDocument)({title:"Class Marks Report",subtitle:"Class and section performance report with student-wise marks.",documentLabel:"Class Marks",metaHtml:(0,m.printMetaGrid)([{label:"Exam",value:e.exam_name||e.exam_type_name||"-"},{label:"Class / Section",value:[e.class_name,e.section_name].filter(Boolean).join(" ")||"-"},{label:"Subject",value:e.subject_name||"-"},{label:"Students",value:t.length}]),bodyHtml:`
      <table><thead><tr><th>Student</th><th>Admission</th><th>Roll</th><th>Marks</th><th>%</th><th>Grade</th></tr></thead><tbody>${a}</tbody></table>
      <p class="sign">Academic Coordinator Signature</p>
    `,popupError:"Allow popups to print this report."})}function y(e){return e.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;")}function v(e){return e.name||[e.first_name,e.middle_name,e.last_name].filter(Boolean).join(" ")||`Student ${e.id}`}function k(e){return String(e.question_id||e.id)}function j({children:e}){return(0,t.jsx)("div",{className:"rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-sm font-semibold text-slate-600",children:e})}function w({label:e,value:a,inverse:r=!1}){return(0,t.jsxs)("div",{className:"min-w-0",children:[(0,t.jsx)("p",{className:`text-xs font-bold uppercase ${r?"text-white/55":"text-slate-500"}`,children:e}),(0,t.jsx)("p",{className:`truncate font-semibold ${r?"text-white":"text-slate-950"}`,children:a||"-"})]})}e.s(["default",0,function(){var e;let[m,x]=(0,d.useState)([]),[b,y]=(0,d.useState)([]),[N,_]=(0,d.useState)([]),[$,S]=(0,d.useState)(null),[M,C]=(0,d.useState)(null),[z,A]=(0,d.useState)({}),[E,O]=(0,d.useState)({}),[P,T]=(0,d.useState)({}),[q,F]=(0,d.useState)([]),[R,L]=(0,d.useState)({rows:[],summary:null}),[D,I]=(0,d.useState)([]),[B,H]=(0,d.useState)(null),[U,V]=(0,d.useState)(!1),[G,Q]=(0,d.useState)(!1),[J,K]=(0,d.useState)(""),[W,X]=(0,d.useState)(!1),[Y,Z]=(0,d.useState)(!1),ee=async()=>{try{let e=await (0,p.apiJson)("/api/marks-entry/exams");x(Array.isArray(e)?e:[])}catch(e){u.notify.error((0,p.errorMessage)(e,"Failed to load scheduled exams"))}};(0,d.useEffect)(()=>{Promise.resolve().then(ee)},[]);let et=async e=>{try{X(!0),S(e),C(null),A({}),O({}),T({}),F([]),L({rows:[],summary:null}),I([]),H(null),Q(!1),K("");let t=(0,p.apiJson)(`/api/marks-entry/students?exam_schedule_id=${e.id}`),a=e.question_paper_id?(0,p.apiJson)(`/api/marks-entry/questions?paperId=${e.question_paper_id}`):Promise.resolve([]),[r,i]=await Promise.all([t,a]);y(Array.isArray(r)?r:[]),_(Array.isArray(i)?i:[]),await ea(e.id)}catch(e){u.notify.error((0,p.errorMessage)(e,"Failed to load exam roster"))}finally{X(!1)}},ea=async e=>{try{let t=await (0,p.apiJson)(`/api/marks-entry/analytics?exam_schedule_id=${e}`);L({rows:t.rows||[],summary:t.summary||null})}catch(e){u.notify.error((0,p.errorMessage)(e,"Failed to load marks analytics"))}},er=(0,d.useMemo)(()=>{let e=J.trim().toLowerCase();return e?b.filter(t=>[v(t),t.admission_number,t.roll_number,t.class_name,t.section_name].filter(Boolean).join(" ").toLowerCase().includes(e)):b},[b,J]),ei=(0,d.useMemo)(()=>N.reduce((e,t)=>e+Number(t.question_marks||0),0),[N]),es=(0,d.useMemo)(()=>N.reduce((e,t)=>e+Number(z[k(t)]||0),0),[z,N]),en=ei>0?es/ei*100:0,el=(e=en)>=90?"A+":e>=80?"A":e>=70?"B":e>=60?"C":e>=50?"D":e>=35?"E":"F",eo=N.filter(e=>{let t=k(e);return void 0===z[t]||""===z[t]}).length,ed=async()=>{if(!$)return void u.notify.error("Select a scheduled exam first.");if(!M)return void u.notify.error("Select a student before saving marks.");if(!$.question_paper_id)return void u.notify.error("Attach a question paper to this exam schedule before entering marks.");if(!N.length)return void u.notify.error("This paper has no questions to evaluate.");if(eo>0)return void u.notify.error("Enter marks for every question before saving.");if(N.find(e=>{let t=Number(z[k(e)]),a=Number(e.question_marks||0);return!Number.isFinite(t)||t<0||t>a}))return void u.notify.error("Marks cannot be negative or greater than the question maximum.");try{Z(!0);let e=await (0,p.apiJson)("/api/marks-entry",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({student_id:M.id,exam_schedule_id:$.id,question_paper_id:$.question_paper_id,entries:N.map(e=>{let t=k(e);return{question_id:e.question_id,obtained_marks:Number(z[t]),max_marks:Number(e.question_marks||0),remarks:E[t]||null}})})});u.notify.success(`Marks saved. Grade ${e.grade||el}`),await ep($,M),await ea($.id)}catch(e){u.notify.error((0,p.errorMessage)(e,"Failed to save marks"))}finally{Z(!1)}},ec=async e=>{C(e),await ep($,e)},ep=async(e,t)=>{if(!e||!t)return void F([]);try{let a=await (0,p.apiJson)(`/api/marks-entry?exam_schedule_id=${e.id}&student_id=${t.id}&question_paper_id=${e.question_paper_id||""}`),r=Array.isArray(a)?a:[];if(F(r),r.length){let e={},t={};r.forEach(a=>{let r=String(a.question_id||"");r&&(e[r]=String(a.obtained_marks??""),t[r]=String(a.remarks??""))}),A(e),O(t)}else T({})}catch(e){u.notify.error((0,p.errorMessage)(e,"Failed to load saved marks"))}},em=async()=>{if(!$||!M)return void u.notify.error("Select an exam and student before running AI evaluation.");if(!$.question_paper_id)return void u.notify.error("Attach a question paper before running AI evaluation.");try{V(!0);let e=await (0,p.apiJson)("/api/marks-entry/ai-evaluate",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({student_id:M.id,exam_schedule_id:$.id,question_paper_id:$.question_paper_id,answers:N.map(e=>({question_id:e.question_id,student_answer:P[k(e)]||""}))})});I(Array.isArray(e.evaluations)?e.evaluations:[]),H(e.aggregate_metrics||null),u.notify.success("AI evaluation completed. Teacher review is required before publishing marks.")}catch(e){u.notify.error((0,p.errorMessage)(e,"AI evaluation failed"))}finally{V(!1)}};return(0,t.jsx)(c.default,{children:(0,t.jsxs)("div",{className:"space-y-6",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("h1",{className:"text-3xl font-black md:text-4xl",children:"Marks Entry"}),(0,t.jsx)("p",{className:"mt-1 max-w-3xl text-sm text-slate-600",children:"Select a scheduled exam, load the class-section roster, then enter question-wise marks for each student."})]}),(0,t.jsxs)("section",{className:"tt-card tt-card-pad",children:[(0,t.jsxs)("div",{className:"mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("h2",{className:"text-xl font-black",children:"Scheduled Exams"}),(0,t.jsx)("p",{className:"mt-1 text-sm text-slate-600",children:"Exam schedules connect exams, classes, sections, subjects, papers, and marks entry."})]}),(0,t.jsxs)("span",{className:"w-fit rounded-lg bg-slate-100 px-3 py-2 text-sm font-bold text-slate-700",children:[m.length," schedules"]})]}),0===m.length?(0,t.jsx)(j,{children:"Create an exam schedule before entering marks."}):(0,t.jsx)("div",{className:"grid gap-3 md:grid-cols-2 xl:grid-cols-3",children:m.map(e=>{var a;return(0,t.jsxs)("button",{onClick:()=>et(e),className:`min-w-0 rounded-lg border p-4 text-left transition ${$?.id===e.id?"border-slate-950 bg-slate-950 text-white":"border-slate-200 bg-white hover:border-amber-400"}`,children:[(0,t.jsxs)("div",{className:"flex items-start gap-3",children:[(0,t.jsx)("div",{className:`grid h-10 w-10 shrink-0 place-items-center rounded-lg ${$?.id===e.id?"bg-white/15":"bg-slate-100"}`,children:(0,t.jsx)(i.ClipboardCheck,{size:19})}),(0,t.jsxs)("div",{className:"min-w-0",children:[(0,t.jsx)("h3",{className:"truncate font-black",children:e.exam_name||e.exam_type_name||`Exam ${e.id}`}),(0,t.jsx)("p",{className:`mt-1 truncate text-sm ${$?.id===e.id?"text-white/70":"text-slate-600"}`,children:[e.class_name,e.section_name,e.subject_name].filter(Boolean).join(" / ")||"Class not mapped"})]})]}),(0,t.jsxs)("div",{className:"mt-4 grid grid-cols-2 gap-2 text-sm",children:[(0,t.jsx)(w,{label:"Date",value:(a=e.exam_date)?new Date(a).toLocaleDateString():"-",inverse:$?.id===e.id}),(0,t.jsx)(w,{label:"Paper",value:e.paper_name||"Not attached",inverse:$?.id===e.id})]})]},e.id)})})]}),$?(0,t.jsx)(h,{exam:$,analytics:R,showGrid:G,onToggleGrid:()=>Q(e=>!e)}):null,(0,t.jsxs)("div",{className:"grid gap-6 xl:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)_minmax(280px,0.45fr)]",children:[(0,t.jsxs)("section",{className:"tt-card tt-card-pad min-w-0",children:[(0,t.jsxs)("div",{className:"mb-4 flex items-center gap-3",children:[(0,t.jsx)("div",{className:"grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-slate-950 text-white",children:(0,t.jsx)(o.Search,{size:18})}),(0,t.jsxs)("div",{className:"min-w-0",children:[(0,t.jsx)("h2",{className:"text-xl font-black",children:"Students"}),(0,t.jsx)("p",{className:"truncate text-sm text-slate-600",children:$?"Class-section roster for selected schedule":"Select an exam schedule"})]})]}),(0,t.jsx)("input",{className:"input mb-4",placeholder:"Search student, admission no, roll no",value:J,onChange:e=>K(e.target.value),disabled:!$}),W?(0,t.jsx)(j,{children:"Loading roster..."}):0===er.length?(0,t.jsx)(j,{children:$?"No students found for this class and section.":"Select a schedule to load students."}):(0,t.jsx)("div",{className:"max-h-[620px] space-y-2 overflow-y-auto pr-1",children:er.map(e=>(0,t.jsxs)("button",{onClick:()=>ec(e),className:`w-full min-w-0 rounded-lg border p-3 text-left transition ${M?.id===e.id?"border-slate-950 bg-slate-950 text-white":"border-slate-200 bg-white hover:border-amber-400"}`,children:[(0,t.jsx)("div",{className:"truncate font-black",children:v(e)}),(0,t.jsxs)("div",{className:`mt-1 grid gap-1 text-xs md:grid-cols-2 ${M?.id===e.id?"text-white/70":"text-slate-600"}`,children:[(0,t.jsxs)("span",{className:"truncate",children:["Admission:"," ",e.admission_number||"-"]}),(0,t.jsxs)("span",{className:"truncate",children:["Roll:"," ",e.roll_number||"-"]})]})]},e.id))})]}),(0,t.jsxs)("section",{className:"tt-card tt-card-pad min-w-0",children:[(0,t.jsxs)("div",{className:"mb-4 flex items-center gap-3",children:[(0,t.jsx)("div",{className:"grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-slate-950 text-white",children:(0,t.jsx)(s.FileQuestion,{size:18})}),(0,t.jsxs)("div",{className:"min-w-0",children:[(0,t.jsx)("h2",{className:"text-xl font-black",children:"Question Evaluation"}),(0,t.jsx)("p",{className:"truncate text-sm text-slate-600",children:M?v(M):"Select a student to enter marks"})]})]}),$?$.question_paper_id?0===N.length?(0,t.jsx)(j,{children:"The attached question paper has no questions."}):(0,t.jsx)("div",{className:"space-y-4",children:N.map((e,a)=>{let r=k(e),i=Number(e.question_marks||0);return(0,t.jsxs)("article",{className:"rounded-lg border border-slate-200 p-4",children:[(0,t.jsxs)("div",{className:"flex flex-col gap-3 md:flex-row md:items-start md:justify-between",children:[(0,t.jsxs)("div",{className:"min-w-0",children:[(0,t.jsxs)("p",{className:"text-xs font-black uppercase text-amber-700",children:["Q",a+1,e.section_name?` - Section ${e.section_name}`:""]}),(0,t.jsx)("h3",{className:"mt-1 whitespace-pre-wrap break-words text-base font-black text-slate-950",children:e.question_text||"Question text missing"}),(0,t.jsx)("p",{className:"mt-2 break-words text-sm text-slate-600",children:[e.topic_name,e.question_type,e.difficulty_level].filter(Boolean).join(" / ")||"No topic metadata"})]}),(0,t.jsxs)("span",{className:"w-fit shrink-0 rounded-lg bg-slate-100 px-3 py-2 text-sm font-bold text-slate-700",children:[i," marks"]})]}),(0,t.jsxs)("div",{className:"mt-4 grid gap-3 md:grid-cols-[150px_minmax(0,1fr)]",children:[(0,t.jsxs)("label",{className:"min-w-0",children:[(0,t.jsx)("span",{className:"mb-1 block text-sm font-bold text-slate-700",children:"Marks"}),(0,t.jsx)("input",{type:"number",min:"0",max:i,step:"0.5",className:"input",value:z[r]||"",onChange:e=>A({...z,[r]:e.target.value}),disabled:!M,placeholder:`0-${i}`})]}),(0,t.jsxs)("label",{className:"min-w-0",children:[(0,t.jsx)("span",{className:"mb-1 block text-sm font-bold text-slate-700",children:"Remarks"}),(0,t.jsx)("input",{className:"input",value:E[r]||"",onChange:e=>O({...E,[r]:e.target.value}),disabled:!M,placeholder:"Optional evaluator note"})]}),(0,t.jsxs)("label",{className:"min-w-0 md:col-span-2",children:[(0,t.jsx)("span",{className:"mb-1 block text-sm font-bold text-slate-700",children:"Student Answer for AI"}),(0,t.jsx)("textarea",{className:"input min-h-24",value:P[r]||"",onChange:e=>T({...P,[r]:e.target.value}),disabled:!M,placeholder:"Paste the student's answer here to generate AI suggestions."})]})]})]},r)})}):(0,t.jsx)(j,{children:"This schedule has no question paper attached. Attach a paper from Exam Schedule first."}):(0,t.jsx)(j,{children:"Select a scheduled exam to load its paper."})]}),(0,t.jsxs)("section",{className:"tt-card tt-card-pad min-w-0",children:[(0,t.jsxs)("div",{className:"mb-4 flex items-center gap-3",children:[(0,t.jsx)("div",{className:"grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-slate-950 text-white",children:(0,t.jsx)(r,{size:18})}),(0,t.jsxs)("div",{className:"min-w-0",children:[(0,t.jsx)("h2",{className:"text-xl font-black",children:"Summary"}),(0,t.jsx)("p",{className:"truncate text-sm text-slate-600",children:"Academic-year aware result"})]})]}),(0,t.jsxs)("div",{className:"space-y-3",children:[(0,t.jsx)(w,{label:"Exam",value:$?.exam_name||$?.exam_type_name||"-"}),(0,t.jsx)(w,{label:"Student",value:M?v(M):"-"}),(0,t.jsx)(w,{label:"Total",value:`${es} / ${ei}`}),(0,t.jsx)(w,{label:"Percentage",value:`${en.toFixed(2)}%`}),(0,t.jsx)(w,{label:"Grade",value:el}),(0,t.jsx)(w,{label:"Missing Marks",value:String(eo)}),(0,t.jsx)(w,{label:"Saved Entries",value:String(q.length)}),(0,t.jsx)(w,{label:"AI Suggestions",value:String(D.length)}),(0,t.jsx)(w,{label:"Concept Understanding",value:`${Number(B?.conceptUnderstandingPercent||0).toFixed(2)}%`}),(0,t.jsx)(w,{label:"Memory Retention",value:`${Number(B?.memoryRetentionPercent||0).toFixed(2)}%`}),(0,t.jsx)(w,{label:"Application Skill",value:`${Number(B?.applicationSkillPercent||0).toFixed(2)}%`}),(0,t.jsx)(w,{label:"Analytical Skill",value:`${Number(B?.analyticalSkillPercent||0).toFixed(2)}%`}),(0,t.jsx)(w,{label:"Critical Thinking",value:`${Number(B?.criticalThinkingPercent||0).toFixed(2)}%`}),(0,t.jsx)(w,{label:"Writing Skill",value:`${Number(B?.writingSkillPercent||0).toFixed(2)}%`}),(0,t.jsx)(w,{label:"Problem Solving",value:`${Number(B?.problemSolvingPercent||0).toFixed(2)}%`}),(0,t.jsx)(w,{label:"Confidence Score",value:`${Number(B?.confidenceScorePercent||0).toFixed(2)}%`})]}),(0,t.jsxs)("button",{onClick:ed,disabled:Y,className:"tt-button mt-6 inline-flex w-full items-center justify-center gap-2",children:[(0,t.jsx)(l.Save,{size:17}),Y?"Saving...":"Save Marks"]}),(0,t.jsxs)("button",{onClick:em,disabled:U||!$||!M,className:"tt-button-secondary mt-3 inline-flex w-full items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-50",children:[(0,t.jsx)(i.ClipboardCheck,{size:17}),U?"Evaluating...":"Run AI Evaluation"]}),(0,t.jsxs)("button",{onClick:()=>g($,M,q),disabled:!$||!M||0===q.length,className:"tt-button-secondary mt-3 inline-flex w-full items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-50",children:[(0,t.jsx)(n.Printer,{size:17}),"Print Marks Report"]})]})]}),(0,t.jsxs)("section",{className:"tt-card tt-card-pad",children:[(0,t.jsxs)("div",{className:"mb-4 flex items-center gap-3",children:[(0,t.jsx)("div",{className:"grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-slate-950 text-white",children:(0,t.jsx)(i.ClipboardCheck,{size:18})}),(0,t.jsxs)("div",{children:[(0,t.jsx)("h2",{className:"text-xl font-black",children:"Saved Marks View"}),(0,t.jsx)("p",{className:"text-sm text-slate-600",children:"View already entered marks for the selected student and exam schedule."})]})]}),M?0===q.length?(0,t.jsx)(j,{children:"No marks have been saved for this student and schedule yet."}):(0,t.jsx)("div",{className:"overflow-x-auto",children:(0,t.jsxs)("table",{className:"min-w-full text-left text-sm",children:[(0,t.jsx)("thead",{children:(0,t.jsxs)("tr",{className:"border-b border-slate-200 text-xs uppercase text-slate-500",children:[(0,t.jsx)("th",{className:"py-3 pr-4",children:"Question"}),(0,t.jsx)("th",{className:"py-3 pr-4",children:"Marks"}),(0,t.jsx)("th",{className:"py-3 pr-4",children:"Grade"}),(0,t.jsx)("th",{className:"py-3 pr-4",children:"Remarks"})]})}),(0,t.jsx)("tbody",{children:q.map(e=>(0,t.jsxs)("tr",{className:"border-b border-slate-100",children:[(0,t.jsx)("td",{className:"max-w-[520px] py-3 pr-4 font-bold text-slate-950",children:e.question_text||`Question ${e.question_id}`}),(0,t.jsxs)("td",{className:"py-3 pr-4 font-black text-slate-950",children:[e.obtained_marks," /"," ",e.max_marks]}),(0,t.jsx)("td",{className:"py-3 pr-4 font-black text-amber-700",children:e.grade||"-"}),(0,t.jsx)("td",{className:"py-3 pr-4 text-slate-600",children:e.remarks||"-"})]},e.id))})]})}):(0,t.jsx)(j,{children:"Select a student to view entered marks."})]}),(0,t.jsxs)("section",{className:"tt-card tt-card-pad",children:[(0,t.jsxs)("div",{className:"mb-4 flex items-center gap-3",children:[(0,t.jsx)("div",{className:"grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-slate-950 text-white",children:(0,t.jsx)(a.BarChart3,{size:18})}),(0,t.jsxs)("div",{children:[(0,t.jsx)("h2",{className:"text-xl font-black",children:"AI Assessment Review"}),(0,t.jsx)("p",{className:"text-sm text-slate-600",children:"Teacher review queue for concept detection, partial credit, misconceptions and recommended marks."})]})]}),0===D.length?(0,t.jsx)(j,{children:"Run AI evaluation for the selected student to see suggested marks and explanations."}):(0,t.jsx)("div",{className:"space-y-3",children:D.map((e,a)=>(0,t.jsxs)("div",{className:"rounded-lg border border-slate-200 p-4",children:[(0,t.jsxs)("div",{className:"flex flex-col gap-2 md:flex-row md:items-start md:justify-between",children:[(0,t.jsxs)("div",{children:[(0,t.jsxs)("p",{className:"text-xs font-black uppercase text-amber-700",children:["Question ",a+1]}),(0,t.jsxs)("p",{className:"mt-1 font-black text-slate-950",children:["AI Suggested Marks: ",Number(e.recommendedMarks||0).toFixed(2)]}),(0,t.jsxs)("p",{className:"text-sm text-slate-600",children:[e.qualityLabel||"-"," • Understanding ",e.understandingLevel||"-"," • Confidence ",Number(e.confidencePercent||0).toFixed(2),"%"]})]}),(0,t.jsx)("button",{className:"tt-button-secondary",onClick:()=>{let t=N.find(t=>Number(t.question_id)===Number(e.question_id));if(!t)return;let a=k(t);A(t=>({...t,[a]:String(e.recommendedMarks||0)}))},children:"Use Suggested Marks"})]}),(0,t.jsxs)("div",{className:"mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-4",children:[(0,t.jsx)(f,{label:"Exact Match",value:`${Number(e.exactMatchScore||0).toFixed(2)}%`}),(0,t.jsx)(f,{label:"Concept Match",value:`${Number(e.conceptMatchScore||0).toFixed(2)}%`}),(0,t.jsx)(f,{label:"Keyword Match",value:`${Number(e.keywordMatchScore||0).toFixed(2)}%`}),(0,t.jsx)(f,{label:"Completeness",value:`${Number(e.completenessScore||0).toFixed(2)}%`})]}),e.reasoning?(0,t.jsx)("p",{className:"mt-3 text-sm text-slate-700",children:e.reasoning}):null,e.misconceptions?.length?(0,t.jsxs)("p",{className:"mt-2 text-sm font-semibold text-red-700",children:["Misconceptions: ",e.misconceptions.join("; ")]}):null]},String(e.question_id||a)))})]})]})})}],347397)},673378,e=>{e.v(t=>Promise.all(["static/chunks/0kauo_1p4s347.js"].map(t=>e.l(t))).then(()=>t(973134)))}]);