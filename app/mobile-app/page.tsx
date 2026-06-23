import Layout from "@/components/Layout";

export default function MobileAppPage() {
  return (
    <Layout>
      <main className="mx-auto max-w-7xl px-6 py-8">
        <h1 className="text-2xl font-bold text-slate-950">
          Mobile App Recovery
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
          Latest APK evidence is app-release (3).apk. Rebuilt React Native
          source is stored under the mobile workspace for a new Android build.
        </p>
        <div className="mt-6 rounded-lg border border-slate-200 bg-white p-5">
          <div className="text-sm font-semibold text-slate-900">
            Target modules
          </div>
          <div className="mt-2 text-sm leading-6 text-slate-600">
            Students, Teachers, Attendance, Finance, Transport, Hostel,
            Dining, War Room, Automation, Governance, Parent Portal,
            SchoolGPT, Notifications, and User Management.
          </div>
        </div>
      </main>
    </Layout>
  );
}
