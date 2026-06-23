(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,270904,e=>{"use strict";let t=(0,e.i(456420).default)("wallet",[["path",{d:"M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1",key:"18etb6"}],["path",{d:"M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4",key:"xoc0q4"}]]);e.s(["Wallet",0,t],270904)},195057,(e,t,a)=>{"use strict";Object.defineProperty(a,"__esModule",{value:!0});var r={formatUrl:function(){return s},formatWithValidation:function(){return c},urlObjectKeys:function(){return l}};for(var o in r)Object.defineProperty(a,o,{enumerable:!0,get:r[o]});let i=e.r(190809)._(e.r(998183)),n=/https?|ftp|gopher|file/;function s(e){let{auth:t,hostname:a}=e,r=e.protocol||"",o=e.pathname||"",s=e.hash||"",l=e.query||"",c=!1;t=t?encodeURIComponent(t).replace(/%3A/i,":")+"@":"",e.host?c=t+e.host:a&&(c=t+(~a.indexOf(":")?`[${a}]`:a),e.port&&(c+=":"+e.port)),l&&"object"==typeof l&&(l=String(i.urlQueryToSearchParams(l)));let d=e.search||l&&`?${l}`||"";return r&&!r.endsWith(":")&&(r+=":"),e.slashes||(!r||n.test(r))&&!1!==c?(c="//"+(c||""),o&&"/"!==o[0]&&(o="/"+o)):c||(c=""),s&&"#"!==s[0]&&(s="#"+s),d&&"?"!==d[0]&&(d="?"+d),o=o.replace(/[?#]/g,encodeURIComponent),d=d.replace("#","%23"),`${r}${c}${o}${d}${s}`}let l=["auth","hash","host","hostname","href","path","pathname","port","protocol","query","search","slashes"];function c(e){return s(e)}},573668,(e,t,a)=>{"use strict";Object.defineProperty(a,"__esModule",{value:!0}),Object.defineProperty(a,"isLocalURL",{enumerable:!0,get:function(){return i}});let r=e.r(718967),o=e.r(652817);function i(e){if(!(0,r.isAbsoluteUrl)(e))return!0;try{let t=(0,r.getLocationOrigin)(),a=new URL(e,t);return a.origin===t&&(0,o.hasBasePath)(a.pathname)}catch(e){return!1}}},284508,(e,t,a)=>{"use strict";Object.defineProperty(a,"__esModule",{value:!0}),Object.defineProperty(a,"errorOnce",{enumerable:!0,get:function(){return r}});let r=e=>{}},522016,(e,t,a)=>{"use strict";Object.defineProperty(a,"__esModule",{value:!0});var r={default:function(){return g},useLinkStatus:function(){return v}};for(var o in r)Object.defineProperty(a,o,{enumerable:!0,get:r[o]});let i=e.r(190809),n=e.r(843476),s=i._(e.r(271645)),l=e.r(195057),c=e.r(8372),d=e.r(818581),u=e.r(718967),p=e.r(405550);e.r(233525);let h=e.r(388540),f=e.r(91949),m=e.r(573668),y=e.r(509396);function g(t){var a,r;let o,i,g,[v,x]=(0,s.useOptimistic)(f.IDLE_LINK_STATUS),_=(0,s.useRef)(null),{href:w,as:j,children:k,prefetch:C=null,passHref:N,replace:S,shallow:M,scroll:E,onClick:O,onMouseEnter:P,onTouchStart:A,legacyBehavior:L=!1,onNavigate:$,transitionTypes:T,ref:R,unstable_dynamicOnHover:D,...U}=t;o=k,L&&("string"==typeof o||"number"==typeof o)&&(o=(0,n.jsx)("a",{children:o}));let I=s.default.useContext(c.AppRouterContext),z=!1!==C,W=!1!==C?null===(r=C)||"auto"===r?y.FetchStrategy.PPR:y.FetchStrategy.Full:y.FetchStrategy.PPR,B="string"==typeof(a=j||w)?a:(0,l.formatUrl)(a);if(L){if(o?.$$typeof===Symbol.for("react.lazy"))throw Object.defineProperty(Error("`<Link legacyBehavior>` received a direct child that is either a Server Component, or JSX that was loaded with React.lazy(). This is not supported. Either remove legacyBehavior, or make the direct child a Client Component that renders the Link's `<a>` tag."),"__NEXT_ERROR_CODE",{value:"E863",enumerable:!1,configurable:!0});i=s.default.Children.only(o)}let F=L?i&&"object"==typeof i&&i.ref:R,H=s.default.useCallback(e=>(null!==I&&(_.current=(0,f.mountLinkInstance)(e,B,I,W,z,x)),()=>{_.current&&((0,f.unmountLinkForCurrentNavigation)(_.current),_.current=null),(0,f.unmountPrefetchableInstance)(e)}),[z,B,I,W,x]),V={ref:(0,d.useMergedRef)(H,F),onClick(t){L||"function"!=typeof O||O(t),L&&i.props&&"function"==typeof i.props.onClick&&i.props.onClick(t),!I||t.defaultPrevented||function(t,a,r,o,i,n,l){if("u">typeof window){let c,{nodeName:d}=t.currentTarget;if("A"===d.toUpperCase()&&((c=t.currentTarget.getAttribute("target"))&&"_self"!==c||t.metaKey||t.ctrlKey||t.shiftKey||t.altKey||t.nativeEvent&&2===t.nativeEvent.which)||t.currentTarget.hasAttribute("download"))return;if(!(0,m.isLocalURL)(a)){o&&(t.preventDefault(),location.replace(a));return}if(t.preventDefault(),n){let e=!1;if(n({preventDefault:()=>{e=!0}}),e)return}let{dispatchNavigateAction:u}=e.r(699781);s.default.startTransition(()=>{u(a,o?"replace":"push",!1===i?h.ScrollBehavior.NoScroll:h.ScrollBehavior.Default,r.current,l)})}}(t,B,_,S,E,$,T)},onMouseEnter(e){L||"function"!=typeof P||P(e),L&&i.props&&"function"==typeof i.props.onMouseEnter&&i.props.onMouseEnter(e),I&&z&&(0,f.onNavigationIntent)(e.currentTarget,!0===D)},onTouchStart:function(e){L||"function"!=typeof A||A(e),L&&i.props&&"function"==typeof i.props.onTouchStart&&i.props.onTouchStart(e),I&&z&&(0,f.onNavigationIntent)(e.currentTarget,!0===D)}};return(0,u.isAbsoluteUrl)(B)?V.href=B:L&&!N&&("a"!==i.type||"href"in i.props)||(V.href=(0,p.addBasePath)(B)),g=L?s.default.cloneElement(i,V):(0,n.jsx)("a",{...U,...V,children:o}),(0,n.jsx)(b.Provider,{value:v,children:g})}e.r(284508);let b=(0,s.createContext)(f.IDLE_LINK_STATUS),v=()=>(0,s.useContext)(b);("function"==typeof a.default||"object"==typeof a.default&&null!==a.default)&&void 0===a.default.__esModule&&(Object.defineProperty(a.default,"__esModule",{value:!0}),Object.assign(a.default,a),t.exports=a.default)},618566,(e,t,a)=>{t.exports=e.r(976562)},396661,505014,e=>{"use strict";let t=(...e)=>e.filter((e,t,a)=>!!e&&""!==e.trim()&&a.indexOf(e)===t).join(" ").trim();e.s(["mergeClasses",0,t],396661);var a=e.i(271645),r={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};let o=(0,a.createContext)({}),i=(0,a.forwardRef)(({color:e,size:i,strokeWidth:n,absoluteStrokeWidth:s,className:l="",children:c,iconNode:d,...u},p)=>{let{size:h=24,strokeWidth:f=2,absoluteStrokeWidth:m=!1,color:y="currentColor",className:g=""}=(0,a.useContext)(o)??{},b=s??m?24*Number(n??f)/Number(i??h):n??f;return(0,a.createElement)("svg",{ref:p,...r,width:i??h??r.width,height:i??h??r.height,stroke:e??y,strokeWidth:b,className:t("lucide",g,l),...!c&&!(e=>{for(let t in e)if(t.startsWith("aria-")||"role"===t||"title"===t)return!0;return!1})(u)&&{"aria-hidden":"true"},...u},[...d.map(([e,t])=>(0,a.createElement)(e,t)),...Array.isArray(c)?c:[c]])});e.s(["default",0,i],505014)},146387,456420,e=>{"use strict";var t=e.i(271645),a=e.i(396661);let r=e=>{let t=e.replace(/^([A-Z])|[\s-_]+(\w)/g,(e,t,a)=>a?a.toUpperCase():t.toLowerCase());return t.charAt(0).toUpperCase()+t.slice(1)};var o=e.i(505014);let i=(e,i)=>{let n=(0,t.forwardRef)(({className:n,...s},l)=>(0,t.createElement)(o.default,{ref:l,iconNode:i,className:(0,a.mergeClasses)(`lucide-${r(e).replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase()}`,`lucide-${e}`,n),...s}));return n.displayName=r(e),n};e.s(["default",0,i],456420);let n=i("building-2",[["path",{d:"M10 12h4",key:"a56b0p"}],["path",{d:"M10 8h4",key:"1sr2af"}],["path",{d:"M14 21v-3a2 2 0 0 0-4 0v3",key:"1rgiei"}],["path",{d:"M6 10H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2",key:"secmi2"}],["path",{d:"M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16",key:"16ra0t"}]]);e.s(["Building2",0,n],146387)},818581,(e,t,a)=>{"use strict";Object.defineProperty(a,"__esModule",{value:!0}),Object.defineProperty(a,"useMergedRef",{enumerable:!0,get:function(){return o}});let r=e.r(271645);function o(e,t){let a=(0,r.useRef)(null),o=(0,r.useRef)(null);return(0,r.useCallback)(r=>{if(null===r){let e=a.current;e&&(a.current=null,e());let t=o.current;t&&(o.current=null,t())}else e&&(a.current=i(e,r)),t&&(o.current=i(t,r))},[e,t])}function i(e,t){if("function"!=typeof e)return e.current=t,()=>{e.current=null};{let a=e(t);return"function"==typeof a?a:()=>e(null)}}("function"==typeof a.default||"object"==typeof a.default&&null!==a.default)&&void 0===a.default.__esModule&&(Object.defineProperty(a.default,"__esModule",{value:!0}),Object.assign(a.default,a),t.exports=a.default)},823482,e=>{"use strict";let t=(0,e.i(456420).default)("graduation-cap",[["path",{d:"M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z",key:"j76jl0"}],["path",{d:"M22 10v6",key:"1lu8f3"}],["path",{d:"M6 12.5V16a6 3 0 0 0 12 0v-3.5",key:"1r8lef"}]]);e.s(["GraduationCap",0,t],823482)},370812,e=>{"use strict";let t=(0,e.i(456420).default)("bell",[["path",{d:"M10.268 21a2 2 0 0 0 3.464 0",key:"vwvbt9"}],["path",{d:"M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326",key:"11g9vi"}]]);e.s(["Bell",0,t],370812)},716327,867927,e=>{"use strict";var t=e.i(456420);let a=(0,t.default)("chevron-down",[["path",{d:"m6 9 6 6 6-6",key:"qrunsl"}]]);e.s(["ChevronDown",0,a],716327);let r=(0,t.default)("chevron-right",[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]]);e.s(["ChevronRight",0,r],867927)},55677,e=>{"use strict";let t=(0,e.i(456420).default)("clipboard-list",[["rect",{width:"8",height:"4",x:"8",y:"2",rx:"1",ry:"1",key:"tgr4d6"}],["path",{d:"M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",key:"116196"}],["path",{d:"M12 11h4",key:"1jrz19"}],["path",{d:"M12 16h4",key:"n85exb"}],["path",{d:"M8 11h.01",key:"1dfujw"}],["path",{d:"M8 16h.01",key:"18s6g9"}]]);e.s(["ClipboardList",0,t],55677)},166794,e=>{"use strict";let t=(0,e.i(456420).default)("settings",[["path",{d:"M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915",key:"1i5ecw"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);e.s(["Settings",0,t],166794)},584026,e=>{"use strict";let t=(0,e.i(456420).default)("shield-check",[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]]);e.s(["ShieldCheck",0,t],584026)},779432,e=>{"use strict";let t=(0,e.i(456420).default)("activity",[["path",{d:"M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2",key:"169zse"}]]);e.s(["Activity",0,t],779432)},367784,593583,e=>{"use strict";var t=e.i(456420);let a=(0,t.default)("log-out",[["path",{d:"m16 17 5-5-5-5",key:"1bji2h"}],["path",{d:"M21 12H9",key:"dn1m92"}],["path",{d:"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",key:"1uf3rs"}]]);e.s(["LogOut",0,a],367784);let r=(0,t.default)("menu",[["path",{d:"M4 5h16",key:"1tepv9"}],["path",{d:"M4 12h16",key:"1lakjw"}],["path",{d:"M4 19h16",key:"1djgab"}]]);e.s(["Menu",0,r],593583)},749803,e=>{"use strict";let t=(0,e.i(456420).default)("chart-column",[["path",{d:"M3 3v16a2 2 0 0 0 2 2h16",key:"c24i48"}],["path",{d:"M18 17V9",key:"2bz60n"}],["path",{d:"M13 17V5",key:"1frdt8"}],["path",{d:"M8 17v-3",key:"17ska0"}]]);e.s(["BarChart3",0,t],749803)},566595,e=>{"use strict";let t=(0,e.i(456420).default)("search",[["path",{d:"m21 21-4.34-4.34",key:"14j7rj"}],["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}]]);e.s(["Search",0,t],566595)},263676,e=>{"use strict";let t=(0,e.i(456420).default)("x",[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]]);e.s(["X",0,t],263676)},705766,e=>{"use strict";let t,a;var r,o=e.i(271645);let i={data:""},n=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,s=/\/\*[^]*?\*\/|  +/g,l=/\n+/g,c=(e,t)=>{let a="",r="",o="";for(let i in e){let n=e[i];"@"==i[0]?"i"==i[1]?a=i+" "+n+";":r+="f"==i[1]?c(n,i):i+"{"+c(n,"k"==i[1]?"":t)+"}":"object"==typeof n?r+=c(n,t?t.replace(/([^,])+/g,e=>i.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,t=>/&/.test(t)?t.replace(/&/g,e):e?e+" "+t:t)):i):null!=n&&(i="-"==i[1]?i:i.replace(/[A-Z]/g,"-$&").toLowerCase(),o+=c.p?c.p(i,n):i+":"+n+";")}return a+(t&&o?t+"{"+o+"}":o)+r},d={},u=e=>{if("object"==typeof e){let t="";for(let a in e)t+=a+u(e[a]);return t}return e};function p(e){let t,a,r=this||{},o=e.call?e(r.p):e;return((e,t,a,r,o)=>{var i;let p=u(e),h=d[p]||(d[p]=(e=>{let t=0,a=11;for(;t<e.length;)a=101*a+e.charCodeAt(t++)>>>0;return"go"+a})(p));if(!d[h]){let t=p!==e?e:(e=>{let t,a,r=[{}];for(;t=n.exec(e.replace(s,""));)t[4]?r.shift():t[3]?(a=t[3].replace(l," ").trim(),r.unshift(r[0][a]=r[0][a]||{})):r[0][t[1]]=t[2].replace(l," ").trim();return r[0]})(e);d[h]=c(o?{["@keyframes "+h]:t}:t,a?"":"."+h)}let f=a&&d.g;return a&&(d.g=d[h]),i=d[h],f?t.data=t.data.replace(f,i):-1===t.data.indexOf(i)&&(t.data=r?i+t.data:t.data+i),h})(o.unshift?o.raw?(t=[].slice.call(arguments,1),a=r.p,o.reduce((e,r,o)=>{let i=t[o];if(i&&i.call){let e=i(a),t=e&&e.props&&e.props.className||/^go/.test(e)&&e;i=t?"."+t:e&&"object"==typeof e?e.props?"":c(e,""):!1===e?"":e}return e+r+(null==i?"":i)},"")):o.reduce((e,t)=>Object.assign(e,t&&t.call?t(r.p):t),{}):o,(e=>{if("object"==typeof window){let t=(e?e.querySelector("#_goober"):window._goober)||Object.assign(document.createElement("style"),{innerHTML:" ",id:"_goober"});return t.nonce=window.__nonce__,t.parentNode||(e||document.head).appendChild(t),t.firstChild}return e||i})(r.target),r.g,r.o,r.k)}p.bind({g:1});let h,f,m,y=p.bind({k:1});function g(e,t){let a=this||{};return function(){let r=arguments;function o(i,n){let s=Object.assign({},i),l=s.className||o.className;a.p=Object.assign({theme:f&&f()},s),a.o=/go\d/.test(l),s.className=p.apply(a,r)+(l?" "+l:""),t&&(s.ref=n);let c=e;return e[0]&&(c=s.as||e,delete s.as),m&&c[0]&&m(s),h(c,s)}return t?t(o):o}}var b=(e,t)=>"function"==typeof e?e(t):e,v=(t=0,()=>(++t).toString()),x=()=>{if(void 0===a&&"u">typeof window){let e=matchMedia("(prefers-reduced-motion: reduce)");a=!e||e.matches}return a},_="default",w=(e,t)=>{let{toastLimit:a}=e.settings;switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,a)};case 1:return{...e,toasts:e.toasts.map(e=>e.id===t.toast.id?{...e,...t.toast}:e)};case 2:let{toast:r}=t;return w(e,{type:+!!e.toasts.find(e=>e.id===r.id),toast:r});case 3:let{toastId:o}=t;return{...e,toasts:e.toasts.map(e=>e.id===o||void 0===o?{...e,dismissed:!0,visible:!1}:e)};case 4:return void 0===t.toastId?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(e=>e.id!==t.toastId)};case 5:return{...e,pausedAt:t.time};case 6:let i=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(e=>({...e,pauseDuration:e.pauseDuration+i}))}}},j=[],k={toasts:[],pausedAt:void 0,settings:{toastLimit:20}},C={},N=(e,t=_)=>{C[t]=w(C[t]||k,e),j.forEach(([e,a])=>{e===t&&a(C[t])})},S=e=>Object.keys(C).forEach(t=>N(e,t)),M=(e=_)=>t=>{N(t,e)},E={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},O=e=>(t,a)=>{let r,o=((e,t="blank",a)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:t,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...a,id:(null==a?void 0:a.id)||v()}))(t,e,a);return M(o.toasterId||(r=o.id,Object.keys(C).find(e=>C[e].toasts.some(e=>e.id===r))))({type:2,toast:o}),o.id},P=(e,t)=>O("blank")(e,t);P.error=O("error"),P.success=O("success"),P.loading=O("loading"),P.custom=O("custom"),P.dismiss=(e,t)=>{let a={type:3,toastId:e};t?M(t)(a):S(a)},P.dismissAll=e=>P.dismiss(void 0,e),P.remove=(e,t)=>{let a={type:4,toastId:e};t?M(t)(a):S(a)},P.removeAll=e=>P.remove(void 0,e),P.promise=(e,t,a)=>{let r=P.loading(t.loading,{...a,...null==a?void 0:a.loading});return"function"==typeof e&&(e=e()),e.then(e=>{let o=t.success?b(t.success,e):void 0;return o?P.success(o,{id:r,...a,...null==a?void 0:a.success}):P.dismiss(r),e}).catch(e=>{let o=t.error?b(t.error,e):void 0;o?P.error(o,{id:r,...a,...null==a?void 0:a.error}):P.dismiss(r)}),e};var A=1e3,L=y`
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
`,D=y`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,U=g("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||"#e0e0e0"};
  border-right-color: ${e=>e.primary||"#616161"};
  animation: ${D} 1s linear infinite;
`,I=y`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,z=y`
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
}`,W=g("div")`
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
    animation: ${z} 0.2s ease-out forwards;
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
`,H=y`
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
  animation: ${H} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,J=({toast:e})=>{let{icon:t,type:a,iconTheme:r}=e;return void 0!==t?"string"==typeof t?o.createElement(V,null,t):t:"blank"===a?null:o.createElement(F,null,o.createElement(U,{...r}),"loading"!==a&&o.createElement(B,null,"error"===a?o.createElement(R,{...r}):o.createElement(W,{...r})))},K=g("div")`
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
`,q=g("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,G=o.memo(({toast:e,position:t,style:a,children:r})=>{let i=e.height?((e,t)=>{let a=e.includes("top")?1:-1,[r,o]=x()?["0%{opacity:0;} 100%{opacity:1;}","0%{opacity:1;} 100%{opacity:0;}"]:[`
0% {transform: translate3d(0,${-200*a}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${-150*a}%,-1px) scale(.6); opacity:0;}
`];return{animation:t?`${y(r)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${y(o)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}})(e.position||t||"top-center",e.visible):{opacity:0},n=o.createElement(J,{toast:e}),s=o.createElement(q,{...e.ariaProps},b(e.message,e));return o.createElement(K,{className:e.className,style:{...i,...a,...e.style}},"function"==typeof r?r({icon:n,message:s}):o.createElement(o.Fragment,null,n,s))});r=o.createElement,c.p=void 0,h=r,f=void 0,m=void 0;var X=({id:e,className:t,style:a,onHeightUpdate:r,children:i})=>{let n=o.useCallback(t=>{if(t){let a=()=>{r(e,t.getBoundingClientRect().height)};a(),new MutationObserver(a).observe(t,{subtree:!0,childList:!0,characterData:!0})}},[e,r]);return o.createElement("div",{ref:n,className:t,style:a},i)},Z=p`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`;e.s(["Toaster",0,({reverseOrder:e,position:t="top-center",toastOptions:a,gutter:r,children:i,toasterId:n,containerStyle:s,containerClassName:l})=>{let{toasts:c,handlers:d}=((e,t="default")=>{let{toasts:a,pausedAt:r}=((e={},t=_)=>{let[a,r]=(0,o.useState)(C[t]||k),i=(0,o.useRef)(C[t]);(0,o.useEffect)(()=>(i.current!==C[t]&&r(C[t]),j.push([t,r]),()=>{let e=j.findIndex(([e])=>e===t);e>-1&&j.splice(e,1)}),[t]);let n=a.toasts.map(t=>{var a,r,o;return{...e,...e[t.type],...t,removeDelay:t.removeDelay||(null==(a=e[t.type])?void 0:a.removeDelay)||(null==e?void 0:e.removeDelay),duration:t.duration||(null==(r=e[t.type])?void 0:r.duration)||(null==e?void 0:e.duration)||E[t.type],style:{...e.style,...null==(o=e[t.type])?void 0:o.style,...t.style}}});return{...a,toasts:n}})(e,t),i=(0,o.useRef)(new Map).current,n=(0,o.useCallback)((e,t=A)=>{if(i.has(e))return;let a=setTimeout(()=>{i.delete(e),s({type:4,toastId:e})},t);i.set(e,a)},[]);(0,o.useEffect)(()=>{if(r)return;let e=Date.now(),o=a.map(a=>{if(a.duration===1/0)return;let r=(a.duration||0)+a.pauseDuration-(e-a.createdAt);if(r<0){a.visible&&P.dismiss(a.id);return}return setTimeout(()=>P.dismiss(a.id,t),r)});return()=>{o.forEach(e=>e&&clearTimeout(e))}},[a,r,t]);let s=(0,o.useCallback)(M(t),[t]),l=(0,o.useCallback)(()=>{s({type:5,time:Date.now()})},[s]),c=(0,o.useCallback)((e,t)=>{s({type:1,toast:{id:e,height:t}})},[s]),d=(0,o.useCallback)(()=>{r&&s({type:6,time:Date.now()})},[r,s]),u=(0,o.useCallback)((e,t)=>{let{reverseOrder:r=!1,gutter:o=8,defaultPosition:i}=t||{},n=a.filter(t=>(t.position||i)===(e.position||i)&&t.height),s=n.findIndex(t=>t.id===e.id),l=n.filter((e,t)=>t<s&&e.visible).length;return n.filter(e=>e.visible).slice(...r?[l+1]:[0,l]).reduce((e,t)=>e+(t.height||0)+o,0)},[a]);return(0,o.useEffect)(()=>{a.forEach(e=>{if(e.dismissed)n(e.id,e.removeDelay);else{let t=i.get(e.id);t&&(clearTimeout(t),i.delete(e.id))}})},[a,n]),{toasts:a,handlers:{updateHeight:c,startPause:l,endPause:d,calculateOffset:u}}})(a,n);return o.createElement("div",{"data-rht-toaster":n||"",style:{position:"fixed",zIndex:9999,top:16,left:16,right:16,bottom:16,pointerEvents:"none",...s},className:l,onMouseEnter:d.startPause,onMouseLeave:d.endPause},c.map(a=>{let n,s,l=a.position||t,c=d.calculateOffset(a,{reverseOrder:e,gutter:r,defaultPosition:t}),u=(n=l.includes("top"),s=l.includes("center")?{justifyContent:"center"}:l.includes("right")?{justifyContent:"flex-end"}:{},{left:0,right:0,display:"flex",position:"absolute",transition:x()?void 0:"all 230ms cubic-bezier(.21,1.02,.73,1)",transform:`translateY(${c*(n?1:-1)}px)`,...n?{top:0}:{bottom:0},...s});return o.createElement(X,{id:a.id,key:a.id,onHeightUpdate:d.updateHeight,className:a.visible?Z:"",style:u},"custom"===a.type?b(a.message,a):i?i(a):o.createElement(G,{toast:a,position:l}))}))},"default",0,P,"toast",0,P],705766)},920476,e=>{"use strict";async function t(e,t){let a=await fetch(e,t),r=await a.json().catch(()=>null);if(!a.ok)throw Error(r?.error||r?.message||`Request failed with ${a.status}`);return r}e.s(["apiJson",0,t,"errorMessage",0,function(e,t="Something went wrong"){return e instanceof Error?e.message:t}])},856423,e=>{"use strict";let t=(0,e.i(456420).default)("book-open",[["path",{d:"M12 7v14",key:"1akyts"}],["path",{d:"M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z",key:"ruj8y"}]]);e.s(["BookOpen",0,t],856423)},730274,e=>{"use strict";let t=(0,e.i(456420).default)("send",[["path",{d:"M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",key:"1ffxy3"}],["path",{d:"m21.854 2.147-10.94 10.939",key:"12cjpa"}]]);e.s(["Send",0,t],730274)},203404,e=>{"use strict";var t=e.i(843476),a=e.i(618566),r=e.i(271645),o=e.i(705766),i=e.i(859015),n=e.i(920476);let s=e=>String(e??"").trim();function l({label:e,value:a,onChange:r,type:o="text"}){return(0,t.jsxs)("label",{className:"min-w-0",children:[(0,t.jsx)("span",{className:"mb-1 block text-sm font-bold text-slate-700",children:e}),(0,t.jsx)("input",{type:o,className:"input",value:a,onChange:e=>r(e.target.value)})]})}e.s(["default",0,function(){let e=(0,a.useParams)(),c=(0,a.useRouter)(),[d,u]=(0,r.useState)(!0),[p,h]=(0,r.useState)(!1),[f,m]=(0,r.useState)(!1),[y,g]=(0,r.useState)(""),[b,v]=(0,r.useState)(!1),[x,_]=(0,r.useState)(Date.now()),[w,j]=(0,r.useState)({school_name:"",school_code:"",email:"",phone:"",address:"",principal_name:"",principal_contact:"",owner_name:"",owner_contact:"",website:"",city:"",state:"",country:"India",postal_code:"",logo_url:"",favicon_url:"",primary_color:"#04142E",secondary_color:"#D4AF37",recognition_number:"",recognition_authority:"",recognition_start_date:"",recognition_expiry_date:"",affiliation_number:"",affiliation_authority:"",affiliation_start_date:"",affiliation_expiry_date:"",subscription_plan:"BASIC"});(0,r.useEffect)(()=>{(async()=>{try{let t=(await (0,n.apiJson)(`/api/schools/${e.id}`)).school||{};j({school_name:s(t.school_name),school_code:s(t.school_code),email:s(t.email),phone:s(t.phone),address:s(t.address),principal_name:s(t.principal_name),principal_contact:s(t.principal_contact),owner_name:s(t.owner_name),owner_contact:s(t.owner_contact),website:s(t.website),city:s(t.city),state:s(t.state),country:s(t.country)||"India",postal_code:s(t.postal_code),logo_url:s(t.school_logo)||s(t.logo_url),favicon_url:s(t.school_favicon)||s(t.favicon_url),recognition_number:s(t.recognition_number),recognition_authority:s(t.recognition_authority),recognition_start_date:s(t.recognition_start_date),recognition_expiry_date:s(t.recognition_expiry_date),affiliation_number:s(t.affiliation_number),affiliation_authority:s(t.affiliation_authority),affiliation_start_date:s(t.affiliation_start_date),affiliation_expiry_date:s(t.affiliation_expiry_date),primary_color:s(t.primary_color)||"#04142E",secondary_color:s(t.secondary_color)||"#D4AF37",subscription_plan:s(t.subscription_plan)||"BASIC"})}catch(e){o.default.error((0,n.errorMessage)(e,"Failed to load school"))}finally{u(!1)}})()},[e.id]),(0,r.useEffect)(()=>()=>{y.startsWith("blob:")&&URL.revokeObjectURL(y)},[y]);let k=(e,t)=>j(a=>({...a,[e]:t})),C=async t=>{if(t)try{m(!0),v(!1),y.startsWith("blob:")&&URL.revokeObjectURL(y);let a=URL.createObjectURL(t);g(a);let r=new FormData;r.append("file",t);let i=await fetch("/api/schools/upload",{method:"POST",body:r}),s=await i.json();if(!i.ok)throw Error(s.error||"Logo upload failed");let l={...w,logo_url:s.url,favicon_url:s.url};j(e=>({...e,logo_url:s.url,favicon_url:s.url})),_(Date.now()),await (0,n.apiJson)(`/api/schools/${e.id}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({...l,school_logo:l.logo_url,school_favicon:l.logo_url})}),await fetch("/api/switch-school",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({schoolId:e.id})}),window.dispatchEvent(new CustomEvent("tottech-branding-updated",{detail:{logoUrl:s.url}})),c.refresh(),o.default.success("Logo uploaded and saved")}catch(e){o.default.error((0,n.errorMessage)(e,"Failed to upload logo"))}finally{m(!1)}},N=async()=>{try{h(!0),await (0,n.apiJson)(`/api/schools/${e.id}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({...w,school_logo:w.logo_url,school_favicon:w.favicon_url||w.logo_url})}),await fetch("/api/switch-school",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({schoolId:e.id})}),window.dispatchEvent(new CustomEvent("tottech-branding-updated")),o.default.success("School updated"),c.push(`/schools/${e.id}`)}catch(e){o.default.error((0,n.errorMessage)(e,"Failed to update school"))}finally{h(!1)}};return(0,t.jsx)(i.default,{children:(0,t.jsxs)("main",{className:"space-y-6",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("h1",{className:"text-3xl font-black md:text-4xl",children:"Edit School"}),(0,t.jsx)("p",{className:"mt-1 max-w-3xl text-sm text-slate-600",children:"Update school name, address, contact details, and upload a school logo directly from PC or mobile."})]}),d?(0,t.jsx)("section",{className:"tt-card tt-card-pad",children:"Loading school..."}):(0,t.jsxs)("section",{className:"tt-card tt-card-pad",children:[(0,t.jsxs)("div",{className:"grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]",children:[(0,t.jsxs)("div",{className:"rounded-xl border border-slate-200 bg-slate-50 p-4",children:[(0,t.jsx)("p",{className:"text-sm font-black uppercase text-slate-600",children:"School Logo"}),(0,t.jsxs)("div",{className:"mt-4 grid aspect-square place-items-center overflow-hidden rounded-xl border border-slate-200 bg-white",children:[y||w.logo_url?(0,t.jsx)("img",{src:function(e,t){let a=s(e);if(!a)return"";let r=a.startsWith("/")||a.startsWith("http://")||a.startsWith("https://")||a.startsWith("blob:")||a.startsWith("data:")?a:`/${a}`;return!t||r.startsWith("data:")||r.startsWith("blob:")?r:`${r}${r.includes("?")?"&":"?"}v=${t}`}(y||w.logo_url,x),alt:"School logo preview",onError:e=>{e.currentTarget.style.display="none",v(!0)},className:"h-full w-full object-contain p-4"}):(0,t.jsx)("span",{className:"px-4 text-center text-sm font-bold text-slate-500",children:"No logo uploaded"}),b?(0,t.jsx)("span",{className:"px-4 text-center text-sm font-black text-amber-700",children:"Uploaded logo file is not loading. Please choose the logo again."}):null]}),(0,t.jsxs)("label",{className:"mt-4 block",children:[(0,t.jsx)("span",{className:"mb-2 block text-sm font-bold text-slate-700",children:"Upload Logo"}),(0,t.jsx)("input",{type:"file",accept:"image/png,image/jpeg,image/webp,image/svg+xml",className:"block w-full rounded-lg border border-slate-200 bg-white p-3 text-sm",disabled:f,onChange:e=>C(e.target.files?.[0])})]}),(0,t.jsx)("p",{className:"mt-3 text-xs font-semibold text-slate-500",children:"PNG, JPG, WEBP, or SVG. Maximum size 2 MB."})]}),(0,t.jsxs)("div",{className:"grid gap-4 md:grid-cols-2",children:[(0,t.jsx)(l,{label:"Recognition Number",value:w.recognition_number,onChange:e=>k("recognition_number",e)}),(0,t.jsx)(l,{label:"Recognition Authority",value:w.recognition_authority,onChange:e=>k("recognition_authority",e)}),(0,t.jsx)(l,{label:"Recognition Start Date",type:"date",value:w.recognition_start_date,onChange:e=>k("recognition_start_date",e)}),(0,t.jsx)(l,{label:"Recognition Expiry Date",type:"date",value:w.recognition_expiry_date,onChange:e=>k("recognition_expiry_date",e)}),(0,t.jsx)(l,{label:"Affiliation Number",value:w.affiliation_number,onChange:e=>k("affiliation_number",e)}),(0,t.jsx)(l,{label:"Affiliation Authority",value:w.affiliation_authority,onChange:e=>k("affiliation_authority",e)}),(0,t.jsx)(l,{label:"Affiliation Start Date",type:"date",value:w.affiliation_start_date,onChange:e=>k("affiliation_start_date",e)}),(0,t.jsx)(l,{label:"Affiliation Expiry Date",type:"date",value:w.affiliation_expiry_date,onChange:e=>k("affiliation_expiry_date",e)})]}),(0,t.jsxs)("div",{className:"grid gap-4 md:grid-cols-2",children:[(0,t.jsx)(l,{label:"School Name",value:w.school_name,onChange:e=>k("school_name",e)}),(0,t.jsx)(l,{label:"School Code",value:w.school_code,onChange:e=>k("school_code",e)}),(0,t.jsx)(l,{label:"Email",value:w.email,onChange:e=>k("email",e)}),(0,t.jsx)(l,{label:"Phone",value:w.phone,onChange:e=>k("phone",e)}),(0,t.jsxs)("label",{className:"min-w-0 md:col-span-2",children:[(0,t.jsx)("span",{className:"mb-1 block text-sm font-bold text-slate-700",children:"Address"}),(0,t.jsx)("textarea",{className:"input min-h-28",value:w.address,onChange:e=>k("address",e.target.value)})]}),(0,t.jsx)(l,{label:"Principal Name",value:w.principal_name,onChange:e=>k("principal_name",e)}),(0,t.jsx)(l,{label:"Principal Contact",value:w.principal_contact,onChange:e=>k("principal_contact",e)}),(0,t.jsx)(l,{label:"Owner Name",value:w.owner_name,onChange:e=>k("owner_name",e)}),(0,t.jsx)(l,{label:"Owner Contact",value:w.owner_contact,onChange:e=>k("owner_contact",e)}),(0,t.jsx)(l,{label:"City",value:w.city,onChange:e=>k("city",e)}),(0,t.jsx)(l,{label:"State",value:w.state,onChange:e=>k("state",e)}),(0,t.jsx)(l,{label:"Country",value:w.country,onChange:e=>k("country",e)}),(0,t.jsx)(l,{label:"Postal Code",value:w.postal_code,onChange:e=>k("postal_code",e)}),(0,t.jsx)(l,{label:"Website",value:w.website,onChange:e=>k("website",e)}),(0,t.jsx)(l,{label:"Subscription Plan",value:w.subscription_plan,onChange:e=>k("subscription_plan",e)})]})]}),(0,t.jsxs)("div",{className:"mt-6 flex flex-col gap-3 sm:flex-row",children:[(0,t.jsx)("button",{onClick:N,disabled:p||f,className:"tt-button",children:p?"Saving...":"Save Changes"}),(0,t.jsx)("button",{onClick:()=>c.back(),className:"tt-button-secondary",children:"Cancel"})]})]})]})})}])}]);