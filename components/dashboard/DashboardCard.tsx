import Link from "next/link";

export default function DashboardCard({
  title,
  value,
  icon,
  href,
  color: _color,
}: any) {
  return (
    <Link href={href}>
      <div className="tt-card tt-card-pad cursor-pointer transition-all hover:border-amber-300 hover:shadow-xl">
        <div className="flex items-center justify-between gap-4">

          <div className="min-w-0">

            <div className="tt-card-title">
              {title}
            </div>

            <div className="tt-card-value mt-3">
              {value}
            </div>

          </div>

          <div className="tt-icon-box text-xl">
            {icon}
          </div>

        </div>
      </div>
    </Link>
  );
}
