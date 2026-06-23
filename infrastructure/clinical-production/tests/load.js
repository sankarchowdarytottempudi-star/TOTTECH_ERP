import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  scenarios: {
    clinical_readiness: {
      executor: "ramping-vus",
      stages: [
        { duration: "2m", target: 100 },
        { duration: "5m", target: 500 },
        { duration: "2m", target: 0 },
      ],
    },
  },
  thresholds: {
    http_req_failed: ["rate<0.02"],
    http_req_duration: ["p(95)<750"],
  },
};

const baseUrl =
  __ENV.BASE_URL || "https://clinical.tottechsolutions.com";

export default function () {
  const pages = [
    "/login",
    "/clinical-services",
    "/clinical-services/production",
    "/clinical-services/uiux",
  ];

  for (const page of pages) {
    const response = http.get(`${baseUrl}${page}`);
    check(response, {
      "response is not server error": (r) =>
        r.status < 500,
    });
    sleep(1);
  }
}
