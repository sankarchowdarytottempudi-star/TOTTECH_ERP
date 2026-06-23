(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,270904,e=>{"use strict";let t=(0,e.i(456420).default)("wallet",[["path",{d:"M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1",key:"18etb6"}],["path",{d:"M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4",key:"xoc0q4"}]]);e.s(["Wallet",0,t],270904)},195057,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0});var a={formatUrl:function(){return n},formatWithValidation:function(){return d},urlObjectKeys:function(){return l}};for(var i in a)Object.defineProperty(r,i,{enumerable:!0,get:a[i]});let s=e.r(190809)._(e.r(998183)),o=/https?|ftp|gopher|file/;function n(e){let{auth:t,hostname:r}=e,a=e.protocol||"",i=e.pathname||"",n=e.hash||"",l=e.query||"",d=!1;t=t?encodeURIComponent(t).replace(/%3A/i,":")+"@":"",e.host?d=t+e.host:r&&(d=t+(~r.indexOf(":")?`[${r}]`:r),e.port&&(d+=":"+e.port)),l&&"object"==typeof l&&(l=String(s.urlQueryToSearchParams(l)));let c=e.search||l&&`?${l}`||"";return a&&!a.endsWith(":")&&(a+=":"),e.slashes||(!a||o.test(a))&&!1!==d?(d="//"+(d||""),i&&"/"!==i[0]&&(i="/"+i)):d||(d=""),n&&"#"!==n[0]&&(n="#"+n),c&&"?"!==c[0]&&(c="?"+c),i=i.replace(/[?#]/g,encodeURIComponent),c=c.replace("#","%23"),`${a}${d}${i}${c}${n}`}let l=["auth","hash","host","hostname","href","path","pathname","port","protocol","query","search","slashes"];function d(e){return n(e)}},573668,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"isLocalURL",{enumerable:!0,get:function(){return s}});let a=e.r(718967),i=e.r(652817);function s(e){if(!(0,a.isAbsoluteUrl)(e))return!0;try{let t=(0,a.getLocationOrigin)(),r=new URL(e,t);return r.origin===t&&(0,i.hasBasePath)(r.pathname)}catch(e){return!1}}},284508,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"errorOnce",{enumerable:!0,get:function(){return a}});let a=e=>{}},522016,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0});var a={default:function(){return g},useLinkStatus:function(){return b}};for(var i in a)Object.defineProperty(r,i,{enumerable:!0,get:a[i]});let s=e.r(190809),o=e.r(843476),n=s._(e.r(271645)),l=e.r(195057),d=e.r(8372),c=e.r(818581),u=e.r(718967),p=e.r(405550);e.r(233525);let f=e.r(388540),h=e.r(91949),m=e.r(573668),y=e.r(509396);function g(t){var r,a;let i,s,g,[b,x]=(0,n.useOptimistic)(h.IDLE_LINK_STATUS),k=(0,n.useRef)(null),{href:w,as:j,children:M,prefetch:C=null,passHref:A,replace:E,shallow:N,scroll:O,onClick:S,onMouseEnter:P,onTouchStart:_,legacyBehavior:$=!1,onNavigate:L,transitionTypes:R,ref:T,unstable_dynamicOnHover:I,...z}=t;i=M,$&&("string"==typeof i||"number"==typeof i)&&(i=(0,o.jsx)("a",{children:i}));let D=n.default.useContext(d.AppRouterContext),U=!1!==C,B=!1!==C?null===(a=C)||"auto"===a?y.FetchStrategy.PPR:y.FetchStrategy.Full:y.FetchStrategy.PPR,H="string"==typeof(r=j||w)?r:(0,l.formatUrl)(r);if($){if(i?.$$typeof===Symbol.for("react.lazy"))throw Object.defineProperty(Error("`<Link legacyBehavior>` received a direct child that is either a Server Component, or JSX that was loaded with React.lazy(). This is not supported. Either remove legacyBehavior, or make the direct child a Client Component that renders the Link's `<a>` tag."),"__NEXT_ERROR_CODE",{value:"E863",enumerable:!1,configurable:!0});s=n.default.Children.only(i)}let V=$?s&&"object"==typeof s&&s.ref:T,F=n.default.useCallback(e=>(null!==D&&(k.current=(0,h.mountLinkInstance)(e,H,D,B,U,x)),()=>{k.current&&((0,h.unmountLinkForCurrentNavigation)(k.current),k.current=null),(0,h.unmountPrefetchableInstance)(e)}),[U,H,D,B,x]),W={ref:(0,c.useMergedRef)(F,V),onClick(t){$||"function"!=typeof S||S(t),$&&s.props&&"function"==typeof s.props.onClick&&s.props.onClick(t),!D||t.defaultPrevented||function(t,r,a,i,s,o,l){if("u">typeof window){let d,{nodeName:c}=t.currentTarget;if("A"===c.toUpperCase()&&((d=t.currentTarget.getAttribute("target"))&&"_self"!==d||t.metaKey||t.ctrlKey||t.shiftKey||t.altKey||t.nativeEvent&&2===t.nativeEvent.which)||t.currentTarget.hasAttribute("download"))return;if(!(0,m.isLocalURL)(r)){i&&(t.preventDefault(),location.replace(r));return}if(t.preventDefault(),o){let e=!1;if(o({preventDefault:()=>{e=!0}}),e)return}let{dispatchNavigateAction:u}=e.r(699781);n.default.startTransition(()=>{u(r,i?"replace":"push",!1===s?f.ScrollBehavior.NoScroll:f.ScrollBehavior.Default,a.current,l)})}}(t,H,k,E,O,L,R)},onMouseEnter(e){$||"function"!=typeof P||P(e),$&&s.props&&"function"==typeof s.props.onMouseEnter&&s.props.onMouseEnter(e),D&&U&&(0,h.onNavigationIntent)(e.currentTarget,!0===I)},onTouchStart:function(e){$||"function"!=typeof _||_(e),$&&s.props&&"function"==typeof s.props.onTouchStart&&s.props.onTouchStart(e),D&&U&&(0,h.onNavigationIntent)(e.currentTarget,!0===I)}};return(0,u.isAbsoluteUrl)(H)?W.href=H:$&&!A&&("a"!==s.type||"href"in s.props)||(W.href=(0,p.addBasePath)(H)),g=$?n.default.cloneElement(s,W):(0,o.jsx)("a",{...z,...W,children:i}),(0,o.jsx)(v.Provider,{value:b,children:g})}e.r(284508);let v=(0,n.createContext)(h.IDLE_LINK_STATUS),b=()=>(0,n.useContext)(v);("function"==typeof r.default||"object"==typeof r.default&&null!==r.default)&&void 0===r.default.__esModule&&(Object.defineProperty(r.default,"__esModule",{value:!0}),Object.assign(r.default,r),t.exports=r.default)},618566,(e,t,r)=>{t.exports=e.r(976562)},396661,505014,e=>{"use strict";let t=(...e)=>e.filter((e,t,r)=>!!e&&""!==e.trim()&&r.indexOf(e)===t).join(" ").trim();e.s(["mergeClasses",0,t],396661);var r=e.i(271645),a={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};let i=(0,r.createContext)({}),s=(0,r.forwardRef)(({color:e,size:s,strokeWidth:o,absoluteStrokeWidth:n,className:l="",children:d,iconNode:c,...u},p)=>{let{size:f=24,strokeWidth:h=2,absoluteStrokeWidth:m=!1,color:y="currentColor",className:g=""}=(0,r.useContext)(i)??{},v=n??m?24*Number(o??h)/Number(s??f):o??h;return(0,r.createElement)("svg",{ref:p,...a,width:s??f??a.width,height:s??f??a.height,stroke:e??y,strokeWidth:v,className:t("lucide",g,l),...!d&&!(e=>{for(let t in e)if(t.startsWith("aria-")||"role"===t||"title"===t)return!0;return!1})(u)&&{"aria-hidden":"true"},...u},[...c.map(([e,t])=>(0,r.createElement)(e,t)),...Array.isArray(d)?d:[d]])});e.s(["default",0,s],505014)},146387,456420,e=>{"use strict";var t=e.i(271645),r=e.i(396661);let a=e=>{let t=e.replace(/^([A-Z])|[\s-_]+(\w)/g,(e,t,r)=>r?r.toUpperCase():t.toLowerCase());return t.charAt(0).toUpperCase()+t.slice(1)};var i=e.i(505014);let s=(e,s)=>{let o=(0,t.forwardRef)(({className:o,...n},l)=>(0,t.createElement)(i.default,{ref:l,iconNode:s,className:(0,r.mergeClasses)(`lucide-${a(e).replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase()}`,`lucide-${e}`,o),...n}));return o.displayName=a(e),o};e.s(["default",0,s],456420);let o=s("building-2",[["path",{d:"M10 12h4",key:"a56b0p"}],["path",{d:"M10 8h4",key:"1sr2af"}],["path",{d:"M14 21v-3a2 2 0 0 0-4 0v3",key:"1rgiei"}],["path",{d:"M6 10H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2",key:"secmi2"}],["path",{d:"M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16",key:"16ra0t"}]]);e.s(["Building2",0,o],146387)},818581,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"useMergedRef",{enumerable:!0,get:function(){return i}});let a=e.r(271645);function i(e,t){let r=(0,a.useRef)(null),i=(0,a.useRef)(null);return(0,a.useCallback)(a=>{if(null===a){let e=r.current;e&&(r.current=null,e());let t=i.current;t&&(i.current=null,t())}else e&&(r.current=s(e,a)),t&&(i.current=s(t,a))},[e,t])}function s(e,t){if("function"!=typeof e)return e.current=t,()=>{e.current=null};{let r=e(t);return"function"==typeof r?r:()=>e(null)}}("function"==typeof r.default||"object"==typeof r.default&&null!==r.default)&&void 0===r.default.__esModule&&(Object.defineProperty(r.default,"__esModule",{value:!0}),Object.assign(r.default,r),t.exports=r.default)},823482,e=>{"use strict";let t=(0,e.i(456420).default)("graduation-cap",[["path",{d:"M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z",key:"j76jl0"}],["path",{d:"M22 10v6",key:"1lu8f3"}],["path",{d:"M6 12.5V16a6 3 0 0 0 12 0v-3.5",key:"1r8lef"}]]);e.s(["GraduationCap",0,t],823482)},370812,e=>{"use strict";let t=(0,e.i(456420).default)("bell",[["path",{d:"M10.268 21a2 2 0 0 0 3.464 0",key:"vwvbt9"}],["path",{d:"M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326",key:"11g9vi"}]]);e.s(["Bell",0,t],370812)},716327,867927,e=>{"use strict";var t=e.i(456420);let r=(0,t.default)("chevron-down",[["path",{d:"m6 9 6 6 6-6",key:"qrunsl"}]]);e.s(["ChevronDown",0,r],716327);let a=(0,t.default)("chevron-right",[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]]);e.s(["ChevronRight",0,a],867927)},55677,e=>{"use strict";let t=(0,e.i(456420).default)("clipboard-list",[["rect",{width:"8",height:"4",x:"8",y:"2",rx:"1",ry:"1",key:"tgr4d6"}],["path",{d:"M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",key:"116196"}],["path",{d:"M12 11h4",key:"1jrz19"}],["path",{d:"M12 16h4",key:"n85exb"}],["path",{d:"M8 11h.01",key:"1dfujw"}],["path",{d:"M8 16h.01",key:"18s6g9"}]]);e.s(["ClipboardList",0,t],55677)},166794,e=>{"use strict";let t=(0,e.i(456420).default)("settings",[["path",{d:"M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915",key:"1i5ecw"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);e.s(["Settings",0,t],166794)},584026,e=>{"use strict";let t=(0,e.i(456420).default)("shield-check",[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]]);e.s(["ShieldCheck",0,t],584026)},779432,e=>{"use strict";let t=(0,e.i(456420).default)("activity",[["path",{d:"M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2",key:"169zse"}]]);e.s(["Activity",0,t],779432)},367784,593583,e=>{"use strict";var t=e.i(456420);let r=(0,t.default)("log-out",[["path",{d:"m16 17 5-5-5-5",key:"1bji2h"}],["path",{d:"M21 12H9",key:"dn1m92"}],["path",{d:"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",key:"1uf3rs"}]]);e.s(["LogOut",0,r],367784);let a=(0,t.default)("menu",[["path",{d:"M4 5h16",key:"1tepv9"}],["path",{d:"M4 12h16",key:"1lakjw"}],["path",{d:"M4 19h16",key:"1djgab"}]]);e.s(["Menu",0,a],593583)},749803,e=>{"use strict";let t=(0,e.i(456420).default)("chart-column",[["path",{d:"M3 3v16a2 2 0 0 0 2 2h16",key:"c24i48"}],["path",{d:"M18 17V9",key:"2bz60n"}],["path",{d:"M13 17V5",key:"1frdt8"}],["path",{d:"M8 17v-3",key:"17ska0"}]]);e.s(["BarChart3",0,t],749803)},566595,e=>{"use strict";let t=(0,e.i(456420).default)("search",[["path",{d:"m21 21-4.34-4.34",key:"14j7rj"}],["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}]]);e.s(["Search",0,t],566595)},263676,e=>{"use strict";let t=(0,e.i(456420).default)("x",[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]]);e.s(["X",0,t],263676)},705766,e=>{"use strict";let t,r;var a,i=e.i(271645);let s={data:""},o=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,n=/\/\*[^]*?\*\/|  +/g,l=/\n+/g,d=(e,t)=>{let r="",a="",i="";for(let s in e){let o=e[s];"@"==s[0]?"i"==s[1]?r=s+" "+o+";":a+="f"==s[1]?d(o,s):s+"{"+d(o,"k"==s[1]?"":t)+"}":"object"==typeof o?a+=d(o,t?t.replace(/([^,])+/g,e=>s.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,t=>/&/.test(t)?t.replace(/&/g,e):e?e+" "+t:t)):s):null!=o&&(s="-"==s[1]?s:s.replace(/[A-Z]/g,"-$&").toLowerCase(),i+=d.p?d.p(s,o):s+":"+o+";")}return r+(t&&i?t+"{"+i+"}":i)+a},c={},u=e=>{if("object"==typeof e){let t="";for(let r in e)t+=r+u(e[r]);return t}return e};function p(e){let t,r,a=this||{},i=e.call?e(a.p):e;return((e,t,r,a,i)=>{var s;let p=u(e),f=c[p]||(c[p]=(e=>{let t=0,r=11;for(;t<e.length;)r=101*r+e.charCodeAt(t++)>>>0;return"go"+r})(p));if(!c[f]){let t=p!==e?e:(e=>{let t,r,a=[{}];for(;t=o.exec(e.replace(n,""));)t[4]?a.shift():t[3]?(r=t[3].replace(l," ").trim(),a.unshift(a[0][r]=a[0][r]||{})):a[0][t[1]]=t[2].replace(l," ").trim();return a[0]})(e);c[f]=d(i?{["@keyframes "+f]:t}:t,r?"":"."+f)}let h=r&&c.g;return r&&(c.g=c[f]),s=c[f],h?t.data=t.data.replace(h,s):-1===t.data.indexOf(s)&&(t.data=a?s+t.data:t.data+s),f})(i.unshift?i.raw?(t=[].slice.call(arguments,1),r=a.p,i.reduce((e,a,i)=>{let s=t[i];if(s&&s.call){let e=s(r),t=e&&e.props&&e.props.className||/^go/.test(e)&&e;s=t?"."+t:e&&"object"==typeof e?e.props?"":d(e,""):!1===e?"":e}return e+a+(null==s?"":s)},"")):i.reduce((e,t)=>Object.assign(e,t&&t.call?t(a.p):t),{}):i,(e=>{if("object"==typeof window){let t=(e?e.querySelector("#_goober"):window._goober)||Object.assign(document.createElement("style"),{innerHTML:" ",id:"_goober"});return t.nonce=window.__nonce__,t.parentNode||(e||document.head).appendChild(t),t.firstChild}return e||s})(a.target),a.g,a.o,a.k)}p.bind({g:1});let f,h,m,y=p.bind({k:1});function g(e,t){let r=this||{};return function(){let a=arguments;function i(s,o){let n=Object.assign({},s),l=n.className||i.className;r.p=Object.assign({theme:h&&h()},n),r.o=/go\d/.test(l),n.className=p.apply(r,a)+(l?" "+l:""),t&&(n.ref=o);let d=e;return e[0]&&(d=n.as||e,delete n.as),m&&d[0]&&m(n),f(d,n)}return t?t(i):i}}var v=(e,t)=>"function"==typeof e?e(t):e,b=(t=0,()=>(++t).toString()),x=()=>{if(void 0===r&&"u">typeof window){let e=matchMedia("(prefers-reduced-motion: reduce)");r=!e||e.matches}return r},k="default",w=(e,t)=>{let{toastLimit:r}=e.settings;switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,r)};case 1:return{...e,toasts:e.toasts.map(e=>e.id===t.toast.id?{...e,...t.toast}:e)};case 2:let{toast:a}=t;return w(e,{type:+!!e.toasts.find(e=>e.id===a.id),toast:a});case 3:let{toastId:i}=t;return{...e,toasts:e.toasts.map(e=>e.id===i||void 0===i?{...e,dismissed:!0,visible:!1}:e)};case 4:return void 0===t.toastId?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(e=>e.id!==t.toastId)};case 5:return{...e,pausedAt:t.time};case 6:let s=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(e=>({...e,pauseDuration:e.pauseDuration+s}))}}},j=[],M={toasts:[],pausedAt:void 0,settings:{toastLimit:20}},C={},A=(e,t=k)=>{C[t]=w(C[t]||M,e),j.forEach(([e,r])=>{e===t&&r(C[t])})},E=e=>Object.keys(C).forEach(t=>A(e,t)),N=(e=k)=>t=>{A(t,e)},O={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},S=e=>(t,r)=>{let a,i=((e,t="blank",r)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:t,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...r,id:(null==r?void 0:r.id)||b()}))(t,e,r);return N(i.toasterId||(a=i.id,Object.keys(C).find(e=>C[e].toasts.some(e=>e.id===a))))({type:2,toast:i}),i.id},P=(e,t)=>S("blank")(e,t);P.error=S("error"),P.success=S("success"),P.loading=S("loading"),P.custom=S("custom"),P.dismiss=(e,t)=>{let r={type:3,toastId:e};t?N(t)(r):E(r)},P.dismissAll=e=>P.dismiss(void 0,e),P.remove=(e,t)=>{let r={type:4,toastId:e};t?N(t)(r):E(r)},P.removeAll=e=>P.remove(void 0,e),P.promise=(e,t,r)=>{let a=P.loading(t.loading,{...r,...null==r?void 0:r.loading});return"function"==typeof e&&(e=e()),e.then(e=>{let i=t.success?v(t.success,e):void 0;return i?P.success(i,{id:a,...r,...null==r?void 0:r.success}):P.dismiss(a),e}).catch(e=>{let i=t.error?v(t.error,e):void 0;i?P.error(i,{id:a,...r,...null==r?void 0:r.error}):P.dismiss(a)}),e};var _=1e3,$=y`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,L=y`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,R=y`
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

  animation: ${$} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${L} 0.15s ease-out forwards;
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
    animation: ${R} 0.15s ease-out forwards;
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
`,z=g("div")`
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
}`,B=g("div")`
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
`,H=g("div")`
  position: absolute;
`,V=g("div")`
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
}`,W=g("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${F} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,K=({toast:e})=>{let{icon:t,type:r,iconTheme:a}=e;return void 0!==t?"string"==typeof t?i.createElement(W,null,t):t:"blank"===r?null:i.createElement(V,null,i.createElement(z,{...a}),"loading"!==r&&i.createElement(H,null,"error"===r?i.createElement(T,{...a}):i.createElement(B,{...a})))},q=g("div")`
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
`,X=g("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,Z=i.memo(({toast:e,position:t,style:r,children:a})=>{let s=e.height?((e,t)=>{let r=e.includes("top")?1:-1,[a,i]=x()?["0%{opacity:0;} 100%{opacity:1;}","0%{opacity:1;} 100%{opacity:0;}"]:[`
0% {transform: translate3d(0,${-200*r}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${-150*r}%,-1px) scale(.6); opacity:0;}
`];return{animation:t?`${y(a)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${y(i)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}})(e.position||t||"top-center",e.visible):{opacity:0},o=i.createElement(K,{toast:e}),n=i.createElement(X,{...e.ariaProps},v(e.message,e));return i.createElement(q,{className:e.className,style:{...s,...r,...e.style}},"function"==typeof a?a({icon:o,message:n}):i.createElement(i.Fragment,null,o,n))});a=i.createElement,d.p=void 0,f=a,h=void 0,m=void 0;var G=({id:e,className:t,style:r,onHeightUpdate:a,children:s})=>{let o=i.useCallback(t=>{if(t){let r=()=>{a(e,t.getBoundingClientRect().height)};r(),new MutationObserver(r).observe(t,{subtree:!0,childList:!0,characterData:!0})}},[e,a]);return i.createElement("div",{ref:o,className:t,style:r},s)},J=p`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`;e.s(["Toaster",0,({reverseOrder:e,position:t="top-center",toastOptions:r,gutter:a,children:s,toasterId:o,containerStyle:n,containerClassName:l})=>{let{toasts:d,handlers:c}=((e,t="default")=>{let{toasts:r,pausedAt:a}=((e={},t=k)=>{let[r,a]=(0,i.useState)(C[t]||M),s=(0,i.useRef)(C[t]);(0,i.useEffect)(()=>(s.current!==C[t]&&a(C[t]),j.push([t,a]),()=>{let e=j.findIndex(([e])=>e===t);e>-1&&j.splice(e,1)}),[t]);let o=r.toasts.map(t=>{var r,a,i;return{...e,...e[t.type],...t,removeDelay:t.removeDelay||(null==(r=e[t.type])?void 0:r.removeDelay)||(null==e?void 0:e.removeDelay),duration:t.duration||(null==(a=e[t.type])?void 0:a.duration)||(null==e?void 0:e.duration)||O[t.type],style:{...e.style,...null==(i=e[t.type])?void 0:i.style,...t.style}}});return{...r,toasts:o}})(e,t),s=(0,i.useRef)(new Map).current,o=(0,i.useCallback)((e,t=_)=>{if(s.has(e))return;let r=setTimeout(()=>{s.delete(e),n({type:4,toastId:e})},t);s.set(e,r)},[]);(0,i.useEffect)(()=>{if(a)return;let e=Date.now(),i=r.map(r=>{if(r.duration===1/0)return;let a=(r.duration||0)+r.pauseDuration-(e-r.createdAt);if(a<0){r.visible&&P.dismiss(r.id);return}return setTimeout(()=>P.dismiss(r.id,t),a)});return()=>{i.forEach(e=>e&&clearTimeout(e))}},[r,a,t]);let n=(0,i.useCallback)(N(t),[t]),l=(0,i.useCallback)(()=>{n({type:5,time:Date.now()})},[n]),d=(0,i.useCallback)((e,t)=>{n({type:1,toast:{id:e,height:t}})},[n]),c=(0,i.useCallback)(()=>{a&&n({type:6,time:Date.now()})},[a,n]),u=(0,i.useCallback)((e,t)=>{let{reverseOrder:a=!1,gutter:i=8,defaultPosition:s}=t||{},o=r.filter(t=>(t.position||s)===(e.position||s)&&t.height),n=o.findIndex(t=>t.id===e.id),l=o.filter((e,t)=>t<n&&e.visible).length;return o.filter(e=>e.visible).slice(...a?[l+1]:[0,l]).reduce((e,t)=>e+(t.height||0)+i,0)},[r]);return(0,i.useEffect)(()=>{r.forEach(e=>{if(e.dismissed)o(e.id,e.removeDelay);else{let t=s.get(e.id);t&&(clearTimeout(t),s.delete(e.id))}})},[r,o]),{toasts:r,handlers:{updateHeight:d,startPause:l,endPause:c,calculateOffset:u}}})(r,o);return i.createElement("div",{"data-rht-toaster":o||"",style:{position:"fixed",zIndex:9999,top:16,left:16,right:16,bottom:16,pointerEvents:"none",...n},className:l,onMouseEnter:c.startPause,onMouseLeave:c.endPause},d.map(r=>{let o,n,l=r.position||t,d=c.calculateOffset(r,{reverseOrder:e,gutter:a,defaultPosition:t}),u=(o=l.includes("top"),n=l.includes("center")?{justifyContent:"center"}:l.includes("right")?{justifyContent:"flex-end"}:{},{left:0,right:0,display:"flex",position:"absolute",transition:x()?void 0:"all 230ms cubic-bezier(.21,1.02,.73,1)",transform:`translateY(${d*(o?1:-1)}px)`,...o?{top:0}:{bottom:0},...n});return i.createElement(G,{id:r.id,key:r.id,onHeightUpdate:c.updateHeight,className:r.visible?J:"",style:u},"custom"===r.type?v(r.message,r):s?s(r):i.createElement(Z,{toast:r,position:l}))}))},"default",0,P,"toast",0,P],705766)},920476,e=>{"use strict";async function t(e,t){let r=await fetch(e,t),a=await r.json().catch(()=>null);if(!r.ok)throw Error(a?.error||a?.message||`Request failed with ${r.status}`);return a}e.s(["apiJson",0,t,"errorMessage",0,function(e,t="Something went wrong"){return e instanceof Error?e.message:t}])},730274,e=>{"use strict";let t=(0,e.i(456420).default)("send",[["path",{d:"M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",key:"1ffxy3"}],["path",{d:"m21.854 2.147-10.94 10.939",key:"12cjpa"}]]);e.s(["Send",0,t],730274)},856423,e=>{"use strict";let t=(0,e.i(456420).default)("book-open",[["path",{d:"M12 7v14",key:"1akyts"}],["path",{d:"M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z",key:"ruj8y"}]]);e.s(["BookOpen",0,t],856423)},603249,e=>{"use strict";var t=e.i(843476),r=e.i(859015);e.s(["default",0,function(){return(0,t.jsx)(r.default,{children:(0,t.jsxs)("div",{className:"space-y-6",children:[(0,t.jsxs)("div",{className:"bg-white p-8 rounded-3xl shadow",children:[(0,t.jsx)("h1",{className:"text-4xl font-bold",children:"AI Academic Intelligence"}),(0,t.jsx)("p",{className:"text-gray-500 mt-2",children:"Predictive Academic Analytics & Student Performance Insights"})]}),(0,t.jsx)("div",{className:"grid grid-cols-3 gap-6",children:[{title:"Students Analyzed",value:"1,248"},{title:"Average Score",value:"78%"},{title:"Weak Students",value:"92"},{title:"Top Performers",value:"138"},{title:"Attendance Risk",value:"34"},{title:"AI Recommendations",value:"427"}].map(e=>(0,t.jsxs)("div",{className:" bg-white rounded-3xl p-6 shadow ",children:[(0,t.jsx)("div",{className:"text-gray-500",children:e.title}),(0,t.jsx)("div",{className:"text-5xl font-bold mt-4",children:e.value})]},e.title))}),(0,t.jsxs)("div",{className:"grid grid-cols-2 gap-6",children:[(0,t.jsxs)("div",{className:"bg-white p-8 rounded-3xl shadow",children:[(0,t.jsx)("h2",{className:"text-2xl font-bold mb-4",children:"AI Recommendations"}),(0,t.jsxs)("div",{className:"space-y-4",children:[(0,t.jsx)("div",{className:"p-4 bg-red-50 rounded-xl",children:"24 students need immediate mathematics intervention."}),(0,t.jsx)("div",{className:"p-4 bg-yellow-50 rounded-xl",children:"Attendance dropped in Class 8-A by 12%."}),(0,t.jsx)("div",{className:"p-4 bg-green-50 rounded-xl",children:"Science performance improved by 18%."})]})]}),(0,t.jsxs)("div",{className:"bg-white p-8 rounded-3xl shadow",children:[(0,t.jsx)("h2",{className:"text-2xl font-bold mb-4",children:"AI Insights"}),(0,t.jsxs)("div",{className:"space-y-4",children:[(0,t.jsx)("div",{children:"Strongest Subject: Mathematics"}),(0,t.jsx)("div",{children:"Weakest Subject: Physics"}),(0,t.jsx)("div",{children:"Top Performing Class: Grade 10-A"}),(0,t.jsx)("div",{children:"At Risk Students: 34"}),(0,t.jsx)("div",{children:"Parent Notifications: 57 Pending"})]})]})]})]})})}])}]);