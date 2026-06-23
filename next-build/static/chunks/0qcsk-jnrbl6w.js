(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,270904,e=>{"use strict";let t=(0,e.i(456420).default)("wallet",[["path",{d:"M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1",key:"18etb6"}],["path",{d:"M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4",key:"xoc0q4"}]]);e.s(["Wallet",0,t],270904)},195057,(e,t,a)=>{"use strict";Object.defineProperty(a,"__esModule",{value:!0});var r={formatUrl:function(){return o},formatWithValidation:function(){return c},urlObjectKeys:function(){return l}};for(var s in r)Object.defineProperty(a,s,{enumerable:!0,get:r[s]});let i=e.r(190809)._(e.r(998183)),n=/https?|ftp|gopher|file/;function o(e){let{auth:t,hostname:a}=e,r=e.protocol||"",s=e.pathname||"",o=e.hash||"",l=e.query||"",c=!1;t=t?encodeURIComponent(t).replace(/%3A/i,":")+"@":"",e.host?c=t+e.host:a&&(c=t+(~a.indexOf(":")?`[${a}]`:a),e.port&&(c+=":"+e.port)),l&&"object"==typeof l&&(l=String(i.urlQueryToSearchParams(l)));let d=e.search||l&&`?${l}`||"";return r&&!r.endsWith(":")&&(r+=":"),e.slashes||(!r||n.test(r))&&!1!==c?(c="//"+(c||""),s&&"/"!==s[0]&&(s="/"+s)):c||(c=""),o&&"#"!==o[0]&&(o="#"+o),d&&"?"!==d[0]&&(d="?"+d),s=s.replace(/[?#]/g,encodeURIComponent),d=d.replace("#","%23"),`${r}${c}${s}${d}${o}`}let l=["auth","hash","host","hostname","href","path","pathname","port","protocol","query","search","slashes"];function c(e){return o(e)}},573668,(e,t,a)=>{"use strict";Object.defineProperty(a,"__esModule",{value:!0}),Object.defineProperty(a,"isLocalURL",{enumerable:!0,get:function(){return i}});let r=e.r(718967),s=e.r(652817);function i(e){if(!(0,r.isAbsoluteUrl)(e))return!0;try{let t=(0,r.getLocationOrigin)(),a=new URL(e,t);return a.origin===t&&(0,s.hasBasePath)(a.pathname)}catch(e){return!1}}},284508,(e,t,a)=>{"use strict";Object.defineProperty(a,"__esModule",{value:!0}),Object.defineProperty(a,"errorOnce",{enumerable:!0,get:function(){return r}});let r=e=>{}},522016,(e,t,a)=>{"use strict";Object.defineProperty(a,"__esModule",{value:!0});var r={default:function(){return x},useLinkStatus:function(){return b}};for(var s in r)Object.defineProperty(a,s,{enumerable:!0,get:r[s]});let i=e.r(190809),n=e.r(843476),o=i._(e.r(271645)),l=e.r(195057),c=e.r(8372),d=e.r(818581),u=e.r(718967),p=e.r(405550);e.r(233525);let h=e.r(388540),m=e.r(91949),f=e.r(573668),y=e.r(509396);function x(t){var a,r;let s,i,x,[b,v]=(0,o.useOptimistic)(m.IDLE_LINK_STATUS),k=(0,o.useRef)(null),{href:j,as:w,children:_,prefetch:M=null,passHref:C,replace:N,shallow:E,scroll:S,onClick:O,onMouseEnter:A,onTouchStart:P,legacyBehavior:T=!1,onNavigate:D,transitionTypes:L,ref:$,unstable_dynamicOnHover:R,...I}=t;s=_,T&&("string"==typeof s||"number"==typeof s)&&(s=(0,n.jsx)("a",{children:s}));let z=o.default.useContext(c.AppRouterContext),U=!1!==M,H=!1!==M?null===(r=M)||"auto"===r?y.FetchStrategy.PPR:y.FetchStrategy.Full:y.FetchStrategy.PPR,F="string"==typeof(a=w||j)?a:(0,l.formatUrl)(a);if(T){if(s?.$$typeof===Symbol.for("react.lazy"))throw Object.defineProperty(Error("`<Link legacyBehavior>` received a direct child that is either a Server Component, or JSX that was loaded with React.lazy(). This is not supported. Either remove legacyBehavior, or make the direct child a Client Component that renders the Link's `<a>` tag."),"__NEXT_ERROR_CODE",{value:"E863",enumerable:!1,configurable:!0});i=o.default.Children.only(s)}let B=T?i&&"object"==typeof i&&i.ref:$,J=o.default.useCallback(e=>(null!==z&&(k.current=(0,m.mountLinkInstance)(e,F,z,H,U,v)),()=>{k.current&&((0,m.unmountLinkForCurrentNavigation)(k.current),k.current=null),(0,m.unmountPrefetchableInstance)(e)}),[U,F,z,H,v]),V={ref:(0,d.useMergedRef)(J,B),onClick(t){T||"function"!=typeof O||O(t),T&&i.props&&"function"==typeof i.props.onClick&&i.props.onClick(t),!z||t.defaultPrevented||function(t,a,r,s,i,n,l){if("u">typeof window){let c,{nodeName:d}=t.currentTarget;if("A"===d.toUpperCase()&&((c=t.currentTarget.getAttribute("target"))&&"_self"!==c||t.metaKey||t.ctrlKey||t.shiftKey||t.altKey||t.nativeEvent&&2===t.nativeEvent.which)||t.currentTarget.hasAttribute("download"))return;if(!(0,f.isLocalURL)(a)){s&&(t.preventDefault(),location.replace(a));return}if(t.preventDefault(),n){let e=!1;if(n({preventDefault:()=>{e=!0}}),e)return}let{dispatchNavigateAction:u}=e.r(699781);o.default.startTransition(()=>{u(a,s?"replace":"push",!1===i?h.ScrollBehavior.NoScroll:h.ScrollBehavior.Default,r.current,l)})}}(t,F,k,N,S,D,L)},onMouseEnter(e){T||"function"!=typeof A||A(e),T&&i.props&&"function"==typeof i.props.onMouseEnter&&i.props.onMouseEnter(e),z&&U&&(0,m.onNavigationIntent)(e.currentTarget,!0===R)},onTouchStart:function(e){T||"function"!=typeof P||P(e),T&&i.props&&"function"==typeof i.props.onTouchStart&&i.props.onTouchStart(e),z&&U&&(0,m.onNavigationIntent)(e.currentTarget,!0===R)}};return(0,u.isAbsoluteUrl)(F)?V.href=F:T&&!C&&("a"!==i.type||"href"in i.props)||(V.href=(0,p.addBasePath)(F)),x=T?o.default.cloneElement(i,V):(0,n.jsx)("a",{...I,...V,children:s}),(0,n.jsx)(g.Provider,{value:b,children:x})}e.r(284508);let g=(0,o.createContext)(m.IDLE_LINK_STATUS),b=()=>(0,o.useContext)(g);("function"==typeof a.default||"object"==typeof a.default&&null!==a.default)&&void 0===a.default.__esModule&&(Object.defineProperty(a.default,"__esModule",{value:!0}),Object.assign(a.default,a),t.exports=a.default)},396661,505014,e=>{"use strict";let t=(...e)=>e.filter((e,t,a)=>!!e&&""!==e.trim()&&a.indexOf(e)===t).join(" ").trim();e.s(["mergeClasses",0,t],396661);var a=e.i(271645),r={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};let s=(0,a.createContext)({}),i=(0,a.forwardRef)(({color:e,size:i,strokeWidth:n,absoluteStrokeWidth:o,className:l="",children:c,iconNode:d,...u},p)=>{let{size:h=24,strokeWidth:m=2,absoluteStrokeWidth:f=!1,color:y="currentColor",className:x=""}=(0,a.useContext)(s)??{},g=o??f?24*Number(n??m)/Number(i??h):n??m;return(0,a.createElement)("svg",{ref:p,...r,width:i??h??r.width,height:i??h??r.height,stroke:e??y,strokeWidth:g,className:t("lucide",x,l),...!c&&!(e=>{for(let t in e)if(t.startsWith("aria-")||"role"===t||"title"===t)return!0;return!1})(u)&&{"aria-hidden":"true"},...u},[...d.map(([e,t])=>(0,a.createElement)(e,t)),...Array.isArray(c)?c:[c]])});e.s(["default",0,i],505014)},618566,(e,t,a)=>{t.exports=e.r(976562)},146387,456420,e=>{"use strict";var t=e.i(271645),a=e.i(396661);let r=e=>{let t=e.replace(/^([A-Z])|[\s-_]+(\w)/g,(e,t,a)=>a?a.toUpperCase():t.toLowerCase());return t.charAt(0).toUpperCase()+t.slice(1)};var s=e.i(505014);let i=(e,i)=>{let n=(0,t.forwardRef)(({className:n,...o},l)=>(0,t.createElement)(s.default,{ref:l,iconNode:i,className:(0,a.mergeClasses)(`lucide-${r(e).replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase()}`,`lucide-${e}`,n),...o}));return n.displayName=r(e),n};e.s(["default",0,i],456420);let n=i("building-2",[["path",{d:"M10 12h4",key:"a56b0p"}],["path",{d:"M10 8h4",key:"1sr2af"}],["path",{d:"M14 21v-3a2 2 0 0 0-4 0v3",key:"1rgiei"}],["path",{d:"M6 10H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2",key:"secmi2"}],["path",{d:"M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16",key:"16ra0t"}]]);e.s(["Building2",0,n],146387)},818581,(e,t,a)=>{"use strict";Object.defineProperty(a,"__esModule",{value:!0}),Object.defineProperty(a,"useMergedRef",{enumerable:!0,get:function(){return s}});let r=e.r(271645);function s(e,t){let a=(0,r.useRef)(null),s=(0,r.useRef)(null);return(0,r.useCallback)(r=>{if(null===r){let e=a.current;e&&(a.current=null,e());let t=s.current;t&&(s.current=null,t())}else e&&(a.current=i(e,r)),t&&(s.current=i(t,r))},[e,t])}function i(e,t){if("function"!=typeof e)return e.current=t,()=>{e.current=null};{let a=e(t);return"function"==typeof a?a:()=>e(null)}}("function"==typeof a.default||"object"==typeof a.default&&null!==a.default)&&void 0===a.default.__esModule&&(Object.defineProperty(a.default,"__esModule",{value:!0}),Object.assign(a.default,a),t.exports=a.default)},823482,e=>{"use strict";let t=(0,e.i(456420).default)("graduation-cap",[["path",{d:"M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z",key:"j76jl0"}],["path",{d:"M22 10v6",key:"1lu8f3"}],["path",{d:"M6 12.5V16a6 3 0 0 0 12 0v-3.5",key:"1r8lef"}]]);e.s(["GraduationCap",0,t],823482)},370812,e=>{"use strict";let t=(0,e.i(456420).default)("bell",[["path",{d:"M10.268 21a2 2 0 0 0 3.464 0",key:"vwvbt9"}],["path",{d:"M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326",key:"11g9vi"}]]);e.s(["Bell",0,t],370812)},716327,867927,e=>{"use strict";var t=e.i(456420);let a=(0,t.default)("chevron-down",[["path",{d:"m6 9 6 6 6-6",key:"qrunsl"}]]);e.s(["ChevronDown",0,a],716327);let r=(0,t.default)("chevron-right",[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]]);e.s(["ChevronRight",0,r],867927)},55677,e=>{"use strict";let t=(0,e.i(456420).default)("clipboard-list",[["rect",{width:"8",height:"4",x:"8",y:"2",rx:"1",ry:"1",key:"tgr4d6"}],["path",{d:"M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",key:"116196"}],["path",{d:"M12 11h4",key:"1jrz19"}],["path",{d:"M12 16h4",key:"n85exb"}],["path",{d:"M8 11h.01",key:"1dfujw"}],["path",{d:"M8 16h.01",key:"18s6g9"}]]);e.s(["ClipboardList",0,t],55677)},166794,e=>{"use strict";let t=(0,e.i(456420).default)("settings",[["path",{d:"M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915",key:"1i5ecw"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);e.s(["Settings",0,t],166794)},584026,e=>{"use strict";let t=(0,e.i(456420).default)("shield-check",[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]]);e.s(["ShieldCheck",0,t],584026)},779432,e=>{"use strict";let t=(0,e.i(456420).default)("activity",[["path",{d:"M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2",key:"169zse"}]]);e.s(["Activity",0,t],779432)},367784,593583,e=>{"use strict";var t=e.i(456420);let a=(0,t.default)("log-out",[["path",{d:"m16 17 5-5-5-5",key:"1bji2h"}],["path",{d:"M21 12H9",key:"dn1m92"}],["path",{d:"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",key:"1uf3rs"}]]);e.s(["LogOut",0,a],367784);let r=(0,t.default)("menu",[["path",{d:"M4 5h16",key:"1tepv9"}],["path",{d:"M4 12h16",key:"1lakjw"}],["path",{d:"M4 19h16",key:"1djgab"}]]);e.s(["Menu",0,r],593583)},749803,e=>{"use strict";let t=(0,e.i(456420).default)("chart-column",[["path",{d:"M3 3v16a2 2 0 0 0 2 2h16",key:"c24i48"}],["path",{d:"M18 17V9",key:"2bz60n"}],["path",{d:"M13 17V5",key:"1frdt8"}],["path",{d:"M8 17v-3",key:"17ska0"}]]);e.s(["BarChart3",0,t],749803)},566595,e=>{"use strict";let t=(0,e.i(456420).default)("search",[["path",{d:"m21 21-4.34-4.34",key:"14j7rj"}],["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}]]);e.s(["Search",0,t],566595)},263676,e=>{"use strict";let t=(0,e.i(456420).default)("x",[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]]);e.s(["X",0,t],263676)},705766,e=>{"use strict";let t,a;var r,s=e.i(271645);let i={data:""},n=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,o=/\/\*[^]*?\*\/|  +/g,l=/\n+/g,c=(e,t)=>{let a="",r="",s="";for(let i in e){let n=e[i];"@"==i[0]?"i"==i[1]?a=i+" "+n+";":r+="f"==i[1]?c(n,i):i+"{"+c(n,"k"==i[1]?"":t)+"}":"object"==typeof n?r+=c(n,t?t.replace(/([^,])+/g,e=>i.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,t=>/&/.test(t)?t.replace(/&/g,e):e?e+" "+t:t)):i):null!=n&&(i="-"==i[1]?i:i.replace(/[A-Z]/g,"-$&").toLowerCase(),s+=c.p?c.p(i,n):i+":"+n+";")}return a+(t&&s?t+"{"+s+"}":s)+r},d={},u=e=>{if("object"==typeof e){let t="";for(let a in e)t+=a+u(e[a]);return t}return e};function p(e){let t,a,r=this||{},s=e.call?e(r.p):e;return((e,t,a,r,s)=>{var i;let p=u(e),h=d[p]||(d[p]=(e=>{let t=0,a=11;for(;t<e.length;)a=101*a+e.charCodeAt(t++)>>>0;return"go"+a})(p));if(!d[h]){let t=p!==e?e:(e=>{let t,a,r=[{}];for(;t=n.exec(e.replace(o,""));)t[4]?r.shift():t[3]?(a=t[3].replace(l," ").trim(),r.unshift(r[0][a]=r[0][a]||{})):r[0][t[1]]=t[2].replace(l," ").trim();return r[0]})(e);d[h]=c(s?{["@keyframes "+h]:t}:t,a?"":"."+h)}let m=a&&d.g;return a&&(d.g=d[h]),i=d[h],m?t.data=t.data.replace(m,i):-1===t.data.indexOf(i)&&(t.data=r?i+t.data:t.data+i),h})(s.unshift?s.raw?(t=[].slice.call(arguments,1),a=r.p,s.reduce((e,r,s)=>{let i=t[s];if(i&&i.call){let e=i(a),t=e&&e.props&&e.props.className||/^go/.test(e)&&e;i=t?"."+t:e&&"object"==typeof e?e.props?"":c(e,""):!1===e?"":e}return e+r+(null==i?"":i)},"")):s.reduce((e,t)=>Object.assign(e,t&&t.call?t(r.p):t),{}):s,(e=>{if("object"==typeof window){let t=(e?e.querySelector("#_goober"):window._goober)||Object.assign(document.createElement("style"),{innerHTML:" ",id:"_goober"});return t.nonce=window.__nonce__,t.parentNode||(e||document.head).appendChild(t),t.firstChild}return e||i})(r.target),r.g,r.o,r.k)}p.bind({g:1});let h,m,f,y=p.bind({k:1});function x(e,t){let a=this||{};return function(){let r=arguments;function s(i,n){let o=Object.assign({},i),l=o.className||s.className;a.p=Object.assign({theme:m&&m()},o),a.o=/go\d/.test(l),o.className=p.apply(a,r)+(l?" "+l:""),t&&(o.ref=n);let c=e;return e[0]&&(c=o.as||e,delete o.as),f&&c[0]&&f(o),h(c,o)}return t?t(s):s}}var g=(e,t)=>"function"==typeof e?e(t):e,b=(t=0,()=>(++t).toString()),v=()=>{if(void 0===a&&"u">typeof window){let e=matchMedia("(prefers-reduced-motion: reduce)");a=!e||e.matches}return a},k="default",j=(e,t)=>{let{toastLimit:a}=e.settings;switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,a)};case 1:return{...e,toasts:e.toasts.map(e=>e.id===t.toast.id?{...e,...t.toast}:e)};case 2:let{toast:r}=t;return j(e,{type:+!!e.toasts.find(e=>e.id===r.id),toast:r});case 3:let{toastId:s}=t;return{...e,toasts:e.toasts.map(e=>e.id===s||void 0===s?{...e,dismissed:!0,visible:!1}:e)};case 4:return void 0===t.toastId?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(e=>e.id!==t.toastId)};case 5:return{...e,pausedAt:t.time};case 6:let i=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(e=>({...e,pauseDuration:e.pauseDuration+i}))}}},w=[],_={toasts:[],pausedAt:void 0,settings:{toastLimit:20}},M={},C=(e,t=k)=>{M[t]=j(M[t]||_,e),w.forEach(([e,a])=>{e===t&&a(M[t])})},N=e=>Object.keys(M).forEach(t=>C(e,t)),E=(e=k)=>t=>{C(t,e)},S={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},O=e=>(t,a)=>{let r,s=((e,t="blank",a)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:t,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...a,id:(null==a?void 0:a.id)||b()}))(t,e,a);return E(s.toasterId||(r=s.id,Object.keys(M).find(e=>M[e].toasts.some(e=>e.id===r))))({type:2,toast:s}),s.id},A=(e,t)=>O("blank")(e,t);A.error=O("error"),A.success=O("success"),A.loading=O("loading"),A.custom=O("custom"),A.dismiss=(e,t)=>{let a={type:3,toastId:e};t?E(t)(a):N(a)},A.dismissAll=e=>A.dismiss(void 0,e),A.remove=(e,t)=>{let a={type:4,toastId:e};t?E(t)(a):N(a)},A.removeAll=e=>A.remove(void 0,e),A.promise=(e,t,a)=>{let r=A.loading(t.loading,{...a,...null==a?void 0:a.loading});return"function"==typeof e&&(e=e()),e.then(e=>{let s=t.success?g(t.success,e):void 0;return s?A.success(s,{id:r,...a,...null==a?void 0:a.success}):A.dismiss(r),e}).catch(e=>{let s=t.error?g(t.error,e):void 0;s?A.error(s,{id:r,...a,...null==a?void 0:a.error}):A.dismiss(r)}),e};var P=1e3,T=y`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,D=y`
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
}`,$=x("div")`
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
    animation: ${D} 0.15s ease-out forwards;
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
`,R=y`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,I=x("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||"#e0e0e0"};
  border-right-color: ${e=>e.primary||"#616161"};
  animation: ${R} 1s linear infinite;
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
}`,H=x("div")`
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
`,F=x("div")`
  position: absolute;
`,B=x("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,J=y`
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
  animation: ${J} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,K=({toast:e})=>{let{icon:t,type:a,iconTheme:r}=e;return void 0!==t?"string"==typeof t?s.createElement(V,null,t):t:"blank"===a?null:s.createElement(B,null,s.createElement(I,{...r}),"loading"!==a&&s.createElement(F,null,"error"===a?s.createElement($,{...r}):s.createElement(H,{...r})))},W=x("div")`
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
`,X=s.memo(({toast:e,position:t,style:a,children:r})=>{let i=e.height?((e,t)=>{let a=e.includes("top")?1:-1,[r,s]=v()?["0%{opacity:0;} 100%{opacity:1;}","0%{opacity:1;} 100%{opacity:0;}"]:[`
0% {transform: translate3d(0,${-200*a}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${-150*a}%,-1px) scale(.6); opacity:0;}
`];return{animation:t?`${y(r)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${y(s)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}})(e.position||t||"top-center",e.visible):{opacity:0},n=s.createElement(K,{toast:e}),o=s.createElement(q,{...e.ariaProps},g(e.message,e));return s.createElement(W,{className:e.className,style:{...i,...a,...e.style}},"function"==typeof r?r({icon:n,message:o}):s.createElement(s.Fragment,null,n,o))});r=s.createElement,c.p=void 0,h=r,m=void 0,f=void 0;var Z=({id:e,className:t,style:a,onHeightUpdate:r,children:i})=>{let n=s.useCallback(t=>{if(t){let a=()=>{r(e,t.getBoundingClientRect().height)};a(),new MutationObserver(a).observe(t,{subtree:!0,childList:!0,characterData:!0})}},[e,r]);return s.createElement("div",{ref:n,className:t,style:a},i)},G=p`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`;e.s(["Toaster",0,({reverseOrder:e,position:t="top-center",toastOptions:a,gutter:r,children:i,toasterId:n,containerStyle:o,containerClassName:l})=>{let{toasts:c,handlers:d}=((e,t="default")=>{let{toasts:a,pausedAt:r}=((e={},t=k)=>{let[a,r]=(0,s.useState)(M[t]||_),i=(0,s.useRef)(M[t]);(0,s.useEffect)(()=>(i.current!==M[t]&&r(M[t]),w.push([t,r]),()=>{let e=w.findIndex(([e])=>e===t);e>-1&&w.splice(e,1)}),[t]);let n=a.toasts.map(t=>{var a,r,s;return{...e,...e[t.type],...t,removeDelay:t.removeDelay||(null==(a=e[t.type])?void 0:a.removeDelay)||(null==e?void 0:e.removeDelay),duration:t.duration||(null==(r=e[t.type])?void 0:r.duration)||(null==e?void 0:e.duration)||S[t.type],style:{...e.style,...null==(s=e[t.type])?void 0:s.style,...t.style}}});return{...a,toasts:n}})(e,t),i=(0,s.useRef)(new Map).current,n=(0,s.useCallback)((e,t=P)=>{if(i.has(e))return;let a=setTimeout(()=>{i.delete(e),o({type:4,toastId:e})},t);i.set(e,a)},[]);(0,s.useEffect)(()=>{if(r)return;let e=Date.now(),s=a.map(a=>{if(a.duration===1/0)return;let r=(a.duration||0)+a.pauseDuration-(e-a.createdAt);if(r<0){a.visible&&A.dismiss(a.id);return}return setTimeout(()=>A.dismiss(a.id,t),r)});return()=>{s.forEach(e=>e&&clearTimeout(e))}},[a,r,t]);let o=(0,s.useCallback)(E(t),[t]),l=(0,s.useCallback)(()=>{o({type:5,time:Date.now()})},[o]),c=(0,s.useCallback)((e,t)=>{o({type:1,toast:{id:e,height:t}})},[o]),d=(0,s.useCallback)(()=>{r&&o({type:6,time:Date.now()})},[r,o]),u=(0,s.useCallback)((e,t)=>{let{reverseOrder:r=!1,gutter:s=8,defaultPosition:i}=t||{},n=a.filter(t=>(t.position||i)===(e.position||i)&&t.height),o=n.findIndex(t=>t.id===e.id),l=n.filter((e,t)=>t<o&&e.visible).length;return n.filter(e=>e.visible).slice(...r?[l+1]:[0,l]).reduce((e,t)=>e+(t.height||0)+s,0)},[a]);return(0,s.useEffect)(()=>{a.forEach(e=>{if(e.dismissed)n(e.id,e.removeDelay);else{let t=i.get(e.id);t&&(clearTimeout(t),i.delete(e.id))}})},[a,n]),{toasts:a,handlers:{updateHeight:c,startPause:l,endPause:d,calculateOffset:u}}})(a,n);return s.createElement("div",{"data-rht-toaster":n||"",style:{position:"fixed",zIndex:9999,top:16,left:16,right:16,bottom:16,pointerEvents:"none",...o},className:l,onMouseEnter:d.startPause,onMouseLeave:d.endPause},c.map(a=>{let n,o,l=a.position||t,c=d.calculateOffset(a,{reverseOrder:e,gutter:r,defaultPosition:t}),u=(n=l.includes("top"),o=l.includes("center")?{justifyContent:"center"}:l.includes("right")?{justifyContent:"flex-end"}:{},{left:0,right:0,display:"flex",position:"absolute",transition:v()?void 0:"all 230ms cubic-bezier(.21,1.02,.73,1)",transform:`translateY(${c*(n?1:-1)}px)`,...n?{top:0}:{bottom:0},...o});return s.createElement(Z,{id:a.id,key:a.id,onHeightUpdate:d.updateHeight,className:a.visible?G:"",style:u},"custom"===a.type?g(a.message,a):i?i(a):s.createElement(X,{toast:a,position:l}))}))},"default",0,A,"toast",0,A],705766)},920476,e=>{"use strict";async function t(e,t){let a=await fetch(e,t),r=await a.json().catch(()=>null);if(!a.ok)throw Error(r?.error||r?.message||`Request failed with ${a.status}`);return r}e.s(["apiJson",0,t,"errorMessage",0,function(e,t="Something went wrong"){return e instanceof Error?e.message:t}])},730274,e=>{"use strict";let t=(0,e.i(456420).default)("send",[["path",{d:"M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",key:"1ffxy3"}],["path",{d:"m21.854 2.147-10.94 10.939",key:"12cjpa"}]]);e.s(["Send",0,t],730274)},856423,e=>{"use strict";let t=(0,e.i(456420).default)("book-open",[["path",{d:"M12 7v14",key:"1akyts"}],["path",{d:"M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z",key:"ruj8y"}]]);e.s(["BookOpen",0,t],856423)},129768,e=>{"use strict";let t=(0,e.i(456420).default)("calendar-days",[["path",{d:"M8 2v4",key:"1cmpym"}],["path",{d:"M16 2v4",key:"4m81vk"}],["rect",{width:"18",height:"18",x:"3",y:"4",rx:"2",key:"1hopcy"}],["path",{d:"M3 10h18",key:"8toen8"}],["path",{d:"M8 14h.01",key:"6423bh"}],["path",{d:"M12 14h.01",key:"1etili"}],["path",{d:"M16 14h.01",key:"1gbofw"}],["path",{d:"M8 18h.01",key:"lrp35t"}],["path",{d:"M12 18h.01",key:"mhygvu"}],["path",{d:"M16 18h.01",key:"kzsmim"}]]);e.s(["CalendarDays",0,t],129768)},462047,e=>{"use strict";var t=e.i(705766);e.s(["notify",0,{success:e=>t.default.success(e),error:e=>t.default.error(e),warning:e=>(0,t.default)(e,{icon:"⚠️"}),info:e=>(0,t.default)(e,{icon:"ℹ️"})}])},77071,e=>{"use strict";let t=(0,e.i(456420).default)("plus",[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"M12 5v14",key:"s699le"}]]);e.s(["Plus",0,t],77071)},278673,e=>{"use strict";function t(e){return String(e||"").trim().toUpperCase().replaceAll(" ","_")}function a(e){let a=t(e);return"ADMIN"===a||"SCHOOL_ADMIN"===a}e.s(["canManageRecord",0,function(e,r,s){let i=t(e);return"SUPER_ADMIN"===i||("delete"===s?"school"!==r&&"class"!==r&&"section"!==r&&a(i):"school"===r||"class"===r?a(i):"section"===r?["ADMIN","SCHOOL_ADMIN","PRINCIPAL"].includes(i):"subject"===r||"timetable"===r||"exam"===r||"exam_schedule"===r?["ADMIN","SCHOOL_ADMIN","PRINCIPAL","TEACHER"].includes(i):("transport"===r||"transport_route"===r||"transport_vehicle"===r||"hostel"===r||"dining_menu"===r||"meal_plan"===r)&&a(i))}])},689674,e=>{"use strict";var t=e.i(843476),a=e.i(129768),r=e.i(77071),s=e.i(271645),i=e.i(859015),n=e.i(920476),o=e.i(278673),l=e.i(462047);let c={exam_name:"",exam_type:"",start_date:"",end_date:""},d={exam_name:"",description:""};function u({label:e,value:a,onChange:r,type:s="text"}){return(0,t.jsxs)("label",{className:"min-w-0",children:[(0,t.jsx)("span",{className:"mb-1 block text-sm font-bold text-slate-700",children:e}),(0,t.jsx)("input",{type:s,className:"input",value:a,onChange:e=>r(e.target.value)})]})}function p({label:e,value:a,onChange:r,children:s}){return(0,t.jsxs)("label",{className:"min-w-0",children:[(0,t.jsx)("span",{className:"mb-1 block text-sm font-bold text-slate-700",children:e}),(0,t.jsx)("select",{className:"input",value:a,onChange:e=>r(e.target.value),children:s})]})}function h({label:e,value:a}){return(0,t.jsxs)("div",{className:"min-w-0",children:[(0,t.jsx)("p",{className:"text-xs font-bold uppercase text-slate-500",children:e}),(0,t.jsx)("p",{className:"truncate font-semibold text-slate-950",children:a})]})}e.s(["default",0,function(){let[e,m]=(0,s.useState)([]),[f,y]=(0,s.useState)([]),[x,g]=(0,s.useState)(c),[b,v]=(0,s.useState)(d),[k,j]=(0,s.useState)(!1),[w,_]=(0,s.useState)(""),M=async()=>{try{let[e,t]=await Promise.all([(0,n.apiJson)("/api/exams"),(0,n.apiJson)("/api/exam-types")]);m(e.exams||[]),y(Array.isArray(t)?t:[])}catch(e){l.notify.error((0,n.errorMessage)(e,"Failed to load exams"))}};(0,s.useEffect)(()=>{try{let e=localStorage.getItem("erpUser");_(e&&JSON.parse(e)?.role||"")}catch{_("")}Promise.resolve().then(M)},[]);let C=(0,o.canManageRecord)(w,"exam","create"),N=(0,o.canManageRecord)(w,"exam","update"),E=(0,o.canManageRecord)(w,"exam","delete"),S=async()=>{try{j(!0),await (0,n.apiJson)("/api/exams",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(x)}),l.notify.success("Exam created"),g(c),M()}catch(e){l.notify.error((0,n.errorMessage)(e,"Failed to create exam"))}finally{j(!1)}},O=async e=>{let t=prompt("Update exam name",e.exam_name||"");if(!t)return;let a=prompt("Update exam type",e.exam_type||"");try{await (0,n.apiJson)(`/api/exams/${e.id}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({exam_name:t,exam_type:a||e.exam_type,start_date:e.start_date,end_date:e.end_date})}),l.notify.success("Exam updated"),M()}catch(e){l.notify.error((0,n.errorMessage)(e,"Failed to update exam"))}},A=async e=>{if(confirm(`Delete ${e.exam_name}? Schedules for this exam will also be removed.`))try{await (0,n.apiJson)(`/api/exams/${e.id}`,{method:"DELETE"}),l.notify.success("Exam deleted"),M()}catch(e){l.notify.error((0,n.errorMessage)(e,"Failed to delete exam"))}},P=async()=>{try{j(!0),await (0,n.apiJson)("/api/exam-types",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(b)}),l.notify.success("Exam type created"),v(d),M()}catch(e){l.notify.error((0,n.errorMessage)(e,"Failed to create exam type"))}finally{j(!1)}};return(0,t.jsx)(i.default,{children:(0,t.jsxs)("div",{className:"space-y-6",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("h1",{className:"text-3xl font-black md:text-4xl",children:"Exams"}),(0,t.jsx)("p",{className:"mt-1 text-sm text-slate-600",children:"Create academic exams and reusable exam types for schedule, papers, and marks entry."})]}),(0,t.jsxs)("div",{className:"grid gap-4 xl:grid-cols-[2fr_1fr]",children:[(0,t.jsxs)("section",{className:"tt-card tt-card-pad",children:[(0,t.jsx)("h2",{className:"mb-4 text-xl font-black",children:"Create Exam"}),(0,t.jsxs)("div",{className:"grid gap-4 md:grid-cols-2 xl:grid-cols-4",children:[(0,t.jsx)(u,{label:"Exam Name",value:x.exam_name,onChange:e=>g({...x,exam_name:e})}),(0,t.jsxs)(p,{label:"Exam Type",value:x.exam_type,onChange:e=>g({...x,exam_type:e}),children:[(0,t.jsx)("option",{value:"",children:"Select Type"}),f.map(e=>(0,t.jsx)("option",{value:e.exam_name||"",children:e.exam_name||"Exam Type"},e.id))]}),(0,t.jsx)(u,{label:"Start Date",type:"date",value:x.start_date,onChange:e=>g({...x,start_date:e})}),(0,t.jsx)(u,{label:"End Date",type:"date",value:x.end_date,onChange:e=>g({...x,end_date:e})})]}),C&&(0,t.jsxs)("button",{onClick:S,disabled:k,className:"tt-button mt-5 inline-flex items-center gap-2",children:[(0,t.jsx)(r.Plus,{size:17}),"Create Exam"]})]}),(0,t.jsxs)("section",{className:"tt-card tt-card-pad",children:[(0,t.jsx)("h2",{className:"mb-4 text-xl font-black",children:"Exam Type"}),(0,t.jsxs)("div",{className:"space-y-3",children:[(0,t.jsx)(u,{label:"Type Name",value:b.exam_name,onChange:e=>v({...b,exam_name:e})}),(0,t.jsx)(u,{label:"Description",value:b.description,onChange:e=>v({...b,description:e})}),(0,t.jsx)("button",{onClick:P,disabled:k,className:"tt-button-secondary w-full",children:"Add Type"})]})]})]}),(0,t.jsx)("div",{className:"grid gap-4 md:grid-cols-2 xl:grid-cols-3",children:e.map(e=>(0,t.jsxs)("article",{className:"tt-card tt-card-pad",children:[(0,t.jsxs)("div",{className:"flex items-start gap-3",children:[(0,t.jsx)("div",{className:"grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-slate-950 text-white",children:(0,t.jsx)(a.CalendarDays,{size:20})}),(0,t.jsxs)("div",{className:"min-w-0",children:[(0,t.jsx)("h2",{className:"truncate text-lg font-black",children:e.exam_name}),(0,t.jsx)("p",{className:"truncate text-sm font-semibold text-amber-700",children:e.exam_type||"Exam"})]})]}),(0,t.jsxs)("div",{className:"mt-5 grid grid-cols-2 gap-3 text-sm",children:[(0,t.jsx)(h,{label:"Schedules",value:String(e.schedule_count||0)}),(0,t.jsx)(h,{label:"Papers",value:String(e.paper_count||0)}),(0,t.jsx)(h,{label:"Start",value:e.start_date?new Date(e.start_date).toLocaleDateString():"-"}),(0,t.jsx)(h,{label:"End",value:e.end_date?new Date(e.end_date).toLocaleDateString():"-"})]}),(0,t.jsxs)("div",{className:"mt-5 flex flex-wrap gap-2",children:[N&&(0,t.jsx)("button",{type:"button",onClick:()=>O(e),className:"tt-button-secondary px-4 py-2 text-sm",children:"Edit"}),E&&(0,t.jsx)("button",{type:"button",onClick:()=>A(e),className:"rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-black text-red-700",children:"Delete"})]})]},e.id))})]})})}])}]);