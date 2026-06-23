export default function Custom500() {
  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#f3f6fb", color: "#04142E", padding: "24px" }}>
      <section style={{ maxWidth: 640, width: "100%", background: "#fff", border: "1px solid #dbe3ef", borderRadius: 8, boxShadow: "0 18px 40px rgba(15, 23, 42, 0.12)", padding: 32 }}>
        <p style={{ fontSize: 12, fontWeight: 900, letterSpacing: "0.18em", textTransform: "uppercase", color: "#8a6500" }}>TOTTECH ONE</p>
        <h1 style={{ marginTop: 12, fontSize: 32, fontWeight: 900 }}>Internal Server Error</h1>
        <p style={{ marginTop: 12, fontSize: 16, lineHeight: 1.7, fontWeight: 600, color: "#475569" }}>
          The application hit an unexpected error. Please refresh the page or try again after a moment.
        </p>
      </section>
    </main>
  );
}
