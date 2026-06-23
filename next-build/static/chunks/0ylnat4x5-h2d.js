(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,129768,e=>{"use strict";let t=(0,e.i(456420).default)("calendar-days",[["path",{d:"M8 2v4",key:"1cmpym"}],["path",{d:"M16 2v4",key:"4m81vk"}],["rect",{width:"18",height:"18",x:"3",y:"4",rx:"2",key:"1hopcy"}],["path",{d:"M3 10h18",key:"8toen8"}],["path",{d:"M8 14h.01",key:"6423bh"}],["path",{d:"M12 14h.01",key:"1etili"}],["path",{d:"M16 14h.01",key:"1gbofw"}],["path",{d:"M8 18h.01",key:"lrp35t"}],["path",{d:"M12 18h.01",key:"mhygvu"}],["path",{d:"M16 18h.01",key:"kzsmim"}]]);e.s(["CalendarDays",0,t],129768)},226091,e=>{"use strict";let t=(0,e.i(456420).default)("file-text",[["path",{d:"M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z",key:"1oefj6"}],["path",{d:"M14 2v5a1 1 0 0 0 1 1h5",key:"wfsgrz"}],["path",{d:"M10 9H8",key:"b1mrlr"}],["path",{d:"M16 13H8",key:"t4e002"}],["path",{d:"M16 17H8",key:"z1uh3a"}]]);e.s(["FileText",0,t],226091)},765649,e=>{"use strict";let t=(0,e.i(456420).default)("user-round",[["circle",{cx:"12",cy:"8",r:"5",key:"1hypcn"}],["path",{d:"M20 21a8 8 0 0 0-16 0",key:"rfgkzh"}]]);e.s(["UserRound",0,t],765649)},809584,e=>{"use strict";let t=(0,e.i(456420).default)("database",[["ellipse",{cx:"12",cy:"5",rx:"9",ry:"3",key:"msslwz"}],["path",{d:"M3 5V19A9 3 0 0 0 21 19V5",key:"1wlel7"}],["path",{d:"M3 12A9 3 0 0 0 21 12",key:"mv7ke4"}]]);e.s(["Database",0,t],809584)},262633,e=>{"use strict";let t=(0,e.i(456420).default)("brain",[["path",{d:"M12 18V5",key:"adv99a"}],["path",{d:"M15 13a4.17 4.17 0 0 1-3-4 4.17 4.17 0 0 1-3 4",key:"1e3is1"}],["path",{d:"M17.598 6.5A3 3 0 1 0 12 5a3 3 0 1 0-5.598 1.5",key:"1gqd8o"}],["path",{d:"M17.997 5.125a4 4 0 0 1 2.526 5.77",key:"iwvgf7"}],["path",{d:"M18 18a4 4 0 0 0 2-7.464",key:"efp6ie"}],["path",{d:"M19.967 17.483A4 4 0 1 1 12 18a4 4 0 1 1-7.967-.517",key:"1gq6am"}],["path",{d:"M6 18a4 4 0 0 1-2-7.464",key:"k1g0md"}],["path",{d:"M6.003 5.125a4 4 0 0 0-2.526 5.77",key:"q97ue3"}]]);e.s(["Brain",0,t],262633)},758925,e=>{"use strict";let t=(0,e.i(456420).default)("key-round",[["path",{d:"M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z",key:"1s6t7t"}],["circle",{cx:"16.5",cy:"7.5",r:".5",fill:"currentColor",key:"w0ekpg"}]]);e.s(["KeyRound",0,t],758925)},853138,e=>{"use strict";let t=(0,e.i(456420).default)("triangle-alert",[["path",{d:"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",key:"wmoenq"}],["path",{d:"M12 9v4",key:"juzpu7"}],["path",{d:"M12 17h.01",key:"p32p05"}]]);e.s(["AlertTriangle",0,t],853138)},195057,(e,t,a)=>{"use strict";Object.defineProperty(a,"__esModule",{value:!0});var r={formatUrl:function(){return o},formatWithValidation:function(){return d},urlObjectKeys:function(){return n}};for(var s in r)Object.defineProperty(a,s,{enumerable:!0,get:r[s]});let i=e.r(190809)._(e.r(998183)),l=/https?|ftp|gopher|file/;function o(e){let{auth:t,hostname:a}=e,r=e.protocol||"",s=e.pathname||"",o=e.hash||"",n=e.query||"",d=!1;t=t?encodeURIComponent(t).replace(/%3A/i,":")+"@":"",e.host?d=t+e.host:a&&(d=t+(~a.indexOf(":")?`[${a}]`:a),e.port&&(d+=":"+e.port)),n&&"object"==typeof n&&(n=String(i.urlQueryToSearchParams(n)));let c=e.search||n&&`?${n}`||"";return r&&!r.endsWith(":")&&(r+=":"),e.slashes||(!r||l.test(r))&&!1!==d?(d="//"+(d||""),s&&"/"!==s[0]&&(s="/"+s)):d||(d=""),o&&"#"!==o[0]&&(o="#"+o),c&&"?"!==c[0]&&(c="?"+c),s=s.replace(/[?#]/g,encodeURIComponent),c=c.replace("#","%23"),`${r}${d}${s}${c}${o}`}let n=["auth","hash","host","hostname","href","path","pathname","port","protocol","query","search","slashes"];function d(e){return o(e)}},573668,(e,t,a)=>{"use strict";Object.defineProperty(a,"__esModule",{value:!0}),Object.defineProperty(a,"isLocalURL",{enumerable:!0,get:function(){return i}});let r=e.r(718967),s=e.r(652817);function i(e){if(!(0,r.isAbsoluteUrl)(e))return!0;try{let t=(0,r.getLocationOrigin)(),a=new URL(e,t);return a.origin===t&&(0,s.hasBasePath)(a.pathname)}catch(e){return!1}}},284508,(e,t,a)=>{"use strict";Object.defineProperty(a,"__esModule",{value:!0}),Object.defineProperty(a,"errorOnce",{enumerable:!0,get:function(){return r}});let r=e=>{}},522016,(e,t,a)=>{"use strict";Object.defineProperty(a,"__esModule",{value:!0});var r={default:function(){return g},useLinkStatus:function(){return x}};for(var s in r)Object.defineProperty(a,s,{enumerable:!0,get:r[s]});let i=e.r(190809),l=e.r(843476),o=i._(e.r(271645)),n=e.r(195057),d=e.r(8372),c=e.r(818581),u=e.r(718967),p=e.r(405550);e.r(233525);let f=e.r(388540),h=e.r(91949),m=e.r(573668),y=e.r(509396);function g(t){var a,r;let s,i,g,[x,v]=(0,o.useOptimistic)(h.IDLE_LINK_STATUS),k=(0,o.useRef)(null),{href:j,as:w,children:M,prefetch:_=null,passHref:C,replace:N,shallow:S,scroll:E,onClick:O,onMouseEnter:T,onTouchStart:A,legacyBehavior:P=!1,onNavigate:z,transitionTypes:L,ref:R,unstable_dynamicOnHover:$,...F}=t;s=M,P&&("string"==typeof s||"number"==typeof s)&&(s=(0,l.jsx)("a",{children:s}));let D=o.default.useContext(d.AppRouterContext),I=!1!==_,U=!1!==_?null===(r=_)||"auto"===r?y.FetchStrategy.PPR:y.FetchStrategy.Full:y.FetchStrategy.PPR,q="string"==typeof(a=w||j)?a:(0,n.formatUrl)(a);if(P){if(s?.$$typeof===Symbol.for("react.lazy"))throw Object.defineProperty(Error("`<Link legacyBehavior>` received a direct child that is either a Server Component, or JSX that was loaded with React.lazy(). This is not supported. Either remove legacyBehavior, or make the direct child a Client Component that renders the Link's `<a>` tag."),"__NEXT_ERROR_CODE",{value:"E863",enumerable:!1,configurable:!0});i=o.default.Children.only(s)}let B=P?i&&"object"==typeof i&&i.ref:R,V=o.default.useCallback(e=>(null!==D&&(k.current=(0,h.mountLinkInstance)(e,q,D,U,I,v)),()=>{k.current&&((0,h.unmountLinkForCurrentNavigation)(k.current),k.current=null),(0,h.unmountPrefetchableInstance)(e)}),[I,q,D,U,v]),H={ref:(0,c.useMergedRef)(V,B),onClick(t){P||"function"!=typeof O||O(t),P&&i.props&&"function"==typeof i.props.onClick&&i.props.onClick(t),!D||t.defaultPrevented||function(t,a,r,s,i,l,n){if("u">typeof window){let d,{nodeName:c}=t.currentTarget;if("A"===c.toUpperCase()&&((d=t.currentTarget.getAttribute("target"))&&"_self"!==d||t.metaKey||t.ctrlKey||t.shiftKey||t.altKey||t.nativeEvent&&2===t.nativeEvent.which)||t.currentTarget.hasAttribute("download"))return;if(!(0,m.isLocalURL)(a)){s&&(t.preventDefault(),location.replace(a));return}if(t.preventDefault(),l){let e=!1;if(l({preventDefault:()=>{e=!0}}),e)return}let{dispatchNavigateAction:u}=e.r(699781);o.default.startTransition(()=>{u(a,s?"replace":"push",!1===i?f.ScrollBehavior.NoScroll:f.ScrollBehavior.Default,r.current,n)})}}(t,q,k,N,E,z,L)},onMouseEnter(e){P||"function"!=typeof T||T(e),P&&i.props&&"function"==typeof i.props.onMouseEnter&&i.props.onMouseEnter(e),D&&I&&(0,h.onNavigationIntent)(e.currentTarget,!0===$)},onTouchStart:function(e){P||"function"!=typeof A||A(e),P&&i.props&&"function"==typeof i.props.onTouchStart&&i.props.onTouchStart(e),D&&I&&(0,h.onNavigationIntent)(e.currentTarget,!0===$)}};return(0,u.isAbsoluteUrl)(q)?H.href=q:P&&!C&&("a"!==i.type||"href"in i.props)||(H.href=(0,p.addBasePath)(q)),g=P?o.default.cloneElement(i,H):(0,l.jsx)("a",{...F,...H,children:s}),(0,l.jsx)(b.Provider,{value:x,children:g})}e.r(284508);let b=(0,o.createContext)(h.IDLE_LINK_STATUS),x=()=>(0,o.useContext)(b);("function"==typeof a.default||"object"==typeof a.default&&null!==a.default)&&void 0===a.default.__esModule&&(Object.defineProperty(a.default,"__esModule",{value:!0}),Object.assign(a.default,a),t.exports=a.default)},396661,505014,e=>{"use strict";let t=(...e)=>e.filter((e,t,a)=>!!e&&""!==e.trim()&&a.indexOf(e)===t).join(" ").trim();e.s(["mergeClasses",0,t],396661);var a=e.i(271645),r={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};let s=(0,a.createContext)({}),i=(0,a.forwardRef)(({color:e,size:i,strokeWidth:l,absoluteStrokeWidth:o,className:n="",children:d,iconNode:c,...u},p)=>{let{size:f=24,strokeWidth:h=2,absoluteStrokeWidth:m=!1,color:y="currentColor",className:g=""}=(0,a.useContext)(s)??{},b=o??m?24*Number(l??h)/Number(i??f):l??h;return(0,a.createElement)("svg",{ref:p,...r,width:i??f??r.width,height:i??f??r.height,stroke:e??y,strokeWidth:b,className:t("lucide",g,n),...!d&&!(e=>{for(let t in e)if(t.startsWith("aria-")||"role"===t||"title"===t)return!0;return!1})(u)&&{"aria-hidden":"true"},...u},[...c.map(([e,t])=>(0,a.createElement)(e,t)),...Array.isArray(d)?d:[d]])});e.s(["default",0,i],505014)},618566,(e,t,a)=>{t.exports=e.r(976562)},146387,456420,e=>{"use strict";var t=e.i(271645),a=e.i(396661);let r=e=>{let t=e.replace(/^([A-Z])|[\s-_]+(\w)/g,(e,t,a)=>a?a.toUpperCase():t.toLowerCase());return t.charAt(0).toUpperCase()+t.slice(1)};var s=e.i(505014);let i=(e,i)=>{let l=(0,t.forwardRef)(({className:l,...o},n)=>(0,t.createElement)(s.default,{ref:n,iconNode:i,className:(0,a.mergeClasses)(`lucide-${r(e).replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase()}`,`lucide-${e}`,l),...o}));return l.displayName=r(e),l};e.s(["default",0,i],456420);let l=i("building-2",[["path",{d:"M10 12h4",key:"a56b0p"}],["path",{d:"M10 8h4",key:"1sr2af"}],["path",{d:"M14 21v-3a2 2 0 0 0-4 0v3",key:"1rgiei"}],["path",{d:"M6 10H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2",key:"secmi2"}],["path",{d:"M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16",key:"16ra0t"}]]);e.s(["Building2",0,l],146387)},818581,(e,t,a)=>{"use strict";Object.defineProperty(a,"__esModule",{value:!0}),Object.defineProperty(a,"useMergedRef",{enumerable:!0,get:function(){return s}});let r=e.r(271645);function s(e,t){let a=(0,r.useRef)(null),s=(0,r.useRef)(null);return(0,r.useCallback)(r=>{if(null===r){let e=a.current;e&&(a.current=null,e());let t=s.current;t&&(s.current=null,t())}else e&&(a.current=i(e,r)),t&&(s.current=i(t,r))},[e,t])}function i(e,t){if("function"!=typeof e)return e.current=t,()=>{e.current=null};{let a=e(t);return"function"==typeof a?a:()=>e(null)}}("function"==typeof a.default||"object"==typeof a.default&&null!==a.default)&&void 0===a.default.__esModule&&(Object.defineProperty(a.default,"__esModule",{value:!0}),Object.assign(a.default,a),t.exports=a.default)},823482,e=>{"use strict";let t=(0,e.i(456420).default)("graduation-cap",[["path",{d:"M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z",key:"j76jl0"}],["path",{d:"M22 10v6",key:"1lu8f3"}],["path",{d:"M6 12.5V16a6 3 0 0 0 12 0v-3.5",key:"1r8lef"}]]);e.s(["GraduationCap",0,t],823482)},55677,e=>{"use strict";let t=(0,e.i(456420).default)("clipboard-list",[["rect",{width:"8",height:"4",x:"8",y:"2",rx:"1",ry:"1",key:"tgr4d6"}],["path",{d:"M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",key:"116196"}],["path",{d:"M12 11h4",key:"1jrz19"}],["path",{d:"M12 16h4",key:"n85exb"}],["path",{d:"M8 11h.01",key:"1dfujw"}],["path",{d:"M8 16h.01",key:"18s6g9"}]]);e.s(["ClipboardList",0,t],55677)},779432,e=>{"use strict";let t=(0,e.i(456420).default)("activity",[["path",{d:"M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2",key:"169zse"}]]);e.s(["Activity",0,t],779432)},749803,e=>{"use strict";let t=(0,e.i(456420).default)("chart-column",[["path",{d:"M3 3v16a2 2 0 0 0 2 2h16",key:"c24i48"}],["path",{d:"M18 17V9",key:"2bz60n"}],["path",{d:"M13 17V5",key:"1frdt8"}],["path",{d:"M8 17v-3",key:"17ska0"}]]);e.s(["BarChart3",0,t],749803)},370812,e=>{"use strict";let t=(0,e.i(456420).default)("bell",[["path",{d:"M10.268 21a2 2 0 0 0 3.464 0",key:"vwvbt9"}],["path",{d:"M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326",key:"11g9vi"}]]);e.s(["Bell",0,t],370812)},716327,867927,e=>{"use strict";var t=e.i(456420);let a=(0,t.default)("chevron-down",[["path",{d:"m6 9 6 6 6-6",key:"qrunsl"}]]);e.s(["ChevronDown",0,a],716327);let r=(0,t.default)("chevron-right",[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]]);e.s(["ChevronRight",0,r],867927)},367784,593583,e=>{"use strict";var t=e.i(456420);let a=(0,t.default)("log-out",[["path",{d:"m16 17 5-5-5-5",key:"1bji2h"}],["path",{d:"M21 12H9",key:"dn1m92"}],["path",{d:"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",key:"1uf3rs"}]]);e.s(["LogOut",0,a],367784);let r=(0,t.default)("menu",[["path",{d:"M4 5h16",key:"1tepv9"}],["path",{d:"M4 12h16",key:"1lakjw"}],["path",{d:"M4 19h16",key:"1djgab"}]]);e.s(["Menu",0,r],593583)},166794,e=>{"use strict";let t=(0,e.i(456420).default)("settings",[["path",{d:"M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915",key:"1i5ecw"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);e.s(["Settings",0,t],166794)},566595,e=>{"use strict";let t=(0,e.i(456420).default)("search",[["path",{d:"m21 21-4.34-4.34",key:"14j7rj"}],["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}]]);e.s(["Search",0,t],566595)},584026,e=>{"use strict";let t=(0,e.i(456420).default)("shield-check",[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]]);e.s(["ShieldCheck",0,t],584026)},263676,e=>{"use strict";let t=(0,e.i(456420).default)("x",[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]]);e.s(["X",0,t],263676)},705766,e=>{"use strict";let t,a;var r,s=e.i(271645);let i={data:""},l=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,o=/\/\*[^]*?\*\/|  +/g,n=/\n+/g,d=(e,t)=>{let a="",r="",s="";for(let i in e){let l=e[i];"@"==i[0]?"i"==i[1]?a=i+" "+l+";":r+="f"==i[1]?d(l,i):i+"{"+d(l,"k"==i[1]?"":t)+"}":"object"==typeof l?r+=d(l,t?t.replace(/([^,])+/g,e=>i.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,t=>/&/.test(t)?t.replace(/&/g,e):e?e+" "+t:t)):i):null!=l&&(i="-"==i[1]?i:i.replace(/[A-Z]/g,"-$&").toLowerCase(),s+=d.p?d.p(i,l):i+":"+l+";")}return a+(t&&s?t+"{"+s+"}":s)+r},c={},u=e=>{if("object"==typeof e){let t="";for(let a in e)t+=a+u(e[a]);return t}return e};function p(e){let t,a,r=this||{},s=e.call?e(r.p):e;return((e,t,a,r,s)=>{var i;let p=u(e),f=c[p]||(c[p]=(e=>{let t=0,a=11;for(;t<e.length;)a=101*a+e.charCodeAt(t++)>>>0;return"go"+a})(p));if(!c[f]){let t=p!==e?e:(e=>{let t,a,r=[{}];for(;t=l.exec(e.replace(o,""));)t[4]?r.shift():t[3]?(a=t[3].replace(n," ").trim(),r.unshift(r[0][a]=r[0][a]||{})):r[0][t[1]]=t[2].replace(n," ").trim();return r[0]})(e);c[f]=d(s?{["@keyframes "+f]:t}:t,a?"":"."+f)}let h=a&&c.g;return a&&(c.g=c[f]),i=c[f],h?t.data=t.data.replace(h,i):-1===t.data.indexOf(i)&&(t.data=r?i+t.data:t.data+i),f})(s.unshift?s.raw?(t=[].slice.call(arguments,1),a=r.p,s.reduce((e,r,s)=>{let i=t[s];if(i&&i.call){let e=i(a),t=e&&e.props&&e.props.className||/^go/.test(e)&&e;i=t?"."+t:e&&"object"==typeof e?e.props?"":d(e,""):!1===e?"":e}return e+r+(null==i?"":i)},"")):s.reduce((e,t)=>Object.assign(e,t&&t.call?t(r.p):t),{}):s,(e=>{if("object"==typeof window){let t=(e?e.querySelector("#_goober"):window._goober)||Object.assign(document.createElement("style"),{innerHTML:" ",id:"_goober"});return t.nonce=window.__nonce__,t.parentNode||(e||document.head).appendChild(t),t.firstChild}return e||i})(r.target),r.g,r.o,r.k)}p.bind({g:1});let f,h,m,y=p.bind({k:1});function g(e,t){let a=this||{};return function(){let r=arguments;function s(i,l){let o=Object.assign({},i),n=o.className||s.className;a.p=Object.assign({theme:h&&h()},o),a.o=/go\d/.test(n),o.className=p.apply(a,r)+(n?" "+n:""),t&&(o.ref=l);let d=e;return e[0]&&(d=o.as||e,delete o.as),m&&d[0]&&m(o),f(d,o)}return t?t(s):s}}var b=(e,t)=>"function"==typeof e?e(t):e,x=(t=0,()=>(++t).toString()),v=()=>{if(void 0===a&&"u">typeof window){let e=matchMedia("(prefers-reduced-motion: reduce)");a=!e||e.matches}return a},k="default",j=(e,t)=>{let{toastLimit:a}=e.settings;switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,a)};case 1:return{...e,toasts:e.toasts.map(e=>e.id===t.toast.id?{...e,...t.toast}:e)};case 2:let{toast:r}=t;return j(e,{type:+!!e.toasts.find(e=>e.id===r.id),toast:r});case 3:let{toastId:s}=t;return{...e,toasts:e.toasts.map(e=>e.id===s||void 0===s?{...e,dismissed:!0,visible:!1}:e)};case 4:return void 0===t.toastId?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(e=>e.id!==t.toastId)};case 5:return{...e,pausedAt:t.time};case 6:let i=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(e=>({...e,pauseDuration:e.pauseDuration+i}))}}},w=[],M={toasts:[],pausedAt:void 0,settings:{toastLimit:20}},_={},C=(e,t=k)=>{_[t]=j(_[t]||M,e),w.forEach(([e,a])=>{e===t&&a(_[t])})},N=e=>Object.keys(_).forEach(t=>C(e,t)),S=(e=k)=>t=>{C(t,e)},E={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},O=e=>(t,a)=>{let r,s=((e,t="blank",a)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:t,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...a,id:(null==a?void 0:a.id)||x()}))(t,e,a);return S(s.toasterId||(r=s.id,Object.keys(_).find(e=>_[e].toasts.some(e=>e.id===r))))({type:2,toast:s}),s.id},T=(e,t)=>O("blank")(e,t);T.error=O("error"),T.success=O("success"),T.loading=O("loading"),T.custom=O("custom"),T.dismiss=(e,t)=>{let a={type:3,toastId:e};t?S(t)(a):N(a)},T.dismissAll=e=>T.dismiss(void 0,e),T.remove=(e,t)=>{let a={type:4,toastId:e};t?S(t)(a):N(a)},T.removeAll=e=>T.remove(void 0,e),T.promise=(e,t,a)=>{let r=T.loading(t.loading,{...a,...null==a?void 0:a.loading});return"function"==typeof e&&(e=e()),e.then(e=>{let s=t.success?b(t.success,e):void 0;return s?T.success(s,{id:r,...a,...null==a?void 0:a.success}):T.dismiss(r),e}).catch(e=>{let s=t.error?b(t.error,e):void 0;s?T.error(s,{id:r,...a,...null==a?void 0:a.error}):T.dismiss(r)}),e};var A=1e3,P=y`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,z=y`
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
}`,R=g("div")`
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
    animation: ${z} 0.15s ease-out forwards;
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
`,$=y`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,F=g("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||"#e0e0e0"};
  border-right-color: ${e=>e.primary||"#616161"};
  animation: ${$} 1s linear infinite;
`,D=y`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,I=y`
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
}`,U=g("div")`
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
    animation: ${I} 0.2s ease-out forwards;
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
`,q=g("div")`
  position: absolute;
`,B=g("div")`
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
}`,H=g("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${V} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,K=({toast:e})=>{let{icon:t,type:a,iconTheme:r}=e;return void 0!==t?"string"==typeof t?s.createElement(H,null,t):t:"blank"===a?null:s.createElement(B,null,s.createElement(F,{...r}),"loading"!==a&&s.createElement(q,null,"error"===a?s.createElement(R,{...r}):s.createElement(U,{...r})))},W=g("div")`
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
`,G=g("div")`
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
`];return{animation:t?`${y(r)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${y(s)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}})(e.position||t||"top-center",e.visible):{opacity:0},l=s.createElement(K,{toast:e}),o=s.createElement(G,{...e.ariaProps},b(e.message,e));return s.createElement(W,{className:e.className,style:{...i,...a,...e.style}},"function"==typeof r?r({icon:l,message:o}):s.createElement(s.Fragment,null,l,o))});r=s.createElement,d.p=void 0,f=r,h=void 0,m=void 0;var X=({id:e,className:t,style:a,onHeightUpdate:r,children:i})=>{let l=s.useCallback(t=>{if(t){let a=()=>{r(e,t.getBoundingClientRect().height)};a(),new MutationObserver(a).observe(t,{subtree:!0,childList:!0,characterData:!0})}},[e,r]);return s.createElement("div",{ref:l,className:t,style:a},i)},Z=p`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`;e.s(["Toaster",0,({reverseOrder:e,position:t="top-center",toastOptions:a,gutter:r,children:i,toasterId:l,containerStyle:o,containerClassName:n})=>{let{toasts:d,handlers:c}=((e,t="default")=>{let{toasts:a,pausedAt:r}=((e={},t=k)=>{let[a,r]=(0,s.useState)(_[t]||M),i=(0,s.useRef)(_[t]);(0,s.useEffect)(()=>(i.current!==_[t]&&r(_[t]),w.push([t,r]),()=>{let e=w.findIndex(([e])=>e===t);e>-1&&w.splice(e,1)}),[t]);let l=a.toasts.map(t=>{var a,r,s;return{...e,...e[t.type],...t,removeDelay:t.removeDelay||(null==(a=e[t.type])?void 0:a.removeDelay)||(null==e?void 0:e.removeDelay),duration:t.duration||(null==(r=e[t.type])?void 0:r.duration)||(null==e?void 0:e.duration)||E[t.type],style:{...e.style,...null==(s=e[t.type])?void 0:s.style,...t.style}}});return{...a,toasts:l}})(e,t),i=(0,s.useRef)(new Map).current,l=(0,s.useCallback)((e,t=A)=>{if(i.has(e))return;let a=setTimeout(()=>{i.delete(e),o({type:4,toastId:e})},t);i.set(e,a)},[]);(0,s.useEffect)(()=>{if(r)return;let e=Date.now(),s=a.map(a=>{if(a.duration===1/0)return;let r=(a.duration||0)+a.pauseDuration-(e-a.createdAt);if(r<0){a.visible&&T.dismiss(a.id);return}return setTimeout(()=>T.dismiss(a.id,t),r)});return()=>{s.forEach(e=>e&&clearTimeout(e))}},[a,r,t]);let o=(0,s.useCallback)(S(t),[t]),n=(0,s.useCallback)(()=>{o({type:5,time:Date.now()})},[o]),d=(0,s.useCallback)((e,t)=>{o({type:1,toast:{id:e,height:t}})},[o]),c=(0,s.useCallback)(()=>{r&&o({type:6,time:Date.now()})},[r,o]),u=(0,s.useCallback)((e,t)=>{let{reverseOrder:r=!1,gutter:s=8,defaultPosition:i}=t||{},l=a.filter(t=>(t.position||i)===(e.position||i)&&t.height),o=l.findIndex(t=>t.id===e.id),n=l.filter((e,t)=>t<o&&e.visible).length;return l.filter(e=>e.visible).slice(...r?[n+1]:[0,n]).reduce((e,t)=>e+(t.height||0)+s,0)},[a]);return(0,s.useEffect)(()=>{a.forEach(e=>{if(e.dismissed)l(e.id,e.removeDelay);else{let t=i.get(e.id);t&&(clearTimeout(t),i.delete(e.id))}})},[a,l]),{toasts:a,handlers:{updateHeight:d,startPause:n,endPause:c,calculateOffset:u}}})(a,l);return s.createElement("div",{"data-rht-toaster":l||"",style:{position:"fixed",zIndex:9999,top:16,left:16,right:16,bottom:16,pointerEvents:"none",...o},className:n,onMouseEnter:c.startPause,onMouseLeave:c.endPause},d.map(a=>{let l,o,n=a.position||t,d=c.calculateOffset(a,{reverseOrder:e,gutter:r,defaultPosition:t}),u=(l=n.includes("top"),o=n.includes("center")?{justifyContent:"center"}:n.includes("right")?{justifyContent:"flex-end"}:{},{left:0,right:0,display:"flex",position:"absolute",transition:v()?void 0:"all 230ms cubic-bezier(.21,1.02,.73,1)",transform:`translateY(${d*(l?1:-1)}px)`,...l?{top:0}:{bottom:0},...o});return s.createElement(X,{id:a.id,key:a.id,onHeightUpdate:c.updateHeight,className:a.visible?Z:"",style:u},"custom"===a.type?b(a.message,a):i?i(a):s.createElement(J,{toast:a,position:n}))}))},"default",0,T,"toast",0,T],705766)},462047,e=>{"use strict";var t=e.i(705766);e.s(["notify",0,{success:e=>t.default.success(e),error:e=>t.default.error(e),warning:e=>(0,t.default)(e,{icon:"⚠️"}),info:e=>(0,t.default)(e,{icon:"ℹ️"})}])},77071,e=>{"use strict";let t=(0,e.i(456420).default)("plus",[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"M12 5v14",key:"s699le"}]]);e.s(["Plus",0,t],77071)},137076,e=>{"use strict";let t=(0,e.i(456420).default)("layers",[["path",{d:"M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z",key:"zw3jo"}],["path",{d:"M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12",key:"1wduqc"}],["path",{d:"M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17",key:"kqbvx6"}]]);e.s(["default",0,t])},914400,e=>{"use strict";var t=e.i(843476),a=e.i(271645),r=e.i(55677),s=e.i(137076),s=s,i=e.i(77071);let l=(0,e.i(456420).default)("settings-2",[["path",{d:"M14 17H5",key:"gfn3mx"}],["path",{d:"M19 7h-9",key:"6i9tg"}],["circle",{cx:"17",cy:"17",r:"3",key:"18b49y"}],["circle",{cx:"7",cy:"7",r:"3",key:"dfmy0x"}]]);var o=e.i(953772),n=e.i(462047);let d=["Text","Number","Date","Date Time","Email","Phone","Dropdown","Multi Select","Checkbox","Radio","File Upload","Image Upload","Rich Text","Formula","Lookup","Section","Tab","Grid","Repeating Group"],c={form_key:"",form_name:"",module_name:"patients"},u={form_id:"",field_key:"",label:"",field_type:"Text",section_key:"",tab_key:"",sort_order:"10",is_required:!1,options:""};function p({label:e,value:a,placeholder:r,onChange:s}){return(0,t.jsxs)("label",{className:"block",children:[(0,t.jsx)("span",{className:"text-xs font-black uppercase text-slate-600",children:e}),(0,t.jsx)("input",{value:a,placeholder:r,onChange:e=>s(e.target.value),className:"mt-2 w-full rounded-[8px] border border-slate-300 px-3 py-3 text-sm font-semibold outline-none focus:border-teal-600"})]})}e.s(["default",0,function(){let[e,f]=(0,a.useState)([]),[h,m]=(0,a.useState)(c),[y,g]=(0,a.useState)(u),[b,x]=(0,a.useState)(!1),v=(0,a.useMemo)(()=>e.find(e=>String(e.id)===String(y.form_id))||e[0],[y.form_id,e]),k=async()=>{let e=await fetch("/api/clinical/forms");if(e.ok){let t=(await e.json()).forms||[];f(t),!y.form_id&&t[0]&&g(e=>({...e,form_id:String(t[0].id)}))}};(0,a.useEffect)(()=>{let e=window.setTimeout(()=>{k()},0);return()=>window.clearTimeout(e)},[]);let j=async()=>{x(!0);try{let e=await fetch("/api/clinical/forms",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(h)}),t=await e.json();if(!e.ok)throw Error(t.error||"Failed to save form");n.notify.success("Clinical form saved"),m(c),await k()}catch(e){n.notify.error(e instanceof Error?e.message:"Failed to save form")}finally{x(!1)}},w=async()=>{x(!0);try{let e=await fetch("/api/clinical/forms",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({...y,action:"field",options:y.options.split(",").map(e=>e.trim()).filter(Boolean),sort_order:Number(y.sort_order||0)})}),t=await e.json();if(!e.ok)throw Error(t.error||"Failed to save field");n.notify.success("Clinical field saved"),g({...u,form_id:y.form_id}),await k()}catch(e){n.notify.error(e instanceof Error?e.message:"Failed to save field")}finally{x(!1)}};return(0,t.jsx)(o.default,{children:(0,t.jsxs)("div",{className:"space-y-6 p-4",children:[(0,t.jsxs)("section",{className:"rounded-[8px] border border-teal-200 bg-white p-6 shadow-sm",children:[(0,t.jsx)("p",{className:"text-xs font-black uppercase tracking-[0.14em] text-teal-700",children:"No Code Clinical Configuration"}),(0,t.jsx)("h1",{className:"mt-2 text-4xl font-black",children:"Dynamic Form Builder"}),(0,t.jsx)("p",{className:"mt-2 max-w-3xl text-sm font-semibold leading-6 text-slate-600",children:"Configure patient, appointment, IVF, laboratory, radiology, billing, and workflow forms from the database. The patient registration page is already generated from this form definition."})]}),(0,t.jsxs)("section",{className:"grid gap-6 xl:grid-cols-2",children:[(0,t.jsxs)("article",{className:"rounded-[8px] border border-slate-200 bg-white p-6 shadow-sm",children:[(0,t.jsxs)("div",{className:"flex items-center gap-3",children:[(0,t.jsx)("div",{className:"grid h-11 w-11 place-items-center rounded-[8px] bg-teal-50 text-teal-800",children:(0,t.jsx)(r.ClipboardList,{size:22})}),(0,t.jsx)("h2",{className:"text-2xl font-black",children:"Create Form"})]}),(0,t.jsxs)("div",{className:"mt-5 grid gap-4",children:[(0,t.jsx)(p,{label:"Form Key",value:h.form_key,placeholder:"patient_registration",onChange:e=>m({...h,form_key:e})}),(0,t.jsx)(p,{label:"Form Name",value:h.form_name,placeholder:"Patient Registration",onChange:e=>m({...h,form_name:e})}),(0,t.jsx)(p,{label:"Module",value:h.module_name,placeholder:"patients",onChange:e=>m({...h,module_name:e})})]}),(0,t.jsxs)("button",{onClick:j,disabled:b,className:"mt-5 inline-flex items-center gap-2 rounded-[8px] bg-slate-950 px-5 py-3 text-sm font-black text-white disabled:opacity-50",children:[(0,t.jsx)(i.Plus,{size:17}),"Save Form"]})]}),(0,t.jsxs)("article",{className:"rounded-[8px] border border-slate-200 bg-white p-6 shadow-sm",children:[(0,t.jsxs)("div",{className:"flex items-center gap-3",children:[(0,t.jsx)("div",{className:"grid h-11 w-11 place-items-center rounded-[8px] bg-teal-50 text-teal-800",children:(0,t.jsx)(l,{size:22})}),(0,t.jsx)("h2",{className:"text-2xl font-black",children:"Add Field"})]}),(0,t.jsxs)("div",{className:"mt-5 grid gap-4 md:grid-cols-2",children:[(0,t.jsxs)("label",{className:"block md:col-span-2",children:[(0,t.jsx)("span",{className:"text-xs font-black uppercase text-slate-600",children:"Form"}),(0,t.jsx)("select",{value:y.form_id||String(e[0]?.id||""),onChange:e=>g({...y,form_id:e.target.value}),className:"mt-2 w-full rounded-[8px] border border-slate-300 px-3 py-3 text-sm font-semibold outline-none focus:border-teal-600",children:e.map(e=>(0,t.jsx)("option",{value:String(e.id),children:e.form_name},String(e.id)))})]}),(0,t.jsx)(p,{label:"Field Key",value:y.field_key,placeholder:"chief_complaint",onChange:e=>g({...y,field_key:e})}),(0,t.jsx)(p,{label:"Label",value:y.label,placeholder:"Chief Complaint",onChange:e=>g({...y,label:e})}),(0,t.jsxs)("label",{className:"block",children:[(0,t.jsx)("span",{className:"text-xs font-black uppercase text-slate-600",children:"Field Type"}),(0,t.jsx)("select",{value:y.field_type,onChange:e=>g({...y,field_type:e.target.value}),className:"mt-2 w-full rounded-[8px] border border-slate-300 px-3 py-3 text-sm font-semibold outline-none focus:border-teal-600",children:d.map(e=>(0,t.jsx)("option",{value:e,children:e},e))})]}),(0,t.jsx)(p,{label:"Sort Order",value:y.sort_order,onChange:e=>g({...y,sort_order:e})}),(0,t.jsx)(p,{label:"Section",value:y.section_key,onChange:e=>g({...y,section_key:e})}),(0,t.jsx)(p,{label:"Tab",value:y.tab_key,onChange:e=>g({...y,tab_key:e})}),(0,t.jsx)(p,{label:"Options",value:y.options,placeholder:"Female, Male, Other",onChange:e=>g({...y,options:e})}),(0,t.jsxs)("label",{className:"flex items-center gap-3 rounded-[8px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-black",children:[(0,t.jsx)("input",{type:"checkbox",checked:y.is_required,onChange:e=>g({...y,is_required:e.target.checked})}),"Required Field"]})]}),(0,t.jsxs)("button",{onClick:w,disabled:b||!e.length,className:"mt-5 inline-flex items-center gap-2 rounded-[8px] bg-slate-950 px-5 py-3 text-sm font-black text-white disabled:opacity-50",children:[(0,t.jsx)(i.Plus,{size:17}),"Save Field"]})]})]}),(0,t.jsxs)("section",{className:"rounded-[8px] border border-slate-200 bg-white p-6 shadow-sm",children:[(0,t.jsxs)("div",{className:"flex items-center gap-3",children:[(0,t.jsx)("div",{className:"grid h-11 w-11 place-items-center rounded-[8px] bg-teal-50 text-teal-800",children:(0,t.jsx)(s.default,{size:22})}),(0,t.jsx)("h2",{className:"text-2xl font-black",children:"Configured Forms"})]}),(0,t.jsxs)("div",{className:"mt-5 grid gap-4 xl:grid-cols-[0.7fr_1.3fr]",children:[(0,t.jsx)("div",{className:"space-y-3",children:e.map(e=>(0,t.jsxs)("button",{onClick:()=>g({...y,form_id:String(e.id)}),className:`w-full rounded-[8px] border p-4 text-left ${v?.id===e.id?"border-teal-300 bg-teal-50":"border-slate-200 bg-slate-50"}`,children:[(0,t.jsx)("p",{className:"break-words font-black",children:e.form_name}),(0,t.jsxs)("p",{className:"mt-1 break-words text-sm font-semibold text-slate-600",children:[e.module_name," | ",String(e.fields?.length||0)," ","fields"]})]},String(e.id)))}),(0,t.jsxs)("div",{className:"rounded-[8px] border border-slate-200 bg-slate-50 p-4",children:[(0,t.jsx)("h3",{className:"text-xl font-black",children:v?.form_name||"Select a form"}),(0,t.jsx)("div",{className:"mt-4 grid gap-3 md:grid-cols-2",children:(v?.fields||[]).map(e=>(0,t.jsxs)("div",{className:"rounded-[8px] border border-slate-200 bg-white p-4",children:[(0,t.jsx)("p",{className:"break-words font-black",children:String(e.label||e.field_key)}),(0,t.jsxs)("p",{className:"mt-1 break-words text-xs font-black uppercase text-teal-700",children:[String(e.field_type)," |"," ",e.is_required?"Required":"Optional"]})]},String(e.id)))}),v?.fields?.length?null:(0,t.jsx)("p",{className:"mt-4 rounded-[8px] border border-slate-200 bg-white p-4 text-sm font-semibold text-slate-600",children:"No fields configured for this form."})]})]})]})]})})}],914400)}]);