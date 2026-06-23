# Transfer Certificate PDF Fix Report

## Root Cause

The transfer certificate PDF was being generated and stored correctly under `public/uploads/students/certificates/`, and the database was already storing the matching public path (`/uploads/students/certificates/...`).

The production architecture did not have an explicit Next.js route dedicated to serving student certificate PDFs from disk. Student certificates depended only on the runtime/public file handling path. I added a dedicated route so `/uploads/students/certificates/[file]` is always served directly from the filesystem.

## Files Modified

- `app/uploads/students/certificates/[file]/route.ts`

## What Was Verified

### 1. PDF generation executed

The application already generates transfer certificate PDFs through:

- `lib/student-certificate-service.ts`

### 2. PDF physically created

Verified file on disk:

- `/opt/tottech-one/public/uploads/students/certificates/transfer-certificate-KVSES-TC-002-26.pdf`

### 3. Database path stored correctly

Verified database row:

- `student_documents.file_url = /uploads/students/certificates/transfer-certificate-KVSES-TC-002-26.pdf`

### 4. Public URL generated correctly

Verified public URL:

- `https://erp.tottechsolutions.com/uploads/students/certificates/transfer-certificate-KVSES-TC-002-26.pdf`

### 5. Next.js static serving configured

Verified new explicit route:

- `app/uploads/students/certificates/[file]/route.ts`

This route streams the PDF from:

- `process.cwd()/public/uploads/students/certificates`

### 6. Nginx serving configured

The production site proxies the application to Next.js through nginx, and the certificate URL now returns the PDF successfully after deployment.

## Physical File Path

- `/opt/tottech-one/public/uploads/students/certificates/transfer-certificate-KVSES-TC-002-26.pdf`
- `/opt/tottech-one/public/uploads/students/certificates/transfer-certificate-KVSES-TC-001-26.pdf`

## Public URL

- `/uploads/students/certificates/transfer-certificate-KVSES-TC-002-26.pdf`

Full URL:

- `https://erp.tottechsolutions.com/uploads/students/certificates/transfer-certificate-KVSES-TC-002-26.pdf`

## Validation Evidence

### File existence

```bash
$ ls -l /opt/tottech-one/public/uploads/students/certificates
-rw-r--r-- 1 root root 4339 Jun 20 08:45 transfer-certificate-KVSES-TC-001-26.pdf
-rw-r--r-- 1 root root 4345 Jun 20 08:45 transfer-certificate-KVSES-TC-002-26.pdf
```

### Database evidence

```text
2|TRANSFER_CERTIFICATE|KVSES-TC-002/26|/uploads/students/certificates/transfer-certificate-KVSES-TC-002-26.pdf
1|TRANSFER_CERTIFICATE|KVSES-TC-001/26|/uploads/students/certificates/transfer-certificate-KVSES-TC-001-26.pdf
```

### HTTP evidence

```bash
$ curl -I -s https://erp.tottechsolutions.com/uploads/students/certificates/transfer-certificate-KVSES-TC-002-26.pdf
HTTP/1.1 200 OK
Content-Type: application/pdf
Content-Length: 4345
```

### Deployment evidence

- `npm run build` completed successfully.
- `pm2 restart tottech-one --update-env` completed successfully.
- `pm2 status tottech-one` returned `online`.

## Screenshot Evidence

Browser verification shows the certificate PDF URL now opens successfully from the public `/uploads/students/certificates/` path.

## Notes

- Transfer and study certificates both use the same storage helper and the same public URL pattern.
- The fix keeps the architecture aligned with `public/uploads/...` storage while making delivery explicit and reliable.
