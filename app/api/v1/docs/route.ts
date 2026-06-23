import { NextResponse } from "next/server";

import { requireClinicalContext } from "@/lib/clinical/context";
import { buildClinicalOpenApiSpec } from "@/lib/clinical/openapi-spec";

export async function GET(request: Request) {
  const auth =
    await requireClinicalContext(request);

  if (auth.response) {
    return auth.response;
  }

  const spec =
    await buildClinicalOpenApiSpec(
      auth.context!
    );
  const apiCount = Object.values(
    spec.paths
  ).reduce(
    (total, operations) =>
      total + Object.keys(operations).length,
    0
  );

  return new NextResponse(
    `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>TOTTECH Clinical Services API Docs</title>
    <style>
      body { margin: 0; font-family: Inter, Arial, sans-serif; background: #f5f8fb; color: #0B1F3A; }
      main { max-width: 1040px; margin: 0 auto; padding: 48px 20px; }
      .hero { background: #0B1F3A; color: white; border: 1px solid #D4AF37; border-radius: 8px; padding: 32px; }
      .eyebrow { color: #D4AF37; font-size: 12px; font-weight: 900; letter-spacing: .14em; text-transform: uppercase; }
      h1 { margin: 10px 0 0; font-size: 42px; line-height: 1.05; }
      p { font-size: 15px; line-height: 1.7; font-weight: 700; }
      .grid { display: grid; gap: 16px; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); margin-top: 20px; }
      .card { background: white; border: 1px solid #d8e2ef; border-radius: 8px; padding: 20px; box-shadow: 0 12px 30px rgba(15, 23, 42, .08); }
      .value { font-size: 36px; font-weight: 900; }
      a { color: #8a6500; font-weight: 900; }
    </style>
  </head>
  <body>
    <main>
      <section class="hero">
        <div class="eyebrow">OpenAPI 3.1</div>
        <h1>TOTTECH Clinical Services API Gateway</h1>
        <p>Protected API contract index generated from the Phase 14 catalog for the active tenant, hospital, and branch.</p>
      </section>
      <section class="grid">
        <article class="card">
          <div class="eyebrow">REST Contracts</div>
          <div class="value">${apiCount}</div>
          <p>Generated from the database-backed REST endpoint catalog.</p>
        </article>
        <article class="card">
          <div class="eyebrow">JSON Spec</div>
          <p><a href="/api/v1/openapi.json">Open /api/v1/openapi.json</a></p>
        </article>
        <article class="card">
          <div class="eyebrow">YAML Spec</div>
          <p><a href="/api/v1/openapi.yaml">Open /api/v1/openapi.yaml</a></p>
        </article>
        <article class="card">
          <div class="eyebrow">Clinical Catalog</div>
          <p><a href="/clinical-services/api-catalog">Open API Catalog Command Center</a></p>
        </article>
      </section>
    </main>
  </body>
</html>`,
    {
      headers: {
        "content-type":
          "text/html; charset=utf-8",
      },
    }
  );
}
