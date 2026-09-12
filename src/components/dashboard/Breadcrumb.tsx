import Link from "next/link";

type Crumb = { label: string; href?: string };

export default function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.4rem",
        marginBottom: "1.5rem",
        flexWrap: "wrap",
      }}
    >
      <Link
        href="/tableau-de-bord"
        style={{
          color: "var(--muted-foreground)",
          fontSize: "0.85rem",
          textDecoration: "none",
          fontWeight: 500,
        }}
      >
        Accueil
      </Link>
      {items.map((item, i) => (
        <span key={i} style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            style={{ color: "var(--muted-foreground)", flexShrink: 0 }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m9 18 6-6-6-6" />
          </svg>
          {item.href && i < items.length - 1 ? (
            <Link
              href={item.href}
              style={{
                color: "var(--muted-foreground)",
                fontSize: "0.85rem",
                textDecoration: "none",
                fontWeight: 500,
              }}
            >
              {item.label}
            </Link>
          ) : (
            <span style={{ color: "var(--foreground)", fontSize: "0.85rem", fontWeight: 700 }}>
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}
