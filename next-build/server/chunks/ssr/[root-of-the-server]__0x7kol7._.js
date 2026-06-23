module.exports=[629202,a=>{"use strict";let b=(0,a.i(164831).default)("wallet",[["path",{d:"M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1",key:"18etb6"}],["path",{d:"M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4",key:"xoc0q4"}]]);a.s(["Wallet",0,b],629202)},24198,a=>{"use strict";async function b(a,b){let c=await fetch(a,b),d=await c.json().catch(()=>null);if(!c.ok)throw Error(d?.error||d?.message||`Request failed with ${c.status}`);return d}a.s(["apiJson",0,b,"errorMessage",0,function(a,b="Something went wrong"){return a instanceof Error?a.message:b}])},674746,a=>{"use strict";let b=(0,a.i(164831).default)("send",[["path",{d:"M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",key:"1ffxy3"}],["path",{d:"m21.854 2.147-10.94 10.939",key:"12cjpa"}]]);a.s(["Send",0,b],674746)},118688,a=>{"use strict";let b=(0,a.i(164831).default)("book-open",[["path",{d:"M12 7v14",key:"1akyts"}],["path",{d:"M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z",key:"ruj8y"}]]);a.s(["BookOpen",0,b],118688)},366286,a=>{"use strict";var b=a.i(406704);a.s(["notify",0,{success:a=>b.default.success(a),error:a=>b.default.error(a),warning:a=>(0,b.default)(a,{icon:"⚠️"}),info:a=>(0,b.default)(a,{icon:"ℹ️"})}])},879675,a=>{"use strict";let b=(0,a.i(164831).default)("save",[["path",{d:"M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",key:"1c8476"}],["path",{d:"M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7",key:"1ydtos"}],["path",{d:"M7 3v4a1 1 0 0 0 1 1h7",key:"t51u73"}]]);a.s(["Save",0,b],879675)},88444,a=>{"use strict";let b=(0,a.i(164831).default)("printer",[["path",{d:"M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2",key:"143wyd"}],["path",{d:"M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6",key:"1itne7"}],["rect",{x:"6",y:"14",width:"12",height:"8",rx:"1",key:"1ue0tg"}]]);a.s(["Printer",0,b],88444)},391393,a=>{"use strict";var b=a.i(366286);async function c({title:a,subtitle:g,documentLabel:h,metaHtml:i,bodyHtml:j,footerHtml:k,popupError:l="Allow popups to print this document.",pageSize:m="full",verificationUrl:n,barcodeValue:o}){var p;let q=window.open("","_blank","half"===m?"width=760,height=620":"width=980,height=760");if(!q)return void b.notify.error(l);q.document.open(),q.document.write((p=a,`
    <html>
      <head>
        <title>${d(p)}</title>
        <style>
          body{font-family:Arial,sans-serif;display:grid;min-height:100vh;place-items:center;color:#04142E}
          div{border:1px solid #e5e7eb;border-radius:16px;padding:24px 28px;box-shadow:0 20px 60px rgba(15,23,42,.12)}
          strong{display:block;font-size:18px}
          span{display:block;margin-top:6px;color:#64748b}
        </style>
      </head>
      <body>
        <div>
          <strong>Preparing ${d(p)}</strong>
          <span>Loading school branding...</span>
        </div>
      </body>
    </html>
  `)),q.document.close();let r=await e(),s=n?await f(n):null;q.document.open(),q.document.write(function({branding:a,title:b,subtitle:c,documentLabel:e,metaHtml:f,bodyHtml:g,footerHtml:h,pageSize:i="full",verificationUrl:j,barcodeValue:k,qrDataUrl:l}){let m=a.schoolName||a.product||"TOTTECH ONE",n=a.schoolCode||a.tagline||"Gateway To Learning",o=a.logoUrl||"/images/logo.png",p=a.primaryColor||"#04142E",q=a.secondaryColor||"#D4AF37",r=[a.address,a.phone,a.email].filter(Boolean).join(" | ");return"half"===i?function({title:a,subtitle:b,documentLabel:c,metaHtml:e,bodyHtml:f,footerHtml:g,schoolName:h,schoolCode:i,logoUrl:j,contact:k,verificationUrl:l,barcodeValue:m,qrDataUrl:n}){let o=o=>`
    <section class="copy">
      <header class="copy-header">
        <img class="copy-logo" src="${d(j)}" alt="${d(h)} logo" />
        <div class="copy-school">
          <h1>${d(h)}</h1>
          <p>${d(i)}</p>
          ${k?`<span>${d(k)}</span>`:""}
        </div>
        <div class="copy-title">
          <strong>${d(c||a)}</strong>
          <span>${d(o)}</span>
        </div>
      </header>
      <div class="copy-main">
        <div class="copy-intro">
          <h2>${d(a)}</h2>
          ${b?`<p>${d(b)}</p>`:""}
        </div>
        ${e||""}
        <div class="print-body">${f}</div>
        ${l||n?`<div class="verify-row">
                ${n?`<img class="qr" src="${d(n)}" alt="QR verification" />`:""}
                <div>
                  <div class="barcode">${(m||a||"TOTTECH").slice(0,42).split("").map((a,b)=>{let c=a.charCodeAt(0);return Array.from({length:5}).map((a,d)=>{let e=(c>>d&1)==1||(b+d)%4==0;return`<span style="display:inline-block;width:${e?2:1}px;height:18px;background:${e?"#111":"transparent"};margin-right:1px"></span>`}).join("")}).join("")}</div>
                  <p>${d(l||"")}</p>
                </div>
              </div>`:""}
      </div>
      <footer class="copy-footer">
        <span>${d(o)}</span>
        <span>Generated by TOTTECH ONE</span>
      </footer>
      ${g||""}
    </section>
  `;return`
    <html>
      <head>
        <title>${d(a)}</title>
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
          ${o("PARENT COPY")}
          <div class="cut-line"><span>Cut Here</span></div>
          ${o("SCHOOL RECORD COPY")}
        </main>
      </body>
    </html>
  `}({title:b,subtitle:c,documentLabel:e,metaHtml:f,bodyHtml:g,footerHtml:h,schoolName:m,schoolCode:n,logoUrl:o,contact:r,verificationUrl:j,barcodeValue:k,qrDataUrl:l}):`
    <html>
      <head>
        <title>${d(b)}</title>
        <style>
          :root{--print-primary:${p};--print-gold:${q};--print-ink:#071426;--print-muted:#64748b;--print-line:#d8dee8;--print-soft:#f8fafc}
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
              <img class="print-logo" src="${d(o)}" alt="${d(m)} logo" />
              <div class="print-school">
                <h1>${d(m)}</h1>
                <p>${d(n)}</p>
              </div>
            </div>
            <div class="print-document-badge">
              <span>${d(e||"School Document")}</span>
              <strong>${d(new Date().toLocaleDateString())}</strong>
            </div>
          </header>
          <section class="print-title">
            <p class="eyebrow">${d(e||"Official Print")}</p>
            <h2>${d(b)}</h2>
            ${c?`<p>${d(c)}</p>`:""}
          </section>
          ${f||""}
          <section class="print-body">${g}</section>
          <footer class="print-footer">
            <span>${d(r||"Generated from TOTTECH ONE")}</span>
            <span>Powered by TOTTECH ONE</span>
          </footer>
          ${h||""}
        </main>
      </body>
    </html>
  `}({branding:r,title:a,subtitle:g,documentLabel:h,metaHtml:i,bodyHtml:j,footerHtml:k,pageSize:m,verificationUrl:n,barcodeValue:o,qrDataUrl:s})),q.document.close(),q.focus(),window.setTimeout(()=>{q.print()},250)}function d(a){return a.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;")}async function e(){try{let a=await fetch("/api/my-school-branding",{cache:"no-store"});if(!a.ok)throw Error("Branding unavailable");return await a.json()}catch{return{schoolName:"TOTTECH ONE",schoolCode:"Gateway To Learning",logoUrl:"/images/logo.png",primaryColor:"#04142E",secondaryColor:"#D4AF37"}}}async function f(b){try{return(await a.A(653920)).toDataURL(b,{errorCorrectionLevel:"M",margin:1,width:120,color:{dark:"#111111",light:"#FFFFFF"}})}catch{return null}}a.s(["printBrandedDocument",0,c,"printMetaGrid",0,function(a){return`<div class="print-meta-grid">${a.map(a=>`
        <div class="print-meta-card">
          <span>${d(a.label)}</span>
          <strong>${d(String(a.value??"-"))}</strong>
        </div>
      `).join("")}</div>`}])},653920,a=>{a.v(b=>Promise.all(["server/chunks/ssr/[externals]_qrcode_0h7j8o7._.js"].map(b=>a.l(b))).then(()=>b(941287)))}];

//# sourceMappingURL=%5Broot-of-the-server%5D__0x7kol7._.js.map