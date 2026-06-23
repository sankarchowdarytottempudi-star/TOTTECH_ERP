# Root Cause Analysis

## Cluster 1: React Error #418 on `/ptm`, `/communication`, `/communication/feedback`

The crash cluster came from shared shell components that read `localStorage` during the initial render:

- `components/Header.tsx`
- `components/Sidebar.tsx`
- `components/clinical/ClinicalShell.tsx`

That pattern is unsafe in React/Next hydration because the server render cannot see the browser state, while the client render can. When the initial markup diverges, React reports hydration failure as minified error #418 in production.

### Why it surfaced on these routes

These routes use the shared `Layout` shell. The page bodies themselves were simple, but the wrapper was enough to trigger the mismatch.

### Fix applied

- Moved stored-user reads out of the initial render and into `useEffect()`
- Kept the first render deterministic and browser-agnostic
- Preserved the user display update after hydration

## Cluster 2: Repeated `ERR_ABORTED` RSC requests across analytics and command-center links

The shared navigation layers were using default `next/link` prefetch behavior in dense menus:

- `components/Sidebar.tsx`
- `components/finance/FinanceModuleNav.tsx`
- `components/clinical/ClinicalShell.tsx`

That creates a lot of background RSC traffic in a large app shell. During route changes, those speculative requests get aborted, which showed up repeatedly in the audit as `net::ERR_ABORTED`.

### Fix applied

- Disabled prefetch on shared navigation links in the high-volume shells
- Reduced unnecessary background RSC traffic from sidebar and module navigation

## Cluster 3: Sidebar visibility / focus on nested menus

The sidebar already had pathname-based open-state logic, but the pages needed a consistent mount-time state and less noisy navigation traffic to make the active section reliably visible.

### Fix applied

- Kept route-based open state for communication / finance / HR / operations groups
- Preserved auto-scroll to the active item after route changes

