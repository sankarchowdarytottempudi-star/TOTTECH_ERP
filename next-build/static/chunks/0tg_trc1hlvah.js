(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,195057,(e,t,a)=>{"use strict";Object.defineProperty(a,"__esModule",{value:!0});var r={formatUrl:function(){return l},formatWithValidation:function(){return d},urlObjectKeys:function(){return n}};for(var s in r)Object.defineProperty(a,s,{enumerable:!0,get:r[s]});let i=e.r(190809)._(e.r(998183)),o=/https?|ftp|gopher|file/;function l(e){let{auth:t,hostname:a}=e,r=e.protocol||"",s=e.pathname||"",l=e.hash||"",n=e.query||"",d=!1;t=t?encodeURIComponent(t).replace(/%3A/i,":")+"@":"",e.host?d=t+e.host:a&&(d=t+(~a.indexOf(":")?`[${a}]`:a),e.port&&(d+=":"+e.port)),n&&"object"==typeof n&&(n=String(i.urlQueryToSearchParams(n)));let c=e.search||n&&`?${n}`||"";return r&&!r.endsWith(":")&&(r+=":"),e.slashes||(!r||o.test(r))&&!1!==d?(d="//"+(d||""),s&&"/"!==s[0]&&(s="/"+s)):d||(d=""),l&&"#"!==l[0]&&(l="#"+l),c&&"?"!==c[0]&&(c="?"+c),s=s.replace(/[?#]/g,encodeURIComponent),c=c.replace("#","%23"),`${r}${d}${s}${c}${l}`}let n=["auth","hash","host","hostname","href","path","pathname","port","protocol","query","search","slashes"];function d(e){return l(e)}},573668,(e,t,a)=>{"use strict";Object.defineProperty(a,"__esModule",{value:!0}),Object.defineProperty(a,"isLocalURL",{enumerable:!0,get:function(){return i}});let r=e.r(718967),s=e.r(652817);function i(e){if(!(0,r.isAbsoluteUrl)(e))return!0;try{let t=(0,r.getLocationOrigin)(),a=new URL(e,t);return a.origin===t&&(0,s.hasBasePath)(a.pathname)}catch(e){return!1}}},284508,(e,t,a)=>{"use strict";Object.defineProperty(a,"__esModule",{value:!0}),Object.defineProperty(a,"errorOnce",{enumerable:!0,get:function(){return r}});let r=e=>{}},522016,(e,t,a)=>{"use strict";Object.defineProperty(a,"__esModule",{value:!0});var r={default:function(){return b},useLinkStatus:function(){return x}};for(var s in r)Object.defineProperty(a,s,{enumerable:!0,get:r[s]});let i=e.r(190809),o=e.r(843476),l=i._(e.r(271645)),n=e.r(195057),d=e.r(8372),c=e.r(818581),u=e.r(718967),p=e.r(405550);e.r(233525);let h=e.r(388540),f=e.r(91949),m=e.r(573668),y=e.r(509396);function b(t){var a,r;let s,i,b,[x,v]=(0,l.useOptimistic)(f.IDLE_LINK_STATUS),k=(0,l.useRef)(null),{href:w,as:j,children:M,prefetch:C=null,passHref:N,replace:S,shallow:A,scroll:P,onClick:E,onMouseEnter:O,onTouchStart:_,legacyBehavior:I=!1,onNavigate:T,transitionTypes:z,ref:$,unstable_dynamicOnHover:R,...L}=t;s=M,I&&("string"==typeof s||"number"==typeof s)&&(s=(0,o.jsx)("a",{children:s}));let D=l.default.useContext(d.AppRouterContext),U=!1!==C,B=!1!==C?null===(r=C)||"auto"===r?y.FetchStrategy.PPR:y.FetchStrategy.Full:y.FetchStrategy.PPR,H="string"==typeof(a=j||w)?a:(0,n.formatUrl)(a);if(I){if(s?.$$typeof===Symbol.for("react.lazy"))throw Object.defineProperty(Error("`<Link legacyBehavior>` received a direct child that is either a Server Component, or JSX that was loaded with React.lazy(). This is not supported. Either remove legacyBehavior, or make the direct child a Client Component that renders the Link's `<a>` tag."),"__NEXT_ERROR_CODE",{value:"E863",enumerable:!1,configurable:!0});i=l.default.Children.only(s)}let F=I?i&&"object"==typeof i&&i.ref:$,V=l.default.useCallback(e=>(null!==D&&(k.current=(0,f.mountLinkInstance)(e,H,D,B,U,v)),()=>{k.current&&((0,f.unmountLinkForCurrentNavigation)(k.current),k.current=null),(0,f.unmountPrefetchableInstance)(e)}),[U,H,D,B,v]),K={ref:(0,c.useMergedRef)(V,F),onClick(t){I||"function"!=typeof E||E(t),I&&i.props&&"function"==typeof i.props.onClick&&i.props.onClick(t),!D||t.defaultPrevented||function(t,a,r,s,i,o,n){if("u">typeof window){let d,{nodeName:c}=t.currentTarget;if("A"===c.toUpperCase()&&((d=t.currentTarget.getAttribute("target"))&&"_self"!==d||t.metaKey||t.ctrlKey||t.shiftKey||t.altKey||t.nativeEvent&&2===t.nativeEvent.which)||t.currentTarget.hasAttribute("download"))return;if(!(0,m.isLocalURL)(a)){s&&(t.preventDefault(),location.replace(a));return}if(t.preventDefault(),o){let e=!1;if(o({preventDefault:()=>{e=!0}}),e)return}let{dispatchNavigateAction:u}=e.r(699781);l.default.startTransition(()=>{u(a,s?"replace":"push",!1===i?h.ScrollBehavior.NoScroll:h.ScrollBehavior.Default,r.current,n)})}}(t,H,k,S,P,T,z)},onMouseEnter(e){I||"function"!=typeof O||O(e),I&&i.props&&"function"==typeof i.props.onMouseEnter&&i.props.onMouseEnter(e),D&&U&&(0,f.onNavigationIntent)(e.currentTarget,!0===R)},onTouchStart:function(e){I||"function"!=typeof _||_(e),I&&i.props&&"function"==typeof i.props.onTouchStart&&i.props.onTouchStart(e),D&&U&&(0,f.onNavigationIntent)(e.currentTarget,!0===R)}};return(0,u.isAbsoluteUrl)(H)?K.href=H:I&&!N&&("a"!==i.type||"href"in i.props)||(K.href=(0,p.addBasePath)(H)),b=I?l.default.cloneElement(i,K):(0,o.jsx)("a",{...L,...K,children:s}),(0,o.jsx)(g.Provider,{value:x,children:b})}e.r(284508);let g=(0,l.createContext)(f.IDLE_LINK_STATUS),x=()=>(0,l.useContext)(g);("function"==typeof a.default||"object"==typeof a.default&&null!==a.default)&&void 0===a.default.__esModule&&(Object.defineProperty(a.default,"__esModule",{value:!0}),Object.assign(a.default,a),t.exports=a.default)},396661,505014,e=>{"use strict";let t=(...e)=>e.filter((e,t,a)=>!!e&&""!==e.trim()&&a.indexOf(e)===t).join(" ").trim();e.s(["mergeClasses",0,t],396661);var a=e.i(271645),r={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};let s=(0,a.createContext)({}),i=(0,a.forwardRef)(({color:e,size:i,strokeWidth:o,absoluteStrokeWidth:l,className:n="",children:d,iconNode:c,...u},p)=>{let{size:h=24,strokeWidth:f=2,absoluteStrokeWidth:m=!1,color:y="currentColor",className:b=""}=(0,a.useContext)(s)??{},g=l??m?24*Number(o??f)/Number(i??h):o??f;return(0,a.createElement)("svg",{ref:p,...r,width:i??h??r.width,height:i??h??r.height,stroke:e??y,strokeWidth:g,className:t("lucide",b,n),...!d&&!(e=>{for(let t in e)if(t.startsWith("aria-")||"role"===t||"title"===t)return!0;return!1})(u)&&{"aria-hidden":"true"},...u},[...c.map(([e,t])=>(0,a.createElement)(e,t)),...Array.isArray(d)?d:[d]])});e.s(["default",0,i],505014)},618566,(e,t,a)=>{t.exports=e.r(976562)},146387,456420,e=>{"use strict";var t=e.i(271645),a=e.i(396661);let r=e=>{let t=e.replace(/^([A-Z])|[\s-_]+(\w)/g,(e,t,a)=>a?a.toUpperCase():t.toLowerCase());return t.charAt(0).toUpperCase()+t.slice(1)};var s=e.i(505014);let i=(e,i)=>{let o=(0,t.forwardRef)(({className:o,...l},n)=>(0,t.createElement)(s.default,{ref:n,iconNode:i,className:(0,a.mergeClasses)(`lucide-${r(e).replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase()}`,`lucide-${e}`,o),...l}));return o.displayName=r(e),o};e.s(["default",0,i],456420);let o=i("building-2",[["path",{d:"M10 12h4",key:"a56b0p"}],["path",{d:"M10 8h4",key:"1sr2af"}],["path",{d:"M14 21v-3a2 2 0 0 0-4 0v3",key:"1rgiei"}],["path",{d:"M6 10H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2",key:"secmi2"}],["path",{d:"M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16",key:"16ra0t"}]]);e.s(["Building2",0,o],146387)},818581,(e,t,a)=>{"use strict";Object.defineProperty(a,"__esModule",{value:!0}),Object.defineProperty(a,"useMergedRef",{enumerable:!0,get:function(){return s}});let r=e.r(271645);function s(e,t){let a=(0,r.useRef)(null),s=(0,r.useRef)(null);return(0,r.useCallback)(r=>{if(null===r){let e=a.current;e&&(a.current=null,e());let t=s.current;t&&(s.current=null,t())}else e&&(a.current=i(e,r)),t&&(s.current=i(t,r))},[e,t])}function i(e,t){if("function"!=typeof e)return e.current=t,()=>{e.current=null};{let a=e(t);return"function"==typeof a?a:()=>e(null)}}("function"==typeof a.default||"object"==typeof a.default&&null!==a.default)&&void 0===a.default.__esModule&&(Object.defineProperty(a.default,"__esModule",{value:!0}),Object.assign(a.default,a),t.exports=a.default)},823482,e=>{"use strict";let t=(0,e.i(456420).default)("graduation-cap",[["path",{d:"M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z",key:"j76jl0"}],["path",{d:"M22 10v6",key:"1lu8f3"}],["path",{d:"M6 12.5V16a6 3 0 0 0 12 0v-3.5",key:"1r8lef"}]]);e.s(["GraduationCap",0,t],823482)},55677,e=>{"use strict";let t=(0,e.i(456420).default)("clipboard-list",[["rect",{width:"8",height:"4",x:"8",y:"2",rx:"1",ry:"1",key:"tgr4d6"}],["path",{d:"M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",key:"116196"}],["path",{d:"M12 11h4",key:"1jrz19"}],["path",{d:"M12 16h4",key:"n85exb"}],["path",{d:"M8 11h.01",key:"1dfujw"}],["path",{d:"M8 16h.01",key:"18s6g9"}]]);e.s(["ClipboardList",0,t],55677)},584026,e=>{"use strict";let t=(0,e.i(456420).default)("shield-check",[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]]);e.s(["ShieldCheck",0,t],584026)},779432,e=>{"use strict";let t=(0,e.i(456420).default)("activity",[["path",{d:"M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2",key:"169zse"}]]);e.s(["Activity",0,t],779432)},749803,e=>{"use strict";let t=(0,e.i(456420).default)("chart-column",[["path",{d:"M3 3v16a2 2 0 0 0 2 2h16",key:"c24i48"}],["path",{d:"M18 17V9",key:"2bz60n"}],["path",{d:"M13 17V5",key:"1frdt8"}],["path",{d:"M8 17v-3",key:"17ska0"}]]);e.s(["BarChart3",0,t],749803)},370812,e=>{"use strict";let t=(0,e.i(456420).default)("bell",[["path",{d:"M10.268 21a2 2 0 0 0 3.464 0",key:"vwvbt9"}],["path",{d:"M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326",key:"11g9vi"}]]);e.s(["Bell",0,t],370812)},716327,867927,e=>{"use strict";var t=e.i(456420);let a=(0,t.default)("chevron-down",[["path",{d:"m6 9 6 6 6-6",key:"qrunsl"}]]);e.s(["ChevronDown",0,a],716327);let r=(0,t.default)("chevron-right",[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]]);e.s(["ChevronRight",0,r],867927)},367784,593583,e=>{"use strict";var t=e.i(456420);let a=(0,t.default)("log-out",[["path",{d:"m16 17 5-5-5-5",key:"1bji2h"}],["path",{d:"M21 12H9",key:"dn1m92"}],["path",{d:"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",key:"1uf3rs"}]]);e.s(["LogOut",0,a],367784);let r=(0,t.default)("menu",[["path",{d:"M4 5h16",key:"1tepv9"}],["path",{d:"M4 12h16",key:"1lakjw"}],["path",{d:"M4 19h16",key:"1djgab"}]]);e.s(["Menu",0,r],593583)},166794,e=>{"use strict";let t=(0,e.i(456420).default)("settings",[["path",{d:"M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915",key:"1i5ecw"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);e.s(["Settings",0,t],166794)},566595,e=>{"use strict";let t=(0,e.i(456420).default)("search",[["path",{d:"m21 21-4.34-4.34",key:"14j7rj"}],["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}]]);e.s(["Search",0,t],566595)},263676,e=>{"use strict";let t=(0,e.i(456420).default)("x",[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]]);e.s(["X",0,t],263676)},705766,e=>{"use strict";let t,a;var r,s=e.i(271645);let i={data:""},o=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,l=/\/\*[^]*?\*\/|  +/g,n=/\n+/g,d=(e,t)=>{let a="",r="",s="";for(let i in e){let o=e[i];"@"==i[0]?"i"==i[1]?a=i+" "+o+";":r+="f"==i[1]?d(o,i):i+"{"+d(o,"k"==i[1]?"":t)+"}":"object"==typeof o?r+=d(o,t?t.replace(/([^,])+/g,e=>i.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,t=>/&/.test(t)?t.replace(/&/g,e):e?e+" "+t:t)):i):null!=o&&(i="-"==i[1]?i:i.replace(/[A-Z]/g,"-$&").toLowerCase(),s+=d.p?d.p(i,o):i+":"+o+";")}return a+(t&&s?t+"{"+s+"}":s)+r},c={},u=e=>{if("object"==typeof e){let t="";for(let a in e)t+=a+u(e[a]);return t}return e};function p(e){let t,a,r=this||{},s=e.call?e(r.p):e;return((e,t,a,r,s)=>{var i;let p=u(e),h=c[p]||(c[p]=(e=>{let t=0,a=11;for(;t<e.length;)a=101*a+e.charCodeAt(t++)>>>0;return"go"+a})(p));if(!c[h]){let t=p!==e?e:(e=>{let t,a,r=[{}];for(;t=o.exec(e.replace(l,""));)t[4]?r.shift():t[3]?(a=t[3].replace(n," ").trim(),r.unshift(r[0][a]=r[0][a]||{})):r[0][t[1]]=t[2].replace(n," ").trim();return r[0]})(e);c[h]=d(s?{["@keyframes "+h]:t}:t,a?"":"."+h)}let f=a&&c.g;return a&&(c.g=c[h]),i=c[h],f?t.data=t.data.replace(f,i):-1===t.data.indexOf(i)&&(t.data=r?i+t.data:t.data+i),h})(s.unshift?s.raw?(t=[].slice.call(arguments,1),a=r.p,s.reduce((e,r,s)=>{let i=t[s];if(i&&i.call){let e=i(a),t=e&&e.props&&e.props.className||/^go/.test(e)&&e;i=t?"."+t:e&&"object"==typeof e?e.props?"":d(e,""):!1===e?"":e}return e+r+(null==i?"":i)},"")):s.reduce((e,t)=>Object.assign(e,t&&t.call?t(r.p):t),{}):s,(e=>{if("object"==typeof window){let t=(e?e.querySelector("#_goober"):window._goober)||Object.assign(document.createElement("style"),{innerHTML:" ",id:"_goober"});return t.nonce=window.__nonce__,t.parentNode||(e||document.head).appendChild(t),t.firstChild}return e||i})(r.target),r.g,r.o,r.k)}p.bind({g:1});let h,f,m,y=p.bind({k:1});function b(e,t){let a=this||{};return function(){let r=arguments;function s(i,o){let l=Object.assign({},i),n=l.className||s.className;a.p=Object.assign({theme:f&&f()},l),a.o=/go\d/.test(n),l.className=p.apply(a,r)+(n?" "+n:""),t&&(l.ref=o);let d=e;return e[0]&&(d=l.as||e,delete l.as),m&&d[0]&&m(l),h(d,l)}return t?t(s):s}}var g=(e,t)=>"function"==typeof e?e(t):e,x=(t=0,()=>(++t).toString()),v=()=>{if(void 0===a&&"u">typeof window){let e=matchMedia("(prefers-reduced-motion: reduce)");a=!e||e.matches}return a},k="default",w=(e,t)=>{let{toastLimit:a}=e.settings;switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,a)};case 1:return{...e,toasts:e.toasts.map(e=>e.id===t.toast.id?{...e,...t.toast}:e)};case 2:let{toast:r}=t;return w(e,{type:+!!e.toasts.find(e=>e.id===r.id),toast:r});case 3:let{toastId:s}=t;return{...e,toasts:e.toasts.map(e=>e.id===s||void 0===s?{...e,dismissed:!0,visible:!1}:e)};case 4:return void 0===t.toastId?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(e=>e.id!==t.toastId)};case 5:return{...e,pausedAt:t.time};case 6:let i=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(e=>({...e,pauseDuration:e.pauseDuration+i}))}}},j=[],M={toasts:[],pausedAt:void 0,settings:{toastLimit:20}},C={},N=(e,t=k)=>{C[t]=w(C[t]||M,e),j.forEach(([e,a])=>{e===t&&a(C[t])})},S=e=>Object.keys(C).forEach(t=>N(e,t)),A=(e=k)=>t=>{N(t,e)},P={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},E=e=>(t,a)=>{let r,s=((e,t="blank",a)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:t,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...a,id:(null==a?void 0:a.id)||x()}))(t,e,a);return A(s.toasterId||(r=s.id,Object.keys(C).find(e=>C[e].toasts.some(e=>e.id===r))))({type:2,toast:s}),s.id},O=(e,t)=>E("blank")(e,t);O.error=E("error"),O.success=E("success"),O.loading=E("loading"),O.custom=E("custom"),O.dismiss=(e,t)=>{let a={type:3,toastId:e};t?A(t)(a):S(a)},O.dismissAll=e=>O.dismiss(void 0,e),O.remove=(e,t)=>{let a={type:4,toastId:e};t?A(t)(a):S(a)},O.removeAll=e=>O.remove(void 0,e),O.promise=(e,t,a)=>{let r=O.loading(t.loading,{...a,...null==a?void 0:a.loading});return"function"==typeof e&&(e=e()),e.then(e=>{let s=t.success?g(t.success,e):void 0;return s?O.success(s,{id:r,...a,...null==a?void 0:a.success}):O.dismiss(r),e}).catch(e=>{let s=t.error?g(t.error,e):void 0;s?O.error(s,{id:r,...a,...null==a?void 0:a.error}):O.dismiss(r)}),e};var _=1e3,I=y`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,T=y`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,z=y`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,$=b("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${I} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
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
    animation: ${z} 0.15s ease-out forwards;
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
`,L=b("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||"#e0e0e0"};
  border-right-color: ${e=>e.primary||"#616161"};
  animation: ${R} 1s linear infinite;
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
}`,B=b("div")`
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
`,H=b("div")`
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
`,q=({toast:e})=>{let{icon:t,type:a,iconTheme:r}=e;return void 0!==t?"string"==typeof t?s.createElement(K,null,t):t:"blank"===a?null:s.createElement(F,null,s.createElement(L,{...r}),"loading"!==a&&s.createElement(H,null,"error"===a?s.createElement($,{...r}):s.createElement(B,{...r})))},W=b("div")`
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
`,G=b("div")`
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
`];return{animation:t?`${y(r)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${y(s)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}})(e.position||t||"top-center",e.visible):{opacity:0},o=s.createElement(q,{toast:e}),l=s.createElement(G,{...e.ariaProps},g(e.message,e));return s.createElement(W,{className:e.className,style:{...i,...a,...e.style}},"function"==typeof r?r({icon:o,message:l}):s.createElement(s.Fragment,null,o,l))});r=s.createElement,d.p=void 0,h=r,f=void 0,m=void 0;var Z=({id:e,className:t,style:a,onHeightUpdate:r,children:i})=>{let o=s.useCallback(t=>{if(t){let a=()=>{r(e,t.getBoundingClientRect().height)};a(),new MutationObserver(a).observe(t,{subtree:!0,childList:!0,characterData:!0})}},[e,r]);return s.createElement("div",{ref:o,className:t,style:a},i)},J=p`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`;e.s(["Toaster",0,({reverseOrder:e,position:t="top-center",toastOptions:a,gutter:r,children:i,toasterId:o,containerStyle:l,containerClassName:n})=>{let{toasts:d,handlers:c}=((e,t="default")=>{let{toasts:a,pausedAt:r}=((e={},t=k)=>{let[a,r]=(0,s.useState)(C[t]||M),i=(0,s.useRef)(C[t]);(0,s.useEffect)(()=>(i.current!==C[t]&&r(C[t]),j.push([t,r]),()=>{let e=j.findIndex(([e])=>e===t);e>-1&&j.splice(e,1)}),[t]);let o=a.toasts.map(t=>{var a,r,s;return{...e,...e[t.type],...t,removeDelay:t.removeDelay||(null==(a=e[t.type])?void 0:a.removeDelay)||(null==e?void 0:e.removeDelay),duration:t.duration||(null==(r=e[t.type])?void 0:r.duration)||(null==e?void 0:e.duration)||P[t.type],style:{...e.style,...null==(s=e[t.type])?void 0:s.style,...t.style}}});return{...a,toasts:o}})(e,t),i=(0,s.useRef)(new Map).current,o=(0,s.useCallback)((e,t=_)=>{if(i.has(e))return;let a=setTimeout(()=>{i.delete(e),l({type:4,toastId:e})},t);i.set(e,a)},[]);(0,s.useEffect)(()=>{if(r)return;let e=Date.now(),s=a.map(a=>{if(a.duration===1/0)return;let r=(a.duration||0)+a.pauseDuration-(e-a.createdAt);if(r<0){a.visible&&O.dismiss(a.id);return}return setTimeout(()=>O.dismiss(a.id,t),r)});return()=>{s.forEach(e=>e&&clearTimeout(e))}},[a,r,t]);let l=(0,s.useCallback)(A(t),[t]),n=(0,s.useCallback)(()=>{l({type:5,time:Date.now()})},[l]),d=(0,s.useCallback)((e,t)=>{l({type:1,toast:{id:e,height:t}})},[l]),c=(0,s.useCallback)(()=>{r&&l({type:6,time:Date.now()})},[r,l]),u=(0,s.useCallback)((e,t)=>{let{reverseOrder:r=!1,gutter:s=8,defaultPosition:i}=t||{},o=a.filter(t=>(t.position||i)===(e.position||i)&&t.height),l=o.findIndex(t=>t.id===e.id),n=o.filter((e,t)=>t<l&&e.visible).length;return o.filter(e=>e.visible).slice(...r?[n+1]:[0,n]).reduce((e,t)=>e+(t.height||0)+s,0)},[a]);return(0,s.useEffect)(()=>{a.forEach(e=>{if(e.dismissed)o(e.id,e.removeDelay);else{let t=i.get(e.id);t&&(clearTimeout(t),i.delete(e.id))}})},[a,o]),{toasts:a,handlers:{updateHeight:d,startPause:n,endPause:c,calculateOffset:u}}})(a,o);return s.createElement("div",{"data-rht-toaster":o||"",style:{position:"fixed",zIndex:9999,top:16,left:16,right:16,bottom:16,pointerEvents:"none",...l},className:n,onMouseEnter:c.startPause,onMouseLeave:c.endPause},d.map(a=>{let o,l,n=a.position||t,d=c.calculateOffset(a,{reverseOrder:e,gutter:r,defaultPosition:t}),u=(o=n.includes("top"),l=n.includes("center")?{justifyContent:"center"}:n.includes("right")?{justifyContent:"flex-end"}:{},{left:0,right:0,display:"flex",position:"absolute",transition:v()?void 0:"all 230ms cubic-bezier(.21,1.02,.73,1)",transform:`translateY(${d*(o?1:-1)}px)`,...o?{top:0}:{bottom:0},...l});return s.createElement(Z,{id:a.id,key:a.id,onHeightUpdate:c.updateHeight,className:a.visible?J:"",style:u},"custom"===a.type?g(a.message,a):i?i(a):s.createElement(X,{toast:a,position:n}))}))},"default",0,O,"toast",0,O],705766)},730274,e=>{"use strict";let t=(0,e.i(456420).default)("send",[["path",{d:"M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",key:"1ffxy3"}],["path",{d:"m21.854 2.147-10.94 10.939",key:"12cjpa"}]]);e.s(["Send",0,t],730274)},129768,e=>{"use strict";let t=(0,e.i(456420).default)("calendar-days",[["path",{d:"M8 2v4",key:"1cmpym"}],["path",{d:"M16 2v4",key:"4m81vk"}],["rect",{width:"18",height:"18",x:"3",y:"4",rx:"2",key:"1hopcy"}],["path",{d:"M3 10h18",key:"8toen8"}],["path",{d:"M8 14h.01",key:"6423bh"}],["path",{d:"M12 14h.01",key:"1etili"}],["path",{d:"M16 14h.01",key:"1gbofw"}],["path",{d:"M8 18h.01",key:"lrp35t"}],["path",{d:"M12 18h.01",key:"mhygvu"}],["path",{d:"M16 18h.01",key:"kzsmim"}]]);e.s(["CalendarDays",0,t],129768)},226091,e=>{"use strict";let t=(0,e.i(456420).default)("file-text",[["path",{d:"M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z",key:"1oefj6"}],["path",{d:"M14 2v5a1 1 0 0 0 1 1h5",key:"wfsgrz"}],["path",{d:"M10 9H8",key:"b1mrlr"}],["path",{d:"M16 13H8",key:"t4e002"}],["path",{d:"M16 17H8",key:"z1uh3a"}]]);e.s(["FileText",0,t],226091)},765649,e=>{"use strict";let t=(0,e.i(456420).default)("user-round",[["circle",{cx:"12",cy:"8",r:"5",key:"1hypcn"}],["path",{d:"M20 21a8 8 0 0 0-16 0",key:"rfgkzh"}]]);e.s(["UserRound",0,t],765649)},809584,e=>{"use strict";let t=(0,e.i(456420).default)("database",[["ellipse",{cx:"12",cy:"5",rx:"9",ry:"3",key:"msslwz"}],["path",{d:"M3 5V19A9 3 0 0 0 21 19V5",key:"1wlel7"}],["path",{d:"M3 12A9 3 0 0 0 21 12",key:"mv7ke4"}]]);e.s(["Database",0,t],809584)},262633,e=>{"use strict";let t=(0,e.i(456420).default)("brain",[["path",{d:"M12 18V5",key:"adv99a"}],["path",{d:"M15 13a4.17 4.17 0 0 1-3-4 4.17 4.17 0 0 1-3 4",key:"1e3is1"}],["path",{d:"M17.598 6.5A3 3 0 1 0 12 5a3 3 0 1 0-5.598 1.5",key:"1gqd8o"}],["path",{d:"M17.997 5.125a4 4 0 0 1 2.526 5.77",key:"iwvgf7"}],["path",{d:"M18 18a4 4 0 0 0 2-7.464",key:"efp6ie"}],["path",{d:"M19.967 17.483A4 4 0 1 1 12 18a4 4 0 1 1-7.967-.517",key:"1gq6am"}],["path",{d:"M6 18a4 4 0 0 1-2-7.464",key:"k1g0md"}],["path",{d:"M6.003 5.125a4 4 0 0 0-2.526 5.77",key:"q97ue3"}]]);e.s(["Brain",0,t],262633)},853138,e=>{"use strict";let t=(0,e.i(456420).default)("triangle-alert",[["path",{d:"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",key:"wmoenq"}],["path",{d:"M12 9v4",key:"juzpu7"}],["path",{d:"M12 17h.01",key:"p32p05"}]]);e.s(["AlertTriangle",0,t],853138)},758925,e=>{"use strict";let t=(0,e.i(456420).default)("key-round",[["path",{d:"M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z",key:"1s6t7t"}],["circle",{cx:"16.5",cy:"7.5",r:".5",fill:"currentColor",key:"w0ekpg"}]]);e.s(["KeyRound",0,t],758925)},462047,e=>{"use strict";var t=e.i(705766);e.s(["notify",0,{success:e=>t.default.success(e),error:e=>t.default.error(e),warning:e=>(0,t.default)(e,{icon:"⚠️"}),info:e=>(0,t.default)(e,{icon:"ℹ️"})}])},712320,e=>{"use strict";var t=e.i(843476),a=e.i(271645),r=e.i(262633),s=e.i(55677),i=e.i(689765),o=e.i(704154),l=e.i(730274),n=e.i(584026),d=e.i(595140),c=e.i(765649),u=e.i(953772),p=e.i(462047);let h=["Show patient summary for mobile 8179618819.","What are the latest lab results for this patient?","Show BP trend for the last 6 months.","Generate SOAP notes for the latest consultation.","Check medicine availability for Paracetamol.","How many appointments today?","Show pending lab tests.","Explain abnormal CBC values in simple language."],f=[{key:"doctor",label:"Doctor AI Copilot",icon:d.Stethoscope,description:"Patient summaries, vitals, lab review, prescriptions, SOAP notes, guidelines."},{key:"nurse",label:"Nursing AI",icon:s.ClipboardList,description:"Vitals queue, admitted patients, abnormal vitals, nursing workflow support."},{key:"lab_staff",label:"Lab AI",icon:i.FlaskConical,description:"Pending tests, critical results, report summaries, previous result comparison."},{key:"pharmacist",label:"Pharmacy AI",icon:o.Pill,description:"Stock checks, alternatives, expiring medicines, reorder support."},{key:"patient",label:"Patient Assistant",icon:c.UserRound,description:"Appointments, records, report explanations, medicine education, hospital services."},{key:"hospital_admin",label:"Operations AI",icon:r.Brain,description:"OPD load, revenue, waiting patients, productivity, inventory risk."}];function m({icon:e,text:a,description:r}){return(0,t.jsxs)("div",{className:"flex items-start gap-3",children:[(0,t.jsx)("div",{className:"grid h-9 w-9 shrink-0 place-items-center rounded-[8px] bg-teal-50 text-teal-800",children:(0,t.jsx)(e,{size:18})}),(0,t.jsxs)("div",{children:[(0,t.jsx)("p",{className:"text-sm font-black",children:a}),r?(0,t.jsx)("p",{className:"mt-1 text-xs font-semibold leading-5 text-slate-600",children:r}):null]})]})}function y({label:e,value:a}){return(0,t.jsxs)("div",{className:"rounded-[8px] border border-slate-200 bg-slate-50 p-3",children:[(0,t.jsx)("p",{className:"text-[11px] font-black uppercase text-slate-500",children:e}),(0,t.jsx)("p",{className:"mt-1 break-words text-xs font-bold text-slate-700",children:a})]})}e.s(["default",0,function(){let[e,s]=(0,a.useState)([{role:"assistant",text:"MedGPT Clinical is ready. Ask doctor, nurse, lab, pharmacy, patient, research, or hospital operations questions. For patient-specific answers, include UHID, mobile number, patient name, or open AI from Patient 360.",confidenceScore:82,dataSourcesUsed:["Hospital ERP Records","Clinical Medical Knowledge Base"],reasoningSummary:"Answers are scoped to the selected hospital/branch and include clinical safety guardrails.",audience:"doctor",intent:"general_medical"}]),[i,o]=(0,a.useState)(""),[d,c]=(0,a.useState)("doctor"),[b,g]=(0,a.useState)(!1),x=(0,a.useRef)(null);(0,a.useEffect)(()=>{x.current?.scrollIntoView({behavior:"smooth",block:"end"})},[e,b]);let v=async(e=i)=>{let t=e.trim();if(t){s(e=>[...e,{role:"user",text:t}]),o(""),g(!0);try{let e=await fetch("/api/clinical/ai",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({prompt:t,audience:d})}),a=await e.json();if(!e.ok)throw Error(a.error||"Clinical AI failed");s(e=>[...e,{role:"assistant",text:a.answer,confidenceScore:a.confidenceScore,dataSourcesUsed:a.dataSourcesUsed||[],reasoningSummary:a.reasoningSummary,audience:a.audience,intent:a.intent,patientId:a.patientId,safetyFlags:a.safetyFlags||[]}])}catch(e){p.notify.error(e instanceof Error?e.message:"Clinical AI failed")}finally{g(!1)}}};return(0,t.jsx)(u.default,{children:(0,t.jsxs)("div",{className:"grid min-h-full gap-6 p-4 xl:grid-cols-[0.34fr_0.66fr]",children:[(0,t.jsxs)("aside",{className:"space-y-6",children:[(0,t.jsxs)("section",{className:"tt-clinical-dark-hero rounded-[8px] border border-teal-200 bg-slate-950 p-6 text-white shadow-sm",children:[(0,t.jsxs)("div",{className:"flex items-center gap-3",children:[(0,t.jsx)("div",{className:"grid h-12 w-12 place-items-center rounded-[8px] border border-teal-300 bg-teal-500/10 text-teal-300",children:(0,t.jsx)(r.Brain,{size:24})}),(0,t.jsxs)("div",{children:[(0,t.jsx)("p",{className:"text-xl font-black",children:"MedGPT Clinical"}),(0,t.jsx)("p",{className:"text-xs font-black uppercase tracking-[0.12em] text-teal-300",children:"Healthcare Copilot"})]})]}),(0,t.jsx)("p",{className:"mt-4 text-sm font-semibold leading-6 text-slate-200",children:"Answers use tenant-isolated hospital records first, then the medical knowledge layer. It supports doctors, nurses, lab teams, pharmacists, patients, administrators, and researchers."})]}),(0,t.jsxs)("section",{className:"rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm",children:[(0,t.jsx)("h2",{className:"text-lg font-black",children:"Assistant Mode"}),(0,t.jsx)("div",{className:"mt-4 space-y-3",children:f.map(e=>(0,t.jsx)("button",{type:"button",onClick:()=>c(e.key),className:["w-full rounded-[8px] border p-3 text-left transition",d===e.key?"border-teal-400 bg-teal-50 shadow-sm":"border-slate-200 bg-slate-50 hover:border-teal-200"].join(" "),children:(0,t.jsx)(m,{icon:e.icon,text:e.label,description:e.description})},e.key))})]}),(0,t.jsxs)("section",{className:"rounded-[8px] border border-amber-200 bg-amber-50 p-5 text-amber-950 shadow-sm",children:[(0,t.jsxs)("div",{className:"flex items-center gap-3",children:[(0,t.jsx)(n.ShieldCheck,{size:20}),(0,t.jsx)("h2",{className:"text-lg font-black",children:"Clinical Safety"})]}),(0,t.jsx)("p",{className:"mt-3 text-sm font-semibold leading-6",children:"AI never diagnoses with certainty and never replaces a licensed physician. Emergency symptoms and critical values must be escalated immediately."})]})]}),(0,t.jsxs)("section",{className:"flex min-h-[720px] flex-col overflow-hidden rounded-[8px] border border-slate-200 bg-white shadow-sm",children:[(0,t.jsxs)("div",{className:"border-b border-slate-200 p-5",children:[(0,t.jsx)("h1",{className:"text-3xl font-black",children:"Clinical AI Workspace"}),(0,t.jsx)("p",{className:"mt-1 text-sm font-semibold text-slate-600",children:"Role-aware Medical GPT for hospital records, clinical support, patient education, research questions, and operations."})]}),(0,t.jsxs)("div",{className:"flex-1 space-y-4 overflow-y-auto bg-slate-50 p-5",children:[e.map((e,a)=>(0,t.jsxs)("div",{className:`max-w-[88%] rounded-[8px] border p-4 shadow-sm ${"user"===e.role?"ml-auto border-slate-900 bg-slate-950 text-white":"border-teal-100 bg-white text-slate-950"}`,children:[(0,t.jsx)("p",{className:"whitespace-pre-wrap break-words text-sm font-semibold leading-6",children:e.text}),"assistant"===e.role?(0,t.jsxs)("div",{className:"mt-4 grid gap-3 md:grid-cols-4",children:[(0,t.jsx)(y,{label:"Confidence",value:`${e.confidenceScore||0}%`}),(0,t.jsx)(y,{label:"Mode",value:e.audience||d}),(0,t.jsx)(y,{label:"Intent",value:e.intent||"-"}),(0,t.jsx)(y,{label:"Sources",value:(e.dataSourcesUsed||[]).join(", ")||"-"}),e.patientId?(0,t.jsx)(y,{label:"Patient ID",value:String(e.patientId)}):null,(0,t.jsx)(y,{label:"Reasoning",value:e.reasoningSummary||"-"}),e.safetyFlags?.length?(0,t.jsx)(y,{label:"Safety",value:e.safetyFlags.join(" ")}):null]}):null]},`${e.role}-${a}`)),b?(0,t.jsx)("div",{className:"max-w-[88%] rounded-[8px] border border-teal-100 bg-white p-4 text-slate-950 shadow-sm",children:(0,t.jsxs)("div",{className:"flex items-center gap-3",children:[(0,t.jsx)("span",{className:"h-3 w-3 animate-pulse rounded-full bg-teal-600"}),(0,t.jsx)("p",{className:"text-sm font-black",children:"MedGPT Clinical is reviewing hospital records and knowledge..."})]})}):null,(0,t.jsx)("div",{ref:x})]}),(0,t.jsxs)("div",{className:"border-t border-slate-200 bg-white p-5",children:[(0,t.jsx)("div",{className:"mb-4 flex flex-wrap gap-2",children:h.map(e=>(0,t.jsx)("button",{onClick:()=>v(e),className:"rounded-[8px] border border-teal-200 bg-teal-50 px-3 py-2 text-xs font-black text-teal-800",children:e},e))}),(0,t.jsxs)("div",{className:"flex gap-3",children:[(0,t.jsx)("textarea",{value:i,onChange:e=>o(e.target.value),onKeyDown:e=>{"Enter"!==e.key||e.shiftKey||(e.preventDefault(),v())},placeholder:"Ask MedGPT Clinical. Example: summarize patient history for UHID...",className:"min-h-14 flex-1 resize-none rounded-[8px] border border-slate-300 px-4 py-3 text-sm font-semibold outline-none focus:border-teal-600"}),(0,t.jsx)("button",{onClick:()=>v(),disabled:b,className:"grid h-14 w-14 place-items-center rounded-[8px] bg-slate-950 text-white disabled:opacity-50","aria-label":"Send prompt",children:(0,t.jsx)(l.Send,{size:20})})]})]})]})]})})}])}]);