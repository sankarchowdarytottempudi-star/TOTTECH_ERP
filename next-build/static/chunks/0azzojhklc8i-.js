(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,270904,e=>{"use strict";let t=(0,e.i(456420).default)("wallet",[["path",{d:"M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1",key:"18etb6"}],["path",{d:"M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4",key:"xoc0q4"}]]);e.s(["Wallet",0,t],270904)},195057,(e,t,a)=>{"use strict";Object.defineProperty(a,"__esModule",{value:!0});var r={formatUrl:function(){return o},formatWithValidation:function(){return c},urlObjectKeys:function(){return l}};for(var s in r)Object.defineProperty(a,s,{enumerable:!0,get:r[s]});let i=e.r(190809)._(e.r(998183)),n=/https?|ftp|gopher|file/;function o(e){let{auth:t,hostname:a}=e,r=e.protocol||"",s=e.pathname||"",o=e.hash||"",l=e.query||"",c=!1;t=t?encodeURIComponent(t).replace(/%3A/i,":")+"@":"",e.host?c=t+e.host:a&&(c=t+(~a.indexOf(":")?`[${a}]`:a),e.port&&(c+=":"+e.port)),l&&"object"==typeof l&&(l=String(i.urlQueryToSearchParams(l)));let d=e.search||l&&`?${l}`||"";return r&&!r.endsWith(":")&&(r+=":"),e.slashes||(!r||n.test(r))&&!1!==c?(c="//"+(c||""),s&&"/"!==s[0]&&(s="/"+s)):c||(c=""),o&&"#"!==o[0]&&(o="#"+o),d&&"?"!==d[0]&&(d="?"+d),s=s.replace(/[?#]/g,encodeURIComponent),d=d.replace("#","%23"),`${r}${c}${s}${d}${o}`}let l=["auth","hash","host","hostname","href","path","pathname","port","protocol","query","search","slashes"];function c(e){return o(e)}},573668,(e,t,a)=>{"use strict";Object.defineProperty(a,"__esModule",{value:!0}),Object.defineProperty(a,"isLocalURL",{enumerable:!0,get:function(){return i}});let r=e.r(718967),s=e.r(652817);function i(e){if(!(0,r.isAbsoluteUrl)(e))return!0;try{let t=(0,r.getLocationOrigin)(),a=new URL(e,t);return a.origin===t&&(0,s.hasBasePath)(a.pathname)}catch(e){return!1}}},284508,(e,t,a)=>{"use strict";Object.defineProperty(a,"__esModule",{value:!0}),Object.defineProperty(a,"errorOnce",{enumerable:!0,get:function(){return r}});let r=e=>{}},522016,(e,t,a)=>{"use strict";Object.defineProperty(a,"__esModule",{value:!0});var r={default:function(){return b},useLinkStatus:function(){return x}};for(var s in r)Object.defineProperty(a,s,{enumerable:!0,get:r[s]});let i=e.r(190809),n=e.r(843476),o=i._(e.r(271645)),l=e.r(195057),c=e.r(8372),d=e.r(818581),u=e.r(718967),p=e.r(405550);e.r(233525);let h=e.r(388540),m=e.r(91949),f=e.r(573668),y=e.r(509396);function b(t){var a,r;let s,i,b,[x,v]=(0,o.useOptimistic)(m.IDLE_LINK_STATUS),_=(0,o.useRef)(null),{href:j,as:k,children:N,prefetch:C=null,passHref:w,replace:E,shallow:A,scroll:M,onClick:S,onMouseEnter:T,onTouchStart:O,legacyBehavior:$=!1,onNavigate:R,transitionTypes:P,ref:L,unstable_dynamicOnHover:D,...I}=t;s=N,$&&("string"==typeof s||"number"==typeof s)&&(s=(0,n.jsx)("a",{children:s}));let z=o.default.useContext(c.AppRouterContext),U=!1!==C,H=!1!==C?null===(r=C)||"auto"===r?y.FetchStrategy.PPR:y.FetchStrategy.Full:y.FetchStrategy.PPR,B="string"==typeof(a=k||j)?a:(0,l.formatUrl)(a);if($){if(s?.$$typeof===Symbol.for("react.lazy"))throw Object.defineProperty(Error("`<Link legacyBehavior>` received a direct child that is either a Server Component, or JSX that was loaded with React.lazy(). This is not supported. Either remove legacyBehavior, or make the direct child a Client Component that renders the Link's `<a>` tag."),"__NEXT_ERROR_CODE",{value:"E863",enumerable:!1,configurable:!0});i=o.default.Children.only(s)}let V=$?i&&"object"==typeof i&&i.ref:L,F=o.default.useCallback(e=>(null!==z&&(_.current=(0,m.mountLinkInstance)(e,B,z,H,U,v)),()=>{_.current&&((0,m.unmountLinkForCurrentNavigation)(_.current),_.current=null),(0,m.unmountPrefetchableInstance)(e)}),[U,B,z,H,v]),q={ref:(0,d.useMergedRef)(F,V),onClick(t){$||"function"!=typeof S||S(t),$&&i.props&&"function"==typeof i.props.onClick&&i.props.onClick(t),!z||t.defaultPrevented||function(t,a,r,s,i,n,l){if("u">typeof window){let c,{nodeName:d}=t.currentTarget;if("A"===d.toUpperCase()&&((c=t.currentTarget.getAttribute("target"))&&"_self"!==c||t.metaKey||t.ctrlKey||t.shiftKey||t.altKey||t.nativeEvent&&2===t.nativeEvent.which)||t.currentTarget.hasAttribute("download"))return;if(!(0,f.isLocalURL)(a)){s&&(t.preventDefault(),location.replace(a));return}if(t.preventDefault(),n){let e=!1;if(n({preventDefault:()=>{e=!0}}),e)return}let{dispatchNavigateAction:u}=e.r(699781);o.default.startTransition(()=>{u(a,s?"replace":"push",!1===i?h.ScrollBehavior.NoScroll:h.ScrollBehavior.Default,r.current,l)})}}(t,B,_,E,M,R,P)},onMouseEnter(e){$||"function"!=typeof T||T(e),$&&i.props&&"function"==typeof i.props.onMouseEnter&&i.props.onMouseEnter(e),z&&U&&(0,m.onNavigationIntent)(e.currentTarget,!0===D)},onTouchStart:function(e){$||"function"!=typeof O||O(e),$&&i.props&&"function"==typeof i.props.onTouchStart&&i.props.onTouchStart(e),z&&U&&(0,m.onNavigationIntent)(e.currentTarget,!0===D)}};return(0,u.isAbsoluteUrl)(B)?q.href=B:$&&!w&&("a"!==i.type||"href"in i.props)||(q.href=(0,p.addBasePath)(B)),b=$?o.default.cloneElement(i,q):(0,n.jsx)("a",{...I,...q,children:s}),(0,n.jsx)(g.Provider,{value:x,children:b})}e.r(284508);let g=(0,o.createContext)(m.IDLE_LINK_STATUS),x=()=>(0,o.useContext)(g);("function"==typeof a.default||"object"==typeof a.default&&null!==a.default)&&void 0===a.default.__esModule&&(Object.defineProperty(a.default,"__esModule",{value:!0}),Object.assign(a.default,a),t.exports=a.default)},396661,505014,e=>{"use strict";let t=(...e)=>e.filter((e,t,a)=>!!e&&""!==e.trim()&&a.indexOf(e)===t).join(" ").trim();e.s(["mergeClasses",0,t],396661);var a=e.i(271645),r={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};let s=(0,a.createContext)({}),i=(0,a.forwardRef)(({color:e,size:i,strokeWidth:n,absoluteStrokeWidth:o,className:l="",children:c,iconNode:d,...u},p)=>{let{size:h=24,strokeWidth:m=2,absoluteStrokeWidth:f=!1,color:y="currentColor",className:b=""}=(0,a.useContext)(s)??{},g=o??f?24*Number(n??m)/Number(i??h):n??m;return(0,a.createElement)("svg",{ref:p,...r,width:i??h??r.width,height:i??h??r.height,stroke:e??y,strokeWidth:g,className:t("lucide",b,l),...!c&&!(e=>{for(let t in e)if(t.startsWith("aria-")||"role"===t||"title"===t)return!0;return!1})(u)&&{"aria-hidden":"true"},...u},[...d.map(([e,t])=>(0,a.createElement)(e,t)),...Array.isArray(c)?c:[c]])});e.s(["default",0,i],505014)},618566,(e,t,a)=>{t.exports=e.r(976562)},146387,456420,e=>{"use strict";var t=e.i(271645),a=e.i(396661);let r=e=>{let t=e.replace(/^([A-Z])|[\s-_]+(\w)/g,(e,t,a)=>a?a.toUpperCase():t.toLowerCase());return t.charAt(0).toUpperCase()+t.slice(1)};var s=e.i(505014);let i=(e,i)=>{let n=(0,t.forwardRef)(({className:n,...o},l)=>(0,t.createElement)(s.default,{ref:l,iconNode:i,className:(0,a.mergeClasses)(`lucide-${r(e).replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase()}`,`lucide-${e}`,n),...o}));return n.displayName=r(e),n};e.s(["default",0,i],456420);let n=i("building-2",[["path",{d:"M10 12h4",key:"a56b0p"}],["path",{d:"M10 8h4",key:"1sr2af"}],["path",{d:"M14 21v-3a2 2 0 0 0-4 0v3",key:"1rgiei"}],["path",{d:"M6 10H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2",key:"secmi2"}],["path",{d:"M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16",key:"16ra0t"}]]);e.s(["Building2",0,n],146387)},818581,(e,t,a)=>{"use strict";Object.defineProperty(a,"__esModule",{value:!0}),Object.defineProperty(a,"useMergedRef",{enumerable:!0,get:function(){return s}});let r=e.r(271645);function s(e,t){let a=(0,r.useRef)(null),s=(0,r.useRef)(null);return(0,r.useCallback)(r=>{if(null===r){let e=a.current;e&&(a.current=null,e());let t=s.current;t&&(s.current=null,t())}else e&&(a.current=i(e,r)),t&&(s.current=i(t,r))},[e,t])}function i(e,t){if("function"!=typeof e)return e.current=t,()=>{e.current=null};{let a=e(t);return"function"==typeof a?a:()=>e(null)}}("function"==typeof a.default||"object"==typeof a.default&&null!==a.default)&&void 0===a.default.__esModule&&(Object.defineProperty(a.default,"__esModule",{value:!0}),Object.assign(a.default,a),t.exports=a.default)},823482,e=>{"use strict";let t=(0,e.i(456420).default)("graduation-cap",[["path",{d:"M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z",key:"j76jl0"}],["path",{d:"M22 10v6",key:"1lu8f3"}],["path",{d:"M6 12.5V16a6 3 0 0 0 12 0v-3.5",key:"1r8lef"}]]);e.s(["GraduationCap",0,t],823482)},370812,e=>{"use strict";let t=(0,e.i(456420).default)("bell",[["path",{d:"M10.268 21a2 2 0 0 0 3.464 0",key:"vwvbt9"}],["path",{d:"M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326",key:"11g9vi"}]]);e.s(["Bell",0,t],370812)},716327,867927,e=>{"use strict";var t=e.i(456420);let a=(0,t.default)("chevron-down",[["path",{d:"m6 9 6 6 6-6",key:"qrunsl"}]]);e.s(["ChevronDown",0,a],716327);let r=(0,t.default)("chevron-right",[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]]);e.s(["ChevronRight",0,r],867927)},55677,e=>{"use strict";let t=(0,e.i(456420).default)("clipboard-list",[["rect",{width:"8",height:"4",x:"8",y:"2",rx:"1",ry:"1",key:"tgr4d6"}],["path",{d:"M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",key:"116196"}],["path",{d:"M12 11h4",key:"1jrz19"}],["path",{d:"M12 16h4",key:"n85exb"}],["path",{d:"M8 11h.01",key:"1dfujw"}],["path",{d:"M8 16h.01",key:"18s6g9"}]]);e.s(["ClipboardList",0,t],55677)},166794,e=>{"use strict";let t=(0,e.i(456420).default)("settings",[["path",{d:"M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915",key:"1i5ecw"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);e.s(["Settings",0,t],166794)},584026,e=>{"use strict";let t=(0,e.i(456420).default)("shield-check",[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]]);e.s(["ShieldCheck",0,t],584026)},779432,e=>{"use strict";let t=(0,e.i(456420).default)("activity",[["path",{d:"M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2",key:"169zse"}]]);e.s(["Activity",0,t],779432)},367784,593583,e=>{"use strict";var t=e.i(456420);let a=(0,t.default)("log-out",[["path",{d:"m16 17 5-5-5-5",key:"1bji2h"}],["path",{d:"M21 12H9",key:"dn1m92"}],["path",{d:"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",key:"1uf3rs"}]]);e.s(["LogOut",0,a],367784);let r=(0,t.default)("menu",[["path",{d:"M4 5h16",key:"1tepv9"}],["path",{d:"M4 12h16",key:"1lakjw"}],["path",{d:"M4 19h16",key:"1djgab"}]]);e.s(["Menu",0,r],593583)},749803,e=>{"use strict";let t=(0,e.i(456420).default)("chart-column",[["path",{d:"M3 3v16a2 2 0 0 0 2 2h16",key:"c24i48"}],["path",{d:"M18 17V9",key:"2bz60n"}],["path",{d:"M13 17V5",key:"1frdt8"}],["path",{d:"M8 17v-3",key:"17ska0"}]]);e.s(["BarChart3",0,t],749803)},566595,e=>{"use strict";let t=(0,e.i(456420).default)("search",[["path",{d:"m21 21-4.34-4.34",key:"14j7rj"}],["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}]]);e.s(["Search",0,t],566595)},263676,e=>{"use strict";let t=(0,e.i(456420).default)("x",[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]]);e.s(["X",0,t],263676)},705766,e=>{"use strict";let t,a;var r,s=e.i(271645);let i={data:""},n=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,o=/\/\*[^]*?\*\/|  +/g,l=/\n+/g,c=(e,t)=>{let a="",r="",s="";for(let i in e){let n=e[i];"@"==i[0]?"i"==i[1]?a=i+" "+n+";":r+="f"==i[1]?c(n,i):i+"{"+c(n,"k"==i[1]?"":t)+"}":"object"==typeof n?r+=c(n,t?t.replace(/([^,])+/g,e=>i.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,t=>/&/.test(t)?t.replace(/&/g,e):e?e+" "+t:t)):i):null!=n&&(i="-"==i[1]?i:i.replace(/[A-Z]/g,"-$&").toLowerCase(),s+=c.p?c.p(i,n):i+":"+n+";")}return a+(t&&s?t+"{"+s+"}":s)+r},d={},u=e=>{if("object"==typeof e){let t="";for(let a in e)t+=a+u(e[a]);return t}return e};function p(e){let t,a,r=this||{},s=e.call?e(r.p):e;return((e,t,a,r,s)=>{var i;let p=u(e),h=d[p]||(d[p]=(e=>{let t=0,a=11;for(;t<e.length;)a=101*a+e.charCodeAt(t++)>>>0;return"go"+a})(p));if(!d[h]){let t=p!==e?e:(e=>{let t,a,r=[{}];for(;t=n.exec(e.replace(o,""));)t[4]?r.shift():t[3]?(a=t[3].replace(l," ").trim(),r.unshift(r[0][a]=r[0][a]||{})):r[0][t[1]]=t[2].replace(l," ").trim();return r[0]})(e);d[h]=c(s?{["@keyframes "+h]:t}:t,a?"":"."+h)}let m=a&&d.g;return a&&(d.g=d[h]),i=d[h],m?t.data=t.data.replace(m,i):-1===t.data.indexOf(i)&&(t.data=r?i+t.data:t.data+i),h})(s.unshift?s.raw?(t=[].slice.call(arguments,1),a=r.p,s.reduce((e,r,s)=>{let i=t[s];if(i&&i.call){let e=i(a),t=e&&e.props&&e.props.className||/^go/.test(e)&&e;i=t?"."+t:e&&"object"==typeof e?e.props?"":c(e,""):!1===e?"":e}return e+r+(null==i?"":i)},"")):s.reduce((e,t)=>Object.assign(e,t&&t.call?t(r.p):t),{}):s,(e=>{if("object"==typeof window){let t=(e?e.querySelector("#_goober"):window._goober)||Object.assign(document.createElement("style"),{innerHTML:" ",id:"_goober"});return t.nonce=window.__nonce__,t.parentNode||(e||document.head).appendChild(t),t.firstChild}return e||i})(r.target),r.g,r.o,r.k)}p.bind({g:1});let h,m,f,y=p.bind({k:1});function b(e,t){let a=this||{};return function(){let r=arguments;function s(i,n){let o=Object.assign({},i),l=o.className||s.className;a.p=Object.assign({theme:m&&m()},o),a.o=/go\d/.test(l),o.className=p.apply(a,r)+(l?" "+l:""),t&&(o.ref=n);let c=e;return e[0]&&(c=o.as||e,delete o.as),f&&c[0]&&f(o),h(c,o)}return t?t(s):s}}var g=(e,t)=>"function"==typeof e?e(t):e,x=(t=0,()=>(++t).toString()),v=()=>{if(void 0===a&&"u">typeof window){let e=matchMedia("(prefers-reduced-motion: reduce)");a=!e||e.matches}return a},_="default",j=(e,t)=>{let{toastLimit:a}=e.settings;switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,a)};case 1:return{...e,toasts:e.toasts.map(e=>e.id===t.toast.id?{...e,...t.toast}:e)};case 2:let{toast:r}=t;return j(e,{type:+!!e.toasts.find(e=>e.id===r.id),toast:r});case 3:let{toastId:s}=t;return{...e,toasts:e.toasts.map(e=>e.id===s||void 0===s?{...e,dismissed:!0,visible:!1}:e)};case 4:return void 0===t.toastId?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(e=>e.id!==t.toastId)};case 5:return{...e,pausedAt:t.time};case 6:let i=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(e=>({...e,pauseDuration:e.pauseDuration+i}))}}},k=[],N={toasts:[],pausedAt:void 0,settings:{toastLimit:20}},C={},w=(e,t=_)=>{C[t]=j(C[t]||N,e),k.forEach(([e,a])=>{e===t&&a(C[t])})},E=e=>Object.keys(C).forEach(t=>w(e,t)),A=(e=_)=>t=>{w(t,e)},M={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},S=e=>(t,a)=>{let r,s=((e,t="blank",a)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:t,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...a,id:(null==a?void 0:a.id)||x()}))(t,e,a);return A(s.toasterId||(r=s.id,Object.keys(C).find(e=>C[e].toasts.some(e=>e.id===r))))({type:2,toast:s}),s.id},T=(e,t)=>S("blank")(e,t);T.error=S("error"),T.success=S("success"),T.loading=S("loading"),T.custom=S("custom"),T.dismiss=(e,t)=>{let a={type:3,toastId:e};t?A(t)(a):E(a)},T.dismissAll=e=>T.dismiss(void 0,e),T.remove=(e,t)=>{let a={type:4,toastId:e};t?A(t)(a):E(a)},T.removeAll=e=>T.remove(void 0,e),T.promise=(e,t,a)=>{let r=T.loading(t.loading,{...a,...null==a?void 0:a.loading});return"function"==typeof e&&(e=e()),e.then(e=>{let s=t.success?g(t.success,e):void 0;return s?T.success(s,{id:r,...a,...null==a?void 0:a.success}):T.dismiss(r),e}).catch(e=>{let s=t.error?g(t.error,e):void 0;s?T.error(s,{id:r,...a,...null==a?void 0:a.error}):T.dismiss(r)}),e};var O=1e3,$=y`
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
}`,P=y`
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
    animation: ${P} 0.15s ease-out forwards;
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
`,I=b("div")`
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
}`,H=b("div")`
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
`,B=b("div")`
  position: absolute;
`,V=b("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,F=y`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,q=b("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${F} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,J=({toast:e})=>{let{icon:t,type:a,iconTheme:r}=e;return void 0!==t?"string"==typeof t?s.createElement(q,null,t):t:"blank"===a?null:s.createElement(V,null,s.createElement(I,{...r}),"loading"!==a&&s.createElement(B,null,"error"===a?s.createElement(L,{...r}):s.createElement(H,{...r})))},K=b("div")`
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
`,W=b("div")`
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
`];return{animation:t?`${y(r)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${y(s)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}})(e.position||t||"top-center",e.visible):{opacity:0},n=s.createElement(J,{toast:e}),o=s.createElement(W,{...e.ariaProps},g(e.message,e));return s.createElement(K,{className:e.className,style:{...i,...a,...e.style}},"function"==typeof r?r({icon:n,message:o}):s.createElement(s.Fragment,null,n,o))});r=s.createElement,c.p=void 0,h=r,m=void 0,f=void 0;var Z=({id:e,className:t,style:a,onHeightUpdate:r,children:i})=>{let n=s.useCallback(t=>{if(t){let a=()=>{r(e,t.getBoundingClientRect().height)};a(),new MutationObserver(a).observe(t,{subtree:!0,childList:!0,characterData:!0})}},[e,r]);return s.createElement("div",{ref:n,className:t,style:a},i)},G=p`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`;e.s(["Toaster",0,({reverseOrder:e,position:t="top-center",toastOptions:a,gutter:r,children:i,toasterId:n,containerStyle:o,containerClassName:l})=>{let{toasts:c,handlers:d}=((e,t="default")=>{let{toasts:a,pausedAt:r}=((e={},t=_)=>{let[a,r]=(0,s.useState)(C[t]||N),i=(0,s.useRef)(C[t]);(0,s.useEffect)(()=>(i.current!==C[t]&&r(C[t]),k.push([t,r]),()=>{let e=k.findIndex(([e])=>e===t);e>-1&&k.splice(e,1)}),[t]);let n=a.toasts.map(t=>{var a,r,s;return{...e,...e[t.type],...t,removeDelay:t.removeDelay||(null==(a=e[t.type])?void 0:a.removeDelay)||(null==e?void 0:e.removeDelay),duration:t.duration||(null==(r=e[t.type])?void 0:r.duration)||(null==e?void 0:e.duration)||M[t.type],style:{...e.style,...null==(s=e[t.type])?void 0:s.style,...t.style}}});return{...a,toasts:n}})(e,t),i=(0,s.useRef)(new Map).current,n=(0,s.useCallback)((e,t=O)=>{if(i.has(e))return;let a=setTimeout(()=>{i.delete(e),o({type:4,toastId:e})},t);i.set(e,a)},[]);(0,s.useEffect)(()=>{if(r)return;let e=Date.now(),s=a.map(a=>{if(a.duration===1/0)return;let r=(a.duration||0)+a.pauseDuration-(e-a.createdAt);if(r<0){a.visible&&T.dismiss(a.id);return}return setTimeout(()=>T.dismiss(a.id,t),r)});return()=>{s.forEach(e=>e&&clearTimeout(e))}},[a,r,t]);let o=(0,s.useCallback)(A(t),[t]),l=(0,s.useCallback)(()=>{o({type:5,time:Date.now()})},[o]),c=(0,s.useCallback)((e,t)=>{o({type:1,toast:{id:e,height:t}})},[o]),d=(0,s.useCallback)(()=>{r&&o({type:6,time:Date.now()})},[r,o]),u=(0,s.useCallback)((e,t)=>{let{reverseOrder:r=!1,gutter:s=8,defaultPosition:i}=t||{},n=a.filter(t=>(t.position||i)===(e.position||i)&&t.height),o=n.findIndex(t=>t.id===e.id),l=n.filter((e,t)=>t<o&&e.visible).length;return n.filter(e=>e.visible).slice(...r?[l+1]:[0,l]).reduce((e,t)=>e+(t.height||0)+s,0)},[a]);return(0,s.useEffect)(()=>{a.forEach(e=>{if(e.dismissed)n(e.id,e.removeDelay);else{let t=i.get(e.id);t&&(clearTimeout(t),i.delete(e.id))}})},[a,n]),{toasts:a,handlers:{updateHeight:c,startPause:l,endPause:d,calculateOffset:u}}})(a,n);return s.createElement("div",{"data-rht-toaster":n||"",style:{position:"fixed",zIndex:9999,top:16,left:16,right:16,bottom:16,pointerEvents:"none",...o},className:l,onMouseEnter:d.startPause,onMouseLeave:d.endPause},c.map(a=>{let n,o,l=a.position||t,c=d.calculateOffset(a,{reverseOrder:e,gutter:r,defaultPosition:t}),u=(n=l.includes("top"),o=l.includes("center")?{justifyContent:"center"}:l.includes("right")?{justifyContent:"flex-end"}:{},{left:0,right:0,display:"flex",position:"absolute",transition:v()?void 0:"all 230ms cubic-bezier(.21,1.02,.73,1)",transform:`translateY(${c*(n?1:-1)}px)`,...n?{top:0}:{bottom:0},...o});return s.createElement(Z,{id:a.id,key:a.id,onHeightUpdate:d.updateHeight,className:a.visible?G:"",style:u},"custom"===a.type?g(a.message,a):i?i(a):s.createElement(X,{toast:a,position:l}))}))},"default",0,T,"toast",0,T],705766)},920476,e=>{"use strict";async function t(e,t){let a=await fetch(e,t),r=await a.json().catch(()=>null);if(!a.ok)throw Error(r?.error||r?.message||`Request failed with ${a.status}`);return r}e.s(["apiJson",0,t,"errorMessage",0,function(e,t="Something went wrong"){return e instanceof Error?e.message:t}])},730274,e=>{"use strict";let t=(0,e.i(456420).default)("send",[["path",{d:"M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",key:"1ffxy3"}],["path",{d:"m21.854 2.147-10.94 10.939",key:"12cjpa"}]]);e.s(["Send",0,t],730274)},856423,e=>{"use strict";let t=(0,e.i(456420).default)("book-open",[["path",{d:"M12 7v14",key:"1akyts"}],["path",{d:"M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z",key:"ruj8y"}]]);e.s(["BookOpen",0,t],856423)},462047,e=>{"use strict";var t=e.i(705766);e.s(["notify",0,{success:e=>t.default.success(e),error:e=>t.default.error(e),warning:e=>(0,t.default)(e,{icon:"⚠️"}),info:e=>(0,t.default)(e,{icon:"ℹ️"})}])},278673,e=>{"use strict";function t(e){return String(e||"").trim().toUpperCase().replaceAll(" ","_")}function a(e){let a=t(e);return"ADMIN"===a||"SCHOOL_ADMIN"===a}e.s(["canManageRecord",0,function(e,r,s){let i=t(e);return"SUPER_ADMIN"===i||("delete"===s?"school"!==r&&"class"!==r&&"section"!==r&&a(i):"school"===r||"class"===r?a(i):"section"===r?["ADMIN","SCHOOL_ADMIN","PRINCIPAL"].includes(i):"subject"===r||"timetable"===r||"exam"===r||"exam_schedule"===r?["ADMIN","SCHOOL_ADMIN","PRINCIPAL","TEACHER"].includes(i):("transport"===r||"transport_route"===r||"transport_vehicle"===r||"hostel"===r||"dining_menu"===r||"meal_plan"===r)&&a(i))}])},357443,e=>{"use strict";let t=(0,e.i(456420).default)("user-plus",[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}],["line",{x1:"19",x2:"19",y1:"8",y2:"14",key:"1bvyxn"}],["line",{x1:"22",x2:"16",y1:"11",y2:"11",key:"1shjgl"}]]);e.s(["UserPlus",0,t],357443)},542293,e=>{"use strict";var t=e.i(843476),a=e.i(416886),r=e.i(456420);let s=(0,r.default)("map-pinned",[["path",{d:"M18 8c0 3.613-3.869 7.429-5.393 8.795a1 1 0 0 1-1.214 0C9.87 15.429 6 11.613 6 8a6 6 0 0 1 12 0",key:"11u0oz"}],["circle",{cx:"12",cy:"8",r:"2",key:"1822b1"}],["path",{d:"M8.714 14h-3.71a1 1 0 0 0-.948.683l-2.004 6A1 1 0 0 0 3 22h18a1 1 0 0 0 .948-1.316l-2-6a1 1 0 0 0-.949-.684h-3.712",key:"q8zwxj"}]]),i=(0,r.default)("route",[["circle",{cx:"6",cy:"19",r:"3",key:"1kj8tv"}],["path",{d:"M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15",key:"1d8sl"}],["circle",{cx:"18",cy:"5",r:"3",key:"gq8acd"}]]);var n=e.i(357443),o=e.i(271645),l=e.i(859015),c=e.i(278673),d=e.i(920476),u=e.i(462047);let p={kind:"vehicle",vehicle_number:"",vehicle_type:"",capacity:"",driver_name:"",driver_phone:""},h={kind:"route",route_name:"",vehicle_number:"",driver_name:"",driver_phone:""},m={kind:"assignment",assigned_to_type:"STUDENT",class_id:"",section_id:"",student_id:"",teacher_id:"",route_id:"",pickup_point:"",drop_point:""};function f({label:e,value:a,onChange:r}){return(0,t.jsxs)("label",{className:"min-w-0",children:[(0,t.jsx)("span",{className:"mb-1 block text-sm font-bold capitalize text-slate-700",children:e}),(0,t.jsx)("input",{className:"input",value:a,onChange:e=>r(e.target.value)})]})}function y({title:e,icon:a,children:r}){return(0,t.jsxs)("section",{className:"tt-card tt-card-pad",children:[(0,t.jsxs)("div",{className:"mb-4 flex items-center gap-2",children:[a,(0,t.jsx)("h2",{className:"text-xl font-black",children:e})]}),(0,t.jsx)("div",{className:"space-y-3",children:r})]})}function b({title:e,subtitle:a,meta:r,actions:s}){return(0,t.jsxs)("article",{className:"rounded-lg border border-slate-200 bg-slate-50 p-4",children:[(0,t.jsx)("h3",{className:"truncate font-black",children:e||"-"}),(0,t.jsx)("p",{className:"truncate text-sm font-semibold text-amber-700",children:a||"-"}),(0,t.jsx)("p",{className:"mt-2 truncate text-sm text-slate-600",children:r||"-"}),s?(0,t.jsx)("div",{className:"mt-4 flex flex-wrap gap-2",children:s}):null]})}e.s(["default",0,function(){let[e,r]=(0,o.useState)([]),[g,x]=(0,o.useState)([]),[v,_]=(0,o.useState)([]),[j,k]=(0,o.useState)([]),[N,C]=(0,o.useState)([]),[w,E]=(0,o.useState)([]),[A,M]=(0,o.useState)([]),[S,T]=(0,o.useState)(""),[O,$]=(0,o.useState)(p),[R,P]=(0,o.useState)(h),[L,D]=(0,o.useState)(m),[I,z]=(0,o.useState)("");(0,o.useEffect)(()=>{try{let e=localStorage.getItem("erpUser");z(e&&JSON.parse(e)?.role||"")}catch{z("")}U()},[]);let U=async()=>{try{let[e,t]=await Promise.all([(0,d.apiJson)("/api/transport"),(0,d.apiJson)("/api/roster")]);r(e.vehicles||[]),x(e.routes||[]),_(e.assignments||[]),k(Array.isArray(t.students)?t.students:[]),C(Array.isArray(t.teachers)?t.teachers:[]),E(Array.isArray(t.classes)?t.classes:[]),M(Array.isArray(t.sections)?t.sections:[])}catch(e){u.notify.error((0,d.errorMessage)(e,"Failed to load transport"))}},H=async(e,t)=>{try{await (0,d.apiJson)("/api/transport",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)}),u.notify.success(t),U()}catch(e){u.notify.error((0,d.errorMessage)(e,"Failed to save transport"))}},B=(0,c.canManageRecord)(I,"transport","create"),V=(0,c.canManageRecord)(I,"transport","update"),F=(0,c.canManageRecord)(I,"transport","delete"),q=async e=>{try{await (0,d.apiJson)("/api/transport",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)}),u.notify.success("Transport updated"),U()}catch(e){u.notify.error((0,d.errorMessage)(e,"Failed to update transport"))}},J=async(e,t)=>{if(confirm(`Delete this ${e.replaceAll("_"," ")} record?`))try{await (0,d.apiJson)(`/api/transport?kind=${e}&id=${t}`,{method:"DELETE"}),u.notify.success("Transport record deleted"),U()}catch(e){u.notify.error((0,d.errorMessage)(e,"Failed to delete transport"))}},K=e=>[e.first_name,e.last_name].filter(Boolean).join(" ")||`Student ${e.student_id||e.id}`,W=e=>[e.teacher_first_name??e.first_name,e.teacher_last_name??e.last_name].filter(Boolean).join(" ")||`Teacher ${e.teacher_id||e.id}`,X=A.filter(e=>!L.class_id||Number(e.class_id)===Number(L.class_id)),Z=j.filter(e=>{let t=!L.class_id||Number(e.class_id)===Number(L.class_id),a=!L.section_id||Number(e.section_id)===Number(L.section_id),r=`
        ${K(e)}
        ${e.admission_number||""}
        ${e.phone||""}
      `.toLowerCase();return t&&a&&r.includes(S.toLowerCase())}),G=N.filter(e=>{let t=Array.isArray(e.assignments)?e.assignments:[],a=!L.class_id||t.some(e=>Number(e.class_id)===Number(L.class_id)),r=!L.section_id||t.some(e=>Number(e.section_id)===Number(L.section_id)),s=`
        ${W(e)}
        ${e.employee_id||""}
        ${e.phone||""}
      `.toLowerCase();return a&&r&&s.includes(S.toLowerCase())});return(0,t.jsx)(l.default,{children:(0,t.jsxs)("div",{className:"space-y-6",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("h1",{className:"text-3xl font-black md:text-4xl",children:"Transport Operations"}),(0,t.jsx)("p",{className:"mt-1 text-sm text-slate-600",children:"Vehicles, routes, and student transport assignments."})]}),(0,t.jsxs)("div",{className:"grid gap-4 xl:grid-cols-3",children:[(0,t.jsxs)("section",{className:"tt-card tt-card-pad",children:[(0,t.jsxs)("div",{className:"mb-4 flex items-center gap-2",children:[(0,t.jsx)(a.Bus,{size:20}),(0,t.jsx)("h2",{className:"text-xl font-black",children:"Add Vehicle"})]}),(0,t.jsxs)("div",{className:"space-y-3",children:[["vehicle_number","vehicle_type","capacity","driver_name","driver_phone"].map(e=>(0,t.jsx)(f,{label:e.replaceAll("_"," "),value:O[e],onChange:t=>$(a=>({...a,[e]:t}))},e)),B&&(0,t.jsx)("button",{className:"tt-button w-full",onClick:()=>H(O,"Vehicle added"),children:"Add Vehicle"})]})]}),(0,t.jsxs)("section",{className:"tt-card tt-card-pad",children:[(0,t.jsxs)("div",{className:"mb-4 flex items-center gap-2",children:[(0,t.jsx)(i,{size:20}),(0,t.jsx)("h2",{className:"text-xl font-black",children:"Create Route"})]}),(0,t.jsxs)("div",{className:"space-y-3",children:[["route_name","vehicle_number","driver_name","driver_phone"].map(e=>(0,t.jsx)(f,{label:e.replaceAll("_"," "),value:R[e],onChange:t=>P(a=>({...a,[e]:t}))},e)),B&&(0,t.jsx)("button",{className:"tt-button w-full",onClick:()=>H(R,"Route created"),children:"Create Route"})]})]}),(0,t.jsxs)("section",{className:"tt-card tt-card-pad",children:[(0,t.jsxs)("div",{className:"mb-4 flex items-center gap-2",children:[(0,t.jsx)(n.UserPlus,{size:20}),(0,t.jsx)("h2",{className:"text-xl font-black",children:"Assign Transport"})]}),(0,t.jsxs)("div",{className:"space-y-3",children:[(0,t.jsxs)("label",{className:"min-w-0",children:[(0,t.jsx)("span",{className:"mb-1 block text-sm font-bold text-slate-700",children:"Assign To"}),(0,t.jsxs)("select",{className:"input",value:L.assigned_to_type,onChange:e=>D({...L,assigned_to_type:e.target.value,student_id:"",teacher_id:""}),children:[(0,t.jsx)("option",{value:"STUDENT",children:"Student"}),(0,t.jsx)("option",{value:"TEACHER",children:"Teacher / Staff"})]})]}),(0,t.jsxs)("label",{className:"min-w-0",children:[(0,t.jsx)("span",{className:"mb-1 block text-sm font-bold text-slate-700",children:"Class"}),(0,t.jsxs)("select",{className:"input",value:L.class_id,onChange:e=>D({...L,class_id:e.target.value,section_id:"",student_id:"",teacher_id:""}),children:[(0,t.jsx)("option",{value:"",children:"All Classes"}),w.map(e=>(0,t.jsx)("option",{value:e.id,children:e.class_name},e.id))]})]}),(0,t.jsxs)("label",{className:"min-w-0",children:[(0,t.jsx)("span",{className:"mb-1 block text-sm font-bold text-slate-700",children:"Section"}),(0,t.jsxs)("select",{className:"input",value:L.section_id,disabled:!L.class_id,onChange:e=>D({...L,section_id:e.target.value,student_id:"",teacher_id:""}),children:[(0,t.jsx)("option",{value:"",children:"All Sections"}),X.map(e=>(0,t.jsx)("option",{value:e.id,children:e.section_name},e.id))]})]}),(0,t.jsx)(f,{label:"search person",value:S,onChange:T}),(0,t.jsxs)("label",{className:"min-w-0",children:[(0,t.jsx)("span",{className:"mb-1 block text-sm font-bold text-slate-700",children:"TEACHER"===L.assigned_to_type?"Teacher / Staff":"Student"}),(0,t.jsxs)("select",{className:"input",value:"TEACHER"===L.assigned_to_type?L.teacher_id:L.student_id,onChange:e=>D({...L,student_id:"STUDENT"===L.assigned_to_type?e.target.value:"",teacher_id:"TEACHER"===L.assigned_to_type?e.target.value:""}),children:[(0,t.jsxs)("option",{value:"",children:["Select"," ","TEACHER"===L.assigned_to_type?"Teacher":"Student"]}),("TEACHER"===L.assigned_to_type?G:Z).map(e=>(0,t.jsx)("option",{value:e.id,children:"TEACHER"===L.assigned_to_type?W(e):K(e)},e.id))]})]}),(0,t.jsxs)("label",{className:"min-w-0",children:[(0,t.jsx)("span",{className:"mb-1 block text-sm font-bold text-slate-700",children:"Route"}),(0,t.jsxs)("select",{className:"input",value:L.route_id,onChange:e=>D({...L,route_id:e.target.value}),children:[(0,t.jsx)("option",{value:"",children:"Select Route"}),g.map(e=>(0,t.jsx)("option",{value:e.id,children:e.route_name},e.id))]})]}),(0,t.jsx)(f,{label:"pickup point",value:L.pickup_point,onChange:e=>D({...L,pickup_point:e})}),(0,t.jsx)(f,{label:"drop point",value:L.drop_point,onChange:e=>D({...L,drop_point:e})}),B&&(0,t.jsxs)("button",{className:"tt-button w-full",onClick:()=>H(L,"Transport assigned"),children:["Assign"," ","TEACHER"===L.assigned_to_type?"Teacher":"Student"]})]})]})]}),(0,t.jsxs)("div",{className:"grid gap-4 xl:grid-cols-3",children:[(0,t.jsx)(y,{title:"Vehicles",icon:(0,t.jsx)(a.Bus,{size:20}),children:e.map(e=>(0,t.jsx)(b,{title:e.vehicle_number,subtitle:e.vehicle_type||"Vehicle",meta:`${e.driver_name||"-"} \xb7 ${e.driver_phone||"-"}`,actions:(0,t.jsxs)(t.Fragment,{children:[V&&(0,t.jsx)("button",{type:"button",onClick:()=>{let t;(t=prompt("Vehicle number",e.vehicle_number||""))&&q({...e,kind:"vehicle",id:e.id,vehicle_number:t})},className:"tt-button-secondary px-3 py-2 text-xs",children:"Edit"}),F&&(0,t.jsx)("button",{type:"button",onClick:()=>J("vehicle",e.id),className:"rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-black text-red-700",children:"Delete"})]})},e.id))}),(0,t.jsx)(y,{title:"Routes",icon:(0,t.jsx)(s,{size:20}),children:g.map(e=>(0,t.jsx)(b,{title:e.route_name,subtitle:e.vehicle_number||"No vehicle",meta:`${e.driver_name||"-"} \xb7 ${e.driver_phone||"-"}`,actions:(0,t.jsxs)(t.Fragment,{children:[V&&(0,t.jsx)("button",{type:"button",onClick:()=>{let t;(t=prompt("Route name",e.route_name||""))&&q({...e,kind:"route",id:e.id,route_name:t})},className:"tt-button-secondary px-3 py-2 text-xs",children:"Edit"}),F&&(0,t.jsx)("button",{type:"button",onClick:()=>J("route",e.id),className:"rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-black text-red-700",children:"Delete"})]})},e.id))}),(0,t.jsx)(y,{title:"Assignments",icon:(0,t.jsx)(n.UserPlus,{size:20}),children:v.map(e=>(0,t.jsx)(b,{title:"TEACHER"===e.assigned_to_type?W(e):K(e),subtitle:e.route_name||"No route",meta:`${e.assigned_to_type||"STUDENT"} \xb7 ${e.pickup_point||"-"} -> ${e.drop_point||"-"}`,actions:F?(0,t.jsx)("button",{type:"button",onClick:()=>J("assignment",e.id),className:"rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-black text-red-700",children:"Delete"}):null},e.id))})]})]})})}],542293)}]);