(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,270904,e=>{"use strict";let t=(0,e.i(456420).default)("wallet",[["path",{d:"M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1",key:"18etb6"}],["path",{d:"M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4",key:"xoc0q4"}]]);e.s(["Wallet",0,t],270904)},195057,(e,t,a)=>{"use strict";Object.defineProperty(a,"__esModule",{value:!0});var i={formatUrl:function(){return o},formatWithValidation:function(){return d},urlObjectKeys:function(){return l}};for(var r in i)Object.defineProperty(a,r,{enumerable:!0,get:i[r]});let n=e.r(190809)._(e.r(998183)),s=/https?|ftp|gopher|file/;function o(e){let{auth:t,hostname:a}=e,i=e.protocol||"",r=e.pathname||"",o=e.hash||"",l=e.query||"",d=!1;t=t?encodeURIComponent(t).replace(/%3A/i,":")+"@":"",e.host?d=t+e.host:a&&(d=t+(~a.indexOf(":")?`[${a}]`:a),e.port&&(d+=":"+e.port)),l&&"object"==typeof l&&(l=String(n.urlQueryToSearchParams(l)));let c=e.search||l&&`?${l}`||"";return i&&!i.endsWith(":")&&(i+=":"),e.slashes||(!i||s.test(i))&&!1!==d?(d="//"+(d||""),r&&"/"!==r[0]&&(r="/"+r)):d||(d=""),o&&"#"!==o[0]&&(o="#"+o),c&&"?"!==c[0]&&(c="?"+c),r=r.replace(/[?#]/g,encodeURIComponent),c=c.replace("#","%23"),`${i}${d}${r}${c}${o}`}let l=["auth","hash","host","hostname","href","path","pathname","port","protocol","query","search","slashes"];function d(e){return o(e)}},573668,(e,t,a)=>{"use strict";Object.defineProperty(a,"__esModule",{value:!0}),Object.defineProperty(a,"isLocalURL",{enumerable:!0,get:function(){return n}});let i=e.r(718967),r=e.r(652817);function n(e){if(!(0,i.isAbsoluteUrl)(e))return!0;try{let t=(0,i.getLocationOrigin)(),a=new URL(e,t);return a.origin===t&&(0,r.hasBasePath)(a.pathname)}catch(e){return!1}}},284508,(e,t,a)=>{"use strict";Object.defineProperty(a,"__esModule",{value:!0}),Object.defineProperty(a,"errorOnce",{enumerable:!0,get:function(){return i}});let i=e=>{}},522016,(e,t,a)=>{"use strict";Object.defineProperty(a,"__esModule",{value:!0});var i={default:function(){return x},useLinkStatus:function(){return y}};for(var r in i)Object.defineProperty(a,r,{enumerable:!0,get:i[r]});let n=e.r(190809),s=e.r(843476),o=n._(e.r(271645)),l=e.r(195057),d=e.r(8372),c=e.r(818581),p=e.r(718967),u=e.r(405550);e.r(233525);let m=e.r(388540),h=e.r(91949),f=e.r(573668),g=e.r(509396);function x(t){var a,i;let r,n,x,[y,v]=(0,o.useOptimistic)(h.IDLE_LINK_STATUS),j=(0,o.useRef)(null),{href:w,as:_,children:k,prefetch:N=null,passHref:$,replace:S,shallow:C,scroll:z,onClick:E,onMouseEnter:M,onTouchStart:A,legacyBehavior:P=!1,onNavigate:T,transitionTypes:O,ref:I,unstable_dynamicOnHover:D,...L}=t;r=k,P&&("string"==typeof r||"number"==typeof r)&&(r=(0,s.jsx)("a",{children:r}));let R=o.default.useContext(d.AppRouterContext),F=!1!==N,H=!1!==N?null===(i=N)||"auto"===i?g.FetchStrategy.PPR:g.FetchStrategy.Full:g.FetchStrategy.PPR,U="string"==typeof(a=_||w)?a:(0,l.formatUrl)(a);if(P){if(r?.$$typeof===Symbol.for("react.lazy"))throw Object.defineProperty(Error("`<Link legacyBehavior>` received a direct child that is either a Server Component, or JSX that was loaded with React.lazy(). This is not supported. Either remove legacyBehavior, or make the direct child a Client Component that renders the Link's `<a>` tag."),"__NEXT_ERROR_CODE",{value:"E863",enumerable:!1,configurable:!0});n=o.default.Children.only(r)}let B=P?n&&"object"==typeof n&&n.ref:I,G=o.default.useCallback(e=>(null!==R&&(j.current=(0,h.mountLinkInstance)(e,U,R,H,F,v)),()=>{j.current&&((0,h.unmountLinkForCurrentNavigation)(j.current),j.current=null),(0,h.unmountPrefetchableInstance)(e)}),[F,U,R,H,v]),V={ref:(0,c.useMergedRef)(G,B),onClick(t){P||"function"!=typeof E||E(t),P&&n.props&&"function"==typeof n.props.onClick&&n.props.onClick(t),!R||t.defaultPrevented||function(t,a,i,r,n,s,l){if("u">typeof window){let d,{nodeName:c}=t.currentTarget;if("A"===c.toUpperCase()&&((d=t.currentTarget.getAttribute("target"))&&"_self"!==d||t.metaKey||t.ctrlKey||t.shiftKey||t.altKey||t.nativeEvent&&2===t.nativeEvent.which)||t.currentTarget.hasAttribute("download"))return;if(!(0,f.isLocalURL)(a)){r&&(t.preventDefault(),location.replace(a));return}if(t.preventDefault(),s){let e=!1;if(s({preventDefault:()=>{e=!0}}),e)return}let{dispatchNavigateAction:p}=e.r(699781);o.default.startTransition(()=>{p(a,r?"replace":"push",!1===n?m.ScrollBehavior.NoScroll:m.ScrollBehavior.Default,i.current,l)})}}(t,U,j,S,z,T,O)},onMouseEnter(e){P||"function"!=typeof M||M(e),P&&n.props&&"function"==typeof n.props.onMouseEnter&&n.props.onMouseEnter(e),R&&F&&(0,h.onNavigationIntent)(e.currentTarget,!0===D)},onTouchStart:function(e){P||"function"!=typeof A||A(e),P&&n.props&&"function"==typeof n.props.onTouchStart&&n.props.onTouchStart(e),R&&F&&(0,h.onNavigationIntent)(e.currentTarget,!0===D)}};return(0,p.isAbsoluteUrl)(U)?V.href=U:P&&!$&&("a"!==n.type||"href"in n.props)||(V.href=(0,u.addBasePath)(U)),x=P?o.default.cloneElement(n,V):(0,s.jsx)("a",{...L,...V,children:r}),(0,s.jsx)(b.Provider,{value:y,children:x})}e.r(284508);let b=(0,o.createContext)(h.IDLE_LINK_STATUS),y=()=>(0,o.useContext)(b);("function"==typeof a.default||"object"==typeof a.default&&null!==a.default)&&void 0===a.default.__esModule&&(Object.defineProperty(a.default,"__esModule",{value:!0}),Object.assign(a.default,a),t.exports=a.default)},396661,505014,e=>{"use strict";let t=(...e)=>e.filter((e,t,a)=>!!e&&""!==e.trim()&&a.indexOf(e)===t).join(" ").trim();e.s(["mergeClasses",0,t],396661);var a=e.i(271645),i={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};let r=(0,a.createContext)({}),n=(0,a.forwardRef)(({color:e,size:n,strokeWidth:s,absoluteStrokeWidth:o,className:l="",children:d,iconNode:c,...p},u)=>{let{size:m=24,strokeWidth:h=2,absoluteStrokeWidth:f=!1,color:g="currentColor",className:x=""}=(0,a.useContext)(r)??{},b=o??f?24*Number(s??h)/Number(n??m):s??h;return(0,a.createElement)("svg",{ref:u,...i,width:n??m??i.width,height:n??m??i.height,stroke:e??g,strokeWidth:b,className:t("lucide",x,l),...!d&&!(e=>{for(let t in e)if(t.startsWith("aria-")||"role"===t||"title"===t)return!0;return!1})(p)&&{"aria-hidden":"true"},...p},[...c.map(([e,t])=>(0,a.createElement)(e,t)),...Array.isArray(d)?d:[d]])});e.s(["default",0,n],505014)},618566,(e,t,a)=>{t.exports=e.r(976562)},146387,456420,e=>{"use strict";var t=e.i(271645),a=e.i(396661);let i=e=>{let t=e.replace(/^([A-Z])|[\s-_]+(\w)/g,(e,t,a)=>a?a.toUpperCase():t.toLowerCase());return t.charAt(0).toUpperCase()+t.slice(1)};var r=e.i(505014);let n=(e,n)=>{let s=(0,t.forwardRef)(({className:s,...o},l)=>(0,t.createElement)(r.default,{ref:l,iconNode:n,className:(0,a.mergeClasses)(`lucide-${i(e).replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase()}`,`lucide-${e}`,s),...o}));return s.displayName=i(e),s};e.s(["default",0,n],456420);let s=n("building-2",[["path",{d:"M10 12h4",key:"a56b0p"}],["path",{d:"M10 8h4",key:"1sr2af"}],["path",{d:"M14 21v-3a2 2 0 0 0-4 0v3",key:"1rgiei"}],["path",{d:"M6 10H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2",key:"secmi2"}],["path",{d:"M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16",key:"16ra0t"}]]);e.s(["Building2",0,s],146387)},818581,(e,t,a)=>{"use strict";Object.defineProperty(a,"__esModule",{value:!0}),Object.defineProperty(a,"useMergedRef",{enumerable:!0,get:function(){return r}});let i=e.r(271645);function r(e,t){let a=(0,i.useRef)(null),r=(0,i.useRef)(null);return(0,i.useCallback)(i=>{if(null===i){let e=a.current;e&&(a.current=null,e());let t=r.current;t&&(r.current=null,t())}else e&&(a.current=n(e,i)),t&&(r.current=n(t,i))},[e,t])}function n(e,t){if("function"!=typeof e)return e.current=t,()=>{e.current=null};{let a=e(t);return"function"==typeof a?a:()=>e(null)}}("function"==typeof a.default||"object"==typeof a.default&&null!==a.default)&&void 0===a.default.__esModule&&(Object.defineProperty(a.default,"__esModule",{value:!0}),Object.assign(a.default,a),t.exports=a.default)},823482,e=>{"use strict";let t=(0,e.i(456420).default)("graduation-cap",[["path",{d:"M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z",key:"j76jl0"}],["path",{d:"M22 10v6",key:"1lu8f3"}],["path",{d:"M6 12.5V16a6 3 0 0 0 12 0v-3.5",key:"1r8lef"}]]);e.s(["GraduationCap",0,t],823482)},263676,e=>{"use strict";let t=(0,e.i(456420).default)("x",[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]]);e.s(["X",0,t],263676)},370812,e=>{"use strict";let t=(0,e.i(456420).default)("bell",[["path",{d:"M10.268 21a2 2 0 0 0 3.464 0",key:"vwvbt9"}],["path",{d:"M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326",key:"11g9vi"}]]);e.s(["Bell",0,t],370812)},716327,867927,e=>{"use strict";var t=e.i(456420);let a=(0,t.default)("chevron-down",[["path",{d:"m6 9 6 6 6-6",key:"qrunsl"}]]);e.s(["ChevronDown",0,a],716327);let i=(0,t.default)("chevron-right",[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]]);e.s(["ChevronRight",0,i],867927)},55677,e=>{"use strict";let t=(0,e.i(456420).default)("clipboard-list",[["rect",{width:"8",height:"4",x:"8",y:"2",rx:"1",ry:"1",key:"tgr4d6"}],["path",{d:"M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",key:"116196"}],["path",{d:"M12 11h4",key:"1jrz19"}],["path",{d:"M12 16h4",key:"n85exb"}],["path",{d:"M8 11h.01",key:"1dfujw"}],["path",{d:"M8 16h.01",key:"18s6g9"}]]);e.s(["ClipboardList",0,t],55677)},166794,e=>{"use strict";let t=(0,e.i(456420).default)("settings",[["path",{d:"M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915",key:"1i5ecw"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);e.s(["Settings",0,t],166794)},584026,e=>{"use strict";let t=(0,e.i(456420).default)("shield-check",[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]]);e.s(["ShieldCheck",0,t],584026)},779432,e=>{"use strict";let t=(0,e.i(456420).default)("activity",[["path",{d:"M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2",key:"169zse"}]]);e.s(["Activity",0,t],779432)},367784,593583,e=>{"use strict";var t=e.i(456420);let a=(0,t.default)("log-out",[["path",{d:"m16 17 5-5-5-5",key:"1bji2h"}],["path",{d:"M21 12H9",key:"dn1m92"}],["path",{d:"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",key:"1uf3rs"}]]);e.s(["LogOut",0,a],367784);let i=(0,t.default)("menu",[["path",{d:"M4 5h16",key:"1tepv9"}],["path",{d:"M4 12h16",key:"1lakjw"}],["path",{d:"M4 19h16",key:"1djgab"}]]);e.s(["Menu",0,i],593583)},749803,e=>{"use strict";let t=(0,e.i(456420).default)("chart-column",[["path",{d:"M3 3v16a2 2 0 0 0 2 2h16",key:"c24i48"}],["path",{d:"M18 17V9",key:"2bz60n"}],["path",{d:"M13 17V5",key:"1frdt8"}],["path",{d:"M8 17v-3",key:"17ska0"}]]);e.s(["BarChart3",0,t],749803)},566595,e=>{"use strict";let t=(0,e.i(456420).default)("search",[["path",{d:"m21 21-4.34-4.34",key:"14j7rj"}],["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}]]);e.s(["Search",0,t],566595)},705766,e=>{"use strict";let t,a;var i,r=e.i(271645);let n={data:""},s=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,o=/\/\*[^]*?\*\/|  +/g,l=/\n+/g,d=(e,t)=>{let a="",i="",r="";for(let n in e){let s=e[n];"@"==n[0]?"i"==n[1]?a=n+" "+s+";":i+="f"==n[1]?d(s,n):n+"{"+d(s,"k"==n[1]?"":t)+"}":"object"==typeof s?i+=d(s,t?t.replace(/([^,])+/g,e=>n.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,t=>/&/.test(t)?t.replace(/&/g,e):e?e+" "+t:t)):n):null!=s&&(n="-"==n[1]?n:n.replace(/[A-Z]/g,"-$&").toLowerCase(),r+=d.p?d.p(n,s):n+":"+s+";")}return a+(t&&r?t+"{"+r+"}":r)+i},c={},p=e=>{if("object"==typeof e){let t="";for(let a in e)t+=a+p(e[a]);return t}return e};function u(e){let t,a,i=this||{},r=e.call?e(i.p):e;return((e,t,a,i,r)=>{var n;let u=p(e),m=c[u]||(c[u]=(e=>{let t=0,a=11;for(;t<e.length;)a=101*a+e.charCodeAt(t++)>>>0;return"go"+a})(u));if(!c[m]){let t=u!==e?e:(e=>{let t,a,i=[{}];for(;t=s.exec(e.replace(o,""));)t[4]?i.shift():t[3]?(a=t[3].replace(l," ").trim(),i.unshift(i[0][a]=i[0][a]||{})):i[0][t[1]]=t[2].replace(l," ").trim();return i[0]})(e);c[m]=d(r?{["@keyframes "+m]:t}:t,a?"":"."+m)}let h=a&&c.g;return a&&(c.g=c[m]),n=c[m],h?t.data=t.data.replace(h,n):-1===t.data.indexOf(n)&&(t.data=i?n+t.data:t.data+n),m})(r.unshift?r.raw?(t=[].slice.call(arguments,1),a=i.p,r.reduce((e,i,r)=>{let n=t[r];if(n&&n.call){let e=n(a),t=e&&e.props&&e.props.className||/^go/.test(e)&&e;n=t?"."+t:e&&"object"==typeof e?e.props?"":d(e,""):!1===e?"":e}return e+i+(null==n?"":n)},"")):r.reduce((e,t)=>Object.assign(e,t&&t.call?t(i.p):t),{}):r,(e=>{if("object"==typeof window){let t=(e?e.querySelector("#_goober"):window._goober)||Object.assign(document.createElement("style"),{innerHTML:" ",id:"_goober"});return t.nonce=window.__nonce__,t.parentNode||(e||document.head).appendChild(t),t.firstChild}return e||n})(i.target),i.g,i.o,i.k)}u.bind({g:1});let m,h,f,g=u.bind({k:1});function x(e,t){let a=this||{};return function(){let i=arguments;function r(n,s){let o=Object.assign({},n),l=o.className||r.className;a.p=Object.assign({theme:h&&h()},o),a.o=/go\d/.test(l),o.className=u.apply(a,i)+(l?" "+l:""),t&&(o.ref=s);let d=e;return e[0]&&(d=o.as||e,delete o.as),f&&d[0]&&f(o),m(d,o)}return t?t(r):r}}var b=(e,t)=>"function"==typeof e?e(t):e,y=(t=0,()=>(++t).toString()),v=()=>{if(void 0===a&&"u">typeof window){let e=matchMedia("(prefers-reduced-motion: reduce)");a=!e||e.matches}return a},j="default",w=(e,t)=>{let{toastLimit:a}=e.settings;switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,a)};case 1:return{...e,toasts:e.toasts.map(e=>e.id===t.toast.id?{...e,...t.toast}:e)};case 2:let{toast:i}=t;return w(e,{type:+!!e.toasts.find(e=>e.id===i.id),toast:i});case 3:let{toastId:r}=t;return{...e,toasts:e.toasts.map(e=>e.id===r||void 0===r?{...e,dismissed:!0,visible:!1}:e)};case 4:return void 0===t.toastId?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(e=>e.id!==t.toastId)};case 5:return{...e,pausedAt:t.time};case 6:let n=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(e=>({...e,pauseDuration:e.pauseDuration+n}))}}},_=[],k={toasts:[],pausedAt:void 0,settings:{toastLimit:20}},N={},$=(e,t=j)=>{N[t]=w(N[t]||k,e),_.forEach(([e,a])=>{e===t&&a(N[t])})},S=e=>Object.keys(N).forEach(t=>$(e,t)),C=(e=j)=>t=>{$(t,e)},z={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},E=e=>(t,a)=>{let i,r=((e,t="blank",a)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:t,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...a,id:(null==a?void 0:a.id)||y()}))(t,e,a);return C(r.toasterId||(i=r.id,Object.keys(N).find(e=>N[e].toasts.some(e=>e.id===i))))({type:2,toast:r}),r.id},M=(e,t)=>E("blank")(e,t);M.error=E("error"),M.success=E("success"),M.loading=E("loading"),M.custom=E("custom"),M.dismiss=(e,t)=>{let a={type:3,toastId:e};t?C(t)(a):S(a)},M.dismissAll=e=>M.dismiss(void 0,e),M.remove=(e,t)=>{let a={type:4,toastId:e};t?C(t)(a):S(a)},M.removeAll=e=>M.remove(void 0,e),M.promise=(e,t,a)=>{let i=M.loading(t.loading,{...a,...null==a?void 0:a.loading});return"function"==typeof e&&(e=e()),e.then(e=>{let r=t.success?b(t.success,e):void 0;return r?M.success(r,{id:i,...a,...null==a?void 0:a.success}):M.dismiss(i),e}).catch(e=>{let r=t.error?b(t.error,e):void 0;r?M.error(r,{id:i,...a,...null==a?void 0:a.error}):M.dismiss(i)}),e};var A=1e3,P=g`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,T=g`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,O=g`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,I=x("div")`
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
    animation: ${T} 0.15s ease-out forwards;
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
    animation: ${O} 0.15s ease-out forwards;
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
`,R=g`
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

  animation: ${R} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
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
`,U=x("div")`
  position: absolute;
`,B=x("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,G=g`
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
  animation: ${G} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,q=({toast:e})=>{let{icon:t,type:a,iconTheme:i}=e;return void 0!==t?"string"==typeof t?r.createElement(V,null,t):t:"blank"===a?null:r.createElement(B,null,r.createElement(L,{...i}),"loading"!==a&&r.createElement(U,null,"error"===a?r.createElement(I,{...i}):r.createElement(H,{...i})))},J=x("div")`
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
`,K=x("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,W=r.memo(({toast:e,position:t,style:a,children:i})=>{let n=e.height?((e,t)=>{let a=e.includes("top")?1:-1,[i,r]=v()?["0%{opacity:0;} 100%{opacity:1;}","0%{opacity:1;} 100%{opacity:0;}"]:[`
0% {transform: translate3d(0,${-200*a}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${-150*a}%,-1px) scale(.6); opacity:0;}
`];return{animation:t?`${g(i)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${g(r)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}})(e.position||t||"top-center",e.visible):{opacity:0},s=r.createElement(q,{toast:e}),o=r.createElement(K,{...e.ariaProps},b(e.message,e));return r.createElement(J,{className:e.className,style:{...n,...a,...e.style}},"function"==typeof i?i({icon:s,message:o}):r.createElement(r.Fragment,null,s,o))});i=r.createElement,d.p=void 0,m=i,h=void 0,f=void 0;var Y=({id:e,className:t,style:a,onHeightUpdate:i,children:n})=>{let s=r.useCallback(t=>{if(t){let a=()=>{i(e,t.getBoundingClientRect().height)};a(),new MutationObserver(a).observe(t,{subtree:!0,childList:!0,characterData:!0})}},[e,i]);return r.createElement("div",{ref:s,className:t,style:a},n)},X=u`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`;e.s(["Toaster",0,({reverseOrder:e,position:t="top-center",toastOptions:a,gutter:i,children:n,toasterId:s,containerStyle:o,containerClassName:l})=>{let{toasts:d,handlers:c}=((e,t="default")=>{let{toasts:a,pausedAt:i}=((e={},t=j)=>{let[a,i]=(0,r.useState)(N[t]||k),n=(0,r.useRef)(N[t]);(0,r.useEffect)(()=>(n.current!==N[t]&&i(N[t]),_.push([t,i]),()=>{let e=_.findIndex(([e])=>e===t);e>-1&&_.splice(e,1)}),[t]);let s=a.toasts.map(t=>{var a,i,r;return{...e,...e[t.type],...t,removeDelay:t.removeDelay||(null==(a=e[t.type])?void 0:a.removeDelay)||(null==e?void 0:e.removeDelay),duration:t.duration||(null==(i=e[t.type])?void 0:i.duration)||(null==e?void 0:e.duration)||z[t.type],style:{...e.style,...null==(r=e[t.type])?void 0:r.style,...t.style}}});return{...a,toasts:s}})(e,t),n=(0,r.useRef)(new Map).current,s=(0,r.useCallback)((e,t=A)=>{if(n.has(e))return;let a=setTimeout(()=>{n.delete(e),o({type:4,toastId:e})},t);n.set(e,a)},[]);(0,r.useEffect)(()=>{if(i)return;let e=Date.now(),r=a.map(a=>{if(a.duration===1/0)return;let i=(a.duration||0)+a.pauseDuration-(e-a.createdAt);if(i<0){a.visible&&M.dismiss(a.id);return}return setTimeout(()=>M.dismiss(a.id,t),i)});return()=>{r.forEach(e=>e&&clearTimeout(e))}},[a,i,t]);let o=(0,r.useCallback)(C(t),[t]),l=(0,r.useCallback)(()=>{o({type:5,time:Date.now()})},[o]),d=(0,r.useCallback)((e,t)=>{o({type:1,toast:{id:e,height:t}})},[o]),c=(0,r.useCallback)(()=>{i&&o({type:6,time:Date.now()})},[i,o]),p=(0,r.useCallback)((e,t)=>{let{reverseOrder:i=!1,gutter:r=8,defaultPosition:n}=t||{},s=a.filter(t=>(t.position||n)===(e.position||n)&&t.height),o=s.findIndex(t=>t.id===e.id),l=s.filter((e,t)=>t<o&&e.visible).length;return s.filter(e=>e.visible).slice(...i?[l+1]:[0,l]).reduce((e,t)=>e+(t.height||0)+r,0)},[a]);return(0,r.useEffect)(()=>{a.forEach(e=>{if(e.dismissed)s(e.id,e.removeDelay);else{let t=n.get(e.id);t&&(clearTimeout(t),n.delete(e.id))}})},[a,s]),{toasts:a,handlers:{updateHeight:d,startPause:l,endPause:c,calculateOffset:p}}})(a,s);return r.createElement("div",{"data-rht-toaster":s||"",style:{position:"fixed",zIndex:9999,top:16,left:16,right:16,bottom:16,pointerEvents:"none",...o},className:l,onMouseEnter:c.startPause,onMouseLeave:c.endPause},d.map(a=>{let s,o,l=a.position||t,d=c.calculateOffset(a,{reverseOrder:e,gutter:i,defaultPosition:t}),p=(s=l.includes("top"),o=l.includes("center")?{justifyContent:"center"}:l.includes("right")?{justifyContent:"flex-end"}:{},{left:0,right:0,display:"flex",position:"absolute",transition:v()?void 0:"all 230ms cubic-bezier(.21,1.02,.73,1)",transform:`translateY(${d*(s?1:-1)}px)`,...s?{top:0}:{bottom:0},...o});return r.createElement(Y,{id:a.id,key:a.id,onHeightUpdate:c.updateHeight,className:a.visible?X:"",style:p},"custom"===a.type?b(a.message,a):n?n(a):r.createElement(W,{toast:a,position:l}))}))},"default",0,M,"toast",0,M],705766)},920476,e=>{"use strict";async function t(e,t){let a=await fetch(e,t),i=await a.json().catch(()=>null);if(!a.ok)throw Error(i?.error||i?.message||`Request failed with ${a.status}`);return i}e.s(["apiJson",0,t,"errorMessage",0,function(e,t="Something went wrong"){return e instanceof Error?e.message:t}])},856423,e=>{"use strict";let t=(0,e.i(456420).default)("book-open",[["path",{d:"M12 7v14",key:"1akyts"}],["path",{d:"M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z",key:"ruj8y"}]]);e.s(["BookOpen",0,t],856423)},730274,e=>{"use strict";let t=(0,e.i(456420).default)("send",[["path",{d:"M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",key:"1ffxy3"}],["path",{d:"m21.854 2.147-10.94 10.939",key:"12cjpa"}]]);e.s(["Send",0,t],730274)},226091,e=>{"use strict";let t=(0,e.i(456420).default)("file-text",[["path",{d:"M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z",key:"1oefj6"}],["path",{d:"M14 2v5a1 1 0 0 0 1 1h5",key:"wfsgrz"}],["path",{d:"M10 9H8",key:"b1mrlr"}],["path",{d:"M16 13H8",key:"t4e002"}],["path",{d:"M16 17H8",key:"z1uh3a"}]]);e.s(["FileText",0,t],226091)},772382,e=>{"use strict";let t=(0,e.i(456420).default)("eye",[["path",{d:"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",key:"1nclc0"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);e.s(["Eye",0,t],772382)},462047,e=>{"use strict";var t=e.i(705766);e.s(["notify",0,{success:e=>t.default.success(e),error:e=>t.default.error(e),warning:e=>(0,t.default)(e,{icon:"⚠️"}),info:e=>(0,t.default)(e,{icon:"ℹ️"})}])},77071,e=>{"use strict";let t=(0,e.i(456420).default)("plus",[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"M12 5v14",key:"s699le"}]]);e.s(["Plus",0,t],77071)},573474,e=>{"use strict";let t=(0,e.i(456420).default)("trash-2",[["path",{d:"M10 11v6",key:"nco0om"}],["path",{d:"M14 11v6",key:"outv1u"}],["path",{d:"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6",key:"miytrc"}],["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",key:"e791ji"}]]);e.s(["Trash2",0,t],573474)},856522,e=>{"use strict";let t=(0,e.i(456420).default)("save",[["path",{d:"M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",key:"1c8476"}],["path",{d:"M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7",key:"1ydtos"}],["path",{d:"M7 3v4a1 1 0 0 0 1 1h7",key:"t51u73"}]]);e.s(["Save",0,t],856522)},77043,e=>{"use strict";let t=(0,e.i(456420).default)("printer",[["path",{d:"M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2",key:"143wyd"}],["path",{d:"M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6",key:"1itne7"}],["rect",{x:"6",y:"14",width:"12",height:"8",rx:"1",key:"1ue0tg"}]]);e.s(["Printer",0,t],77043)},647629,e=>{"use strict";var t=e.i(462047);async function a({title:e,subtitle:s,documentLabel:o,metaHtml:l,bodyHtml:d,footerHtml:c,popupError:p="Allow popups to print this document.",pageSize:u="full",verificationUrl:m,barcodeValue:h}){var f;let g=window.open("","_blank","half"===u?"width=760,height=620":"width=980,height=760");if(!g)return void t.notify.error(p);g.document.open(),g.document.write((f=e,`
    <html>
      <head>
        <title>${i(f)}</title>
        <style>
          body{font-family:Arial,sans-serif;display:grid;min-height:100vh;place-items:center;color:#04142E}
          div{border:1px solid #e5e7eb;border-radius:16px;padding:24px 28px;box-shadow:0 20px 60px rgba(15,23,42,.12)}
          strong{display:block;font-size:18px}
          span{display:block;margin-top:6px;color:#64748b}
        </style>
      </head>
      <body>
        <div>
          <strong>Preparing ${i(f)}</strong>
          <span>Loading school branding...</span>
        </div>
      </body>
    </html>
  `)),g.document.close();let x=await r(),b=m?await n(m):null;g.document.open(),g.document.write(function({branding:e,title:t,subtitle:a,documentLabel:r,metaHtml:n,bodyHtml:s,footerHtml:o,pageSize:l="full",verificationUrl:d,barcodeValue:c,qrDataUrl:p}){let u=e.schoolName||e.product||"TOTTECH ONE",m=e.schoolCode||e.tagline||"Gateway To Learning",h=e.logoUrl||"/images/logo.png",f=e.primaryColor||"#04142E",g=e.secondaryColor||"#D4AF37",x=[e.address,e.phone,e.email].filter(Boolean).join(" | ");return"half"===l?function({title:e,subtitle:t,documentLabel:a,metaHtml:r,bodyHtml:n,footerHtml:s,schoolName:o,schoolCode:l,logoUrl:d,contact:c,verificationUrl:p,barcodeValue:u,qrDataUrl:m}){let h=h=>`
    <section class="copy">
      <header class="copy-header">
        <img class="copy-logo" src="${i(d)}" alt="${i(o)} logo" />
        <div class="copy-school">
          <h1>${i(o)}</h1>
          <p>${i(l)}</p>
          ${c?`<span>${i(c)}</span>`:""}
        </div>
        <div class="copy-title">
          <strong>${i(a||e)}</strong>
          <span>${i(h)}</span>
        </div>
      </header>
      <div class="copy-main">
        <div class="copy-intro">
          <h2>${i(e)}</h2>
          ${t?`<p>${i(t)}</p>`:""}
        </div>
        ${r||""}
        <div class="print-body">${n}</div>
        ${p||m?`<div class="verify-row">
                ${m?`<img class="qr" src="${i(m)}" alt="QR verification" />`:""}
                <div>
                  <div class="barcode">${(u||e||"TOTTECH").slice(0,42).split("").map((e,t)=>{let a=e.charCodeAt(0);return Array.from({length:5}).map((e,i)=>{let r=(a>>i&1)==1||(t+i)%4==0;return`<span style="display:inline-block;width:${r?2:1}px;height:18px;background:${r?"#111":"transparent"};margin-right:1px"></span>`}).join("")}).join("")}</div>
                  <p>${i(p||"")}</p>
                </div>
              </div>`:""}
      </div>
      <footer class="copy-footer">
        <span>${i(h)}</span>
        <span>Generated by TOTTECH ONE</span>
      </footer>
      ${s||""}
    </section>
  `;return`
    <html>
      <head>
        <title>${i(e)}</title>
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
  `}({title:t,subtitle:a,documentLabel:r,metaHtml:n,bodyHtml:s,footerHtml:o,schoolName:u,schoolCode:m,logoUrl:h,contact:x,verificationUrl:d,barcodeValue:c,qrDataUrl:p}):`
    <html>
      <head>
        <title>${i(t)}</title>
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
              <img class="print-logo" src="${i(h)}" alt="${i(u)} logo" />
              <div class="print-school">
                <h1>${i(u)}</h1>
                <p>${i(m)}</p>
              </div>
            </div>
            <div class="print-document-badge">
              <span>${i(r||"School Document")}</span>
              <strong>${i(new Date().toLocaleDateString())}</strong>
            </div>
          </header>
          <section class="print-title">
            <p class="eyebrow">${i(r||"Official Print")}</p>
            <h2>${i(t)}</h2>
            ${a?`<p>${i(a)}</p>`:""}
          </section>
          ${n||""}
          <section class="print-body">${s}</section>
          <footer class="print-footer">
            <span>${i(x||"Generated from TOTTECH ONE")}</span>
            <span>Powered by TOTTECH ONE</span>
          </footer>
          ${o||""}
        </main>
      </body>
    </html>
  `}({branding:x,title:e,subtitle:s,documentLabel:o,metaHtml:l,bodyHtml:d,footerHtml:c,pageSize:u,verificationUrl:m,barcodeValue:h,qrDataUrl:b})),g.document.close(),g.focus(),window.setTimeout(()=>{g.print()},250)}function i(e){return e.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;")}async function r(){try{let e=await fetch("/api/my-school-branding",{cache:"no-store"});if(!e.ok)throw Error("Branding unavailable");return await e.json()}catch{return{schoolName:"TOTTECH ONE",schoolCode:"Gateway To Learning",logoUrl:"/images/logo.png",primaryColor:"#04142E",secondaryColor:"#D4AF37"}}}async function n(t){try{return(await e.A(673378)).toDataURL(t,{errorCorrectionLevel:"M",margin:1,width:120,color:{dark:"#111111",light:"#FFFFFF"}})}catch{return null}}e.s(["printBrandedDocument",0,a,"printMetaGrid",0,function(e){return`<div class="print-meta-grid">${e.map(e=>`
        <div class="print-meta-card">
          <span>${i(e.label)}</span>
          <strong>${i(String(e.value??"-"))}</strong>
        </div>
      `).join("")}</div>`}])},926441,e=>{"use strict";let t=(0,e.i(456420).default)("square-pen",[["path",{d:"M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7",key:"1m0v6g"}],["path",{d:"M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z",key:"ohrbg2"}]]);e.s(["Edit",0,t],926441)},207283,e=>{"use strict";var t=e.i(843476),a=e.i(772382),i=e.i(926441),r=e.i(226091),n=e.i(77071),s=e.i(77043),o=e.i(856522),l=e.i(573474),d=e.i(263676),c=e.i(271645),p=e.i(859015),u=e.i(920476),m=e.i(647629),h=e.i(462047);let f={class_id:"",section_id:"",academic_year_id:"",student_id:""},g={billing_scope:"STUDENT",class_id:"",section_id:"",student_id:"",due_date:"",installment_mode:"SINGLE",installment_count:"1"},x={invoice_date:"",due_date:"",total_amount:"",status:"PENDING"};function b({detail:e,onClose:a}){let i=e.invoice,r=e.line_items||[],n=e.installments||[],o=e.payments||[];return(0,t.jsxs)("section",{className:"tt-card tt-card-pad",children:[(0,t.jsxs)("div",{className:"mb-5 flex items-start justify-between gap-3",children:[(0,t.jsxs)("div",{className:"min-w-0",children:[(0,t.jsx)("p",{className:"text-xs font-black uppercase tracking-wide text-amber-700",children:"Invoice Details"}),(0,t.jsx)("h2",{className:"truncate text-2xl font-black text-slate-950",children:i.invoice_number||`Invoice ${i.id}`}),(0,t.jsx)("p",{className:"mt-1 text-sm font-semibold text-slate-600",children:i.student_name||`Student ${i.student_id||"-"}`})]}),(0,t.jsx)("button",{onClick:a,className:"inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700","aria-label":"Close invoice details",children:(0,t.jsx)(d.X,{size:18})})]}),(0,t.jsxs)("button",{onClick:()=>y(e),className:"mb-5 inline-flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-black text-amber-900",children:[(0,t.jsx)(s.Printer,{size:16}),"Print Invoice"]}),(0,t.jsxs)("div",{className:"grid gap-3 text-sm md:grid-cols-4",children:[(0,t.jsx)($,{label:"Total",value:`Rs. ${Number(i.total_amount||0)}`}),(0,t.jsx)($,{label:"Paid",value:`Rs. ${Number(i.paid_amount||0)}`}),(0,t.jsx)($,{label:"Balance",value:`Rs. ${Number(i.balance_amount||0)}`}),(0,t.jsx)($,{label:"Status",value:i.status||"PENDING"})]}),(0,t.jsxs)("div",{className:"mt-6 grid gap-4 lg:grid-cols-3",children:[(0,t.jsx)(w,{title:"Fee Items",rows:r,empty:"No fee line items recorded.",render:e=>`${e.fee_name||"Fee"} - Rs. ${Number(e.amount||0)}`}),(0,t.jsx)(w,{title:"Installments",rows:n,empty:"No installment parts recorded.",render:e=>`${e.part_label||`Part ${e.part_number}`} - Rs. ${Number(e.balance_amount||0)} due`}),(0,t.jsx)(w,{title:"Payments",rows:o,empty:"No payments collected yet.",render:e=>`${e.receipt_number||"Payment"} - Rs. ${Number(e.amount||0)}`})]})]})}async function y(e){let t=e.invoice,a=e.line_items||[],i=e.installments||[],r=e.payments||[],n=a.map(e=>`<tr><td>${j(String(e.fee_name||"Fee"))}</td><td>Rs. ${Number(e.amount||0)}</td></tr>`).join(""),s=i.map(e=>`<tr><td>${j(String(e.part_label||`Part ${e.part_number}`))}</td><td>${v(e.due_date)}</td><td>Rs. ${Number(e.amount||0)}</td><td>Rs. ${Number(e.balance_amount||0)}</td><td>${j(String(e.status||"-"))}</td></tr>`).join(""),o=r.map(e=>`<tr><td>${j(String(e.receipt_number||"Payment"))}</td><td>${v(e.payment_date||e.created_at)}</td><td>Rs. ${Number(e.amount||0)}</td><td>${j(String(e.payment_method||"-"))}</td></tr>`).join(""),l=t.invoice_number||`Invoice ${t.id}`,d=`${window.location.origin}/verify/invoice/${encodeURIComponent(String(l))}`;await (0,m.printBrandedDocument)({title:"Fee Invoice",subtitle:"Invoice particulars, installments, payments and current balance.",documentLabel:"Invoice",pageSize:"half",metaHtml:(0,m.printMetaGrid)([{label:"Invoice",value:l},{label:"Student",value:t.student_name||t.student_id||"-"},{label:"Class / Section",value:`${t.class_name||"-"} ${t.section_name||""}`.trim()},{label:"Due Date",value:v(t.due_date)}]),bodyHtml:`
      <div class="summary">
        <div>Total<br><strong>Rs. ${Number(t.total_amount||0)}</strong></div>
        <div>Paid<br><strong>Rs. ${Number(t.paid_amount||0)}</strong></div>
        <div>Balance<br><strong>Rs. ${Number(t.balance_amount||0)}</strong></div>
        <div>Status<br><strong>${j(String(t.status||"PENDING"))}</strong></div>
      </div>
      <h3 class="print-section-title">Fee Items</h3>
      <table><thead><tr><th>Fee</th><th>Amount</th></tr></thead><tbody>${n||"<tr><td colspan='2'>No fee line items.</td></tr>"}</tbody></table>
      <h3 class="print-section-title">Installments</h3>
      <table><thead><tr><th>Part</th><th>Due Date</th><th>Amount</th><th>Balance</th><th>Status</th></tr></thead><tbody>${s||"<tr><td colspan='5'>No installments.</td></tr>"}</tbody></table>
      <h3 class="print-section-title">Payments / Receipts</h3>
      <table><thead><tr><th>Receipt</th><th>Date</th><th>Amount</th><th>Method</th></tr></thead><tbody>${o||"<tr><td colspan='4'>No payments collected.</td></tr>"}</tbody></table>
	      <p class="sign">Authorized Signature</p>
	    `,verificationUrl:d,barcodeValue:String(l),popupError:"Allow popups to print this document."})}function v(e){return e?new Date(String(e)).toLocaleDateString():"-"}function j(e){return e.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;")}function w({title:e,rows:a,empty:i,render:r}){return(0,t.jsxs)("div",{className:"rounded-lg border border-slate-200 bg-slate-50 p-4",children:[(0,t.jsx)("h3",{className:"text-sm font-black uppercase text-slate-700",children:e}),(0,t.jsx)("div",{className:"mt-3 space-y-2",children:a.length?a.map((e,a)=>(0,t.jsx)("div",{className:"rounded-lg bg-white p-3 text-sm font-semibold text-slate-800 shadow-sm",children:r(e)},String(e.id??a))):(0,t.jsx)("p",{className:"text-sm text-slate-500",children:i})})]})}function _({label:e,value:a,onChange:i,type:r="text",min:n}){return(0,t.jsxs)("label",{className:"min-w-0",children:[(0,t.jsx)("span",{className:"mb-1 block text-sm font-bold text-slate-700",children:e}),(0,t.jsx)("input",{type:r,min:n,className:"input",value:a,onChange:e=>i(e.target.value)})]})}function k(){return new Date().toISOString().slice(0,10)}function N({label:e,value:a,onChange:i,children:r,disabled:n=!1}){return(0,t.jsxs)("label",{className:"min-w-0",children:[(0,t.jsx)("span",{className:"mb-1 block text-sm font-bold text-slate-700",children:e}),(0,t.jsx)("select",{className:"input",value:a,disabled:n,onChange:e=>i(e.target.value),children:r})]})}function $({label:e,value:a}){return(0,t.jsxs)("div",{className:"min-w-0",children:[(0,t.jsx)("p",{className:"text-xs font-bold uppercase text-slate-500",children:e}),(0,t.jsx)("p",{className:"truncate font-semibold text-slate-950",children:a})]})}e.s(["default",0,function(){let[e,m]=(0,c.useState)([]),[v,j]=(0,c.useState)([]),[w,S]=(0,c.useState)([]),[C,z]=(0,c.useState)([]),[E,M]=(0,c.useState)([]),[A,P]=(0,c.useState)([]),[T,O]=(0,c.useState)(g),[I,D]=(0,c.useState)([]),[L,R]=(0,c.useState)(""),[F,H]=(0,c.useState)(f),[U,B]=(0,c.useState)(!1),[G,V]=(0,c.useState)(null),[q,J]=(0,c.useState)(null),[K,W]=(0,c.useState)(x),[Y,X]=(0,c.useState)(null);async function Q(){try{let[e,t,a,i]=await Promise.all([(0,u.apiJson)("/api/roster"),(0,u.apiJson)("/api/fee-categories"),(0,u.apiJson)("/api/finance/invoices"),(0,u.apiJson)("/api/academic-years?include_all=true")]);m(Array.isArray(e.students)?e.students:[]),j(Array.isArray(e.classes)?e.classes:[]),S(Array.isArray(e.sections)?e.sections:[]),z(Array.isArray(t)?t:[]),M(a.invoices||[]),P(Array.isArray(i)?i:[])}catch(e){h.notify.error((0,u.errorMessage)(e,"Failed to load invoices"))}}(0,c.useEffect)(()=>{Promise.resolve().then(Q)},[]);let Z=w.filter(e=>!T.class_id||Number(e.class_id)===Number(T.class_id)),ee=(0,c.useMemo)(()=>e.filter(e=>{let t=!T.class_id||Number(e.class_id)===Number(T.class_id),a=!T.section_id||Number(e.section_id)===Number(T.section_id),i=`
            ${e.first_name||""}
            ${e.last_name||""}
            ${e.name||""}
            ${e.admission_number||""}
            ${e.phone||""}
          `.toLowerCase();return t&&a&&i.includes(L.toLowerCase())}),[e,T.class_id,T.section_id,L]),et=C.filter(e=>I.includes(String(e.id))).reduce((e,t)=>e+Number(t.amount||0),0),ea=w.filter(e=>!F.class_id||Number(e.class_id)===Number(F.class_id)),ei=e.filter(e=>{let t=!F.class_id||Number(e.class_id)===Number(F.class_id),a=!F.section_id||Number(e.section_id)===Number(F.section_id);return t&&a}),er=Object.values(F).filter(Boolean).length,en=er>=3,es=(0,c.useMemo)(()=>en?E.filter(e=>{let t=!F.class_id||String(e.class_id)===F.class_id,a=!F.section_id||String(e.section_id)===F.section_id,i=!F.academic_year_id||"all"===F.academic_year_id||String(e.academic_year_id??"")===F.academic_year_id,r=!F.student_id||String(e.student_id)===F.student_id;return t&&a&&i&&r}):[],[E,F,en]),eo="CLASS_SECTION"===T.billing_scope?ee.length:+!!T.student_id,el=async()=>{try{B(!0),await (0,u.apiJson)("/api/finance/invoices",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({billing_scope:T.billing_scope,class_id:T.class_id||null,section_id:T.section_id||null,student_ids:"STUDENT"===T.billing_scope?[T.student_id]:[],fee_category_ids:I,due_date:T.due_date||null,installment_mode:T.installment_mode,installment_count:T.installment_count})}),h.notify.success("Invoice generated"),O(g),D([]),R(""),H(f),Q()}catch(e){h.notify.error((0,u.errorMessage)(e,"Failed to generate invoice"))}finally{B(!1)}},ed=async e=>{try{X(e.id);let t=await (0,u.apiJson)(`/api/finance/invoices/${e.id}`);V(t),J(null)}catch(e){h.notify.error((0,u.errorMessage)(e,"Failed to open invoice"))}finally{X(null)}},ec=async()=>{if(q)try{X(q.id),await (0,u.apiJson)(`/api/finance/invoices/${q.id}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify(K)}),h.notify.success("Invoice updated"),J(null),W(x),await Q()}catch(e){h.notify.error((0,u.errorMessage)(e,"Failed to update invoice"))}finally{X(null)}},ep=async e=>{if(confirm(`Delete invoice ${e.invoice_number||e.id}? Paid invoices cannot be deleted.`))try{X(e.id),await (0,u.apiJson)(`/api/finance/invoices/${e.id}`,{method:"DELETE"}),h.notify.success("Invoice deleted"),V(null),J(null),await Q()}catch(e){h.notify.error((0,u.errorMessage)(e,"Failed to delete invoice"))}finally{X(null)}},eu=async e=>{try{X(e.id);let t=await (0,u.apiJson)(`/api/finance/invoices/${e.id}`);if(!t.invoice)throw Error("Invoice details are missing.");y(t)}catch(e){h.notify.error((0,u.errorMessage)(e,"Failed to print invoice"))}finally{X(null)}};return(0,t.jsx)(p.default,{children:(0,t.jsxs)("div",{className:"space-y-6",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("h1",{className:"text-3xl font-black md:text-4xl",children:"Invoices"}),(0,t.jsx)("p",{className:"mt-1 text-sm text-slate-600",children:"Generate student, class, and section invoices with fee structures and installment parts."})]}),(0,t.jsxs)("div",{className:"tt-card tt-card-pad",children:[(0,t.jsx)("h2",{className:"mb-4 text-xl font-black",children:"Generate Invoice"}),(0,t.jsxs)("div",{className:"grid gap-4 md:grid-cols-2 xl:grid-cols-4",children:[(0,t.jsxs)(N,{label:"Invoice For",value:T.billing_scope,onChange:e=>O({...T,billing_scope:e,student_id:""}),children:[(0,t.jsx)("option",{value:"STUDENT",children:"One Student"}),(0,t.jsx)("option",{value:"CLASS_SECTION",children:"Class / Section"})]}),(0,t.jsxs)(N,{label:"Class",value:T.class_id,onChange:e=>O({...T,class_id:e,section_id:"",student_id:""}),children:[(0,t.jsx)("option",{value:"",children:"Select Class"}),v.map(e=>(0,t.jsx)("option",{value:e.id,children:e.class_name},e.id))]}),(0,t.jsxs)(N,{label:"Section",value:T.section_id,onChange:e=>O({...T,section_id:e,student_id:""}),disabled:!T.class_id,children:[(0,t.jsx)("option",{value:"",children:"All Sections"}),Z.map(e=>(0,t.jsx)("option",{value:e.id,children:e.section_name},e.id))]}),(0,t.jsx)(_,{label:"Due Date",type:"date",min:k(),value:T.due_date,onChange:e=>O({...T,due_date:e})}),"STUDENT"===T.billing_scope&&(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(_,{label:"Search Student",value:L,onChange:R}),(0,t.jsxs)(N,{label:"Student",value:T.student_id,onChange:e=>O({...T,student_id:e}),children:[(0,t.jsx)("option",{value:"",children:"Select Student"}),ee.map(e=>(0,t.jsxs)("option",{value:e.id,children:[e.first_name||e.name||`Student ${e.id}`,e.last_name?` ${e.last_name}`:"",e.admission_number?` - ${e.admission_number}`:""]},e.id))]})]}),(0,t.jsxs)(N,{label:"Payment Parts",value:T.installment_mode,onChange:e=>O({...T,installment_mode:e,installment_count:"SINGLE"===e?"1":"3"}),children:[(0,t.jsx)("option",{value:"SINGLE",children:"Single Invoice"}),(0,t.jsx)("option",{value:"MONTHLY",children:"Monthly Parts"}),(0,t.jsx)("option",{value:"QUARTERLY",children:"Quarterly Parts"})]}),"SINGLE"!==T.installment_mode&&(0,t.jsx)(_,{label:"Number of Parts",value:T.installment_count,onChange:e=>O({...T,installment_count:e})})]}),(0,t.jsx)("div",{className:"mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4",children:C.map(e=>(0,t.jsxs)("label",{className:"flex min-w-0 items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3",children:[(0,t.jsx)("input",{type:"checkbox",checked:I.includes(String(e.id)),onChange:()=>{var t;return t=String(e.id),void D(e=>e.includes(t)?e.filter(e=>e!==t):[...e,t])},className:"mt-1"}),(0,t.jsxs)("span",{className:"min-w-0",children:[(0,t.jsx)("span",{className:"block truncate text-sm font-bold text-slate-950",children:e.fee_name}),(0,t.jsxs)("span",{className:"block text-sm text-amber-700",children:["Rs."," ",Number(e.amount||0)]})]})]},e.id))}),(0,t.jsxs)("div",{className:"mt-5 flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 md:flex-row md:items-center md:justify-between",children:[(0,t.jsxs)("div",{className:"min-w-0 text-sm text-slate-700",children:[(0,t.jsx)("strong",{className:"text-slate-950",children:eo})," ","invoice target(s), selected fee total"," ",(0,t.jsxs)("strong",{className:"text-slate-950",children:["Rs. ",et]})]}),(0,t.jsxs)("button",{onClick:el,disabled:U,className:"tt-button inline-flex items-center justify-center gap-2",children:[(0,t.jsx)(n.Plus,{size:17}),U?"Generating...":"Generate"]})]})]}),(0,t.jsxs)("section",{className:"tt-card tt-card-pad",children:[(0,t.jsxs)("div",{className:"flex flex-col gap-3 md:flex-row md:items-end md:justify-between",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("h2",{className:"text-xl font-black",children:"Generated Invoices"}),(0,t.jsx)("p",{className:"mt-1 text-sm font-semibold text-slate-500",children:"Search invoices by selecting any three fields: class, section, academic year, and student name."})]}),(0,t.jsx)("button",{type:"button",onClick:()=>H(f),className:"rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-700",children:"Clear Filters"})]}),(0,t.jsxs)("div",{className:"mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4",children:[(0,t.jsxs)(N,{label:"Class",value:F.class_id,onChange:e=>H(t=>({...t,class_id:e,section_id:"",student_id:""})),children:[(0,t.jsx)("option",{value:"",children:"Select Class"}),v.map(e=>(0,t.jsx)("option",{value:e.id,children:e.class_name||`Class ${e.id}`},e.id))]}),(0,t.jsxs)(N,{label:"Section",value:F.section_id,onChange:e=>H(t=>({...t,section_id:e,student_id:""})),disabled:!F.class_id,children:[(0,t.jsx)("option",{value:"",children:"Select Section"}),ea.map(e=>(0,t.jsx)("option",{value:e.id,children:e.section_name||`Section ${e.id}`},e.id))]}),(0,t.jsxs)(N,{label:"Academic Year",value:F.academic_year_id,onChange:e=>H(t=>({...t,academic_year_id:e})),children:[(0,t.jsx)("option",{value:"",children:"Select Academic Year"}),A.map(e=>(0,t.jsx)("option",{value:e.id,children:e.academic_year||`Year ${e.id}`},e.id))]}),(0,t.jsxs)(N,{label:"Student Name",value:F.student_id,onChange:e=>H(t=>({...t,student_id:e})),children:[(0,t.jsx)("option",{value:"",children:"Select Student"}),ei.map(e=>(0,t.jsxs)("option",{value:e.id,children:[e.first_name||e.name||`Student ${e.id}`,e.last_name?` ${e.last_name}`:"",e.admission_number?` - ${e.admission_number}`:""]},e.id))]})]}),(0,t.jsx)("div",{className:"mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm font-bold text-slate-700",children:en?(0,t.jsxs)(t.Fragment,{children:["Showing"," ",(0,t.jsx)("span",{className:"text-slate-950",children:es.length})," ","of"," ",(0,t.jsx)("span",{className:"text-slate-950",children:E.length})," ","generated invoices"]}):(0,t.jsxs)(t.Fragment,{children:["Select at least"," ",(0,t.jsx)("span",{className:"text-slate-950",children:Math.max(0,3-er)})," ","more filter",3-er==1?"":"s"," ","to search invoices."]})})]}),(0,t.jsxs)("div",{className:"grid gap-4 md:grid-cols-2 xl:grid-cols-3",children:[es.map(e=>(0,t.jsxs)("article",{className:"tt-card tt-card-pad",children:[(0,t.jsxs)("div",{className:"flex items-start justify-between gap-3",children:[(0,t.jsxs)("div",{className:"min-w-0",children:[(0,t.jsx)("h2",{className:"truncate text-lg font-black",children:e.invoice_number||`Invoice ${e.id}`}),(0,t.jsx)("p",{className:"truncate text-sm font-semibold text-amber-700",children:e.student_name||`Student ${e.student_id||"-"}`})]}),(0,t.jsx)(r.FileText,{size:22,className:"shrink-0 text-slate-950"})]}),(0,t.jsxs)("div",{className:"mt-4 grid grid-cols-2 gap-3 text-sm",children:[(0,t.jsx)($,{label:"Class",value:`${e.class_name||"-"}${e.section_name?` ${e.section_name}`:""}`}),(0,t.jsx)($,{label:"Parts",value:`${e.billing_period||"SINGLE"} \xb7 ${e.installment_count||1}`})]}),(0,t.jsxs)("div",{className:"mt-5 grid grid-cols-3 gap-3 text-sm",children:[(0,t.jsx)($,{label:"Total",value:`Rs. ${Number(e.total_amount||0)}`}),(0,t.jsx)($,{label:"Paid",value:`Rs. ${Number(e.paid_amount||0)}`}),(0,t.jsx)($,{label:"Balance",value:`Rs. ${Number(e.balance_amount||0)}`})]}),(0,t.jsxs)("div",{className:"mt-5 flex items-center justify-between gap-3",children:[(0,t.jsx)("span",{className:"tt-badge",children:e.status||"PENDING"}),(0,t.jsxs)("span",{className:"truncate text-sm text-slate-600",children:["Due"," ",e.due_date?new Date(e.due_date).toLocaleDateString():"-"]})]}),(0,t.jsxs)("div",{className:"mt-5 grid grid-cols-2 gap-2 xl:grid-cols-4",children:[(0,t.jsxs)("button",{onClick:()=>ed(e),disabled:Y===e.id,className:"inline-flex items-center justify-center gap-1.5 rounded-lg bg-slate-950 px-3 py-2.5 text-sm font-bold text-white",children:[(0,t.jsx)(a.Eye,{size:15}),"View"]}),(0,t.jsxs)("button",{onClick:()=>eu(e),disabled:Y===e.id,className:"inline-flex items-center justify-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-sm font-bold text-amber-900",children:[(0,t.jsx)(s.Printer,{size:15}),"Print"]}),(0,t.jsxs)("button",{onClick:()=>{V(null),J(e),W({invoice_date:"",due_date:e.due_date?String(e.due_date).slice(0,10):"",total_amount:String(e.total_amount||0),status:e.status||"PENDING"})},className:"inline-flex items-center justify-center gap-1.5 rounded-lg bg-slate-100 px-3 py-2.5 text-sm font-bold text-slate-950",children:[(0,t.jsx)(i.Edit,{size:15}),"Edit"]}),(0,t.jsxs)("button",{onClick:()=>ep(e),disabled:Y===e.id,className:"inline-flex items-center justify-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm font-bold text-red-700",children:[(0,t.jsx)(l.Trash2,{size:15}),"Delete"]})]})]},e.id)),es.length?null:(0,t.jsx)("div",{className:"tt-card tt-card-pad md:col-span-2 xl:col-span-3",children:(0,t.jsx)("p",{className:"font-bold text-slate-600",children:"No invoices match the current search."})})]}),q?(0,t.jsxs)("section",{className:"tt-card tt-card-pad",children:[(0,t.jsxs)("div",{className:"mb-5 flex items-start justify-between gap-3",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("p",{className:"text-xs font-black uppercase tracking-wide text-amber-700",children:"Edit Invoice"}),(0,t.jsx)("h2",{className:"text-2xl font-black text-slate-950",children:q.invoice_number||`Invoice ${q.id}`})]}),(0,t.jsx)("button",{onClick:()=>J(null),className:"inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700","aria-label":"Close invoice editor",children:(0,t.jsx)(d.X,{size:18})})]}),(0,t.jsxs)("div",{className:"grid gap-4 md:grid-cols-2 xl:grid-cols-4",children:[(0,t.jsx)(_,{label:"Due Date",type:"date",min:k(),value:K.due_date,onChange:e=>W({...K,due_date:e})}),(0,t.jsx)(_,{label:"Total Amount",value:K.total_amount,onChange:e=>W({...K,total_amount:e})}),(0,t.jsxs)(N,{label:"Status",value:K.status,onChange:e=>W({...K,status:e}),children:[(0,t.jsx)("option",{value:"PENDING",children:"Pending"}),(0,t.jsx)("option",{value:"PARTIAL",children:"Partial"}),(0,t.jsx)("option",{value:"PAID",children:"Paid"}),(0,t.jsx)("option",{value:"CANCELLED",children:"Cancelled"})]})]}),(0,t.jsxs)("button",{onClick:ec,disabled:Y===q.id,className:"tt-button mt-5 inline-flex items-center gap-2",children:[(0,t.jsx)(o.Save,{size:17}),Y===q.id?"Saving...":"Save Invoice"]})]}):null,G?.invoice?(0,t.jsx)(b,{detail:G,onClose:()=>V(null)}):null]})})}])},673378,e=>{e.v(t=>Promise.all(["static/chunks/0kauo_1p4s347.js"].map(t=>e.l(t))).then(()=>t(973134)))}]);