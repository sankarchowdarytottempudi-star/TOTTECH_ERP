import Link from "next/link";

export default function Widget({
  title,
  children,
  href,
}: any) {
  const content = (
    <div className="tt-card tt-card-pad h-full transition-all hover:border-amber-300 hover:shadow-xl">

      <h2
        className="
          text-lg
          font-black
          mb-4
          text-slate-950
        "
      >
        {title}
      </h2>

      {children}

    </div>
  );

  if (!href) {
    return content;
  }

  return (
    <Link
      href={href}
      className="block h-full cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
      aria-label={`Open ${title}`}
    >
      {content}
    </Link>
  );

}
