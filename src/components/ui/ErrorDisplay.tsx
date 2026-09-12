import { AlertTriangle } from "lucide-react";

interface ErrorDisplayProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorDisplay({
  message = "Une erreur inattendue s'est produite lors du chargement des données.",
  onRetry,
}: ErrorDisplayProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "4rem 2rem",
        textAlign: "center",
        background: "#fff",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius)",
        boxShadow: "0 2px 10px rgba(0,0,0,0.02)",
      }}
    >
      <div
        style={{
          background: "oklch(0.97 0.02 27)",
          color: "var(--destructive)",
          padding: "1rem",
          borderRadius: "50%",
          marginBottom: "1.5rem",
        }}
      >
        <AlertTriangle size={32} />
      </div>
      <h2
        style={{
          fontSize: "1.25rem",
          fontWeight: 700,
          margin: "0 0 0.75rem",
          color: "var(--foreground)",
        }}
      >
        Oups, un problème est survenu
      </h2>
      <p
        style={{
          color: "var(--muted-foreground)",
          margin: "0 0 2rem",
          maxWidth: "400px",
          lineHeight: 1.5,
        }}
      >
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          style={{
            padding: "0.6rem 1.25rem",
            background: "var(--primary)",
            color: "#fff",
            border: "none",
            borderRadius: "var(--radius)",
            fontWeight: 600,
            cursor: "pointer",
            transition: "opacity 0.2s",
          }}
        >
          Réessayer
        </button>
      )}
    </div>
  );
}
