# Pharmacy and Lab UAT Smoke Report

Generated: 2026-06-20T19:47:44.979Z

## Findings

- **login**: PASS — Clinical Services super admin login succeeded.
- **pharmacy-medicines**: PASS — {"medicine_code":"MED-1781984800222","brand_name":"UAT Brand UAT MED-1781984769839"}
- **pharmacy-sales**: PASS — Created pharmacy sale for patient Go Live.
- **lab**: PASS — {"id":97,"order_uid":"LAB-1781984864007-4210","sample_number":"SMP-LAB-1781984863112","result_value":"Slightly elevated","status":"ORDERED"}
- **persistence**: PASS — Browser reload retained the module pages and records remained visible.

## Evidence

Screenshots:

- /opt/tottech-one/uat-evidence/pharmacy-lab-2026-06-20T19-46-07-766Z/screenshots/lab-open.png
- /opt/tottech-one/uat-evidence/pharmacy-lab-2026-06-20T19-46-07-766Z/screenshots/lab-record-created.png
- /opt/tottech-one/uat-evidence/pharmacy-lab-2026-06-20T19-46-07-766Z/screenshots/lab-record-edited.png
- /opt/tottech-one/uat-evidence/pharmacy-lab-2026-06-20T19-46-07-766Z/screenshots/lab-record-searched.png
- /opt/tottech-one/uat-evidence/pharmacy-lab-2026-06-20T19-46-07-766Z/screenshots/pharmacy-medicine-created.png
- /opt/tottech-one/uat-evidence/pharmacy-lab-2026-06-20T19-46-07-766Z/screenshots/pharmacy-medicine-edited.png
- /opt/tottech-one/uat-evidence/pharmacy-lab-2026-06-20T19-46-07-766Z/screenshots/pharmacy-medicine-searched.png
- /opt/tottech-one/uat-evidence/pharmacy-lab-2026-06-20T19-46-07-766Z/screenshots/pharmacy-medicines-open.png
- /opt/tottech-one/uat-evidence/pharmacy-lab-2026-06-20T19-46-07-766Z/screenshots/pharmacy-sale-created.png
- /opt/tottech-one/uat-evidence/pharmacy-lab-2026-06-20T19-46-07-766Z/screenshots/pharmacy-sales-open.png
- /opt/tottech-one/uat-evidence/pharmacy-lab-2026-06-20T19-46-07-766Z/screenshots/post-reload.png

## Notes

This smoke run proves the browser workflows for the validated paths, but it does not certify the full standalone product scope requested in the brief (for example, customer master / supplier payments / home collection / doctor approval paths still need dedicated coverage if they are part of the final certification matrix).
